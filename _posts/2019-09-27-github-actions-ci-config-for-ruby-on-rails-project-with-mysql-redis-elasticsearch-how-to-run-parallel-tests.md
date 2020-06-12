---
layout: post
title:  "GitHub Actions CI config for Ruby on Rails project with MySQL, Redis, Elasticsearch - how to run parallel tests"
date:   2019-09-27 15:00:00 +0100
author: "Artur Trzop"
categories: techtips continuous_integration
og_image: "/images/blog/posts/github-actions-ci-config-for-ruby-on-rails-project-with-mysql-redis-elasticsearch-how-to-run-parallel-tests/github-mysql-redis-elasticsearch.png"
---

You will learn how to configure Ruby on Rails project on [GitHub Actions](https://knapsackpro.com/ci_servers/github-actions?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=github-actions-ci-config-for-ruby-on-rails-project-with-mysql-redis-elasticsearch-how-to-run-parallel-tests). This specific Rails project has MySQL and Redis database. There is also Elasticsearch service running on CI. If your project is close to that setup below GitHub Actions yaml configuration will allow you to run tests on GitHub CI server.

If you happen to use PostgreSQL you can check our previous article about [Rails app configuration with Postgres on GitHub Actions](/2019/how-to-run-rspec-on-github-actions-for-ruby-on-rails-app-using-parallel-jobs).

<img src="/images/blog/posts/github-actions-ci-config-for-ruby-on-rails-project-with-mysql-redis-elasticsearch-how-to-run-parallel-tests/github-mysql-redis-elasticsearch.png" style="width:500px;margin-left: 15px;float:right;" alt="GitHub, Redis, MySQL, Elasticsearch" />

## GitHub Actions configuration for Rails

In your repository, you need to create file `.github/workflows/main.yaml` Thanks to it GitHub Actions will run your CI builds. You can find results of executed CI builds in Actions tab on your GitHub repository page.

In this case, <b>Rails</b> application has <b>MySQL</b>, <b>Redis</b>, and <b>Elasticsearch</b> databases. You need to set up services with docker container to run each. In the below config, there is also a step for health check the MySQL and Elasticsearch to ensure both are up and running before you can start running tests.

The tests are executed across parallel jobs thanks to matrix feature in [GitHub Actions](https://knapsackpro.com/ci_servers/github-actions?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=github-actions-ci-config-for-ruby-on-rails-project-with-mysql-redis-elasticsearch-how-to-run-parallel-tests) and the [Knapsack Pro](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=github-actions-ci-config-for-ruby-on-rails-project-with-mysql-redis-elasticsearch-how-to-run-parallel-tests) ruby gem that will auto-balance tests distribution across jobs. Auto balancing tests using Knapsack Pro Queue Mode will ensure each parallel job finish work at a similar time. Thanks to that there is no bottleneck (no slow job with too many tests to run) and you can enjoy fast CI build time because you get optimal tests split across parallel tasks.

<script src="https://gist.github.com/ArturT/b3679cfe7c2d3d8625d54fb5a8966874.js"></script>

## How Knapsack Pro Queue Mode works

In this video, you will learn how dynamic test suite spilt across parallel jobs (parallel CI nodes) work.

<iframe width="560" height="315" src="https://www.youtube.com/embed/hUEB1XDKEFY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## How Knapsack Pro Regular Mode works

[Knapsack Pro](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=github-actions-ci-config-for-ruby-on-rails-project-with-mysql-redis-elasticsearch-how-to-run-parallel-tests) has also a deterministic way of splitting tests. Tests are split only once before running tests. This is the most simple way that you will try for the first time to record your CI build before you switch to Queue Mode.

You can learn more about Knapsack Pro in the [installation guide](/integration/).

<iframe width="560" height="315" src="https://www.youtube.com/embed/ZEb6NeRRfQ4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Summary

If you would like to learn more about [GitHub Actions](https://knapsackpro.com/ci_servers/github-actions?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=github-actions-ci-config-for-ruby-on-rails-project-with-mysql-redis-elasticsearch-how-to-run-parallel-tests) check our previous article about [testing Rails app with PostgreSQL on GitHub Actions](/2019/how-to-run-rspec-on-github-actions-for-ruby-on-rails-app-using-parallel-jobs). There is also a video showing it in action.

Learn [how to split slow RSpec spec files by test examples on Github Actions](/2020/how-to-run-slow-rspec-files-on-github-actions-with-parallel-jobs-by-doing-an-auto-split-of-the-spec-file-by-test-examples).

And if you are still considering using GitHub Actions, then our [comparison of GitHub Actions vs other CIs](https://knapsackpro.com/ci_comparisons?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=github-actions-ci-config-for-ruby-on-rails-project-with-mysql-redis-elasticsearch-how-to-run-parallel-tests#github-actions) may be helpful for you. The most commonly visited comparisons are: [Github Actions vs Circle CI](https://knapsackpro.com/ci_comparisons/github-actions/vs/circle-ci?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=github-actions-ci-config-for-ruby-on-rails-project-with-mysql-redis-elasticsearch-how-to-run-parallel-tests), [Github Actions vs Jenkins](https://knapsackpro.com/ci_comparisons/github-actions/vs/jenkins?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=github-actions-ci-config-for-ruby-on-rails-project-with-mysql-redis-elasticsearch-how-to-run-parallel-tests), and [Github Actions vs Travis CI](https://knapsackpro.com/ci_comparisons/github-actions/vs/travis-ci?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=github-actions-ci-config-for-ruby-on-rails-project-with-mysql-redis-elasticsearch-how-to-run-parallel-tests).
