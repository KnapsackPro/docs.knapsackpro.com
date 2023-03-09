---
toc_max_heading_level: 2
pagination_next: null
pagination_prev: null
---

import { RadioGroup } from '@site/src/components/RadioGroup'
import { ShowIfSearchParam, ShowIfSearchParamAndValue } from '@site/src/components/ShowIf'
import { DelayHashNavigation } from '@site/src/components/DelayHashNavigation'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Knapsack Pro Cypress: Quickstart

<DelayHashNavigation milliseconds={400} />

[Create an account](http://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=page&utm_campaign=knapsack-pro-cypress&utm_content=installation_guide) to generate API tokens and use Knapsack Pro.

## Installation

Make sure you have `cypress` in your `package.json` because `@knapsack-pro/cypress` uses the version installed in your project.

<Tabs>
<TabItem value="npm">

```bash
# Cypress version >=10
npm install --save-dev @knapsack-pro/cypress

# Cypress version <10
npm install --save-dev "@knapsack-pro/cypress@^4.6.0"
```

</TabItem>
<TabItem value="yarn">

```bash
# Cypress version >=10
yarn add --dev @knapsack-pro/cypress

# Cypress version <10
yarn add --dev @knapsack-pro/cypress@4.6.0
```

</TabItem>
</Tabs>

Now, fill in the following form to generate the instruction steps for your project:

**What is your CI provider?**
<RadioGroup inUrl="ci" items={[
  { value: "appveyor", label: "AppVeyor" },
  { value: "bitbucket", label: "BitBucket Pipelines" },
  { value: "buildkite", label: "Buildkite" },
  { value: "circleci", label: "CircleCI" },
  { value: "cirrus-ci", label: "Cirrus CI" },
  { value: "codeship", label: "CloudBees CodeShip" },
  { value: "codefresh", label: "Codefresh" },
  { value: "github-actions", label: "GitHub Actions" },
  { value: "gitlab-ci", label: "GitLab CI" },
  { value: "heroku-ci", label: "Heroku CI" },
  { value: "jenkins", label: "Jenkins" },
  { value: "semaphoreci", label: "Semaphore CI" },
  { value: "travis-ci", label: "Travis CI" },
  { value: "other", label: "Other" },
]} />

## Instructions


<ShowIfSearchParamAndValue searchParam="ci" value="appveyor">

### AppVeyor

Generate [API tokens](https://knapsackpro.com/dashboard?utm_source=docs_knapsackpro&utm_medium=page&utm_campaign=knapsack-pro-cypress&utm_content=installation_guide_appveyor) for each Knapsack Pro command.

For each parallel job, define:
- [`KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS`](/cypress/reference/#knapsack_pro_test_suite_token_cypress)
- [`KNAPSACK_PRO_CI_NODE_TOTAL`](/cypress/reference/#knapsack_pro_ci_node_total)
- [`KNAPSACK_PRO_CI_NODE_INDEX`](/cypress/reference/#knapsack_pro_ci_node_index)

Remember to configure the number of parallel CI nodes in AppVeyor.

<Tabs>
<TabItem value="node-1" label="Node 1">

```bash
KNAPSACK_PRO_CI_NODE_TOTAL=N \
KNAPSACK_PRO_CI_NODE_INDEX=0 \
KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS=MY_CYPRESS_API_TOKEN \
$(npm bin)/knapsack-pro-cypress --config trashAssetsBeforeRuns=false
```

</TabItem>
<TabItem value="node-2" label="Node 2">

```bash
KNAPSACK_PRO_CI_NODE_TOTAL=N \
KNAPSACK_PRO_CI_NODE_INDEX=1 \
KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS=MY_CYPRESS_API_TOKEN \
$(npm bin)/knapsack-pro-cypress --config trashAssetsBeforeRuns=false
```

</TabItem>
<TabItem value="node-n" label="Node N">

```bash
KNAPSACK_PRO_CI_NODE_TOTAL=N \
KNAPSACK_PRO_CI_NODE_INDEX=N-1 \
KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS=MY_CYPRESS_API_TOKEN \
$(npm bin)/knapsack-pro-cypress --config trashAssetsBeforeRuns=false
```

</TabItem>
</Tabs>

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="ci" value="bitbucket">

Read [How BitBucket Pipeline with parallel Cypress tests can speed up CI build](https://docs.knapsackpro.com/2021/how-bitbucket-pipeline-with-parallel-cypress-tests-can-speed-up-ci-build).

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="ci" value="buildkite">

### Buildkite

Generate [API tokens](https://knapsackpro.com/dashboard?utm_source=docs_knapsackpro&utm_medium=page&utm_campaign=knapsack-pro-cypress&utm_content=installation_guide_buildkite) for each Knapsack Pro command.

Remember to configure the `parallelism` parameter in your build step.

<Tabs>
<TabItem value="node-1" label="Node 1">

```bash
$(npm bin)/knapsack-pro-cypress --config trashAssetsBeforeRuns=false
```

</TabItem>
<TabItem value="node-2" label="Node 2">

```bash
$(npm bin)/knapsack-pro-cypress --config trashAssetsBeforeRuns=false
```

</TabItem>
<TabItem value="node-n" label="Node N">

```bash
$(npm bin)/knapsack-pro-cypress --config trashAssetsBeforeRuns=false
```

</TabItem>
</Tabs>

When using the `docker-compose` plugin on Buildkite, you have to pass the following environment variables:

```yaml
steps:
  - label: "Test"
    parallelism: 2
    plugins:
      - docker-compose#3.0.3:
        run: app
        # highlight-next-line
        command: $(npm bin)/knapsack-pro-cypress --config trashAssetsBeforeRuns=false
        config: docker-compose.test.yml
        # highlight-start
        env:
          - BUILDKITE_PARALLEL_JOB_COUNT
          - BUILDKITE_PARALLEL_JOB
          - BUILDKITE_BUILD_NUMBER
          - BUILDKITE_COMMIT
          - BUILDKITE_BRANCH
        # highlight-end
```

Here you can find an article on [how to set up a new pipeline for your project in Buildkite and configure Knapsack Pro](http://docs.knapsackpro.com/2017/auto-balancing-7-hours-tests-between-100-parallel-jobs-on-ci-buildkite-example).

You can also check out the following example repositories for Ruby on Rails projects:
- [Buildkite Rails Parallel Example with Knapsack Pro](https://github.com/KnapsackPro/buildkite-rails-parallel-example-with-knapsack_pro)
- [Buildkite Rails Docker Parallel Example with Knapsack Pro](https://github.com/KnapsackPro/buildkite-rails-docker-parallel-example-with-knapsack_pro)

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="ci" value="circleci">

### CircleCI

Generate [API tokens](https://knapsackpro.com/dashboard?utm_source=docs_knapsackpro&utm_medium=page&utm_campaign=knapsack-pro-cypress&utm_content=installation_guide_circleci) for each Knapsack Pro command.

Remember to add additional parallel containers in the CircleCI settings.

```yaml title=".circleci/config.yml"
version: 2
jobs:
  build:
    # highlight-next-line
    parallelism: 2

    steps:
      - checkout

      # ...

      # highlight-start
      - run:
        name: cypress with @knapsack-pro/cypress
        command: $(npm bin)/knapsack-pro-cypress --config trashAssetsBeforeRuns=false
      # highlight-end

```

Here you can find an example of a [Rails project config on CircleCI 2.0](https://docs.knapsackpro.com//2017/circleci-2-0-capybara-feature-specs-selenium-webdriver-with-chrome-headless).

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="ci" value="cirrus-ci">

### Cirrus CI

Generate [API tokens](https://knapsackpro.com/dashboard?utm_source=docs_knapsackpro&utm_medium=page&utm_campaign=knapsack-pro-cypress&utm_content=installation_guide_cirrusci) for each Knapsack Pro command.

Configure the number of parallel CI nodes with the [matrix modification](https://cirrus-ci.org/guide/writing-tasks/#matrix-modification):

```yaml  title=".cirrus.yml"
task:
  environment:
    KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS: ENCRYPTED[KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS]
  matrix:
    name: CI Node 0
    name: CI Node 1
    name: CI Node 2
  test_script:
    - $(npm bin)/knapsack-pro-cypress --config trashAssetsBeforeRuns=false
```

Remember to set up the `KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS` as an [encrypted variable](https://cirrus-ci.org/guide/writing-tasks/#encrypted-variables).

Here is an example of a [`.cirrus.yml` configuration file](https://cirrus-ci.org/examples/#ruby) for a Ruby project.

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="ci" value="codeship">

### CloudBees CodeShip

Generate [API tokens](https://knapsackpro.com/dashboard?utm_source=docs_knapsackpro&utm_medium=page&utm_campaign=knapsack-pro-cypress&utm_content=installation_guide_codeship) for each Knapsack Pro command.

For each [parallel pipeline](https://documentation.codeship.com/basic/builds-and-configuration/parallel-tests/#using-parallel-test-pipelines), define:
- [`KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS`](/cypress/reference/#knapsack_pro_test_suite_token_cypress)
- [`KNAPSACK_PRO_CI_NODE_TOTAL`](/cypress/reference/#knapsack_pro_ci_node_total)
- [`KNAPSACK_PRO_CI_NODE_INDEX`](/cypress/reference/#knapsack_pro_ci_node_index)
- [`KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true`](/cypress/reference/#knapsack_pro_fixed_queue_split)

<Tabs>
<TabItem value="node-1" label="Node 1">

```bash
KNAPSACK_PRO_CI_NODE_TOTAL=N \
KNAPSACK_PRO_CI_NODE_INDEX=0 \
KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS=MY_CYPRESS_API_TOKEN \
KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true\
$(npm bin)/knapsack-pro-cypress --config trashAssetsBeforeRuns=false
```

</TabItem>
<TabItem value="node-2" label="Node 2">

```bash
KNAPSACK_PRO_CI_NODE_TOTAL=N \
KNAPSACK_PRO_CI_NODE_INDEX=1 \
KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS=MY_CYPRESS_API_TOKEN \
KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true\
$(npm bin)/knapsack-pro-cypress --config trashAssetsBeforeRuns=false
```

</TabItem>
<TabItem value="node-n" label="Node N">

```bash
KNAPSACK_PRO_CI_NODE_TOTAL=N \
KNAPSACK_PRO_CI_NODE_INDEX=N-1 \
KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS=MY_CYPRESS_API_TOKEN \
KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true\
$(npm bin)/knapsack-pro-cypress --config trashAssetsBeforeRuns=false
```

</TabItem>
</Tabs>

Consider moving the `KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS` to the *Environment* page of your project settings in CodeShip.

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="ci" value="codefresh">

### Codefresh

Generate [API tokens](https://knapsackpro.com/dashboard?utm_source=docs_knapsackpro&utm_medium=page&utm_campaign=knapsack-pro-cypress&utm_content=installation_guide_codefresh) for each Knapsack Pro command.

Define in `.codefresh/codefresh.yml`:
- [`KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS`](/cypress/reference/#knapsack_pro_test_suite_token_cypress)
- [`KNAPSACK_PRO_CI_NODE_TOTAL`](/cypress/reference/#knapsack_pro_ci_node_total)
- [`KNAPSACK_PRO_CI_NODE_INDEX`](/cypress/reference/#knapsack_pro_ci_node_index)
  - In the `matrix` section, list all the `KNAPSACK_PRO_CI_NODE_INDEX`es (from `0` to `KNAPSACK_PRO_CI_NODE_TOTAL-1`).

Remember to configure the YAML file path on Codefresh: *Pipelines > Settings (cog icon next to the pipeline) > Workflow Tab (horizontal menu on the top) > Path to YAML > `./.codefresh/codefresh.yml`*.

Here's an example config:

<Tabs>
<TabItem value="codefresh.yml">

```yaml title=".codefresh/codefresh.yml"
version: "1.0"

stages:
  - "clone"
  - "build"
  - "tests"

steps:
  main_clone:
    type: "git-clone"
    description: "Cloning main repository..."
    repo: "${{CF_REPO_OWNER}}/${{CF_REPO_NAME}}"
    revision: "${{CF_BRANCH}}"
    stage: "clone"
  BuildTestDockerImage:
    title: Building Test Docker image
    type: build
    arguments:
      image_name: '${{CF_ACCOUNT}}/${{CF_REPO_NAME}}-test'
      tag: '${{CF_BRANCH_TAG_NORMALIZED}}-${{CF_SHORT_REVISION}}'
      dockerfile: Test.Dockerfile
    stage: "build"

  run_tests:
    stage: "tests"
    image: '${{BuildTestDockerImage}}'
    working_directory: /src
    fail_fast: false
    environment:
      # highlight-next-line
      - KNAPSACK_PRO_CI_NODE_TOTAL=2
    # highlight-start
    matrix:
      environment:
        - KNAPSACK_PRO_CI_NODE_INDEX=0
        - KNAPSACK_PRO_CI_NODE_INDEX=1
    # highlight-end
    commands:
      # highlight-start
      - (npm run start:ci &) && echo "npm run start:ci running in the background"
      - $(npm bin)/knapsack-pro-cypress --config trashAssetsBeforeRuns=false
      # highlight-end
```

Consider setting up the `KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS` on the Codefresh dashboard: *Pipelines > Settings (cog icon next to the pipeline) > Variables Tab (vertical menu on the right-hand side)*.

</TabItem>

<TabItem value="dockerfile" label="Dockerfile">

```bash title="Test.Dockerfile"
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
```

</TabItem>
</Tabs>

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="ci" value="github-actions">

### GitHub Actions

Generate [API tokens](https://knapsackpro.com/dashboard?utm_source=docs_knapsackpro&utm_medium=page&utm_campaign=knapsack-pro-cypress&utm_content=installation_guide_githubactions) for each Knapsack Pro command.

Define in `.github/workflows/main.yaml`:
- [`KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS`](/cypress/reference/#knapsack_pro_test_suite_token_cypress) in *GitHub Settings > Secrets* as described in [GitHub Actions' docs](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository).
- [`KNAPSACK_PRO_CI_NODE_TOTAL`](/cypress/reference/#knapsack_pro_ci_node_total) using the [`matrix` property](https://help.github.com/en/articles/workflow-syntax-for-github-actions#jobsjob_idstrategymatrix)
- [`KNAPSACK_PRO_CI_NODE_INDEX`](/cypress/reference/#knapsack_pro_ci_node_index) using the [`matrix` property](https://help.github.com/en/articles/workflow-syntax-for-github-actions#jobsjob_idstrategymatrix):
- [`KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true`](/cypress/reference/#knapsack_pro_fixed_queue_split)

Here's an example config:

```yaml title=".github/workflows/main.yaml"
name: Main

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      fail-fast: false
      # highlight-start
      matrix:
        node-version: [18.x]
        ci_node_total: [2]
        ci_node_index: [0, 1]
      # highlight-end

    steps:
      - uses: actions/checkout@v2

      - name: Set up Node
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install and Build
        run: |
          npm install
          npm run build --if-present

      - name: Run `npm run start:ci` in the background
        run: |
          npm run start:ci &

      # highlight-start
      - name: Run tests
        env:
          KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS: ${{ secrets.KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS }}
          KNAPSACK_PRO_CI_NODE_TOTAL: ${{ matrix.ci_node_total }}
          KNAPSACK_PRO_CI_NODE_INDEX: ${{ matrix.ci_node_index }}
          KNAPSACK_PRO_FIXED_QUEUE_SPLIT: true
        run: |
          $(npm bin)/knapsack-pro-cypress --config trashAssetsBeforeRuns=false
      # highlight-end
```

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="ci" value="gitlab-ci">

### GitLab CI

Generate [API tokens](https://knapsackpro.com/dashboard?utm_source=docs_knapsackpro&utm_medium=page&utm_campaign=knapsack-pro-cypress&utm_content=installation_guide_gitlabci) for each Knapsack Pro command.

#### GitLab CI >= 11.5

```yaml
test:
  parallel: 2

  script:
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS=MY_CYPRESS_API_TOKEN $(npm bin)/knapsack-pro-cypress --config trashAssetsBeforeRuns=false
```

See also [how to configure running parallel CI nodes in GitLab](https://docs.gitlab.com/ee/ci/yaml/#parallel).

#### GitLab CI < 11.5

Define in `.gitlab-ci.yml`:
- [`KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS`](/cypress/reference/#knapsack_pro_test_suite_token_cypress)
- [`KNAPSACK_PRO_CI_NODE_TOTAL`](/cypress/reference/#knapsack_pro_ci_node_total)
- [`KNAPSACK_PRO_CI_NODE_INDEX`](/cypress/reference/#knapsack_pro_ci_node_index)

Here's an example configuration for 2 parallel jobs:

```yaml title=".gitlab-ci.yml"
stages:
  - test

# highlight-start
variables:
  KNAPSACK_PRO_CI_NODE_TOTAL: 2
# highlight-end

test_ci_first_node:
  stage: test
  script:
    # highlight-start
    - export KNAPSACK_PRO_CI_NODE_INDEX=0
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS=MY_CYPRESS_API_TOKEN $(npm bin)/knapsack-pro-cypress --config trashAssetsBeforeRuns=false
    # highlight-end

test_ci_second_node:
  stage: test
  script:
    # highlight-start
    - export KNAPSACK_PRO_CI_NODE_INDEX=1
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS=MY_CYPRESS_API_TOKEN $(npm bin)/knapsack-pro-cypress --config trashAssetsBeforeRuns=false
    # highlight-end
```

Remember to set up the `KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS` as [Secret Variables](https://gitlab.com/help/ci/variables/README.md#secret-variables) in GitLab CI: *Settings > CI/CD Pipelines > Secret Variables*.

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="ci" value="heroku-ci">

### Heroku CI

Generate [API tokens](https://knapsackpro.com/dashboard?utm_source=docs_knapsackpro&utm_medium=page&utm_campaign=knapsack-pro-cypress&utm_content=installation_guide_herokuci) for each Knapsack Pro command.

Define in `app.json`:
- [`KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS`](/cypress/reference/#knapsack_pro_test_suite_token_cypress)
- `quantity`: number of parallel dynos
- `test`: the Knapsack Pro command

```json title="app.json"
{
  "environments": {
    "test": {
      "formation": {
        "test": {
          // highlight-next-line
          "quantity": 2
        }
      },
      "addons": [
        "heroku-postgresql"
      ],
      // highlight-start
      "scripts": {
        "test": "$(npm bin)/knapsack-pro-cypress --config trashAssetsBeforeRuns=false"
      },
      "env": {
        "KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS": "MY_CYPRESS_API_TOKEN"
      }
      // highlight-end
    }
  }
}
```

Remember to set up the `KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS` outside of `app.json` in your Heroku CI pipeline's settings.

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="ci" value="jenkins">

### Jenkins

Generate [API tokens](https://knapsackpro.com/dashboard?utm_source=docs_knapsackpro&utm_medium=page&utm_campaign=knapsack-pro-cypress&utm_content=installation_guide_jenkins) for each Knapsack Pro command.

In order to run parallel jobs with Jenkins you should use Jenkins Pipeline as described in [Parallelism and Distributed Builds with Jenkins](https://www.cloudbees.com/blog/parallelism-and-distributed-builds-jenkins).

Here is an example of a `Jenkinsfile` working with Jenkins Pipeline:

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

  // highlight-next-line
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

        // highlight-start
        def knapsack_options = """\
            KNAPSACK_PRO_CI_NODE_TOTAL=${num_nodes}\
            KNAPSACK_PRO_CI_NODE_INDEX=${index}\
            KNAPSACK_PRO_COMMIT_HASH=${COMMIT_HASH}\
            KNAPSACK_PRO_BRANCH=${env.BRANCH_NAME}\
            KNAPSACK_PRO_CI_NODE_BUILD_ID=${env.BUILD_TAG}\
            KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS=MY_CYPRESS_API_TOKEN
        """

        stage('Run tests') {
          sh """${knapsack_options} $(npm bin)/knapsack-pro-cypress --config trashAssetsBeforeRuns=false"""
        }
        // highlight-end
      }
    }
  }

  parallel nodes // run CI nodes in parallel
}
```

Consider setting up the `KNAPSACK_PRO_TEST_SUITE_TOKEN_*` as global environment variables in Jenkins.

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="ci" value="semaphoreci">

### Semaphore CI

Generate [API tokens](https://knapsackpro.com/dashboard?utm_source=docs_knapsackpro&utm_medium=page&utm_campaign=knapsack-pro-cypress&utm_content=installation_guide_semaphoreci) for each Knapsack Pro command.

Define in `.semaphore/semaphore.yml`:
- [`KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS`](/cypress/reference/#knapsack_pro_test_suite_token_cypress)
- `parallelism`

Here's an example config:

```yaml title=".semaphore/semaphore.yml"
version: v1.0

name: My app

agent:
  machine:
    type: e1-standard-2
    os_image: ubuntu1804

blocks:
  - name: Cypress tests
    task:
      env_vars:
        # highlight-start
        - name: KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS
          value: MY_CYPRESS_API_TOKEN
        # highlight-end
      prologue:
        commands:
          - checkout
          - nvm install --lts hydrogen
          - sem-version node --lts hydrogen

      # highlight-start
      jobs:
        - name: Run tests with Knapsack Pro
          parallelism: 2
          commands:
            - $(npm bin)/knapsack-pro-cypress --config trashAssetsBeforeRuns=false
      # highlight-end
```

Remember to set up `KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS` as a [secret](https://docs.semaphoreci.com/article/66-environment-variables-and-secrets).

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="ci" value="travis-ci">

### Travis CI

Generate [API tokens](https://knapsackpro.com/dashboard?utm_source=docs_knapsackpro&utm_medium=page&utm_campaign=knapsack-pro-cypress&utm_content=installation_guide_travisci) for each Knapsack Pro command.

Define in `.travis.yml`:
- [`KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS`](/cypress/reference/#knapsack_pro_test_suite_token_cypress)
- [`KNAPSACK_PRO_CI_NODE_TOTAL`](/cypress/reference/#knapsack_pro_ci_node_total)
- [`KNAPSACK_PRO_CI_NODE_INDEX`](/cypress/reference/#knapsack_pro_ci_node_index) as [jobs](http://docs.travis-ci.com/user/speeding-up-the-build/#parallelizing-your-builds-across-virtual-machines)
- [`KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true`](/cypress/reference/#knapsack_pro_fixed_queue_split)

```yaml
script:
  - '$(npm bin)/knapsack-pro-cypress --config trashAssetsBeforeRuns=false'

env:
  global:
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS=MY_CYPRESS_API_TOKEN
    - KNAPSACK_PRO_CI_NODE_TOTAL=3
    - KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true
  jobs:
    - KNAPSACK_PRO_CI_NODE_INDEX=0
    - KNAPSACK_PRO_CI_NODE_INDEX=1
    - KNAPSACK_PRO_CI_NODE_INDEX=2
```

Remember to set up `KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS` as tokens in the Travis settings to avoid exposing them in the build logs.

You can find more info about the global and matrix env configuration in the [Travis' docs](https://docs.travis-ci.com/user/customizing-the-build/#build-matrix).

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="ci" value="other">

### Other CI provider

Generate [API tokens](https://knapsackpro.com/dashboard?utm_source=docs_knapsackpro&utm_medium=page&utm_campaign=knapsack-pro-cypress&utm_content=installation_guide_otherci) for each Knapsack Pro command.

Define the following global environment variables on your CI server:
- [`KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS`](/cypress/reference/#knapsack_pro_test_suite_token_cypress)
- [`KNAPSACK_PRO_CI_NODE_TOTAL`](/cypress/reference/#knapsack_pro_ci_node_total)
- [`KNAPSACK_PRO_CI_NODE_INDEX`](/cypress/reference/#knapsack_pro_ci_node_index)
- [`KNAPSACK_PRO_CI_NODE_BUILD_ID`](/cypress/reference/#knapsack_pro_ci_node_build_id)

<Tabs>
<TabItem value="node-1" label="Node 1">

```bash
KNAPSACK_PRO_CI_NODE_TOTAL=N \
KNAPSACK_PRO_CI_NODE_INDEX=0 \
KNAPSACK_PRO_CI_NODE_BUILD_ID=MY_BUILD_ID \
KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS=MY_CYPRESS_API_TOKEN \
$(npm bin)/knapsack-pro-cypress --config trashAssetsBeforeRuns=false
```

</TabItem>
<TabItem value="node-2" label="Node 2">

```bash
KNAPSACK_PRO_CI_NODE_TOTAL=N \
KNAPSACK_PRO_CI_NODE_INDEX=1 \
KNAPSACK_PRO_CI_NODE_BUILD_ID=MY_BUILD_ID \
KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS=MY_CYPRESS_API_TOKEN \
$(npm bin)/knapsack-pro-cypress --config trashAssetsBeforeRuns=false
```

</TabItem>
<TabItem value="node-n" label="Node N">

```bash
KNAPSACK_PRO_CI_NODE_TOTAL=N \
KNAPSACK_PRO_CI_NODE_INDEX=N-1 \
KNAPSACK_PRO_CI_NODE_BUILD_ID=MY_BUILD_ID \
KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS=MY_CYPRESS_API_TOKEN \
$(npm bin)/knapsack-pro-cypress --config trashAssetsBeforeRuns=false
```

</TabItem>
</Tabs>

</ShowIfSearchParamAndValue>


<ShowIfSearchParam searchParam="ci">

### Verify that everything works

Push a new commit to your repository and visit your [dashboard](https://knapsackpro.com/dashboard) to make sure all your CI nodes were recorded successfully in *Show build metrics > Show (build)*.

**Congratulations!** Now that Knapsack Pro knows the statistics of your test suite, your CI builds will be parallelized optimally.

### Next up

Make sure you check out the *Reference* and *Cookbook* pages from the navigation to fine-tune your Knapsack Pro setup.

</ShowIfSearchParam>

## Need help?

[Get in touch!](https://knapsackpro.com/contact)

We have helped TONS of teams and seen TONS of projects. We know each test suite is a different beast and we'd be happy to help you set up Knapsack Pro.