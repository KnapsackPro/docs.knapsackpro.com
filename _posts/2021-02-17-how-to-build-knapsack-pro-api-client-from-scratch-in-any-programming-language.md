---
layout: post
title:  "How to build Knapsack Pro API client from scratch in any programming language"
date:   2021-02-17 08:00:00 +0100
author: "Artur Trzop"
categories: techtips continuous_integration
og_image: "/images/blog/posts/how-to-build-knapsack-pro-api-client-from-scratch-in-any-programming-language/image.jpg"
---

You will learn how to integrate with Knapsack Pro API to run parallel tests in any programming language for any testing framework. We will cover what's needed to build from scratch Knapsack Pro client similar to our existing clients like `knapsack_pro` Ruby gem, `@knapsack-pro/jest` for Jest in JavaScript, or `@knapsack-pro/cypress` for Cypress test runner (also in JavaScript).

Tip: You can find the [list of existing Knapsack Pro clients](/integration/) here to run your tests in parallel for programming languages like Ruby, JavaScript, and their testing frameworks.

## Introduction - learn basics

First, you need to understand what [Knapsack Pro](http://knapsackpro.com) does and how it split test files in parallel CI nodes to get your CI build fast.

Learn [what is Regular Mode and Queue Mode](/2020/how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation) in Knapsack Pro and how they work.

Please see below the dictionary of terms we will use in this article:

* __Knapsack Pro API__ - it's an API responsible for deciding how to split test files between parallel CI nodes. You will send recorded time execution of your test files to the API to see results in the [Knapsack Pro user dashboard](https://knapsackpro.com/dashboard). Knapsack Pro API will use the data to better predict how to split your test files in future CI build runs. Here is the [documentation for all API endpoints](/api/).

* __Knapsack Pro client__ - is a library that you install in your project. It has business logic responsible for connecting with Knapsack Pro API. The client knows how to read environment variables for various CI providers to automatically detect git commit hash, branch name, number of total parallel CI nodes, and CI node index. Knapsack Pro client connects with the Knapsack Pro API to fetch a list of test files to run a proper set of tests on a given parallel CI node. Knapsack Pro client also knows how to integrate with a test runner in a given programming language. For instance, the Knapsack Pro client in Ruby programming language is a `knapsack_pro` ruby gem. It knows how to run tests for test runners like RSpec, Cucumber, Minitest, etc. Simply speaking Knapsack Pro client is a wrapper around test runner (testing framework) in a given programing language. A [list of existing Knapsack Pro clients](/integration/) is here.

* __Test runner (testing framework)__ - each programming language has its own testing framework. For instance, in Ruby programming language there are test runners like RSpec, Cucumber, Minitest. In JavaScript, you can find Jest, Puppeteer, Karma, Jasmine, Cypress, TestCafe, etc. In Python, there are pytest, unittest. 

* __Knapsack Pro Regular Mode__ - it's a static split of tests in a deterministic way between parallel CI nodes. Basically, before starting tests we know upfront what set of test files should be run on each parallel CI node.

* __Knapsack Pro Queue Mode__ - it's a dynamic way of splitting tests between parallel CI nodes. In this case, each parallel CI node asks Knapsack Pro API for a set of tests and runs it. Once completed it asks for another set of tests. It's repeated until all tests are executed and the Knapsack Pro API has no more test files in the Queue. Please read the article about the [difference between Regular Mode and Queue Mode](/2020/how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation) to learn about it in detail and see some pictures showing the difference.

Now you know a few useful terms. Before we start learning how to build a Knapsack Pro client from scratch in your favorite programming language, let's check how such a client looks like in JavaScript. In order to integrate with Knapsack Pro API in JavaScript, we created an NPM package called [`@knapsack-pro/core`](https://github.com/KnapsackPro/knapsack-pro-core-js). This package knows how to communicate with Knapsack Pro API and how to read environment variables for various CI providers.

As you may know, JavaScript has many testing frameworks like Jest, Cypress, etc. That's why we created another package [`@knapsack-pro/jest`](https://github.com/KnapsackPro/knapsack-pro-jest) for the Jest testing framework that uses `@knapsack-pro/core`. The `@knapsack-pro/jest` NPM package has business logic responsible for integration with the Jest library so you could run Jest tests in parallel using Knapsack Pro API.

Before you start building your own Knapsack Pro client in your programming language I highly recommend reading the article where we covered [how `@knapsack-pro/core` and `@knapsack-pro/jest` works](/2020/how-to-build-native-integration-with-knapsack-pro-api-to-run-tests-in-parallel-for-any-test-runner-testing-framework).
Those are thin NPM packages and the source code is simple to understand. You could get inspired on how to organize code and what's need internally to build a Knapsack Pro client from scratch.

## TODO
