---
pagination_next: null
pagination_prev: null
---

# Using Knapsack Pro with `spring`

:::caution

If you are using Knapsack Pro with Cucumber, read the dedicated section below.

:::

You can use [spring](https://github.com/rails/spring) to load your tests faster with `knapsack_pro` by prepending `bundle exec spring` or `bin/spring`. For example, with `rspec` you would:

```bash
bundle exec spring rake knapsack_pro:queue:rspec
```

## Using Knapsack Pro with `spring` and Cucumber

Make sure you have [`spring-commands-cucumber`](https://github.com/jonleighton/spring-commands-cucumber) installed and execute:

```bash
export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bundle exec spring
# or
export KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX=bin/spring

bundle exec rake knapsack_pro:queue:cucumber
```
