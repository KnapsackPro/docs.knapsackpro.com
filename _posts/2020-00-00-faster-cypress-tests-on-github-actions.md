---
layout: post
title:  "Faster Cypress + Rspec test suite for Rails apps on GitHub Actions using Knapsack Pro"
date:   2018-11-17 19:00:00 +0100
author: "Matt Vague"
categories: continuous_integration cypress javascript parallelisation CI github actions
og_image: "/images/blog/posts/run-javascript-e2e-tests-faster-with-cypress-on-parallel-ci-nodes/cypress-logo.jpg"
---

Cypress is an amazing tool for end to end testing Rails applications, but large test suites can quickly take upwards of 20 minutes to run. Large RSpec suites can also take a long time. That's where Knapsack Pro comes in. Knapsack Pro Queue mode to intelligently split your test suite into jobs that can be run in parallel, reducing run time to only a few minutes. In this article we'll show how to implement Knapsack Pro Queue Mode to speed up both Cypress & RSpec test suites in a Ruby on Rails app. 

Here's an example setup file for a Rails App running webpacker, rspec, and cypress on GitHub Actions which shows the addition of Knapsack Pro

```
# .github/workflows/ci.yml
name: ci
on: [push]
jobs:
  # OPTIONAL: Cancel any previous CI runs to save your GH Actions minutes
  cancel:
    name: 'Cancel Previous Runs'
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
          node-version: '12'
      - uses: actions/cache@v2
        with:
          path: '**/node_modules'
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
        # options: --health-cmd pg_isready --health-interval 10s --health-timeout 5s --health-retries 5
    steps:
      - uses: actions/checkout@v2
      - uses: ruby/setup-ruby@v1
        with:
          bundler-cache: true
      - name: Build DB
        run: bin/rails db:schema:load
+    env:
+      KNAPSACK_PRO_CI_NODE_TOTAL: ${{ matrix.ci_node_total }}
+      KNAPSACK_PRO_CI_NODE_INDEX: ${{ matrix.ci_node_index }}
+      KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC: ${{ secrets.KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC }}
+      KNAPSACK_PRO_FIXED_QUEUE_SPLIT: true
+    run: bin/rake knapsack_pro:queue:rspec
-      - name: Run Rspec Tests
-        run: bin/rspec spec
  cypress:
    timeout-minutes: 20  # Adjust as needed, just here to prevent accidentally using up all your minutes from a silly infinite loop of some kind
    env:
      RAILS_ENV: test
      RACK_ENV: test
      GITHUB_TOKEN: ${{ github.token }}
      CYPRESS_CI: true
      TS_NODE_PROJECT: 0
    runs-on: ubuntu-latest
    needs: [bundle, yarn]
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2-beta
        with:
          node-version: '12'
      - uses: actions/cache@v2
        with:
          path: '**/node_modules'
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
          node-version: '12'
      - run: yarn wait-on 'http-get://localhost:3000' -t 30000
      - name: Run tests
        run: yarn cypress run
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
```

The complete example Rails app can be found [here](https://github.com/goodproblems/knapsack-example-rails-app)
