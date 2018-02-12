---
layout: page
title: Installation guide for ruby gem knapsack_pro
permalink: /knapsack_pro-ruby/guide/
---
<script src="/javascripts/knapsack_pro-ruby/guide.js?version=1"></script>

The more detailed tips and configuration options you can find in the [README for the knapsack_pro gem](https://github.com/KnapsackPro/knapsack_pro-ruby).<br>
[Get API key to use the knapsack_pro gem](http://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=page&utm_campaign=knapsack_pro-ruby_gem&utm_content=installation_guide)

## Installation

Add those lines to your application's Gemfile:

{% highlight ruby %}
group :test, :development do
  gem 'knapsack_pro'
end
{% endhighlight %}

And then execute:

{% highlight ruby %}
$ bundle install
{% endhighlight %}


If you are not using Rails then add this line at the bottom of `Rakefile`:

{% highlight ruby %}
# Add this only if you are not using Rails.
# If you use Rails then knapsack_pro rake tasks are already loaded
# so there is no need to explicitly load them.
KnapsackPro.load_tasks if defined?(KnapsackPro)
{% endhighlight %}

## Questions

Please answer questions to get basic configuration of knapsack_pro gem for your project.

<p>
  <strong>Choose your testing tools:</strong>
  <ul class="none-list">
    <li><label><input type="checkbox" id="test-runner-rspec" /> RSpec</label></li>
    <li><label><input type="checkbox" id="test-runner-minitest" /> Minitest</label></li>
    <li><label><input type="checkbox" id="test-runner-test-unit" /> test-unit</label></li>
    <li><label><input type="checkbox" id="test-runner-cucumber" /> Cucumber</label></li>
    <li><label><input type="checkbox" id="test-runner-spinach" /> Spinach</label></li>
  </ul>
</p>

<p>
  <strong>Do you use VCR, WebMock or FakeWeb gem?</strong><br>
  <label><input type="checkbox" id="vcr-webmock-fakeweb" /> Yes</label>
</p>

<p>
  <strong>What is your CI provider?</strong>
  <ul class="none-list">
    <li><label><input type="radio" name="ci-provider" value="circleci"> https://circleci.com</label></li>
    <li><label><input type="radio" name="ci-provider" value="travis-ci"> https://travis-ci.org</label></li>
    <li><label><input type="radio" name="ci-provider" value="buildkite"> https://buildkite.com</label></li>
    <li><label><input type="radio" name="ci-provider" value="semaphoreci"> https://semaphoreci.com</label></li>
    <li><label><input type="radio" name="ci-provider" value="snap-ci"> https://snap-ci.com</label></li>
    <li><label><input type="radio" name="ci-provider" value="codeship"> http://codeship.com</label></li>
    <li><label><input type="radio" name="ci-provider" value="heroku-ci"> Heroku CI</label></li>
    <li><label><input type="radio" name="ci-provider" value="gitlab-ci"> Gitlab CI</label></li>
    <li><label><input type="radio" name="ci-provider" value="jenkins"> Jenkins</label></li>
    <li><label><input type="radio" name="ci-provider" value="other"> other</label></li>
  </ul>
</p>

<div id="guide-test-runner-rspec" class="hidden">
<h4>Step for RSpec</h4>

<p>
Add at the beginning of your spec/spec_helper.rb:
</p>

{% highlight ruby %}
require 'knapsack_pro'
KnapsackPro::Adapters::RSpecAdapter.bind
{% endhighlight %}
</div>

<div id="guide-test-runner-minitest" class="hidden">
<h4>Step for Minitest</h4>

<p>
Add at the beginning of your test/test_helper.rb:
</p>

{% highlight ruby %}
require 'knapsack_pro'
knapsack_pro_adapter = KnapsackPro::Adapters::MinitestAdapter.bind
knapsack_pro_adapter.set_test_helper_path(__FILE__)
{% endhighlight %}
</div>

<div id="guide-test-runner-test-unit" class="hidden">
<h4>Step for test-unit</h4>

<p>
Add at the beginning of your test/test_helper.rb:
</p>

{% highlight ruby %}
require 'knapsack_pro'
knapsack_pro_adapter = KnapsackPro::Adapters::TestUnitAdapter.bind
knapsack_pro_adapter.set_test_helper_path(__FILE__)
{% endhighlight %}
</div>

<div id="guide-test-runner-cucumber" class="hidden">
<h4>Step for Cucumber</h4>

<p>
Create file features/support/knapsack_pro.rb and add there:
</p>

{% highlight ruby %}
require 'knapsack_pro'
KnapsackPro::Adapters::CucumberAdapter.bind
{% endhighlight %}
</div>

<div id="guide-test-runner-spinach" class="hidden">
<h4>Step for Spinach</h4>

<p>
Create file features/support/knapsack_pro.rb and add there:
</p>

{% highlight ruby %}
require 'knapsack_pro'
KnapsackPro::Adapters::SpinachAdapter.bind
{% endhighlight %}
</div>

<div id="guide-vcr-webmock-fakeweb" class="hidden">
<h4>Step for VCR/WebMock/FakeWeb gems</h4>

<p>
Add Knapsack Pro API subdomain to ignore hosts in spec/spec_helper.rb or wherever is your VCR configuration:
</p>

{% highlight ruby %}
require 'vcr'
VCR.configure do |config|
  config.hook_into :webmock # or :fakeweb
  config.ignore_hosts('localhost', '127.0.0.1', '0.0.0.0', 'api.knapsackpro.com')
end

# add below when you hook into webmock
require 'webmock/rspec'
WebMock.disable_net_connect!(:allow => ['api.knapsackpro.com'])

# add below when you use FakeWeb
require 'fakeweb'
FakeWeb.allow_net_connect = %r[^https?://api\.knapsackpro\.com]
{% endhighlight %}

<p>
Ensure you have require false in Gemfile for webmock gem when VCR is hook into it. Thanks to that webmock configuration in spec_helper.rb is loaded properly.
</p>

{% highlight ruby %}
group :test do
  gem 'vcr'
  gem 'webmock', require: false
  gem 'fakeweb', require: false # example when you use fakeweb
end
{% endhighlight %}
</div>

<div id="guide-providers">
  <div id="guide-provider-circleci" class="hidden">
<h4>Step for https://circleci.com</h4>

<p>
Here is an example for test configuration in your circleci.yml file.
</p>

{% highlight ruby %}
# CircleCI 1.0

machine:
  environment:
    # Tokens should be set in CircleCI settings to avoid expose tokens in build logs
    # KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC: rspec-token
    # KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER: cucumber-token
    # KNAPSACK_PRO_TEST_SUITE_TOKEN_MINITEST: minitest-token
    # KNAPSACK_PRO_TEST_SUITE_TOKEN_TEST_UNIT: test-unit-token
    # KNAPSACK_PRO_TEST_SUITE_TOKEN_SPINACH: spinach-token
test:
  override:
    # Step for RSpec
    - bundle exec rake knapsack_pro:rspec:
        parallel: true # Caution: there are 8 spaces indentation!

    # Step for Cucumber
    - bundle exec rake knapsack_pro:cucumber:
        parallel: true # Caution: there are 8 spaces indentation!

    # Step for Minitest
    - bundle exec rake knapsack_pro:minitest:
        parallel: true # Caution: there are 8 spaces indentation!

    # Step for test-unit
    - bundle exec rake knapsack_pro:test_unit:
        parallel: true # Caution: there are 8 spaces indentation!

    # Step for Spinach
    - bundle exec rake knapsack_pro:spinach:
        parallel: true # Caution: there are 8 spaces indentation!
{% endhighlight %}

<p>
Here is another example for CircleCI 2.0 platform.
</p>

{% highlight ruby %}
# CircleCI 2.0

# some tests that are not balanced and executed only on first CI node
- run: case $CIRCLE_NODE_INDEX in 0) npm test ;; esac

# auto-balancing CI build time execution to be flat and optimal (as fast as possible).
# Queue Mode does dynamic tests allocation so the previous not balanced run command won't
# create a bottleneck on the CI node
- run:
  name: RSpec via knapsack_pro Queue Mode
  command: |
    # export word is important here!
    export RAILS_ENV=test
    bundle exec rake "knapsack_pro:queue:rspec[--format documentation]"
{% endhighlight %}

<p>
Please remember to add additional containers for your project in CircleCI settings.
</p>
  </div>

  <div id="guide-provider-travis-ci" class="hidden">
<h4>Step for https://travis-ci.org</h4>

<p>
You can parallelize your builds across virtual machines with <a href="http://docs.travis-ci.com/user/speeding-up-the-build/#Parallelizing-your-builds-across-virtual-machines" target="_blank">travis matrix feature</a>. Edit .travis.yml
</p>

{% highlight ruby %}
script:
  # Step for RSpec
  - "bundle exec rake knapsack_pro:rspec"

  # Step for Cucumber
  - "bundle exec rake knapsack_pro:cucumber"

  # Step for Minitest
  - "bundle exec rake knapsack_pro:minitest"

  # Step for test-unit
  - "bundle exec rake knapsack_pro:test_unit"

  # Step for Spinach
  - "bundle exec rake knapsack_pro:spinach"

env:
  global:
    # tokens should be set in travis settings in web interface to avoid expose tokens in build logs
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=rspec-token
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=cucumber-token
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_MINITEST=minitest-token
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_TEST_UNIT=test-unit-token
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_SPINACH=spinach-token

    - KNAPSACK_PRO_CI_NODE_TOTAL=2
  matrix:
    - KNAPSACK_PRO_CI_NODE_INDEX=0
    - KNAPSACK_PRO_CI_NODE_INDEX=1
{% endhighlight %}

<p>
Such configuration will generate matrix with 2 following ENV rows:
</p>

{% highlight ruby %}
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=rspec-token KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=cucumber-token KNAPSACK_PRO_TEST_SUITE_TOKEN_MINITEST=minitest-token KNAPSACK_PRO_TEST_SUITE_TOKEN_TEST_UNIT=test-unit-token KNAPSACK_PRO_TEST_SUITE_TOKEN_SPINACH=spinach-token
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=rspec-token KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=cucumber-token KNAPSACK_PRO_TEST_SUITE_TOKEN_MINITEST=minitest-token KNAPSACK_PRO_TEST_SUITE_TOKEN_TEST_UNIT=test-unit-token KNAPSACK_PRO_TEST_SUITE_TOKEN_SPINACH=spinach-token
{% endhighlight %}

<p>
More info about global and matrix ENV configuration in <a href="https://docs.travis-ci.com/user/customizing-the-build/#Build-Matrix" target="_blank">travis docs</a>.
</p>
  </div>

  <div id="guide-provider-buildkite" class="hidden">
<h4>Step for https://buildkite.com</h4>

<p>
Knapsack Pro supports buildkite ENVs BUILDKITE_PARALLEL_JOB_COUNT and BUILDKITE_PARALLEL_JOB. The only thing you need to do is to configure the parallelism parameter in your build step and run the appropiate command in your build:
</p>

{% highlight ruby %}
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

<p>Please remember to set up token like KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC as global environment.</p>

<p>
Here you can find article <a href="http://docs.knapsackpro.com/2017/auto-balancing-7-hours-tests-between-100-parallel-jobs-on-ci-buildkite-example" target="_blank">how to set up a new pipeline for your project in Buildkite and configure Knapsack Pro</a> and 2 example repositories for Ruby/Rails projects:
</p>

<ul>
  <li><a href="https://github.com/KnapsackPro/buildkite-rails-parallel-example-with-knapsack_pro" target="_blank">Buildkite Rails Parallel Example with Knapsack Pro</a></li>
  <li><a href="https://github.com/KnapsackPro/buildkite-rails-docker-parallel-example-with-knapsack_pro" target="_blank">Buildkite Rails Docker Parallel Example with Knapsack Pro</a></li>
</ul>

<p>
If you want to use Buildkite retry single agent feature to retry just failed tests on particular agent (CI node) then you should set <a href="https://github.com/KnapsackPro/knapsack_pro-ruby#knapsack_pro_fixed_queue_split-remember-queue-split-on-retry-ci-node" target="_blank">KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true</a>.
</p>

  </div>

  <div id="guide-provider-semaphoreci" class="hidden">
<h4>Step for https://semaphoreci.com</h4>

<p>
Knapsack Pro supports semaphoreapp ENVs SEMAPHORE_THREAD_COUNT and SEMAPHORE_CURRENT_THREAD. The only thing you need to do is set up knapsack_pro rspec/cucumber/minitest/test_unit command for as many threads as you need. Here is an example:
</p>

{% highlight ruby %}
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

<p>Tests will be split across threads.</p>

<p>Please remember to set up token like KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC as global environment.</p>
  </div>

  <div id="guide-provider-snap-ci" class="hidden">
<h4>Step for https://snap-ci.com</h4>

<p>Knapsack Pro supports snap-ci.com ENVs SNAP_WORKER_TOTAL and SNAP_WORKER_INDEX. The only thing you need to do is to configure number of workers for your project in configuration settings in order to enable parallelism. Next thing is to set below commands to be executed in your stage:</p>

{% highlight ruby %}
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

<p>
Please remember to set up token like KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC as global environment.
</p>
  </div>

  <div id="guide-provider-codeship" class="hidden">
  <h4>Step for http://codeship.com</h4>

<p>
Codeship does not provide parallel jobs environment variables so you will have to define KNAPSACK_PRO_CI_NODE_TOTAL and KNAPSACK_PRO_CI_NODE_INDEX for each <a href="https://documentation.codeship.com/basic/builds-and-configuration/parallel-tests/#using-parallel-test-pipelines" target="_blank">parallel test pipeline</a>. Below is an example for 2 parallel test pipelines.
</p>

<p>Configure test pipelines (1/2 used)</p>

{% highlight ruby %}
# first CI node running in parallel

# Cucumber tests in Knapsack Pro Regular Mode (deterministic test suite split)
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:cucumber

# RSpec tests in Knapsack Pro Queue Mode (dynamic test suite split)
# It will autobalance bulid because it is executed after Cucumber tests.
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:queue:rspec
{% endhighlight %}

<p>Configure test pipelines (2/2 used)</p>

{% highlight ruby %}
# second CI node running in parallel

# Cucumber tests in Knapsack Pro Regular Mode (deterministic test suite split)
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:cucumber

# RSpec tests in Knapsack Pro Queue Mode (dynamic test suite split)
# It will autobalance bulid because it is executed after Cucumber tests.
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:queue:rspec
{% endhighlight %}

<p>
Remember to add API tokens like KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER and KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC to <i>Environment</i> page of your project settings in Codeship.
</p>

<p>
If you want to use Codeship retry single CI node feature to retry just failed tests on particular CI node then you should set <a href="https://github.com/KnapsackPro/knapsack_pro-ruby#knapsack_pro_fixed_queue_split-remember-queue-split-on-retry-ci-node" target="_blank">KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true</a>.
</p>
</div>

<div id="guide-provider-heroku-ci" class="hidden">
<h4>Step for Heroku CI</h4>

<p>
You can parallelize your tests on Heroku CI by configuring <i>app.json</i>.
</p>

<p>
You can set how many parallel dynos with tests you want to run with <i>quantity</i> value.
Use <i>test</i> key to run knapsack_pro gem.
</p>

<p>
You need to specify also the environment variable with API token for Knapsack Pro.
For any sensitive environment variables (like Knapsack Pro API token) that you do not want in your <i>app.json</i> manifest, you can add them to your pipeline's Heroku CI settings.
</p>

<p>
Note the <a href="https://devcenter.heroku.com/articles/heroku-ci-parallel-test-runs" target="_blank">Heroku CI Parallel Test Runs</a> are in Beta and you may need to ask Heroku support to enabled it for your project.
</p>

{% highlight ruby %}
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
        "KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC": "rspec-token"
      }
    }
  }
}
{% endhighlight %}

