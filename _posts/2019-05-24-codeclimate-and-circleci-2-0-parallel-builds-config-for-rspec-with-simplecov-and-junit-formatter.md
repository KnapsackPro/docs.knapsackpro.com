---
layout: post
title: "CodeClimate and CircleCI 2.0 parallel builds config for RSpec with SimpleCov and JUnit formatter"
date: 2019-05-24 20:00:00 +0200
author: "Artur Trzop"
categories: techtips CircleCI CodeClimate simplecov Ruby Rails
og_image: "/images/blog/posts/codeclimate-and-circleci-2-0-parallel-builds-config-for-rspec-with-simplecov-and-junit-formatter/codeclimate.jpg"
---

How to merge CodeClimate reports for your RSpec test suite executed with parallel builds on CircleCI 2.0? You will learn how to run RSpec parallel tests for your for Ruby on Rails project using [CircleCI](https://knapsackpro.com/ci_servers/circle-ci?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=codeclimate-and-circleci-2-0-parallel-builds-config-for-rspec-with-simplecov-and-junit-formatter) and how to send test coverage merged from parallel jobs into CodeClimate. We will cover config examples for:

<img src="/images/blog/posts/codeclimate-and-circleci-2-0-parallel-builds-config-for-rspec-with-simplecov-and-junit-formatter/codeclimate.jpg" style="width:300px;margin-left: 15px;float:right;" alt="CodeClimate" />

- How to use SimpleCov needed by CodeClimate Test Reporter to prepare RSpec test coverage summary on each parallel job and then how to merge it so you will be able to send it to CodeClimate dashboard.

- How to use JUnit formatter for RSpec running on parallel jobs. Thanks to JUnit formatter you can see nice tests results in CircleCI UI view. For instance, when your tests fail then [CircleCI](https://knapsackpro.com/ci_servers/circle-ci?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=codeclimate-and-circleci-2-0-parallel-builds-config-for-rspec-with-simplecov-and-junit-formatter) will show you failing tests at the top of your CI build steps.

- How to <a href="https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=codeclimate-and-circleci-2-0-parallel-builds-config-for-rspec-with-simplecov-and-junit-formatter">split your RSpec tests across parallel jobs using Knapsack Pro Queue Mode</a>. At the end of the article, you will see a video explaining how Queue Mode in knapsack_pro ruby gem dynamically distributes specs across parallel jobs to ensure each job takes a similar amount of time to ensure CI build is as fast as possible (to get you optimal CI build time).

## CodeClimate and parallel builds on CircleCI 2.0

Let's start with the full YAML config for CircleCI 2.0. You will find comment for each important step and what it does. You may have already configured some of the stuff in your project so looking at a full example below might be more familiar to you. If you are just adding CodeClimate to your project for the first time then except below config you will need to setup simplecov gem and it's covered in next section.

Here is the full CircleCI 2.0 example for parallel builds using RSpec and CodeClimate.

{% highlight yaml %}
# .circleci/config.yml

version: 2
jobs:
  build:
    # Specify the number of parallel jobs to run. Increasing the parallelism speeds your CI build.
    parallelism: 2
    docker:
      # specify the version you desire here
      - image: circleci/ruby:2.6.3-node-browsers
        environment:
          PGHOST: 127.0.0.1
          PGUSER: rails-app-with-knapsack_pro
          RAILS_ENV: test
          RACK_ENV: test

          # API token should be set in CircleCI environment variables settings instead of here
          # KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC: rspec-token

      # Specify service dependencies here if necessary
      # CircleCI maintains a library of pre-built images
      # documented at https://circleci.com/docs/2.0/circleci-images/
      - image: circleci/postgres:9.4.12-alpine
        environment:
          POSTGRES_DB: rails-app-with-knapsack_pro_test
          POSTGRES_PASSWORD: ""
          POSTGRES_USER: rails-app-with-knapsack_pro

    working_directory: ~/repo

    steps:
      - checkout

      - run:
          name: Install Code Climate Test Reporter
          command: |
            curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64 > ./cc-test-reporter
            chmod +x ./cc-test-reporter
      - run: ./cc-test-reporter before-build

      # Download and cache dependencies
      - restore_cache:
          keys:
          # NOTE: remove space between { { here and in all below examples
          - v2-dependencies-bundler-{ { checksum "Gemfile.lock" }}
          # fallback to using the latest cache if no exact match is found
          - v2-dependencies-bundler-

      - run:
          name: install ruby dependencies
          command: |
            bundle install --jobs=4 --retry=3 --path vendor/bundle

      - save_cache:
          paths:
            - ./vendor/bundle
          # NOTE: remove space between { { here
          key: v2-dependencies-bundler-{ { checksum "Gemfile.lock" }}

      # wait for postgres to be available
      - run: dockerize -wait tcp://localhost:5432 -timeout 1m
      # Database setup
      - run: bin/rails db:setup

      # Run RSpec tests with knapsack_pro Queue Mode and use junit formatter
      # junit formatter must be configured as described in FAQ for knapsack_pro Queue Mode
      # this is also described in this article later
      # https://docs.knapsackpro.com/ruby/circleci/#collect-metadata-in-queue-mode
      - run:
          name: run tests
          command: |
            mkdir -p /tmp/test-results
            bundle exec rake "knapsack_pro:queue:rspec[--format documentation --format RspecJunitFormatter --out /tmp/test-results/rspec.xml]"

      - run:
          name: Code Climate Test Coverage
          command: |
            ./cc-test-reporter format-coverage -t simplecov -o "coverage/codeclimate.$CIRCLE_NODE_INDEX.json"

      # store coverage directory with CodeClimate reports prepared based on simplecov reports
      # it's special step used to persist a temporary file to be used by another job in the workflow
      - persist_to_workspace:
          root: coverage
          paths:
            - codeclimate.*.json

      # store test reports created with junit formatter in order to allow CircleCI
      # show info about executed tests in UI on top of CI build steps
      - store_test_results:
          path: /tmp/test-reports

      # store test reports created with junit formatter in order to allow CircleCI
      # let you browse recorded xml files in Artifacts tab
      - store_artifacts:
          path: /tmp/test-reports

  upload-coverage:
    docker:
      - image: circleci/ruby:2.6.3-node
    environment:
      # you can add your CodeClimate test report ID here or in CircleCI
      # settings for environment variables
      CC_TEST_REPORTER_ID: use-here-your-codeclimate-test-report-id
    working_directory: ~/repo

    steps:
      # This will restore files from persist_to_workspace step
      # Thanks to it we will have access to CodeClimate test coverage files from
      # each parallel job. We need them in order to merge it into one file in next step.
      - attach_workspace:
          at: ~/repo
      - run:
          name: Install Code Climate Test Reporter
          command: |
            curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64 > ./cc-test-reporter
            chmod +x ./cc-test-reporter
      - run:
          # merge CodeClimate files from each parallel job into sum coverage
          # and then upload it to CodeClimate dashboard
          command: |
            ./cc-test-reporter sum-coverage --output - codeclimate.*.json | ./cc-test-reporter upload-coverage --debug --input -

workflows:
  version: 2

  commit:
    jobs:
      # run our CI build with tests
      - build
      # once CI build is completed then we merge CodeClimate reports
      # from each parallel job and upload summary coverage to CodeClimate
      - upload-coverage:
          requires:
             - build
{% endhighlight %}

## SimpleCov configuration for RSpec

When you use [simplecov](https://github.com/colszowka/simplecov) gem in order to create test coverage for RSpec then you need to remember about one additional thing when you want to run tests in parallel on many CircleCI jobs. You set a unique name for the simplecov report with `SimpleCov.command_name`.

{% highlight ruby %}
# spec/rails_helper.rb or spec/spec_helper.rb

require 'simplecov'
SimpleCov.start

# this is needed when you use knapsack_pro Queue Mode
KnapsackPro::Hooks::Queue.before_queue do
  SimpleCov.command_name("rspec_ci_node_#{KnapsackPro::Config::Env.ci_node_index}")
end
{% endhighlight %}

## JUnit formatter for RSpec

In order to show in CircleCI UI info about your test suite like failed tests, you need to generate xml report for your RSpec test suite using JUnit formatter.

You can use junit formatter for RSpec thanks to gem [rspec_junit_formatter](https://github.com/sj26/rspec_junit_formatter).

{% highlight ruby %}
# knapsack_pro Queue Mode

bundle exec rake "knapsack_pro:queue:rspec[--format documentation --format RspecJunitFormatter --out /tmp/test-reports/rspec.xml]"
{% endhighlight %}

The xml report will contain all tests executed on a CI node.

[Learn more in docs](https://docs.knapsackpro.com/ruby/circleci/#collect-metadata-in-queue-mode).

## Summary and Queue Mode to do dynamic test suite split

CI builds can be much faster thanks to leveraging parallel jobs on Circle CI 2.0 and CI parallelisation on any CI provider (see more <a href="/continuous_integration/">parallelisation examples for your CI providers</a>). You can check <a href="https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=codeclimate-and-circleci-2-0-parallel-builds-config-for-rspec-with-simplecov-and-junit-formatter">Knapsack Pro tool for CI parallelisation</a> and learn more about Queue Mode and what problems it solves in below video.

<iframe width="560" height="315" src="https://www.youtube.com/embed/hUEB1XDKEFY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

[Installation guide for knapsack_pro gem](/knapsack_pro-ruby/guide/) can be found here in order to setup your RSpec test suite.
