---
layout: post
title:  "Auto-scaling Buildkite CI build agents for RSpec (run parallel jobs in minutes instead of hours)"
date:   2021-03-16 08:00:00 +0100
author: "Artur Trzop"
categories: continuous_integration
og_image: "/images/blog/posts/auto-scaling-buildkite-ci-build-agents-for-rspec-run-parallel-jobs-in-minutes-instead-of-hours/buildkite-rspec.jpeg"
---

If your RSpec test suite runs for hours, you could shorten that to just minutes with parallel jobs using Buildkite agents. You will learn how to run parallel tests in optimal CI build time for your Ruby on Rails project. I will also show you a few useful things for Buildkite CI like:

<img src="/images/blog/posts/auto-scaling-buildkite-ci-build-agents-for-rspec-run-parallel-jobs-in-minutes-instead-of-hours/buildkite-rspec.jpeg" style="width:300px;margin-left: 15px;float:right;" alt="Buildkite, CI, RSpec, testing, Ruby" />

* A real RSpec test suite taking 13 hours and 32 minutes executed in only 5 minutes 20 seconds by using 151 parallel Buildkite agents with [knapsack_pro Ruby gem](/knapsack_pro-ruby/guide/).
* How to distribute test files between parallel jobs using Queue Mode in [Knapsack Pro](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=auto-scaling-buildkite-ci-build-agents-for-rspec-run-parallel-jobs-in-minutes-instead-of-hours) to utilize CI machines optimally.
* A simple example of CI Buildkite parallelism config.
* An advanced example of Buildkite config with Elastic CI Stack for AWS.
* Why you might want to use AWS Spot Instances
* How to automatically split slow RSpec test files by test examples (test cases) between parallel Buildkite agents

## A real RSpec test suite taking 13 hours and executed in only 5 minutes

I'd like to show you the results from a real project for running RSpec parallel tests. The project we are looking at here is huge and its RSpec tests run time is 13 hours and 32 minutes. It's super slow. You can imagine creating a git commit and waiting 13 hours to find out the next day that your code breaks something else in the project. You can't work like that!

The solution for this is to run tests in parallel on many CI machines using Buildkite agents. Each CI machine has a Buildkite agent installed that will run a chunk of the RSpec test suite. Below you can see an example of running ~13 hours test suite across 151 parallel Buildkite agents.
This allows running the whole RSpec test suite in just 5 minutes 20 seconds!

<img src="/images/blog/posts/auto-scaling-buildkite-ci-build-agents-for-rspec-run-parallel-jobs-in-minutes-instead-of-hours/151-parallel-nodes.png" alt="parallel machines, parallel jobs, Buildkite, Knapsack Pro, tests, RSpec" />

