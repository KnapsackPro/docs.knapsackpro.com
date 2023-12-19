---
pagination_next: null
pagination_prev: null
---

# Cookbook

## Use the Knapsack Pro binary

You can install Knapsack Pro globally as a binary if you don't want it as a dependency in your Gemfile:

```bash
gem install knapsack_pro

knapsack_pro queue:rspec "--tag MY_TAG --profile"
```

## Set a custom logger

:::info

Consider [`KNAPSACK_PRO_LOG_LEVEL`](reference.md#knapsack_pro_log_level) and [`KNAPSACK_PRO_LOG_DIR`](reference.md#knapsack_pro_log_dir) instead.

:::

In your `rails_helper.rb`, you can set a custom Knapsack Pro logger:

```ruby
# This line should be already in your rails_helper.rb
require File.expand_path('../../config/environment', __FILE__)

require 'logger'
KnapsackPro.logger = Logger.new(Rails.root.join('log', "knapsack_pro_node_#{KnapsackPro::Config::Env.ci_node_index}.log"))
KnapsackPro.logger.level = Logger::DEBUG
```

The very first request to the Knapsack Pro API will still be sent to stdout because Knapsack Pro needs the subset of test files to execute before loading `rails_helper.rb`.

## Run Knapsack Pro on a subset of parallel CI nodes (instead of all)

You may want to run Knapsack Pro only on a subset of parallel CI nodes, and use the others nodes for something else (e.g., linters).

For example, you could decide to run Knapsack Pro on all the CI nodes but the last one:

```ruby
KNAPSACK_PRO_CI_NODE_TOTAL=$((MY_CI_NODE_TOTAL-1)) bundle exec rake knapsack_pro:queue:rspec
```

To find out which environment variable to use in place of `MY_CI_NODE_TOTAL`, take a look at what Knapsack Pro uses as `node_total` for your [CI provider](https://github.com/KnapsackPro/knapsack_pro-ruby/tree/master/lib/knapsack_pro/config/ci) (e.g., for CircleCI it would be [`CIRCLE_NODE_TOTAL`](https://github.com/KnapsackPro/knapsack_pro-ruby/blob/master/lib/knapsack_pro/config/ci/circle.rb#L6))

## Fail the CI build if one of the test files exceeds a certain time limit

In the [`after_queue`](hooks.mdx) hook, retrieve the slowest test file and create a file on disk if it exceeds a given `THRESHOLD`:

```ruby
KnapsackPro::Hooks::Queue.after_queue do |queue_id|
  THRESHOLD = 120 # seconds

  # all recorded test files by knapsack_pro gem on particular CI node index
  slowest = Dir.glob(".knapsack_pro/queue/#{queue_id}/*.json")
    .flat_map { |file| JSON.parse(File.read(file)) }
    .max_by { |test_file| test_file['time_execution'] }

  if slowest['time_execution'].to_f > THRESHOLD
    puts '!' * 50
    puts "The slowest test file (#{slowest['path']}) took #{slowest['time_execution']} seconds and exceeded the threshold (#{THRESHOLD} seconds)."
    puts '!' * 50

    File.open('tmp/slowest_test_file_exceeded_threshold.txt', 'w+') do |file|
      file.write(slowest.to_json)
    end
  end
end
```

Then, in a bash script fail the CI build if the file exists:

```bash
#!/bin/bash

THRESHOLD_FILE_PATH="tmp/slowest_test_file_exceeded_threshold.txt"

if [ -f "$THRESHOLD_FILE_PATH" ]; then
  rm "$THRESHOLD_FILE_PATH"
  cat "$THRESHOLD_FILE_PATH"
  echo "Slow test file exceeded threshold. Fail CI build."
  exit 1
fi
```

## Run multiple test commands with one script

```bash
#!/bin/bash

# Cucumber suite
bundle exec rake knapsack_pro:queue:cucumber
export CUCUMBER_EXIT_CODE=$?

# RSpec suite
bundle exec rake knapsack_pro:queue:rspec
export RSPEC_EXIT_CODE=$?

if [ "$CUCUMBER_EXIT_CODE" -ne "0" ]; then
  exit $CUCUMBER_EXIT_CODE
fi

if [ "$RSPEC_EXIT_CODE" -ne "0" ]; then
  exit $RSPEC_EXIT_CODE
fi
```

## Run (and fail fast) multiple test commands with one script

:::caution

CI nodes that fail on the first suite won't run the second suite: tests will be distributed to fewer CI nodes and the CI run will take longer.

:::

```bash
#!/bin/bash

set -e # exit on error

bundle exec rake knapsack_pro:queue:rspec
bundle exec rake knapsack_pro:queue:cucumber
```
