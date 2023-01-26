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

## Related FAQs

- [How to run `knapsack_pro` only on a few parallel CI nodes instead of all?](https://knapsackpro.com/faq/question/how-to-run-knapsack_pro-only-on-a-few-parallel-ci-nodes-instead-of-all)
