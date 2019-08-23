---
layout: post
title:  "Run parallel jobs on Semaphore CI 2.0 to get faster CI build time"
date:   2019-03-16 15:00:00 +0100
author: "Artur Trzop"
categories: continuous_integration semaphore Ruby Rails JavaScript Node
og_image: "/images/blog/posts/run-parallel-jobs-on-semaphore-ci-2-0-to-get-faster-ci-build-time/semaphore-ci-logo.png"
---

Semaphore CI 2.0 allows configuring your CI build task with parallel jobs. This way you can run simultaneously a few different commands that do not depend on each other. But we could also use parallel jobs to split your test suite across a few jobs and this way save time. I will show you how to speed up your CI build for Ruby or JavaScript project (Rails / Node project).

<img src="/images/blog/posts/run-parallel-jobs-on-semaphore-ci-2-0-to-get-faster-ci-build-time/semaphore-ci-logo.png" style="width:300px;margin-left: 15px;float:right;" />

With <a href="https://semaphoreci.com" target="_blank" rel="nofollow">Semaphore CI 2.0</a> you don't pay for a reserved amount of containers that can be run in parallel as in some other CI providers. Instead, they count the amount of work time spent on running containers. This creates an incentive to run more parallel jobs to execute our tests fast and still keep bill at a similar level as if we would just run all tests in single container waisting our own time.

## Let's save time with parallel jobs

In order to run parallel jobs with our tests in an optimal way we need to ensure each job will finish work at a similar time. This way there will be no bottleneck like job executing too many tests or too slow tests. The slow job could affect and made our whole CI build slower. Especially end to end tests (E2E) can be very slow and their time execution can vary. 

You can split tests across parallel jobs in a dynamic way to ensure all jobs complete work at a similar time using the <a href="https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog&utm_campaign=run-parallel-jobs-on-semaphore-ci-2-0-to-get-faster-ci-build-time">Knapsack Pro Queue Mode</a>. You can learn more about what else problems can be solved with Queue Mode in the video at the very end of this article but right now let's jump to the Semaphore CI 2.0 demo example and the config examples we could use.

<iframe width="560" height="315" src="https://www.youtube.com/embed/-oKCIYSk6yg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Here you can find Semaphore CI 2.0 config for projects using:

* <a href="#ruby-on-rails-config-for-semaphore-20">Ruby on Rails</a> (RSpec, other tests runners like Minitest, Cucumber and so on are also supported)
* <a href="#cypressio-config-for-semaphore-20">JavaScript tests in Cypress.io</a> end to end test runner
* <a href="#jest-config-for-semaphore-20">JavaScript tests in Jest</a>

### Ruby on Rails config for Semaphore 2.0

`knapsack_pro` gem supports environment variables provided by Semaphore CI 2.0 to run your tests. You will have to define a few things in `.semaphore/semaphore.yml` config file.

- You need to set `KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC`. If you don't want to commit secrets in yml file then you can <a href="https://docs.semaphoreci.com/article/66-environment-variables-and-secrets" target="_blank" rel="nofollow">follow this guide</a>.
- You should create as many parallel jobs as you need with `parallelism` property. If your test suite is long you should use more parallel jobs.

Below you can find full Semaphore CI 2.0 config for Rails project.

{% highlight yaml %}
# .semaphore/semaphore.yml
# Use the latest stable version of Semaphore 2.0 YML syntax:
version: v1.0

# Name your pipeline. In case you connect multiple pipelines with promotions,
# the name will help you differentiate between, for example, a CI build phase
# and delivery phases.
name: Demo Rails 5 app

# An agent defines the environment in which your code runs.
# It is a combination of one of available machine types and operating
# system images.
# See https://docs.semaphoreci.com/article/20-machine-types
# and https://docs.semaphoreci.com/article/32-ubuntu-1804-image
agent:
  machine:
    type: e1-standard-2
    os_image: ubuntu1804

