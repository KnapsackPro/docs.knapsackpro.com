---
hide_table_of_contents: true
pagination_next: null
pagination_prev: null
---

import { TestRunnerCheckbox } from './TestRunnerCheckbox'
import { CiRadio } from './CiRadio'

# Installation guide for ruby gem `knapsack_pro`

You can find more detailed information and configuration options in the [README for the `knapsack_pro` gem](https://github.com/KnapsackPro/knapsack_pro-ruby).<br />
[Create an account at Knapsack Pro to use the `knapsack_pro` gem](http://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=page&utm_campaign=knapsack_pro-ruby_gem&utm_content=installation_guide)

## Installation

Add the following code to your application's `Gemfile`:

```ruby
group :test, :development do
  gem 'knapsack_pro'
end
```

And then execute:

```bash
bundle install
```


If you are not using Rails, then add this line at the bottom of your `Rakefile`:

```ruby
# Only needed if you are not using Rails.
KnapsackPro.load_tasks if defined?(KnapsackPro)
```

Here's a [Rails application](https://github.com/KnapsackPro/rails-app-with-knapsack_pro) with `knapsack_pro` already configured.

## Questions

Please answer the following questions to get the basic `knapsack_pro` configuration for your project.

<strong>Choose your testing tools:</strong>
<ul className="none-list">
  <li><label><TestRunnerCheckbox id="test-runner-rspec" /> RSpec</label></li>
  <li><label><TestRunnerCheckbox id="test-runner-cucumber" /> Cucumber</label></li>
  <li><label><TestRunnerCheckbox id="test-runner-minitest" /> Minitest</label></li>
  <li><label><TestRunnerCheckbox id="test-runner-spinach" /> Spinach</label></li>
  <li><label><TestRunnerCheckbox id="test-runner-test-unit" /> test-unit</label></li>
</ul>

<strong>Do you use VCR, WebMock, or FakeWeb gem?</strong>
<ul className="none-list">
  <li><label><TestRunnerCheckbox id="vcr-webmock-fakeweb" /> Yes</label></li>
</ul>

<strong>What is your CI provider?</strong>
<ul className="none-list">
  <li><label><CiRadio value="appveyor" /> AppVeyor</label></li>
  <li><label><CiRadio value="buildkite" /> Buildkite</label></li>
  <li><label><CiRadio value="circleci" /> CircleCI</label></li>
  <li><label><CiRadio value="cirrus-ci" /> Cirrus CI</label></li>
  <li><label><CiRadio value="codeship" /> CloudBees CodeShip</label></li>
  <li><label><CiRadio value="codefresh" /> Codefresh</label></li>
  <li><label><CiRadio value="github-actions" /> GitHub Actions</label></li>
  <li><label><CiRadio value="gitlab-ci" /> GitLab CI</label></li>
  <li><label><CiRadio value="heroku-ci" /> Heroku CI</label></li>
  <li><label><CiRadio value="jenkins" /> Jenkins</label></li>
  <li><label><CiRadio value="semaphoreci" /> Semaphore CI</label></li>
  <li><label><CiRadio value="travis-ci" /> Travis CI</label></li>
  <li><label><CiRadio value="other" /> Other</label></li>
</ul>

<div id="guide-test-runner-rspec" className="hidden" markdown="1">

  ### Step for RSpec

  Add the following code at the beginning of your `spec/rails_helper.rb` or `spec/spec_helper.rb`:

```ruby
require 'knapsack_pro'

# Custom KnapsackPro config here

KnapsackPro::Adapters::RSpecAdapter.bind
```
</div>

<div id="guide-test-runner-minitest" className="hidden" markdown="1">

  ### Step for Minitest

  Add the Knapsack Pro code after you load the app environment in the `test/test_helper.rb` file:

```ruby
ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'

require 'knapsack_pro'

# Custom KnapsackPro config here

knapsack_pro_adapter = KnapsackPro::Adapters::MinitestAdapter.bind
knapsack_pro_adapter.set_test_helper_path(__FILE__)
```
</div>

<div id="guide-test-runner-test-unit" className="hidden" markdown="1">

  ### Step for test-unit

  Add the following code at the beginning of your `test/test_helper.rb`:

```ruby
require 'knapsack_pro'

# Custom KnapsackPro config here

knapsack_pro_adapter = KnapsackPro::Adapters::TestUnitAdapter.bind
knapsack_pro_adapter.set_test_helper_path(__FILE__)
```
</div>

<div id="guide-test-runner-cucumber" className="hidden" markdown="1">

  ### Step for Cucumber

  Create a `features/support/knapsack_pro.rb` file with the following code:

```ruby
require 'knapsack_pro'

# Custom KnapsackPro config here

KnapsackPro::Adapters::CucumberAdapter.bind
```
</div>

<div id="guide-test-runner-spinach" className="hidden" markdown="1">

  ### Step for Spinach

  Create a `features/support/knapsack_pro.rb` file with the following code:

```ruby
require 'knapsack_pro'

# Custom KnapsackPro config here

KnapsackPro::Adapters::SpinachAdapter.bind
```
</div>

<div id="guide-vcr-webmock-fakeweb" className="hidden" markdown="1">

  ### Step for VCR/WebMock/FakeWeb gems

  Add Knapsack Pro API subdomain to [ignored hosts](https://relishapp.com/vcr/vcr/v/6-1-0/docs/configuration/ignore-request) in `spec/spec_helper.rb` (or wherever your VCR configuration is located):

```ruby
require 'vcr'
VCR.configure do |config|
  config.hook_into :webmock # or :fakeweb
  config.ignore_hosts('localhost', '127.0.0.1', '0.0.0.0', 'api.knapsackpro.com')
end

# add the following code if you use webmock:
require 'webmock/rspec'
WebMock.disable_net_connect!(allow_localhost: true, allow: ['api.knapsackpro.com'])

# add the following code if you use FakeWeb:
require 'fakeweb'
FakeWeb.allow_net_connect = %r[^https?://api\.knapsackpro\.com]
```

  Ensure you have the `require: false` setting in Gemfile for the webmock gem when VCR is hooked into it. Thanks to that, the webmock configuration from `spec_helper.rb` is loaded properly.

```ruby
group :test do
  gem 'vcr'
  gem 'webmock', require: false
  gem 'fakeweb', require: false # example when you use fakeweb
end
```

  If you still happen to see your tests failing due to WebMock not allowing requests to Knapsack Pro API, it probably means that you reconfigure WebMock in some of your tests.
  For instance, you might be using `WebMock.reset!`. It might also be called automatically in an `after(:each)` block when using `require 'webmock/rspec'` (<a href="https://github.com/bblimke/webmock/issues/484#issuecomment-116193449" target="_blank">more about the issue</a>). This would remove `api.knapsackpro.com` from the allowed domains. In this case, please try the following:

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

</div>

<div id="guide-providers">
<div id="guide-provider-circleci" className="hidden" markdown="1">

  ### Step for CircleCI

  <p>
    Example config file for the CircleCI 2.0 platform.
  </p>

```yaml
# CircleCI 2.0
# .circleci/config.yml
version: 2
jobs:
build:
  parallelism: 2
  steps:
    - checkout

    # ... other configs

    # some tests that are not balanced and executed only on the first CI node
    - run: case $CIRCLE_NODE_INDEX in 0) npm test ;; esac

    # auto-balancing CI build execution time (making the whole build as fast as possible).
    # Queue Mode does dynamic tests allocation, so the previous unbalanced run command won't
    # create a bottleneck on the CI node
    - run:
      name: RSpec via knapsack_pro Queue Mode
      command: |
        # please don't forget the `export` keyword!
        export RAILS_ENV=test
        bundle exec rake "knapsack_pro:queue:rspec[--format documentation]"

    - run:
      name: Minitest via knapsack_pro Queue Mode
      command: |
        # please don't forget the `export` keyword!
        export RAILS_ENV=test
        bundle exec rake "knapsack_pro:queue:minitest[--verbose]"

    - run:
      name: Cucumber via knapsack_pro Queue Mode
      command: |
        # please don't forget the `export` keyword!
        export RAILS_ENV=test
        # If you use spring gem and spring-commands-cucumber gem to start Cucumber tests faster, please set
        # export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bundle exec spring
        # or alternatively you can use spring binstub:
        # export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bin/spring
        # Thanks to that, Cucumber will start tests faster for each batch of tests fetched from the Knapsack Pro Queue API
        bundle exec rake knapsack_pro:queue:cucumber
```

  Adjust the number of parallel containers with the `parallelism` attribute.

  Please consult a full example of <a href="https://docs.knapsackpro.com//2017/circleci-2-0-capybara-feature-specs-selenium-webdriver-with-chrome-headless" target="_blank">Rails project config on CircleCI 2.0</a> for more details.

  <p>
    If you use knapsack_pro Queue Mode with CircleCI, you may want to collect metadata like <a href="https://github.com/KnapsackPro/knapsack_pro-ruby#circleci-and-knapsack_pro-queue-mode" target="_blank">junit xml report about your RSpec</a> test suite with junit formatter. Thanks to that, you can see failed tests in the nice CircleCI web UI. It's also possible to <a href="https://knapsackpro.com/faq/question/how-to-use-junit-formatter" target="_blank">configure junit formatter for knapsack_pro Regular Mode</a>.
  </p>

  <p>
    Please remember to add additional containers for your project in CircleCI settings.
  </p>
</div>

<div id="guide-provider-travis-ci" className="hidden" markdown="1">

### Step for Travis CI

You can parallelize your builds across virtual machines with the [travis matrix feature](http://docs.travis-ci.com/user/speeding-up-the-build/#parallelizing-your-builds-across-virtual-machines). Edit your config in the `.travis.yml` file.

```yaml
script:
# Step for RSpec in Regular Mode
- "bundle exec rake knapsack_pro:rspec"

# Step for RSpec in Queue Mode
- "bundle exec rake knapsack_pro:queue:rspec"

# Step for Cucumber in Regular Mode
- "bundle exec rake knapsack_pro:cucumber"

# Step for Cucumber in Queue Mode
- "bundle exec rake knapsack_pro:queue:cucumber"

# Step for Minitest in Regular Mode
- "bundle exec rake knapsack_pro:minitest"

# Step for Minitest in Queue Mode
- "bundle exec rake knapsack_pro:queue:minitest"

# Step for test-unit in Regular Mode
- "bundle exec rake knapsack_pro:test_unit"

# Step for Spinach in Regular Mode
- "bundle exec rake knapsack_pro:spinach"

env:
global:
  # tokens should be set in the Travis settings web interface to avoid exposing tokens in the build logs
  - KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=rspec-token
  - KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=cucumber-token
  - KNAPSACK_PRO_TEST_SUITE_TOKEN_MINITEST=minitest-token
  - KNAPSACK_PRO_TEST_SUITE_TOKEN_TEST_UNIT=test-unit-token
  - KNAPSACK_PRO_TEST_SUITE_TOKEN_SPINACH=spinach-token

  # if you use Knapsack Pro Queue Mode, you should set the following env variable to ensure
  # the correct set of tests is being run when retrying a single failed parallel job from the Travis UI
  - KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true

  - KNAPSACK_PRO_CI_NODE_TOTAL=2
jobs:
  - KNAPSACK_PRO_CI_NODE_INDEX=0
  - KNAPSACK_PRO_CI_NODE_INDEX=1
```

  <p>
    This configuration will generate a matrix with the following 2 env rows:
  </p>

```bash
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=rspec-token KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=cucumber-token KNAPSACK_PRO_TEST_SUITE_TOKEN_MINITEST=minitest-token KNAPSACK_PRO_TEST_SUITE_TOKEN_TEST_UNIT=test-unit-token KNAPSACK_PRO_TEST_SUITE_TOKEN_SPINACH=spinach-token
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=rspec-token KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=cucumber-token KNAPSACK_PRO_TEST_SUITE_TOKEN_MINITEST=minitest-token KNAPSACK_PRO_TEST_SUITE_TOKEN_TEST_UNIT=test-unit-token KNAPSACK_PRO_TEST_SUITE_TOKEN_SPINACH=spinach-token
```

  <p>
    You can find more info about global and matrix env configuration in <a href="https://docs.travis-ci.com/user/customizing-the-build/#build-matrix" target="_blank">travis docs</a>.
  </p>
</div>

<div id="guide-provider-buildkite" className="hidden" markdown="1">

  ### Step for Buildkite

  Knapsack Pro automatically reads the Buildkite ENV variables: `BUILDKITE_PARALLEL_JOB_COUNT` and `BUILDKITE_PARALLEL_JOB`. The only thing you need to do is to configure the `parallelism` parameter in your build step and run the appropriate command in your build:

```bash
# Step for RSpec
bundle exec rake knapsack_pro:rspec

# Step for Cucumber
bundle exec rake knapsack_pro:cucumber

# Step for Minitest
bundle exec rake knapsack_pro:minitest

# Step for test-unit
bundle exec rake knapsack_pro:test_unit

# Step for Spinach
bundle exec rake knapsack_pro:spinach
```

  Please remember to set up your `KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC` as a global environment variable.

  <p>
    Here you can find an article showing <a href="http://docs.knapsackpro.com/2017/auto-balancing-7-hours-tests-between-100-parallel-jobs-on-ci-buildkite-example" target="_blank">how to set up a new pipeline for your project in Buildkite and configure Knapsack Pro</a>. You can also check out the following example repositories for Ruby/Rails projects:
  </p>

  <ul>
    <li><a href="https://github.com/KnapsackPro/buildkite-rails-parallel-example-with-knapsack_pro" target="_blank">Buildkite Rails Parallel Example with Knapsack Pro</a></li>
    <li><a href="https://github.com/KnapsackPro/buildkite-rails-docker-parallel-example-with-knapsack_pro" target="_blank">Buildkite Rails Docker Parallel Example with Knapsack Pro</a></li>
  </ul>

  If you want to retry single Buildkite agents (CI nodes), then you should set [`KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true`](https://github.com/KnapsackPro/knapsack_pro-ruby#knapsack_pro_fixed_queue_split-remember-queue-split-on-retry-ci-node).

  When using the `docker-compose` plugin on Buildkite, you have to pass some environment variables to the docker container. This is needed for Knapsack Pro to work correctly:

```yaml
steps:
- label: "Test"
  parallelism: 2
  plugins:
    - docker-compose#3.0.3:
      run: app
      # use the proper knapsack_pro command for your test runner here
      command: bundle exec rake knapsack_pro:queue:rspec
      config: docker-compose.test.yml
      env:
        - BUILDKITE_PARALLEL_JOB_COUNT
        - BUILDKITE_PARALLEL_JOB
        - BUILDKITE_BUILD_NUMBER
        - BUILDKITE_COMMIT
        - BUILDKITE_BRANCH
        - BUILDKITE_BUILD_CHECKOUT_PATH
```

</div>

<div id="guide-provider-semaphoreci" className="hidden" markdown="1">

### Step for Semaphore CI

#### Semaphore 2.0 <small>(<a href="#semaphore_1_0">click here for Semaphore 1.0</a>)</small>


Knapsack Pro supports environment variables provided by Semaphore CI 2.0 to run your tests. You need to define a few things in the `.semaphore/semaphore.yml` config file.

- You need to set `KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC`. If you don't want to commit secrets in the yml file, you can [follow this guide](https://docs.semaphoreci.com/article/66-environment-variables-and-secrets).
- You should create as many parallel jobs as you need with the *parallelism* property. Use more parallel jobs for long test suites.

Full Semaphore CI 2.0 config example for a Rails project:

```yaml
# .semaphore/semaphore.yml
# Use the latest stable version of Semaphore 2.0 YML syntax:
version: v1.0

name: Demo Rails 5 app

agent:
machine:
  type: e1-standard-2
  os_image: ubuntu1804

blocks:
- name: Setup
  task:
    env_vars:
      - name: RAILS_ENV
        value: test
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
      - name: KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC
        value: your_api_token_here
    prologue:
      commands:
        - checkout
        - cache restore gems-$SEMAPHORE_GIT_BRANCH-$(checksum Gemfile.lock),gems-$SEMAPHORE_GIT_BRANCH-,gems-master-
        - sem-service start postgres
        - sem-version ruby 2.6.1
        - bundle install --jobs=4 --retry=3 --path vendor/bundle
        - bundle exec rake db:setup

    jobs:
    - name: Run tests with Knapsack Pro
      parallelism: 2
      commands:
      # Step for RSpec in Queue Mode
      - bundle exec rake knapsack_pro:queue:rspec
      # Step for Cucumber in Queue Mode
      # If you use spring gem and spring-commands-cucumber gem to start Cucumber tests faster, please set:
      # export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bundle exec spring
      # or alternatively you can use spring binstub:
      # export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bin/spring
      # Thanks to that, Cucumber will start tests faster for each batch of tests fetched from the Knapsack Pro Queue API
      - bundle exec rake knapsack_pro:queue:cucumber

      # Step for RSpec in Regular Mode
      - bundle exec rake knapsack_pro:rspec
      # Step for Cucumber in Regular Mode
      - bundle exec rake knapsack_pro:cucumber
      # Step for Minitest in Regular Mode
      - bundle exec rake knapsack_pro:minitest
      # Step for test-unit in Regular Mode
      - bundle exec rake knapsack_pro:test_unit
      # Step for Spinach in Regular Mode
      - bundle exec rake knapsack_pro:spinach
```

  <h4 id="semaphore_1_0">Semaphore 1.0</h4>

  Run the proper `knapsack_pro` command for as many threads as you need. Here is an example:

```bash
# Thread 1
## Step for RSpec
bundle exec rake knapsack_pro:rspec
## Step for Cucumber
bundle exec rake knapsack_pro:cucumber
## Step for Minitest
bundle exec rake knapsack_pro:minitest
## Step for test-unit
bundle exec rake knapsack_pro:test_unit
## Step for Spinach
bundle exec rake knapsack_pro:spinach

# Thread 2
## Step for RSpec
bundle exec rake knapsack_pro:rspec
## Step for Cucumber
bundle exec rake knapsack_pro:cucumber
## Step for Minitest
bundle exec rake knapsack_pro:minitest
## Step for test-unit
bundle exec rake knapsack_pro:test_unit
## Step for Spinach
bundle exec rake knapsack_pro:spinach
```

  <p>Your tests will be divided across threads.</p>

  Please remember to set up the `KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC` token as a global environment variable.
</div>


<div id="guide-provider-codeship" className="hidden" markdown="1">

  ### Step for CloudBees CodeShip

  You need to define a `KNAPSACK_PRO_CI_NODE_TOTAL` and `KNAPSACK_PRO_CI_NODE_INDEX` environment variables for each <a href="https://documentation.codeship.com/basic/builds-and-configuration/parallel-tests/#using-parallel-test-pipelines" target="_blank">parallel test pipeline</a>. Here is an example for 2 pipelines.

  <p>First pipeline:</p>

```bash
# first CI node running in parallel

# Cucumber tests in Knapsack Pro Regular Mode
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:cucumber

# Cucumber tests in Knapsack Pro Queue Mode
# If you use spring gem and spring-commands-cucumber gem to start Cucumber tests faster, please set:
# export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bundle exec spring
# or alternatively you can use spring binstub:
# export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bin/spring
# Thanks to that, Cucumber will start tests faster for each batch of tests fetched from the Knapsack Pro Queue API
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:queue:cucumber

# RSpec tests in Knapsack Pro Queue Mode
# It will help balance your build because it is executed after Cucumber tests.
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:queue:rspec
```

  <p>Second pipeline:</p>

```bash
# second CI node running in parallel

# Cucumber tests in Knapsack Pro Regular Mode
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:cucumber

# Cucumber tests in Knapsack Pro Queue Mode
# If you use spring gem and spring-commands-cucumber gem to start Cucumber tests faster, please set:
# export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bundle exec spring
# or alternatively you can use spring binstub:
# export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bin/spring
# Thanks to that, Cucumber will start tests faster for each batch of tests fetched from the Knapsack Pro Queue API
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:queue:cucumber

# RSpec tests in Knapsack Pro Queue Mode
# It will help balance your build because it is executed after Cucumber tests.
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:queue:rspec
```

  Remember to define API tokens as `KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER` and `KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC` on the <i>Environment</i> page of your project settings in CodeShip.

  CodeShip uses the same build number if you restart a build. Because of that, you need to set [`KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true`](https://github.com/KnapsackPro/knapsack_pro-ruby#knapsack_pro_fixed_queue_split-remember-queue-split-on-retry-ci-node) in order to be able to restart a CI build in Queue Mode.
</div>

<div id="guide-provider-heroku-ci" className="hidden" markdown="1">

  ### Step for Heroku CI

  You can parallelize your tests on Heroku CI using the `app.json` file.

  You can set the number of parallel dynos you want to run with the `quantity` value.
  Use the `test` key to run Knapsack Pro.

  You also need to specify the environment variable with an API token for Knapsack Pro.
  This should not be stored directly in the `app.json`, so you can add them to your pipeline's Heroku CI settings (we show it below in the config for illustrative purposes).

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
      "test": "bundle exec rake knapsack_pro:rspec"
    },
    "env": {
      # just an example - this should be defined outside the json config file
      "KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC": "rspec-token"
    }
  }
}
}
```

  <p>
    Please see this article if you would like to <a href="https://knapsackpro.com/faq/question/how-to-run-multiple-test-suite-commands-in-heroku-ci" target="_blank">run multiple Knapsack Pro commands for different test runners on Heroku CI</a>.
  </p>

  <p>
    You can learn more about <a href="https://devcenter.heroku.com/articles/heroku-ci" target="_blank">Heroku CI</a>.
  </p>

</div>

<div id="guide-provider-appveyor" className="hidden" markdown="1">

  ### Step for AppVeyor

  You need to define `KNAPSACK_PRO_CI_NODE_TOTAL` and `KNAPSACK_PRO_CI_NODE_INDEX` variables for each parallel job running as part of the same CI build.

```bash
# Step for RSpec for the first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:rspec
# Step for RSpec for the second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:rspec

# Step for Cucumber for the first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:cucumber
# Step for Cucumber for the second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:cucumber

# Step for Minitest for the first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:minitest
# Step for Minitest for the second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:minitest

# Step for test-unit for the first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:test_unit
# Step for test-unit for the second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:test_unit

# Step for Spinach for the first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:spinach
# Step for Spinach for the second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:spinach
```

  Please remember to define your API token in the `KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC` global environment variable.
</div>

<div id="guide-provider-gitlab-ci" className="hidden" markdown="1">

  ### Step for GitLab CI

  Remember to add your API tokens as env variables (e.g. `KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER` or `KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC`) to <a href="https://gitlab.com/help/ci/variables/README.md#secret-variables" target="_blank">Secret Variables</a> in GitLab CI Settings -> CI/CD Pipelines -> Secret Variables.

  <h4>GitLab CI >= 11.5</h4>

```yaml
test:
parallel: 2

# Knapsack Pro Regular Mode
script: bundle exec rake knapsack_pro:rspec

# Other commands:

# Knapsack Pro Regular Mode
# bundle exec rake knapsack_pro:cucumber
# bundle exec rake knapsack_pro:minitest
# bundle exec rake knapsack_pro:test_unit
# bundle exec rake knapsack_pro:spinach

# Knapsack Pro Queue Mode
# bundle exec rake knapsack_pro:queue:rspec
# bundle exec rake knapsack_pro:queue:minitest

# If you use spring gem and spring-commands-cucumber gem to start Cucumber tests faster, please set:
# export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bundle exec spring
# or alternatively you can use spring binstub:
# export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bin/spring
# Thanks to that, Cucumber will start tests faster for each batch of tests fetched from the Knapsack Pro Queue API
# bundle exec rake knapsack_pro:queue:cucumber
```

  <p>
    Find out <a href="https://docs.gitlab.com/ee/ci/yaml/#parallel" target="_blank">how to configure running parallel CI nodes in GitLab</a>.
  </p>

<h4>GitLab CI &lt; 11.5 (old GitLab CI)</h4>

  You need to define `KNAPSACK_PRO_CI_NODE_TOTAL` and `KNAPSACK_PRO_CI_NODE_INDEX` environment variables for each parallel job running as part of the same test stage. Here is a relevant part of the `.gitlab-ci.yml` configuration file for 2 parallel jobs:

```yaml
# .gitlab-ci.yml
stages:
- test

variables:
KNAPSACK_PRO_CI_NODE_TOTAL: 2

# first CI node
test_ci_node_0:
stage: test
script:
  - export KNAPSACK_PRO_CI_NODE_INDEX=0
  # Cucumber tests in Knapsack Pro Regular Mode
  - bundle exec rake knapsack_pro:cucumber

  # Cucumber tests in Knapsack Pro Queue Mode
  # If you use spring gem and spring-commands-cucumber gem to start Cucumber tests faster, please set:
  # export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bundle exec spring
  # or alternatively you can use spring binstub:
  # export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bin/spring
  # Thanks to that, Cucumber will start tests faster for each batch of tests fetched from the Knapsack Pro Queue API
  - bundle exec rake knapsack_pro:queue:cucumber

  # RSpec tests in Knapsack Pro Queue Mode
  # It will help balance your build because it is executed after Cucumber tests.
  - bundle exec rake knapsack_pro:queue:rspec

# second CI node
test_ci_node_1:
stage: test
script:
  - export KNAPSACK_PRO_CI_NODE_INDEX=1
  - bundle exec rake knapsack_pro:cucumber

  # If you use spring gem and spring-commands-cucumber gem to start Cucumber tests faster, please set:
  # export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bundle exec spring
  # or alternatively you can use spring binstub:
  # export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bin/spring
  # Thanks to that, Cucumber will start tests faster for each batch of tests fetched from the Knapsack Pro Queue API
  - bundle exec rake knapsack_pro:queue:cucumber

  - bundle exec rake knapsack_pro:queue:rspec
```
</div>


<div id="guide-provider-cirrus-ci" className="hidden" markdown="1">

  ### Step for Cirrus CI

  <p>
    You need to configure running your desired number of parallel CI nodes in Cirrus. Then, make sure you run one of the following commands on each parallel CI node:
  </p>

```bash
# Step for RSpec
bundle exec rake knapsack_pro:rspec

# Step for Cucumber
bundle exec rake knapsack_pro:cucumber

# Step for Minitest
bundle exec rake knapsack_pro:minitest

# Step for test-unit
bundle exec rake knapsack_pro:test_unit

# Step for Spinach
bundle exec rake knapsack_pro:spinach
```

  Please remember to define your API token in a global environment variable (e.g. `KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC` for RSpec).

  Here is an example of a [`.cirrus.yml` configuration file](https://cirrus-ci.org/examples/#ruby).
</div>

<div id="guide-provider-jenkins" className="hidden" markdown="1">

  ### Step for Jenkins

  <p>
    In order to run parallel jobs with Jenkins you should use Jenkins Pipeline.<br />
    You can learn more in this article: <a href="https://www.cloudbees.com/blog/parallelism-and-distributed-builds-jenkins" target="_blank">Parallelism and Distributed Builds with Jenkins</a>.
  </p>

  Here is an example of a `Jenkinsfile` working with Jenkins Pipeline.

```groovy
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

      // example: running cucumber tests in Knapsack Pro Regular Mode
      stage('Run cucumber') {
        sh """${knapsack_options} bundle exec rake knapsack_pro:cucumber"""
      }

      // example: running RSpec tests in Knapsack Pro Queue Mode
      // Queue Mode should be run as a last stage so it can help balance the build if tests in the Regular Mode were not perfectly distributed
      stage('Run rspec') {
        sh """KNAPSACK_PRO_CI_NODE_BUILD_ID=${env.BUILD_TAG} ${knapsack_options} bundle exec rake knapsack_pro:queue:rspec"""
      }
    }
  }
}

