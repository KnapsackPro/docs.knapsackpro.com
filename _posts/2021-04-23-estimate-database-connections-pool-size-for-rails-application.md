---
layout: post
title:  "Estimate database connections pool size for Rails application"
date:   2021-04-23 17:00:00 +0200
author: "Artur Trzop"
categories: techtips
og_image: "/images/blog/posts/estimate-database-connections-pool-size-for-rails-application/rails-db-pool.jpeg"
---

Configuring the database connections pool for the Rails app might not be a straightforward task for many programmers. There is a constraint of max opened connections on a database level. Your server environment configuration can change in time and affect the number of connections to the database required. For instance number of servers you use can change when you autoscale it based on the web traffic. It means that the number of web processes/threads running for Puma or Unicorn servers could change. All this adds additional complexity. When you use two databases (e.g. Postgres + Redis), everything gets more complex. In this article, we will address that. You will learn how to estimate needed database connections for your Ruby on Rails production application.

<img src="/images/blog/posts/estimate-database-connections-pool-size-for-rails-application/rails-db-pool.jpeg" style="width:400px;margin-left: 15px;float:right;" alt="Rails, RoR, DB, database, pool" />

## Why do available database connections matter?

The first question is, why do you need to care about available database connections? The answer is simple. Suppose you configured your Ruby application to open too many DB connections. In that case, it could happen that you will get `ActiveRecord::ConnectionTimeoutError` exceptions from the application when the database cannot handle more new connections from your Rails app. It can result in 500 errors visible for your web app users.

This problem might not be apparent immediately. Often you will find out about it in production. Your application might work just fine until specific circumstances cause the Rails app to need more DB connections, which can trigger exception flood. Let's see how to avoid it.

## RoR application configuration step by step

Let's break a typical Ruby on Rails application down into smaller components that use databases.

* We have a Rails application that uses the Postgres database for ActiveRecord usage.
* We also use the Redis database for background workers like Sidekiq.

It looks simple, isn't it? Let's start with that, and later on, we will add more complexity to the mix :)

## Postgres database connections - how to check the limit?

How to check how many available connections do you have for Postgres?

