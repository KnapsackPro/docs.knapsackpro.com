```bash
bundle exec rake "knapsack_pro:queue:rspec[--format documentation --format json --out tmp/rspec.json]"
```

You need to append the CI node index to the report name to avoid conflicts if your CI nodes write to the same disk:

```bash
# Refer to your CI docs for `$MY_CI_NODE_INDEX`
export KNAPSACK_PRO_CI_NODE_INDEX=$MY_CI_NODE_INDEX

bundle exec rake "knapsack_pro:queue:rspec[--format documentation --format json --out tmp/rspec_$KNAPSACK_PRO_CI_NODE_INDEX.json]"
```

This applies also if you are running parallel test processes on each CI node (see our page on to integrate Knapsack Pro with [`parallel_tests`](../parallel_tests.md) for an example).
