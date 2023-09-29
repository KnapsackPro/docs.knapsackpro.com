```ruby
# spec_helper.rb

after_suite_block = proc {
  puts 'after suite hook called only once'
}

unless KnapsackPro::Config::Env.queue_recording_enabled?
  RSpec.configure do |config|
    config.after(:suite) do
      after_suite_block.call
      puts 'Run this only when not using Knapsack Pro Queue Mode'
    end
  end
end

KnapsackPro::Hooks::Queue.after_queue do |queue_id|
  after_suite_block.call
  puts 'Run this only when using Knapsack Pro Queue Mode'
  puts "This code is executed outside of the RSpec after(:suite) hook context because it's impossible to determine which after(:suite) is the last one to execute until it's executed."
end
```
