---
layout: post
title:  "CircleCI 2.0 Capybara feature specs - Selenium webdriver with Chrome headless"
date:   2017-10-16 21:00:00 +0200
author: "Artur Trzop"
categories: ruby rails "Circle CI 2.0" capybara "Chrome headless"
og_image: "/images/blog/posts/circleci-2-0-capybara-feature-specs-selenium-webdriver-with-chrome-headless/circle.png"
---

I’ve been using Capybara-WebKit for a long time but while switching from CircleCI 1.0 to CircleCI 2.0 I had some problems to use it on the CI.

This triggered to try Chrome Headless with Selenium Webdriver.  I will show you how to configure Circle CI 2.0 and your Ruby on Rails project to use capybara/selenium/chrome headless together.

<img src="/images/blog/posts/circleci-2-0-capybara-feature-specs-selenium-webdriver-with-chrome-headless/circle.png" style="width:250px;margin-left: 15px;float:right;" />

## Add capybara and selenium-webdriver

Let's add [capybara](https://github.com/teamcapybara/capybara) and [selenium-webdriver](https://github.com/seleniumhq/selenium) gems to `Gemfile`:

{% highlight ruby %}
# Gemfile
group :development, :test do
  gem 'capybara'
  gem 'selenium-webdriver'
end
{% endhighlight %}

and run `bundle install`.

If you already had the gems in your `Gemfile` then ensure you have latest version with `bundle update capybara selenium-webdriver`.

If you want to make sure Capybara feature specs will work on your development machine:

{% highlight shell %}
$ brew install chromedriver
{% endhighlight %}

If your feature specs fail then upgrade the driver because you may have installed old one.

{% highlight shell %}
$ brew upgrade chromedriver
{% endhighlight %}

## Configure Capybara

Add config file for Capybara:

{% highlight ruby %}
# spec/support/config/capybara.rb
JS_DRIVER = :selenium_chrome_headless

Capybara.default_driver = :rack_test
Capybara.javascript_driver = JS_DRIVER
Capybara.default_max_wait_time = 2

RSpec.configure do |config|
  config.before(:each) do |example|
    Capybara.current_driver = JS_DRIVER if example.metadata[:js]
    Capybara.current_driver = :selenium if example.metadata[:selenium]
    Capybara.current_driver = :selenium_chrome if example.metadata[:selenium_chrome]
  end

  config.after(:each) do
    Capybara.use_default_driver
  end
end
{% endhighlight %}

Ensure you load config files from `spec/support` directory:

{% highlight ruby %}
# spec/rails_helper.rb

# The following line is provided for convenience purposes. It has the downside
# of increasing the boot-up time by auto-requiring all files in the support
# directory. Alternatively, in the individual `*_spec.rb` files, manually
# require only the support files necessary.
Dir[Rails.root.join('spec/support/**/*.rb')].each { |f| require f }
{% endhighlight %}

## Example feature spec

We can create example feature spec to test if everything works:

{% highlight ruby %}
# spec/features/home_spec.rb
feature 'Homepage Features' do
  before { visit root_path }

  # it won't run js code but it is fast
  it do
    expect(page).to have_content 'Hello World'
  end

  # it will run js code
  it '', :js do
    expect(page).to have_content 'Hello World'
  end

  # it will open Firefox
  # remove x from xit to run the test in Firefox on your machine to preview
  xit '', :selenium do
    expect(page).to have_content 'Hello World'
  end

  # it will open Chrome
  # remove x from xit to run the test in Chrome on your machine to preview
  xit '', :selenium_chrome do
    expect(page).to have_content 'Hello World'
  end
end
{% endhighlight %}

And run tests on your development machine with `bin/rspec spec/features/home_spec.rb` or `bundle exec rspec spec/features/home_spec.rb`.

## Configure CircleCI 2.0 to run Chrome headless

Here is example `.circleci/config.yml`:

{% highlight yaml %}
# .circleci/config.yml
version: 2
jobs:
  build:
    parallelism: 1
    working_directory: ~/project-name
    docker:
      # this is important to use proper image with browsers support
      - image: circleci/ruby:2.4.2-node-browsers
        environment:
          PGHOST: 127.0.0.1
          PGUSER: project-name
          RAILS_ENV: test
      - image: circleci/postgres:9.4.12-alpine
        environment:
          POSTGRES_DB: project-name_test
          POSTGRES_PASSWORD: ""
          POSTGRES_USER: project-name
      - image: redis:3.2.7
    steps:
      - checkout

      # Restore bundle cache
      - type: cache-restore
        # remove space between { {
        key: project-name-{ { checksum "Gemfile.lock" }}

      # Bundle install dependencies
      - run: bundle install --path vendor/bundle

      # Store bundle cache
      - type: cache-save
        # remove space between { {
        key: project-name-{ { checksum "Gemfile.lock" }}
        paths:
          - vendor/bundle

      # Prepare .env, useful if you use dotenv gem
      - run: cp .env.example .env

      # Database setup
      - run: bundle exec rake db:create
      - run: bundle exec rake db:schema:load

      # Run rspec in parallel
      - type: shell
        command: |
          bundle exec rspec --profile 10 \
                            --format RspecJunitFormatter \
                            --out /tmp/test-results/rspec.xml \
                            --format progress

      # Save artifacts
      - type: store_test_results
        path: /tmp/test-results
{% endhighlight %}

## Speed up your tests with Circle CI parallelisation

If your feature specs are very long you can save some time by running multiple parallel CI nodes. For instance set it to `6` in `.circleci/config.yml` and use dynamic RSpec specs allocation across CI nodes with `knapsack_pro` gem and Queue Mode to get optimal test suite split to save as much time as possible.

{% highlight yaml %}
# .circleci/config.yml
jobs:
  build:
    parallelism: 6

  steps:
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

You can learn [how RSpec test suite parallelisation works](http://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=circleci-2-0-capybara-feature-specs-selenium-webdriver-with-chrome-headless#x-play-how-it-works-video) in 1 minute video.

## Summary

Now you are good to push your code to a repository and see how your Capybara feature specs work with Chrome Headless on CircleCI 2.0.
