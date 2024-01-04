```bash
# Refer to your CI docs for `$MY_CI_NODE_INDEX`
export KNAPSACK_PRO_CI_NODE_INDEX=$MY_CI_NODE_INDEX

bundle exec rake "knapsack_pro:queue:rspec[--format documentation --format json --out tmp/rspec_$KNAPSACK_PRO_CI_NODE_INDEX.json]"
```

```ruby
# spec_helper.rb or rails_helper.rb

# `TMP_REPORT` must be the same path as `--out`
# `TMP_REPORT` must be a full path (no `~`)
TMP_REPORT = "tmp/rspec_#{ENV['KNAPSACK_PRO_CI_NODE_INDEX']}.json"
FINAL_REPORT = "tmp/final_rspec_#{ENV['KNAPSACK_PRO_CI_NODE_INDEX']}.json"

KnapsackPro::Hooks::Queue.after_subset_queue do |queue_id, subset_queue_id|
  if File.exist?(TMP_REPORT)
    FileUtils.mv(TMP_REPORT, FINAL_REPORT)
  end
end
```

`FINAL_REPORT` will contain all the tests run on the CI node (not just the last subset). For more information, you can read this [Github issue](https://github.com/KnapsackPro/knapsack_pro-ruby/issues/40).

If your CI nodes write to the same disk, you need to append the CI node index to the solution presented above to avoid conflicts:

```ruby
TMP_REPORT = "tmp/rspec_#{ENV['KNAPSACK_PRO_CI_NODE_INDEX']}.json"
FINAL_REPORT = "tmp/final_rspec_#{ENV['KNAPSACK_PRO_CI_NODE_INDEX']}.json"
```

This applies also if you are running parallel test processes on each CI node (see our page on to integrate Knapsack Pro with [`parallel_tests`](../parallel_tests.md) for an example).
