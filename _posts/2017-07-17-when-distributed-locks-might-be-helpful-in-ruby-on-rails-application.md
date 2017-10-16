---
layout: post
title:  "When distributed locks might be helpful in Ruby on Rails application"
date:   2017-07-17 07:00:00 +0200
author: "Artur Trzop"
categories: ruby rails locks
og_image: "/images/blog/posts/when-distributed-locks-might-be-helpful-in-ruby-on-rails-application/distributed_lock.jpg"
---

During this year I noticed 2 similar concurrency problems with my Ruby on Rails application and I solved them with distributed locks. I'm going to show you how to detect if your application might have a concurrency problem and how to solve it.

<img src="/images/blog/posts/when-distributed-locks-might-be-helpful-in-ruby-on-rails-application/distributed_lock.jpg" style="width:250px;float:right;" />

Let me start with a bit of context before we discuss the problem. I'm running small SaaS application [KnapsackPro.com](http://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=distributed-locks) and the application provides API for the gem [knapsack_pro](https://github.com/KnapsackPro/knapsack_pro-ruby). The whole point of the tool is to optimize time execution of your RSpec, Cucumber etc test suite by splitting tests across CI nodes running in parallel. 

Imagine a scenario where you have 20 minutes long RSpec test suite and you would like to split it across 2 parallel CI nodes. In the perfect case, you should run half of RSpec tests on the first CI node and the second half on the second CI node. In result, your test suite would run only 10 minutes.

## But where is the potential risk of the concurrency problem?

On the Knapsack Pro API side, there is test file queue generated for your CI build. Each CI node periodically requests the Knapsack Pro API via knapsack_pro gem for test files that should be executed next. Thanks to that each CI node will finish tests at the same time.

<img src="/images/blog/posts/auto-balancing-7-hours-tests-between-100-parallel-jobs-on-ci-buildkite-example/queue_mode.jpg" style="width:150px;"/>

When both CI nodes start work at the same time to execute your test suite then the knapsack_pro gem does a request to Knapsack Pro API to get the list of test files that should be executed on the particular CI node. The first request coming to the Knapsack Pro API is responsible for creating a test file work queue. 

Take a look how code responsible for creating the queue looks like:

{% highlight ruby %}
def test_files
  create_queue unless queue_exists?

  test_files_from_top_of_the_queue
end
{% endhighlight %}

At some point, I started getting emails from a customer that they notice that sometimes their test files are executed twice. At first, I could not reproduce the problem and I was wondering what the root problem might be. When I got the second email from one of the customers I was sure that it was not a single case. I spotted that probably something is wrong with the part of the code you see above. I started asking myself, maybe the checking `create_queue unless queue_exists?` is not enough? 

I knew the production server uses multiple unicorn processes and I was curious what if the checking if the test file queue exists is happening exactly at the same time.

My idea to reproduce this situation was to write a script that would do concurrent requests in separate ruby threads against my API server. I was hoping if the problem is related to concurrency then this way I should be able to reveal it. 

I prepared the unicorn configuration that I could use in development to run multiple concurrent unicorn processes. 

{% highlight ruby %}
# bin/api_test/unicorn.rb
worker_processes 5
timeout 40
preload_app true

before_fork do |server, worker|
  Signal.trap 'TERM' do
    puts 'Unicorn master intercepting TERM and sending myself QUIT instead'
    Process.kill 'QUIT', Process.pid
  end

  defined?(ActiveRecord::Base) and
    ActiveRecord::Base.connection.disconnect!
end

after_fork do |server, worker|
  Signal.trap 'TERM' do
    puts 'Unicorn worker intercepting TERM and doing nothing. Wait for master to send QUIT'
  end

  defined?(ActiveRecord::Base) and
    ActiveRecord::Base.establish_connection
end
{% endhighlight %}

Below is my script to run concurrent requests. As you can see I use RSpec here to do `expect` and ensure there is no problem with API. When the test files in the work queue are duplicated then the test fails and that means the concurrency problem exists and the test file work queue is created twice instead of just once.

{% highlight ruby %}
#!/usr/bin/env ruby
# bin/api_test/initialize_queue
require 'knapsack_pro'
require 'rspec'

# Start rails server in development with unicorn
# to test concurrent requests
#  $  bundle exec unicorn -p 3000 -c bin/api_test/unicorn.rb
#
# Run this file with rspec
#  $ rspec bin/api_test/initialize_queue

node_total = 5

# use development API
ENV['KNAPSACK_PRO_MODE'] = 'development'
ENV['KNAPSACK_PRO_TEST_SUITE_TOKEN'] = '333e7b8d1b64fd6447df34a77e3662eb'
ENV['KNAPSACK_PRO_LOG_LEVEL'] = 'warn'

test_files = [
  {"path"=>"spec/bar_spec.rb"},
  {"path"=>"spec/controllers/articles_controller_spec.rb"},
  {"path"=>"spec/controllers/welcome_controller_spec.rb"},
  {"path"=>"spec/dir with spaces/foobar_spec.rb"},
  {"path"=>"spec/features/calculator_spec.rb"},
  {"path"=>"spec/features/homepage_spec.rb"},
  {"path"=>"spec/foo_spec.rb"},
  {"path"=>"spec/services/calculator_spec.rb"},
  {"path"=>"spec/services/meme_spec.rb"},
  {"path"=>"spec/timecop_spec.rb"},
  {"path"=>"spec/vcr_spec.rb"}
]
expected_test_files = KnapsackPro::TestFilePresenter.paths(test_files).sort

