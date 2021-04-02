---
layout: post
title:  "Run Minitest on Github Actions with parallel jobs using build matrix"
date:   2021-04-06 08:00:00 +0100
author: "Artur Trzop"
categories: continuous_integration
og_image: "/images/blog/posts/run-minitest-on-github-actions-with-parallel-jobs-using-build-matrix/github-minitest.jpeg"
---

How to run Ruby on Rails tests in Minitest on Github Actions? What to do if tests are slow? How to manage complex workflows? You can use Github Actions build matrices to divide Minitest files between jobs and run the test suite much faster.

<img src="/images/blog/posts/run-minitest-on-github-actions-with-parallel-jobs-using-build-matrix/github-minitest.jpeg" style="width:300px;margin-left: 15px;float:right;" alt="Minitest, Ruby, Github, Github Actions" />

If your Minitest tests are taking dozen minutes and you would like to save some time for your Ruby engineering team then you could use tests parallelization on your CI server.

To run tests as fast as possible you need to split them into equal buckets (into parallel jobs). But how to do it? Some of the test files can be super fast to execute, other Minitest files can take minutes if they run system tests (E2E tests).

There is also an aspect of preparing the test environment for each parallel job. By preparing I mean you need to clone a repository, install ruby gems or load them from a cache, maybe you need to load some docker container, etc. This can take various times on each parallel job. Random network errors happen like network delay to [load cached gems](/2021/how-to-load-ruby-gems-from-cache-on-github-actions), or maybe Github Actions from time to time will start one of your jobs late comparing to others. It's an inevitable issue in the network environment and can cause your tests to run a different amount of time on each parallel job. This is visible on the graph below and it causes the CI build to be slower.

<img src="/images/blog/posts/how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation/not-optimal-tests-split.png" style="width:100%;" alt="not optimal tests split on CI server, CI parallelism" />

In a perfect scenario you would like to cover all those problems and no matter what still be able to split Minitest work in parallel jobs in a way that ensures the tests on each parallel job completes at a similar time. This guarantees no bottlenecks. The perfect tests split is on the below graph.

<img src="/images/blog/posts/how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation/optimal-tests-split.png" style="width:100%;" alt="optimal tests split on CI server, CI parallelism" />

## Split tests in a dynamic way with Queue Mode

You can use [Knapsack Pro](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=run-minitest-on-github-actions-with-parallel-jobs-using-build-matrix) Queue Mode to split tests in a dynamic way between parallel jobs. This way each job consumes tests from a queue until the queue is empty. Simply speaking this allows you to utilize your CI server resources efficiently and run tests in optimal time.

I described [how Queue Mode splits Ruby and JavaScript tests in parallel with a dynamic test suite split](/2020/how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation). You can learn from that article about it.

## Github Actions build matrix to run parallel tests

Github Actions has [build matrix feature](https://docs.github.com/en/actions/learn-github-actions/managing-complex-workflows#using-a-build-matrix) that allows running many jobs at the same time. You can use it to run your Minitest tests between parallel jobs.

Below is a full Github Actions YML config for a Rails project and Minitest.
The tests are split with `knapsack_pro` Ruby gem and Queue Mode.

{% highlight yml %}
{% raw %}
name: Main

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest

    # If you need DB like PostgreSQL, Redis then define service below.
    # https://github.com/actions/example-services/tree/master/.github/workflows
    services:
      postgres:
        image: postgres:10.8
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: ""
          POSTGRES_DB: postgres
        ports:
          - 5432:5432
        # needed because the postgres container does not provide a healthcheck
        # tmpfs makes DB faster by using RAM
        options: >-
          --mount type=tmpfs,destination=/var/lib/postgresql/data
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis
        ports:
          - 6379:6379
        options: --entrypoint redis-server

    # https://help.github.com/en/articles/workflow-syntax-for-github-actions#jobsjob_idstrategymatrix
    strategy:
      fail-fast: false
      matrix:
        # Set N number of parallel jobs you want to run tests on.
        # Use higher number if you have slow tests to split them on more parallel jobs.
        # Remember to update ci_node_index below to 0..N-1
        ci_node_total: [8]
        # set N-1 indexes for parallel jobs
        # When you run 2 parallel jobs then first job will have index 0, the second job will have index 1 etc
        ci_node_index: [0, 1, 2, 3, 4, 5, 6, 7]

    env:
      RAILS_ENV: test
      PGHOST: localhost
      PGUSER: postgres
      # Rails verifies Time Zone in DB is the same as time zone of the Rails app
      TZ: "Europe/Warsaw"

    steps:
      - uses: actions/checkout@v2

      - name: Set up Ruby
        uses: ruby/setup-ruby@v1
        with:
          # Not needed with a .ruby-version file
          ruby-version: 2.7
          # runs 'bundle install' and caches installed gems automatically
          bundler-cache: true

      - name: Create DB
        run: |
          bin/rails db:prepare
      - name: Run tests
        env:
          KNAPSACK_PRO_TEST_SUITE_TOKEN_MINITEST: ${{ secrets.KNAPSACK_PRO_TEST_SUITE_TOKEN_MINITEST }}
          KNAPSACK_PRO_CI_NODE_TOTAL: ${{ matrix.ci_node_total }}
          KNAPSACK_PRO_CI_NODE_INDEX: ${{ matrix.ci_node_index }}
          KNAPSACK_PRO_FIXED_QUEUE_SPLIT: true
          KNAPSACK_PRO_LOG_LEVEL: info
        run: |
          bundle exec rake knapsack_pro:queue:minitest
{% endraw %}
{% endhighlight %}

## Summary

As you can see the slow Minitest test suite is no longer an issue for you. QA, Testers, or Automation Engineers can benefit from improving the CI build speed and allowing their software developers team to deliver products faster. You can learn more at [Knapsack Pro](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=run-minitest-on-github-actions-with-parallel-jobs-using-build-matrix).