* If you use a dedicated server with Postgres installed, then most likely you have a default `max_connections` which is typically 100 connections.
* If you use a Postgres instance on the AWS, then you need to check the AWS documentation to find out what's the max allowed connections to your database instance (it depends on if you use Amazon RDS or Aurora and what is server instance class)
* If you use Heroku, you can check the `Connection Limit` for the [Postgres Heroku add-on](https://elements.heroku.com/addons/heroku-postgresql#pricing) to check max acceptable connections.

## ActiveRecord connection pool

In your Rails application, the `config/database.yml` file contains the `pool` option. As explained in the [Rails docs](https://edgeguides.rubyonrails.org/configuring.html#database-pooling):

> Active Record database connections are managed by `ActiveRecord::ConnectionAdapters::ConnectionPool`, which ensures that a connection pool synchronizes the amount of thread access to a limited number of database connections.
>
> Since the connection pooling is handled inside of Active Record by default, all application servers (Thin, Puma, Unicorn, etc.) should behave the same. The database connection pool is initially empty. As demand for connections increases, it will create them until it reaches the connection pool limit.
>
> Any one request will check out a connection the first time it requires access to the database. At the end of the request, it will check the connection back in. This means that the additional connection slot will be available again for the next request in the queue.

The `pool` can be defined this way:

{% highlight yml %}
production:
  adapter: postgresql
  database: blog_production
  pool: 5
{% endhighlight %}

or as a part of a URL to the database:

{% highlight yml %}
development:
  url: postgresql://localhost/blog_production?pool=5
{% endhighlight %}

The URL option is popular when you host a database on an external server like Amazon RDS. Then you could define the URL this way:

{% highlight yml %}
production:
  url: postgres://blog_production:PASSWORD@blog-production.abcdefgh.eu-west-1.rds.amazonaws.com/blog_production?sslca=config/rds-combined-ca-bundle.pem&pool=5
{% endhighlight %}

Please note that for the production, you should not commit credentials in the `config/database.yml` file. Instead, store it in environment variables and then read the value at your Rails app's runtime.

{% highlight yml %}
production:
  url: <%= ENV['DB_URL'] %>
{% endhighlight %}

## How does ActiveRecord connection pool affects Postgres max connections?

Let's start with a simple example. Your application may use one of the application servers like Puma or Unicorn. Let's focus on Puma because it's more complex as it has a separate configuration for several processes (known as workers in Puma terms) and threads. Unicorn runs in a single thread only. It works exactly like Puma with a single thread setting.

<img src="/images/blog/posts/estimate-database-connections-pool-size-for-rails-application/puma.jpeg" style="width:400px;margin-left: 15px;float:right;" alt="Rails, RoR, DB, database, pool" />

### Puma config: 1 process and 1 thread

Let's say you use the Puma server to run the Rails application. The Puma is configured to run 1 process (worker) and it has only 1 thread.

The puma process can open up to 5 connections to the database because the `pool` option is defined as 5 in `config/database.yml`. Typically, there are fewer connections than that because when you run 1 process and only 1 thread, only 1 connection to the Postgres database will be needed to make a database query.

Sometimes the database connection might be dead. In such a case, ActiveRecord can open a new connection, and then you may end up with 2 active connections. In the worst-case scenario when 4 connections would be dead, then Rails can open 5 connections max.

### Puma config: 1 process and 2 threads

If you use 2 threads in a single Puma process (worker) then it means those 2 threads can use the same pool of DB connections within the Puma process.

It means that 2 DB connections will be open out of 5 possible. If any connection is dead, then more connections can be opened until the 5 connection pool limit is reached.

### Puma config: 2 processes and 2 threads per process

If you run 2 Puma processes (workers) and each process has 2 threads then it means that each single process will open 2 DB connections because you have 2 threads per process. You have 2 processes so it means at the start of your application, there might be 4 DB connections open. Each process has its pool, so you have 2 pools. Each pool can open up to 5 DB connections. It means that in the worst-case scenario, there can be even 10 connections created to the database.

Assuming you use 2 threads per Puma process, then it's good to have `pool` option set to 2 + some spare connections to avoid a problem when one of the DB connections is dead. When a dead connection happens, ActiveRecord can use spare connections (not opened connections yet) to open a new connection.

### Puma config: 2 processes and 2 threads, and 2 web dynos on Heroku

If you use Heroku to host your application, it allows scaling your web application horizontally by adding more servers (dynos). Assume you run your application on 2 servers (2 Heroku dynos), each dyno is running 2 Puma processes, and each process has 2 threads. It means at the start, your application may open 6 connections to the database. Here is why:

2 dynos X 2 Puma processes X 2 Puma threads = 6 DB connections

2 dynos X 2 Puma process X Pool size (5) = Total pool size 20

It means that in the worst-case your application may open 20 DB connections.

#### Autoscaling web application

If you autoscale your web servers by adding more servers during the peak web traffic, you need to be careful. Ensure your application stays within the Postgres max connections limit. The above example shows you how to calculate expected opened DB connections and the worst-case scenario.  Please adjust your pool size to ensure that you will be below the max connections limit for your database engine in the worst-case scenario.

## What else can open DB connections?

We just talked about a webserver like Puma that can open connections and consume your max DB connections limit. But other non-web processes can do it as well:

* You run Rails console on production in a Heroku dyno `heroku run bin/rails console --app=my-app-name`. It runs an instance of your Rails app, and 1 DB connection will be open. In the worst-case scenario, the number of connections defined in the `pool` can be opened. But it's unlikely that your DB connections would go dead. So the whole pool limit shouldn't be used.
* You run scheduled rake tasks via Heroku Scheduler (cron-like tool). If the rake tasks are performed periodically, they need to open a connection to the DB so that at least 1 DB connection is used from the pool per rake task. Imagine you have 10 rake tasks that are started every hour. It means you need 10 available DB connections every hour. It can be easy to miss this if you base your estimation on just the web connections.
* You use background workers like Sidekiq to perform async jobs. Your jobs may open DB connections. We will talk about it later.

## Background worker - Sidekiq and ActiveRecord pool

Sidekiq process will use the pool defined in `config/database.yml` similarly as Puma. All Sidekiq threads in a Sidekiq process can use a common pool of connections.

If you run multiple servers (Heroku dynos), then it works similarly to the Puma example.

2 servers (dynos) X 1 Sidekiq process X 10 Sidekiq threads = 20 DB connections will be open.

You need at least pool size of 10 in `config/database.yml` because Sidekiq by default, uses 10 threads.

If you use a pool size lower than 10 then Sidekiq threads will be fighting for access to limited connections in the pool. It could be fine for some time, but you should be aware that this can increse your job's processing time because half of the Sidekiq threads won't be able to use DB simultaneously as another half of threads. It can also lead to [a problem described here](https://github.com/mperham/sidekiq/wiki/Problems-and-Troubleshooting#cannot-get-database-connection-within-500-seconds).

### Sidekiq and Redis database connections

<img src="/images/blog/posts/estimate-database-connections-pool-size-for-rails-application/redis.jpeg" style="width:200px;margin-left: 15px;float:right;" alt="Rails, RoR, DB, database, pool" />

Sidekiq uses the Redis database to store async jobs. It would be best if you calculate DB connections to Redis as well as Postgres connections. A Sidekiq server process requires at least (concurrency + 5) connections. The `concurrency` option is the number of Sidekiq threads per Sidekiq process.

Using previous example:

2 servers (dynos) X 1 Sidekiq process X 10 Sidekiq threads = 2 servers (dynos) X 1 Sidekiq process X (10 + 5) = 30 Redis connections required.

More in [Sidekiq docs](https://github.com/mperham/sidekiq/wiki/Using-Redis#complete-control).

## Redis database connections

If you use Redis for processing background jobs, then not only the Sidekiq process is using Redis connections. Also, your Puma process and threads can use Redis to add new jobs to the Sidekiq queue. Typically you will have 1 Redis connection per 1 Puma thread.

If you explicitly open a new Redis connection with `Redis.new`, this can create a new connection per the Puma thread as well.

## Summary

We covered a few examples for Postgres and Redis on calculating DB connections needed by your Rails application. I hope this will give you a better understanding of how to estimate how many DB connections you need on your database level to serve your application demand properly.

If you are looking to improve your Rails application workflow please consider to check how to [run automated tests in parallel on your CI server](/2020/how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation) with [Knapsack Pro](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=estimate-database-connections-pool-size-for-rails-application).
