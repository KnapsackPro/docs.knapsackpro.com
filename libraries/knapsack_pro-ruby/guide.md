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

{% highlight bash %}
bundle install
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
    <li><label><input type="radio" name="ci-provider" value="solano-ci"> Solano CI</label></li>
    <li><label><input type="radio" name="ci-provider" value="appveyor"> AppVeyor</label></li>
    <li><label><input type="radio" name="ci-provider" value="gitlab-ci"> GitLab CI</label></li>
    <li><label><input type="radio" name="ci-provider" value="cirrus-ci"> https://cirrus-ci.org</label></li>
    <li><label><input type="radio" name="ci-provider" value="jenkins"> Jenkins</label></li>
    <li><label><input type="radio" name="ci-provider" value="github-actions"> GitHub Actions</label></li>
    <li><label><input type="radio" name="ci-provider" value="codefresh"> Codefresh.io</label></li>
    <li><label><input type="radio" name="ci-provider" value="other"> other</label></li>
  </ul>
</p>

<div id="guide-test-runner-rspec" class="hidden">
<h4>Step for RSpec</h4>

<p>
Add at the beginning of your spec/rails_helper.rb or spec/spec_helper.rb:
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
WebMock.disable_net_connect!(allow_localhost: true, allow: ['api.knapsackpro.com'])

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

<p>
If you happen to see your tests failing due to WebMock not allowing requests to Knapsack Pro API it means you probably reconfigure WebMock in some of your tests.
For instance, you may use <code class="highlighter-rouge">WebMock.reset!</code> or it's called automatically in <code class="highlighter-rouge">after(:each)</code> block, if you <code class="highlighter-rouge">require 'webmock/rspec'</code> (<a href="https://github.com/bblimke/webmock/issues/484#issuecomment-116193449" target="_blank">more about the issue</a>). It will remove api.knapsackpro.com from whitelisted domains. Please try below:
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
<h4>Step for https://circleci.com</h4>

<p>
Here is another example for CircleCI 2.0 platform.
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

      # ... other config

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

      - run:
        name: Minitest via knapsack_pro Queue Mode
        command: |
          # export word is important here!
          export RAILS_ENV=test
          bundle exec rake "knapsack_pro:queue:minitest[--verbose]"

      - run:
        name: Cucumber via knapsack_pro Queue Mode
        command: |
          # export word is important here!
          export RAILS_ENV=test
          # If you use spring gem and spring-commands-cucumber gem to start Cucumber tests faster please set
          # export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bundle exec spring
          # or you can use spring binstub
          # export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bin/spring
          # Thanks to that Cucumber will start tests faster for each batch of tests fetched from Knapsack Pro Queue API
          bundle exec rake knapsack_pro:queue:cucumber
{% endhighlight %}

<p>
Adjust amount of parallel containers with <code class="highlighter-rouge">parallelism</code> attribute.<br>
Full example for <a href="/2017/circleci-2-0-capybara-feature-specs-selenium-webdriver-with-chrome-headless" target="_blank">Rails project config on CircleCI 2.0</a> can be found the article.
</p>

<p>
If you use knapsack_pro Queue Mode with CircleCI you may want to collect metadata like <a href="https://github.com/KnapsackPro/knapsack_pro-ruby#circleci-and-knapsack_pro-queue-mode" target="_blank">junit xml report about your RSpec</a> test suite with junit formatter. Thanks to that you will see failed tests in nice CircleCI web UI. It's also possible to <a href="https://knapsackpro.com/faq/question/how-to-use-junit-formatter" target="_blank">configure junit formatter for knapsack_pro Regular Mode</a>.
</p>

<p>
Please remember to add additional containers for your project in CircleCI settings.
</p>
  </div>

  <div id="guide-provider-travis-ci" class="hidden">
<h4>Step for https://travis-ci.org</h4>

<p>
You can parallelize your builds across virtual machines with <a href="http://docs.travis-ci.com/user/speeding-up-the-build/#parallelizing-your-builds-across-virtual-machines" target="_blank">travis matrix feature</a>. Edit .travis.yml
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
    # tokens should be set in travis settings in web interface to avoid expose tokens in build logs
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=rspec-token
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=cucumber-token
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_MINITEST=minitest-token
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_TEST_UNIT=test-unit-token
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_SPINACH=spinach-token

    # if you use Knapsack Pro Queue Mode you must set below env variable
    # to be able to retry single failed parallel job from Travis UI
    - KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true

    - KNAPSACK_PRO_CI_NODE_TOTAL=2
  jobs:
    - KNAPSACK_PRO_CI_NODE_INDEX=0
    - KNAPSACK_PRO_CI_NODE_INDEX=1
{% endhighlight %}

