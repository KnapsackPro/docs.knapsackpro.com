---
layout: post
title:  "Running faster Cypress tests on GitHub Actions"
date:   2018-11-17 19:00:00 +0100
author: "Artur Trzop"
categories: continuous_integration cypress javascript parallelisation CI github actions
og_image: "/images/blog/posts/run-javascript-e2e-tests-faster-with-cypress-on-parallel-ci-nodes/cypress-logo.jpg"
---

Getting cypress, github actions, and Knapsack Pro queue mode working together is easy. In my app, GoodProblems, we use a React + Rails + Webpacker stack with cypress so that's what I'll show here but the same principles go for pretty much any stack.
 
## ci.yml

### Initial setup

- `timeout-minutes: 20`

### yarn

- First step is installing yarn
- Setting `CYPRESS_INSTALL_BINARY: 0` causes cypress to skip installing the binary until later (`yarn cypress install`)
- Frozen lockfile prevents writing to yarn.lock and (?) raises an error if it tries

```
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
        CYPRESS_INSTALL_BINARY: 0
```

### cypress

- strategy fail fast
- nodes: ` ci_node_index: [0, 1, 2, 3, 4]`
- `    - run: npx cypress -v > .cypress-version` writes cypress version which is hashed laster as a cache key
- Now install cypress binary `yarn cypress install`
-  yarn wait-on 'http-get://localhost:3000/graphql' -t 30000
- Env vars:
```
KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS: ${{ secrets.KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS }}
KNAPSACK_PRO_CI_NODE_TOTAL: ${{ matrix.ci_node_total }}
KNAPSACK_PRO_CI_NODE_INDEX: ${{ matrix.ci_node_index }}
KNAPSACK_PRO_FIXED_QUEUE_SPLIT: true
KNAPSACK_PRO_TEST_FILE_PATTERN: "{cypress/**/*,app/javascript/**/*.component}.spec.{js,ts,tsx}"
```
- Running `run: yarn knapsack-pro-cypress`
- Artifacts...

```
cypress:
    env:
      RAILS_ENV: ci
      RACK_ENV: ci
      GITHUB_TOKEN: ${{ github.token }}
      WEBPACKER_COMPILE: false
      CI: 1
      CYPRESS_CI: true
      TERM: xterm
      TS_NODE_PROJECT: 0
    runs-on: ubuntu-latest
    timeout-minutes: 20
    needs: [bundle,yarn,assets]
    services:
      postgres:
        image: postgres:12
        env:
          POSTGRES_USER: ${{ env.PGUSER }}
          POSTGRES_PASSWORD: ${{ env.PGPASSWORD }}
          POSTGRES_DB: learning-app-api_ci
        ports:
        - 5432/tcp
      redis:
        image: redis
        ports:
        - 6379/tcp
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    strategy:
      fail-fast: false
      matrix:
        ci_node_total: [5]
        # set N-1 indexes for parallel jobs
        # When you run 2 parallel jobs then first job will have index 0, the second job will have index 1 etc
        ci_node_index: [0, 1, 2, 3, 4]
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2-beta
      with:
        node-version: '12'
    - uses: actions/cache@v2
      with:
        path: '**/node_modules'
        key: ${{ runner.os }}-yarn-${{ hashFiles('yarn.lock') }}
    - uses: actions/cache@v2
      with:
        path: |
          public/packs
          tmp/cache/webpacker
        key: assets-cache-v3-${{ runner.os }}-${{ hashFiles('app/javascript/**/*', 'yarn.lock', 'cypress/**/*') }}
    - uses: ruby/setup-ruby@v1
      with:
        bundler-cache: true
    - name: Build DB
      env:
        PGPORT: ${{ job.services.postgres.ports[5432] }} # get randomly assigned published port
      run: bin/rails db:schema:load
    - name: Run Rails Server in background
      run: bin/rails server -p 3000 &
      env:
        PGPORT: ${{ job.services.postgres.ports[5432] }} # get randomly assigned published port
        REDIS_URL: redis://localhost:${{ job.services.redis.ports[6379] }}
    - run: npx cypress -v > .cypress-version
    - uses: actions/cache@v2
      with:
        path: ~/.cache/Cypress
        key: cypress-cache-v3-${{ runner.os }}-${{ hashFiles('.cypress-version') }}
    - run: yarn cypress install
    - name: Setup /etc/hosts
      run: sudo ./bin/setup_hosts
    - uses: actions/setup-node@v2-beta
      with:
        node-version: '12'
    - run: yarn wait-on 'http-get://localhost:3000/graphql' -t 30000
    - name: Run tests with Knapsack Pro
      env:
        KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS: ${{ secrets.KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS }}
        KNAPSACK_PRO_CI_NODE_TOTAL: ${{ matrix.ci_node_total }}
        KNAPSACK_PRO_CI_NODE_INDEX: ${{ matrix.ci_node_index }}
        KNAPSACK_PRO_FIXED_QUEUE_SPLIT: true
        KNAPSACK_PRO_TEST_FILE_PATTERN: "{cypress/**/*,app/javascript/**/*.component}.spec.{js,ts,tsx}"
      run: yarn knapsack-pro-cypress
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
