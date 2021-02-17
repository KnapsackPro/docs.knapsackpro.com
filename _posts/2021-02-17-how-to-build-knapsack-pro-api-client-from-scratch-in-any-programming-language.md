---
layout: post
title:  "How to build Knapsack Pro API client from scratch in any programming language"
date:   2021-02-17 08:00:00 +0100
author: "Artur Trzop"
categories: techtips continuous_integration
og_image: "/images/blog/posts/how-to-build-knapsack-pro-api-client-from-scratch-in-any-programming-language/api.jpeg"
---

You will learn how to integrate with Knapsack Pro API to run parallel tests in any programming language for any testing framework. You will see what's needed to build from scratch Knapsack Pro API client similar to our existing clients like `knapsack_pro` Ruby gem, `@knapsack-pro/jest` for Jest in JavaScript, or `@knapsack-pro/cypress` for Cypress test runner (also in JavaScript).

<img src="/images/blog/posts/how-to-build-knapsack-pro-api-client-from-scratch-in-any-programming-language/api.jpeg" style="width:300px;margin-left: 15px;float:right;" alt="API, integration, knapsack, knapsack problem, knapsack pro" />

Here you can find the [list of existing Knapsack Pro clients](/integration/) to run your tests in parallel for programming languages like Ruby, JavaScript, and their testing frameworks.

## Introduction - learn basics

First, you need to understand what [Knapsack Pro](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-build-knapsack-pro-api-client-from-scratch-in-any-programming-language) does and how it splits test files in parallel CI nodes to run your CI build fast.

Learn [what Regular Mode and Queue Mode are](/2020/how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation) in Knapsack Pro and how they work.

Please see below the dictionary of terms we will use in this article:

* __Knapsack Pro API__ - it's an API responsible for deciding how to split test files between parallel CI nodes. Your API client is going to send recorded time execution of your test files to the API to see results in the [Knapsack Pro user dashboard](https://knapsackpro.com/dashboard?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-build-knapsack-pro-api-client-from-scratch-in-any-programming-language). Knapsack Pro API will use the data to better predict how to split your test files in future CI build runs. Here is the [documentation for all API endpoints](/api/).

* __Knapsack Pro client__ - is a library that you install in your project. It contains business logic responsible for connecting with Knapsack Pro API. The client knows how to read environment variables for various CI providers to automatically detect git commit hash, branch name, number of total parallel CI nodes, and CI node index. Knapsack Pro client connects with the Knapsack Pro API to fetch a list of test files to run a proper set of tests on a given parallel CI node. Knapsack Pro client also knows how to integrate with a test runner in a given programming language. For instance, the Knapsack Pro client in Ruby programming language is a `knapsack_pro` ruby gem. It knows how to run tests for test runners like RSpec, Cucumber, Minitest, etc. Simply speaking, Knapsack Pro client is a wrapper around test runner (testing framework) in a given programing language. Here is a [list of existing Knapsack Pro clients](/integration/).

* __Test runner (testing framework)__ - each programming language has its own testing framework. For instance, in Ruby programming language there are test runners like RSpec, Cucumber, Minitest. In JavaScript, you can find Jest, Puppeteer, Karma, Jasmine, Cypress, TestCafe, etc. In Python, there are pytest, unittest. 

* __Knapsack Pro Regular Mode__ - it's a static split of tests between parallel CI nodes (performed deterministically). Basically, before starting tests we know up front what set of test files should be run on each parallel CI node.

* __Knapsack Pro Queue Mode__ - it's a dynamic way of splitting tests between parallel CI nodes. In this case, each parallel CI node asks Knapsack Pro API for a set of tests and runs it. Once completed, it asks for another set of tests. It's repeated until all tests are executed and the Knapsack Pro API has no more test files in the Queue. Please read the article about the [difference between Regular Mode and Queue Mode](/2020/how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation) to learn about it in detail and see some graphs showing the difference.

Now you know a few useful terms. Before we start learning how to build a Knapsack Pro client from scratch in your favorite programming language, let's check how such a client looks like in JavaScript. In order to integrate with Knapsack Pro API in JavaScript, we created an NPM package called [`@knapsack-pro/core`](https://github.com/KnapsackPro/knapsack-pro-core-js). This package knows how to communicate with Knapsack Pro API and how to read environment variables for various CI providers.

