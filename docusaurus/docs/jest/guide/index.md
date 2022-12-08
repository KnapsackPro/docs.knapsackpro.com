---
toc_max_heading_level: 4
pagination_next: null
pagination_prev: null
---

# Installation guide for @knapsack-pro/jest

## Installation

Please ensure you have added `jest` package in your project `package.json`.
`@knapsack-pro/jest` uses `jest` version installed in your project.

For `npm` users:

```bash
$ npm install --save-dev @knapsack-pro/jest
```

For `yarn` users:

```bash
$ yarn add --dev @knapsack-pro/jest
```

Whenever you see `npm` in below steps you can use `yarn` there as well.

## How to use

### Configuration steps

1. To get API token just sign up at [KnapsackPro.com](https://knapsackpro.com?utm_source=github&utm_medium=readme&utm_campaign=%40knapsack-pro%2Fjest&utm_content=sign_up). Please add to your CI environment variables `KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST`. You can generate API token in [user dashboard](https://knapsackpro.com/dashboard).

   Next to your API token, you can find a link "Build metrics" where you can preview recorded CI builds. You will see yellow tips if something is not configured as expected. Refresh the page once you finish running tests to see new tips. You can also click "Show" on CI build to see details about particular CI build. Look for yellow tips suggesting what to change to ensure all works fine for your project.

2. (optional) Do you want to use "retry single failed parallel CI node" feature for your CI? For instance some of CI providers like Travis CI, Buildkite or Codeship allows you to retry only one of failed parallel CI node instead of retrying the whole CI build with all parallel CI nodes. If you want to be able to retry only single failed parallel CI node then you need to tell Knapsack Pro API to remember the way how test files where allocated across parallel CI nodes by adding to your CI environment variables `KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true`.

   The default is `KNAPSACK_PRO_FIXED_QUEUE_SPLIT=false` which means when you want to retry the whole failed CI build then a new dynamic test suite split will happen across all retried parallel CI nodes thanks to Knapsack Pro Queue Mode. Some people may prefer to retry the whole failed CI build with test files allocated across parallel CI nodes in the same order as it happend for the failed CI build - in such case you should set `KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true`.

3. (optional) If one of the parallel CI nodes starts work very late after other parallel CI nodes already finished work.

   Some of CI providers have a problem with starting parallel CI nodes as soon as possible. For instance, you have a fixed pool of parallel CI nodes shared with many CI builds and sometimes CI build has started work even the pool has not enough available parallel CI nodes at the moment. Another case is when the CI provider infrastructure is overloaded which can lead to some parallel CI nodes starting work later than others.

   Do you have the CI server that does not start all parallel CI nodes at the same time and one of your parallel CI nodes will start work very late after all other parallel CI nodes already finished consuming tests from the Knapsack Pro Queue? In such a case, if you would use default `KNAPSACK_PRO_FIXED_QUEUE_SPLIT=false` then the very late CI node would start running all tests again based on a new Queue which means you would run test suite twice. This problem can happen if your test suite is very small and differences in the start time of parallel CI nodes are very big.

   You should set `KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true` to ensure the very late parallel CI node won't run tests again if the Queue was already consumed. The downside of this is that you won't be able to run 2nd CI build for the same set of values git commit/branch/ci node total number with a dynamic test suite split way if your CI provider does not expose unique CI build ID. Instead, the tests will be run assigned to the same parallel CI node indexes with the same order as it was recorded for the first time.

   Knapsack Pro tries to detect CI build ID from the environment variables of your CI provider. Here you can check if your CI provider exposes CI build ID, see function [`ciNodeBuildId`](https://github.com/KnapsackPro/knapsack-pro-core-js/blob/master/src/ci-providers/github-actions.ts#L14) (example for Github Actions). If you CI provider won't provide CI build ID you can set `KNAPSACK_PRO_CI_NODE_BUILD_ID` (see next point).

4. (optional) `@knapsack-pro/jest` detects information about CI build from supported CI environment variables. When information like git branch name and git commit hash cannot be detect from CI environment variables then `@knapsack-pro/jest` will try to use git installed on CI machine to detect the infomation. If you don't have git installed then you should set the information using environment variables:

   - `KNAPSACK_PRO_COMMIT_HASH` - git commit hash (SHA1)
   - `KNAPSACK_PRO_BRANCH` - git branch name
   - `KNAPSACK_PRO_CI_NODE_BUILD_ID` - a unique ID for your CI build. All parallel CI nodes being part of single CI build must have the same node build ID. Example how to generate node build ID: `KNAPSACK_PRO_CI_NODE_BUILD_ID=$(openssl rand - base64 32)`.

5. If you have test files in a non-default directory or you specify test files to run in Jest config file then you won't be able to run tests and you may see below error.

   ```
   Response body:
   { errors: [ { test_files: [ 'parameter is required' ] } ] }
   ```

   Please [adjust `KNAPSACK_PRO_TEST_FILE_PATTERN`](https://knapsackpro.com/faq/question/how-to-run-tests-only-from-specific-directory-in-jest) variable to match your test files directory structure to let Knapsack Pro detect all the test files you want to run in parallel. You can also exclude test files with [`KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN`](https://knapsackpro.com/faq/question/how-to-exclude-tests-to-ignore-them-from-running-in-jest).

6. If you want to use [Jest config file with `@knapsack-pro/jest`](https://knapsackpro.com/faq/question/how-to-use-jest-config-file-with-knapsack-pro-jest) check this tip.

7. If you use `--coverage` flag for Jest to generate code coverage then to make it work please check [how to generate code coverage for Jest with `@knapsack-pro/jest` in Queue Mode](https://knapsackpro.com/faq/question/how-to-generate-code-coverage-for-jest-with-knapsack-pro-jest-in-queue-mode)?

8. If you use `jest-junit` please check [how to generate XML report using `jest-junit` with `@knapsack-pro/jest` in Queue Mode](https://knapsackpro.com/faq/question/how-to-generate-xml-report-using-jest-junit-with-knapsack-pro-jest-in-queue-mode)?

9. To run tests faster you should pass option [`--runInBand`](https://jestjs.io/docs/en/cli#--runinband) to Knapsack Pro that will pass it down to Jest:

   ```bash
   $(npm bin)/knapsack-pro-jest --runInBand
   ```

   You will see where to add the above command in your CI provider config in further steps.

   `--runInBand` does run all tests serially in the current process, rather than creating a worker pool of child processes. Knapsack Pro starts Jest process for each set of tests fetched from Knapsack Pro Queue API.
   By using `--runInBand` you can save time by not starting the worker pool of child processes for each set of tests fetched from Knapsack Pro Queue API.

   See [example how test suite can run 2 times faster with `--runInBand`](https://github.com/KnapsackPro/knapsack-pro-jest/issues/24). You can test this option yourself to verify if it helps increase the speed of tests in case of your test suite.

10. If your code is written in TypeScript and you run specs with `ts-jest`, consider moving typechecking and diagnostics to a separate CI step and disable typechecking on Jest runs.
    This setting prevents `ts-jest` from running `tsc` on your code for every Knapsack grouping, repeating effort. On a larger codebase, it could prevent increasing your execution time by more than 50%.

    ```json
    /* jest.config.js */
    {
      "globals": {
        "ts-jest": {
          "diagnostics": false,
          "isolatedModules": true
        }
      }
    }
    ```

11. Please select your CI provider and follow instructions to run tests with `@knapsack-pro/jest`.

    - [CircleCI](#circleci)
    - [Travis CI](#travis-ci)
    - [Buildkite.com](#buildkitecom)
    - [Codeship.com](#codeshipcom)
    - [Heroku CI](#heroku-ci)
    - [Solano CI](#solano-ci)
    - [AppVeyor](#appveyor)
    - [GitLab CI](#gitlab-ci)
    - [SemaphoreCI.com](#semaphorecicom)
    - [Cirrus-CI.org](#cirrus-ciorg)
    - [Jenkins](#jenkins)
    - [GitHub Actions](#github-actions)
    - [Codefresh.io](#codefreshio)
    - [Other CI provider](#other-ci-provider)

### CI steps

#### CircleCI

Example configuration for CircleCI 2.0 platform.

```yaml
# ~/.circleci/config.yml
version: 2
jobs:
  test:
    docker:
      - image: circleci/<language>:<version TAG>
    parallelism: 2 # run 2 parallel CI nodes

    steps:
      - checkout

      - run:
        name: Run Jest tests with @knapsack-pro/jest using Knapsack Pro Queue Mode
        command: $(npm bin)/knapsack-pro-jest
```

Please remember to add additional parallel containers for your project in CircleCI settings.

#### Travis CI

You can parallelize your CI build across virtual machines with [travis matrix feature](https://docs.travis-ci.com/user/speeding-up-the-build/#parallelizing-your-builds-across-virtual-machines).

```yaml
# .travis.yml
script:
  - '$(npm bin)/knapsack-pro-jest'

env:
  global:
    - KNAPSACK_PRO_CI_NODE_TOTAL=2
    # allows to be able to retry failed tests on one of parallel job (CI node)
    - KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true

  jobs:
    - KNAPSACK_PRO_CI_NODE_INDEX=0
    - KNAPSACK_PRO_CI_NODE_INDEX=1
```

The configuration will generate matrix with 2 parallel jobs (2 parallel CI nodes):

```
# first CI node (first parallel job)
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0

# second CI node (second parallel job)
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1
```

More info about global and matrix ENV configuration in [travis docs](https://docs.travis-ci.com/user/customizing-the-build/#build-matrix).

#### Buildkite.com

The only thing you need to do is to configure the parallelism parameter (number of parallel agents) in your build step and run the below command in your build:

```bash
$(npm bin)/knapsack-pro-jest
```

If you want to use Buildkite retry single agent feature to retry just failed tests on particular agent (CI node) then you should set `KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true`.

**Other useful resources:**

Here you can find article [how to set up a new pipeline for your project in Buildkite and configure Knapsack Pro](http://docs.knapsackpro.com/2017/auto-balancing-7-hours-tests-between-100-parallel-jobs-on-ci-buildkite-example) and 2 example repositories for Ruby/Rails projects:

- [Buildkite Rails Parallel Example with Knapsack Pro](https://github.com/KnapsackPro/buildkite-rails-parallel-example-with-knapsack_pro)
- [Buildkite Rails Docker Parallel Example with Knapsack Pro](https://github.com/KnapsackPro/buildkite-rails-docker-parallel-example-with-knapsack_pro)

When using the `docker-compose` plugin on Buildkite, you have to tell it which environment variables to pass to the docker container. Thanks to it Knapsack Pro can detect info about CI build like commit, branch name, amount of parallel nodes.

```yaml
steps:
  - label: 'Test'
    parallelism: 2
    plugins:
      - docker-compose#3.0.3:
        run: app
        command: $(npm bin)/knapsack-pro-jest
        config: docker-compose.test.yml
        env:
          - BUILDKITE_PARALLEL_JOB_COUNT
          - BUILDKITE_PARALLEL_JOB
          - BUILDKITE_BUILD_NUMBER
          - BUILDKITE_COMMIT
          - BUILDKITE_BRANCH
```

#### Codeship.com

Codeship does not provide parallel jobs environment variables so you will have to define `KNAPSACK_PRO_CI_NODE_TOTAL` and `KNAPSACK_PRO_CI_NODE_INDEX` for each [parallel test pipeline](https://documentation.codeship.com/basic/builds-and-configuration/parallel-tests/#using-parallel-test-pipelines). Below is an example for 2 parallel test pipelines.

Configure test pipelines (1/2 used)

```bash
# first CI node running in parallel
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 $(npm bin)/knapsack-pro-jest
```

Configure test pipelines (2/2 used)

```bash
# second CI node running in parallel
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 $(npm bin)/knapsack-pro-jest
```

Remember to add API token `KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST` to `Environment` page of your project settings in Codeship.

CodeShip uses the same build number if you restart a build. Because of that you need to set `KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true` in order to be able to restart CI build.

#### Heroku CI

You can parallelize your tests on [Heroku CI](https://devcenter.heroku.com/articles/heroku-ci) by configuring `app.json` for your project.

You can set how many parallel dynos with tests you want to run with `quantity` value.
Use `test` key to run tests with `@knapsack-pro/jest` as shown in below example.

You need to specify also the environment variable `KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST` with API token for Knapsack Pro.
For any sensitive environment variables (like Knapsack Pro API token) that you do not want commited in your `app.json` manifest, you can add them to your pipeline’s Heroku CI settings.

```json
# app.json
{
  "environments": {
    "test": {
      "formation": {
        "test": {
          "quantity": 2
        }
      },
      "addons": [
        "heroku-postgresql"
      ],
      "scripts": {
        "test": "$(npm bin)/knapsack-pro-jest"
      },
      "env": {
        "KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST": "example"
      }
    }
  }
}
```

If you would like to [run multiple Knapsack Pro commands for different test runners on Heroku CI](https://knapsackpro.com/faq/question/how-to-run-multiple-test-suite-commands-in-heroku-ci) please follow tips.

Note the [Heroku CI Parallel Test Runs](https://devcenter.heroku.com/articles/heroku-ci-parallel-test-runs) are in Beta and you may need to ask Heroku support to enable it for your project.

You can learn more about [Heroku CI](https://devcenter.heroku.com/articles/heroku-ci).

#### Solano CI

[Solano CI](https://www.solanolabs.com) does not provide parallel jobs environment variables so you will have to define `KNAPSACK_PRO_CI_NODE_TOTAL` and `KNAPSACK_PRO_CI_NODE_INDEX` for each parallel job running as part of the same CI build.

```bash
# Step for first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 $(npm bin)/knapsack-pro-jest

# Step for second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 $(npm bin)/knapsack-pro-jest
```

Please remember to set up API token `KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST` as global environment.

#### AppVeyor

[AppVeyor](https://www.appveyor.com) does not provide parallel jobs environment variables so you will have to define `KNAPSACK_PRO_CI_NODE_TOTAL` and `KNAPSACK_PRO_CI_NODE_INDEX` for each parallel job running as part of the same CI build.

```bash
# Step for first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 $(npm bin)/knapsack-pro-jest

# Step for second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 $(npm bin)/knapsack-pro-jest
```

Please remember to set up API token `KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST` as global environment.

#### GitLab CI

Remember to add API token `KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST` to [Secret Variables](https://gitlab.com/help/ci/variables/README.md#secret-variables) in `Gitlab CI Settings -> CI/CD Pipelines -> Secret Variables`.

##### GitLab CI `>= 11.5`

```yaml
test:
  parallel: 2
  script: $(npm bin)/knapsack-pro-jest
```

Here you can find info [how to configure the GitLab parallel CI nodes](https://docs.gitlab.com/ee/ci/yaml/#parallel).

##### GitLab CI `< 11.5` (old GitLab CI)

GitLab CI does not provide parallel jobs environment variables so you will have to define `KNAPSACK_PRO_CI_NODE_TOTAL` and `KNAPSACK_PRO_CI_NODE_INDEX` for each parallel job running as part of the same `test` stage. Below is relevant part of `.gitlab-ci.yml` configuration for 2 parallel jobs.

```yaml
# .gitlab-ci.yml
stages:
  - test

variables:
  KNAPSACK_PRO_CI_NODE_TOTAL: 2

# first CI node running in parallel
test_ci_node_0:
  stage: test
  script:
    - export KNAPSACK_PRO_CI_NODE_INDEX=0
    - $(npm bin)/knapsack-pro-jest

# second CI node running in parallel
test_ci_node_1:
  stage: test
  script:
    - export KNAPSACK_PRO_CI_NODE_INDEX=1
    - $(npm bin)/knapsack-pro-jest
```

#### SemaphoreCI.com

##### Semaphore 2.0

`@knapsack-pro/jest` supports environment variables provided by Semaphore CI 2.0 to run your tests. You will have to define a few things in `.semaphore/semaphore.yml` config file.

- You need to set `KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST`. If you don't want to commit secrets in yml file then you can [follow this guide](https://docs.semaphoreci.com/article/66-environment-variables-and-secrets).
- You should create as many parallel jobs as you need with `parallelism` property. If your test suite is slow you should use more parallel jobs.

Below you can find example part of Semaphore CI 2.0 config.

```yaml
blocks:
  - name: Jest tests
    task:
      env_vars:
        - name: KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST
          value: your_api_token_here
      prologue:
        commands:
          - checkout
          - nvm install --lts carbon
          - sem-version node --lts carbon

      jobs:
        - name: Run tests with Knapsack Pro
          parallelism: 2
          commands:
            - $(npm bin)/knapsack-pro-jest
```

##### Semaphore 1.0

The only thing you need to do is set up `@knapsack-pro/jest` for as many parallel threads as you need. Here is an example:

```bash
# Thread 1
$(npm bin)/knapsack-pro-jest

# Thread 2
$(npm bin)/knapsack-pro-jest
```

Tests will be split across 2 parallel threads.

Please remember to set up API token `KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST` as global environment.

#### Cirrus-CI.org

The only thing you need to do is to configure number of parallel CI nodes for your project by using [matrix modification](https://cirrus-ci.org/guide/writing-tasks/#matrix-modification). See example for 2 parallel CI nodes.

```yaml
# .cirrus.yml
task:
  matrix:
    name: CI node 0
    name: CI node 1
  test_script: $(npm bin)/knapsack-pro-jest
```

Please remember to set up API token `KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST` as global environment.

Here is Ruby example for [`.cirrus.yml` configuration file](https://cirrus-ci.org/examples/#ruby) that you may find useful.

#### Jenkins

In order to run parallel jobs with Jenkins you should use Jenkins Pipeline.
You can learn basics about it in the article [Parallelism and Distributed Builds with Jenkins](https://www.cloudbees.com/blog/parallelism-and-distributed-builds-jenkins).

Here is example `Jenkinsfile` working with Jenkins Pipeline.

```groovy
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
          sh """${knapsack_options} $(npm bin)/knapsack-pro-jest"""
        }
      }
    }
  }

  parallel nodes // run CI nodes in parallel
}
```

Remember to set environment variable `KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST` in Jenkins configuration with your API token.

#### GitHub Actions

`@knapsack-pro/jest` supports environment variables provided by GitHub Actions to run your tests. You have to define a few things in `.github/workflows/main.yaml` config file.

- You need to set `KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST` environment variable in GitHub repository Settings -> Secrets. See [creating and using secrets in GitHub Actions](https://help.github.com/en/articles/virtual-environments-for-github-actions#creating-and-using-secrets-encrypted-variables).
- You should create as many parallel jobs as you need with `matrix.ci_node_total` and `matrix.ci_node_index` properties. If your test suite is slow you should use more parallel jobs.

Below you can find config for GitHub Actions.

```yaml
# .github/workflows/main.yaml
name: Main

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      fail-fast: false
      matrix:
        node-version: [8.x]
        # Set N number of parallel jobs you want to run tests on.
        # Use higher number if you have slow tests to split them on more parallel jobs.
        # Remember to update ci_node_index below to 0..N-1
        ci_node_total: [2]
        # set N-1 indexes for parallel jobs
        # When you run 2 parallel jobs then first job will have index 0, the second job will have index 1 etc
        ci_node_index: [0, 1]

    steps:
      - uses: actions/checkout@v1

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}

      - name: npm install and build
        run: |
          npm install
          npm run build --if-present

      - name: Run tests with Knapsack Pro
        env:
          KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST: ${{ secrets.KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST }}
          KNAPSACK_PRO_CI_NODE_TOTAL: ${{ matrix.ci_node_total }}
          KNAPSACK_PRO_CI_NODE_INDEX: ${{ matrix.ci_node_index }}
          # allows rerun parallel jobs with the same set of tests
          # that were consumed from Queue in the very first CI build run
          KNAPSACK_PRO_FIXED_QUEUE_SPLIT: true
        run: |
          $(npm bin)/knapsack-pro-jest
```

#### Codefresh.io

`@knapsack-pro/jest` supports environment variables provided by Codefresh.io to run your tests. You have to define a few things in `.codefresh/codefresh.yml` config file.

- You need to set an API token `KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST` in Codefresh dashboard, see left menu Pipelines -> settings (cog icon next to the pipeline) -> Variables tab (see a vertical menu on the right side).
- Set where Codefresh YAML file can be found. In Codefresh dashboard, see left menu Pipelines -> settings (cog icon next to pipeline) -> Workflow tab (horizontal menu on the top) -> Path to YAML (set there `./.codefresh/codefresh.yml`).
- Set how many parallel jobs (parallel CI nodes) you want to run with `KNAPSACK_PRO_CI_NODE_TOTAL` environment variable in `.codefresh/codefresh.yml` file.
- Ensure in the `matrix` section you listed all `KNAPSACK_PRO_CI_NODE_INDEX` environment variables with a value from `0` to `KNAPSACK_PRO_CI_NODE_TOTAL-1`. Codefresh will generate a matrix of parallel jobs where each job has a different value for `KNAPSACK_PRO_CI_NODE_INDEX`. Thanks to that Knapsack Pro knows what tests should be run on each parallel job.

Below you can find Codefresh YAML config and `Test.Dockerfile` used by Codefresh to run the project and Jest test suite inside of Docker container.

```yaml
# .codefresh/codefresh.yml
version: '1.0'

stages:
  - 'clone'
  - 'build'
  - 'tests'

steps:
  main_clone:
    type: 'git-clone'
    description: 'Cloning main repository...'
    repo: '${{CF_REPO_OWNER}}/${{CF_REPO_NAME}}'
    revision: '${{CF_BRANCH}}'
    stage: 'clone'
  BuildTestDockerImage:
    title: Building Test Docker image
    type: build
    arguments:
      image_name: '${{CF_ACCOUNT}}/${{CF_REPO_NAME}}-test'
      tag: '${{CF_BRANCH_TAG_NORMALIZED}}-${{CF_SHORT_REVISION}}'
      dockerfile: Test.Dockerfile
    stage: 'build'

  run_tests:
    stage: 'tests'
    image: '${{BuildTestDockerImage}}'
    working_directory: /src
    fail_fast: false
    environment:
      # set how many parallel jobs you want to run
      - KNAPSACK_PRO_CI_NODE_TOTAL=2
    matrix:
      environment:
        # please ensure you have here listed N-1 indexes
        # where N is KNAPSACK_PRO_CI_NODE_TOTAL
        - KNAPSACK_PRO_CI_NODE_INDEX=0
        - KNAPSACK_PRO_CI_NODE_INDEX=1
    commands:
      - $(npm bin)/knapsack-pro-jest
```

Add `Test.Dockerfile` to your project repository.

```Dockerfile
FROM node:10.13

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
```

#### Other CI provider

You have to define `KNAPSACK_PRO_CI_NODE_TOTAL` and `KNAPSACK_PRO_CI_NODE_INDEX` for each parallel job running as part of the same CI build.

```bash
# Step for first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 $(npm bin)/knapsack-pro-jest

# Step for second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 $(npm bin)/knapsack-pro-jest
```

Please remember to set up API token `KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST` as global environment variable.

## FAQ

- [FAQ for Knapsack Pro Jest can be found here](https://knapsackpro.com/faq/knapsack_pro_client/knapsack_pro_jest).
- This project depends on `@knapsack-pro/core`. Please check the [FAQ for `@knapsack-pro/core`](https://github.com/KnapsackPro/knapsack-pro-core-js#table-of-contents) to learn more about core features available to you.
