---
pagination_next: null
pagination_prev: null
---

# Using Knapsack Pro with Capybara

## Troubleshooting

### How do I fix `SystemStackError: stack level too deep` when using `capybara-screenshot`?

Please update `capybara-screenshot` to >= 1.0.15 to fix the [issue](https://github.com/mattheworiordan/capybara-screenshot/pull/205).

### Why are Capybara tests failing randomly?

If the CI node is overloaded, the application under test may load slowly causing random test failures. We recommend increasing the maximum wait time:

```ruby
# spec/rails_helper.rb

Capybara.default_max_wait_time = 5 # seconds
```