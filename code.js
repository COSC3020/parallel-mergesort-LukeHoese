function parallelMS(arr, done) {
    const fileSync = require('tmp').fileSync;
    const writeFileSync = require('fs').writeFileSync;
    const fork = require('child_process').fork;

    function createWorker(fn) {
      const tmpobj = fileSync({ tmpdir: "." });
      writeFileSync(tmpobj.name,
          `process.on('message', function(m) {` +
          `${fn.toString()}` +
          `parallelMS(m[0], m[1]);});`);
    
      return fork(tmpobj.name);
    }
    
    // all we need is a function to merge two sorted arrays, rest is handled in parallel part
    function mergeSorted(leftSort, rightSort) {
        let merged = [];
        let left = 0, right = 0;

        // run for as long as their are unprocessed elements in either array
        while (left < leftSort.length || right < rightSort.length) {
            // if theres elements in left array, and unchecked elements in right, check which element is smaller and push accoringly
            if (left < leftSort.length && (right >= rightSort.length || leftSort[left] < rightSort[right])) {
                merged.push(leftSort[left]);
                left++;
            } else if (right < rightSort.length) {
                merged.push(rightSort[right]);
                right++;
            }
        }

        // return our merged array
        return merged;
    }

    // Base case, array of size 1, is sent
    const thresh = 1;
    if(arr.length <= thresh) {
        if(done === undefined) process.send(arr);
        else done(arr);
        return;
    }
  
    // added math.floor in attempt to fix undefined length issue
    let left = arr.slice(0, Math.floor(arr.length/2));
    let right = arr.slice(Math.floor(arr.length/2), arr.length);
  
    // split result into two variables to track left and right sorted arrays (chatGPT assisted)
    let leftResult = null;
    let rightResult = null;
    // add variables to track when left and right workers finish
    let leftDone = false;
    let rightDone = false;

    let leftWorker = createWorker(parallelMS);
  
    leftWorker.on("message", function(leftSort) {
      console.log("Left worker: " + leftSort);
      // store our result for left worker
      leftResult = leftSort;
      // set left worker to done
      leftDone = true;

      // here check if both workers have finsihed
      if(leftDone && rightDone) {
        // if both workers are done, merge their sorted arrays
        let merged = mergeSorted(leftResult, rightResult)
        // return our merged array
        if (done === undefined) process.send(merged);
        else done(merged);
      }
      leftWorker.kill();
    }).send([left]);

    // essentially same as on left, just using main thread
    parallelMS(right, function(rightSort) {
      console.log("Right worker: " + rightSort);
      rightResult = rightSort;
      rightDone = true;

      if(leftDone && rightDone) {
        let merged = mergeSorted(leftResult, rightResult)
        if (done === undefined) process.send(merged);
        else done(merged);
      }
    });
}
  
parallelMS([3,5,9,3,4,6,7,2,1,8,3,3,5,2,3,9], console.log);
