---
layout: post
title:  "Clean RSpec configuration directory structure for Ruby on Rails gems needed in testing"
date:   2018-11-08 12:00:00 +0100
author: "Artur Trzop"
categories: techtips rspec ruby rails testing gems
og_image: "/images/blog/posts/clean-rspec-configuration-directory-structure-for-ruby-on-rails-gems-needed-in-testing/rspec.jpg"
---

When your Ruby on Rails project is getting bigger your test suite as well. You need to test more of your business logic and sometimes you will use other gems that can help you with that. Most of the time you may need something like `database_cleaner`, `capybara` for feature tests or `rspec-sidekiq` to test your workers.

<img src="/images/blog/posts/clean-rspec-configuration-directory-structure-for-ruby-on-rails-gems-needed-in-testing/rspec.jpg" style="width:250px;margin-left: 15px;float:right;" />

Adding new gems needed for testing often requires changes in RSpec configuration. You add a new line of config here and there in the `spec_helper.rb` or `rails_helper.rb` file and suddenly you have huge and hard to understand config file for RSpec.

I will show you how I organize my RSpec configuration directory structure to easily add or modify the RSpec configuration in a clean way.

## Prepare RSpec config directory structure

I keep all of my configuration code related to RSpec in directory `spec/support/config`. You can create it.

Next step is to ensure the RSpec will read files from the config directory. In order to do it please ensure you have below line in your `spec/rails_helper.rb` file.

{% highlight ruby %}
Dir[Rails.root.join('spec/support/**/*.rb')].each { |f| require f }
{% endhighlight %}

By default, it is commented out so please uncomment it.

## Separate config files for different testing gems

Here I will show you examples of popular gems and how to keep their configuration clean. A few examples are on the video and many more code examples are in this article.

<iframe width="560" height="315" src="https://www.youtube.com/embed/M0-ZQkYoQmI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Configuration for Database Cleaner