<p>
You can learn more about <a href="https://devcenter.heroku.com/articles/heroku-ci" target="_blank">Heroku CI</a>.
</p>

</div>

  <div id="guide-provider-gitlab-ci" class="hidden">
<h4>Step for Gitlab CI https://about.gitlab.com/features/gitlab-ci-cd/</h4>

<p>
Gitlab CI does not provide parallel jobs environment variables so you will have to define KNAPSACK_PRO_CI_NODE_TOTAL and KNAPSACK_PRO_CI_NODE_INDEX for each parallel job running as part of the same test stage. Below is relevant part of .gitlab-ci.yml configuration for 2 parallel jobs.
</p>

{% highlight ruby %}
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
  # Cucumber tests in Knapsack Pro Regular Mode (deterministic test suite split)
  - bundle exec rake knapsack_pro:cucumber
  # RSpec tests in Knapsack Pro Queue Mode (dynamic test suite split)
  # It will autobalance bulid because it is executed after Cucumber tests.
  - bundle exec rake knapsack_pro:queue:rspec

# second CI node running in parallel
test_ci_node_1:
stage: test
script:
  - export KNAPSACK_PRO_CI_NODE_INDEX=1
  - bundle exec rake knapsack_pro:cucumber
  - bundle exec rake knapsack_pro:queue:rspec
{% endhighlight %}

