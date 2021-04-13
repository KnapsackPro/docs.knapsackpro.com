---
layout: post
title:  "How BitBucket Pipeline with parallel Cypress tests can speed up CI build"
date:   2021-04-14 08:00:00 +0200
author: "Artur Trzop"
categories: continuous_integration
og_image: "/images/blog/posts/how-bitbucket-pipeline-with-parallel-cypress-tests-can-speed-up-ci-build/bitbucket-cypress.jpeg"
---

Do you use BitBucket Pipeline as your CI server and you are struggling with slow E2E tests in Cypress? Did you know BitBucket Pipeline can run parallel steps? You can use it to distribute your browser tests across several parallel steps to execute end-to-end Cypress tests in a short amount of time.

<img src="/images/blog/posts/how-bitbucket-pipeline-with-parallel-cypress-tests-can-speed-up-ci-build/bitbucket-cypress.jpeg" style="width:300px;margin-left: 15px;float:right;" alt="BitBucket, Pipeline, CI, Cypress" />

## How to distribute tests in parallel

Distributing tests between parallel steps to spread the workload and run tests faster might be more challenging than you think. The question is how to divide Cypress test files between the parallel jobs in order to ensure the work is distributed evenly? But... is distributing work evenly what you actually want?

To get the shortest CI build time you want to utilize the available CI resources to the fullest. You want to avoid waste of time. This means you want to ensure the parallel steps will finish work at a similar time as this would mean there are no bottlenecks in CI machines utilization.

Many things are unknown and unpredictable. That can affect how long it will take to execute tests on BitBucket Pipeline. There is:

* time spent in boot time - loading your CI docker container
* loading npm/yarn dependencies from cache
* running Cypress tests
* tests can run against different browsers and this can affect how long the tests are executed
* sometimes tests can fail and their execution time is different
* other times you may have [flaky tests randomly failing](/2021/fix-intermittently-failing-ci-builds-flaky-tests-rspec) and you could use Test Retries in Cypress to automatically rerun failed test cases. This results in running a test file for longer.

All above compounds into an uncertain time. It's hard to predict how to exactly divide test files between the parallel steps to ensure the steps complete work at a similar time. But there is a solution to that - a dynamic test suite split during runtime.

## Queue Mode - a dynamic tests split

To distribute tests work between BitBucket Pipeline parallel steps you can use [Knapsack Pro](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-bitbucket-pipeline-with-parallel-cypress-tests-can-speed-up-ci-build) with a Queue Mode. You can use [`@knapsack-pro/cypress` npm package](https://github.com/KnapsackPro/knapsack-pro-cypress#knapsack-procypress) that will generate a Queue with a list of test files on the Knapsack Pro API side and then all parallel steps can connect to the queue to consume test files and execute them. This way parallel steps ask for more tests only after they finished executing a set of tests previously fetched from the Knapsack Pro API. You can learn about the [details of Queue Mode from the article](/2020/how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation).

## BitBucket Pipeline YML config

Here is an example of BitBucket Pipeline config in YML. As you can see here are 3 parallel steps to run Cypress tests via [Knapsack Pro](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-bitbucket-pipeline-with-parallel-cypress-tests-can-speed-up-ci-build). If you would like to run your tests on more parallel jobs you simply need to add more steps.

{% highlight yml %}
image: cypress/base:10
options:
  max-time: 30

# job definition for running E2E tests in parallel with KnapsackPro.com
e2e: &e2e
  name: Run E2E tests with @knapsack-pro/cypress
  caches:
    - node
    - cypress
  script:
    # run web application in the background
    - npm run start:ci &
    # env vars from https://support.atlassian.com/bitbucket-cloud/docs/variables-and-secrets/
    - export KNAPSACK_PRO_CI_NODE_BUILD_ID=$BITBUCKET_BUILD_NUMBER
    - export KNAPSACK_PRO_COMMIT_HASH=$BITBUCKET_COMMIT
    - export KNAPSACK_PRO_BRANCH=$BITBUCKET_BRANCH
    - export KNAPSACK_PRO_CI_NODE_TOTAL=$BITBUCKET_PARALLEL_STEP
    - export KNAPSACK_PRO_CI_NODE_INDEX=$BITBUCKET_PARALLEL_STEP_COUNT
    # https://github.com/KnapsackPro/knapsack-pro-cypress#configuration-steps
    - export KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true
    - $(npm bin)/knapsack-pro-cypress
  artifacts:
    # store any generates images and videos as artifacts
    - cypress/screenshots/**
    - cypress/videos/**

pipelines:
  default:
  - step:
      name: Install dependencies
      caches:
        - npm
        - cypress
        - node
      script:
        - npm ci
  - parallel:
    # run N steps in parallel
    - step:
        <<: *e2e
    - step:
        <<: *e2e
    - step:
        <<: *e2e

definitions:
  caches:
    npm: $HOME/.npm
    cypress: $HOME/.cache/Cypress
{% endhighlight %}

If you look for an example with a custom docker container for a parallel step please see [this one](https://gist.github.com/ArturT/90b7ec869e3827b580664beb086a8cd6).

Please remember to add API token in `KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS` environment variable as [secure variable](https://support.atlassian.com/bitbucket-cloud/docs/variables-and-secrets/).

## Summary

BitBucket Pipeline is a CI server that allows running scripts in parallel. You can use parallel steps to distribute your Cypress tests with [Knapsack Pro](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-bitbucket-pipeline-with-parallel-cypress-tests-can-speed-up-ci-build) to save time and run CI build as fast as possible.
