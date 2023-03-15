---
layout: post
title:  "Faster Cypress + RSpec test suite for Rails apps on GitHub Actions using Knapsack Pro"
date:   2021-03-23 19:00:00 +0100
author: "Matt Vague"
categories: continuous_integration cypress javascript parallelisation CI github actions
og_image: "/images/blog/posts/faster-cypress-rspec-test-suite-for-rails-apps-on-github-actions-using-knapsack-pro/cypress_rspec.jpeg"
---

Cypress is an amazing tool for end to end testing Rails applications, but large test suites can quickly take upwards of 20 minutes to run. That's where Knapsack Pro comes in. Knapsack Pro [Queue Mode to intelligently split your test suite into jobs that can be run in parallel](/2020/how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation), reducing run time to only a few minutes. In this article we'll show how to quickly implement Knapsack Pro Queue Mode to speed up both Cypress & RSpec test suites in a Ruby on Rails app on Github Actions

<img src="/images/blog/posts/faster-cypress-rspec-test-suite-for-rails-apps-on-github-actions-using-knapsack-pro/cypress_rspec.jpeg" style="width:450px;margin-left: 15px;float:right;" alt="Cypress + RSpec" />

## Set up Knapsack Pro API Keys

First step is to go to your Knapsack [dashboard](https://knapsackpro.com/dashboard?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=faster-cypress-rspec-test-suite-for-rails-apps-on-github-actions-using-knapsack-pro) and grab your API keys for both RSpec and Cypress. Once you have those, go to your Github Repo's settings, for example:

<img width="1404" alt="image" src="https://user-images.githubusercontent.com/64985/111044967-80297880-8400-11eb-92b6-8a1e8aa2701e.png">

## Set up your GitHub Actions config file

Once you've added your `KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC` and `KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS` secrets, the next step is setting up your GitHub Actions configuration file to use the Knapsack Runner in place of the normal commands to run RSpec and Cypress.

### Existing GitHub Actions config

For those that already have a GH actions config file setup (e.g. `.github/workflows/ci.yml`), here's all that you should need to change to get Knapsack Pro Queue Mode working for both Cypress and RSpec.

Change your RSpec run command to use Knapsack:

{% highlight diff %}
{% raw %}
+      strategy:
+        fail-fast: false
+        matrix:
+          # Set N number of parallel jobs you want to run tests on.
+          # Use higher number if you have slow tests to split them on more parallel jobs.
+          # Remember to update ci_node_index below to 0..N-1
+          ci_node_total: [2]
+          # set N-1 indexes for parallel jobs
+          # When you run 2 parallel jobs then first job will have index 0, the second job will have index 1 etc
+          ci_node_index: [0, 1]
      - name: Run RSpec Tests
+      env:
+        KNAPSACK_PRO_CI_NODE_TOTAL: ${{ matrix.ci_node_total }}
+        KNAPSACK_PRO_CI_NODE_INDEX: ${{ matrix.ci_node_index }}
+        KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC: ${{ secrets.KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC }}
+        KNAPSACK_PRO_FIXED_QUEUE_SPLIT: true
+    run: bin/rake knapsack_pro:queue:rspec  # Run RSpec using Knapsack Pro Queue Mode
-    run: bin/rspec spec
{% endraw %}
{% endhighlight %}

Change your cypress run command to use Knapsack as well:

{% highlight diff %}
{% raw %}
+      strategy:
+        fail-fast: false
+        matrix:
+          ci_node_total: [5]
+          # set N-1 indexes for parallel jobs
+          # When you run 2 parallel jobs then first job will have index 0, the second job will have index 1 etc
+          ci_node_index: [0, 1, 2, 3, 4]
      - name: Run cypress tests
+        env:
+          KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS: ${{ secrets.KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS }}
+          KNAPSACK_PRO_CI_NODE_TOTAL: ${{ matrix.ci_node_total }}
+          KNAPSACK_PRO_CI_NODE_INDEX: ${{ matrix.ci_node_index }}
+          KNAPSACK_PRO_FIXED_QUEUE_SPLIT: true
+          KNAPSACK_PRO_TEST_FILE_PATTERN: '{cypress/**/*,app/javascript/**/*.component}.spec.{js,ts,tsx}'
+        run: yarn knapsack-pro-cypress
-        run: yarn cypress run
{% endraw %}
{% endhighlight %}

### New Github Actions config file

For those starting from scratch, here's a full example `.github/workflows/ci.yaml` for a Rails app with Cypress + RSpec with Knapsack tokens for RSpec and Cypress already added.

{% highlight yml %}
{% raw %}
name: ci
on: [push]
jobs:
  # OPTIONAL: Cancel any previous CI runs to save your GH Actions minutes
  cancel:
    name: "Cancel Previous Runs"
    runs-on: ubuntu-20.04
    timeout-minutes: 3
    steps:
      - uses: styfle/cancel-workflow-action@0.8.0
        with:
          workflow_id: 3553203
  yarn:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2-beta
        with:
          node-version: "12"
      - uses: actions/cache@v2
        with:
          path: "**/node_modules"
          key: ${{ runner.os }}-yarn-${{ hashFiles('yarn.lock') }}
          restore-keys: |
            ${{ runner.os }}-yarn-
      - name: Yarn install
        run: yarn install --frozen-lockfile
        env:
          CYPRESS_INSTALL_BINARY: 0 # Prevent installing Cypress binary until later when it's needed
  bundle:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: ruby/setup-ruby@v1
        with:
          bundler-cache: true
  rspec:
    timeout-minutes: 3 # Adjust as needed, just here to prevent accidentally using up all your minutes from a silly infinite loop of some kind
    env:
      RAILS_ENV: test
    runs-on: ubuntu-latest
    needs: [bundle]
    strategy:
      fail-fast: false
      matrix:
        # Set N number of parallel jobs you want to run tests on.
        # Use higher number if you have slow tests to split them on more parallel jobs.
        # Remember to update ci_node_index below to 0..N-1
        ci_node_total: [2]
        # set N-1 indexes for parallel jobs
        # When you run 2 parallel jobs then first job will have index 0, the second job will have index 1 etc
        ci_node_index: [0, 1]
    steps:
      - uses: actions/checkout@v2
      - uses: ruby/setup-ruby@v1
        with:
          bundler-cache: true
      - name: Build DB
        run: bin/rails db:schema:load
      - name: Run RSpec Tests
        env:
          PGPORT: ${{ job.services.postgres.ports[5432] }} # get randomly assigned published port
          KNAPSACK_PRO_CI_NODE_TOTAL: ${{ matrix.ci_node_total }}
          KNAPSACK_PRO_CI_NODE_INDEX: ${{ matrix.ci_node_index }}
          KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC: ${{ secrets.KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC }}
          KNAPSACK_PRO_FIXED_QUEUE_SPLIT: true
        run: bin/rake knapsack_pro:queue:rspec # Run RSpec using Knapsack Pro Queue Mode
  cypress:
    timeout-minutes: 20 # Adjust as needed, just here to prevent accidentally using up all your minutes from a silly infinite loop of some kind
    env:
      RAILS_ENV: test
      RACK_ENV: test
      GITHUB_TOKEN: ${{ github.token }}
    runs-on: ubuntu-latest
    needs: [bundle, yarn]
    strategy:
      fail-fast: false
      matrix:
        ci_node_total: [5]
        # set N-1 indexes for parallel jobs
        # When you run 5 parallel jobs then first job will have index 0, the second job will have index 1 etc
        ci_node_index: [0, 1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2-beta
        with:
          node-version: "12"
      - uses: actions/cache@v2
        with:
          path: "**/node_modules"
          key: ${{ runner.os }}-yarn-${{ hashFiles('yarn.lock') }}
      - uses: ruby/setup-ruby@v1
        with:
          bundler-cache: true
      - name: Build DB
        run: bin/rails db:schema:load
      - name: Run Rails Server in background
        run: bin/rails server -p 3000 &
      - run: npx cypress -v > .cypress-version
      - uses: actions/cache@v2
        with:
          path: ~/.cache/Cypress
          key: cypress-cache-v3-${{ runner.os }}-${{ hashFiles('.cypress-version') }}
      - run: yarn cypress install
      - uses: actions/setup-node@v2-beta
        with:
          node-version: "12"
      - run: yarn wait-on 'http-get://localhost:3000' -t 30000
      - name: Run tests
        env:
          KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS: ${{ secrets.KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS }}
          KNAPSACK_PRO_CI_NODE_TOTAL: ${{ matrix.ci_node_total }}
          KNAPSACK_PRO_CI_NODE_INDEX: ${{ matrix.ci_node_index }}
          KNAPSACK_PRO_FIXED_QUEUE_SPLIT: true
          KNAPSACK_PRO_TEST_FILE_PATTERN: "{cypress/**/*,app/javascript/**/*.component}.spec.{js,ts,tsx}"
        run: yarn knapsack-pro-cypress # Run Cypress using Knapsack Pro Queue Mode
      # Save screenshots and videos of failed tests and make them available as Github build artifacts
      - uses: actions/upload-artifact@v2
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots
      - uses: actions/upload-artifact@v2
        if: failure()
        with:
          name: cypress-videos
          path: cypress/videos
      - uses: actions/upload-artifact@v2
        if: failure()
        with:
          name: cypress-logs
          path: cypress/logs
{% endraw %}
{% endhighlight %}

## Add Knapsack Pro gem and npm package

Add the Knapsack Pro gem to your `Gemfile`:

{% highlight ruby %}
group :development, :test do
  #...
  gem 'knapsack_pro'
end
{% endhighlight %}

Add the Knapsack Pro npm package with `yarn add --dev @knapsack-pro/cypress`

## Run your tests & view your results

Once you've completed the above steps, trigger a test run on your repo. You should see multiple jobs for both RSpec and Cypress like so: 

<img width="345" alt="Screen Shot 2021-03-23 at 10 13 30 AM" src="https://user-images.githubusercontent.com/64985/112190195-017fc880-8bc2-11eb-85ea-00fa3469be43.png">

Now check your [Knapsack Dashboard](https://knapsackpro.com/dashboard?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=faster-cypress-rspec-test-suite-for-rails-apps-on-github-actions-using-knapsack-pro) for the results 🚀

The complete example Rails app can be found [here](https://github.com/goodproblems/knapsack-example-rails-app). Happy testing!

## Related resources

* [Installation guide for Knapsack Pro](/)
* [Regular Mode vs Queue Mode](/2021/setting-up-knapsack-pro-in-rspec-project)
* [How to merge Cypress test reports generated by Mochawesome on Github Actions](/2020/how-to-merge-cypress-test-reports-generated-by-mochawesome-on-github-actions)
