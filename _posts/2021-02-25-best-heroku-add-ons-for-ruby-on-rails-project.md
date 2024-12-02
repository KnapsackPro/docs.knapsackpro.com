---
layout: post
title:  "Best Heroku add-ons for Ruby on Rails project"
date:   2021-02-25 08:00:00 +0100
author: "Artur Trzop"
categories: techtips
og_image: "/images/blog/posts/best-heroku-add-ons-for-ruby-on-rails-project/heroku_addons.jpeg"
---

After working for over 8 years with Heroku and Ruby on Rails projects I have my own favorite set of Heroku add-ons that work great with Rails apps. You are about to learn about the add-ons that come in handy in your daily Ruby developer life.

<img src="/images/blog/posts/best-heroku-add-ons-for-ruby-on-rails-project/heroku_addons.jpeg" style="width:300px;margin-left: 15px;float:right;" alt="Heroku, Heroku Marketplace, Heroku add-on, add-on, add-ons, Ruby, RoR, Rails, Ruby on Rails" />

## Heroku add-ons

Here it is, a list of my favorite Heroku add-ons from Heroku Marketplace and why I choose them for my Ruby on Rails projects hosted on Heroku.

### Heroku Scheduler

[Heroku Scheduler](https://elements.heroku.com/addons/scheduler) can run scheduled tasks every 10 minutes, every hour, or every day. I use it to run my scheduled rake tasks. For instance every day I run a rake task that will send a summary of users who signed up in the last 24 hours to my mailbox.

Heroku Scheduler add-on is free. The only limitation is that it has fewer options than the cron in the Unix system. If you need to run a rake task every Monday then you need to set up a rake task as a daily task in Heroku Scheduler and do a check of the day in the rake task itself to skip it when needed.

{% highlight ruby %}
# lib/tasks/schedule/notify_users_about_past_due_subscription.rake
namespace :schedule do
  desc 'Send notification about past due subscriptions to users'
  task notify_users_about_past_due_subscription: :environment do
    if Time.current.monday?
      Billing::NotifyUsersAboutPastDueSubscriptionWorker.perform_async
    else
      Rails.logger.info("Skip schedule:notify_users_about_past_due_subscription task.")
    end
  end
end
{% endhighlight %}

### New Relic APM

[New Relic](https://elements.heroku.com/addons/newrelic) add-on does application performance monitoring. It's one of my favorite add-ons. It allows to track each process like puma/unicorn/sidekiq per dyno and its performance. You can see which Rails controller actions take the most time. You can see your API endpoints with the highest throughput and those which are time-consuming. New Relic helped me many times to debug bottlenecks in my app and thanks to that I was able to make [Knapsack Pro API](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=best-heroku-add-ons-for-ruby-on-rails-project) with an average 50ms response time. Who said the Rails app has to be slow? :)

<img src="/images/blog/posts/best-heroku-add-ons-for-ruby-on-rails-project/new_relic_api_response_time.png" alt="New Relic, response time, Rails, Ruby, API" />

### Rollbar

[Rollbar](https://elements.heroku.com/addons/rollbar) allows for exception tracking in your Ruby code and also in JS code on the front end side. It has a generous free plan with a 5000 exception limit per month.

You can easily ignore some common Rails exceptions to stay within the free plan limit.

{% highlight ruby %}
# config/initializers/rollbar.rb
Rollbar.configure do |config|
  config.access_token = ENV['ROLLBAR_ACCESS_TOKEN']

  if Rails.env.test? || Rails.env.development?
    config.enabled = false
  end

  # Add exception class names to the exception_level_filters hash to
  # change the level that exception is reported at. Note that if an exception
  # has already been reported and logged the level will need to be changed
  # via the rollbar interface.
  # Valid levels: 'critical', 'error', 'warning', 'info', 'debug', 'ignore'
  # 'ignore' will cause the exception to not be reported at all.
  config.exception_level_filters.merge!('ActionController::RoutingError' => 'ignore')
  config.exception_level_filters.merge!('ActionController::InvalidAuthenticityToken' => 'ignore')
  config.exception_level_filters.merge!('ActionController::BadRequest' => 'ignore')
  config.exception_level_filters.merge!('ActiveRecord::RecordNotFound' => 'ignore')
  config.exception_level_filters.merge!('Rack::Timeout::RequestTimeoutException' => 'ignore')
  config.exception_level_filters.merge!('Rack::QueryParser::InvalidParameterError' => 'ignore')
  config.exception_level_filters.merge!('ActionDispatch::Http::MimeNegotiation::InvalidType' => 'ignore')

  config.environment = ENV['ROLLBAR_ENV'].presence || Rails.env
end
{% endhighlight %}

### Redis Cloud

If you use Redis in your Ruby on Rails app then [Redis Cloud](https://elements.heroku.com/addons/rediscloud) is your add-on. It has a free plan and paid plans are more affordable than other add-ons have.

Redis Cloud add-on does automatic backups of your data and offers a nice web UI to preview the live Redis usage and historical usage of your database instance.

<img src="/images/blog/posts/best-heroku-add-ons-for-ruby-on-rails-project/redis_cloud_graphs.png" alt="Redis Cloud, Redis" />

I like to use Redis Cloud + sidekiq gem in my Rails apps. Also, Redis is useful if you need to cache some data quickly in the memory and expire it after some time.

{% highlight ruby %}
redis_connection = Redis.new(
  # use REDISCLOUD_URL when app is running on Heroku,
  # or fallback to local Redis (useful for development)
  url: ENV.fetch('REDISCLOUD_URL', 'redis://localhost:6379/0'),
  # tune network timeouts to be a little more lenient when you are seeing occasional timeout
  # errors for Heroku Redis Cloud addon
  # https://github.com/mperham/sidekiq/wiki/Using-Redis#life-in-the-cloud
  timeout: 5
)

redis_connection.setex('my-key-name', 1.hour, 'this value will expire in 1 hour')
{% endhighlight %}

### Twilio SendGrid

[SendGrid](https://elements.heroku.com/addons/sendgrid) is a free add-on that allows you to start sending emails from your Ruby on Rails. You can even connect your domain to it so your users get emails from your domain.

There are free 12,000 emails per month in the free plan.

## Heroku Add-on to save you time & money

Here are a few of my favorite add-ons that will help you save money and time in your project.

### AutoIdle

[AutoIdle](https://elements.heroku.com/addons/autoidle) lets you save money by automatically putting your staging and review apps to sleep on Heroku. I use it to turn off my web and worker dyno for the staging app when there is no traffic to the app. No more paying for Heroku resources during the night and weekends. ;)

<img src="/images/blog/posts/best-heroku-add-ons-for-ruby-on-rails-project/autoidle.png" alt="AutoIdle, Heroku" />

### Rails Autoscale

[Rails Autoscale](https://elements.heroku.com/addons/rails-autoscale) is a powerful add-on that will help you save money on Heroku. It will measure requests queue time and based on that add or remove dynos for your web processes. If you have higher traffic during the day it will add more dynos. During the night when the traffic is low, it will remove dynos.

<img src="/images/blog/posts/best-heroku-add-ons-for-ruby-on-rails-project/rails_autoscale_graph.png" alt="Rails Autoscale, Heroku, request queue" />

Rails Autoscale can also track your worker queue. For instance, if you have a lot of jobs scheduled in Sidekiq then Rails Autoscale will add more worker dynos to process your job queue faster. It can even shut down worker dyno when there are no jobs to be processed which can save you even more money.

### Knapsack Pro

[Knapsack Pro](https://elements.heroku.com/addons/knapsack-pro) is a Heroku add-on and ruby gem that can run your Rails tests in RSpec, Cucumber, Minitest, etc, and automatically split the tests between parallel machines on any CI server. It works with Heroku CI, CircleCI, Buildkite, Travis CI, etc. It will help you save time by doing [a dynamic split of tests with Queue Mode](/2020/how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation) to ensure all parallel jobs finish work at a similar time. This way you optimize your CI build runs and save the most time.

Below you can see an example of the optimal distribution of tests, where each parallel CI machine performs tests for 10 minutes, thanks to which the entire CI build lasts only 10 minutes instead of 40 if you would run tests on a single CI server only.

<img src="/images/blog/posts/how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation/optimal-tests-split.png" style="width:100%;" alt="optimal tests split on CI server, CI parallelism" />

I've been working on the [Knapsack Pro add-on](https://elements.heroku.com/addons/knapsack-pro) and I'd love to hear your feedback if you give it a try.