<p>
Such configuration will generate matrix with 2 following ENV rows:
</p>

{% highlight bash %}
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=rspec-token KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=cucumber-token KNAPSACK_PRO_TEST_SUITE_TOKEN_MINITEST=minitest-token KNAPSACK_PRO_TEST_SUITE_TOKEN_TEST_UNIT=test-unit-token KNAPSACK_PRO_TEST_SUITE_TOKEN_SPINACH=spinach-token
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=rspec-token KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=cucumber-token KNAPSACK_PRO_TEST_SUITE_TOKEN_MINITEST=minitest-token KNAPSACK_PRO_TEST_SUITE_TOKEN_TEST_UNIT=test-unit-token KNAPSACK_PRO_TEST_SUITE_TOKEN_SPINACH=spinach-token
{% endhighlight %}

<p>
More info about global and matrix ENV configuration in <a href="https://docs.travis-ci.com/user/customizing-the-build/#build-matrix" target="_blank">travis docs</a>.
</p>
  </div>

  <div id="guide-provider-buildkite" class="hidden">
<h4>Step for https://buildkite.com</h4>

<p>
Knapsack Pro supports buildkite ENVs BUILDKITE_PARALLEL_JOB_COUNT and BUILDKITE_PARALLEL_JOB. The only thing you need to do is to configure the parallelism parameter in your build step and run the appropiate command in your build:
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

<p>
When using the docker-compose plugin on Buildkite, you have to tell it which environment variables to pass to the docker container. Thanks to it knapsack_pro can detect info about CI build like commit, branch name, amount of parallel nodes.
</p>

{% highlight yaml %}
steps:
  - label: "Test"
    parallelism: 2
    plugins:
      - docker-compose#3.0.3:
        run: app
        # use here proper knapsack_pro command for your test runner
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
<h4>Step for https://semaphoreci.com</h4>

<h5>Semaphore 2.0</h5>

<p>
knapsack_pro gem supports environment variables provided by Semaphore CI 2.0 to run your tests. You will have to define a few things in <i>.semaphore/semaphore.yml</i> config file.
</p>

<ul>
  <li>You need to set KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC. If you don't want to commit secrets in yml file then you can <a href="https://docs.semaphoreci.com/article/66-environment-variables-and-secrets" target="_blank" rel="nofollow">follow this guide</a>.</li>
  <li>You should create as many parallel jobs as you need with <i>parallelism</i> property. If your test suite is long you should use more parallel jobs.</li>
</ul>

<p>
Below you can find full Semaphore CI 2.0 config for Rails project.
</p>

{% highlight yaml %}
# .semaphore/semaphore.yml
# Use the latest stable version of Semaphore 2.0 YML syntax:
version: v1.0

# Name your pipeline. In case you connect multiple pipelines with promotions,
# the name will help you differentiate between, for example, a CI build phase
# and delivery phases.
name: Demo Rails 5 app

# An agent defines the environment in which your code runs.
# It is a combination of one of available machine types and operating
# system images.
# See https://docs.semaphoreci.com/article/20-machine-types
# and https://docs.semaphoreci.com/article/32-ubuntu-1804-image
agent:
  machine:
    type: e1-standard-2
    os_image: ubuntu1804