<p>
Remember to add API tokens like KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER and KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC to <a href="https://gitlab.com/help/ci/variables/README.md#secret-variables" target="_blank">Secret Variables</a> in Gitlab CI Settings -> CI/CD Pipelines -> Secret Variables.
</p>
</div>

  <div id="guide-provider-jenkins" class="hidden">
  <h4>Step for Jenkins</h4>

  <p>
  In order to run parallel jobs with Jenkins you should use Jenkins Pipeline.<br>
  You can learn basics about it in the article <a href="https://www.cloudbees.com/blog/parallelism-and-distributed-builds-jenkins" target="_blank">Parallelism and Distributed Builds with Jenkins</a>.
  </p>

  <p>
  Here is example Jenkinsfile working with Jenkins Pipeline.
  </p>

{% highlight ruby %}
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

        // example how to run cucumber tests in Knapsack Pro Regular Mode
        stage('Run cucumber') {
          sh """${knapsack_options} bundle exec rake knapsack_pro:cucumber"""
        }

        // example how to run rspec tests in Knapsack Pro Queue Mode
        // Queue Mode should be as a last stage so it can autobalance build if tests in regular mode were not perfectly distributed
        stage('Run rspec') {
          sh """KNAPSACK_PRO_CI_NODE_BUILD_ID=${env.BUILD_TAG} ${knapsack_options} bundle exec rake knapsack_pro:queue:rspec"""
        }
      }
    }
  }

  parallel nodes // run CI nodes in parallel
}
{% endhighlight %}

