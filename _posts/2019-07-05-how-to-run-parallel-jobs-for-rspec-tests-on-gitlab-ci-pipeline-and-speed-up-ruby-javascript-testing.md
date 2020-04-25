---
layout: post
title:  "How to run parallel jobs for RSpec tests on GitLab CI Pipeline and speed up Ruby & JavaScript testing"
date:   2019-07-05 17:00:00 +0200
author: "Artur Trzop"
categories: continuous_integration
og_image: "/images/blog/posts/how-to-run-parallel-jobs-for-rspec-tests-on-gitlab-ci-pipeline-and-speed-up-ruby-javascript-testing/gitlab.jpeg"
---

[GitLab CI](https://knapsackpro.com/ci_servers/gitlab-ci?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-run-parallel-jobs-for-rspec-tests-on-gitlab-ci-pipeline-and-speed-up-ruby-javascript-testing) allows you to run tests much faster thanks to CI parallelisation feature. You can run parallel jobs across multiple GitLab Runners. In order to do it, you will learn how to split tests in a dynamic way across parallel tasks to ensure there is no bottleneck in GitLab Pipeline. Thanks to that CI build can be run as fast as possible so your <strong>Ruby & JS tests can be finely fast</strong>.

<img src="/images/blog/posts/how-to-run-parallel-jobs-for-rspec-tests-on-gitlab-ci-pipeline-and-speed-up-ruby-javascript-testing/gitlab.jpeg" style="width:300px;margin-left: 15px;float:right;" alt="GitLab logo" />

## GitLab CI parallelisation

The common problem, when you want to run tests in parallel to complete your 1-hour test suite in a few minutes instead of waiting hours, is to find a way how to split tests on parallel jobs. Some of your Ruby or JavaScript tests can take milliseconds and some even a few minutes per test file (for instance when using Capybara in RSpec features testing). Problem with slow tests also occurs in E2E (end to end testing) when using [Cypress test runner as browser testing](/2019/cypress-parallel-testing-with-jenkins-pipeline-stages) can take quite a long time to execute.

If you add more parallel GitLab Runners you also may notice that some runners can start work later or not all jobs can be started at the same time (for instance when you run GitLab Runners on your own infrastructure and other CI builds occupies some of the runners).

## Dynamic test suite split to eliminate CI build bottlenecks

A solution to optimal tests distribution across parallel jobs (parallel CI nodes) is to distribute test files in smaller chunks across parallel GitLab runners. This ensures active runners can consume and execute your tests while too busy runners with slow tests would run fewer test cases. What is important is to ensure that all parallel runners will finish work at a similar time and thanks to that you won't see stuck GitLab runner with too much work to process.

To [split tests in a dynamic way for Ruby & JavaScript tests you can use Queue Mode in Knapsack Pro](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-run-parallel-jobs-for-rspec-tests-on-gitlab-ci-pipeline-and-speed-up-ruby-javascript-testing). Below I will explain how Queue Mode works and what problems it solves.

<iframe style="width: 100%; max-width: 853; height: 480px" src="https://www.youtube.com/embed/hUEB1XDKEFY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## GitLab YAML config for parallel testing

Here you can find an example config `.gitlab-ci.yml` for Ruby on Rails project that has RSpec tests executed across 2 parallel jobs using [Knapsack Pro Queue Mode](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-run-parallel-jobs-for-rspec-tests-on-gitlab-ci-pipeline-and-speed-up-ruby-javascript-testing). The similar configuration would be for JavaScript projects with Jest or Cypress tests ([full list of supported test runners](/integration/) in Knapsack Pro can be found here).

Please remember to set API token for [Knapsack Pro](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-run-parallel-jobs-for-rspec-tests-on-gitlab-ci-pipeline-and-speed-up-ruby-javascript-testing) as environment variable name `KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC` in GitLab Settings -> CI/CD -> Variables (Expand) as a masked variable.

{% highlight yaml %}
# .gitlab-ci.yml
image: "ruby:2.6"

services:
  - postgres

variables:
  RAILS_ENV: test
  POSTGRES_DB: database_name
  POSTGRES_USER: postgres
  POSTGRES_PASSWORD: ""
  DATABASE_URL: "postgresql://postgres:postgres@postgres:5432/database_name"
  # KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC: it is set in Settings -> CI/CD -> Variables (Expand) as masked variable

before_script:
  - apt-get update -qq && apt-get install -y -qq nodejs
  - ruby -v
  - which ruby
  - gem install bundler --no-document
  - bundle install --jobs $(nproc)  "${FLAGS[@]}"

  # Database setup
  - bin/rails db:setup

rspec:
  parallel: 2
  script:
    - bundle exec rake knapsack_pro:queue:rspec
{% endhighlight %}

Note you can run dozens of parallel jobs by changing `parallel` option and thanks to that run the very long test suite in a few minutes instead of waiting hour.

<iframe style="width: 100%; max-width: 853; height: 480px" src="https://www.youtube.com/embed/Td0IKEYn4Zk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Summary

[GitLab](https://knapsackpro.com/ci_servers/gitlab-ci?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-run-parallel-jobs-for-rspec-tests-on-gitlab-ci-pipeline-and-speed-up-ruby-javascript-testing) with its CI/CD tool allows to run fast CI builds thanks to parallelisation of your tests. By using [Knapsack Pro Queue Mode](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-run-parallel-jobs-for-rspec-tests-on-gitlab-ci-pipeline-and-speed-up-ruby-javascript-testing) you can ensure your tests are split across parallel jobs in an optimal way so your team gets test results as fast as possible.

<i>If you are looking for an optimal CI solution for your project, check out our comparisons: [GitLab CI vs Github Actions](https://knapsackpro.com/ci_comparisons/gitlab-ci/vs/github-actions?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-run-parallel-jobs-for-rspec-tests-on-gitlab-ci-pipeline-and-speed-up-ruby-javascript-testing), [GitLab vs Circle CI](https://knapsackpro.com/ci_comparisons/gitlab-ci/vs/circle-ci?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-run-parallel-jobs-for-rspec-tests-on-gitlab-ci-pipeline-and-speed-up-ruby-javascript-testing), [Jenkins vs GitLab CI](https://knapsackpro.com/ci_comparisons/jenkins/vs/gitlab-ci?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-run-parallel-jobs-for-rspec-tests-on-gitlab-ci-pipeline-and-speed-up-ruby-javascript-testing), or [GitLab vs other CI](https://knapsackpro.com/ci_comparisons?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-run-parallel-jobs-for-rspec-tests-on-gitlab-ci-pipeline-and-speed-up-ruby-javascript-testing#gitlab-ci) providers.</i>