# Blocks are the heart of a pipeline and are executed sequentially.
# Each block has a task that defines one or more jobs. Jobs define the
# commands to execute.
# See https://docs.semaphoreci.com/article/62-concepts
blocks:
  - name: Setup
    task:
      env_vars:
        - name: RAILS_ENV
          value: test
      jobs:
        - name: bundle
          commands:
          # Checkout code from Git repository. This step is mandatory if the
          # job is to work with your code.
          # Optionally you may use --use-cache flag to avoid roundtrip to
          # remote repository.
          # See https://docs.semaphoreci.com/article/54-toolbox-reference#libcheckout
          - checkout
          # Restore dependencies from cache.
          # Read about caching: https://docs.semaphoreci.com/article/54-toolbox-reference#cache
          - cache restore gems-$SEMAPHORE_GIT_BRANCH-$(checksum Gemfile.lock),gems-$SEMAPHORE_GIT_BRANCH-,gems-master-
          # Set Ruby version:
          - sem-version ruby 2.6.1
          - bundle install --jobs=4 --retry=3 --path vendor/bundle
          # Store the latest version of dependencies in cache,
          # to be used in next blocks and future workflows:
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
      # This block runs two jobs in parallel and they both share common
      # setup steps. We can group them in a prologue.
      # See https://docs.semaphoreci.com/article/50-pipeline-yaml#prologue
      prologue:
        commands:
          - checkout
          - cache restore gems-$SEMAPHORE_GIT_BRANCH-$(checksum Gemfile.lock),gems-$SEMAPHORE_GIT_BRANCH-,gems-master-
          # Start Postgres database service.
          # See https://docs.semaphoreci.com/article/54-toolbox-reference#sem-service
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
        # If you use spring gem and spring-commands-cucumber gem to start Cucumber tests faster please set
        # export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bundle exec spring
        # or you can use spring binstub
        # export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bin/spring
        # Thanks to that Cucumber will start tests faster for each batch of tests fetched from Knapsack Pro Queue API
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

<h5>Semaphore 1.0</h5>

<p>
Knapsack Pro supports semaphoreapp ENVs SEMAPHORE_THREAD_COUNT and SEMAPHORE_CURRENT_THREAD. The only thing you need to do is set up knapsack_pro rspec/cucumber/minitest/test_unit command for as many threads as you need. Here is an example:
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

<p>Tests will be split across threads.</p>

<p>Please remember to set up token like KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC as global environment.</p>
  </div>

  <div id="guide-provider-snap-ci" class="hidden">
<h4>Step for https://snap-ci.com</h4>

<p>Knapsack Pro supports snap-ci.com ENVs SNAP_WORKER_TOTAL and SNAP_WORKER_INDEX. The only thing you need to do is to configure number of workers for your project in configuration settings in order to enable parallelism. Next thing is to set below commands to be executed in your stage:</p>

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

{% highlight bash %}
# first CI node running in parallel

# Cucumber tests in Knapsack Pro Regular Mode (deterministic test suite split)
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:cucumber

# or use Cucumber tests in Knapsack Pro Queue Mode (dynamic test suite split)
# If you use spring gem and spring-commands-cucumber gem to start Cucumber tests faster please set
# export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bundle exec spring
# or you can use spring binstub
# export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bin/spring
# Thanks to that Cucumber will start tests faster for each batch of tests fetched from Knapsack Pro Queue API
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:queue:cucumber

# RSpec tests in Knapsack Pro Queue Mode (dynamic test suite split)
# It will autobalance build because it is executed after Cucumber tests.
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:queue:rspec
{% endhighlight %}

<p>Configure test pipelines (2/2 used)</p>

{% highlight bash %}
# second CI node running in parallel

# Cucumber tests in Knapsack Pro Regular Mode (deterministic test suite split)
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:cucumber

# or use Cucumber tests in Knapsack Pro Queue Mode (dynamic test suite split)
# If you use spring gem and spring-commands-cucumber gem to start Cucumber tests faster please set
# export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bundle exec spring
# or you can use spring binstub
# export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bin/spring
# Thanks to that Cucumber will start tests faster for each batch of tests fetched from Knapsack Pro Queue API
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:queue:cucumber

# RSpec tests in Knapsack Pro Queue Mode (dynamic test suite split)
# It will autobalance build because it is executed after Cucumber tests.
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:queue:rspec
{% endhighlight %}

<p>
Remember to add API tokens like KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER and KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC to <i>Environment</i> page of your project settings in Codeship.
</p>

<p>
CodeShip uses the same build number if you restart a build. Because of that you need to set <a href="https://github.com/KnapsackPro/knapsack_pro-ruby#knapsack_pro_fixed_queue_split-remember-queue-split-on-retry-ci-node" target="_blank">KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true</a> in order to be able to restart CI build in Queue Mode.
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
        "KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC": "rspec-token"
      }
    }
  }
}
{% endhighlight %}

<p>
If you would like to <a href="https://knapsackpro.com/faq/question/how-to-run-multiple-test-suite-commands-in-heroku-ci" target="_blank">run multiple Knapsack Pro commands for different test runners on Heroku CI</a> please follow tips.
</p>

<p>
You can learn more about <a href="https://devcenter.heroku.com/articles/heroku-ci" target="_blank">Heroku CI</a>.
</p>

</div>

<div id="guide-provider-solano-ci" class="hidden">
<h4>Step for Solano CI</h4>