<p>
Remember to set environment variables in Jenkins configuration with your API tokens like KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC and KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER.
Here is <a href="https://github.com/KnapsackPro/knapsack_pro-ruby#set-api-key-token" target="_blank">list of environment variables per test runner</a>.
</p>

<p>
Above example shows how to run cucumber tests in regular mode and later the rspec tests in queue mode to autobalance build.<br>
If you are going to relay on rspec to autobalance build when cucumber tests were not perfectly distributed you should be aware about <a href="https://github.com/KnapsackPro/knapsack_pro-ruby#why-my-tests-are-executed-twice-in-queue-mode-why-ci-node-runs-whole-test-suite-again" target="_blank">possible edge case if your rspec test suite is very short</a>.
</p>
  </div>

  <div id="guide-provider-other" class="hidden">
  <h4>Step for other CI provider</h4>

  <p>
  Set below global variables on your CI server.
  </p>

  <p>
  Git installed on the CI server will be used to determine branch name and current commit hash.
  </p>

{% highlight ruby %}
KNAPSACK_PRO_REPOSITORY_ADAPTER=git
{% endhighlight %}

  <p>
  Path to the project repository on CI server, for instance:
  </p>

{% highlight ruby %}
KNAPSACK_PRO_PROJECT_DIR=/home/ubuntu/my-app-repository
{% endhighlight %}