parallel nodes // run CI nodes in parallel
}
```

  Please remember to define your API token in a global environment variable (e.g. `KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC` for RSpec).

  <p>
    In the above example, we first run cucumber tests in the Regular Mode and then RSpec tests in the Queue Mode.
    Queue Mode assigns tests dynamically, so running it at the end helps balance the workload between the nodes.
  </p>
</div>

<div id="guide-provider-github-actions" className="hidden" markdown="1">

  ### Step for GitHub Actions

  You need to define a few things in your `.github/workflows/main.yaml` config file.

  - Set up your API token (e.g. `KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC`) in GitHub settings -> Secrets for your repository. ([More info](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository)).
  - You should create as many parallel jobs as you need with the [`matrix` property](https://help.github.com/en/articles/workflow-syntax-for-github-actions#jobsjob_idstrategymatrix). Use more parallel jobs for slow test suites.

Here is a full GitHub Actions config for a Ruby on Rails project:

```yaml
{% raw %}
# .github/workflows/main.yaml
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

  # https://help.github.com/en/articles/workflow-syntax-for-github-actions#jobsjob_idstrategymatrix
  strategy:
    fail-fast: false
    matrix:
      # [n] - where the n is a number of parallel jobs you want to run your tests on.
      # Use a higher number if you have slow tests to split them between more parallel jobs.
      # Remember to update the value of the `ci_node_index` below to (0..n-1).
      ci_node_total: [2]
      # Indexes for parallel jobs (starting from zero).
      # E.g. use [0, 1] for 2 parallel jobs, [0, 1, 2] for 3 parallel jobs, etc.
      ci_node_index: [0, 1]

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
        # if you use Knapsack Pro Queue Mode you must set below env variable
        # to be able to retry CI build and run previously recorded tests
        # https://github.com/KnapsackPro/knapsack_pro-ruby#knapsack_pro_fixed_queue_split-remember-queue-split-on-retry-ci-node
        KNAPSACK_PRO_FIXED_QUEUE_SPLIT: true
        # RSpec split test files by test examples feature - it's optional
        # https://knapsackpro.com/faq/question/how-to-split-slow-rspec-test-files-by-test-examples-by-individual-it
        # KNAPSACK_PRO_RSPEC_SPLIT_BY_TEST_EXAMPLES: true
      run: |
        # run tests in Knapsack Pro Regular Mode
        bundle exec rake knapsack_pro:rspec
        bundle exec rake knapsack_pro:cucumber
        bundle exec rake knapsack_pro:minitest
        bundle exec rake knapsack_pro:test_unit
        bundle exec rake knapsack_pro:spinach
        # you can use Knapsack Pro in Queue Mode once recorded first CI build with Regular Mode
        bundle exec rake knapsack_pro:queue:rspec
        bundle exec rake knapsack_pro:queue:cucumber
        bundle exec rake knapsack_pro:queue:minitest
{% endraw %}
```

  Github Actions uses the same build number if you restart a build. Because of that, you need to set [`KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true`](https://github.com/KnapsackPro/knapsack_pro-ruby#knapsack_pro_fixed_queue_split-remember-queue-split-on-retry-ci-node) in order to be able to restart a CI build in Queue Mode.

</div>

<div id="guide-provider-codefresh" className="hidden" markdown="1">

  ### Step for Codefresh

  You need to define a few things in your `.codefresh/codefresh.yml` config file.

  - Define an API token (e.g. `KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC`) in the Codefresh dashboard. See left menu <i>Pipelines -> settings (cog icon next to the pipeline) -> Variables tab (see a vertical menu on the right-hand side)</i>. Add a new API token there depending on the test runner you use:
    - `KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC`
    - `KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER`
    - `KNAPSACK_PRO_TEST_SUITE_TOKEN_MINITEST`
    - `KNAPSACK_PRO_TEST_SUITE_TEST_UNIT`
    - `KNAPSACK_PRO_TEST_SUITE_TOKEN_SPINACH`
  - Set the Codefresh YAML file path. In the Codefresh dashboard, see left menu *Pipelines -> settings (cog icon next to pipeline) -> Workflow tab (horizontal menu on the top) -> Path to YAML* (set: `./.codefresh/codefresh.yml`).
  - Define how many parallel jobs (parallel CI nodes) you want to run with the `KNAPSACK_PRO_CI_NODE_TOTAL` environment variable in the `.codefresh/codefresh.yml` file.
  - Ensure that in the `matrix` section, you listed all `KNAPSACK_PRO_CI_NODE_INDEX` environment variables with values from `0` to `KNAPSACK_PRO_CI_NODE_TOTAL-1`. Codefresh will generate a matrix of parallel jobs, with each job having a distinct value for the `KNAPSACK_PRO_CI_NODE_INDEX` variable. This is needed for Knapsack Pro to work correctly.

  Below you can find an example Codefresh YAML config and `Test.Dockerfile` used by Codefresh to run Ruby on Rails project with PostgreSQL in a Docker container.

  Add `.codefresh/codefresh.yml` and `Test.Dockerfile` files to your project repository.

```yaml
{% raw %}
# .codefresh/codefresh.yml
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
    # set how many parallel jobs you want to run
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
  matrix:
    environment:
      # please ensure you list indexes from 0 to N-1,
      # where N is the value of KNAPSACK_PRO_CI_NODE_TOTAL
      - KNAPSACK_PRO_CI_NODE_INDEX=0
      - KNAPSACK_PRO_CI_NODE_INDEX=1
  commands:
    - bin/rails db:prepare

    # run tests in Knapsack Pro Regular Mode
    - bundle exec rake knapsack_pro:rspec
    - bundle exec rake knapsack_pro:cucumber
    - bundle exec rake knapsack_pro:minitest
    - bundle exec rake knapsack_pro:test_unit
    - bundle exec rake knapsack_pro:spinach

    # you can use Knapsack Pro in Queue Mode once you recorded the CI build in the Regular Mode
    - bundle exec rake knapsack_pro:queue:rspec
    - bundle exec rake knapsack_pro:queue:cucumber
    - bundle exec rake knapsack_pro:queue:minitest
{% endraw %}
```

```yaml
# Test.Dockerfile
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
</div>

