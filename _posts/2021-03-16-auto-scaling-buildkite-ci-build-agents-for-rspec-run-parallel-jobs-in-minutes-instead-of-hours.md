---
layout: post
title:  "Auto-scaling Buildkite CI build agents for RSpec (run parallel jobs in minutes instead of hours)"
date:   2021-03-16 08:00:00 +0100
author: "Artur Trzop"
categories: continuous_integration
og_image: "/images/blog/posts/auto-scaling-buildkite-ci-build-agents-for-rspec-run-parallel-jobs-in-minutes-instead-of-hours/buildkite-rspec.jpeg"
---

If your RSpec test suite runs for hours then you could execute all your tests just in minutes with parallel jobs using Buildkite agents. You will learn how to run parallel tests in optimal CI build time for your Ruby on Rails project. I will show you also a few useful things for Buildkite CI like:

<img src="/images/blog/posts/auto-scaling-buildkite-ci-build-agents-for-rspec-run-parallel-jobs-in-minutes-instead-of-hours/buildkite-rspec.jpeg" style="width:200px;margin-left: 15px;float:right;" alt="Buildkite, CI, RSpec, testing, Ruby" />

* A real RSpec test suite taking 13 hours and 32 minutes executed in only 5 minutes 20 seconds by using 151 parallel Buildkite agents with knapsack_pro Ruby gem.
* How to distribute test files between parallel jobs using Queue Mode in Knapsack Pro to utilize CI machines optimally.
* A simple example of CI Buildkite config parallelism.
* An advanced example of Buildkite config with Elastic CI Stack for AWS.
* How to use AWS Spot Instances to save money on CI infrastructure
* How to automatically split large slow RSpec test files by test examples (test cases) between parallel Buildkite agents

## A real RSpec test suite taking 13 hours and executed in only 5 minutes

I'd like to show you the real project results of running parallel tests for RSpec. There is a huge Ruby on Rails project and its RSpec tests run time is 13 hours and 32 minutes. It's super slow. You can imagine creating a git commit and waiting 13 hours to find out the next day that your code breaks something else in the project. You can't work like that!

The solution for this is to run tests in parallel on many CI machines using Buildkite agents. Each CI machine has installed the Buildkite agent that will run a chunk of the RSpec test suite. Below you can see an example of running ~13 hours test suite across 151 parallel Buildkite agents.
This allows running the whole RSpec test suite for only 5 minutes 20 seconds!

<img src="/images/blog/posts/auto-scaling-buildkite-ci-build-agents-for-rspec-run-parallel-jobs-in-minutes-instead-of-hours/151-parallel-nodes.png" alt="parallel machines, parallel jobs, Buildkite, Knapsack Pro, tests, RSpec" />

This is a lot of parallel jobs running the tests so it would take the whole screen to show you 151 machines. You can see the last few bars on the graph showing how the RSpec test files were split between parallel machines.

You can see that each parallel machine finishes work at a similar time. The right side of the bar is ending close to each other. This is the important part. You want to ensure the RSpec work is distributed evenly between parallel jobs. This way you can avoid bottleneck - a slow job running too many test files. I'll show you how to do it.