As you probably know, there are many testing frameworks written in JavaScript, e.g. Jest, Cypress, etc. For the Jest testing framework we created another package [`@knapsack-pro/jest`](https://github.com/KnapsackPro/knapsack-pro-jest) for the Jest testing framework that uses `@knapsack-pro/core`. The `@knapsack-pro/jest` NPM package contains business logic responsible for integration with the Jest library so you could run Jest tests in parallel using Knapsack Pro API.

Before you start building your own Knapsack Pro client in your programming language I highly recommend reading the article where we covered [how `@knapsack-pro/core` and `@knapsack-pro/jest` work](/2020/how-to-build-native-integration-with-knapsack-pro-api-to-run-tests-in-parallel-for-any-test-runner-testing-framework).
Those are lightweight NPM packages and the source code is easy to understand. You can get some ideas about code organization and technical requirements for building a Knapsack Pro client from scratch.

## How to build Knapsack Pro client

You will see how to build a Knapsack Pro client from scratch based on the  JavaScript example. Knapsack Pro client is built as 2 packages:

* __Knapsack Pro Core__ - (i.e. [`@knapsack-pro/core`](https://github.com/KnapsackPro/knapsack-pro-core-js)) which is responsible for:
  * connecting with the Knapsack Pro API. It can respond to, and handle common response types and errors coming from the API.
  * reading environment variables specific to Knapsack Pro client like API token, log level, API endpoint URL, etc.
  * CI providers environment variables integration - Knapsack Pro Core library can read environment variables for popular CI providers. Thanks to that it can automatically detect git commit hash, branch name, number of parallel CI nodes, etc.
  * Logger - it can log useful tips for the output or warnings.
  * Fallback Mode - it knows how to run tests in parallel when there is a network issue and the connection with Knapsack Pro API is not working.

* __Knapsack Pro Test Runner__ - (i.e. [`@knapsack-pro/jest`](https://github.com/KnapsackPro/knapsack-pro-jest)) is responsible for:
  * integration of Knapsack Pro Core with your test runner (testing framework) like Jest, etc.
  * knowing how to run tests for a given test runner, how to record time execution, and report it back to Knapsack Pro Core so the recorded test files can be saved on the Knapsack Pro API side.
  * reading environment variables specific for the test runner, for instance how to detect a list of Jest test files residing on the disk.

## Knapsack Pro Core

The core functionality of the Knapsack Pro client is in the Core package (`@knapsack-pro/core`). We will review a few main elements and describe how they work.

### Environment variables integration

Knapsack Pro Core client should understand a few environment variables. See example for [`@knapsack-pro/core` environment variables](https://github.com/KnapsackPro/knapsack-pro-core-js/blob/master/src/config/knapsack-pro-env.config.ts).
Users can define those environment variables in their CI server settings to control the behavior of the Knapsack Pro client.

* `KNAPSACK_PRO_LOG_LEVEL` - it determines how much debugging info should be produced by the Knapsack Pro client to the output during the runtime of tests. The default is `info`. If you set the `debug` value then the Knapsack Pro client should show in the output a payload of requests and responses from the Knapsack Pro API.

* `KNAPSACK_PRO_ENDPOINT` - it's the URL of the Knapsack Pro API. The default value is `https://api.knapsackpro.com` which is production API. You can use our production API and your API token from the user dashboard for testing purposes.

* `KNAPSACK_PRO_TEST_SUITE_TOKEN` - it's an API token that you can use to connect with Knapsack Pro API. If the value is not defined then an error should be raised.

* `KNAPSACK_PRO_FIXED_QUEUE_SPLIT` - it's a flag to control the behavior of Queue Mode. The default value is `false`.

  * If the value is `true` then the API will cache the way test files were split between parallel CI nodes. So when you retry the CI build the tests won't be dynamically split. Instead, they will be split in the same order as during the very first run (which was a dynamic tests split).

  * Do you want to use "retry single failed parallel CI node" feature for your CI? For instance, some of CI providers like Travis CI, Buildkite or Codeship allow you to retry only one of failed parallel CI nodes instead of retrying the whole CI build with all parallel CI nodes. If you want to be able to retry only a single failed parallel CI node then you need to tell Knapsack Pro API to remember the way test files were allocated across parallel CI nodes by adding to your CI environment variables `KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true`.

  * The default is `KNAPSACK_PRO_FIXED_QUEUE_SPLIT=false` which means that when you want to retry the whole failed CI build then a new dynamic test suite split will happen across all retried parallel CI nodes. Some people may prefer to retry the whole failed CI build with test files allocated across parallel CI nodes in the same order as it happened for the failed CI build - in such a case you should set `KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true`.

  * To learn more about this flag you can also see [examples in knapsack_pro ruby gem related to the `KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true`](https://github.com/KnapsackPro/knapsack_pro-ruby#knapsack_pro_fixed_queue_split-remember-queue-split-on-retry-ci-node).

* `KNAPSACK_PRO_CI_NODE_TOTAL` - the default value conveying the number of parallel CI nodes used. Knapsack Pro client should try to determine the number of parallel CI nodes you use during CI build run based on known CI providers environment variables first. Only if it's not possible then `KNAPSACK_PRO_CI_NODE_TOTAL` value should be used. If the `KNAPSACK_PRO_CI_NODE_TOTAL` value is not defined then an error should be raised.

* `KNAPSACK_PRO_CI_NODE_INDEX` - it is the index of the parallel CI node (parallel job). It should start from `0` to `KNAPSACK_PRO_CI_NODE_TOTAL - 1`. If you use 2 parallel CI nodes in total then indexes should be `0` and `1`.
  * If `KNAPSACK_PRO_CI_NODE_INDEX` has a value then it should be used.
  * If `KNAPSACK_PRO_CI_NODE_INDEX` has no value then Knapsack Pro client should read CI provider environment variables to determine CI node index.
  * If no value is detected then an error should be raised. Please see the [source code of `@knapsack-pro/core`](https://github.com/KnapsackPro/knapsack-pro-core-js/blob/0f44c6a3daa369cd4353e315abbf5539295289ea/src/config/knapsack-pro-env.config.ts#L63,L76).

* `KNAPSACK_PRO_CI_NODE_BUILD_ID` - a user of your Knapsack Pro client can define CI build ID with this environment variable. For instance, if the user uses Jenkins as a CI provider then Jenkins has no autogenerated CI build ID out of the box. In such a case, the user should create a custom value (unique for every CI build) and assign it to the `KNAPSACK_PRO_CI_NODE_BUILD_ID` environment variable.
  * CI build has many parallel CI nodes. Each parallel CI node should have the same `KNAPSACK_PRO_CI_NODE_BUILD_ID` value. This means the parallel CI nodes belong to the same CI build.
  * Knapsack Pro client by default should try to detect CI build ID for popular CI providers by looking for it in the environment variables.
  * If `KNAPSACK_PRO_CI_NODE_BUILD_ID` value was defined by the user then it should be used during a request to the Knapsak Pro API. It has [higher priority](https://github.com/KnapsackPro/knapsack-pro-core-js/blob/0f44c6a3daa369cd4353e315abbf5539295289ea/src/config/knapsack-pro-env.config.ts#L79,L81) than [detected CI build ID from a CI provider](https://github.com/KnapsackPro/knapsack-pro-core-js/blob/0f44c6a3daa369cd4353e315abbf5539295289ea/src/config/knapsack-pro-env.config.ts#L83,L86) environment variables.
  * If the user did not define `KNAPSACK_PRO_CI_NODE_BUILD_ID` then a default value `missing-build-id` should be used.
    * Knapsack Pro API understands `missing-build-id` string and knows the CI build has an undefined CI build ID then. In such a case only one parallel CI build can be run at a time for a given set of values (`git commit hash` AND `branch name` AND `number of parallel CI nodes`) - otherwise, tests could be accidentally split between 2 CI builds.
      * Why this set of values matter? From the Knapsack Pro API perspective, a unique CI build is a set of test files that belongs to a git commit hash, branch name and it is split across a certain number of parallel CI nodes. When the user will run a few CI builds at the same time for the same git commit, branch name and on the same number of parallel CI nodes then we need a way to distinguish CI builds from each other. That's why CI build ID is useful and recommended to be pass in request to Knapsack Pro API.
  * It might be easier to understand this logic, just [check the source code of `@knapsack-pro/core`](https://github.com/KnapsackPro/knapsack-pro-core-js/blob/0f44c6a3daa369cd4353e315abbf5539295289ea/src/config/knapsack-pro-env.config.ts#L78).

* `KNAPSACK_PRO_COMMIT_HASH` - it's a commit hash. Knapsack Pro client should in the first place try to find commit hash value from popular CI providers environment variables. If nothing is found then use `KNAPSACK_PRO_COMMIT_HASH` value defined by the user. If the user did not define it then run system command `git rev-parse HEAD` to determine the commit hash. If `git` is not installed then raise an error.

* `KNAPSACK_PRO_BRANCH` - it's a branch name. Knapsack Pro client should in the first place try to find the branch name value from popular CI providers environment variables. If nothing is found then use `KNAPSACK_PRO_BRANCH` value defined by the user. If the user did not define it then run system command `git rev-parse --abbrev-ref HEAD` to determine the branch name. If `git` is not installed then raise an error.

* CI providers environment variables integration - Knapsack Pro client should try to read environment variables for popular CI providers. Thanks to that user have to do less work to set up the Knapsack Pro client with his project.
  * Here can be found a [list of supported CI providers](https://github.com/KnapsackPro/knapsack-pro-core-js/blob/master/src/config/ci-env.config.ts).
  * Here is a list of [environment variables for each CI provider](https://github.com/KnapsackPro/knapsack-pro-core-js/tree/master/src/ci-providers).

### Fallback Mode

Knapsack Pro Core should have implemented business logic for running tests in Fallback Mode. When Knapsack Pro API is not reachable because of downtime then tests should be run in Fallback Mode without the need to use the API.

How Fallback Mode works? The service responsible for Fallback Mode should take a list of test files and the number of total parallel CI nodes. You can sort the test files and divide them by the total parallel CI nodes number.

It's also possible that during tests runtime in Queue Mode the connection with Knapsack Pro API will be lost. This could mean that some of the test files were already executed based on the set of test files fetched from Queue API and then the connection was lost. In such a case Fallback Mode should exclude test files that were already executed.
In Queue Mode the Fallback Mode guarantees each of the test files is run at least once across parallel CI nodes to make sure we never skip a test file.

Here you can see the source code of [Fallback Test Distributor](https://github.com/KnapsackPro/knapsack-pro-core-js/blob/master/src/fallback-test-distributor.ts).

### Logger

Knapsack Pro Core should have a logger with a default `info` log level. A user should be able to control log level with the environment variable `KNAPSACK_PRO_LOG_LEVEL`. You use the logger to produce useful tips to the output during tests runtime:

* info when Fallback Mode was started
* when log level is `debug` then show request payload
* when log level is `debug` then show response body

Here is an example [service for the logger](https://github.com/KnapsackPro/knapsack-pro-core-js/blob/master/src/knapsack-pro-logger.ts).

### Knapsack Pro API integration

Knapsack Pro Core should have implemented [business logic for making requests to Knapsack Pro API](https://github.com/KnapsackPro/knapsack-pro-core-js/blob/master/src/knapsack-pro-api.ts). There are a few basic elements you need to cover:

* Send headers with the client name and client version in each request to the Knapsack Pro API. You should add `KNAPSACK-PRO-CLIENT-NAME` and `KNAPSACK-PRO-CLIENT-VERSION` [headers in each request](https://github.com/KnapsackPro/knapsack-pro-core-js/blob/0f44c6a3daa369cd4353e315abbf5539295289ea/src/knapsack-pro-api.ts#L81,L84). Note that the Knapsack Pro Core (`@knapsack-pro/core`) is just a core library so it means the actual client name and version should be defined in the Knapsack Pro Test Runner client (`@knapsack-pro/jest`) and provided as an [argument to the Knapsack Pro Core](https://github.com/KnapsackPro/knapsack-pro-jest/blob/e6eca4868df9379ce17fe5df865302b11434803c/src/knapsack-pro-jest.ts#L30,L31) so when the Core client sends requests to the Knapsack Pro API it will use proper client name and version. Please use [semantic versioning](https://semver.org/).

* When a request to the Knapsack Pro API fails then it should be repeated 3 times.
  * There are exceptions when a [response status indicates a failure](https://github.com/KnapsackPro/knapsack-pro-core-js/blob/0f44c6a3daa369cd4353e315abbf5539295289ea/src/knapsack-pro-api.ts#L68,L70) - in these cases the request should never be repeated:
    * When response status is `400` then it means request params error.
    * When response status is `422` then it means validation error.
    * When the response status is `403` then a free trial period ended.
  * For all above `4xx` response statuses you should show the error body response to the output and stop running tests. Ensure that the [process has exit code `1`](https://github.com/KnapsackPro/knapsack-pro-core-js/blob/0f44c6a3daa369cd4353e315abbf5539295289ea/src/knapsack-pro-core.ts#L77) - thanks to that CI provider will know the CI build failed.

* When the Knapsack Pro API returns different response status than listed above. For instance when you get `500` status then you should repeat the request 3 times. If the 3rd response has a non-`2xx` status as well, then you should [run test files in Fallback Mode](https://github.com/KnapsackPro/knapsack-pro-core-js/blob/0f44c6a3daa369cd4353e315abbf5539295289ea/src/knapsack-pro-core.ts#L83,L110).

* Ensure you set max request [timeout to `15` seconds](https://github.com/KnapsackPro/knapsack-pro-core-js/blob/0f44c6a3daa369cd4353e315abbf5539295289ea/src/knapsack-pro-api.ts#L80). When Knapsack Pro API won't send a response within 15 seconds then it's better to cancel the request and [wait some time before repeating the request](https://github.com/KnapsackPro/knapsack-pro-core-js/blob/0f44c6a3daa369cd4353e315abbf5539295289ea/src/knapsack-pro-api.ts#L188,L199). You can wait 8 seconds, and increase by another 8 seconds each consequent request that must be repeated (e.g. wait for 8s, then 16s, then 24s).

#### Knapsack Pro API - Queue Mode

Knapsack Pro Core should contain logic for making requests to Knapsack Pro API for Queue Mode. Here is described the [Queue Mode API endpoint](/api/v1/#queues_queue_post).

Please read the API documentation. Especially an example of [the request body](/api/v1/#queues_queue_post). There are 3 types of requests to ensure we can connect with the Queue on the API side in a fast way by sending a request payload as small as possible.

I'll describe below an example covering all 3 types of request payloads.
There are different types of payloads because the Knapsack Pro client runs at the same time on parallel CI nodes and we don't know which one will be connected with the Knapsack Pro API faster. We need to deal with the parallel request problem. For instance, the very first request to Knapsack Pro Queue API should initialize a new Queue with the test files on the API side. But we don't know which parallel CI nodes will connect to the API first. There is mutex protection on the API side to detect the very first request but we also need to take care of things on the Knapsack Pro Core side.

Let's start with a simple example. You have 2 parallel CI nodes. The first CI node has node index `0`. The second parallel CI node has index `1`. Note that the convention is to start index number from `0` to `N-1` (`N` is a total number of parallel CI nodes).

Let's assume only the first parallel CI node (CI node index `0`) sends requests to the Knapsack Pro API because the CI machine for the first CI node started work earlier than the second CI node.

The first CI node sends the below request. Its purpose is to attempt to connect to the existing Queue on the API side.

{% highlight json %}
// 1st type of request to Queue API should set params:
// can_initialize_queue: true AND attempt_connect_to_queue: true
// Note that there is no test_files parameter in the payload to make the request fast and keep the payload small.
{
  "can_initialize_queue": true,
  "attempt_connect_to_queue": true,
  "fixed_queue_split": false,
  "commit_hash": "6e3396177d9f8ca87e2b93b4b0a25babd09d574d",
  "branch": "master",
  "node_total": "2",
  "node_index": "0",
  "node_build_id": "1234"
}
{% endhighlight %}

The above request was the very first request sent to the API and on the API side the Queue does not exist yet. It means the API response returns an error informing us about the Queue not existing.

{% highlight json %}
// 1st type of response to the 1st type of request (when can_initialize_queue: true AND attempt_connect_to_queue: true)
// It can happen only when the queue does not exist on the API side or cannot be read from the cache on the API side
{
  "queue_name": "1:6baacadcdd493c1a6024ee7e51f018f5",
  "message": "A queue with a list of test files does not exist on the API side yet. Knapsack Pro client library should automatically make a new request to try to initialize the queue. The request must have attributes like can_initialize_queue=true, attempt_connect_to_queue=false, and test_files (must contain test files existing on the disk that you want to run), etc.",
  "code": "ATTEMPT_CONNECT_TO_QUEUE_FAILED"
}
{% endhighlight %}

You need to make a second request with a list of test files existing on the disk to try to initialize the Queue with them.

{% highlight json %}
// 2nd type of request to Queue API should happen only if the API response for 1st type of request has:
// "code": "ATTEMPT_CONNECT_TO_QUEUE_FAILED"
// then it means an attempt to connect to the queue failed because the queue does not exist on the API side yet.
// You must initialize a new queue with the below request, it should set params.
// can_initialize_queue: true AND attempt_connect_to_queue: false
// Note that there is test_files parameter in the payload to initialize a queue based on the list of test_files from your disk.
// This request can be slow if you provide a large number of test files (~1000+). That is why we did 1st request to try to connect to the existing queue first because one of the parallel CI nodes could already initialize it.
{
  "can_initialize_queue": true,
  "attempt_connect_to_queue": false,
  "fixed_queue_split": false,
  "commit_hash": "6e3396177d9f8ca87e2b93b4b0a25babd09d574d",
  "branch": "master",
  "node_total": "2",
  "node_index": "0",
  "node_build_id": "1234",
  "test_files": [
    {
      "path": "test/fast/a_test.rb"
    },
    {
      "path": "test/fast/b_test.rb"
    },
    {
      "path": "test/slow/c_test.rb"
    },
    {
      "path": "test/slow/d_test.rb"
    }
  ]
}
{% endhighlight %}

API should return a set of test files assigned to the first CI node (CI node index `0`). You should run the test files with your test runner now (using the Knapsack Pro Test Runner client - we will describe it later).

{% highlight json %}
// 2nd type of response can happen for all types of request
// It returns a list of test files that should be run with your test runner
{
  "queue_name": "1:6baacadcdd493c1a6024ee7e51f018f5",
  "build_subset_id": null,
  "test_files": [
    {
      "path": "test/slow/d_test.rb",
      "time_execution": 3.14
    },
    {
      "path": "test/fast/b_test.rb",
      "time_execution": null
    }
  ]
}
{% endhighlight %}

After you executed the test files you should ask the API for another set of test files as long as the API response will have no more test files.

{% highlight json %}
// 3rd type of request to Queue API should happen only if 1st or 2nd type of request returned a list of test_files.
// With the below request you can continue fetching test files from the queue to run them with your test runner.
// Request payload should have params:
// can_initialize_queue: false AND attempt_connect_to_queue: false
// Note there is no test_files parameter in the payload to make the request fast and keep the payload small.
{
  "can_initialize_queue": false,
  "attempt_connect_to_queue": false,
  "fixed_queue_split": false,
  "commit_hash": "6e3396177d9f8ca87e2b93b4b0a25babd09d574d",
  "branch": "master",
  "node_total": "2",
  "node_index": "0",
  "node_build_id": "1234"
}
{% endhighlight %}

When the API response has no test files it means the Queue was consumed and all test files were executed.

{% highlight json %}
{
  "queue_name": "1:6baacadcdd493c1a6024ee7e51f018f5",
  "build_subset_id": null,
  "test_files": []
}
{% endhighlight %}

After test files were run and their execution time was recorded you can send the test files timing data to the Knapsack Pro API. You need to [create a build subset record](/api/v1/#build_subsets_post) on the API side.

You can see the [source code responsible for making requests to Knapsack Pro API](https://github.com/KnapsackPro/knapsack-pro-core-js/blob/master/src/knapsack-pro-api.ts) for Queue Mode and for a request to create a build subset.

Please also see how Knapsack Pro Core (`@knapsack-pro/core`) uses [service for the API](https://github.com/KnapsackPro/knapsack-pro-core-js/blob/master/src/knapsack-pro-api.ts) to [run tests, record tests execution time, and save recorded test files time for a given CI node as a build subset](https://github.com/KnapsackPro/knapsack-pro-core-js/blob/master/src/knapsack-pro-core.ts) in the API.

## Knapsack Pro Test Runner integration

In this section, you will learn what's need to be covered in the Knapsack Pro Test Runner source code (e.g. `@knapsack-pro/jest`).

You need to [recognize environment variables](https://github.com/KnapsackPro/knapsack-pro-jest/blob/master/src/env-config.ts):

* `KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST` the value of it should override the `KNAPSACK_PRO_TEST_SUITE_TOKEN` so Knapsack Pro Core (`@knapsack-pro/core`) can use the API token during requests.
* `KNAPSACK_PRO_TEST_FILE_PATTERN` there should be a defined default test file pattern that can be used to detect test files on the disk in a directory specific to your test runner. We use a `glob` function to detect test files on the disk.
* There should be a [test file finder service](https://github.com/KnapsackPro/knapsack-pro-jest/blob/master/src/test-files-finder.ts) that can recognize the pattern and find the list of test files on the disk. We use this list of test files to send them in request to the API so the API server can split those test files into parallel CI nodes.
* `KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN` is an exclude pattern. If a user wants to ignore some of the test files she can provide a pattern for it.

Knapsack Pro Test Runner library (e.g. `@knapsack-pro/jest`) should have their [name and version and it should be passed to Knapsack Pro Core](https://github.com/KnapsackPro/knapsack-pro-jest/blob/e6eca4868df9379ce17fe5df865302b11434803c/src/knapsack-pro-jest.ts#L29,L31) (`@knapsack-pro/core`) when you will use [core functionality](https://github.com/KnapsackPro/knapsack-pro-core-js/blob/master/src/knapsack-pro-core.ts) to connect with the API (for instance to run tests in Queue Mode).

Please note that Knapsack Pro Test Runner should [track recorded test files time execution in seconds](https://github.com/KnapsackPro/knapsack-pro-jest/blob/e6eca4868df9379ce17fe5df865302b11434803c/src/knapsack-pro-jest.ts#L68,L76) and pass it back to Knapsack Pro Core. It should also pass info whether [tests are green or red](https://github.com/KnapsackPro/knapsack-pro-jest/blob/e6eca4868df9379ce17fe5df865302b11434803c/src/knapsack-pro-jest.ts#L82) (failing). Thanks to that Knapsack Pro Core will [set proper process exit status](https://github.com/KnapsackPro/knapsack-pro-core-js/blob/0f44c6a3daa369cd4353e315abbf5539295289ea/src/knapsack-pro-core.ts#L124). When at least 1 test fails then the process exit status should be `1` so the CI provider will mark your CI build as a failed one.

## Testing your Knapsack Pro client

For testing your Knapsack Pro client I recommend creating a new project with tests in your testing framework (test runner). Here is an [example project with Jest tests](https://github.com/KnapsackPro/jest-example-test-suite#jest-example-test-suite-and-knapsackprocom).

You can create a [bin script that runs tests](https://github.com/KnapsackPro/jest-example-test-suite/blob/master/bin/knapsack_pro_jest) for a given CI node index using the Knapsack Pro client.

For instance use:

* `bin/knapsack_pro_jest 0 2` - run tests on CI node index `0`. The total number of CI nodes is `2`.
* `bin/knapsack_pro_jest 1 2` - run tests on CI node index `1`.

## README

It's good to create a well-documentented README for your packages. You can get inspired by checking documentation for:

* [`@knapsack-pro/core` readme](https://github.com/KnapsackPro/knapsack-pro-core-js#knapsack-procore)
* [`@knapsack-pro/jest` readme](https://github.com/KnapsackPro/knapsack-pro-jest#knapsack-projest)

## Extras - Regular Mode integration

If you would like to build the Knapsack Pro client that uses Regular Mode instead of Queue Mode you need to [replace the step with using Queue Mode](https://github.com/KnapsackPro/knapsack-pro-jest/blob/e6eca4868df9379ce17fe5df865302b11434803c/src/knapsack-pro-jest.ts#L89) and just use [Regular Mode API](/api/v1/#build_distributions_subset_post) instead. It's much simpler than Queue API.

In Regular Mode, you need to send a list of existing test files on the disk to the API. The API returns a set of test files to run. Once you execute the tests you need to [create a build subset](/api/v1/#build_subsets_post) record in the API.

## Summary

We covered how to build Knapsack Pro client integration from scratch based on the example of the existing JavaScript/TypeScript client built from 2 NPM packages `@knapsack-pro/core` and `@knapsack-pro/jest`.

I hope you find it useful. I recommend digging into the source code of the above packages. They are lightweight and should be easy to understand. You can replicate their behavior to build your integration with Knapsack Pro API.
