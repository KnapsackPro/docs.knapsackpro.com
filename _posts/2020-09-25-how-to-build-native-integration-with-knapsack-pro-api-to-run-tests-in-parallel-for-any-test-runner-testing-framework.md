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

They both use [`@knapsack-pro/core`](https://github.com/KnapsackPro/knapsack-pro-core-js) which is a wrapper around Knapsack Pro API.

`@knapsack-pro/core` provides support for Knapsack Pro Queue Mode API. Thanks to that, you can run tests in parallel CI nodes using a dynamic test suite split with Queue Mode. To learn more about how the Queue Mode works, you can see the section `Dynamic tests split` of the article describing [the difference between Regular Mode and Queue Mode](/2020/how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation#dynamic-tests-split).

## How Queue Mode works with Knapsack Pro API

Here is the general idea behind Queue Mode in Knapsack Pro.

There are parallel CI nodes on your CI server. Each CI node is running the Knapsack Pro client command to run tests.

* The very first request from the Knapsack Pro client command (example `$(npm bin)/knapsack-pro-cypress`) sends a list of all test files existing on the disk to [Knapsack Pro API Queue](/api/v1/#queues_queue_post). Then API returns the proper set of tests for the CI node.
* There is a Queue with a list of test files on the Knapsack Pro API side. The Queue is build based on a list of tests sent to the API and based on historically recorded data about your tests execution time in order to sort tests in the Queue from slowest to fastest.
* Each Knapsack Pro client command connects with the Knapsack Pro API Queue and consumes a set of tests fetched from the Queue. API returns a set of tests from the top of the Queue (slowest first).
* Once the set of tests is executed on the CI node then the Knapsack Pro client command asks for another set of tests from the Queue. This is repeated until the Queue is empty.
* Once all tests are executed and their execution time is recorded then the Knapsack Pro client command sends recorded time of each test file to Knapsack Pro API (this [creates a Build Subset on the API side](/api/v1/#build_subsets_post)).

Thanks to the Queue Mode, tests are allocated between parallel CI nodes in a dynamic way to ensure that all CI nodes finish their work at a similar time. This allows getting optimal CI build time (as fast as possible).

## Build your own integration with Knapsack Pro API

You can fork one of the existing integrations like Cypress ([`@knapsack-pro/cypress`](https://github.com/KnapsackPro/knapsack-pro-cypress)) or Jest ([`@knapsack-pro/jest`](https://github.com/KnapsackPro/knapsack-pro-jest)) and replace the Cypress/Jest test runner with your own test runner to build the integration.

This article explains how to do it based on `@knapsack-pro/cypress` npm package.

First, you need to clone [`@knapsack-pro/core`](https://github.com/KnapsackPro/knapsack-pro-core-js) repository which is a core library that allows you to connect with [Knapsack Pro API](/api/). In the [README file](https://github.com/KnapsackPro/knapsack-pro-core-js#knapsack-procore), you can find instructions on [how to configure and build the project in the development](https://github.com/KnapsackPro/knapsack-pro-core-js#development) environment.

The next step is to clone [`@knapsack-pro/cypress`](https://github.com/KnapsackPro/knapsack-pro-cypress) repository. You will have to replace Cypress with your test runner npm package.

Here is some basic info about the project structure. It's written in TypeScript. The TypeScript source code is in `src` directory. The `lib` directory contains TypeScript code compiled to JavaScript. You should not modify files in the `lib` directory because they are overridden during compilation. You can find tips on how to compile the project in the [README file](https://github.com/KnapsackPro/knapsack-pro-cypress#development).

You can rename forked project `@knapsack-pro/cypress` to `@knapsack-pro/my-test-runner` and update the info in `package.json`.

* Update name to `@knapsack-pro/my-test-runner` and `version` to `1.0.0`. [See in code](https://github.com/KnapsackPro/knapsack-pro-cypress/blob/8942e0430e9b529ab27cf877b15b2d2964f89222/package.json#L2,L3).
* Add your test runner package to [`peerDependency`](https://docs.npmjs.com/files/package.json#peerdependencies). This allows a developer to use a runner within a specified version range when the developer installs your package in their project. [See in code](https://github.com/KnapsackPro/knapsack-pro-cypress/blob/8942e0430e9b529ab27cf877b15b2d2964f89222/package.json#L62).
* Add your test runner package to `devDependencies`. This allows using a specific version of the test runner in development for testing your `@knapsack-pro/my-test-runner` with another local project using an example test suite supported by `my-test-runner` npm package. For example, to test `@knapscak-pro/cypress` we have a [separate repository with an example test suite written in Cypress](https://github.com/KnapsackPro/cypress-example-kitchensink). We verify with it that our `@knapsack-pro/cypress` package ([See in code](https://github.com/KnapsackPro/cypress-example-kitchensink/blob/5c5ddf80f8ca0fb317572d50d5d264070bb61af0/package.json#L67)) works fine. In order to do, we've created [an example bin script](https://github.com/KnapsackPro/cypress-example-kitchensink/blob/5c5ddf80f8ca0fb317572d50d5d264070bb61af0/bin/knapsack_pro_cypress_test_file_pattern#L29) to connect with Knapsack Pro API. Please remove from it the `ENDPOINT` environment variable - this way the `@knapsack-pro/core` will connect to the production API (https://api.knapsackpro.com) by default.

Note how we pass to `KnapsackProCore` the list of all existing test files on the disk - [see in code](https://github.com/KnapsackPro/knapsack-pro-cypress/blob/8942e0430e9b529ab27cf877b15b2d2964f89222/src/knapsack-pro-cypress.ts#L30). This is needed to initialize the Queue on the API side with the very first request to the API (as mentioned earlier). Those test files will be used to run your tests.

The most important place in the code is running your test runner and passing recorded tests timing data and info if tests are green or red back to the `@knapsack-pro/core`. See how it's done for `@knapsack-pro/cypress` - [see in code](https://github.com/KnapsackPro/knapsack-pro-cypress/blob/8942e0430e9b529ab27cf877b15b2d2964f89222/src/knapsack-pro-cypress.ts#L37).

## Summary

The description above should allow you to use `@knapsack-pro/core` and build your own integration for your test runner like TestCafe, etc.

You can fork [`@knapsack-pro/cypress`](https://github.com/KnapsackPro/knapsack-pro-cypress) or check [`@knapsack-pro/jest`](https://github.com/KnapsackPro/knapsack-pro-jest) which is even thinner than `@knapsack-pro/cypress`. Just take a look at the source code and `README` for those projects to learn more.

Note that using [`@knapsack-pro/core`](https://github.com/KnapsackPro/knapsack-pro-core-js) instead of directly writing requests to Knapsack Pro API has the benefit of being able to use `@knapsack-pro/core` features, like the [Fallback Mode](https://knapsackpro.com/faq/question/what-happens-when-knapsack-pro-api-is-not-available-how-fallback-mode-works). When the library is not able to connect to the API then it can auto-retry requests and show warnings in the logger and also run the tests in the Fallback Mode. As you can see, using the library can help you avoid dealing with many hassles along the way!

I hope this article was useful to you. Let us know if you have any questions or if you would like to see an out of the box integration for your favorite test runner. We'd like to add more test runners to our [list of supported out of the box test runners](/integration/) in the future.

### Related articles

* [How to build a custom Knapsack Pro API client from scratch in any programming language](/2021/how-to-build-knapsack-pro-api-client-from-scratch-in-any-programming-language)
