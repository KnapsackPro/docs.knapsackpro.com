---
layout: post
title:  "Best Heroku add-ons for Ruby on Rails project"
date:   2021-03-01 08:00:00 +0100
author: "Artur Trzop"
categories: techtips
og_image: "/images/blog/posts/best-heroku-add-ons-for-ruby-on-rails-project/heroku.jpeg"
---

After working for over 8 years with Heroku and Ruby on Rails projects I have my own favorite set of Heroku add-ons that work great with Rails apps. You are about to learn about the add-ons that come in handy in your daily Ruby developer life.

<img src="/images/blog/posts/best-heroku-add-ons-for-ruby-on-rails-project/heroku.jpeg" style="width:300px;margin-left: 15px;float:right;" alt="RSpec, CircleCI, Ruby, gem" />

## Heroku add-ons

Here it is, a list of my favorite Heroku add-ons and why I choose them for my Ruby on Rails projects hosted on Heroku.

### Heroku Scheduler

Heroku Scheduler can run scheduled tasks every 10 minutes, every hour, or every day. I use it to run my scheduled rake tasks. For instance every day I run a rake task that will send a summary of users who signed up in the last 24 hours to my mailbox.

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