<p>
<a href="https://www.solanolabs.com" target="_blank">Solano CI</a> does not provide parallel jobs environment variables so you will have to define <i>KNAPSACK_PRO_CI_NODE_TOTAL</i> and <i>KNAPSACK_PRO_CI_NODE_INDEX</i> for each parallel job running as part of the same CI build.
</p>

{% highlight bash %}
# Step for RSpec for first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:rspec
# Step for RSpec for second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:rspec

# Step for Cucumber for first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:cucumber
# Step for Cucumber for second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:cucumber

# Step for Minitest for first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:minitest
# Step for Minitest for second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:minitest

# Step for test-unit for first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:test_unit
# Step for test-unit for second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:test_unit

# Step for Spinach for first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:spinach
# Step for Spinach for second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:spinach
{% endhighlight %}

<p>
Please remember to set up API token like <i>KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC</i> as global environment.
</p>
</div>

<div id="guide-provider-appveyor" class="hidden">
<h4>Step for AppVeyor</h4>

<p>
<a href="https://www.appveyor.com" target="_blank">AppVeyor</a> does not provide parallel jobs environment variables so you will have to define <i>KNAPSACK_PRO_CI_NODE_TOTAL</i> and <i>KNAPSACK_PRO_CI_NODE_INDEX</i> for each parallel job running as part of the same CI build.
</p>

{% highlight bash %}
# Step for RSpec for first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:rspec
# Step for RSpec for second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:rspec

# Step for Cucumber for first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:cucumber
# Step for Cucumber for second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:cucumber

# Step for Minitest for first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:minitest
# Step for Minitest for second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:minitest

# Step for test-unit for first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:test_unit
# Step for test-unit for second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:test_unit

# Step for Spinach for first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:spinach
# Step for Spinach for second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:spinach
{% endhighlight %}

<p>
Please remember to set up API token like <i>KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC</i> as global environment.
</p>
</div>

  <div id="guide-provider-gitlab-ci" class="hidden">
<h4>Step for GitLab CI https://about.gitlab.com/features/gitlab-ci-cd/</h4>

<p>
Remember to add API tokens like KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER and KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC to <a href="https://gitlab.com/help/ci/variables/README.md#secret-variables" target="_blank">Secret Variables</a> in GitLab CI Settings -> CI/CD Pipelines -> Secret Variables.
</p>

<h5>GitLab CI >= 11.5</h5>

{% highlight yaml %}
test:
  parallel: 2

  # Knapsack Pro Regular Mode (deterministic test suite split)
  script: bundle exec rake knapsack_pro:rspec

  # Other commands you could use:

  # Knapsack Pro Regular Mode (deterministic test suite split)
  # bundle exec rake knapsack_pro:cucumber
  # bundle exec rake knapsack_pro:minitest
  # bundle exec rake knapsack_pro:test_unit
  # bundle exec rake knapsack_pro:spinach

  # Knapsack Pro Queue Mode (dynamic test suite split)
  # bundle exec rake knapsack_pro:queue:rspec
  # bundle exec rake knapsack_pro:queue:minitest

  # If you use spring gem and spring-commands-cucumber gem to start Cucumber tests faster please set
  # export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bundle exec spring
  # or you can use spring binstub
  # export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bin/spring
  # Thanks to that Cucumber will start tests faster for each batch of tests fetched from Knapsack Pro Queue API
  # bundle exec rake knapsack_pro:queue:cucumber
{% endhighlight %}

<p>
Here you can find info <a href="https://docs.gitlab.com/ee/ci/yaml/#parallel" target="_blank">how to configure the GitLab parallel CI nodes</a>.
</p>

<h5>GitLab CI &lt; 11.5 (old GitLab CI)</h5>

<p>
GitLab CI does not provide parallel jobs environment variables so you will have to define KNAPSACK_PRO_CI_NODE_TOTAL and KNAPSACK_PRO_CI_NODE_INDEX for each parallel job running as part of the same test stage. Below is relevant part of .gitlab-ci.yml configuration for 2 parallel jobs.
</p>

{% highlight yaml %}
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

    # or use Cucumber tests in Knapsack Pro Queue Mode (dynamic test suite split)
    # If you use spring gem and spring-commands-cucumber gem to start Cucumber tests faster please set
    # export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bundle exec spring
    # or you can use spring binstub
    # export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bin/spring
    # Thanks to that Cucumber will start tests faster for each batch of tests fetched from Knapsack Pro Queue API
    - bundle exec rake knapsack_pro:queue:cucumber

    # RSpec tests in Knapsack Pro Queue Mode (dynamic test suite split)
    # It will autobalance build because it is executed after Cucumber tests in Regular Mode.
    - bundle exec rake knapsack_pro:queue:rspec

