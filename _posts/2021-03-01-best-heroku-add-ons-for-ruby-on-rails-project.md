---
layout: post
title:  "Best Heroku add-ons for Ruby on Rails project"
date:   2021-03-01 08:00:00 +0100
author: "Artur Trzop"
categories: techtips
og_image: "/images/blog/posts/best-heroku-add-ons-for-ruby-on-rails-project/heroku_addons.jpeg"
---

After working for over 8 years with Heroku and Ruby on Rails projects I have my own favorite set of Heroku add-ons that work great with Rails apps. You are about to learn about the add-ons that come in handy in your daily Ruby developer life.

<img src="/images/blog/posts/best-heroku-add-ons-for-ruby-on-rails-project/heroku_addons.jpeg" style="width:300px;margin-left: 15px;float:right;" alt="Heroku, Heroku Marketplace, Heroku add-on, add-on, add-ons, Ruby, RoR, Rails, Ruby on Rails" />

## Heroku add-ons

Here it is, a list of my favorite Heroku add-ons and why I choose them for my Ruby on Rails projects hosted on Heroku.

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

[New Relic](https://elements.heroku.com/addons/newrelic) add-on does application performance monitoring. It's one of my favorite add-ons. It allows to track each process like puma/unicorn/sidekiq per dyno and its performance. You can see what Rails controller actions take the most time. You can see your API endpoints with the highest throughput and those which are time-consuming. New Relic helped me many times to debug bottlenecks in my app and thanks to that I was able to make [Knapsack Pro API](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=best-heroku-add-ons-for-ruby-on-rails-project) with an average 50ms response time. Who said the Rails app has to be slow? :)

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

### Logentries

[Logentries](https://elements.heroku.com/addons/logentries) - collects your logs from Heroku standard output so that you can browse them later on. If you need to find info about an issue that happened a few days ago in your logs then Logentries might be helpful.

Of course, you could use `heroku logs` command to browser log but it has limitations, and you can't go that much in past logs or easily filter logs as in Logentries.

Logentries has a 5GB and 7 days retention period in a free plan. This is enough for small Rails apps.

A nice feature I like in Logentries is an option to save the query and later on quickly browse logs by it. You can also display charts based on logs. Maybe you want to see how often a particular worker in Sidekiq has been called? You could visualize it.

### Redis Cloud

If you use Redis in your Ruby on Rails app then [Redis Cloud](https://elements.heroku.com/addons/rediscloud) is your add-on that you should choose from Heroku Marketplace. It has a free plan and paid plans are more affordable than other add-ons have.

Redis Cloud add-on does automatic backups of your data and offers a nice web UI to preview the live Redis usage and historical usage of your database instance.

I like to use Redis Cloud + sidekiq gem in my Rails app. Also, Redis is useful if you need to cache some data quickly in the memory and expire it after some time.

### Twilio SendGrid

[SendGrid](https://elements.heroku.com/addons/sendgrid) is a free add-on that allows you to start sending emails from your Ruby on Rails. You can even connect your domain to it so your users get emails from your domain.

There are free 12,000 emails per month in the free plan.
