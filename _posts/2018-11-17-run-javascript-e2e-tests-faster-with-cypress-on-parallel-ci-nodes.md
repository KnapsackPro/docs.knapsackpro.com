---
layout: post
title:  "Run javascript E2E tests faster with Cypress on parallel CI nodes"
date:   2018-11-17 19:00:00 +0100
author: "Artur Trzop"
categories: continuous_integration cypress javascript parallelisation CI
og_image: "/images/blog/posts/run-javascript-e2e-tests-faster-with-cypress-on-parallel-ci-nodes/cypress-logo.jpg"
---

Cypress test runner is a great alternative to Selenium in end-to-end testing space. When it comes to E2E tests they tend to grow with time and running them is slow and becomes time wasting or just coffee break for developers. ;)

<img src="/images/blog/posts/run-javascript-e2e-tests-faster-with-cypress-on-parallel-ci-nodes/cypress-logo.jpg" style="width:450px;margin-left: 15px;float:right;" alt="Cypress.io" />

To save the time and give quick feedback to developers about CI builds passing or not we could run tests across parallel CI nodes. Many [CI providers](https://knapsackpro.com/ci_servers/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=run-javascript-e2e-tests-faster-with-cypress-on-parallel-ci-nodes) allow you to set up how many parallel machines can be run within your CI build.

## Problem with splitting tests on parallel machines

If you want to run your test suite on multiple CI nodes at the same time you need to decide which test file goes to particular CI nodes.

In a perfect scenario, we would like to run each parallel CI machine equal time. Thanks to that we won't have to wait for slow CI node that runs too many tests and is the bottleneck for the whole CI build to complete.

The test suite is a living animal, there are constant changes in it, new tests are added or removed. The time of running particular tests can change and sometimes even be random when for instance your tests need to wait for some data to be loaded from external API.

Even CI provider can cause an additional problem. Sometimes boot time of your parallel CI nodes can vary. One CI node starts work later than the others or maybe it's stuck in the queue due running some other CI build in your organization account.

Some of [CI solutions](https://knapsackpro.com/ci_servers/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=run-javascript-e2e-tests-faster-with-cypress-on-parallel-ci-nodes) allows you to use a big amount of parallel CI nodes to speed up your tests by leveraging your own server infrastructure like AWS with very cheap preeemted resources - Amazon EC2 Spot Instances (in case of Google, you have Google Cloud Preemptible VMs). The downside of this is when the AWS or Google wants to take away from your the server during the running your tests. Suddenly you lose one of your parallel CI nodes and you have to retry it and it becomes your bottleneck.

## How to allocate tests in a dynamic way across parallel CI nodes to save time?

I've been working on the parallelization problem for last few years. With help and feedback from many people, we came up with a solution that helps us speed up our test suite thanks to [allocating tests across parallel CI nodes in a dynamic way](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=run-javascript-e2e-tests-faster-with-cypress-on-parallel-ci-nodes).

Basically, [Knapsack Pro](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=run-javascript-e2e-tests-faster-with-cypress-on-parallel-ci-nodes) orchestrate the parallelization of your test suite. On Knapsack Pro API you have Queue of test files in descending order of test file run duration. Your parallel CI nodes connect with the Queue and fetch set of test files to run them on CI node. The Knapsack Pro API is taking care of allocating the tests in proper order and to remembering the time execution of your test files so we could leverage that in future CI build runs.

Knapsack Pro API can also remember tests assigned to each parallel CI node. When you lost one of parallel CI node during runtime due AWS or Google preempting your machine then you can just retry the killed CI node and run only those tests that were lost. The other parallel CI nodes would consume more tests from Queue before you retry killed CI node so you won't waste additional time on running tests that were not lost.

## Run Cypress tests with Knapsack Pro Queue Mode

To start running your tests faster you can add to your project the <i>@knapsack-pro/cypress</i> package. It works with many CI providers out of the box. Here you can find the [installation guide](https://docs.knapsackpro.com/cypress/guide/).

Basically, we will run a single command on all parallel CI nodes and [Knapsack Pro](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=run-javascript-e2e-tests-faster-with-cypress-on-parallel-ci-nodes) will take care of running your tests fast.

{% highlight shell %}
npx @knapsack-pro/cypress
{% endhighlight %}

In below video, I show you an example Cypress project and how to run it on parallel CI nodes.

<iframe width="560" height="315" src="https://www.youtube.com/embed/G6ixK4IK-3Y" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Hope this will help you. I'd like to hear feedback from you and exchange ideas about how we could run our tests even faster!