# second CI node running in parallel
test_ci_node_1:
  stage: test
  script:
    - export KNAPSACK_PRO_CI_NODE_INDEX=1
    - bundle exec rake knapsack_pro:cucumber

    # If you use spring gem and spring-commands-cucumber gem to start Cucumber tests faster please set
    # export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bundle exec spring
    # or you can use spring binstub
    # export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bin/spring
    # Thanks to that Cucumber will start tests faster for each batch of tests fetched from Knapsack Pro Queue API
    - bundle exec rake knapsack_pro:queue:cucumber

    - bundle exec rake knapsack_pro:queue:rspec
{% endhighlight %}
</div>


<div id="guide-provider-cirrus-ci" class="hidden">
<p>
Knapsack Pro supports cirrus-ci.org ENVs CI_NODE_TOTAL and CI_NODE_INDEX. The only thing you need to do is to configure number of parallel CI nodes for your project. Next thing is to set one of below commands to be executed on each parallel CI node:
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

<p>
Please remember to set up token like KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC as global environment.
</p>

<p>
Here is example for <a href="https://cirrus-ci.org/examples/#ruby" target="_blank">.cirrus.yml configuration file</a>.
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
If you are going to relay on rspec to autobalance build when cucumber tests were not perfectly distributed you should be aware about <a href="https://knapsackpro.com/faq/question/why-my-tests-are-executed-twice-in-queue-mode-why-ci-node-runs-whole-test-suite-again" target="_blank">possible edge case if your rspec test suite is very short</a>.
</p>
  </div>

<div id="guide-provider-github-actions" class="hidden">
  <h4>Step for GitHub Actions</h4>

  <p>
  knapsack_pro gem supports environment variables provided by GitHub Actions to run your tests. You will have to define a few things in <i>.github/workflows/main.yaml</i> config file.
  </p>

  <ul>
    <li>You need to set API token like <i>KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC</i> in GitHub settings -> Secrets for your repository. <a href="https://help.github.com/en/articles/virtual-environments-for-github-actions#creating-and-using-secrets-encrypted-variables" target="_blank" rel="nofollow">Creating and using secrets in GitHub Actions</a>.</li>
    <li>You should create as many parallel jobs as you need with <a href="https://help.github.com/en/articles/workflow-syntax-for-github-actions#jobsjob_idstrategymatrix" target="_blank" rel="nofollow"><i>matrix</i> property</a>. If your test suite is slow you should use more parallel jobs. See comment in below config.</li>
  </ul>

  <p>
  Below you can find full GitHub Actions config for Ruby on Rails project.
  </p>

{% highlight yaml %}
{% raw %}
# .github/workflows/main.yaml
name: Main

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest

    # If you need DB like PostgreSQL, Redis then define service below.
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

</div>


