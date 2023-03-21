---
layout: post
title: "How to run Ruby on Rails tests on Github Actions using RSpec"
date: 2021-04-08 08:00:00 +0200
author: "Artur Trzop"
categories: continuous_integration
og_image: "/images/blog/posts/how-to-run-ruby-on-rails-tests-on-github-actions-using-rspec/github-ror.jpeg"
---

Are you thinking about migrating a Ruby on Rails project CI pipeline to Github Actions? You will learn how to configure the Rails app to run RSpec tests using Github Actions.

<img src="/images/blog/posts/how-to-run-ruby-on-rails-tests-on-github-actions-using-rspec/github-ror.jpeg" style="width:300px;margin-left: 15px;float:right;" alt="Github, Github Actions, RoR, Ruby on Rails, Ruby" />

This article covers a few things for Github Actions YAML config:

- how to use `ruby/setup-ruby` action to install Ruby gems with bundler and automatically cache gems. This way you can load Ruby gems for your project from the cache and run CI build fast.
- how to use Postgres on Github Actions
- how to use Redis on Github Actions
- how to use Github Actions build matrix to run parallel jobs and execute RSpec tests spread across multiple jobs to save time

## Github Actions YML config for Rails application

### ruby/setup-ruby action

[ruby/setup-ruby](https://github.com/ruby/setup-ruby) is an action that you can use to install a particular Ruby programming language version. It allows you to cache Ruby gems based on your Gemfile.lock out of the box.

It's recommended to [use `ruby/setup-ruby` instead of outdated `actions/setup-ruby`](/2021/how-to-load-ruby-gems-from-cache-on-github-actions).

{% highlight yml %}

- name: Set up Ruby
  uses: ruby/setup-ruby@v1
  with: # Not needed with a .ruby-version file
  ruby-version: 2.7 # runs 'bundle install' and caches installed gems automatically
  bundler-cache: true
  {% endhighlight %}

### How to configure Postgres on Github Actions

To use Postgres on Github Actions you need to set up a service for Postgres. I recommend using additional options that will configure Postgres to use RAM instead of disk. This way your database can run faster in a testing environment.

In the config below, we also pass the settings for doing a health check to ensure the database is up and running before you start running tests.

{% highlight yml %}

# If you need DB like PostgreSQL, Redis then define service below.

# https://github.com/actions/example-services/tree/master/.github/workflows

services:
postgres:
image: postgres:10.8
env:
POSTGRES_USER: postgres
POSTGRES_PASSWORD: ""
POSTGRES_DB: postgres
ports: - 5432:5432 # needed because the postgres container does not provide a healthcheck # tmpfs makes DB faster by using RAM
options: >-
--mount type=tmpfs,destination=/var/lib/postgresql/data
--health-cmd pg_isready
--health-interval 10s
--health-timeout 5s
--health-retries 5
{% endhighlight %}

### How to configure Redis on Github Actions

You can use Redis Docker container to start Redis server on Github Actions. See how simple it is:

{% highlight yml %}
services:
redis:
image: redis
ports: - 6379:6379
options: --entrypoint redis-server
{% endhighlight %}

### How to use Github Actions build matrix to run tests with parallel jobs

You can use the [build matrix](https://docs.github.com/en/actions/learn-github-actions/managing-complex-workflows#using-a-build-matrix) in Github Actions to run multiple jobs at the same time.

You will need to split test files between these parallel jobs. For that, you can use Knapsack Pro with [Queue Mode to distribute tests evenly between the jobs](/2020/how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation). This way you can ensure the proper amount of tests is executed on each job and the workload is well balanced between the jobs. Simply speaking this way you can make sure the CI build is as fast as possible - it has optimal execution time.

{% highlight yml %}
{% raw %}

- name: Run tests
  env:
  KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC: ${{ secrets.KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC }}
  KNAPSACK_PRO_CI_NODE_TOTAL: ${{ matrix.ci_node_total }}
  KNAPSACK_PRO_CI_NODE_INDEX: ${{ matrix.ci_node_index }}
  KNAPSACK_PRO_FIXED_QUEUE_SPLIT: true
  KNAPSACK_PRO_RSPEC_SPLIT_BY_TEST_EXAMPLES: true
  KNAPSACK_PRO_LOG_LEVEL: info
  run: |
  bundle exec rake knapsack_pro:queue:rspec
  {% endraw %}
  {% endhighlight %}

You can see that for RSpec we also use a `knapsack_pro` Ruby gem flag `KNAPSACK_PRO_RSPEC_SPLIT_BY_TEST_EXAMPLES`. It allows to automatically [detect slow test files and split them between parallel jobs](https://knapsackpro.com/faq/question/how-to-split-slow-rspec-test-files-by-test-examples-by-individual-it?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-run-ruby-on-rails-tests-on-github-actions-using-rspec).

You can learn more about it in a separate article explaining [how to run slow RSpec files on Github Actions with parallel jobs by doing an auto split of the spec file by test examples](/2020/how-to-run-slow-rspec-files-on-github-actions-with-parallel-jobs-by-doing-an-auto-split-of-the-spec-file-by-test-examples).

## Full YML config for Github Actions and Ruby on Rails project

Here is the full configuration of the CI pipeline for Github Actions. You can use it to run tests for your Rails project.

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
        # [n] - where the n is a number of parallel jobs you want to run your tests on.
        # Use a higher number if you have slow tests to split them between more parallel jobs.
        # Remember to update the value of the `ci_node_index` below to (0..n-1).
        ci_node_total: [8]
        # Indexes for parallel jobs (starting from zero).
        # E.g. use [0, 1] for 2 parallel jobs, [0, 1, 2] for 3 parallel jobs, etc.
        ci_node_index: [0, 1, 2, 3, 4, 5, 6, 7]

    env:
      RAILS_ENV: test
      GEMFILE_RUBY_VERSION: 2.7.2
      PGHOST: localhost
      PGUSER: postgres
      # Rails verifies the time zone in DB is the same as the time zone of the Rails app
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
          KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC: ${{ secrets.KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC }}
          KNAPSACK_PRO_CI_NODE_TOTAL: ${{ matrix.ci_node_total }}
          KNAPSACK_PRO_CI_NODE_INDEX: ${{ matrix.ci_node_index }}
          KNAPSACK_PRO_LOG_LEVEL: info
          # if you use Knapsack Pro Queue Mode you must set below env variable
          # to be able to retry CI build and run previously recorded tests
          # https://github.com/KnapsackPro/knapsack_pro-ruby#knapsack_pro_fixed_queue_split-remember-queue-split-on-retry-ci-node
          KNAPSACK_PRO_FIXED_QUEUE_SPLIT: true
          # RSpec split test files by test examples feature - it's optional
          # https://knapsackpro.com/faq/question/how-to-split-slow-rspec-test-files-by-test-examples-by-individual-it
          KNAPSACK_PRO_RSPEC_SPLIT_BY_TEST_EXAMPLES: true
        run: |
          bundle exec rake knapsack_pro:queue:rspec

{% endraw %}
{% endhighlight %}

## Summary

You've just learned how to set up your Rails application on Github Actions. I hope this will help you if you migrate your project from a different CI server to Github Actions.

You can learn more about [Knapsack Pro](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-run-ruby-on-rails-tests-on-github-actions-using-rspec) and how it can help you run tests fast using parallel jobs on CI. It works with RSpec, Cucumber, Minitest, and other Ruby test runners. [Knapsack Pro](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-run-ruby-on-rails-tests-on-github-actions-using-rspec) can also work with JavaScript test runners and has a native API integration.
