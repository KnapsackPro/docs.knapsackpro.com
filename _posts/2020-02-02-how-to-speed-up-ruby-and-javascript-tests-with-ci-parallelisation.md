---
layout: post
title:  "How to speed up Ruby and JavaScript tests with CI parallelisation"
date:   2020-02-02 16:30:00 +0100
author: "Artur Trzop"
categories: continuous_integration
og_image: "/images/blog/posts/how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation/knapsack.jpg"
---

When working on a larger project, you may struggle with the problem of an increasingly growing set of tests, which over time begins to perform slower on your continuous integration (CI) server. I had this problem while working on a project in Ruby on Rails, where RSpec tests on [CircleCI](https://knapsackpro.com/ci_servers/circle-ci?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation) took about 15 minutes.

<img src="/images/blog/posts/how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation/knapsack.jpg" style="width:200px;margin-left: 15px;float:right;" alt="knapsack, backpack, knapsack problem, knapsack pro" />

As it was bothering me, I decided to do something about it, which resulted in building an open-source Knapsack Ruby gem library (the name derives from the knapsack problem), which deals with distributing tests between parallel CI servers. In this article, you will <b>learn about two approaches to split tests on parallel [continuous integration servers](https://knapsackpro.com/ci_servers/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation) - static and dynamic</b>.

If you have in your project a test suite that takes to execute on a CI server a dozen or so minutes, or maybe even a few hours, you know how inconvenient this is for programmers. When you are working on some new feature and pushing a new git commit into the repository, you have to wait a long time for your CI server until it executes CI build.

Waiting a few minutes or an hour is delaying the feedback you can get from the CI server about tests that may have not been completed (red tests). After all, we all want to get information about whether our CI build is green or red as soon as possible so that the work of programmers is not blocked.

## Problem with running parallel tests on the CI server

To [speed up the execution of the CI build](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation), you can use parallelism on the CI server, i.e. launching several parallel CI machines (CI containers, e.g. in Docker), where each parallel server will perform a part of the test set. However, there is a problem as to which tests should be run on which servers (CI nodes) so that their distribution is fairly even and you don't have to wait for a CI node that is a bottleneck.

Below you can see an example of a non-optimal distribution of tests on 4 CI servers, where the second server marked in red is a bottleneck, so the waiting time for the completion of the entire CI build is up to 20 minutes.

<img src="/images/blog/posts/how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation/not-optimal-tests-split.png" style="width:100%;" alt="not optimal tests split on CI server, CI parallelism" />

## Optimal distribution of tests on parallel CI servers

In an ideal scenario, the tests should be distributed in such a way that all parallel CI servers end operations at a similar time. In the following part, I will show how this can be achieved.

Below you can see an example of the optimal distribution of tests, where each parallel CI machine performs tests for 10 minutes, thanks to which the entire CI build lasts only 10 minutes, not 20 as in the previous example.

<img src="/images/blog/posts/how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation/optimal-tests-split.png" style="width:100%;" alt="optimal tests split on CI server, CI parallelism" />

## Static split of tests in a deterministic way - Regular Mode

One way to determine how to divide tests between parallel machines on a CI server so that each server completes tests at a similar time is to use the measured runtime of the files in the test suite. This was the first approach I implemented in Knapsack Ruby gem.

After measuring the test execution time, we can assign individual test files between parallel CI servers to make sure that the CI build does not have a bottleneck.

With the help of the knapsack library, you can run tests for many test runners in Ruby, such as RSpec, Minitest, Cucumber, Spinach, and Turnip. Using test runtime, Knapsack gem can build a list of tests to be performed on a specific CI node.

I improved this way of dividing tests by measuring test files timing per git commit and branches. In the below video I show how Regular Mode a static split of tests in a deterministic way works in Knapsack Pro. In the next section, you will learn about some of the edge cases of this approach and how to solve it.

<iframe width="560" height="315" src="https://www.youtube.com/embed/ZEb6NeRRfQ4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Problem with the static split of tests

While collecting information from users, I found out that the distribution of tests in a static way is not always a good solution. Sometimes some tests have a random execution time, which depends, for example, on how busy the CI server is or on the fact that the test does not pass due to a software error, quitting work faster than usual, etc.

For example, tests using a browser can have fluctuations in execution runtime (tests in Capybara in Ruby or E2E tests in JavaScript).

The problem also grows depending on what CI server you use. Does each of the parallel CI machines have similar performance or does it share resources like a CPU or RAM? Does the CI container run in a shared environment? If the CI node is overloaded, then our tests may, of course, be slower.

Besides, there will be problems with whether all parallel machines start at a similar time or not. If you have purchased a pool of parallel CI servers, someone else might be using it too, e.g. another CI build from the current project or another project from your organization.

If not all CI nodes start at the same time or the boot time of certain steps in the middle of the CI node execution can take a random time, then we would like to be able to make sure that all CI machines finish their work at a similar moment. Slow CI machines or those which started work late should do fewer tests, and those machines that have started work earlier can easily do more.

All parallel CI nodes must stop working at a similar time to avoid a bottleneck, that is, overloading the machine with tests.

## Dynamic tests split - Queue Mode

The solution to the above problem is to dynamically divide tests between parallel machines within one CI build. This is a problem I have been working on in recent years, creating the [Knapsack Pro](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation) library and the Queue Mode for Ruby and JavaScript with support for several popular test runners like Jest or Cypress.

The idea is simple. We have a set of tests that are queued on the Knapsack Pro server. Individual parallel CI machines consume the queue with Knapsack Pro API until the queue is over. Thanks to this, the tests are optimally distributed among CI servers, helping you to avoid a bottleneck in the form of an overloaded (too slow) CI server. Below you can see an example:

<img src="/images/blog/posts/how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation/knapsack-pro-cloud-v2.png" style="width:70%;display:block;margin:0 auto;" alt="tests split on CI server with Knapsack Pro Queue Mode, CI parallelism" />

Dynamic test suite split solves our problem with random test execution time, with slow running CI servers or with servers that are overloaded which work is slower. No matter when they start or finish work - it's important that they don't take too many tests to execute until they finish their current work.

See how dynamic test suite split works in Queue Mode for Knapsack Pro.

<iframe width="560" height="315" src="https://www.youtube.com/embed/hUEB1XDKEFY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Implementation of Knapsack Pro in Ruby and JavaScript

[Knapsack Pro](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation) has native support for many popular CI servers. It is also an agnostic CI tool, so you can use any CI server. All you have to do is configure the Knapsack Pro command for each parallel CI server running within one CI build. Below you can see a general example of how config YAML might look for a CI server with Knapsack Pro:

<script src="https://gist.github.com/ArturT/580df4fd7852e67379e9b263228e1994.js"></script>

If you use RSpec and you have very slow test files you can auto split them. Knapsack Pro [detects slow RSpec test files to split it by test examples on parallel jobs](https://knapsackpro.com/faq/question/how-to-split-slow-rspec-test-files-by-test-examples-by-individual-it).

## Conclusions

[Knapsack Pro](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation) supports Ruby and several test runners in JavaScript such as Jest and Cypress, but there are plans to add support for more test runners and programming languages. I would love to hear [what you use to test applications and which CI servers](https://docs.google.com/forms/d/e/1FAIpQLSe7Z6k__VczmRMmXykjA5i2MVEA3nEJ90gbiIeCRjecWhPOig/viewform?hl=en). In case you are considering changing your CI provider, check out our [list of CI servers features](https://knapsackpro.com/ci_servers/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation). You can contact me on [LinkedIn](https://www.linkedin.com/in/arturtrzop/), and you can find more information about the described solution at [KnapsackPro.com](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation). I hope this article was useful to you. :)
