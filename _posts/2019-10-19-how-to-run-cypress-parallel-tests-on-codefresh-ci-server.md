---
layout: post
title:  "How to run Cypress parallel tests on Codefresh CI server"
date:   2019-10-19 17:00:00 +0100
author: "Artur Trzop"
categories: continuous_integration
og_image: "/images/blog/posts/how-to-run-cypress-parallel-tests-on-codefresh-ci-server/cypress-codefresh.jpeg"
---

When you work with end to end tests in Cypress you may notice they quickly get time-consuming for running the whole test suite. The more complex the project the more test cases you may end up with and this can take a long time to run - dozens of minutes or even hours.

<img src="/images/blog/posts/how-to-run-cypress-parallel-tests-on-codefresh-ci-server/cypress-codefresh.jpeg" style="width:200px;margin-left: 15px;float:right;" alt="Cypress, Codefresh" />

One way of executing faster tests in Cypress is to use CI parallelism which is essentially running a few chunks of test suite spread across parallel jobs on CI server. In this article, you will learn how to <b>configure Codefresh.io server with matrix feature to run parallel steps for your Cypress tests</b> and this way save time on faster CI builds.

## Configure Codefresh.io to run Cypress.io tests

You need in your project repository a Dockerfile that will be used by Codefresh to build Docker image which will be used to run Docker container with your Cypress tests inside of it.

{% highlight Dockerfile %}
FROM cypress/base:10

RUN apt-get update && \
  apt-get install -y \
  python3-dev \
  python3-pip

# Install AWS CLI
RUN pip3 install awscli

# Install Codefresh CLI
RUN wget https://github.com/codefresh-io/cli/releases/download/v0.31.1/codefresh-v0.31.1-alpine-x64.tar.gz
RUN tar -xf codefresh-v0.31.1-alpine-x64.tar.gz -C /usr/local/bin/

COPY . /src

WORKDIR /src

RUN npm install
{% endhighlight %}

Next thing is to add `.codefresh/codefresh.yml` file with instructions to run your application HTTP server in the background and then run Cypress tests against the application.

In the below example, you will see that you can leverage matrix environment configuration for Codefresh. Set a few environmental variables with the node index for each parallel step. This is required by Knapsack Pro tool. <a href="https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog&utm_campaign=how-to-run-cypress-parallel-tests-on-codefresh-ci-server">Knapsack Pro is a wrapper around Cypress test runner</a> which is responsible for running a proper set of tests across parallel jobs (parallel steps on Codefresh).

Knapsack Pro for Cypress has built-in Queue Mode mechanism which splits test files in a dynamic way across parallel CI nodes (parallel jobs) and thanks to that ensure each parallel step takes a similar time so your CI build is executed in optimal time. You save time by avoiding a not optimal split of tests. You simply eliminate bottleneck slow job that could happen when you allocate too many slow test files to the same parallel step.

You will learn more how exactly Queue Mode works at the end of this article but for now, let's take a look at Codefresh YAML configuration.

<script src="https://gist.github.com/ArturT/9e219ad72cbffb64e3c0d82bbf2cee2b.js"></script>

You also need to add an API token for the Cypress test suite. You can get the API token at <a href="https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog&utm_campaign=how-to-run-cypress-parallel-tests-on-codefresh-ci-server">Knapsack Pro</a>.

- You need to set an API token `KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS` in Codefresh dashboard, see left menu Pipelines -> settings (cog icon next to the pipeline) -> Variables tab (see a vertical menu on the right side).
- Set where Codefresh YAML file can be found. In Codefresh dashboard, see left menu Pipelines -> settings (cog icon next to pipeline) -> Workflow tab (horizontal menu on the top) -> Path to YAML (set there `./.codefresh/codefresh.yml`).
- Set how many parallel jobs (parallel CI nodes) you want to run with `KNAPSACK_PRO_CI_NODE_TOTAL` environment variable in `.codefresh/codefresh.yml` file.
- Ensure in the `matrix` section you listed all `KNAPSACK_PRO_CI_NODE_INDEX` environment variables with a value from `0` to `KNAPSACK_PRO_CI_NODE_TOTAL-1`. Codefresh will generate a matrix of parallel jobs where each job has a different value for `KNAPSACK_PRO_CI_NODE_INDEX`. Thanks to that Knapsack Pro knows what tests should be run on each parallel job.

<iframe width="560" height="315" src="https://www.youtube.com/embed/3OTu6a-WGgo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## How dynamic test suite split works in Queue Mode

You can learn how dynamic test suite split with <a href="https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog&utm_campaign=how-to-run-cypress-parallel-tests-on-codefresh-ci-server">Knapsack Pro</a> Queue Mode works in the below video. There are examples of a few edge cases that Queue Mode helps with.

<iframe width="560" height="315" src="https://www.youtube.com/embed/hUEB1XDKEFY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

I hope you find this article helpful. You can also check [other articles](/integration/). For instance, I wrote an article about [Codefresh and Ruby on Rails project setup](/2019/how-to-use-codefresh-ci-parallel-steps-to-run-rspec-a-few-times-faster-for-rails-project) with a video showing how it works.

