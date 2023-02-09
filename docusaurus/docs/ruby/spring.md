---
pagination_next: null
pagination_prev: null
---

# Use Knapsack Pro with `spring`

:::caution
If you are using Knapsack Pro in Queue Mode with Cucumber, read the dedicated section below.
:::

You can use [spring](https://github.com/rails/spring) to load your tests faster with `knapsack_pro` by prepending `bundle exec spring` or `bin/spring`. For example, with `rspec` you would:

```bash
# Knapsack Pro in Regular Mode
bundle exec spring rake knapsack_pro:rspec

# Knapsack Pro in Queue Mode
bundle exec spring rake knapsack_pro:queue:rspec
```

## Use Knapsack Pro in Queue Mode with `spring` and Cucumber

Make sure you have [`spring-commands-cucumber`](https://github.com/jonleighton/spring-commands-cucumber) installed and execute:

```bash
export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bundle exec spring
# or
export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bin/spring

bundle exec rake knapsack_pro:queue:cucumber
```

## Related FAQs

- [How to use spring gem with Knapsack Pro?](https://knapsackpro.com/faq/question/how-to-use-spring-gem-with-knapsack-pro)
- [How to use spring gem to run Cucumber tests faster in Queue Mode?](https://knapsackpro.com/faq/question/how-to-use-spring-gem-to-run-cucumber-tests-faster-in-queue-mode)