<div id="guide-provider-other" className="hidden" markdown="1">

  ### Step for other CI providers

  <p>
    Set the following global variables on your CI server.
  </p>

  <p>
    The CI server's git installation will be used to determine the branch name and current commit hash (those values are needed for Knapsack Pro).
  </p>

```bash
KNAPSACK_PRO_REPOSITORY_ADAPTER=git
```

  <p>
    The path to the project repository on your CI server, for instance:
  </p>

```bash
KNAPSACK_PRO_PROJECT_DIR=/home/ubuntu/my-app-repository
```

  <p>
    You can <a href="https://github.com/KnapsackPro/knapsack_pro-ruby#repository-adapter-how-to-set-up-3-of-3" target="_blank">learn more about those variables here</a> and see what to do when you don't use git.
  </p>

  ### Set API token

  <p>
    You must set a separate API token on your CI server for each test suite you use:
  </p>

```bash
KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC
```

  <p>
    You can generate more API tokens in your <a href="https://knapsackpro.com/dashboard" target="_blank">Knapsack Pro User Dashboard</a>
  </p>

  ### Run tests on your CI servers

  <p>
    You need to configure a command responsible for running tests on each CI node.<br />
    Let's assume you have 2 CI nodes. Here are the commands you need to run for each CI node.
  </p>

  <p>
    Step for RSpec
  </p>

