---
layout: post
title:  "Cucumber testing with Jenkins parallel pipeline to get down CI build time"
date:   2019-06-15 17:00:00 +0200
author: "Artur Trzop"
categories: continuous_integration
og_image: "/images/blog/posts/cucumber-testing-with-jenkins-parallel-pipeline-to-get-down-ci-build-time/cucumber_jenkins.jpeg"
---

Cucumber is a popular automation testing tool for Behaviour-Driven Development (BDD) but when you use it for some time in your work project then the amount of automated tests adds up and you can spend dozens of minutes to run your Cucumber test suite. Sometimes complex projects can have a few hours of execution time for the Cucumber tests. To save time and speed up your Cucumber builds on CI (Continuous Integration) you can use CI parallelization. In this article, you will see how to do it for [Jenkins](https://knapsackpro.com/ci_servers/jenkins?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=cucumber-testing-with-jenkins-parallel-pipeline-to-get-down-ci-build-time) using Jenkins parallel pipeline.

<img src="/images/blog/posts/cucumber-testing-with-jenkins-parallel-pipeline-to-get-down-ci-build-time/cucumber_jenkins.jpeg" style="width:300px;margin-left: 15px;float:right;" alt="Cucumber, Jenkins" />

## How to split Cucumber tests in parallel

[Jenkins](https://knapsackpro.com/ci_servers/jenkins?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=cucumber-testing-with-jenkins-parallel-pipeline-to-get-down-ci-build-time) allows you to configure pipeline as code and use Jenkins pipeline stages to define tasks that will be executed in parallel (at the same time).

In this example, you will use continuous integration tools like cucumber ruby gem and [knapsack_pro gem to split tests across parallel Jenkins stages](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=cucumber-testing-with-jenkins-parallel-pipeline-to-get-down-ci-build-time).

When you are testing your Ruby on Rails project with Cucumber you want to ensure tests executed in parallel will finish work at a similar time to fully utilize your CI server resources. As you know some test files can have very little tests and other much more test cases. Depend on the test file's content the execution time for each test file may vary which makes harder to allocate tests in an optimal way across parallel tasks.

It's important to split test files from the test suite across each Jenkins parallel stage in a way that you eliminate bottleneck (a slow stage that is running tests longer than other stages). To do that you can [split test suite in a dynamic way across parallel stages using Knapsack Pro Queue Mode for Cucumber](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=cucumber-testing-with-jenkins-parallel-pipeline-to-get-down-ci-build-time) test runner. In below video you will learn how Queue Mode works:

<iframe width="560" height="315" src="https://www.youtube.com/embed/hUEB1XDKEFY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Jenkins Pipeline parallel Cucumber testing

This is a configuration for Jenkinsfile where you run 4 parallel stages with Cucumber tests using [knapsack_pro plugin](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=cucumber-testing-with-jenkins-parallel-pipeline-to-get-down-ci-build-time).

{% highlight plain %}
timeout(time: 60, unit: 'MINUTES') {
  node() {
    stage('Checkout') {
      checkout([/* checkout code from git */])

      // determine git commit hash because we need to pass it to knapsack_pro
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

        // Example how to run Cucumber tests in Knapsack Pro Queue Mode
        // Queue Mode should be a last stage if you have other stages in your pipeline
        // thanks to that it can autobalance CI build time if other tests were not perfectly distributed
        stage('Run Cucumber tests') {
          sh """KNAPSACK_PRO_CI_NODE_BUILD_ID=${env.BUILD_TAG} ${knapsack_options} bundle exec rake knapsack_pro:queue:cucumber"""
        }
      }
    }
  }

  parallel nodes // run CI nodes in parallel
}
{% endhighlight %}

<iframe width="560" height="315" src="https://www.youtube.com/embed/QWfFiJF1GyU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Summary

Testing big projects is a consuming task. Automation testing with Cucumber can help with that. Your CI server like [Jenkins](https://knapsackpro.com/ci_servers/jenkins?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=cucumber-testing-with-jenkins-parallel-pipeline-to-get-down-ci-build-time) can help even more when you can leverage parallel test execution with Jenkins stages and by doing optimal test suite split with [Knapsack Pro Queue Mode](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=cucumber-testing-with-jenkins-parallel-pipeline-to-get-down-ci-build-time). The Queue Mode is working also for other [Ruby or JavaScript test runners](/integration/).
