---
layout: post
title:  "How to use Codefresh CI parallel steps to run RSpec a few times faster for Rails project"
date:   2019-10-18 18:00:00 +0100
author: "Artur Trzop"
categories: continuous_integration
og_image: "/images/blog/posts/how-to-use-codefresh-ci-parallel-steps-to-run-rspec-a-few-times-faster-for-rails-project/codefresh.png"
---

Codefresh.io seems to be a very nice CI solution to work with if you are a Ruby developer. I've tested one of my projects on Codefresh to see how it allows running fast tests. Codefresh has a matrix feature that lets you run parallel steps for the CI build. In this article, you will see how to leverage Codefresh matrix configuration and Knapsack Pro client library for testing in parallel your Ruby on Rails project with RSpec test suite.

<img src="/images/blog/posts/how-to-use-codefresh-ci-parallel-steps-to-run-rspec-a-few-times-faster-for-rails-project/codefresh.png" style="width:500px;margin-left: 15px;float:right;" alt="Codefresh" />

## Configure Rails project on Codefresh.io

In order to run CI builds for Rails project on Codefresh you need YAML configuration file and Docker image that will be used as your base Docker container running your tests.

We also need DB on the CI server. In my Ruby on Rails project, I use PostgreSQL so I have to configure Codefresh service to run Postgres.

Let's start with creating `.codefresh/codefresh.yml` file and `Test.Dockerfile` that you need to add to your repository.

<script src="https://gist.github.com/ArturT/722bccf19bfdce3e5d2dbbc2cb89834a.js"></script>

As you can see I use <a href="https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-use-codefresh-ci-parallel-steps-to-run-rspec-a-few-times-faster-for-rails-project">knapsack_pro ruby gem</a> as a command to run my RSpec tests. It will know what set of tests should be executed on a particular parallel step based on `KNAPSACK_PRO_CI_NODE_INDEX` value. The node index is generated based on the list of `KNAPSACK_PRO_CI_NODE_INDEX`
variables defined for the matrix.

<a href="https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-use-codefresh-ci-parallel-steps-to-run-rspec-a-few-times-faster-for-rails-project">Knapsack Pro</a> will automatically split tests across parallel jobs (steps) to ensure each step takes a similar time. It's possible thanks to Knapsack Pro Queue Mode which does dynamic test suite split across parallel steps. You can learn more about technical details on how Queue Mode works from the video at the end of this article but let's check now how Codefresh works in action. You can see my CI builds in Codefresh web dashboard on the below video.

<iframe width="560" height="315" src="https://www.youtube.com/embed/6yaE63RGZ0M" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

If you forgot steps from the video then I listed things you need to set up in Codefresh dashboard and in YAML config file.

* You need to set an API token like `KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC` in Codefresh dashboard, see left menu Pipelines -> settings (cog icon next to the pipeline) -> Variables tab (see a vertical menu on the right side). Add there new API token depending on the test runner you use:
  * `KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC`
  * `KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER`
  * `KNAPSACK_PRO_TEST_SUITE_TOKEN_MINITEST`
  * `KNAPSACK_PRO_TEST_SUITE_TEST_UNIT`
  * `KNAPSACK_PRO_TEST_SUITE_TOKEN_SPINACH`
* Set where Codefresh YAML file can be found. In Codefresh dashboard, see left menu Pipelines -> settings (cog icon next to pipeline) -> Workflow tab (horizontal menu on the top) -> Path to YAML (set there `./.codefresh/codefresh.yml`).
* Set how many parallel jobs (parallel CI nodes) you want to run with `KNAPSACK_PRO_CI_NODE_TOTAL` environment variable in `.codefresh/codefresh.yml` file.
* Ensure in the matrix section you listed all `KNAPSACK_PRO_CI_NODE_INDEX` environment variables with a value from `0` to `KNAPSACK_PRO_CI_NODE_TOTAL-1`. Codefresh will generate a matrix of parallel jobs where each job has a different value for `KNAPSACK_PRO_CI_NODE_INDEX`. Thanks to that Knapsack Pro knows what tests should be run on each parallel job.

## How Queue Mode works

In this video, I explained technical details for a dynamic test suite split and what problems it solves to help you run fast CI builds in optimal time.

<iframe width="560" height="315" src="https://www.youtube.com/embed/hUEB1XDKEFY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

There are more test runners in Ruby like Cucumber, Minitest, etc that are supported by <a href="https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-use-codefresh-ci-parallel-steps-to-run-rspec-a-few-times-faster-for-rails-project">Knapsack Pro</a>. Even JavaScript tools like Cypress.io or Jest can be launched with Knapsack Pro wrapper ([see installation guide](/integration/)).

I hope you find this tutorial useful and you can benefit from [faster CI builds](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-use-codefresh-ci-parallel-steps-to-run-rspec-a-few-times-faster-for-rails-project) for your Rails project thanks to running parallel steps on Codefresh.io.

<i>If you are currently considering a choice between Codefresh and other solutions, check out our comparisons: [Codefresh vs CircleCI](https://knapsackpro.com/ci_comparisons/codefresh-ci/vs/circle-ci?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-use-codefresh-ci-parallel-steps-to-run-rspec-a-few-times-faster-for-rails-project), [Codefresh vs Jenkins](https://knapsackpro.com/ci_comparisons/codefresh-ci/vs/jenkins?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-use-codefresh-ci-parallel-steps-to-run-rspec-a-few-times-faster-for-rails-project), [Github Actions vs Codefresh CI](https://knapsackpro.com/ci_comparisons/github-actions/vs/codefresh-ci?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-use-codefresh-ci-parallel-steps-to-run-rspec-a-few-times-faster-for-rails-project), and [Codefresh vs Other CI providers](https://knapsackpro.com/ci_comparisons/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-use-codefresh-ci-parallel-steps-to-run-rspec-a-few-times-faster-for-rails-project#codefresh-ci).</i>