The above graph comes from the Knapsack Pro [user dashboard](https://knapsackpro.com/dashboard?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=auto-scaling-buildkite-ci-build-agents-for-rspec-run-parallel-jobs-in-minutes-instead-of-hours). 151 parallel jobs are a lot of machines. It would take the whole screen to show you 151 bars. You can only see the last few bars on the graph. The bars are showing how the RSpec test files were split between parallel machines.

You can see that each parallel machine finishes work at a similar time. The right edges of all of the bars are pretty close to each other. This is the important part. You want to ensure the RSpec work is distributed evenly between parallel jobs. This way you can avoid a bottleneck - a slow job running too many test files. I'll show you how to do it.

## How to distribute test files between parallel jobs using Queue Mode in Knapsack Pro to utilize CI machines optimally

To run CI build as fast as possible we need to utilize our available resources as much as we can. This means the work of running RSpec tests should be split between parallel machines evenly.

The bigger the test suite, the longer it takes to run it and more edge cases can happen when you split running tests among many machines in the network. Some of the possible edge cases:

* some of the test files take longer than others to run (for instance E2E test files)
* some of the test cases fail and run quicker, some don't and run longer. This affects the overall time spent by the CI machine on running your tests.
* some of the test cases take longer because they must connect with network/external API etc - this adds uncertainty to their execution time
* some of the parallel machines spend more time on boot time
  * installing Ruby gems takes longer
  * loading Ruby gems from cache is slow
  * or simply the CI provider has not started your job yet
  * or maybe you have not enough available machines in the pool of available agents

Multiple things can disrupt the spread of work between parallel nodes.

Our ultimate goal is to ensure all machines finish work at a similar time because this means every machine received a workload that was suitable to its available capabilities. This means that, if a machine started work very late it will run only a small part of the tests. If another machine started work very early it will run more tests. This will even out the ending time between parallel machines. All this is possible thanks to Queue Mode in knapsack_pro Ruby gem, it will take care of running tests in parallel for you. [Queue Mode splits test files dynamically between parallel jobs to ensure the jobs completes at the same time](/2020/how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation).

You can see an example of running a small RSpec test suite across 2 parallel Buildkite agents for the Ruby on Rails project.

<iframe width="560" height="315" src="https://www.youtube.com/embed/2Pp9icUJVIg" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## A simple example of CI Buildkite parallelism config

Here is a very simple example of Buildkite config to run 2 parallel jobs as you can see on the screenshot.

<img src="/images/blog/posts/auto-scaling-buildkite-ci-build-agents-for-rspec-run-parallel-jobs-in-minutes-instead-of-hours/buildkite-parallel-rspec.png" alt="Buildkite parallel RSpec agents" />

{% highlight yml %}
# .buildkite/pipeline.yml
env:
  # You should hide you secrets like API token
  # Please follow https://buildkite.com/docs/pipelines/secrets
  KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC: "204abb31f698a6686120a40efeff31e5"
  # allow to run the same set of test files on job retry
  # https://github.com/KnapsackPro/knapsack_pro-ruby#knapsack_pro_fixed_queue_split-remember-queue-split-on-retry-ci-node
  KNAPSACK_PRO_FIXED_QUEUE_SPLIT: true

steps:
  - command: "bundle exec rake knapsack_pro:queue:rspec"
    parallelism: 2
{% endhighlight %}

Please note that you should hide your credentials like the Knapsack Pro API token and not commit it into your repository. You can refer to the [Buildkite secrets documentation](https://buildkite.com/docs/pipelines/secrets).

## An advanced Buildkite config with Elastic CI Stack for AWS

When you want to run your big RSpec project on dozen or even hundreds of parallel machines you need powerful resources.  In such a case, you can follow the [Buildkite tutorial about AWS setup](https://buildkite.com/docs/tutorials/elastic-ci-stack-aws). The Elastic CI Stack for AWS gives you a private, autoscaling Buildkite Agent cluster in your own AWS account.

### AWS Spot Instances can save you money

AWS offers Spot Instances. These machines are cheap but they can be withdrawn by AWS at any time. This means that you can run cheap machines for your CI but from time to time the AWS may kill one of your parallel machines. Such a scenario can be handled by the [Knapsack Pro](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=auto-scaling-buildkite-ci-build-agents-for-rspec-run-parallel-jobs-in-minutes-instead-of-hours). It remembers the set of test files allocated to the AWS machine that was running the tests. When the machine is withdrawn and later on retried by the Buildkite retry feature then the proper test files will be executed as you would expect.

### Buildkite retry feature

Buildkite config allows for [automatic retry of your job](https://buildkite.com/docs/pipelines/command-step#automatic-retry-attributes). This can be helpful when you use AWS Spot Instances.
When AWS shuts down your machine during test runtime due to withdrawal then Buildkite can automatically run a new job on a new machine.

Another use case for the automatic retry is when you have [flaky Ruby tests](/2021/fix-intermittently-failing-ci-builds-flaky-tests-rspec) that sometimes pass green or fail red. You can use Buildkite to retry the failing job in such a case.

My recommendation is to use [rspec-retry gem](https://knapsackpro.com/faq/question/how-to-retry-failed-tests-flaky-tests) first and after that relay on the [Buildkite retry feature](https://buildkite.com/docs/pipelines/command-step#automatic-retry-attributes). RSpec-retry gem will retry only failing test cases instead of all test files assigned to the parallel machine.

## How to automatically split large slow RSpec test files by test examples (test cases) between parallel Buildkite agents

Slow RSpec test files are often related to E2E tests, the browser tests like capybara feature specs. They can run for a few or dozens of minutes sometimes. They could become a bottleneck if the parallel job has to run a single test file for 10 minutes while other parallel jobs complete a few smaller test files in 5 minutes.

There is a solution for that! You can use Knapsack Pro with [RSpec split by examples feature](https://knapsackpro.com/faq/question/how-to-split-slow-rspec-test-files-by-test-examples-by-individual-it) that will automatically detect slow RSpec test files in your project and split them between parallel Buildkite agents by test examples (test cases).

## Summary

<img src="/images/blog/posts/auto-balancing-7-hours-tests-between-100-parallel-jobs-on-ci-buildkite-example/buildkite.jpg" style="width:250px;float:right;" alt="Buildkite" />

As you can see, Buildkite is a powerful CI with cloud infrastructures like AWS and an optimal split of test files using Knapsack Pro.
With [Knapsack Pro](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=auto-scaling-buildkite-ci-build-agents-for-rspec-run-parallel-jobs-in-minutes-instead-of-hours) you can achieve great results and super fast CI builds. Feel free to [try it](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=auto-scaling-buildkite-ci-build-agents-for-rspec-run-parallel-jobs-in-minutes-instead-of-hours) and join other happy Buildkite users.

### Related articles

If you are looking for a Docker config you can also see repository examples at the end of the article: [Auto balancing 7 hours tests between 100 parallel jobs on Buildkite CI](/2017/auto-balancing-7-hours-tests-between-100-parallel-jobs-on-ci-buildkite-example).
