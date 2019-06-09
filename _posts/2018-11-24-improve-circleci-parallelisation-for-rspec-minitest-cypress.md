---
layout: post
title:  "Improve CircleCI parallelisation for RSpec, Minitest, Cypress"
date:   2018-11-24 12:00:00 +0100
author: "Artur Trzop"
categories: continuous_integration CircleCI parallelisation RSpec Minitest Cypress Ruby Javascript
og_image: "/images/blog/posts/improve-circleci-parallelisation-for-rspec-minitest-cypress/balanced-tests.jpg"
---

Maybe you use CircleCI parallelisation to run your test suite across multiple CI nodes but you noticed that some CI nodes take more time to complete tests than the others.

<img src="/images/blog/posts/improve-circleci-parallelisation-for-rspec-minitest-cypress/balanced-tests.jpg" style="width:450px;margin-left: 15px;float:right;" />

This can happen when your tests have random time. Often E2E (end-to-end) tests have a more random time of execution because the browser has to wait for some elements to be loaded on the website or maybe your app is depended on external API and processing requests have different duration. Other reason can be a delay with starting one of your parallel CI nodes.

## Default CircleCI test suite split

Here is an example of running tests with default CircleCI parallelisation. As you can see the whole CI build finished work in 29 minutes 37 seconds. Tests were executed on 15 parallel CI nodes and some of them run tests for 14 minutes and the slowest one for almost 30 minutes.

<img src="/images/blog/posts/improve-circleci-parallelisation-for-rspec-minitest-cypress/circleci-before-knapsack_pro.png" style="width:100%;" />

If we could auto-balance the split of test suite across CI nodes in a way that all CI nodes do work in similar time then we could get shorter CI build.

## Dynamic test suite split

We can split tests in a dynamic way across CI nodes using [Knapsack Pro](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=improve-circleci-parallelisation-for-rspec-minitest-cypress). For instance, we can split tests for RSpec or Minitest in Ruby. If you run E2E tests with Cypress test runner then you can split Javascript tests as well.

Here is graph after adding [Knapsack Pro Queue Mode](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=improve-circleci-parallelisation-for-rspec-minitest-cypress). Knapsack Pro Queue Mode keeps your tests auto-balanced across CI nodes in order to allow all CI nodes finish work in similar time. As you can see CI build took 22 minutes 50 seconds instead of almost 30 minutes. It means <b>we saved 7 minutes per each CI build</b>.

<img src="/images/blog/posts/improve-circleci-parallelisation-for-rspec-minitest-cypress/circleci-after-knapsack_pro.png" style="width:100%;" />

When your team runs 20 CI builds per day you could save 2 hours 20 minutes every day. It's <b>over 46 hours saved during a month</b>.

In below video I show what else problems can be solved with dynamic test suite split.

<iframe width="560" height="315" src="https://www.youtube.com/embed/gJdLQb83hho" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

You can also read more about it at [Knapsack Pro](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=improve-circleci-parallelisation-for-rspec-minitest-cypress) and see support for more test runners there.

## Other tips

If you are curious about [Cypress test suite split](/2018/run-javascript-e2e-tests-faster-with-cypress-on-parallel-ci-nodes).

If you would like to run your [CircleCI 2.0 tests with Chrome headless](/2017/circleci-2-0-capybara-feature-specs-selenium-webdriver-with-chrome-headless).

Tech details how to run tests in [Minitest continuously with dynamic test files loading](/2018/how-to-run-tests-in-minitest-continuously-with-dynamic-test-files-loading).
