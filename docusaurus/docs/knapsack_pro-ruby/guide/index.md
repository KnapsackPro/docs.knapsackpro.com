---
toc_max_heading_level: 2
pagination_next: null
pagination_prev: null
---

import { CheckboxGroup } from '@site/src/components/CheckboxGroup'
import { RadioGroup } from '@site/src/components/RadioGroup'
import { ShowIfSearchParam, ShowIfSearchParamAndValue } from '@site/src/components/ShowIf'
import { DelayHashNavigation } from '@site/src/components/DelayHashNavigation'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Knapsack Pro Ruby: Quickstart

<DelayHashNavigation milliseconds={400} />

[Create an account](http://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=page&utm_campaign=knapsack_pro-ruby_gem&utm_content=installation_guide) to generate API tokens and use Knapsack Pro.

## Installation

Add `knapsack_pro` to your `Gemfile`:

```ruby
group :test, :development do
  gem 'knapsack_pro'
end
```

Execute:

```bash
bundle install
```

Now, fill in the following form to generate the instruction steps for your project.

## Questions

Please answer the following questions to generate the configuration for your project:

**Do you use Ruby on Rails?**
<RadioGroup inUrl="rails" items={[
  { value: "yes", label: "Yes", defaultChecked: true },
  { value: "no", label: "No" },
]} />

**Choose your testing tools:**
<CheckboxGroup inUrl="test-runner" items={[
  { value: "rspec", label: "RSpec" },
  { value: "cucumber", label: "Cucumber" },
  { value: "minitest", label: "Minitest" },
  { value: "spinach", label: "Spinach" },
  { value: "test-unit", label: "test-unit" }
]} />

**Do you use the VCR, WebMock, or FakeWeb gem?**
<RadioGroup inUrl="vcr" items={[
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
]} />

**What is your CI provider?**
<RadioGroup inUrl="ci" items={[
  { value: "appveyor", label: "AppVeyor" },
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


<ShowIfSearchParamAndValue searchParam="rails" value="yes">

### Ruby on Rails

Please follow the steps down below. Should you get stuck, here you can find a [Rails application](https://github.com/KnapsackPro/rails-app-with-knapsack_pro) with `knapsack_pro` already configured.

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="rails" value="no">

### Ruby Project

Since you are not using Rails, add the following the bottom of your `Rakefile`:

```ruby
KnapsackPro.load_tasks if defined?(KnapsackPro)
```

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="test-runner" value="rspec">

### RSpec

Add the following code at the beginning of your `spec/rails_helper.rb` or `spec/spec_helper.rb`:

```ruby
require 'knapsack_pro'

# Custom Knapsack Pro config here

KnapsackPro::Adapters::RSpecAdapter.bind
```

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="test-runner" value="minitest">

### Minitest

Add the following code after you load the app environment in `test/test_helper.rb`:

```ruby
ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'

require 'knapsack_pro'

# Custom Knapsack Pro config here

knapsack_pro_adapter = KnapsackPro::Adapters::MinitestAdapter.bind
knapsack_pro_adapter.set_test_helper_path(__FILE__)
```

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="test-runner" value="test-unit">

### test-unit

Add the following code at the beginning of your `test/test_helper.rb`:

```ruby
require 'knapsack_pro'

# Custom Knapsack Pro config here

knapsack_pro_adapter = KnapsackPro::Adapters::TestUnitAdapter.bind
knapsack_pro_adapter.set_test_helper_path(__FILE__)
```

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="test-runner" value="cucumber">

### Cucumber

Create `features/support/knapsack_pro.rb` with the following code:

```ruby
require 'knapsack_pro'

# Custom Knapsack Pro config here

KnapsackPro::Adapters::CucumberAdapter.bind
```

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="test-runner" value="spinach">

### Spinach

Create `features/support/knapsack_pro.rb` with the following code:

```ruby
require 'knapsack_pro'

# Custom Knapsack Pro config here

KnapsackPro::Adapters::SpinachAdapter.bind
```

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="vcr" value="yes">

### VCR/WebMock/FakeWeb

Add the Knapsack Pro API's subdomain to [ignored hosts](https://relishapp.com/vcr/vcr/v/6-1-0/docs/configuration/ignore-request) in `spec/spec_helper.rb` (or wherever your VCR configuration is located):

```ruby
require 'vcr'

VCR.configure do |config|
  config.hook_into :webmock # or :fakeweb
  config.ignore_hosts('localhost', '127.0.0.1', '0.0.0.0', 'api.knapsackpro.com')
end

# Add the following code if you use Webmock
require 'webmock/rspec'
WebMock.disable_net_connect!(allow_localhost: true, allow: ['api.knapsackpro.com'])

# Add the following code if you use FakeWeb
require 'fakeweb'
FakeWeb.allow_net_connect = %r[^https?://api\.knapsackpro\.com]
```

You may need to add `require: false` in your Gemfile:

```ruby
group :test do
  gem 'vcr'
  gem 'webmock', require: false # when using Webmock
  gem 'fakeweb', require: false # when using Fakeweb
end
```

If some tests are failing due to requests to the Knapsack Pro API, you may have some code that reconfigures WebMock/FakeWeb. The usual suspects are calls to `WebMock.reset!` or an [issue](https://github.com/bblimke/webmock/issues/484#issuecomment-116193449) with `webmock/rspec`. In the latter case, you can solve the problem with:

```ruby
RSpec.configure do |config|
  config.after(:suite) do
    WebMock.disable_net_connect!(
      allow_localhost: true,
      allow: [
        'api.knapsackpro.com',
      ],
    )
  end
end
```

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="ci" value="appveyor">

### AppVeyor

Generate [API tokens](https://knapsackpro.com/dashboard?utm_source=docs_knapsackpro&utm_medium=page&utm_campaign=knapsack_pro-ruby_gem&utm_content=installation_guide_appveyor) for each Knapsack Pro command.

For each parallel job, define:
- [`KNAPSACK_PRO_TEST_SUITE_TOKEN_*`](/ruby/reference/#knapsack_pro_test_suite_token_)
- [`KNAPSACK_PRO_CI_NODE_TOTAL`](/ruby/reference/#knapsack_pro_ci_node_total)
- [`KNAPSACK_PRO_CI_NODE_INDEX`](/ruby/reference/#knapsack_pro_ci_node_index)

Remember to configure the number of parallel CI nodes in AppVeyor.

<Tabs>
<TabItem value="node-1" label="Node 1">

```bash
KNAPSACK_PRO_CI_NODE_TOTAL=N \
KNAPSACK_PRO_CI_NODE_INDEX=0 \
KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=MY_RSPEC_API_TOKEN \
bundle exec rake knapsack_pro:rspec

KNAPSACK_PRO_CI_NODE_TOTAL=N \
KNAPSACK_PRO_CI_NODE_INDEX=0 \
KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=MY_CUCUMBER_API_TOKEN \
bundle exec rake knapsack_pro:cucumber

# ...Same for minitest, spinach, test_unit
```

</TabItem>
<TabItem value="node-2" label="Node 2">

```bash
KNAPSACK_PRO_CI_NODE_TOTAL=N \
KNAPSACK_PRO_CI_NODE_INDEX=1 \
KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=MY_RSPEC_API_TOKEN \
bundle exec rake knapsack_pro:rspec

KNAPSACK_PRO_CI_NODE_TOTAL=N \
KNAPSACK_PRO_CI_NODE_INDEX=1 \
KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=MY_CUCUMBER_API_TOKEN \
bundle exec rake knapsack_pro:cucumber

# ...Same for minitest, spinach, test_unit
```

</TabItem>
<TabItem value="node-n" label="Node N">

```bash
KNAPSACK_PRO_CI_NODE_TOTAL=N \
KNAPSACK_PRO_CI_NODE_INDEX=N-1 \
KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=MY_RSPEC_API_TOKEN \
bundle exec rake knapsack_pro:rspec

KNAPSACK_PRO_CI_NODE_TOTAL=N \
KNAPSACK_PRO_CI_NODE_INDEX=N-1 \
KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=MY_CUCUMBER_API_TOKEN \
bundle exec rake knapsack_pro:cucumber

# ...Same for minitest, spinach, test_unit
```

</TabItem>
</Tabs>

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="ci" value="buildkite">

### Buildkite

Generate [API tokens](https://knapsackpro.com/dashboard?utm_source=docs_knapsackpro&utm_medium=page&utm_campaign=knapsack_pro-ruby_gem&utm_content=installation_guide_buildkite) for each Knapsack Pro command.

Remember to configure the `parallelism` parameter in your build step.

<Tabs>
<TabItem value="node-1" label="Node 1">

```bash
KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=MY_RSPEC_API_TOKEN \
bundle exec rake knapsack_pro:rspec

KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=MY_CUCUMBER_API_TOKEN \
bundle exec rake knapsack_pro:cucumber

# ...Same for minitest, spinach, test_unit
```

</TabItem>
<TabItem value="node-2" label="Node 2">

```bash
KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=MY_RSPEC_API_TOKEN \
bundle exec rake knapsack_pro:rspec

KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=MY_CUCUMBER_API_TOKEN \
bundle exec rake knapsack_pro:cucumber

# ...Same for minitest, spinach, test_unit
```

</TabItem>
<TabItem value="node-n" label="Node N">

```bash
KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=MY_RSPEC_API_TOKEN \
bundle exec rake knapsack_pro:rspec

KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=MY_CUCUMBER_API_TOKEN \
bundle exec rake knapsack_pro:cucumber

# ...Same for minitest, spinach, test_unit
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
        command: bundle exec rake knapsack_pro:rspec
        config: docker-compose.test.yml
        # highlight-start
        env:
          - BUILDKITE_PARALLEL_JOB_COUNT
          - BUILDKITE_PARALLEL_JOB
          - BUILDKITE_BUILD_NUMBER
          - BUILDKITE_COMMIT
          - BUILDKITE_BRANCH
          - BUILDKITE_BUILD_CHECKOUT_PATH
        # highlight-end
```

Here you can find an article on [how to set up a new pipeline for your project in Buildkite and configure Knapsack Pro](http://docs.knapsackpro.com/2017/auto-balancing-7-hours-tests-between-100-parallel-jobs-on-ci-buildkite-example).

You can also check out the following example repositories for Ruby on Rails projects:
- [Buildkite Rails Parallel Example with Knapsack Pro](https://github.com/KnapsackPro/buildkite-rails-parallel-example-with-knapsack_pro)
- [Buildkite Rails Docker Parallel Example with Knapsack Pro](https://github.com/KnapsackPro/buildkite-rails-docker-parallel-example-with-knapsack_pro)

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="ci" value="circleci">

### CircleCI

Generate [API tokens](https://knapsackpro.com/dashboard?utm_source=docs_knapsackpro&utm_medium=page&utm_campaign=knapsack_pro-ruby_gem&utm_content=installation_guide_circleci) for each Knapsack Pro command.

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
        name: RSpec with knapsack_pro
        command: |
          KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=MY_RSPEC_API_TOKEN \
            bundle exec rake knapsack_pro:rspec
      # highlight-end

      # highlight-start
      - run:
        name: Cucumber with knapsack_pro
        command: |
          KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=MY_CUCUMBER_API_TOKEN \
            bundle exec rake knapsack_pro:cucumber

        # ...Same for minitest, spinach, test_unit
      # highlight-end

```

Here you can find an example of a [Rails project config on CircleCI 2.0](https://docs.knapsackpro.com//2017/circleci-2-0-capybara-feature-specs-selenium-webdriver-with-chrome-headless).

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="ci" value="cirrus-ci">

### Cirrus CI

Generate [API tokens](https://knapsackpro.com/dashboard?utm_source=docs_knapsackpro&utm_medium=page&utm_campaign=knapsack_pro-ruby_gem&utm_content=installation_guide_cirrusci) for each Knapsack Pro command.

Configure the number of parallel CI nodes with the [matrix modification](https://cirrus-ci.org/guide/writing-tasks/#matrix-modification):

```yaml  title=".cirrus.yml"
task:
  environment:
    KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC: ENCRYPTED[MY_RSPEC_API_TOKEN]
    KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER: ENCRYPTED[MY_CUCUMBER_API_TOKEN]
  matrix:
    name: CI Node 0
    name: CI Node 1
    name: CI Node 2
  test_script:
    - bundle exec rake knapsack_pro:rspec
    - bundle exec rake knapsack_pro:cucumber

# ...Same for minitest, spinach, test_unit
```

Remember to set up the `KNAPSACK_PRO_TEST_SUITE_TOKEN_*` as [encrypted variables](https://cirrus-ci.org/guide/writing-tasks/#encrypted-variables).

Here is an example of a [`.cirrus.yml` configuration file](https://cirrus-ci.org/examples/#ruby) for a Ruby project.

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="ci" value="codeship">

### CloudBees CodeShip

Generate [API tokens](https://knapsackpro.com/dashboard?utm_source=docs_knapsackpro&utm_medium=page&utm_campaign=knapsack_pro-ruby_gem&utm_content=installation_guide_codeship) for each Knapsack Pro command.

For each [parallel pipeline](https://documentation.codeship.com/basic/builds-and-configuration/parallel-tests/#using-parallel-test-pipelines), define:
- [`KNAPSACK_PRO_TEST_SUITE_TOKEN_*`](/ruby/reference/#knapsack_pro_test_suite_token_)
- [`KNAPSACK_PRO_CI_NODE_TOTAL`](/ruby/reference/#knapsack_pro_ci_node_total)
- [`KNAPSACK_PRO_CI_NODE_INDEX`](/ruby/reference/#knapsack_pro_ci_node_index)

<Tabs>
<TabItem value="node-1" label="Node 1">

```bash
KNAPSACK_PRO_CI_NODE_TOTAL=N \
KNAPSACK_PRO_CI_NODE_INDEX=0 \
KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=MY_RSPEC_API_TOKEN \
bundle exec rake knapsack_pro:rspec

KNAPSACK_PRO_CI_NODE_TOTAL=N \
KNAPSACK_PRO_CI_NODE_INDEX=0 \
KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=MY_CUCUMBER_API_TOKEN \
bundle exec rake knapsack_pro:cucumber

# ...Same for minitest, spinach, test_unit
```

</TabItem>
<TabItem value="node-2" label="Node 2">

```bash
KNAPSACK_PRO_CI_NODE_TOTAL=N \
KNAPSACK_PRO_CI_NODE_INDEX=1 \
KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=MY_RSPEC_API_TOKEN \
bundle exec rake knapsack_pro:rspec

KNAPSACK_PRO_CI_NODE_TOTAL=N \
KNAPSACK_PRO_CI_NODE_INDEX=1 \
KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=MY_CUCUMBER_API_TOKEN \
bundle exec rake knapsack_pro:cucumber

# ...Same for minitest, spinach, test_unit
```

</TabItem>
<TabItem value="node-n" label="Node N">

```bash
KNAPSACK_PRO_CI_NODE_TOTAL=N \
KNAPSACK_PRO_CI_NODE_INDEX=N-1 \
KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=MY_RSPEC_API_TOKEN \
bundle exec rake knapsack_pro:rspec

KNAPSACK_PRO_CI_NODE_TOTAL=N \
KNAPSACK_PRO_CI_NODE_INDEX=N-1 \
KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=MY_CUCUMBER_API_TOKEN \
bundle exec rake knapsack_pro:cucumber

# ...Same for minitest, spinach, test_unit
```

</TabItem>
</Tabs>

Consider moving the `KNAPSACK_PRO_TEST_SUITE_TOKEN_*` to the *Environment* page of your project settings in CodeShip.

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="ci" value="codefresh">

### Codefresh

Generate [API tokens](https://knapsackpro.com/dashboard?utm_source=docs_knapsackpro&utm_medium=page&utm_campaign=knapsack_pro-ruby_gem&utm_content=installation_guide_codefresh) for each Knapsack Pro command.

Define in `.codefresh/codefresh.yml`:
- [`KNAPSACK_PRO_TEST_SUITE_TOKEN_*`](/ruby/reference/#knapsack_pro_test_suite_token_)
- [`KNAPSACK_PRO_CI_NODE_TOTAL`](/ruby/reference/#knapsack_pro_ci_node_total)
- [`KNAPSACK_PRO_CI_NODE_INDEX`](/ruby/reference/#knapsack_pro_ci_node_index)
  - In the `matrix` section, list all the `KNAPSACK_PRO_CI_NODE_INDEX`es (from `0` to `KNAPSACK_PRO_CI_NODE_TOTAL-1`).

Remember to configure the YAML file path on Codefresh: *Pipelines > Settings (cog icon next to the pipeline) > Workflow Tab (horizontal menu on the top) > Path to YAML > `./.codefresh/codefresh.yml`*.

Here's an example config for Ruby on Rails and PostgreSQL in a Docker container:

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
      - RAILS_ENV=test
      # highlight-next-line
      - KNAPSACK_PRO_CI_NODE_TOTAL=2
      - PGHOST=postgres
      - PGUSER=rails-app-with-knapsack_pro
      - PGPASSWORD=password
    services:
      composition:
        postgres:
          image: postgres:latest
          environment:
            - POSTGRES_DB=rails-app-with-knapsack_pro_test
            - POSTGRES_PASSWORD=password
            - POSTGRES_USER=rails-app-with-knapsack_pro
          ports:
            - 5432
    # highlight-start
    matrix:
      environment:
        - KNAPSACK_PRO_CI_NODE_INDEX=0
        - KNAPSACK_PRO_CI_NODE_INDEX=1
    # highlight-end
    commands:
      - bin/rails db:prepare
      # highlight-start
      - KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=MY_RSPEC_API_TOKEN bundle exec rake knapsack_pro:rspec
      - KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=MY_CUCUMBER_API_TOKEN bundle exec rake knapsack_pro:cucumber
      - KNAPSACK_PRO_TEST_SUITE_TOKEN_MINITEST=MY_MINITEST_API_TOKEN bundle exec rake knapsack_pro:minitest
      - KNAPSACK_PRO_TEST_SUITE_TOKEN_TEST_UNIT=MY_TEST_UNIT_API_TOKEN bundle exec rake knapsack_pro:test_unit
      - KNAPSACK_PRO_TEST_SUITE_TOKEN_SPINACH=MY_SPINACH_API_TOKEN bundle exec rake knapsack_pro:spinach
      # highlight-end
```

Consider setting up the `KNAPSACK_PRO_TEST_SUITE_TOKEN_*` on the Codefresh dashboard: *Pipelines > Settings (cog icon next to the pipeline) > Variables Tab (vertical menu on the right-hand side)*.

</TabItem>

<TabItem value="dockerfile" label="Dockerfile">

```bash title="Test.Dockerfile"
FROM ruby:2.6.5-alpine3.10

# Prepare Docker image for Nokogiri
RUN apk add --update \
  build-base \
  libxml2-dev \
  libxslt-dev \
  jq \
  nodejs \
  npm \
  postgresql-dev \
  python3-dev \
  sqlite-dev \
  git \
  && rm -rf /var/cache/apk/*

# Install AWS CLI
RUN pip3 install awscli

# Use libxml2, libxslt packages from alpine for building nokogiri
RUN bundle config build.nokogiri --use-system-libraries

# Install Codefresh CLI
RUN wget https://github.com/codefresh-io/cli/releases/download/v0.31.1/codefresh-v0.31.1-alpine-x64.tar.gz
RUN tar -xf codefresh-v0.31.1-alpine-x64.tar.gz -C /usr/local/bin/

COPY . /src

WORKDIR /src

RUN bundle install
```

</TabItem>
</Tabs>

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="ci" value="github-actions">

### GitHub Actions

Generate [API tokens](https://knapsackpro.com/dashboard?utm_source=docs_knapsackpro&utm_medium=page&utm_campaign=knapsack_pro-ruby_gem&utm_content=installation_guide_githubactions) for each Knapsack Pro command.

Define in `.github/workflows/main.yaml`:
- [`KNAPSACK_PRO_TEST_SUITE_TOKEN_*`](/ruby/reference/#knapsack_pro_test_suite_token_) in *GitHub Settings > Secrets* as described in [GitHub Actions' docs](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository).
- [`KNAPSACK_PRO_CI_NODE_TOTAL`](/ruby/reference/#knapsack_pro_ci_node_total) using the [`matrix` property](https://help.github.com/en/articles/workflow-syntax-for-github-actions#jobsjob_idstrategymatrix)
- [`KNAPSACK_PRO_CI_NODE_INDEX`](/ruby/reference/#knapsack_pro_ci_node_index) using the [`matrix` property](https://help.github.com/en/articles/workflow-syntax-for-github-actions#jobsjob_idstrategymatrix):

Here's an example config for a Ruby on Rails project:

```yaml title=".github/workflows/main.yaml"
name: Main

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest

    # If you need a DB, then define it in the service below.
    # https://github.com/actions/example-services/tree/master/.github/workflows
    services:
      postgres:
        image: postgres:10.8
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: ""
          POSTGRES_DB: postgres
        ports:
          - 5432:5432
        # needed because the postgres container does not provide a healthcheck
        # tmpfs makes DB faster by using RAM
        options: >-
          --mount type=tmpfs,destination=/var/lib/postgresql/data
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis
        ports:
          - 6379:6379
        options: --entrypoint redis-server

    strategy:
      fail-fast: false
      # highlight-start
      matrix:
        ci_node_total: [2]
        ci_node_index: [0, 1]
      # highlight-end

    env:
      RAILS_ENV: test
      GEMFILE_RUBY_VERSION: 2.7.2
      PGHOST: localhost
      PGUSER: postgres
      # Rails verifies the time zone in DB is the same as the time zone of the Rails app
      TZ: "Europe/Warsaw"

    steps:
      - uses: actions/checkout@v2

      - name: Set up Ruby
        uses: ruby/setup-ruby@v1
        with:
          # Not needed with a .ruby-version file
          ruby-version: 2.7
          # runs 'bundle install' and caches installed gems automatically
          bundler-cache: true

      - name: Create DB
        run: |
          bin/rails db:prepare

      # highlight-start
      - name: Run tests
        env:
          KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC: ${{ secrets.KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC }}
          KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER: ${{ secrets.KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER }}
          KNAPSACK_PRO_TEST_SUITE_TOKEN_MINITEST: ${{ secrets.KNAPSACK_PRO_TEST_SUITE_TOKEN_MINITEST }}
          KNAPSACK_PRO_TEST_SUITE_TEST_UNIT: ${{ secrets.KNAPSACK_PRO_TEST_SUITE_TOKEN_TEST_UNIT }}
          KNAPSACK_PRO_TEST_SUITE_TOKEN_SPINACH: ${{ secrets.KNAPSACK_PRO_TEST_SUITE_TOKEN_SPINACH }}
          KNAPSACK_PRO_CI_NODE_TOTAL: ${{ matrix.ci_node_total }}
          KNAPSACK_PRO_CI_NODE_INDEX: ${{ matrix.ci_node_index }}
          KNAPSACK_PRO_LOG_LEVEL: info
        run: |
          bundle exec rake knapsack_pro:rspec
          bundle exec rake knapsack_pro:cucumber
          bundle exec rake knapsack_pro:minitest
          bundle exec rake knapsack_pro:test_unit
          bundle exec rake knapsack_pro:spinach
      # highlight-end
```

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="ci" value="gitlab-ci">

### GitLab CI

Generate [API tokens](https://knapsackpro.com/dashboard?utm_source=docs_knapsackpro&utm_medium=page&utm_campaign=knapsack_pro-ruby_gem&utm_content=installation_guide_gitlabci) for each Knapsack Pro command.

#### GitLab CI >= 11.5

```yaml
test:
  parallel: 2

  script:
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=MY_RSPEC_API_TOKEN bundle exec rake knapsack_pro:rspec
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=MY_CUCUMBER_API_TOKEN bundle exec rake knapsack_pro:cucumber
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_MINITEST=MY_MINITEST_API_TOKEN bundle exec rake knapsack_pro:minitest
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_TEST_UNIT=MY_TEST_UNIT_API_TOKEN bundle exec rake knapsack_pro:test_unit
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_SPINACH=MY_SPINACH_API_TOKEN bundle exec rake knapsack_pro:spinach
```

See also [how to configure running parallel CI nodes in GitLab](https://docs.gitlab.com/ee/ci/yaml/#parallel).

#### GitLab CI < 11.5

Define in `.gitlab-ci.yml`:
- [`KNAPSACK_PRO_TEST_SUITE_TOKEN_*`](/ruby/reference/#knapsack_pro_test_suite_token_)
- [`KNAPSACK_PRO_CI_NODE_TOTAL`](/ruby/reference/#knapsack_pro_ci_node_total)
- [`KNAPSACK_PRO_CI_NODE_INDEX`](/ruby/reference/#knapsack_pro_ci_node_index)

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
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=MY_RSPEC_API_TOKEN bundle exec rake knapsack_pro:rspec
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=MY_CUCUMBER_API_TOKEN bundle exec rake knapsack_pro:cucumber
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_MINITEST=MY_MINITEST_API_TOKEN bundle exec rake knapsack_pro:minitest
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_TEST_UNIT=MY_TEST_UNIT_API_TOKEN bundle exec rake knapsack_pro:test_unit
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_SPINACH=MY_SPINACH_API_TOKEN bundle exec rake knapsack_pro:spinach
    # highlight-end

test_ci_second_node:
  stage: test
  script:
    # highlight-start
    - export KNAPSACK_PRO_CI_NODE_INDEX=1
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=MY_RSPEC_API_TOKEN bundle exec rake knapsack_pro:rspec
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=MY_CUCUMBER_API_TOKEN bundle exec rake knapsack_pro:cucumber
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_MINITEST=MY_MINITEST_API_TOKEN bundle exec rake knapsack_pro:minitest
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_TEST_UNIT=MY_TEST_UNIT_API_TOKEN bundle exec rake knapsack_pro:test_unit
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_SPINACH=MY_SPINACH_API_TOKEN bundle exec rake knapsack_pro:spinach
    # highlight-end
```

Remember to set up the `KNAPSACK_PRO_TEST_SUITE_TOKEN_*` as [Secret Variables](https://gitlab.com/help/ci/variables/README.md#secret-variables) in GitLab CI: *Settings > CI/CD Pipelines > Secret Variables*.

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="ci" value="heroku-ci">

### Heroku CI

Generate [API tokens](https://knapsackpro.com/dashboard?utm_source=docs_knapsackpro&utm_medium=page&utm_campaign=knapsack_pro-ruby_gem&utm_content=installation_guide_herokuci) for each Knapsack Pro command.

Define in `app.json`:
- [`KNAPSACK_PRO_TEST_SUITE_TOKEN_*`](/ruby/reference/#knapsack_pro_test_suite_token_)
- `quantity`: number of parallel dynos
- `test`: the Knapsack Pro command (or [multiple commands](/ruby/heroku/#run-multiple-test-suites))

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
        "test": "bundle exec rake knapsack_pro:rspec"
      },
      "env": {
        "KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC": "MY_RSPEC_API_TOKEN"
      }
      // highlight-end
    }
  }
}
```

Remember to set up the `KNAPSACK_PRO_TEST_SUITE_TOKEN_*` outside of `app.json` in your Heroku CI pipeline's settings.

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="ci" value="jenkins">

### Jenkins

Generate [API tokens](https://knapsackpro.com/dashboard?utm_source=docs_knapsackpro&utm_medium=page&utm_campaign=knapsack_pro-ruby_gem&utm_content=installation_guide_jenkins) for each Knapsack Pro command.

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
            KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=MY_RSPEC_API_TOKEN\
            KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=MY_CUCUMBER_API_TOKEN
        """

        stage('Run rspec') {
          sh """${knapsack_options} bundle exec rake knapsack_pro:rspec"""
        }

        stage('Run cucumber') {
          sh """${knapsack_options} bundle exec rake knapsack_pro:cucumber"""
        }
        // highlight-end

        // ...Same for minitest, spinach, test_unit
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

Generate [API tokens](https://knapsackpro.com/dashboard?utm_source=docs_knapsackpro&utm_medium=page&utm_campaign=knapsack_pro-ruby_gem&utm_content=installation_guide_semaphoreci) for each Knapsack Pro command.

Define in `.semaphore/semaphore.yml`:
- [`KNAPSACK_PRO_TEST_SUITE_TOKEN_*`](/ruby/reference/#knapsack_pro_test_suite_token_)
- `parallelism`

Here's an example config for a Rails project:

```yaml title=".semaphore/semaphore.yml"
version: v1.0

name: Demo Rails 5 app

agent:
  machine:
    type: e1-standard-2
    os_image: ubuntu1804

blocks:
  - name: Setup
    task:
      jobs:
        - name: bundle
          commands:
            - checkout
            - cache restore gems-$SEMAPHORE_GIT_BRANCH-$(checksum Gemfile.lock),gems-$SEMAPHORE_GIT_BRANCH-,gems-master-
            - sem-version ruby 2.6.1
            - bundle install --jobs=4 --retry=3 --path vendor/bundle
            - cache store gems-$SEMAPHORE_GIT_BRANCH-$(checksum Gemfile.lock) vendor/bundle

  - name: RSpec tests
    task:
      env_vars:
        - name: RAILS_ENV
          value: test
        - name: PGHOST
          value: 127.0.0.1
        - name: PGUSER
          value: postgres
        # highlight-start
        - name: KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC
          value: MY_RSPEC_API_TOKEN
        - name: KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER
          value: MY_CUCUMBER_API_TOKEN
        # highlight-end

      prologue:
        commands:
          - checkout
          - cache restore gems-$SEMAPHORE_GIT_BRANCH-$(checksum Gemfile.lock),gems-$SEMAPHORE_GIT_BRANCH-,gems-master-
          - sem-service start postgres
          - sem-version ruby 2.6.1
          - bundle install --jobs=4 --retry=3 --path vendor/bundle
          - bundle exec rake db:setup

      # highlight-start
      jobs:
        - name: Run tests with Knapsack Pro
          parallelism: 2
          commands:
            - bundle exec rake knapsack_pro:rspec
            - bundle exec rake knapsack_pro:cucumber

        # ...Same for minitest, spinach, test_unit
      # highlight-end
```

Remember to set up `KNAPSACK_PRO_TEST_SUITE_TOKEN_*` as a [secret](https://docs.semaphoreci.com/article/66-environment-variables-and-secrets).

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="ci" value="travis-ci">

### Travis CI

Generate [API tokens](https://knapsackpro.com/dashboard?utm_source=docs_knapsackpro&utm_medium=page&utm_campaign=knapsack_pro-ruby_gem&utm_content=installation_guide_travisci) for each Knapsack Pro command.

Define in `.travis.yml`:
- [`KNAPSACK_PRO_TEST_SUITE_TOKEN_*`](/ruby/reference/#knapsack_pro_test_suite_token_)
- [`KNAPSACK_PRO_CI_NODE_TOTAL`](/ruby/reference/#knapsack_pro_ci_node_total)
- [`KNAPSACK_PRO_CI_NODE_INDEX`](/ruby/reference/#knapsack_pro_ci_node_index) as [jobs](http://docs.travis-ci.com/user/speeding-up-the-build/#parallelizing-your-builds-across-virtual-machines)

```yaml title="travis.yml"
script:
  - "bundle exec rake knapsack_pro:rspec"
  - "bundle exec rake knapsack_pro:cucumber"
  - "bundle exec rake knapsack_pro:minitest"
  - "bundle exec rake knapsack_pro:test_unit"
  - "bundle exec rake knapsack_pro:spinach"

env:
  global:
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=MY_RSPEC_API_TOKEN
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=MY_CUCUMBER_API_TOKEN
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_MINITEST=MY_MINITEST_API_TOKEN
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_TEST_UNIT=MY_TEST_UNIT_API_TOKEN
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_SPINACH=MY_SPINACH_API_TOKEN
    - KNAPSACK_PRO_CI_NODE_TOTAL=3
  jobs:
    - KNAPSACK_PRO_CI_NODE_INDEX=0
    - KNAPSACK_PRO_CI_NODE_INDEX=1
    - KNAPSACK_PRO_CI_NODE_INDEX=2
```

Remember to set up `KNAPSACK_PRO_TEST_SUITE_TOKEN_*` as tokens in the Travis settings to avoid exposing them in the build logs.

You can find more info about the global and matrix env configuration in the [Travis' docs](https://docs.travis-ci.com/user/customizing-the-build/#build-matrix).

</ShowIfSearchParamAndValue>


<ShowIfSearchParamAndValue searchParam="ci" value="other">

### Other CI provider

Generate [API tokens](https://knapsackpro.com/dashboard?utm_source=docs_knapsackpro&utm_medium=page&utm_campaign=knapsack_pro-ruby_gem&utm_content=installation_guide_otherci) for each Knapsack Pro command.

Define the following global environment variables on your CI server:
- [`KNAPSACK_PRO_TEST_SUITE_TOKEN_*`](/ruby/reference/#knapsack_pro_test_suite_token_)
- [`KNAPSACK_PRO_REPOSITORY_ADAPTER=git`](/ruby/reference/#knapsack_pro_repository_adapter)
- [`KNAPSACK_PRO_PROJECT_DIR`](/ruby/reference/#knapsack_pro_project_dir)
- [`KNAPSACK_PRO_CI_NODE_TOTAL`](/ruby/reference/#knapsack_pro_ci_node_total)
- [`KNAPSACK_PRO_CI_NODE_INDEX`](/ruby/reference/#knapsack_pro_ci_node_index)
- [`KNAPSACK_PRO_CI_NODE_BUILD_ID`](/ruby/reference/#knapsack_pro_ci_node_build_id)

<Tabs>
<TabItem value="node-1" label="Node 1">

```bash
KNAPSACK_PRO_CI_NODE_TOTAL=N \
KNAPSACK_PRO_CI_NODE_INDEX=0 \
KNAPSACK_PRO_CI_NODE_BUILD_ID=MY_BUILD_ID \
KNAPSACK_PRO_REPOSITORY_ADAPTER=git \
KNAPSACK_PRO_PROJECT_DIR=MY_PROJECT_DIR \
KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=MY_RSPEC_API_TOKEN \
bundle exec rake knapsack_pro:rspec

KNAPSACK_PRO_CI_NODE_TOTAL=N \
KNAPSACK_PRO_CI_NODE_INDEX=0 \
KNAPSACK_PRO_CI_NODE_BUILD_ID=MY_BUILD_ID \
KNAPSACK_PRO_REPOSITORY_ADAPTER=git \
KNAPSACK_PRO_PROJECT_DIR=MY_PROJECT_DIR \
KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=MY_CUCUMBER_API_TOKEN \
bundle exec rake knapsack_pro:cucumber

# ...Same for minitest, spinach, test_unit
```

</TabItem>
<TabItem value="node-2" label="Node 2">

```bash
KNAPSACK_PRO_CI_NODE_TOTAL=N \
KNAPSACK_PRO_CI_NODE_INDEX=1 \
KNAPSACK_PRO_CI_NODE_BUILD_ID=MY_BUILD_ID \
KNAPSACK_PRO_REPOSITORY_ADAPTER=git \
KNAPSACK_PRO_PROJECT_DIR=MY_PROJECT_DIR \
KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=MY_RSPEC_API_TOKEN \
bundle exec rake knapsack_pro:rspec

KNAPSACK_PRO_CI_NODE_TOTAL=N \
KNAPSACK_PRO_CI_NODE_INDEX=1 \
KNAPSACK_PRO_CI_NODE_BUILD_ID=MY_BUILD_ID \
KNAPSACK_PRO_REPOSITORY_ADAPTER=git \
KNAPSACK_PRO_PROJECT_DIR=MY_PROJECT_DIR \
KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=MY_CUCUMBER_API_TOKEN \
bundle exec rake knapsack_pro:cucumber

# ...Same for minitest, spinach, test_unit
```

</TabItem>
<TabItem value="node-n" label="Node N">

```bash
KNAPSACK_PRO_CI_NODE_TOTAL=N \
KNAPSACK_PRO_CI_NODE_INDEX=N-1 \
KNAPSACK_PRO_CI_NODE_BUILD_ID=MY_BUILD_ID \
KNAPSACK_PRO_REPOSITORY_ADAPTER=git \
KNAPSACK_PRO_PROJECT_DIR=MY_PROJECT_DIR \
KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=MY_RSPEC_API_TOKEN \
bundle exec rake knapsack_pro:rspec

KNAPSACK_PRO_CI_NODE_TOTAL=N \
KNAPSACK_PRO_CI_NODE_INDEX=N-1 \
KNAPSACK_PRO_CI_NODE_BUILD_ID=MY_BUILD_ID \
KNAPSACK_PRO_REPOSITORY_ADAPTER=git \
KNAPSACK_PRO_PROJECT_DIR=MY_PROJECT_DIR \
KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=MY_CUCUMBER_API_TOKEN \
bundle exec rake knapsack_pro:cucumber

# ...Same for minitest, spinach, test_unit
```

</TabItem>
</Tabs>

</ShowIfSearchParamAndValue>


<ShowIfSearchParam searchParam="ci">

### Verify that everything works

Push a new commit to your repository and visit your [dashboard](https://knapsackpro.com/dashboard) to make sure all your CI nodes were recorded successfully in *Show build metrics > Show (build)*.

**Congratulations!** Now that Knapsack Pro knows the statistics of your test suite, your CI builds will be parallelized optimally.

### Next up

For an even faster CI build, switch to [Queue Mode](/ruby/queue-mode/) and [Split by test examples](/ruby/split-by-test-examples/).

Make sure you check out the *Advanced* and *Using Knapsack Pro with...* pages from the navigation to fine-tune your Knapsack Pro setup.

</ShowIfSearchParam>

## Need help?

[Get in touch!](https://knapsackpro.com/contact)

We have helped TONS of teams and seen TONS of projects. We know each test suite is a different beast and we'd be happy to help you set up Knapsack Pro.