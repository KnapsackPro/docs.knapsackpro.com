---
layout: post
title:  "How to run CodeShip Parallel Test Pipelines efficiently - optimal CI parallelization"
date:   2018-12-08 20:00:00 +0100
author: "Artur Trzop"
categories: CodeShip parallel pipelines CI parallelisation RSpec Ruby Javascript Cypress
og_image: "/images/blog/posts/how-to-run-codeship-parallel-test-pipelines-efficiently-optimal-ci-parallelization/codeship.jpg"
---

When you use CodeShip as your CI server you can significantly increase the speed of your CI builds with Parallel Test Pipelines. Pipelines allow you to run multiple commands at the same time, for instance, you can split test suite across a few pipelines and complete the CI build much faster.

<img src="/images/blog/posts/how-to-run-codeship-parallel-test-pipelines-efficiently-optimal-ci-parallelization/codeship.jpg" style="width:300px;margin-left: 15px;float:right;" />

## How to run parallel commands on CodeShip

### Setup via CodeShip interface

One way is to define commands via [CodeShip interface](https://documentation.codeship.com/basic/builds-and-configuration/parallel-tests/#using-parallel-test-pipelines). Once parallel test pipelines are enabled, each project can have multiple test pipelines that will be run in parallel.

In order to run CI build as fast as possible we need to ensure the parallel commands will run subset of the test suite in a way that all the commands complete at the same time to avoid slow pipeline bottleneck. To split test suite we will use [Knapsack Pro with Queue Mode which does dynamic test suite split across pipelines for Ruby and JavaScript tests](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-run-codeship-parallel-test-pipelines-efficiently-optimal-ci-parallelization) to keep running our tests in an optimal way across parallel pipelines (also known as CI nodes).

#### Example for test suite in RSpec for Ruby on Rails project

Configure test pipelines (1/2 used)

{% highlight yaml %}
# first CI node running in parallel

# RSpec tests in Knapsack Pro Queue Mode (dynamic test suite split)
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:queue:rspec
{% endhighlight %}

Configure test pipelines (2/2 used)

{% highlight yaml %}
# second CI node running in parallel

# RSpec tests in Knapsack Pro Queue Mode (dynamic test suite split)
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:queue:rspec
{% endhighlight %}

#### Example of test suite split for Cypress test runner in JavaScript

Configure test pipelines (1/2 used)

{% highlight yaml %}
# first CI node running in parallel
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 $(npm bin)/knapsack-pro-cypress
{% endhighlight %}

Configure test pipelines (2/2 used)

{% highlight yaml %}
# second CI node running in parallel
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 $(npm bin)/knapsack-pro-cypress
{% endhighlight %}

You can learn more about [Cypress test runner for E2E tests in JavaScript](/2018/run-javascript-e2e-tests-faster-with-cypress-on-parallel-ci-nodes) in this article.

### Setup via codeship-services.yml

If you use CodeShip Pro then a parallel step group is defined by using the `type: parallel` header and then nesting all steps you want to be parallelized, as seen in this example:

{% highlight yaml %}
- type: parallel
  steps:
  - service: app
    command: KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:queue:rspec
  - service: app
    command: KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:queue:rspec
{% endhighlight %}

More examples how to configure [CodeShip Pro parallelism](https://documentation.codeship.com/pro/builds-and-configuration/steps/#parallelizing-steps-and-tests)

## How dynamic test suite split works

If you would like to better understand how dynamic test suite split works and what problems it can solve check the video:

<iframe width="560" height="315" src="https://www.youtube.com/embed/hUEB1XDKEFY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Summary

Running tests in parallel is a fast way to lower time of your CI build. To make it more efficient we can split test suite in an optimal way across CI nodes with [Knapsack Pro](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-run-codeship-parallel-test-pipelines-efficiently-optimal-ci-parallelization) to keep CI nodes auto balanced and run CI build as fast as possible.
