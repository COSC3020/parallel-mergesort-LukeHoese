# Parallel Mergesort

Implement a parallel version of mergesort (both the original recursive and the
iterative in-place version from a previous exercise are fine). You may use any
parallelization framework or method.

I have not provided any test code, but you can base yours on test code from
other exercises. Your tests must check the correctness of the result of running
the function and run automatically when you commit through a GitHub action.

My approach for completing this assignment was to take the mergesort and the parallel count codes from the slides and try to frankenstein them together. It took a ton of debugging and this was my first time doing parallel programming so even now it's a bit over my head. I ended up having to build a different merge function because I was having issues with the original loops trying to compute and undefined length. Most of the parallel structure was retained from your example code and I commented wherever changes were made. The later stage debugging (issues with parallelization) were assisted by chatGPT. Code is marked accordingly.

I do not know how to get my test code to work. When I tried to run your example code from the slides I was told I needed to install "tmp". I went on the internet and did that and it got things to run fine on my own PC. Now github is saying the same thing and I don't know how to fix it.

I certify that I have listed all sources used to complete this exercise, including the use of any Large Language Models. All of the work is my own, except where stated otherwise. I am aware that plagiarism carries severe penalties and that if plagiarism is suspected, charges may be filed against me without prior notice.

## Runtime Analysis

What is the span of the parallel program, in terms of worst-case $\Theta$? Hint:
It may help to consider the DAG of the parallel program.

From my understanding span is the longest path on the DAG, aka the longest length of parallel calls that have to wait on the previous call to be completed. It is similar in structure to a recursion tree for this problem. We are splitting our data in half at each point, giving us a depth, and thus worst case span for our parallel program, of $\Theta$(log(n))