<div id="guide-provider-codefresh" class="hidden">
  <h4>Step for Codefresh.io</h4>

  <p>
  knapsack_pro gem supports environment variables provided by Codefresh.io to run your tests. You will have to define a few things in <code class="highlighter-rouge">.codefresh/codefresh.yml</code> config file.
  </p>

  <ul>
    <li>
      You need to set an API token like <code class="highlighter-rouge">KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC</code> in Codefresh dashboard, see left menu Pipelines -> settings (cog icon next to the pipeline) -> Variables tab (see a vertical menu on the right side). Add there new API token depending on the test runner you use:
      <ul>
        <li><code class="highlighter-rouge">KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC</code></li>
        <li><code class="highlighter-rouge">KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER</code></li>
        <li><code class="highlighter-rouge">KNAPSACK_PRO_TEST_SUITE_TOKEN_MINITEST</code></li>
        <li><code class="highlighter-rouge">KNAPSACK_PRO_TEST_SUITE_TEST_UNIT</code></li>
        <li><code class="highlighter-rouge">KNAPSACK_PRO_TEST_SUITE_TOKEN_SPINACH</code></li>
      </ul>
    </li>
    <li>Set where Codefresh YAML file can be found. In Codefresh dashboard, see left menu Pipelines -> settings (cog icon next to pipeline) -> Workflow tab (horizontal menu on the top) -> Path to YAML (set there <code class="highlighter-rouge">./.codefresh/codefresh.yml</code>).</li>
    <li>Set how many parallel jobs (parallel CI nodes) you want to run with <code class="highlighter-rouge">KNAPSACK_PRO_CI_NODE_TOTAL</code> environment variable in <code class="highlighter-rouge">.codefresh/codefresh.yml</code> file.</li>
    <li>Ensure in the <code class="highlighter-rouge">matrix</code> section you listed all <code class="highlighter-rouge">KNAPSACK_PRO_CI_NODE_INDEX</code> environment variables with a value from <code class="highlighter-rouge">0</code> to <code class="highlighter-rouge">KNAPSACK_PRO_CI_NODE_TOTAL-1</code>. Codefresh will generate a matrix of parallel jobs where each job has a different value for <code class="highlighter-rouge">KNAPSACK_PRO_CI_NODE_INDEX</code>. Thanks to that Knapsack Pro knows what tests should be run on each parallel job.</li>
  </ul>

  <p>
  Below you can find Codefresh YAML config and <code class="highlighter-rouge">Test.Dockerfile</code> used by Codefresh to run Ruby on Rails project with PostgreSQL inside of Docker container.
  </p>

  <p>
  Add <code class="highlighter-rouge">.codefresh/codefresh.yml</code> and <code class="highlighter-rouge">Test.Dockerfile</code> files to your project repository.
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
        # please ensure you have here listed N-1 indexes
        # where N is KNAPSACK_PRO_CI_NODE_TOTAL
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

      # you can use Knapsack Pro in Queue Mode once recorded first CI build with Regular Mode
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

# Use libxml2, libxslt a packages from alpine for building nokogiri
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
  <h4>Step for other CI provider</h4>

  <p>
  Set below global variables on your CI server.
  </p>

  <p>
  Git installed on the CI server will be used to determine branch name and current commit hash.
  </p>

{% highlight bash %}
KNAPSACK_PRO_REPOSITORY_ADAPTER=git
{% endhighlight %}

  <p>
  Path to the project repository on CI server, for instance:
  </p>

{% highlight bash %}
KNAPSACK_PRO_PROJECT_DIR=/home/ubuntu/my-app-repository
{% endhighlight %}

<p>
You can <a href="https://github.com/KnapsackPro/knapsack_pro-ruby#repository-adapter-how-to-set-up-3-of-3" target="_blank">learn more about those variables here</a> and see what to do when you don't use git.
</p>

<h4>Set API token</h4>

<p>
You must set different API token on your CI server for each test suite you have:
</p>

{% highlight bash %}
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

{% highlight bash %}
# Command for first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:rspec

# Command for second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:rspec
{% endhighlight %}

<p>
Step for minitest
</p>

{% highlight bash %}
# Command for first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:minitest

# Command for second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:minitest
{% endhighlight %}

<p>
Step for test-unit
</p>

{% highlight bash %}
# Command for first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:test_unit

# Command for second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:test_unit
{% endhighlight %}

<p>
Step for cucumber
</p>

{% highlight bash %}
# Command for first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:cucumber

# Command for second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:cucumber
{% endhighlight %}

<p>
Step for spinach
</p>

{% highlight bash %}
# Command for first CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=0 bundle exec rake knapsack_pro:spinach

# Command for second CI node
KNAPSACK_PRO_CI_NODE_TOTAL=2 KNAPSACK_PRO_CI_NODE_INDEX=1 bundle exec rake knapsack_pro:spinach
{% endhighlight %}

<p>
If you have more CI nodes then update accordingly:
</p>

{% highlight plain %}
KNAPSACK_PRO_CI_NODE_TOTAL - total number of your CI nodes
KNAPSACK_PRO_CI_NODE_INDEX - starts from 0, it's index of each CI node
{% endhighlight %}
  </div>
</div>

