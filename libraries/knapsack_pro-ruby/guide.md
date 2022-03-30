---
layout: page
title: Installation guide for ruby gem knapsack_pro
permalink: /knapsack_pro-ruby/guide/
---
<script src="/javascripts/knapsack_pro-ruby/guide.js?version=1"></script>

You can find more detailed information and configuration options in the [README for the knapsack_pro gem](https://github.com/KnapsackPro/knapsack_pro-ruby).<br>
[Create an account at Knapsack Pro to use the knapsack_pro gem](http://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=page&utm_campaign=knapsack_pro-ruby_gem&utm_content=installation_guide)

## Installation

Add the following code to your application's `Gemfile`:

{% highlight ruby %}
group :test, :development do
  gem 'knapsack_pro'
end
{% endhighlight %}

And then execute:

{% highlight bash %}
bundle install
{% endhighlight %}


If you are not using Rails, then add this line at the bottom of your `Rakefile`:

{% highlight ruby %}
# Only needed if you are not using Rails.
KnapsackPro.load_tasks if defined?(KnapsackPro)
{% endhighlight %}

## Questions

Please answer the following questions to get the basic `knapsack_pro` configuration for your project.

<p>
  <strong>Choose your testing tools:</strong>
  <ul class="none-list">
    <li><label><input type="checkbox" id="test-runner-rspec" /> RSpec</label></li>
    <li><label><input type="checkbox" id="test-runner-cucumber" /> Cucumber</label></li>
    <li><label><input type="checkbox" id="test-runner-minitest" /> Minitest</label></li>
    <li><label><input type="checkbox" id="test-runner-spinach" /> Spinach</label></li>
    <li><label><input type="checkbox" id="test-runner-test-unit" /> test-unit</label></li>
  </ul>
</p>

<p>
  <strong>Do you use VCR, WebMock, or FakeWeb gem?</strong><br>
  <label><input type="checkbox" id="vcr-webmock-fakeweb" /> Yes</label>
</p>

<p>
  <strong>What is your CI provider?</strong>
  <ul class="none-list">
    <li><label><input type="radio" name="ci-provider" value="appveyor"> AppVeyor</label></li>
    <li><label><input type="radio" name="ci-provider" value="buildkite"> Buildkite</label></li>
    <li><label><input type="radio" name="ci-provider" value="circleci"> CircleCI</label></li>
    <li><label><input type="radio" name="ci-provider" value="cirrus-ci"> Cirrus CI</label></li>
    <li><label><input type="radio" name="ci-provider" value="codeship"> CloudBees CodeShip</label></li>
    <li><label><input type="radio" name="ci-provider" value="codefresh"> Codefresh</label></li>
    <li><label><input type="radio" name="ci-provider" value="github-actions"> GitHub Actions</label></li>
    <li><label><input type="radio" name="ci-provider" value="gitlab-ci"> GitLab CI</label></li>
    <li><label><input type="radio" name="ci-provider" value="heroku-ci"> Heroku CI</label></li>
    <li><label><input type="radio" name="ci-provider" value="jenkins"> Jenkins</label></li>
    <li><label><input type="radio" name="ci-provider" value="semaphoreci"> Semaphore CI</label></li>
    <li><label><input type="radio" name="ci-provider" value="travis-ci"> Travis CI</label></li>
    <li><label><input type="radio" name="ci-provider" value="other"> other</label></li>
  </ul>
</p>

<div id="guide-test-runner-rspec" class="hidden">
  <h3>Step for RSpec</h3>

  <p markdown="1">
    Add the following code at the beginning of your `spec/rails_helper.rb` or `spec/spec_helper.rb`:
  </p>

{% highlight ruby %}
require 'knapsack_pro'
KnapsackPro::Adapters::RSpecAdapter.bind
{% endhighlight %}
</div>

<div id="guide-test-runner-minitest" class="hidden">
  <h3>Step for Minitest</h3>

  <p markdown="1">
    Add the following code at the beginning of your `test/test_helper.rb`:
  </p>

{% highlight ruby %}
require 'knapsack_pro'
knapsack_pro_adapter = KnapsackPro::Adapters::MinitestAdapter.bind
knapsack_pro_adapter.set_test_helper_path(__FILE__)
{% endhighlight %}
</div>

<div id="guide-test-runner-test-unit" class="hidden">
  <h3>Step for test-unit</h3>

  <p markdown="1">
    Add the following code at the beginning of your `test/test_helper.rb`:
  </p>

{% highlight ruby %}
require 'knapsack_pro'
knapsack_pro_adapter = KnapsackPro::Adapters::TestUnitAdapter.bind
knapsack_pro_adapter.set_test_helper_path(__FILE__)
{% endhighlight %}
</div>

<div id="guide-test-runner-cucumber" class="hidden">
  <h3>Step for Cucumber</h3>

  <p markdown="1">
    Create a `features/support/knapsack_pro.rb` file with the following code:
  </p>

{% highlight ruby %}
require 'knapsack_pro'
KnapsackPro::Adapters::CucumberAdapter.bind
{% endhighlight %}
</div>

<div id="guide-test-runner-spinach" class="hidden">
  <h3>Step for Spinach</h3>

  <p markdown="1">
    Create a `features/support/knapsack_pro.rb` file with the following code:
  </p>

{% highlight ruby %}
require 'knapsack_pro'
KnapsackPro::Adapters::SpinachAdapter.bind
{% endhighlight %}
</div>

<div id="guide-vcr-webmock-fakeweb" class="hidden">
  <h3>Step for VCR/WebMock/FakeWeb gems</h3>

<p markdown="1">
  Add Knapsack Pro API subdomain to ignored hosts in `spec/spec_helper.rb` (or wherever your VCR configuration is located):
</p>

{% highlight ruby %}
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
{% endhighlight %}

<p markdown="1">
  Ensure you have the `require: false` setting in Gemfile for the webmock gem when VCR is hooked into it. Thanks to that, the webmock configuration from `spec_helper.rb` is loaded properly.
</p>

{% highlight ruby %}
group :test do
  gem 'vcr'
  gem 'webmock', require: false
  gem 'fakeweb', require: false # example when you use fakeweb
end
{% endhighlight %}

<p markdown="1">
  If you still happen to see your tests failing due to WebMock not allowing requests to Knapsack Pro API, it probably means that you reconfigure WebMock in some of your tests.
  For instance, you might be using `WebMock.reset!`. It might also be called automatically in an `after(:each)` block when using `require 'webmock/rspec'` (<a href="https://github.com/bblimke/webmock/issues/484#issuecomment-116193449" target="_blank">more about the issue</a>). This would remove `api.knapsackpro.com` from the allowed domains. In this case, please try the following:
</p>

{% highlight ruby %}
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
{% endhighlight %}

</div>

<div id="guide-providers">
  <div id="guide-provider-circleci" class="hidden">
    <h3>Step for CircleCI</h3>

    <p>
      Example config file for the CircleCI 2.0 platform.
    </p>

{% highlight yaml %}
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
{% endhighlight %}

    <p markdown="1">
      Adjust the number of parallel containers with the `parallelism` attribute.<br>
      Please consult a full example of <a href="/2017/circleci-2-0-capybara-feature-specs-selenium-webdriver-with-chrome-headless" target="_blank">Rails project config on CircleCI 2.0</a> for more details.
    </p>

    <p>
      If you use knapsack_pro Queue Mode with CircleCI, you may want to collect metadata like <a href="https://github.com/KnapsackPro/knapsack_pro-ruby#circleci-and-knapsack_pro-queue-mode" target="_blank">junit xml report about your RSpec</a> test suite with junit formatter. Thanks to that, you can see failed tests in the nice CircleCI web UI. It's also possible to <a href="https://knapsackpro.com/faq/question/how-to-use-junit-formatter" target="_blank">configure junit formatter for knapsack_pro Regular Mode</a>.
    </p>

    <p>
      Please remember to add additional containers for your project in CircleCI settings.
    </p>
  </div>

  <div id="guide-provider-travis-ci" class="hidden">
    <h3>Step for Travis CI</h3>

    <p markdown="1">
      You can parallelize your builds across virtual machines with the <a href="http://docs.travis-ci.com/user/speeding-up-the-build/#parallelizing-your-builds-across-virtual-machines" target="_blank">travis matrix feature</a>. Edit your config in the `.travis.yml` file.
    </p>

{% highlight yaml %}
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
{% endhighlight %}

    <p>
      This configuration will generate a matrix with the following 2 env rows:
    </p>

{% highlight bash %}
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=rspec-token KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=cucumber-token KNAPSACK_PRO_TEST_SUITE_TOKEN_MINITEST=minitest-token KNAPSACK_PRO_TEST_SUITE_TOKEN_TEST_UNIT=test-unit-token KNAPSACK_PRO_TEST_SUITE_TOKEN_SPINACH=spinach-token
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=rspec-token KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=cucumber-token KNAPSACK_PRO_TEST_SUITE_TOKEN_MINITEST=minitest-token KNAPSACK_PRO_TEST_SUITE_TOKEN_TEST_UNIT=test-unit-token KNAPSACK_PRO_TEST_SUITE_TOKEN_SPINACH=spinach-token
{% endhighlight %}

    <p>
      You can find more info about global and matrix env configuration in <a href="https://docs.travis-ci.com/user/customizing-the-build/#build-matrix" target="_blank">travis docs</a>.
    </p>
  </div>

  <div id="guide-provider-buildkite" class="hidden">
    <h3>Step for Buildkite</h3>

    <p markdown="1">
      Knapsack Pro automatically reads the Buildkite ENV variables: `BUILDKITE_PARALLEL_JOB_COUNT` and `BUILDKITE_PARALLEL_JOB`. The only thing you need to do is to configure the `parallelism` parameter in your build step and run the appropriate command in your build:
    </p>

{% highlight bash %}
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
{% endhighlight %}

    <p markdown="1">
      Please remember to set up your `KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC` as a global environment variable.
    </p>

    <p>
      Here you can find an article showing <a href="http://docs.knapsackpro.com/2017/auto-balancing-7-hours-tests-between-100-parallel-jobs-on-ci-buildkite-example" target="_blank">how to set up a new pipeline for your project in Buildkite and configure Knapsack Pro</a>. You can also check out the following example repositories for Ruby/Rails projects:
    </p>

    <ul>
      <li><a href="https://github.com/KnapsackPro/buildkite-rails-parallel-example-with-knapsack_pro" target="_blank">Buildkite Rails Parallel Example with Knapsack Pro</a></li>
      <li><a href="https://github.com/KnapsackPro/buildkite-rails-docker-parallel-example-with-knapsack_pro" target="_blank">Buildkite Rails Docker Parallel Example with Knapsack Pro</a></li>
    </ul>

    <p markdown="1">
      If you want to retry single Buildkite agents (CI nodes), then you should set <a href="https://github.com/KnapsackPro/knapsack_pro-ruby#knapsack_pro_fixed_queue_split-remember-queue-split-on-retry-ci-node" target="_blank">`KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true`</a>.
    </p>

    <p markdown="1">
      When using the `docker-compose` plugin on Buildkite, you have to pass some environment variables to the docker container. This is needed for Knapsack Pro to work correctly:
    </p>

{% highlight yaml %}
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
{% endhighlight %}

  </div>

  <div id="guide-provider-semaphoreci" class="hidden">
    <h3>Step for Semaphore CI</h3>

    <h4>Semaphore 2.0 <small>(<a href="#semaphore_1_0">click here for Semaphore 1.0</a>)</small></h4>


    <p markdown="1">
      Knapsack Pro supports environment variables provided by Semaphore CI 2.0 to run your tests. You need to define a few things in the `.semaphore/semaphore.yml` config file.
    </p>

    <ul>
      <li><p markdown="1">You need to set `KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC`. If you don't want to commit secrets in the yml file, you can <a href="https://docs.semaphoreci.com/article/66-environment-variables-and-secrets" target="_blank" rel="nofollow">follow this guide</a>.</p></li>
      <li>You should create as many parallel jobs as you need with the <i>parallelism</i> property. Use more parallel jobs for long test suites.</li>
    </ul>

    <p>
      Full Semaphore CI 2.0 config example for a Rails project:
    </p>

{% highlight yaml %}
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
{% endhighlight %}

    <h4 id="semaphore_1_0">Semaphore 1.0</h4>

    <p markdown="1">
      Run the proper `knapsack_pro` command for as many threads as you need. Here is an example:
    </p>

{% highlight bash %}
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
{% endhighlight %}

    <p>Your tests will be divided across threads.</p>

    <p markdown="1">Please remember to set up the `KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC` token as a global environment variable.</p>
  </div>


  <div id="guide-provider-codeship" class="hidden">
    <h3>Step for CloudBees CodeShip</h3>

    <p markdown="1">
      You need to define a `KNAPSACK_PRO_CI_NODE_TOTAL` and `KNAPSACK_PRO_CI_NODE_INDEX` environment variables for each <a href="https://documentation.codeship.com/basic/builds-and-configuration/parallel-tests/#using-parallel-test-pipelines" target="_blank">parallel test pipeline</a>. Here is an example for 2 pipelines.
    </p>

    <p>First pipeline:</p>

{% highlight bash %}
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
{% endhighlight %}

    <p>Second pipeline:</p>

{% highlight bash %}
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
{% endhighlight %}

    <p markdown="1">
      Remember to define API tokens as `KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER` and `KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC` on the <i>Environment</i> page of your project settings in CodeShip.
    </p>

    <p markdown="1">
      CodeShip uses the same build number if you restart a build. Because of that, you need to set <a href="https://github.com/KnapsackPro/knapsack_pro-ruby#knapsack_pro_fixed_queue_split-remember-queue-split-on-retry-ci-node" target="_blank">`KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true`</a> in order to be able to restart a CI build in Queue Mode.
    </p>
    </div>

  <div id="guide-provider-heroku-ci" class="hidden">
    <h3>Step for Heroku CI</h3>

    <p markdown="1">
      You can parallelize your tests on Heroku CI using the `app.json` file.
    </p>

    <p markdown="1">
      You can set the number of parallel dynos you want to run with the `quantity` value.
      Use the `test` key to run Knapsack Pro.
    </p>

    <p markdown="1">
      You also need to specify the environment variable with an API token for Knapsack Pro.
      This should not be stored directly in the `app.json`, so you can add them to your pipeline's Heroku CI settings (we show it below in the config for illustrative purposes).
    </p>

{% highlight json %}
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
{% endhighlight %}

    <p>
      Please see this article if you would like to <a href="https://knapsackpro.com/faq/question/how-to-run-multiple-test-suite-commands-in-heroku-ci" target="_blank">run multiple Knapsack Pro commands for different test runners on Heroku CI</a>.
    </p>

    <p>
      You can learn more about <a href="https://devcenter.heroku.com/articles/heroku-ci" target="_blank">Heroku CI</a>.
    </p>

  </div>

  <div id="guide-provider-appveyor" class="hidden">
    <h3>Step for AppVeyor</h3>

    <p markdown="1">
      You need to define `KNAPSACK_PRO_CI_NODE_TOTAL` and `KNAPSACK_PRO_CI_NODE_INDEX` variables for each parallel job running as part of the same CI build.
    </p>

{% highlight bash %}
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
{% endhighlight %}

    <p markdown="1">
    Please remember to define your API token in the `KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC` global environment variable.
    </p>
  </div>

  <div id="guide-provider-gitlab-ci" class="hidden">
    <h3>Step for GitLab CI</h3>

    <p markdown="1">
      Remember to add your API tokens as env variables (e.g. `KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER` or `KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC`) to <a href="https://gitlab.com/help/ci/variables/README.md#secret-variables" target="_blank">Secret Variables</a> in GitLab CI Settings -> CI/CD Pipelines -> Secret Variables.
    </p>

    <h4>GitLab CI >= 11.5</h4>

{% highlight yaml %}
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
{% endhighlight %}

    <p>
      Find out <a href="https://docs.gitlab.com/ee/ci/yaml/#parallel" target="_blank">how to configure running parallel CI nodes in GitLab</a>.
    </p>

  <h4>GitLab CI &lt; 11.5 (old GitLab CI)</h4>

    <p markdown="1">
      You need to define `KNAPSACK_PRO_CI_NODE_TOTAL` and `KNAPSACK_PRO_CI_NODE_INDEX` environment variables for each parallel job running as part of the same test stage. Here is a relevant part of the `.gitlab-ci.yml` configuration file for 2 parallel jobs:
    </p>

{% highlight yaml %}
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
{% endhighlight %}
  </div>


  <div id="guide-provider-cirrus-ci" class="hidden">
    <h3>Step for Cirrus CI</h3>

    <p>
      You need to configure running your desired number of parallel CI nodes in Cirrus. Then, make sure you run one of the following commands on each parallel CI node:
    </p>

{% highlight bash %}
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
{% endhighlight %}

    <p markdown="1">
      Please remember to define your API token in a global environment variable (e.g. `KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC` for RSpec).
    </p>

    <p markdown="1">
      Here is an example of a <a href="https://cirrus-ci.org/examples/#ruby" target="_blank">`.cirrus.yml` configuration file</a>.
    </p>
  </div>

  <div id="guide-provider-jenkins" class="hidden">
    <h3>Step for Jenkins</h3>

    <p>
      In order to run parallel jobs with Jenkins you should use Jenkins Pipeline.<br>
      You can learn more in this article: <a href="https://www.cloudbees.com/blog/parallelism-and-distributed-builds-jenkins" target="_blank">Parallelism and Distributed Builds with Jenkins</a>.
    </p>

    <p markdown="1">
      Here is an example of a `Jenkinsfile` working with Jenkins Pipeline.
    </p>

{% highlight groovy %}
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
{% endhighlight %}

    <p markdown="1">
      Please remember to define your API token in a global environment variable (e.g. `KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC` for RSpec).
    </p>

    <p>
      In the above example, we first run cucumber tests in the Regular Mode and then RSpec tests in the Queue Mode.
      Queue Mode assigns tests dynamically, so running it at the end helps balance the workload between the nodes.
    </p>
  </div>

  <div id="guide-provider-github-actions" class="hidden">
    <h3>Step for GitHub Actions</h3>

    <p markdown="1">
      You need to define a few things in your `.github/workflows/main.yaml` config file.
    </p>

    <ul>
      <li><p markdown="1">Set up your API token (e.g. `KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC`) in GitHub settings -> Secrets for your repository. (<a href="https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository" target="_blank" rel="nofollow">More info</a>).</p></li>
      <li><p markdown="1">You should create as many parallel jobs as you need with the <a href="https://help.github.com/en/articles/workflow-syntax-for-github-actions#jobsjob_idstrategymatrix" target="_blank" rel="nofollow">`matrix` property</a>. Use more parallel jobs for slow test suites.</p></li>
    </ul>

    <p>
      Here is a full GitHub Actions config for a Ruby on Rails project:
    </p>

{% highlight yaml %}
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
{% endhighlight %}

    <p markdown="1">
      Github Actions uses the same build number if you restart a build. Because of that, you need to set <a href="https://github.com/KnapsackPro/knapsack_pro-ruby#knapsack_pro_fixed_queue_split-remember-queue-split-on-retry-ci-node" target="_blank">`KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true`</a> in order to be able to restart a CI build in Queue Mode.
    </p>

  </div>

  <div id="guide-provider-codefresh" class="hidden">
    <h3>Step for Codefresh</h3>

    <p markdown="1">
      You need to define a few things in your `.codefresh/codefresh.yml` config file.
    </p>

    <ul>
      <li>
        <span markdown="1">
          Define an API token (e.g. `KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC`) in the Codefresh dashboard. See left menu <i>Pipelines -> settings (cog icon next to the pipeline) -> Variables tab (see a vertical menu on the right-hand side)</i>. Add a new API token there depending on the test runner you use:
        </span>
          <ul>
            <li><span markdown="1">`KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC`</span></li>
            <li><span markdown="1">`KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER`</span></li>
            <li><span markdown="1">`KNAPSACK_PRO_TEST_SUITE_TOKEN_MINITEST`</span></li>
            <li><span markdown="1">`KNAPSACK_PRO_TEST_SUITE_TEST_UNIT`</span></li>
            <li><span markdown="1">`KNAPSACK_PRO_TEST_SUITE_TOKEN_SPINACH`</span></li>
          </ul>
      </li>
      <li>
        <span markdown="1">
          Set the Codefresh YAML file path. In the Codefresh dashboard, see left menu <i>Pipelines -> settings (cog icon next to pipeline) -> Workflow tab (horizontal menu on the top) -> Path to YAML</i> (set: `./.codefresh/codefresh.yml`).
        </span>
      </li>
      <li>
        <span markdown="1">
          Define how many parallel jobs (parallel CI nodes) you want to run with the `KNAPSACK_PRO_CI_NODE_TOTAL` environment variable in the `.codefresh/codefresh.yml` file.
        </span>
      </li>
      <li>
        <span markdown="1">
          Ensure that in the `matrix` section, you listed all `KNAPSACK_PRO_CI_NODE_INDEX` environment variables with values from `0` to `KNAPSACK_PRO_CI_NODE_TOTAL-1`. Codefresh will generate a matrix of parallel jobs, with each job having a distinct value for the `KNAPSACK_PRO_CI_NODE_INDEX` variable. This is needed for Knapsack Pro to work correctly.
        </span>
      </li>
    </ul>

    <p markdown="1">
      Below you can find an example Codefresh YAML config and `Test.Dockerfile` used by Codefresh to run Ruby on Rails project with PostgreSQL in a Docker container.
    </p>

    <p markdown="1">
      Add `.codefresh/codefresh.yml` and `Test.Dockerfile` files to your project repository.
    </p>

{% highlight yaml %}
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
{% endhighlight %}

{% highlight yaml %}
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
{% endhighlight %}
  </div>

  <div id="guide-provider-other" class="hidden">
    <h3>Step for other CI providers</h3>

    <p>
      Set the following global variables on your CI server.
    </p>

    <p>
      The CI server's git installation will be used to determine the branch name and current commit hash (those values are needed for Knapsack Pro).
    </p>

{% highlight bash %}
KNAPSACK_PRO_REPOSITORY_ADAPTER=git
{% endhighlight %}

    <p>
      The path to the project repository on your CI server, for instance:
    </p>

{% highlight bash %}
KNAPSACK_PRO_PROJECT_DIR=/home/ubuntu/my-app-repository
{% endhighlight %}

    <p>
      You can <a href="https://github.com/KnapsackPro/knapsack_pro-ruby#repository-adapter-how-to-set-up-3-of-3" target="_blank">learn more about those variables here</a> and see what to do when you don't use git.
    </p>

    <h3>Set API token</h3>

    <p>
      You must set a separate API token on your CI server for each test suite you use:
    </p>

{% highlight bash %}
KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC
{% endhighlight %}

    <p>
      You can generate more API tokens in your <a href="https://knapsackpro.com/dashboard" target="_blank">Knapsack Pro User Dashboard</a>
    </p>

    <h3>
      Run tests on your CI servers
    </h3>

    <p>
      You need to configure a command responsible for running tests on each CI node.<br>
      Let's assume you have 2 CI nodes. Here are the commands you need to run for each CI node.
    </p>

    <p>
      Step for RSpec
    </p>

{% highlight bash %}
# Command for the first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:rspec

# Command for the second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:rspec
{% endhighlight %}

    <p>
      Step for Minitest
    </p>

{% highlight bash %}
# Command for the first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:minitest

# Command for the second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:minitest
{% endhighlight %}

    <p>
      Step for test-unit
    </p>

{% highlight bash %}
# Command for the first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:test_unit

# Command for the second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:test_unit
{% endhighlight %}

    <p>
      Step for Cucumber
    </p>

{% highlight bash %}
# Command for the first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:cucumber

# Command for the second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:cucumber
{% endhighlight %}

    <p>
      Step for spinach
    </p>

{% highlight bash %}
# Command for the first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:spinach

# Command for the second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:spinach
{% endhighlight %}

    <p>
      If you have more CI nodes, then update accordingly:
    </p>

{% highlight plain %}
KNAPSACK_PRO_CI_NODE_TOTAL - the total number of your CI nodes
KNAPSACK_PRO_CI_NODE_INDEX - the index of each CI node (starting from 0)
{% endhighlight %}
  </div>
</div>

<div id="guide-final-step" class="hidden">
  <h3>
    Verify that everything works in Regular Mode (step 1 out of 3)
  </h3>

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

  <h3>
    Consider using the Queue Mode to balance work dynamically across CI nodes (step 2 out of 3)
  </h3>

  <p>
    Once you confirm the knapsack_pro Regular Mode works and your tests are green, you may want to <a href="https://github.com/KnapsackPro/knapsack_pro-ruby#queue-mode" target="_blank">learn about Queue Mode and how to use it</a>.
  </p>

  <p markdown="1">
    <strong>Please ensure you explicitly set `RAILS_ENV=test` on your CI nodes. You can add this setting to your CI environment variables configuration. It is needed for the Queue Mode to run correctly.</strong>
  </p>

{% highlight bash %}
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
{% endhighlight %}

  <p>
    We recommend using the Regular Mode first in order to record execution data for your project. You could also use the Queue Mode to do that, but it will be much slower when recording your first build. Please ensure your tests are green in the Regular Mode and there are no order-dependent test failures before trying the Queue Mode.
  </p>

  <p markdown="1">
    <strong>Note for the Queue Mode:</strong> if you use a CI provider that allows you to just retry a single CI node (for instance, Travis CI allows this when tests fail only on one of the parallel CI nodes), or when you use CI nodes on servers that can be killed during runtime (for instance using Buildkite with Amazon EC2 Spot Instances/Google Cloud Preemptible that can be preempted during CI run), then in the Queue Mode you need to set the <a href="https://github.com/KnapsackPro/knapsack_pro-ruby#knapsack_pro_fixed_queue_split-remember-queue-split-on-retry-ci-node" target="_blank"><b>`KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true`</b></a> flag in order to handle this correctly.
  </p>

  <p markdown="1">
    <strong>An important step for CI providers that allow retrying single failed CI nodes (like Buildkite)</strong>: See <a href="https://github.com/KnapsackPro/knapsack_pro-ruby#required-ci-configuration-if-you-use-retry-single-failed-ci-node-feature-on-your-ci-server-when-knapsack_pro_fixed_queue_splittrue-in-queue-mode-or-knapsack_pro_fixed_test_suite_splittrue-in-regular-mode" target="_blank">the required CI configuration if you retry single failed CI nodes on your CI server</a> when using the `KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true` (for the Queue Mode) or the `KNAPSACK_PRO_FIXED_TEST_SUITE_SPLIT=true` setting (for the Regular Mode).
  </p>

  <p markdown="1">
    <strong>Common problems with the Queue Mode</strong>: If you notice any test failures for RSpec when using the knapsack_pro Queue Mode, then it means that your test suite needs to be adjusted for using the `RSpec::Core::Runner` multiple times (which is what the Queue Mode does). Please see our <a href="https://knapsackpro.com/faq/question/why-when-i-use-queue-mode-for-rspec-then-my-tests-fail" target="_blank">FAQ entry for common Queue Mode problems</a>.<br>
    <br>
    If you think your problem is not covered there, please <a href="https://knapsackpro.com/contact" target="_blank">contact us</a>. We've seen many projects and realize that each test suite might introduce different edge cases that sometimes make RSpec fail. We'll be happy to help you debug yours!
  </p>

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

  <h3>How to split slow test files across parallel CI nodes (step 3 out of 3)</h3>

  <p>
    If your test suite has very slow test files then the <a href="https://github.com/KnapsackPro/knapsack_pro-ruby#split-test-files-by-test-cases" target="_blank">slowest test files can be split across parallel CI nodes automatically by the knapsack_pro gem</a>. This works both in the Regular Mode and the Queue Mode.
  </p>

{% highlight bash %}
# enable split by test examples for the slowest RSpec test files
KNAPSACK_PRO_RSPEC_SPLIT_BY_TEST_EXAMPLES=true
{% endhighlight %}

  <p>
    If you'd like to limit the debug logs produced by the knapsack_pro gem, you can change the log level to:
  </p>

{% highlight bash %}
KNAPSACK_PRO_LOG_LEVEL=info
{% endhighlight %}

  <p>You can learn more <a href="https://knapsackpro.com/faq/question/how-can-i-change-log-level" target="_blank">here</a>.</p>

  <h3>Most popular FAQ entries</h3>

  <p>
    You can find all entries in the <a href="https://knapsackpro.com/faq" target="_blank">FAQ</a>. The following are the most popular things developers ask about.
  </p>

  <p>
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
  </p>
</div>
