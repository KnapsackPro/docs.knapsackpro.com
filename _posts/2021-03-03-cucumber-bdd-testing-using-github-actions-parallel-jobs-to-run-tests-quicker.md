---
layout: post
title:  "Cucumber BDD testing using Github Actions parallel jobs to run tests quicker"
date:   2021-03-03 08:00:00 +0100
author: "Artur Trzop"
categories: continuous_integration
og_image: "/images/blog/posts/cucumber-bdd-testing-using-github-actions-parallel-jobs-to-run-tests-quicker/cucumber-octocat-github.jpeg"
---

Cucumber employs Behavior-Driven Development (BDD) for testing your application. This type of test is often time-consuming when running in the browser. You will learn how to run Cucumber tests on Github Actions using parallel jobs to execute the test suite much faster.

<img src="/images/blog/posts/cucumber-bdd-testing-using-github-actions-parallel-jobs-to-run-tests-quicker/cucumber-octocat-github.jpeg" style="width:200px;margin-left: 15px;float:right;" alt="cucumber, github, octocat" />

## Github Actions matrix strategy

You can use the [Github Actions matrix strategy](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstrategymatrix) to run parallel jobs. You will need to divide your Cucumber test files between the parallel jobs in a way that work will be balanced out between the jobs.

It's not that simple to do because often Cucumber tests can take a different amount of time. One test file can have many test cases, the other can have only a few but very complex ones, etc.

There are often more steps in your CI pipeline like installing dependencies, loading data from the cache and each step can take a different amount of time per parallel job before even Cucumber tests are started. The steps affect the overall CI build speed.

<img src="/images/blog/posts/how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation/not-optimal-tests-split.png" style="width:100%;" alt="not optimal tests split on CI server, CI parallelism" />

What you would like to achieve is to run parallel jobs in a way that they always finish the execution of Cucumber tests at a similar time. Thanks to that you will avoid lagging jobs that could be a bottleneck in your CI build.

<img src="/images/blog/posts/how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation/optimal-tests-split.png" style="width:100%;" alt="optimal tests split on CI server, CI parallelism" />

## Dynamically split Cucumber tests using Queue Mode

To get optimal CI build execution time you need to ensure the work between parallel jobs is split in such a way to avoid bottleneck slow job.
To achieve that you can split Cucumber test files in a dynamic way between the parallel jobs using [Knapsack Pro](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=cucumber-bdd-testing-using-github-actions-parallel-jobs-to-run-tests-quicker) Queue Mode and `knapsack_pro` ruby gem.

Knapsack Pro API will take care of coordinating how tests are divided between parallel jobs. On the API side, there is a Queue with a list of your test files and each parallel job on Github Actions is running Cucumber tests via the `knapsack_pro` Ruby gem. The `knapsack_pro` gem asks Queue API for a set of test files to run and after it gets executed then the gem asks for another set of test files until the Queue is consumed. This ensures the all parallel jobs finish running tests at a very similar time so that you can avoid bottleneck jobs.

<img src="/images/blog/posts/how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation/knapsack-pro-cloud-v2.png" style="width:70%;display:block;margin:0 auto;" alt="tests split on CI server with Knapsack Pro Queue Mode, CI parallelism" />

You can learn more about the [dynamic tests suite split in Queue Mode](/2020/how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation) or check the video below.

<iframe width="560" height="315" src="https://www.youtube.com/embed/hUEB1XDKEFY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Github Actions parallel jobs config for Cucumber

Here is the full Github Actions YAML config example for the Cucumber test suite in a Ruby on Rails project using `knapsack_pro` gem to run Cucumber tests between parallel jobs.

{% highlight yml %}
{% raw %}
# .github/workflows/main.yml
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

    steps:
      - uses: actions/checkout@v2

      - name: Set up Ruby
        uses: actions/setup-ruby@v1
        with:
          ruby-version: 2.7

      - uses: actions/cache@v2
        with:
          path: vendor/bundle
          key: ${{ runner.os }}-gems-${{ hashFiles('**/Gemfile.lock') }}
          restore-keys: |
            ${{ runner.os }}-gems-

      - name: Bundle install
        env:
          RAILS_ENV: test
        run: |
          bundle config path vendor/bundle
          bundle install --jobs 4 --retry 3

      - name: Create DB
        env:
          # use localhost for the host here because we have specified a container for the job.
          # If we were running the job on the VM this would be postgres
          PGHOST: localhost
          PGUSER: postgres
          RAILS_ENV: test
        run: |
          bin/rails db:prepare

      - name: Run tests
        env:
          PGHOST: localhost
          PGUSER: postgres
          RAILS_ENV: test
          KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER: ${{ secrets.KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER }}
          KNAPSACK_PRO_CI_NODE_TOTAL: ${{ matrix.ci_node_total }}
          KNAPSACK_PRO_CI_NODE_INDEX: ${{ matrix.ci_node_index }}
          KNAPSACK_PRO_FIXED_QUEUE_SPLIT: true
          KNAPSACK_PRO_LOG_LEVEL: info
        run: |
          bundle exec rake knapsack_pro:queue:cucumber
{% endraw %}
{% endhighlight %}

Here is the view from Github Actions showing that we run 8 parallel jobs for the CI build.

<img src="/images/blog/posts/cucumber-bdd-testing-using-github-actions-parallel-jobs-to-run-tests-quicker/github-actions-parallel-jobs.png" style="display:block;margin:0 auto;" alt="Github Actions, parallel jobs, CI, testing" />

## Summary

I hope you find this example useful. If you would like to learn more about [Knapsack Pro please check our homepage](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=cucumber-bdd-testing-using-github-actions-parallel-jobs-to-run-tests-quicker) and see a list of [supported test runners for parallel testing in Ruby, JavaScript, etc](/integration/).