<div id="guide-final-step" class="hidden">
  <h4>
  Verify all works in Regular Mode which does static split of tests (step 1 out of 3)
  </h4>

  <p>
  Now you are ready to use the gem!
  </p>

  <p>
  Please push a new commit to repository so knapsack_pro gem will record time execution of your test suite.
  Note the first run will not be optimal because knapsack_pro needs to first record time execution data.
  </p>

  <p>
  Go to <a href="https://knapsackpro.com/dashboard" target="_blank">user dashboard</a> and click <b>Build metrics</b> link next to your API token. Click <b>Show</b> link on recent build and ensure the time execution data were recorded for all your CI nodes. You should see info that build subsets were collected.
  </p>

  <p>
  <strong>Your second test suite run on CI will be parallelized with optimal test suite split if first run was recorded correctly.</strong>
  </p>

  <h4>How to split tests in a dynamic way to auto-balance tests timing across CI nodes in Queue Mode (step 2 out of 3)</h4>

  <p>
  Once you confirm the knapsack_pro Regular Mode works and your tests are green then you may want to <a href="https://github.com/KnapsackPro/knapsack_pro-ruby#queue-mode" target="_blank">learn about Queue Mode and how to enable it</a>.
  </p>

  <p>
  <b>Please ensure you have explicitly set <code class="highlighter-rouge">RAILS_ENV=test</code> on your CI nodes. You can add it to your CI environment variables configuration. It is needed for Queue Mode to run correctly.</b>
  </p>

{% highlight bash %}
# Example command for Regular Mode in RSpec
bundle exec rake knapsack_pro:rspec

# Example command for Queue Mode in RSpec >= 3.x
bundle exec rake knapsack_pro:queue:rspec

# Example command for Queue Mode in Minitest
bundle exec rake knapsack_pro:queue:minitest

# Example command for Queue Mode in Cucumber
# If you use spring gem and spring-commands-cucumber gem to start Cucumber tests faster please set
# export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bundle exec spring
# or you can use spring binstub
# export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bin/spring
# Thanks to that Cucumber will start tests faster for each batch of tests fetched from Knapsack Pro Queue API
bundle exec rake knapsack_pro:queue:cucumber
{% endhighlight %}

  <p>
  I recommend using Regular Mode first in order to record time execution data for your project. You could also use Queue Mode to do that but it will be much slower when you record your first build. Please ensure your tests are green in Regular Mode and there are no order dependent test failures before trying Queue Mode.
  </p>

  <p>
  <strong>Note for Queue Mode</strong> if you use CI provider that allows you to just retry a single CI node (for instance Travis CI when tests failed only on one of parallel CI nodes) or when you use CI nodes on servers that can be killed during runtime (for instance you use Buildkite CI provider with Amazon EC2 Spot Instances/Google Cloud Preemptible that can be preempted during CI run) then in Queue Mode you need to set flag <a href="https://github.com/KnapsackPro/knapsack_pro-ruby#knapsack_pro_fixed_queue_split-remember-queue-split-on-retry-ci-node" target="_blank"><b>KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true</b></a> in order to handle those CI providers correctly.
  </p>

  <p>
  <strong>Important step for CI providers that allow to retry only single failed CI node (like Buildkite)</strong>: See <a href="https://github.com/KnapsackPro/knapsack_pro-ruby#required-ci-configuration-if-you-use-retry-single-failed-ci-node-feature-on-your-ci-server-when-knapsack_pro_fixed_queue_splittrue-in-queue-mode-or-knapsack_pro_fixed_test_suite_splittrue-in-regular-mode" target="_blank">required CI configuration if you use retry single failed CI node feature on your CI server</a> when KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true (in Queue Mode) or KNAPSACK_PRO_FIXED_TEST_SUITE_SPLIT=true (in Regular Mode).
  </p>

  <p>
  <strong>Common problems for Queue Mode</strong> If you notice any test failures for RSpec when using knapsack_pro Queue Mode then it means your test suite needs to be adjusted to work with underlying RSpec::Core::Runner that is used by knapsack_pro Queue Mode. Please see this <a href="https://knapsackpro.com/faq/question/why-when-i-use-queue-mode-for-rspec-then-my-tests-fail" target="_blank">FAQ and common Queue Mode problems</a>.<br>
  <br>
  If your problem is different please <a href="https://knapsackpro.com/contact" target="_blank">contact us</a>. We saw many projects and each test suite has different edge cases that sometimes make RSpec fail.
  </p>

  <p>
  You can learn more about custom configuration and other <a href="https://knapsackpro.com/features" target="_blank">features</a> in <a href="https://github.com/KnapsackPro/knapsack_pro-ruby#table-of-contents" target="_blank">documentation</a>.
  If you have problems please check <a href="https://knapsackpro.com/faq" target="_blank">FAQ</a> there.
  </p>

  <p>
  Common thing people look for is to use <a href="https://knapsackpro.com/faq/question/how-to-use-junit-formatter" target="_blank">junit formatter</a> with RSpec or Cucumber or how to use <a href="https://knapsackpro.com/faq/question/how-to-use-codeclimate-with-knapsack_pro" target="_blank">CodeClimate</a> or <a href="https://knapsackpro.com/faq/question/how-to-use-simplecov-in-queue-mode" target="_blank">SimpleCov</a> with knapsack_pro gem.
  </p>

  <p>
  Feel free to ask questions if you need help. <a href="https://knapsackpro.com/contact" target="_blank">Contact us</a>.
  </p>

  <h4>How to split slow test files across parallel CI nodes (step 3 out of 3)</h4>

  <p>
  If your test suite has very slow test files then the <a href="https://github.com/KnapsackPro/knapsack_pro-ruby#split-test-files-by-test-cases" target="_blank">slow test file can be auto split on parallel CI nodes with knapsack_pro gem</a>. It works in Regular Mode and Queue Mode.
  </p>