<p>
You can <a href="https://github.com/KnapsackPro/knapsack_pro-ruby#when-you-set-global-variable-knapsack_pro_repository_adaptergit-required-when-ci-provider-is-not-supported" target="_blank">learn more about those variables here</a>.
</p>

<h4>Set API token</h4>

<p>
You must set different API token on your CI server for each test suite you have:
</p>

{% highlight ruby %}
KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC
{% endhighlight %}

<p>
You can generate more API tokens after sign in on https://knapsackpro.com
</p>

<h4>
Set test run command on CI server
</h4>
<p>
You must set command responsible for running tests for each CI node.<br>
Let's assume you have 2 CI nodes. Here are commands you need to run for each CI node.
</p>

<p>
Step for rspec
</p>

{% highlight ruby %}
# Command for first CI node
$ KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:rspec

# Command for second CI node
$ KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:rspec
{% endhighlight %}

<p>
Step for minitest
</p>

{% highlight ruby %}
# Command for first CI node
$ KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:minitest

# Command for second CI node
$ KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:minitest
{% endhighlight %}

<p>
Step for test-unit
</p>

{% highlight ruby %}
# Command for first CI node
$ KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:test_unit

# Command for second CI node
$ KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:test_unit
{% endhighlight %}

<p>
Step for cucumber
</p>

