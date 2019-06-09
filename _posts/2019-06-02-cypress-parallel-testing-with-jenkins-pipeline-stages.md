---
layout: post
title:  "Cypress parallel testing with Jenkins Pipeline stages"
date:   2019-06-02 12:00:00 +0200
author: "Artur Trzop"
categories: continuous_integration Cypress JavaScript E2E testing Jenkins Pipeline stages
og_image: "/images/blog/posts/cypress-parallel-testing-with-jenkins-pipeline-stages/cypress-jenkins.jpeg"
---

In this tutorial for JavaScript end to end testing, you will learn about Cypress test runner for UI automation testing and how to use it with Jenkins CI server. Cypress helps with frontend automation testing using headless browser or just regular browser. E2E tests often take a long time to run and for bigger projects, those type of tests can take dozens of minutes or even hours. To save developers time you want to load balancing Cypress tests across Jenkins parallel pipeline stages.  Thanks to that you can run your 1-hour test suite in a few minutes.

<img src="/images/blog/posts/cypress-parallel-testing-with-jenkins-pipeline-stages/cypress-jenkins.jpeg" style="width:300px;margin-left: 15px;float:right;" alt="Cypress Jenkins" />

## How to speed up Cypress tests

Cypress is a Javascript End to End testing framework that has built in parallelisation but in this article, we will cover Cypress parallel without dashboard service. You want to be able to run tests also when external Cypress dashboard service API is down. It's possible thanks to [Knapsack Pro client for Cypress with built-in Fallback Mode](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=cypress-parallel-testing-with-jenkins-pipeline-stages).

<iframe width="560" height="315" src="https://www.youtube.com/embed/G6ixK4IK-3Y" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Run Cypress tests in parallel with Jenkins Pipeline

You may want to run Cypress concurrent tests but for that, we will use declarative Jenkins Pipeline with defined Jenkins stages. This allows us to run Cypress parallel tests. 

Let's look at this Jenkins Pipeline as a code to understand Cypress Jenkins integration:

{% highlight plain %}
timeout(time: 60, unit: 'MINUTES') {
  node() {
    stage('Checkout') {
      checkout([/* checkout code from git */])

      // determine git commit hash because we need to pass it to Knapsack Pro
      COMMIT_HASH = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()

      stash 'source'
    }
  }

  def num_nodes = 4; // define your total number of CI nodes (how many parallel jobs will be executed)
  def nodes = [:]

  for (int i = 0; i < num_nodes; i++) {
    def index = i;
    nodes["ci_node_${i}"] = {
      node() {
        stage('Setup') {
          unstash 'source'
          // other setup steps
        }

        def knapsack_options = """\
            KNAPSACK_PRO_CI_NODE_TOTAL=${num_nodes}\
            KNAPSACK_PRO_CI_NODE_INDEX=${index}\
            KNAPSACK_PRO_COMMIT_HASH=${COMMIT_HASH}\
            KNAPSACK_PRO_BRANCH=${env.BRANCH_NAME}\
        """

        // Example how to run Cypress tests in Knapsack Pro Queue Mode
        // Queue Mode should be a last stage if you have other stages in your pipeline
        // thanks to that it can autobalance CI build time if other tests were not perfectly distributed
        stage('Run Cypress in parallel') {
          sh """KNAPSACK_PRO_CI_NODE_BUILD_ID=${env.BUILD_TAG} ${knapsack_options} $(npm bin)/knapsack-pro-cypress"""
        }
      }
    }
  }

  parallel nodes // run CI nodes in parallel
}
{% endhighlight %}

## How dynamic tests split works in Knapsack Pro Queue Mode

To better understand how test suite split works when you allocate tests in a dynamic way across parallel stages please see below video. You will find here more edge cases that can be solved when [running tests in parallel and how Knapsack Pro Queue Mode helps with CI parallelisation](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=cypress-parallel-testing-with-jenkins-pipeline-stages). Ensuring each of your parallel tasks run a similar amount of time is important to get optimal CI build time and thanks to that save you as much time as possible.

<iframe width="560" height="315" src="https://www.youtube.com/embed/hUEB1XDKEFY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