def test_files_from_queue(can_initialize_queue, commit_hash, branch, node_total, node_index, test_files)
  action = KnapsackPro::Client::API::V1::Queues.queue(
    can_initialize_queue: can_initialize_queue,
    commit_hash: commit_hash,
    branch: branch,
    node_total: node_total,
    node_index: node_index,
    node_build_id: 'missing-build-id',
    test_files: test_files,
  )
  connection = KnapsackPro::Client::Connection.new(action)
  response = connection.call
  if connection.success?
    raise ArgumentError.new(response) if connection.errors?
    KnapsackPro::TestFilePresenter.paths(response['test_files'])
  else
    raise ArgumentError.new("Couldn't connect with Knapsack Pro API. Response: #{response}")
  end
end


commit_hash = SecureRandom.hex
all_test_files = []

threads = []

node_total.times do |node_index|
  threads << Thread.new do
    can_initialize_queue = true
    node_all_test_files = []
    while true
      node_subset_test_files = test_files_from_queue(
        can_initialize_queue,
        commit_hash,
        'api_test',
        node_total,
        node_index,
        test_files
      )
      node_all_test_files += node_subset_test_files
      can_initialize_queue = false

      puts
      puts "CI node: #{node_index}"
      puts node_subset_test_files.inspect

      break if node_subset_test_files.empty?
    end
    node_all_test_files
  end
end

threads.each do |thr|
  all_test_files += thr.join.value
end

describe 'Ensure queue API returns all test files without duplicates' do
  it do
    expect(all_test_files.sort).to eq expected_test_files
  end
end
{% endhighlight %}

This way I was able to reproduce the problem in development and I had a script thanks to that I could verify if a future fix will be working.

## How to deal with concurrency problem

<img src="/images/blog/posts/when-distributed-locks-might-be-helpful-in-ruby-on-rails-application/dining_philosophers_problem.jpg" style="width:250px;float:right;" />

The first thing that came to my mind was that maybe I should write myself some sort of solution. The test file work queue is stored in Redis so I was wondering maybe I could do something on the Redis level to ensure the work queue is created only once. 

I quickly realized that none of my ideas sound reasonable to solve the problem then I looked for options how people deal with the concurrency problem.

Basically, the conclusion after my research was:

* don't reinvent the wheel
* look for proven solutions because distributed problems are complex

and I found that distributed lock can help to ensure the part of my code will be execute only once at a time.

## Distributed locking for the rescue

### What distributed lock does?

Simply speaking it synchronize access to shared resources in our case the code responsible for creating the test file work queue.
It means different processes (unicorn processes) must operate with shared resources in a mutually exclusive way.

### Why you want a lock in a distributed application?

There are 2 main reasons why you want to introduce lock:

* Efficiency - because you want to avoid expensive computation and save time and money 
* Correctness - you would like to prevent data loss or data corruption. You want to avoid data inconsistency.

I found a few gems like [redis-mutex](https://github.com/kenn/redis-mutex), [redis-lock](https://github.com/mlanett/redis-lock), [redlock-rb](https://github.com/leandromoreira/redlock-rb), [redis-semaphore](https://github.com/dv/redis-semaphore). While I was reading about all of those gems and checking their issues and pull requests I learned that distributed problems are even more complex than I thought at first.

The most reasonable tool seemed to be [redis-semaphore](https://github.com/dv/redis-semaphore) gem so I picked that. Here is the sample solution I did.

{% highlight ruby %}
def test_files
  semaphore_name = :ci_build_id # unique ID of CI build
  expire_lock_after = 5 # seconds

  semaphore = Redis::Semaphore.new(semaphore_name, host: "localhost")
  semaphore.lock(expire_lock_after) do
    create_queue unless queue_exists?
  end

  test_files_from_top_of_the_queue
end
{% endhighlight %}

As you can see I define semaphore name based on CI build ID because in my business context the concurrency error happened only for the CI build so the ID of the build seems to be the perfect candidate to use it as a semaphore name.

I also set lock timeout to 5 seconds because I assume in most cases creating the work queue takes milliseconds and if something goes wrong and suddenly it will take seconds then it would be better to expire lock and allow the app to fail rather than lock unicorn process forever. 

When I had the working fix then I validated if it actually solves the problem by using my script to do concurrent requests in ruby threads. Indeed it solved the problem!

## Concurrency problem you most likely have too

<img src="/images/blog/posts/when-distributed-locks-might-be-helpful-in-ruby-on-rails-application/ruby_on_rails.jpg" style="width:250px;float:right;" />

A month ago or so I found another concurrency issue in my API and the problematic code looked like:

{% highlight ruby %}
def save
  build = find_build || new_build # similar to find_or_initialize_by
  do_something_complex_with_build
  build.save
end
{% endhighlight %}

This may look familiar to you because it's similar to what Rails method `find_or_initialize_by` does. If you have code like that in your codebase then ask yourself what if my code will be executed twice at the same time? Will this cause any problem?

## What should you remember?

* Locks are hard
* Distributed locks are even harder
* Don't reinvent the wheel, use proven solutions
* Most web apps are not thread-safe due to missing locks
* Expect edge cases while you grow

## Final tips

* Be aware of trade-off. Do you care about efficiency or correctness?
* Test your endpoints with concurrent requests to reproduce problem and to validate fix will work
* Remember to use transactions when changing many records but don't forget DB transactions won't help with a concurrency problem due to the fact transaction works per DB connection.
* If possible use unique index to ensure data consistency in DB. When concurrency problem will happen then at least DB will ensure data correctness.
* Use tested distribution lock solutions

I also recommend reading article: [Differences between transactions and locking](https://makandracards.com/makandra/31937-differences-between-transactions-and-locking).
