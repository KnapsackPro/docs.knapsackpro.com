---
pagination_next: null
pagination_prev: null
---

# Hooks: Before and After

:::caution

Knapsack Pro hooks are only available in [Queue Mode](../overview/index.md#queue-mode-dynamic-split).

:::

:::caution

If you are using RSpec or `percy-capybara`, read the dedicated sections below.

:::

Knapsack exposes four hooks to execute arbitrary code before or after certain events:

```ruby
KnapsackPro::Hooks::Queue.before_queue do |queue_id|
  puts 'before_queue - run before the test suite'
end

KnapsackPro::Hooks::Queue.before_subset_queue do |queue_id, subset_queue_id|
  puts 'before_subset_queue - run before the next subset of tests'
end

KnapsackPro::Hooks::Queue.after_subset_queue do |queue_id, subset_queue_id|
  puts 'after_subset_queue - run after the previous subset of tests'
end

KnapsackPro::Hooks::Queue.after_queue do |queue_id|
  puts 'after_queue - run after the test suite'
end
```

## RSpec

If you are using Knapsack Pro in Queue Mode with RSpec, replace:

```ruby
before(:suite) { ... }
after(:suite) { ... }
```

with:

```ruby
KnapsackPro::Hooks::Queue.before_queue(:suite) { ... }
KnapsackPro::Hooks::Queue.after_queue(:suite) { ... }
```

Otherwise, Knapsack Pro would call `before(:suite)` and `after(:suite)` for each subset of tests.

For example, what follows are the hooks run with two subsets of tests:

```
before_queue

# First subset of tests from Knapsack Pro API
before :suite
first_spec.rb
second_spec.rb
after :suite

# Second subset of tests from Knapsack Pro API
before :suite
third_spec.rb
fourth_spec.rb
after :suite

after_queue
```

## `percy-capybara`

### `percy-capybara` < 4

If you are using Knapsack Pro in Queue Mode with `percy-capybara` < 4, replace:

```ruby
before(:suite) { Percy::Capybara.initialize_build }
after(:suite) { Percy::Capybara.finalize_build }
```

with:

```ruby
KnapsackPro::Hooks::Queue.before_queue { |queue_id| Percy::Capybara.initialize_build }
KnapsackPro::Hooks::Queue.after_queue { |queue_id| Percy::Capybara.finalize_build }
```

Otherwise, Knapsack Pro would call `before(:suite)` and `after(:suite)` for each subset of tests.

### `percy-capybara` >= 4

If you are using Knapsack Pro in Queue Mode with `percy-capybara` >= 4, you need to configure the environment variables as explained in [Percy's docs](https://docs.percy.io/docs/parallel-test-suites#section-manual-configuration-with-environment-variables).

After that, you can use the following command:

```bash
npx percy exec -- rake knapsack_pro:queue:rspec
# or
npx percy exec -- knapsack_pro queue:rspec
```

Here you can find the docs for the [`knapsack_pro` binary](cookbook.md#use-the-knapsack-pro-binary).
