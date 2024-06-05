---
pagination_next: null
pagination_prev: null
---

# Using Knapsack Pro with CodeClimate

Check how to configure CodeClimate with `knapsack_pro` on our blog:

* [CodeClimate and CircleCI 2.0 parallel builds config for RSpec with SimpleCov and JUnit formatter](https://docs.knapsackpro.com/2019/codeclimate-and-circleci-2-0-parallel-builds-config-for-rspec-with-simplecov-and-junit-formatter)
* [How to merge CodeClimate reports for parallel jobs (CI nodes) on Semaphore CI 2.0](https://docs.knapsackpro.com/2019/how-to-merge-codeclimate-reports-for-parallel-jobs-ci-nodes).

## Troubleshooting

### Using Knapsack Pro in Queue Mode with CodeClimate and SimpleCov

You need to generate a simplecov report in JSON format on CI in order to avoid [the following error](https://github.com/codeclimate/test-reporter/issues/418) from CodeClimate:

```
Error: json: cannot unmarshal object into Go struct field resultSet.coverage of type []formatters.NullInt
```

#### RSpec

Apply the following code:

```ruby title="spec/spec_helper.rb"
require 'knapsack_pro'
require 'simplecov'

# highlight-start
if ENV['CI']
  require 'simplecov_json_formatter'
  SimpleCov.formatter = SimpleCov::Formatter::JSONFormatter
end
# highlight-end

SimpleCov.start

KnapsackPro::Hooks::Queue.before_queue do |queue_id|
  SimpleCov.command_name("rspec_ci_node_#{KnapsackPro::Config::Env.ci_node_index}")
end
```

#### Minitest

Apply the following code:

```ruby title="test/test_helper.rb"
require 'knapsack_pro'
require 'simplecov'

# highlight-start
if ENV['CI']
  require 'simplecov_json_formatter'
  SimpleCov.formatter = SimpleCov::Formatter::JSONFormatter
end
# highlight-end

SimpleCov.start

KnapsackPro::Hooks::Queue.before_queue do |queue_id|
  SimpleCov.command_name("minitest_ci_node_#{KnapsackPro::Config::Env.ci_node_index}")
end

KnapsackPro::Hooks::Queue.after_queue do
  SimpleCov.result.format!
end
```

