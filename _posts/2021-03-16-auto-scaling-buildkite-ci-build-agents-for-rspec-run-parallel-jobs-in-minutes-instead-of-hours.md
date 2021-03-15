---
layout: post
title:  "Auto-scaling Buildkite CI build agents for RSpec (run parallel jobs in minutes instead of hours)"
date:   2021-03-16 08:00:00 +0100
author: "Artur Trzop"
categories: continuous_integration
og_image: "/images/blog/posts/auto-scaling-buildkite-ci-build-agents-for-rspec-run-parallel-jobs-in-minutes-instead-of-hours/buildkite-rspec.jpeg"
---

If your RSpec test suite runs for hours then you could execute all your tests just in minutes with parallel jobs using Buildkite agents. You will learn how to run parallel tests in optimal CI build time for your Ruby on Rails project. I will show you also a few useful things for Buildkite CI like:

* A real RSpec test suite taking 13 hours and 32 minutes executed in only 5 minutes 20 seconds by using 151 parallel Buildkite agents with knapsack_pro Ruby gem.
* How to distribute test files between parallel jobs using Queue Mode in Knapsack Pro to utilize CI machines optimally.
* A simple example of CI Buildkite config parallelism.
* An advanced example of Buildkite config with Elastic CI Stack for AWS.
* How to use AWS Spot Instances to save money on CI infrastructure
* How to automatically split large slow RSpec test files by test examples (test cases) between parallel Buildkite agents
