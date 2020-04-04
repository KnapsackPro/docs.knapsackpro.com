---
layout: post
title:  "How to run RSpec on GitHub Actions for Ruby on Rails app using parallel jobs"
date:   2019-09-16 21:00:00 +0100
author: "Artur Trzop"
categories: continuous_integration github
og_image: "/images/blog/posts/how-to-run-rspec-on-github-actions-for-ruby-on-rails-app-using-parallel-jobs/github-octopus.jpeg"
---

GitHub introduced their own CI server solution called [GitHub Actions](https://knapsackpro.com/ci_servers/github-actions?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-run-rspec-on-github-actions-for-ruby-on-rails-app-using-parallel-jobs). You will learn how to set up your Ruby on Rails application on GitHub Actions with YAML config file. To run your RSpec test suite faster you will configure parallel jobs with matrix strategy on GitHub Actions.

<img src="/images/blog/posts/how-to-run-rspec-on-github-actions-for-ruby-on-rails-app-using-parallel-jobs/github-octopus.jpeg" style="width:300px;margin-left: 15px;float:right;" alt="GitHub, cat, octopus" />

## Automate your workflow on GitHub Actions

[GitHub Actions](https://knapsackpro.com/ci_servers/github-actions?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-run-rspec-on-github-actions-for-ruby-on-rails-app-using-parallel-jobs) makes it easy to automate all your software workflows with world-class CI/CD. Building, testing, and deploying your code right from GitHub became available with simple YAML configuration.

You can even create a few YAML config files to run a different set of rules on your CI like scheduling daily CI builds. But let's focus strictly on how to get running tests for Rails app on [GitHub Actions](https://knapsackpro.com/ci_servers/github-actions?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-run-rspec-on-github-actions-for-ruby-on-rails-app-using-parallel-jobs).

## Setup Ruby on Rails on GitHub Actions with YAML config

In your project repository, you need to create file `.github/workflows/main.yaml` Thanks to it GitHub will run your CI build. You can find results of CI builds in <i>Actions</i> tab for your GitHub repository.

In our case Rails application has Postgres database so you need to set up service with docker container to run Postgres DB.

{% highlight yaml %}
# If you need DB like PostgreSQL then define service below.
# Example for Redis can be found here:
# https://github.com/actions/example-services/tree/master/.github/workflows
services:
  postgres:
    image: postgres:10.8
    env:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ""
      POSTGRES_DB: postgres
    ports:
    # will assign a random free host port
    - 5432/tcp
    # needed because the postgres container does not provide a healthcheck
    options: --health-cmd pg_isready --health-interval 10s --health-timeout 5s --health-retries 5
{% endhighlight %}

To be able to install `pg` ruby gem from project `Gemfile` you will need `libpq-dev` library in Ubuntu system hence the step to install it.
`libpq` is a set of library functions that allow client programs to pass queries to the PostgreSQL backend server and to receive the results of these queries. We need it to compile `pg` gem.
Next step will be installing our Ruby gems.

{% highlight yaml %}
# required to compile pg ruby gem
- name: install PostgreSQL client
  run: sudo apt-get install libpq-dev

- name: Build and create DB
  env:
    # use localhost for the host here because we have specified a container for the job.
    # If we were running the job on the VM this would be postgres
    PGHOST: localhost
    PGUSER: postgres
    PGPORT: ${ { job.services.postgres.ports[5432] }} # get randomly assigned published port
    RAILS_ENV: test
  run: |
    gem install bundler
    bundle config path vendor/bundle
    bundle install --jobs 4 --retry 3
    bin/rails db:setup
{% endhighlight %}

To run RSpec tests across parallel jobs you need to set up matrix feature and thanks to that run the whole test suite distributed across jobs.

## Configuring a build matrix

A build matrix provides different configurations for the virtual environment to test. For instance, a workflow can run a job for more than one supported version of a language, operating system, etc. For each configuration, a copy of the job runs and reports status.

In case of running parallel tests, you want to run the Rails application on the same Ruby version and Ubuntu system. But you want to split RSpec test suite into 2 sets so half of the tests go to a first parallel job and the second half to another job.

To split tests you can use Ruby gem [Knapsack Pro](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-run-rspec-on-github-actions-for-ruby-on-rails-app-using-parallel-jobs) that will split tests across parallel GitHub jobs in a dynamic way. Thanks to that each parallel job will be consuming a set of tests fetched from Knapsack Pro API Queue to ensure each parallel job finishes work at a similar time. This allows for evenly distributed tests and no bottleneck in parallel jobs (no slow job). Your CI build will be as fast as possible.

In our case, you split tests across 2 parallel jobs so you need to set 2 as `matrix.ci_node_total`. Then each parallel job should have assigned index to `matrix.ci_node_index` starting from 0. The first parallel job gets index 0 and the second job gets index 1. This allows [Knapsack Pro](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-run-rspec-on-github-actions-for-ruby-on-rails-app-using-parallel-jobs) to know what tests should be executed on a particular job.

{% highlight yaml %}
# https://help.github.com/en/articles/workflow-syntax-for-github-actions#jobsjob_idstrategymatrix
strategy:
  fail-fast: false
  matrix:
    # Set N number of parallel jobs you want to run tests on.
    # Use higher number if you have slow tests to split them on more parallel jobs.
    # Remember to update ci_node_index below to 0..N-1
    ci_node_total: [2]
    # set N-1 indexes for parallel jobs
    # When you run 2 parallel jobs then first job will have index 0,
    # the second job will have index 1 etc
    ci_node_index: [0, 1]
{% endhighlight %}

You need to specify also API token for [Knapsack Pro](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-run-rspec-on-github-actions-for-ruby-on-rails-app-using-parallel-jobs), for RSpec it will be `KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC`.

Then you can run tests with Knapsack Pro in Queue Mode for RSpec:

{% highlight plain %}
bundle exec rake knapsack_pro:queue:rspec
{% endhighlight %}

## Full GitHub Actions config file for Rails tests

Here you can find the full YAML configuration file for GitHub Actions and Ruby on Rails project.

I also recorded video showing how it all works and how CI builds with parallel jobs are configured on GitHub Actions.

<iframe width="560" height="315" src="https://www.youtube.com/embed/HhvP4HbE_BU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<script src="https://gist.github.com/ArturT/a35284f34c2dc0b61a0ad2b4dd4bacae.js"></script>

## Dynamic test suite split with Queue Mode

If you would like to better understand how Queue Mode works in Knapsack Pro and what else problems it solves you will find a few useful information in below video.

<iframe width="560" height="315" src="https://www.youtube.com/embed/hUEB1XDKEFY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Also check out another article describing the [parallelisation setup for GitHub Actions for Rails with MySQL, Redis and Elasticsearch](/2019/github-actions-ci-config-for-ruby-on-rails-project-with-mysql-redis-elasticsearch-how-to-run-parallel-tests). By the way, if you are currently considering moving to GitHub Actions, definitely check out our [Comparison of GitHub Actions to other CI solutions](https://knapsackpro.com/ci_comparisons?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-run-rspec-on-github-actions-for-ruby-on-rails-app-using-parallel-jobs#github-actions).

I hope you find this helpful.
