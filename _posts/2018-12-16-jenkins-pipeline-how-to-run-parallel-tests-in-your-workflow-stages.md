---
layout: post
title:  "Jenkins Pipeline how to run parallel tests in your workflow stages"
date:   2018-12-16 17:00:00 +0100
author: "Artur Trzop"
categories: continuous_integration Jenkins Pipeline CI parallelisation RSpec Ruby Javascript Cypress
og_image: "/images/blog/posts/jenkins-pipeline-how-to-run-parallel-tests-in-your-workflow-stages/jenkins.jpg"
---

Jenkins Pipeline is a suite of plugins that allows creating simple-to-complex build stages for your testing environment on CI.  We can use Jenkins Pipeline to run a few stages at the same time and thanks to that parallelize test suite across a few stages to complete tests faster.

<img src="/images/blog/posts/jenkins-pipeline-how-to-run-parallel-tests-in-your-workflow-stages/jenkins.jpg" style="width:300px;margin-left: 15px;float:right;" alt="Jenkins" />

In order to run parallel stages with [Jenkins Pipeline](https://www.jenkins.io/doc/book/pipeline/), you need a proper Jenkinsfile which represents our delivery pipeline as code via the Pipeline DSL.

Another thing we will have to figure out is the problem how to divide our test suite across parallel stages in a way that each subset of test suite executed across all stages will complete work at the same time. It's important to complete the tests on all stages at a similar time to run our CI build as fast as possible and eliminate bottleneck stage.

## How to split test suite evenly across parallel Jenkins stages

To divide our tests across parallel stages we can use [Knapsack Pro](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=jenkins-pipeline-how-to-run-parallel-tests-in-your-workflow-stages) which allows to dynamically allocate tests across stages (also known as CI nodes). This way we will run our parallelised tests in optimal time.

Here you can learn more how dynamic test suite allocation works and with what else problems it can help.

<iframe width="560" height="315" src="https://www.youtube.com/embed/hUEB1XDKEFY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Jenkinsfile for parallel pipeline

In this example, I will show you how to split your Ruby and JavaScript tests across parallel [Jenkins](https://knapsackpro.com/ci_servers/jenkins?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=jenkins-pipeline-how-to-run-parallel-tests-in-your-workflow-stages) stages.

This is Ruby example how to split Cucumber and RSpec test suite. Other test runners like Minitest, Test::Unit etc are available as well at [Knapsack Pro](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=jenkins-pipeline-how-to-run-parallel-tests-in-your-workflow-stages):

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

        // example how to run cucumber tests in Knapsack Pro Regular Mode
        stage('Run cucumber') {
          sh """${knapsack_options} bundle exec rake knapsack_pro:cucumber"""
        }

        // example how to run rspec tests in Knapsack Pro Queue Mode
        // Queue Mode should be as a last stage so it can autobalance build if tests in regular mode were not perfectly distributed
        stage('Run rspec') {
          sh """KNAPSACK_PRO_CI_NODE_BUILD_ID=${env.BUILD_TAG} ${knapsack_options} bundle exec rake knapsack_pro:queue:rspec"""
        }
      }
    }
  }

  parallel nodes // run CI nodes in parallel
}
{% endhighlight %}

Here is JavaScript example how to split Cypress tests. You can learn more about [splitting E2E tests for Cypress test runner](/2018/run-javascript-e2e-tests-faster-with-cypress-on-parallel-ci-nodes) here.

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
            KNAPSACK_PRO_CI_NODE_BUILD_ID=${env.BUILD_TAG}\
        """

        // example how to run tests with Knapsack Pro
        stage('Run tests') {
          sh """${knapsack_options} npx @knapsack-pro/cypress"""
        }
      }
    }
  }

  parallel nodes // run CI nodes in parallel
}
{% endhighlight %}

## Summary

[Jenkins](https://knapsackpro.com/ci_servers/jenkins?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=jenkins-pipeline-how-to-run-parallel-tests-in-your-workflow-stages) Pipeline gets you a continuous delivery (CD) pipeline which is an automated expression of your process for getting software from version control right through to your users. It's important to save the time of your engineering team by running CI build fast. One way of doing it is [test suite parallelisation that can be done in an optimal way with Knapsack Pro for Ruby and JavaScript tests](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=jenkins-pipeline-how-to-run-parallel-tests-in-your-workflow-stages).

<i>If you are currently considering the choice between Jenkins and other CI, check out our popular comparison pages: [Jenkins vs Github Actions](https://knapsackpro.com/ci_comparisons/jenkins/vs/github-actions?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=jenkins-pipeline-how-to-run-parallel-tests-in-your-workflow-stages), [Drone vs Jenkins](https://knapsackpro.com/ci_comparisons/drone/vs/jenkins?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=jenkins-pipeline-how-to-run-parallel-tests-in-your-workflow-stages), [AWS CodeBuild vs Jenkins](https://knapsackpro.com/ci_comparisons/aws-codebuild/vs/jenkins?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=jenkins-pipeline-how-to-run-parallel-tests-in-your-workflow-stages), and [Cloud Build vs Jenkins](https://knapsackpro.com/ci_comparisons/google-cloud-build/vs/jenkins?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=jenkins-pipeline-how-to-run-parallel-tests-in-your-workflow-stages).</i>
