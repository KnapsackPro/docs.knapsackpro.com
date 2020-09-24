---
layout: post
title: "How to build native integration with Knapsack Pro API to run tests in parallel for any test runner (testing framework)"
date: 2020-09-25 00:00:00 +0200
author: "Artur Trzop"
categories: techtips continuous_integration
og_image: "/images/blog/posts/how-to-build-native-integration-with-knapsack-pro-api-to-run-tests-in-parallel-for-any-test-runner-testing-framework/api.jpeg"
---

Do you know that Knapsack Pro API can work with any test runner in any programming language?

If your test runner is not listed here as one of [the supported test runners out of the box in Knapsack Pro](/integration/), then you can use `@knapsack-pro/core` npm package to directly integrate with Knapsack Pro API and build your test runner integration with Knapsack Pro API.

<img src="/images/blog/posts/how-to-build-native-integration-with-knapsack-pro-api-to-run-tests-in-parallel-for-any-test-runner-testing-framework/api.jpeg" style="width:300px;margin-left: 15px;float:right;" alt="Knapsack Pro API" />

We have users who did that, for instance, for the TestCafe test runner.

Knapsack Pro offers out of the box support for test runners like Cypress and Jest with these packages:

* [`@knapsack-pro/cypress`](https://github.com/KnapsackPro/knapsack-pro-cypress)
* [`@knapsack-pro/jest`](https://github.com/KnapsackPro/knapsack-pro-jest)

They both use [`@knapsack-pro/core`](https://github.com/KnapsackPro/knapsack-pro-core-js) which, is a wrapper around Knapsack Pro API.

`@knapsack-pro/core` provides support for Knapsack Pro Queue Mode API. Thanks to that you, can run tests in parallel CI nodes using a dynamic test suite split with Queue Mode. To learn more about how Queue Mode works, you can see the section `Dynamic tests split` of the article describing [the difference between Regular Mode and Queue Mode](/2020/how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation#dynamic-tests-split).

## How Queue Mode works with Knapsack Pro API

Here is the general idea behind Queue Mode in Knapsack Pro.

There are parallel CI nodes on your CI server. Each CI node is running the Knapsack Pro client command to run tests.

* The very first request from the Knapsack Pro client command (example `$(npm bin)/knapsack-pro-cypress`) will send a list of all test files existing on the disk to [Knapsack Pro API Queue](/api/v1/#queues_queue_post). Then API will return the proper set of tests for the CI node.
* There is a Queue with a list of test files on the Knapsack Pro API side. The Queue is build based on a list of tests sent to the API and based on historically recorded data about your tests execution time in order to sort tests in the Queue from slowest to fastest.
* Each Knapsack Pro client command connects with Knapsack Pro API Queue and consumes a set of tests fetched from the Queue. API will return a set of slowest tests first from the top of the Queue.
* Once the set of tests is executed on the CI node then the Knapsack Pro client command asks for another set of tests from the Queue. This is repeated until the Queue is empty.
* Once all tests are executed and their execution time is recorded then the Knapsack Pro client command will send recorded time of each test file to Knapsack Pro API (it will [create a Build Subset on the API side](/api/v1/#build_subsets_post)).

Thanks to Queue Mode tests are allocated between parallel CI nodes in a dynamical way to ensure all CI nodes will finish work at the same time. This allows getting optimal CI build time (as fast as possible).

## Build your own integration with Knapsack Pro API

You can fork one of the existing integrations like Cypress ([`@knapsack-pro/cypress`](https://github.com/KnapsackPro/knapsack-pro-cypress)) or Jest ([`@knapsack-pro/jest`](https://github.com/KnapsackPro/knapsack-pro-jest)) and replace the Cypress/Jest test runner with your own test runner to build the integration.

This article explains how to do it based on `@knapsack-pro/cypress` npm package.

First, you need to clone [`@knapsack-pro/core`](https://github.com/KnapsackPro/knapsack-pro-core-js) repository which is a core library that allows you to connect with [Knapsack Pro API](/api/). In the [README file](https://github.com/KnapsackPro/knapsack-pro-core-js#knapsack-procore), you can find instructions on [how to configure and build the project in the development](https://github.com/KnapsackPro/knapsack-pro-core-js#development) environment.

The next step is to clone [`@knapsack-pro/cypress`](https://github.com/KnapsackPro/knapsack-pro-cypress) repository. You will have to replace Cypress with your test runner npm package.

Here is basic info about the project structure. It's written in TypeScript. The TypeScript source code is in `src` directory. The `lib` directory contains compiled TypeScript to JavaScript. You should not modify files in `lib` because they are overridden during compilation. In the [README file](https://github.com/KnapsackPro/knapsack-pro-cypress#development), you will find tips on how to compile the project.

You can rename forked project `@knapsack-pro/cypress` to `@knapsack-pro/my-test-runner` and update the info in `package.json`.

* Update name to `@knapsack-pro/my-test-runner` and `version` to `1.0.0`. [See in code](https://github.com/KnapsackPro/knapsack-pro-cypress/blob/8942e0430e9b529ab27cf877b15b2d2964f89222/package.json#L2,L3).
* Add your test runner package to [`peerDependency`](https://docs.npmjs.com/files/package.json#peerdependencies). This allows a developer to use test runner within specified range versions when the developer will install your package in their project. [See in code](https://github.com/KnapsackPro/knapsack-pro-cypress/blob/8942e0430e9b529ab27cf877b15b2d2964f89222/package.json#L62).
* Add your test runner package to `devDependencies`. This allows using a specific version of the test runner in development when you will be testing your `@knapsack-pro/my-test-runner` with another local project using an example test suite supported by `my-test-runner` npm package. For example to test `@knapscak-pro/cypress` we have a [separate repository with an example test suite written in Cypress](https://github.com/KnapsackPro/cypress-example-kitchensink). We verify with it if our `@knapsack-pro/cypress` package ([See in code](https://github.com/KnapsackPro/cypress-example-kitchensink/blob/5c5ddf80f8ca0fb317572d50d5d264070bb61af0/package.json#L67)) works fine. To do it we created [an example bin script](https://github.com/KnapsackPro/cypress-example-kitchensink/blob/5c5ddf80f8ca0fb317572d50d5d264070bb61af0/bin/knapsack_pro_cypress_test_file_pattern#L29) to connect with Knapsack Pro API. Please remove from it `ENDPOINT` environment variable then `@knapsack-pro/core` will connect with production API (https://api.knapsackpro.com) by default.

Note how we pass to `KnapsackProCore` the list of all existing test files on the disk - [see in code](https://github.com/KnapsackPro/knapsack-pro-cypress/blob/8942e0430e9b529ab27cf877b15b2d2964f89222/src/knapsack-pro-cypress.ts#L30). This is needed to initialize the Queue on the API side with the very first request to the API (this was mentioned earlier in the article). Those test files will be used to run your tests.

The most important place in the code is running your test runner and passing recorded tests timing data and info if tests are green or red back to `@knapsack-pro/core`. See how it's done for `@knapsack-pro/cypress` - [see in code](https://github.com/KnapsackPro/knapsack-pro-cypress/blob/8942e0430e9b529ab27cf877b15b2d2964f89222/src/knapsack-pro-cypress.ts#L37).

## Summary

The above tips should allow you to use `@knapsack-pro/core` and build your own integration for your test runner like TestCafe, etc.

You can fork [`@knapsack-pro/cypress`](https://github.com/KnapsackPro/knapsack-pro-cypress) or check [`@knapsack-pro/jest`](https://github.com/KnapsackPro/knapsack-pro-jest) which is even thinner than `@knapsack-pro/cypress`. Just take a look at the source code and `README` for those projects to learn more.

Note that using [`@knapsack-pro/core`](https://github.com/KnapsackPro/knapsack-pro-core-js) instead of directly writing requests to Knapsack Pro API has the benefit of `@knapsack-pro/core` features like [Fallback Mode](https://github.com/KnapsackPro/knapsack_pro-ruby#what-happens-when-knapsack-pro-api-is-not-availablenot-reachable-temporarily). When the library won't be able to connect to API then it can auto-retry requests and show warnings in the logger and also run tests in Fallback Mode when can't reach the API. This takes care of many stuff for you than writing your own [direct request to the API](/api/).

I hope this article was useful to you. Let us know if you have any questions or you would like to see out of the box integration for your favorite test runner. We'd like to add more test runners to our [list of supported out of the box test runners](/integration/) in the future.