```bash
# Command for the first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:rspec

# Command for the second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:rspec
```

  <p>
    Step for Minitest
  </p>

```bash
# Command for the first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:minitest

# Command for the second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:minitest
```

  <p>
    Step for test-unit
  </p>

```bash
# Command for the first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:test_unit

# Command for the second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:test_unit
```

  <p>
    Step for Cucumber
  </p>

```bash
# Command for the first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:cucumber

# Command for the second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:cucumber
```

  <p>
    Step for spinach
  </p>

```bash
# Command for the first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:spinach

# Command for the second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:spinach
```

  <p>
    If you have more CI nodes, then update accordingly:
  </p>

```plain
KNAPSACK_PRO_CI_NODE_TOTAL - the total number of your CI nodes
KNAPSACK_PRO_CI_NODE_INDEX - the index of each CI node (starting from 0)
```
</div>
</div>

<div id="guide-final-step" className="hidden" markdown="1">

  ### Verify that everything works in Regular Mode (step 1 out of 3)

  <p>
    You are now ready to use the gem!
  </p>

  <p>
    Please push a new commit to your repository so that the knapsack_pro gem records the execution time of your test suite.
    Note that the first run will not be optimal because knapsack_pro needs first to record execution data.
  </p>

  <p>
    Visit the <a href="https://knapsackpro.com/dashboard" target="_blank">user dashboard</a> and click the <b>Show build metrics</b> button next to your API token. Click <b>Show</b> on the new build and ensure the data from all of your CI nodes has been recorded. You should see a confirmation that all of your parallel nodes have finished their work.
  </p>

  <p>
    <strong>The next test suite run on your CI will be parallelized optimally if the previous one has been recorded correctly.</strong>
  </p>

  ### Consider using the Queue Mode to balance work dynamically across CI nodes (step 2 out of 3)

  <p>
    Once you confirm the knapsack_pro Regular Mode works and your tests are green, you may want to <a href="https://github.com/KnapsackPro/knapsack_pro-ruby#queue-mode" target="_blank">learn about Queue Mode and how to use it</a>.
  </p>

  **Please ensure you explicitly set `RAILS_ENV=test` on your CI nodes. You can add this setting to your CI environment variables configuration. It is needed for the Queue Mode to run correctly.**

