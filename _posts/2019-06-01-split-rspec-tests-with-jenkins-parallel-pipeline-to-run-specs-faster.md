---
layout: post
title:  "Split RSpec tests with Jenkins Parallel Pipeline to run specs faster"
date:   2019-06-01 13:00:00 +0200
author: "Artur Trzop"
categories: blog Jenkins Pipeline Stages CI parallelisation RSpec Ruby Rails
og_image: "/images/blog/posts/split-rspec-tests-with-jenkins-parallel-pipeline-to-run-specs-faster/rspec_jenkins.jpeg"
---

Jenkins CI server has a declarative pipeline that allows you to set Jenkins parallel stages. You can use the stages to run them at the same time (parallel run) to execute your RSpec test suite in a few smaller faster chunks instead of one long test suite run. 

<img src="/images/blog/posts/split-rspec-tests-with-jenkins-parallel-pipeline-to-run-specs-faster/rspec_jenkins.jpeg" style="width:300px;margin-left: 15px;float:right;" />

## Running stages in parallel with Jenkins workflow pipeline

You will use Jenkinsfile and pipeline syntax to get parallel execution of tasks. RSpec tests need to be split in equal time across stages and to do that you need to ensure the time of each RSpec spec file won't compound on one of the stages because that could lead to bottleneck - a stage that takes more time to run tests than other stages. 

To split RSpec tests evenly you can use [knapsack_pro gem](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=split-rspec-tests-with-jenkins-parallel-pipeline-to-run-specs-faster) with its Queue Mode that will dynamically split specs on parallel Jenkins stages to ensure each stage takes similar amount of time. You can learn more from below video about [knapsack_pro Queue Mode](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=split-rspec-tests-with-jenkins-parallel-pipeline-to-run-specs-faster) and what kind of edge cases it solves when you split tests on CI server.

<iframe width="560" height="315" src="https://www.youtube.com/embed/hUEB1XDKEFY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Stages in Declarative Jenkins Pipeline

Pipeline as Code in Jenkins is a very popular way to define your configuration. Here is example for running RSpec tests with [knapsack_pro ruby gem](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=split-rspec-tests-with-jenkins-parallel-pipeline-to-run-specs-faster) to ensure your Ruby on Rails tests are split in optimal way across parallel stages.

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

        // Example how to run RSpec tests in Knapsack Pro Queue Mode
        // Queue Mode should be a last stage if you have other stages in your pipeline
        // thanks to that it can autobalance CI build time if other tests were not perfectly distributed
        stage('Run rspec') {
          sh """KNAPSACK_PRO_CI_NODE_BUILD_ID=${env.BUILD_TAG} ${knapsack_options} bundle exec rake knapsack_pro:queue:rspec"""
        }
      }
    }
  }

  parallel nodes // run CI nodes in parallel
}
{% endhighlight %}

## Summary

Automatic splitting of tests to speed up test stages is a way to ensure your CI builds for Ruby on Rails project are finally as fast as possible. You can learn about [Jenkins parallel pipeline for other test runners in Ruby or JavaScript like Cypress or Jest](/2018/jenkins-pipeline-how-to-run-parallel-tests-in-your-workflow-stages) and how CI parallelisation can help save time with faster testing.

<iframe width="560" height="315" src="https://www.youtube.com/embed/QWfFiJF1GyU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