# Blocks are the heart of a pipeline and are executed sequentially.
# Each block has a task that defines one or more jobs. Jobs define the
# commands to execute.
# See https://docs.semaphoreci.com/article/62-concepts
blocks:
  - name: Setup
    task:
      env_vars:
        - name: RAILS_ENV
          value: test
      jobs:
        - name: bundle
          commands:
          # Checkout code from Git repository. This step is mandatory if the
          # job is to work with your code.
          # Optionally you may use --use-cache flag to avoid roundtrip to
          # remote repository.
          # See https://docs.semaphoreci.com/article/54-toolbox-reference#libcheckout
          - checkout
          # Restore dependencies from cache.
          # Read about caching: https://docs.semaphoreci.com/article/54-toolbox-reference#cache
          - cache restore gems-$SEMAPHORE_GIT_BRANCH-$(checksum Gemfile.lock),gems-$SEMAPHORE_GIT_BRANCH-,gems-master-
          # Set Ruby version:
          - sem-version ruby 2.6.1
          - bundle install --jobs=4 --retry=3 --path vendor/bundle
          # Store the latest version of dependencies in cache,
          # to be used in next blocks and future workflows:
          - cache store gems-$SEMAPHORE_GIT_BRANCH-$(checksum Gemfile.lock) vendor/bundle

  - name: RSpec tests
    task:
      env_vars:
        - name: RAILS_ENV
          value: test
        - name: PGHOST
          value: 127.0.0.1
        - name: PGUSER
          value: postgres
        - name: KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC
          value: your_api_token_here
      # This block runs two jobs in parallel and they both share common
      # setup steps. We can group them in a prologue.
      # See https://docs.semaphoreci.com/article/50-pipeline-yaml#prologue
      prologue:
        commands:
          - checkout
          - cache restore gems-$SEMAPHORE_GIT_BRANCH-$(checksum Gemfile.lock),gems-$SEMAPHORE_GIT_BRANCH-,gems-master-
          # Start Postgres database service.
          # See https://docs.semaphoreci.com/article/54-toolbox-reference#sem-service
          - sem-service start postgres
          - sem-version ruby 2.6.1
          - bundle install --jobs=4 --retry=3 --path vendor/bundle
          - bundle exec rake db:setup

      jobs:
      - name: Run tests with Knapsack Pro
        parallelism: 2
        commands:
        # Step for RSpec in Queue Mode
        - bundle exec rake knapsack_pro:queue:rspec
        # Step for Cucumber in Queue Mode
        - bundle exec rake knapsack_pro:queue:cucumber

        # Step for RSpec in Regular Mode
        - bundle exec rake knapsack_pro:rspec
        # Step for Cucumber in Regular Mode
        - bundle exec rake knapsack_pro:cucumber
        # Step for Minitest in Regular Mode
        - bundle exec rake knapsack_pro:minitest
        # Step for test-unit in Regular Mode
        - bundle exec rake knapsack_pro:test_unit
        # Step for Spinach in Regular Mode
        - bundle exec rake knapsack_pro:spinach
{% endhighlight %}

### Cypress.io config for Semaphore 2.0

`@knapsack-pro/cypress` supports environment variables provided by Semaphore CI 2.0 to run your tests. You will have to define a few things in `.semaphore/semaphore.yml` config file.

- You need to set `KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS`. If you don't want to commit secrets in yml file then you can <a href="https://docs.semaphoreci.com/article/66-environment-variables-and-secrets" target="_blank" rel="nofollow">follow this guide</a>.
- You should create as many parallel jobs as you need with `parallelism` property. If your test suite is long you should use more parallel jobs.

Below you can find example part of Semaphore CI 2.0 config.

{% highlight yaml %}
blocks:
  - name: Cypress tests
    task:
      env_vars:
        - name: KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS
          value: your_api_token_here
      prologue:
        commands:
          - checkout
          - nvm install --lts carbon
          - sem-version node --lts carbon

      jobs:
        - name: Run tests with Knapsack Pro
          parallelism: 2
          commands:
            - $(npm bin)/knapsack-pro-cypress
{% endhighlight %}

### Jest config for Semaphore 2.0

`@knapsack-pro/jest` supports environment variables provided by Semaphore CI 2.0 to run your tests. You will have to define a few things in `.semaphore/semaphore.yml` config file.

- You need to set `KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST`. If you don't want to commit secrets in yml file then you can <a href="https://docs.semaphoreci.com/article/66-environment-variables-and-secrets" target="_blank" rel="nofollow">follow this guide</a>.
- You should create as many parallel jobs as you need with `parallelism` property. If your test suite is long you should use more parallel jobs.

Below you can find example part of Semaphore CI 2.0 config.

{% highlight yaml %}
blocks:
  - name: Cypress tests
    task:
      env_vars:
        - name: KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST
          value: your_api_token_here
      prologue:
        commands:
          - checkout
          - nvm install --lts carbon
          - sem-version node --lts carbon

      jobs:
        - name: Run tests with Knapsack Pro
          parallelism: 2
          commands:
            - $(npm bin)/knapsack-pro-jest
{% endhighlight %}

## The Queue Mode and summary

As you can see your CI builds can be much faster thanks to leveraging parallel jobs on Semaphore CI 2.0. You can check <a href="https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog&utm_campaign=run-parallel-jobs-on-semaphore-ci-2-0-to-get-faster-ci-build-time">Knapsack Pro tool for CI parallelisation</a> and learn more about Queue Mode and what problems it solves in below video.

<iframe width="560" height="315" src="https://www.youtube.com/embed/hUEB1XDKEFY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