{% highlight bash %}
# enable RSpec slow test files split by test examples
KNAPSACK_PRO_RSPEC_SPLIT_BY_TEST_EXAMPLES=true
{% endhighlight %}

  <p>
  If too much debug logs from knapsack_pro gem will be annoying for you then you can change the log level to:
  </p>

{% highlight bash %}
KNAPSACK_PRO_LOG_LEVEL=info
{% endhighlight %}

  <p>Read more about <a href="https://github.com/KnapsackPro/knapsack_pro-ruby#how-can-i-change-log-level" target="_blank">log levels in knapsack_pro gem</a>.</p>

  <h4>Most asked questions from FAQ</h4>

  <p>
  The most common problems can be found in <a href="https://knapsackpro.com/faq" target="_blank">FAQ</a> but here are listed the top questions developers ask for.
  </p>

  <p>
    <ul>
      <li><a href="https://knapsackpro.com/faq/question/why-when-i-use-queue-mode-for-rspec-then-my-tests-fail" target="_blank">Why when I use Queue Mode for RSpec then my tests fail?</a> - When you use RSpec please use Knapsack Pro Regular Mode first before you try Queue Mode as it is suggested in this installation guide.</li>
      <li><a href="https://github.com/KnapsackPro/knapsack_pro-ruby#knapsack_pro_fixed_queue_split-remember-queue-split-on-retry-ci-node" target="_blank">How to retry only single CI node with failed tests for Queue Mode?</a> - If your CI provider allows retrying a single CI node from list of parallel nodes instead of running a whole CI build then you should set KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true to allow Knapsack Pro remember what tests where executed on particular CI node. Thanks to that when you retry failed CI node then the same set of tests will be executed there.</li>
      <li><a href="https://knapsackpro.com/faq/question/why-knapsack_pro-hangs--freezes--is-stale-ie-for-codeship-in-queue-mode" target="_blank">Why my CI tests output freezes?</a></li>
      <li><a href="https://knapsackpro.com/faq/question/how-to-use-junit-formatter" target="_blank">How to use JUnit formatter with Knapsack Pro?</a></li>
      <li><a href="https://knapsackpro.com/faq/question/how-to-use-simplecov-in-queue-mode" target="_blank">How to use simplecov in Queue Mode?</a></li>
      <li><a href="https://knapsackpro.com/faq/question/how-to-use-codeclimate-with-knapsack_pro" target="_blank">How to use CodeClimate with knapsack_pro ruby gem?</a></li>
      <li><a href="https://github.com/KnapsackPro/knapsack_pro-ruby#test-file-names-encryption" target="_blank">How to encrypt test files names for Ruby tests?</a></li>
      <li><a href="https://knapsackpro.com/faq/question/what-data-is-sent-to-your-servers" target="_blank">Questions around data usage and security</a> - Knapsack Pro does not have access to your project source code. It collects only branch names, git commit hashes and test file paths with its recorded execution time.</li>
      <li><a href="https://knapsackpro.com/faq/question/how-can-i-run-tests-from-multiple-directories" target="_blank">How to run tests based on pattern</a> - you must set KNAPSACK_PRO_TEST_FILE_PATTERN instead of passing --pattern to RSpec</li>
      <li><a href="https://knapsackpro.com/faq/question/how-to-run-a-specific-list-of-test-files-or-only-some-tests-from-test-file" target="_blank">How to run a specific list of test files or only some tests from test file?</a></li>
      <li><a href="https://knapsackpro.com/faq/question/how-to-exclude-tests-from-running-them" target="_blank">How to exclude tests from running them?</a></li>
    </ul>
  </p>
</div>