```bash
# Example command for the Regular Mode in RSpec
bundle exec rake knapsack_pro:rspec

# Example command for the Queue Mode in RSpec >= 3.x
bundle exec rake knapsack_pro:queue:rspec

# Example command for the Queue Mode in Minitest
bundle exec rake knapsack_pro:queue:minitest

# Example command for the Queue Mode in Cucumber
# If you use the spring gem and spring-commands-cucumber gem to start Cucumber tests faster, please set:
# export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bundle exec spring
# or alternatively you can use spring binstub:
# export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bin/spring
# Thanks to that, Cucumber will start tests faster for each batch of tests fetched from the Knapsack Pro Queue API
bundle exec rake knapsack_pro:queue:cucumber
```

  We recommend using the Regular Mode first in order to record execution data for your project. You could also use the Queue Mode to do that, but it will be much slower when recording your first build. Please ensure your tests are green in the Regular Mode and there are no order-dependent test failures before trying the Queue Mode.

  **Note for the Queue Mode:** if you use a CI provider that allows you to just retry a single CI node (for instance, Travis CI allows this when tests fail only on one of the parallel CI nodes), or when you use CI nodes on servers that can be killed during runtime (for instance using Buildkite with Amazon EC2 Spot Instances/Google Cloud Preemptible that can be preempted during CI run), then in the Queue Mode you need to set the [`KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true`](https://github.com/KnapsackPro/knapsack_pro-ruby#knapsack_pro_fixed_queue_split-remember-queue-split-on-retry-ci-node) flag in order to handle this correctly.

  **An important step for CI providers that allow retrying single failed CI nodes (like Buildkite)**: See [the required CI configuration if you retry single failed CI nodes on your CI server](https://github.com/KnapsackPro/knapsack_pro-ruby#required-ci-configuration-if-you-use-retry-single-failed-ci-node-feature-on-your-ci-server-when-knapsack_pro_fixed_queue_splittrue-in-queue-mode-or-knapsack_pro_fixed_test_suite_splittrue-in-regular-mode) when using the `KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true` (for the Queue Mode) or the `KNAPSACK_PRO_FIXED_TEST_SUITE_SPLIT=true` setting (for the Regular Mode).

  **Common problems with the Queue Mode**: If you notice any test failures for RSpec when using the knapsack\_pro Queue Mode, then it means that your test suite needs to be adjusted for using the `RSpec::Core::Runner` multiple times (which is what the Queue Mode does). Please see our [FAQ entry for common Queue Mode problems](https://knapsackpro.com/faq/question/why-when-i-use-queue-mode-for-rspec-then-my-tests-fail).

  If you think your problem is not covered there, please [contact us](https://knapsackpro.com/contact). We've seen many projects and realize that each test suite might introduce different edge cases that sometimes make RSpec fail. We'll be happy to help you debug yours!

  <p>
    You can learn more about custom configuration and other <a href="https://knapsackpro.com/features" target="_blank">features</a> from the <a href="https://github.com/KnapsackPro/knapsack_pro-ruby#table-of-contents" target="_blank">documentation</a>.
    If you have any problems, please check our <a href="https://knapsackpro.com/faq" target="_blank">FAQ</a>.
  </p>

  <p>
    Many people look for information on using the <a href="https://knapsackpro.com/faq/question/how-to-use-junit-formatter" target="_blank">junit formatter</a> with RSpec or Cucumber or how to use <a href="https://knapsackpro.com/faq/question/how-to-use-codeclimate-with-knapsack_pro" target="_blank">CodeClimate</a> or <a href="https://knapsackpro.com/faq/question/how-to-use-simplecov-in-queue-mode" target="_blank">SimpleCov</a> with the knapsack_pro gem.
  </p>

  <p>
    Feel free to <a href="https://knapsackpro.com/contact" target="_blank">reach out</a> if you need any help.
  </p>

  ### How to split slow test files across parallel CI nodes (step 3 out of 3)

  <p>
    If your test suite has very slow test files then the <a href="https://github.com/KnapsackPro/knapsack_pro-ruby#split-test-files-by-test-cases" target="_blank">slowest test files can be split across parallel CI nodes automatically by the knapsack_pro gem</a>. This works both in the Regular Mode and the Queue Mode.
  </p>

```bash
# enable split by test examples for the slowest RSpec test files
KNAPSACK_PRO_RSPEC_SPLIT_BY_TEST_EXAMPLES=true
```

  <p>
    If you'd like to limit the debug logs produced by the knapsack_pro gem, you can change the log level to:
  </p>

```bash
KNAPSACK_PRO_LOG_LEVEL=info
```

  <p>You can learn more <a href="https://knapsackpro.com/faq/question/how-can-i-change-log-level" target="_blank">here</a>.</p>

  ### Most popular FAQ entries

  <p>
    You can find all entries in the <a href="https://knapsackpro.com/faq" target="_blank">FAQ</a>. The following are the most popular things developers ask about.
  </p>

  <ul>
    <li><a href="https://knapsackpro.com/faq/question/why-when-i-use-queue-mode-for-rspec-then-my-tests-fail" target="_blank">RSpec tests failing in the Queue Mode</a></li>
    <li><a href="https://github.com/KnapsackPro/knapsack_pro-ruby#knapsack_pro_fixed_queue_split-remember-queue-split-on-retry-ci-node" target="_blank">Retrying a single failed CI node in the Queue Mode</a> - If your CI provider allows retrying just a single CI node, then you should set KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true to allow Knapsack Pro to remember what tests were executed on the particular CI node.</li>
    <li><a href="https://knapsackpro.com/faq/question/why-knapsack_pro-hangs--freezes--is-stale-ie-for-codeship-in-queue-mode" target="_blank">CI tests output freezing</a></li>
    <li><a href="https://knapsackpro.com/faq/question/how-to-use-junit-formatter" target="_blank">Using JUnit formatter with Knapsack Pro</a></li>
    <li><a href="https://knapsackpro.com/faq/question/how-to-use-simplecov-in-queue-mode" target="_blank">Using simplecov in the Queue Mode</a></li>
    <li><a href="https://knapsackpro.com/faq/question/how-to-use-codeclimate-with-knapsack_pro" target="_blank">Using CodeClimate with Knapsack Pro</a></li>
    <li><a href="https://github.com/KnapsackPro/knapsack_pro-ruby#test-file-names-encryption" target="_blank">Encrypting test file names for Ruby tests</a></li>
    <li><a href="https://knapsackpro.com/faq/question/what-data-is-sent-to-your-servers" target="_blank">Questions around data usage and security</a> - Knapsack Pro does not have access to your project source code. It collects only branch names, git commit hashes and test file paths along with their execution time.</li>
    <li><a href="https://knapsackpro.com/faq/question/how-can-i-run-tests-from-multiple-directories" target="_blank">Running selected tests based on a pattern</a> - set the KNAPSACK_PRO_TEST_FILE_PATTERN instead of passing the --pattern option to RSpec</li>
    <li><a href="https://knapsackpro.com/faq/question/how-to-run-a-specific-list-of-test-files-or-only-some-tests-from-test-file" target="_blank">Running a specific list of test files or only some test examples</a></li>
    <li><a href="https://knapsackpro.com/faq/question/how-to-exclude-tests-from-running-them" target="_blank">Excluding selected tests</a></li>
  </ul>
</div>
