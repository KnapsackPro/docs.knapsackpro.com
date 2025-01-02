---
layout: post
title:  "Run Jest tests on GitHub Actions with optimal parallelization"
date:   2021-03-05 09:00:00 +0100
author: "Shadi Rezek"
categories: continuous_integration jest
og_image: "/images/blog/posts/run-jest-on-github-actions-with-parallelization/jest.png"
---

Jest is a powerful testing framework used in JavaScript projects. Besides vanilla JS, it's often used for React, NodeJS, Angular or Vue.js projects, among others. I am going to help you configure running your Jest test suite on GitHub Actions. We are going to use CI parallelization with Knapsack Pro, for maximum effectiveness. Let's begin.

<img src="/images/blog/posts/run-jest-on-github-actions-with-parallelization/jest.png" style="width:300px;margin-left: 15px;float:right;" alt="Jest" />

## Why parallelization

Splitting the test suites on multiple machines is a smart way to achieve short build times and increase your team's productivity. A _naïve_ division of work between multiple machines might result in fewer gains than anticipated though, due to possible bottlenecks (please refer to [this article](/2020/how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation){:target="_blank"} to learn more about the reasons behind it). This is where a _dynamic_ test distribution with [Knapsack Pro](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=run-jest-on-github-actions-with-parallelization) ([@knapsack-pro/jest](https://github.com/KnapsackPro/knapsack-pro-jest)) comes into play. It ensures you utilize your parallel CI nodes (a.k.a. parallel jobs) in the optimal way.

## Configuring GitHub Actions: Build Matrix

GitHub Actions is configured through a yaml config file residing in your repository. It should be placed in the: `.github/workflows` directory, e.g. `.github/workflows/main.yml`. When properly configured, your GH Actions builds will be visible in the _Actions_ tab in your GitHub repository page.

The Build Matrix is a powerful feature in GitHub Actions, which allows you to easily configure a combination of settings for running multiple jobs. Since we are concerned with simple parallelism for the purpose of this demonstration, our build matrix config is pretty straightforward:

{% highlight yml %}
strategy:
  fail-fast: false
  matrix:
    ci_node_total: [4]
    ci_node_index: [0, 1, 2, 3]
{% endhighlight %}


For the `ci_node_total` key, we always provide a single-element list. The value should be equal to the number of parallel nodes you are going to use.

The `ci_node_index` key should contain a list of indexes of your CI nodes. We are using zero-based numbering, so the list will essentially be a `0..n-1` range, where `n` is the number of your parallel nodes (used as a value in `ci_node_total`). For `ci_node_total: [2]`, the `ci_node_index` would be `[0, 1]`. For `ci_node_total: [3]`, it would be `[0, 1, 2]`, and so on.

The above config would result in running 4 parallel nodes (jobs) on GitHub Actions. GitHub combines the provided lists into a matrix (hence the name) to determine this. As a result, the 4 parallel nodes would have these settings:

- `{matrix.ci_node_total: 4, matrix.ci_node_index: 0}`
- `{matrix.ci_node_total: 4, matrix.ci_node_index: 1}`
- `{matrix.ci_node_total: 4, matrix.ci_node_index: 2}`
- `{matrix.ci_node_total: 4, matrix.ci_node_index: 3}`


This is exactly what we need to pass to the Knapsack Pro API to run the Queue correctly. Here's the config step for running your Jest test suite on each node:

{% highlight yml %}
{% raw %}
- name: Run tests with Knapsack Pro
  env:
    KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST: ${{ secrets.KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST }}
    KNAPSACK_PRO_CI_NODE_TOTAL: ${{ matrix.ci_node_total }}
    KNAPSACK_PRO_CI_NODE_INDEX: ${{ matrix.ci_node_index }}
    KNAPSACK_PRO_FIXED_QUEUE_SPLIT: true
  run: |
    $(npm bin)/knapsack-pro-jest
{% endraw %}
{% endhighlight %}

Notice how we use the previously defined values of `matrix.ci_node_total` and `matrix.ci_node_index` to set the `KNAPSACK_PRO_CI_NODE_TOTAL` and `KNAPSACK_PRO_CI_NODE_INDEX` variables, respectively.

Apart from these two, there are two additional variables defined: `KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST` and `KNAPSACK_PRO_FIXED_QUEUE_SPLIT`.

`KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST` is a token needed for Knapsack API authorization. It's pulled from GitHub secrets set in your project's repository. You can access your secrets in the Settings -> Secrets on your repo's GH page.

To view or generate Knapsack API token for your project, head over to [Knapsack User's Dashboard](https://knapsackpro.com/sessions?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=run-jest-on-github-actions-with-parallelization) (you may need to sign up for an account if you don't have one). Save your API token in your GitHub Secrets as `KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST`.

The other variable, `KNAPSACK_PRO_FIXED_QUEUE_SPLIT` needs to be set to `true`. This will ensure the retry functionality on GitHub Actions works correctly with Knapsack API.

Here's a full example config for Jest test suite on GitHub Actions:

{% highlight yml %}
{% raw %}
# .github/workflows/main.yaml
name: Main

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      fail-fast: false
      matrix:
        node-version: [8.x]
        # [n] - where the n is a number of parallel jobs you want to run your tests on.
        # Use a higher number if you have slow tests to split them between more parallel jobs.
        # Remember to update the value of the `ci_node_index` below to (0..n-1).
        ci_node_total: [4]
        # Indexes for parallel jobs (starting from zero).
        # E.g. use [0, 1] for 2 parallel jobs, [0, 1, 2] for 3 parallel jobs, etc.
        ci_node_index: [0, 1, 2, 3]

    steps:
      - uses: actions/checkout@v1

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}

      - name: npm install and build
        run: |
          npm install
          npm run build --if-present

      - name: Run tests with Knapsack Pro
        env:
          KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST: ${{ secrets.KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST }}
          KNAPSACK_PRO_CI_NODE_TOTAL: ${{ matrix.ci_node_total }}
          KNAPSACK_PRO_CI_NODE_INDEX: ${{ matrix.ci_node_index }}
          # necessary for rerunning the same build to work correctly
          KNAPSACK_PRO_FIXED_QUEUE_SPLIT: true
        run: |
          $(npm bin)/knapsack-pro-jest --runInBand
{% endraw %}
{% endhighlight %}

## Running your builds

When your GitHub Actions is properly set up, it's going to run your build when you push new changes to the repository. You can now enjoy the optimal parallelization of your Jest tests.

To see how Knapsack is splitting your test suite, visit the [User Dashboard](https://knapsackpro.com/sessions?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=run-jest-on-github-actions-with-parallelization). The GitHub Actions builds will also be visible under the _Actions_ tab in your project's repository on GH.

Anything unclear? Leave a comment below or go ahead and [contact us](https://knapsackpro.com/contact?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=run-jest-on-github-actions-with-parallelization) about your problem. We'll be happy to help!
