---
pagination_next: null
pagination_prev: null
---

# Use Knapsack Pro with Capybara

## Troubleshooting

### How do I fix `SystemStackError: stack level too deep` when using `capybara-screenshot`?

Please update `capybara-screenshot` to >= 1.0.15 to fix the [issue](https://github.com/mattheworiordan/capybara-screenshot/pull/205).

### Why are Capybara tests failing randomly?

If the CI node is overloaded, the application under test may load slowly causing random test failures. We recommend increasing the maximum wait time:

```ruby
# spec/rails_helper.rb

Capybara.default_max_wait_time = 5 # seconds
```

## Related FAQs

- [Why Capybara feature tests randomly fail when using CI parallelisation?](https://knapsackpro.com/faq/question/why-capybara-feature-tests-randomly-fail-when-using-ci-parallelisation)
- [How to fix capybara-screenshot fail with SystemStackError: stack level too deep when using Queue Mode for RSpec?](https://knapsackpro.com/faq/question/how-to-fix-capybara-screenshot-fail-with-systemstackerror-stack-level-too-deep-when-using-queue-mode-for-rspec)
