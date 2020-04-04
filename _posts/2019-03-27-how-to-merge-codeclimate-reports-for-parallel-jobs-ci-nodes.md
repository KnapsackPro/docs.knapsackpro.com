---
layout: post
title:  "How to merge CodeClimate reports for parallel jobs (CI nodes)"
date:   2019-03-27 22:00:00 +0100
author: "Artur Trzop"
categories: techtips CodeClimate Semaphore
og_image: "/images/blog/posts/run-parallel-jobs-on-semaphore-ci-2-0-to-get-faster-ci-build-time/semaphore-ci-logo.png"
---

If you run tests on parallel jobs (using CI parallelisation) you need to merge CodeClimate reports from each parallel job (CI node) into a unified report.

<img src="/images/blog/posts/run-parallel-jobs-on-semaphore-ci-2-0-to-get-faster-ci-build-time/semaphore-ci-logo.png" style="width:300px;margin-left: 15px;float:right;" alt="Semaphore CI" />

An additional problem may happen that some of your parallel jobs (one of your parallel CI node) may not have reported CodeClimate result when tests were never executed on that CI node.

It could happen when you run tests with dynamic tests allocation across parallel jobs using <a href="https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-merge-codeclimate-reports-for-parallel-jobs-ci-nodes">Knapsack Pro Queue Mode</a>. For instance if once of CI node started running tests after other CI nodes already executed the whole test suite distributed for particular CI build then the node has no CodeClimate report.

Here is a list of steps we need to follow to ensure we can correctly prepare a final report for CodeClimate.

* <a href="/2019/run-parallel-jobs-on-semaphore-ci-2-0-to-get-faster-ci-build-time">run tests split across parallel jobs (parallel CI nodes) with dynamic test suite split</a> called Knapsack Pro Queue Mode
* if one of CI node did not execute tests then knapsack_pro will log info to log file. We should grep the log file and if there were no tests executed then we don't generate CodeClimate report based on simple-cov
* as last step we merge all generated CodeClimate reports

Below is the full example for Semaphore CI 2.0 config but it applies to any other CI provider, just use syntax specifically for your CI tool.

{% highlight yaml %}
version: v1.0
name: My app
agent:
  machine:
    type: e1-standard-2
    os_image: ubuntu1804

blocks:
  - name: Install dependencies
    task:
      agent:
        machine:
          type: e1-standard-4
          os_image: ubuntu1804

      env_vars:
        - name: RAILS_ENV
          value: "test"

      secrets:
        - name: semaphore_secrets

      jobs:
        - name: Build gems and assets
          commands:
            - checkout
            # ...
            - cache restore $SEMAPHORE_PROJECT_NAME-cc-test-reporter
            - if [ -d 'cc-reporter' ]; then
              echo 'Found cc-reporter in cache';
              else
              mkdir cc-reporter;
              curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64 > ./cc-reporter/cc-test-reporter;
              chmod +x ./cc-reporter/cc-test-reporter;
              cache store $SEMAPHORE_PROJECT_NAME-cc-test-reporter cc-reporter;
              fi

  - name: Run specs
    task:
      env_vars:
        - name: RAILS_ENV
          value: "test"
        # write knapsack_pro logs to file instead of stdout:
        # log/knapsack_pro_node_0.log
        # log/knapsack_pro_node_1.log
        - name: KNAPSACK_PRO_LOG_DIR
          value: "log"
        # text we expect to find in logs when there was no tests executed for particular parallel job (CI node)
        - name: NO_TEST_EXECUTED_STR
          value: "[knapsack_pro] No test files were executed on this CI node"

      secrets:
        - name: semaphore_secrets

      prologue:
        commands:
          - checkout
          # ...
          - cache restore $SEMAPHORE_PROJECT_NAME-cc-test-reporter
          - mkdir -p coverage/final
          - ./cc-reporter/cc-test-reporter before-build

      # run 2 parallel jobs with Knapsack Pro Queue Mode
      jobs:
        - name: RSpec node 0 - Knapsack Pro
          commands:
            - KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:queue:rspec
            - STR_COUNT=`grep -F "$NO_TEST_EXECUTED_STR" log/knapsack_pro_node_0.log | wc -l | tr -d ' '`
            - if [ $STR_COUNT -eq 0 ]; then ./cc-reporter/cc-test-reporter format-coverage -t simplecov --output "coverage/final/codeclimate.$SEMAPHORE_JOB_ID.json"; fi
            - cache store coverage-0-$SEMAPHORE_WORKFLOW_ID coverage/final

        - name: RSpec node 1 - Knapsack Pro
          commands:
            - KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:queue:rspec
            - STR_COUNT=`grep -F "$NO_TEST_EXECUTED_STR" log/knapsack_pro_node_1.log | wc -l | tr -d ' '`
            - if [ $STR_COUNT -eq 0 ]; then ./cc-reporter/cc-test-reporter format-coverage -t simplecov --output "coverage/final/codeclimate.$SEMAPHORE_JOB_ID.json"; fi
            - cache store coverage-1-$SEMAPHORE_WORKFLOW_ID coverage/final

  - name: Post-test tasks
    task:
      secrets:
        - name: semaphore_secrets

      jobs:
        - name: CodeClimate
          commands:
            - cache restore $SEMAPHORE_PROJECT_NAME-cc-test-reporter
            # we have 2 parallel jobs so 0..1 range
            - for i in {0..1}; do cache restore coverage-$i-$SEMAPHORE_WORKFLOW_ID; done
            - FILES_COUNT=`ls -1 coverage/final | wc -l | tr -d ' '`
            - ./cc-reporter/cc-test-reporter sum-coverage --output - --parts $FILES_COUNT coverage/final/codeclimate.*.json | ./cc-reporter/cc-test-reporter upload-coverage --input -
            - for i in {0..1}; do cache delete coverage-$i-$SEMAPHORE_WORKFLOW_ID; done

{% endhighlight %}

## Summary and Queue Mode for dynamic test suite split

CI builds can be much faster thanks to leveraging parallel jobs on Semaphore CI 2.0 and CI parallelisation on any CI provider (<a href="/continuous_integration/">see more parallelisation examples for your CI providers</a>). You can check <a href="https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-merge-codeclimate-reports-for-parallel-jobs-ci-nodes">Knapsack Pro tool for CI parallelisation</a> and learn more about Queue Mode and what problems it solves in below video.

<iframe width="560" height="315" src="https://www.youtube.com/embed/hUEB1XDKEFY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
