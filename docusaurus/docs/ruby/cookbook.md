---
pagination_next: null
pagination_prev: null
---

# Cookbook

## Run Knapsack Pro on a subset of parallel CI nodes (instead of all)

You may want to run Knapsack Pro only on a subset of parallel CI nodes, and use the others nodes for something else (e.g., linters).

For example, you could decide to run Knapsack Pro on all the CI nodes but the last one:

```ruby
KNAPSACK_PRO_CI_NODE_TOTAL=$((MY_CI_NODE_TOTAL-1)) bundle exec rake knapsack_pro:queue:rspec
```

To find out which environment variable to use in place of `MY_CI_NODE_TOTAL`, take a look at what Knapsack Pro uses as `node_total` for your [CI provider](https://github.com/KnapsackPro/knapsack_pro-ruby/tree/master/lib/knapsack_pro/config/ci) (e.g., for CircleCI it would be [`CIRCLE_NODE_TOTAL`](https://github.com/KnapsackPro/knapsack_pro-ruby/blob/master/lib/knapsack_pro/config/ci/circle.rb#L6))

## Fail the CI build if one of the test files exceeds a certain time limit

In the [`after_queue`](/ruby/hooks/) hook, retrieve the slowest test file and create a file on disk if it exceeds a given `THRESHOLD`:

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

## Related FAQs

- [How to run `knapsack_pro` only on a few parallel CI nodes instead of all?](https://knapsackpro.com/faq/question/how-to-run-knapsack_pro-only-on-a-few-parallel-ci-nodes-instead-of-all)
- [How to fail the CI build if one of the test files duration exceeds a certain limit?](https://knapsackpro.com/faq/question/how-to-fail-the-ci-build-if-one-of-the-test-files-duration-exceeds-a-certain-limit)
