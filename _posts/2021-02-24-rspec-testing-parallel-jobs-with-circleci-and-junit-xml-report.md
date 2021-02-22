---
layout: post
title:  "RSpec testing parallel jobs with CircleCI and JUnit XML report"
date:   2021-02-24 08:00:00 +0100
author: "Artur Trzop"
categories: techtips continuous_integration
og_image: "/images/blog/posts/rspec-testing-parallel-jobs-with-circleci-and-junit-xml-report/rspec_circleci.jpeg"
---

You will learn how to run RSpec tests for your Ruby on Rails project on CircleCI with parallel jobs to shorten the running time of your CI build. Moreover, you will learn how to configure JUnit formatter to generate an XML report for your tests to show failing RSpec test examples nicely in CircleCI web UI. Finally, you will see how to automatically detect slow spec files and divide their test examples between parallel jobs to eliminate the bottleneck job that's taking too much time to run tests.

<img src="/images/blog/posts/rspec-testing-parallel-jobs-with-circleci-and-junit-xml-report/rspec_circleci.jpeg" style="width:300px;margin-left: 15px;float:right;" alt="RSpec, CircleCI, Ruby, gem" />

## Ruby gems to configure your RoR project

Here are the key elements you need:

* [rspec_junit_formatter](https://github.com/sj26/rspec_junit_formatter) - it's a ruby gem that generates an XML report for executed tests with information about test failures. This report can be automatically read by CircleCI to present it in CircleCI web UI. No more browsing through long RSpec output - just look at highlighted failing specs in the `TESTS` tab :)

<img src="/images/blog/posts/rspec-testing-parallel-jobs-with-circleci-and-junit-xml-report/circleci_web_ui_failed_test.png" alt="CircleCI web UI, failure, RSpec, test, test case" />

* [knapsack_pro](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=rspec-testing-parallel-jobs-with-circleci-and-junit-xml-report) - it's a Ruby gem for running tests on parallel CI jobs to ensure all jobs finish work at a similar time to save you as much time as possible and eliminate bottlenecks.
  * It uses the [Queue Mode to dynamically split test files between parallel jobs](/2020/how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation).
  * Knapsack Pro can also [detect your slow RSpec test files and divide them between parallel jobs by test examples](https://knapsackpro.com/faq/question/how-to-split-slow-rspec-test-files-by-test-examples-by-individual-it?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=rspec-testing-parallel-jobs-with-circleci-and-junit-xml-report). You don't have to manually split your big spec file into smaller files if you want to split work between parallel container on CircleCI :)

Just add the above gems to your `Gemfile`.

{% highlight ruby %}
group :test do
  gem 'rspec'
  gem 'rspec_junit_formatter'
end

group :test, :development do
  gem 'knapsack_pro'
end
{% endhighlight %}

For [Knapsack Pro you will need an API token](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=rspec-testing-parallel-jobs-with-circleci-and-junit-xml-report) and you need to follow the [installation guide](/knapsack_pro-ruby/guide/) to configure your project.

If you use `knapsack_pro` gem in Queue Mode with CircleCI you may want to collect metadata like JUnit XML report about your RSpec test suite.
The important step for CircleCI is to copy the XML report to `$CIRCLE_TEST_REPORTS` directory. Below is a full config for your `spec_helper.rb` file ([source code from FAQ](https://knapsackpro.com/faq/question/how-to-use-junit-formatter?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=rspec-testing-parallel-jobs-with-circleci-and-junit-xml-report#how-to-use-junit-formatter-with-knapsack_pro-queue-mode)):

{% highlight ruby %}
# spec_helper.rb or rails_helper.rb

# This must be the same path as value for rspec --out argument
# Note: the path should not contain '~' sign, for instance path ~/project/tmp/rspec.xml may not work.
# Please use full path instead.
TMP_RSPEC_XML_REPORT = 'tmp/rspec.xml'
# move results to FINAL_RSPEC_XML_REPORT
# so that the results won't accumulate with duplicated xml tags in TMP_RSPEC_XML_REPORT
FINAL_RSPEC_XML_REPORT = 'tmp/rspec_final_results.xml'

KnapsackPro::Hooks::Queue.after_subset_queue do |queue_id, subset_queue_id|
  if File.exist?(TMP_RSPEC_XML_REPORT)
    FileUtils.mv(TMP_RSPEC_XML_REPORT, FINAL_RSPEC_XML_REPORT)
  end
end
{% endhighlight %}

You need the above logic in place to move the XML report from one place to another to avoid corruption of your XML file. When Knapsack Pro in Queue Mode runs your tests then it fetches a set of test files from Knapsack Pro Queue API and runs it and generates the XML report. After that, another set of test files is fetched from Queue API and the XML report is updated on the disk. If the report already exists on the disk it can get corrupted due to overriding the same file. That's why you need to move the file to a different location after each set of tests from Queue API is executed.

## CircleCI YML configuration for RSpec

Here is the complete CircleCI YML config file for RSpec, Knapsack Pro and JUnit formatter.

{% highlight yml %}
# Ruby CircleCI 2.0 configuration file
#
# Check https://circleci.com/docs/2.0/language-ruby/ for more details
#
version: 2
jobs:
  build:
    parallelism: 10
    # https://circleci.com/docs/2.0/configuration-reference/#resource_class
    resource_class: small
    docker:
      # specify the version you desire here
      - image: circleci/ruby:2.7.1-node-browsers
        environment:
          PGHOST: 127.0.0.1
          PGUSER: my_db_user
          RAILS_ENV: test
          # Split slow RSpec test files by test examples
          # https://knapsackpro.com/faq/question/how-to-split-slow-rspec-test-files-by-test-examples-by-individual-it
          KNAPSACK_PRO_RSPEC_SPLIT_BY_TEST_EXAMPLES: true

      # Specify service dependencies here if necessary
      # CircleCI maintains a library of pre-built images
      # documented at https://circleci.com/docs/2.0/circleci-images/
      - image: circleci/postgres:10.6-alpine-ram
        environment:
          POSTGRES_DB: my_db_name
          POSTGRES_PASSWORD: ""
          POSTGRES_USER: my_db_user
          # Rails verifies Time Zone in DB is the same as time zone of the Rails app
          TZ: "Europe/Warsaw"

      - image: redis:6.0.7

    working_directory: ~/repo
    environment:
      TZ: "Europe/Warsaw"

    steps:
      - checkout

      # Download and cache dependencies
      - restore_cache:
          keys:
          - v2-dependencies-bundler-{{ checksum "Gemfile.lock" }}-{{ checksum ".ruby-version" }}
          # fallback to using the latest cache if no exact match is found
          - v2-dependencies-bundler-

      - run:
          name: install ruby dependencies
          command: |
            bundle install --jobs=4 --retry=3 --path vendor/bundle

      - save_cache:
          paths:
            - ./vendor/bundle
          key: v2-dependencies-bundler-{{ checksum "Gemfile.lock" }}-{{ checksum ".ruby-version" }}

      # Database setup
      - run: bin/rails db:prepare

      - run:
          name: run tests
          command: |
            export CIRCLE_TEST_REPORTS=/tmp/test-results
            mkdir $CIRCLE_TEST_REPORTS
            bundle exec rake "knapsack_pro:queue:rspec[--format documentation --format RspecJunitFormatter --out tmp/rspec.xml]"

      # collect reports
      - store_test_results:
          path: /tmp/test-results
      - store_artifacts:
          path: /tmp/test-results
          destination: test-results
{% endhighlight %}

## Summary

You've just learned how to make your CircleCI builds way faster! Now your RSpec tests can be automatically run on many parallel machines to save you time. Please let us know if it was helpful or if you have any questions. Feel free to [sign up at Knapsack Pro](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=rspec-testing-parallel-jobs-with-circleci-and-junit-xml-report) or down below and try it yourself. 
