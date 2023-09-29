```ruby
# spec_helper.rb

before_suite_block = proc {
  puts 'RSpec before suite hook called only once'
}

unless KnapsackPro::Config::Env.queue_recording_enabled?
  RSpec.configure do |config|
    config.before(:suite) do
      before_suite_block.call
      puts 'Run this only when not using Knapsack Pro Queue Mode'
    end
  end
end

KnapsackPro::Hooks::Queue.before_queue do |queue_id|
  before_suite_block.call
  puts 'Run this only when using Knapsack Pro Queue Mode'
  puts 'This code is executed within the context of RSpec before(:suite) hook'
end
```