For [database_cleaner](https://github.com/DatabaseCleaner/database_cleaner) gem you can just create config file `spec/support/config/database_cleaner.rb`:

{% highlight ruby %}
# spec/support/config/database_cleaner.rb
require 'database_cleaner'

RSpec.configure do |config|
  config.before(:suite) do
    DatabaseCleaner.strategy = :deletion
    DatabaseCleaner.clean_with(:deletion)
  end

  config.around(:each) do |example|
    DatabaseCleaner.cleaning do
      example.run
    end
  end
end
{% endhighlight %}

## Configuration for Capybara

Here is my configuration of Capybara placed at `spec/support/config/capybara.rb`.

{% highlight ruby %}
# spec/support/config/capybara.rb
require 'capybara/rspec'

JS_DRIVER = :selenium_chrome_headless
DEFAULT_MAX_WAIT_TIME = ENV['CI'] ? 5 : 2

Capybara.default_driver = :rack_test
Capybara.javascript_driver = JS_DRIVER
Capybara.default_max_wait_time = DEFAULT_MAX_WAIT_TIME

RSpec.configure do |config|
  config.before(:each) do |example|
    Capybara.current_driver = JS_DRIVER if example.metadata[:js]
    Capybara.current_driver = :selenium if example.metadata[:selenium]
    Capybara.current_driver = :selenium_chrome if example.metadata[:selenium_chrome]

    Capybara.default_max_wait_time = example.metadata[:max_wait_time] if example.metadata[:max_wait_time]
  end

  config.after(:each) do |example|
    Capybara.use_default_driver if example.metadata[:js] || example.metadata[:selenium]
    Capybara.default_max_wait_time = DEFAULT_MAX_WAIT_TIME if example.metadata[:max_wait_time]
  end
end
{% endhighlight %}

I have a few custom things here like easy option to switch between different browsers executing my tests by just adding tag like `:selenium_chrome` to test:

{% highlight ruby %}
# spec/features/example_feature_spec.rb
it 'something', :selenium_chrome do
  visit '/'
  expect(page).to have_content 'Welcome'
end
{% endhighlight %}

You can learn more [how to configure Capybara with Chrome headless](/2017/circleci-2-0-capybara-feature-specs-selenium-webdriver-with-chrome-headless) here.

## Configuration for Sidekiq

I like keep my Sidekiq configuration with other useful Sidekiq related gems in one place `spec/support/config/sidekiq.rb`:

{% highlight ruby %}
# spec/support/config/sidekiq.rb
require 'rspec-sidekiq'
require 'sidekiq/testing'
require 'sidekiq_unique_jobs/testing'

RSpec.configure do |config|
  config.before(:each) do
    Sidekiq::Worker.clear_all

    # https://github.com/mperham/sidekiq/wiki/Testing#testing-worker-queueing-fake
    if RSpec.current_example.metadata[:sidekiq_fake]
      Sidekiq::Testing.fake!
    end

    # https://github.com/mperham/sidekiq/wiki/Testing#testing-workers-inline
    if RSpec.current_example.metadata[:sidekiq_inline]
      Sidekiq::Testing.inline!
    end
  end

  config.after(:each) do
    if RSpec.current_example.metadata[:sidekiq_fake] || RSpec.current_example.metadata[:sidekiq_inline]
      Sidekiq::Testing.disable!
    end
  end
end

RSpec::Sidekiq.configure do |config|
  config.warn_when_jobs_not_processed_by_sidekiq = false
end
{% endhighlight %}

I use gems like [sidekiq-unique-jobs](https://github.com/mhenrixon/sidekiq-unique-jobs) and [rspec-sidekiq](https://github.com/philostler/rspec-sidekiq). Here you can read more about [Sidekiq testing](https://github.com/mperham/sidekiq/wiki/Testing) configuration.

## Configuration for FactoryBot (known as FactoryGirl)

[FactoryBot](https://github.com/thoughtbot/factory_bot_rails) config file for Ruby on Rails can be isolated at `spec/support/config/factory_bot.rb`:

{% highlight ruby %}
# spec/support/config/factory_bot.rb
RSpec.configure do |config|
  config.include FactoryBot::Syntax::Methods
end
{% endhighlight %}

## Configuration for JSON Spec

If you have API endpoints in your application you may like the [json_spec](https://github.com/collectiveidea/json_spec) gem that can help you test JSON responses. Here is my config at `spec/support/config/json_spec.rb`

{% highlight ruby %}
# spec/support/config/json_spec.rb
require 'json_spec'

RSpec.configure do |config|
  config.include JsonSpec::Helpers
end
{% endhighlight %}

## Configuration for RSpec Retry

Sometimes big projects have painful tests that randomly fail. The last rescue when we cannot make them stable and always green is to retry them a few times before marking them as failed. This is one option how to deal with flaky tests and we can use for that [rspec-retry](https://github.com/NoRedInk/rspec-retry) gem.

{% highlight ruby %}
# spec/support/config/rspec_retry.rb
RSpec.configure do |config|
  # show retry status in spec process
  config.verbose_retry = true
  # show exception that triggers a retry if verbose_retry is set to true
  config.display_try_failure_messages = true

  # run retry only on features
  config.around :each, :js do |ex|
    ex.run_with_retry retry: 3
  end

  # callback to be run between retries
  config.retry_callback = proc do |ex|
    # run some additional clean up task - can be filtered by example metadata
    if ex.metadata[:js]
      Capybara.reset!
    end
  end
end
{% endhighlight %}

Here you can learn more about how to deal with flaky tests:

<iframe width="560" height="315" src="https://www.youtube.com/embed/Cg6GpEYfO9s" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Configuration for Shoulda Matchers

[Shoulda Matchers](https://github.com/thoughtbot/shoulda-matchers) provides RSpec and Minitest-compatible one-liners that test common Rails functionality. Here is my config `spec/support/config/shoulda_matchers.rb`:

{% highlight ruby %}
# spec/support/config/shoulda_matchers.rb
require 'shoulda/matchers'

Shoulda::Matchers.configure do |config|
  config.integrate do |with|
    # Choose a test framework:
    with.test_framework :rspec
    #with.test_framework :minitest
    #with.test_framework :minitest_4
    #with.test_framework :test_unit

    # Choose one or more libraries:
    #with.library :active_record
    #with.library :active_model
    #with.library :action_controller
    # Or, choose the following (which implies all of the above):
    with.library :rails
  end
end
{% endhighlight %}

## Configuration for VCR and WebMock

You can record your requests in testing with [VCR](https://github.com/vcr/vcr) or mock request with [WebMock](https://github.com/bblimke/webmock). This is my config `spec/support/config/vcr.rb`:

{% highlight ruby %}
# spec/support/config/vcr.rb
require 'vcr'

VCR.configure do |config|
  config.cassette_library_dir = 'spec/fixtures/vcr_cassettes'
  config.hook_into :webmock # or :fakeweb
  config.allow_http_connections_when_no_cassette = true
  config.ignore_hosts(
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    'example.com',
  )
end

WebMock.disable_net_connect!(allow: [
  'example.com',
])
{% endhighlight %}

## Configuration for Knapsack Pro to split test suite across parallel CI nodes

If you have a large test suite taking a dozen of minutes or maybe even hours then you may want to [run tests in parallel across multiple CI node with Knapsack Pro](http://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=clean-rspec-configuration-directory-structure-for-ruby-on-rails-gems-needed-in-testing) to get the fastest CI build.

This is example config file.

{% highlight ruby %}
# spec/support/config/knapsack_pro.rb
require 'knapsack_pro'
KnapsackPro::Adapters::RSpecAdapter.bind
{% endhighlight %}

Here you can learn more about how it works.

<iframe width="560" height="315" src="https://www.youtube.com/embed/rF5dokNqsMA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Configuration for Page Objects

You can keep your page objects in a separate directory. Page objects can be later reused in multiple tests.
Create directory `spec/support/page_objects`. Here is example page object for billing page:

{% highlight ruby %}
# spec/support/page_objects/billing_page.rb
class BillingPage
  def self.fill_company_details(
    first_name: 'Kayleigh',
    last_name: 'Johnston',
    company: 'Example Company',
    vat_id: 'UK1234567890',
    email: 'kayleigh.johnston@example.com',
    street_address: '59 Botley Road',
    locality: 'Midtown',
    region: '', # can be blank
    postal_code: 'IV27 5LL',
    country_name: 'United Kingdom',
    website: 'http://example.com'
  )
    Capybara.fill_in 'first_name', with: first_name
    Capybara.fill_in 'last_name', with: last_name
    Capybara.fill_in 'company', with: company
    Capybara.fill_in 'vat_id', with: vat_id
    Capybara.fill_in 'email', with: email
    Capybara.fill_in 'street_address', with: street_address
    Capybara.fill_in 'locality', with: locality
    Capybara.fill_in 'region', with: region
    Capybara.fill_in 'postal_code', with: postal_code
    Capybara.select country_name, from: 'country_name'
    Capybara.fill_in 'website', with: website
  end
end
{% endhighlight %}

Then you can use the page object in your feature spec.

{% highlight ruby %}
# spec/features/billing_spec.rb
it 'fills company details on billing page' do
  BillingPage.fill_company_details
end
{% endhighlight %}

## Configuration for shared examples

You can organize your [RSpec shared examples](https://relishapp.com/rspec/rspec-core/docs/example-groups/shared-examples) in directory `spec/support/shared_examples` that will be autoloaded.

## Summary

As you can see there are a lot of different useful gems for testing in RSpec. If we would keep all their configuration just in `spec_helper.rb` we would quickly get a messy file. Separation of config files can help us keep it clean and easy to maintain. Let me know in comments how you keep your config files sane.