{% highlight ruby %}
# Command for first CI node
$ KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:cucumber

# Command for second CI node
$ KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:cucumber
{% endhighlight %}

<p>
Step for spinach
</p>

{% highlight ruby %}
# Command for first CI node
$ KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:spinach

# Command for second CI node
$ KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:spinach
{% endhighlight %}

<p>
If you have more CI nodes then update accordingly:
</p>

{% highlight ruby %}
KNAPSACK_PRO_CI_NODE_TOTAL - total number of your CI nodes
KNAPSACK_PRO_CI_NODE_INDEX - starts from 0, it's index of each CI node
{% endhighlight %}
  </div>
</div>

<div id="guide-final-step" class="hidden">
  <h4>
  Final step
  </h4>

  <p>
  Now you are ready to use the gem!
  </p>

  <p>
  Please push a new commit to repository so knapsack_pro gem will record time execution of your test suite.
  Note the first run will not be optimal because knapsack_pro needs to first record time execution data.
  </p>

  <p>
  Go to <a href="https://knapsackpro.com/dashboard" target="_blank">user dashboard</a> and click build metrics link next to your API token. Click show link on recent build and ensure the time execution data were recorded for all your CI nodes. You should see info that build subsets were collected.
  </p>

  <p>
  <strong>Your second test suite run on CI will be parallelized with optimal test suite split if first run was recorded correctly.</strong>
  </p>

  <p>
  Once you confirm the knapsack_pro Regular Mode works and your tests are green then you may want to <a href="https://github.com/KnapsackPro/knapsack_pro-ruby#queue-mode" target="_blank">learn about Queue Mode and how to enable it</a>.
  </p>

{% highlight ruby %}
# Example command for Regular Mode
bundle exec rake knapsack_pro:rspec

# Example command for Queue Mode
bundle exec rake knapsack_pro:queue:rspec
{% endhighlight %}

  <p>
  I recommend to use first Regular Mode in order to record time execution data from your project. You could also use Queue Mode to do that but it will be much slower when you record your first build. Please ensure your tests are green in Regular Mode and there are no order dependet test failures before trying Queue Mode.
  </p>

  <p>
  You can learn more about custom configuration and other <a href="https://knapsackpro.com/features" target="_blank">features</a>.<br>
  Full <a href="https://github.com/KnapsackPro/knapsack_pro-ruby#table-of-contents" target="_blank">documentation</a>.
  If you have problems please check FAQ there.
  </p>

  <p>
  Feel free to ask questions if you need help. <a href="https://knapsackpro.com/contact" target="_blank">Contact us</a>.
  </p>
</div>
