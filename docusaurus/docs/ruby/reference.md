---
pagination_next: null
pagination_prev: null
toc_max_heading_level: 2
---

# Reference

## `KNAPSACK_PRO_LOG_LEVEL`

Default: `debug`

Available: `debug` | `info` | `warn` | `error` | `fatal`

Recommended: `debug` when debugging issues, `info` to know what Knapsack Pro is doing

### Related FAQs

- [How can I change log level?](https://knapsackpro.com/faq/question/how-can-i-change-log-level)

## `KNAPSACK_PRO_LOG_DIR`

Default: `stdout`

Available: `stdout` | directory

When `KNAPSACK_PRO_LOG_DIR=log`, Knapsack Pro will write logs to the `log` directory and append the CI node index to the name. For example:

- `log/knapsack_pro_node_0.log`
- `log/knapsack_pro_node_1.log`

### Related FAQs

- [How to write `knapsack_pro` logs to a file?](https://knapsackpro.com/faq/question/how-to-write-knapsack_pro-logs-to-a-file)

## `KNAPSACK_PRO_TEST_FILE_PATTERN`

:::caution
Make sure to match individual files by adding the suffix (e.g., `_spec.rb`, `_test.rb`) so that Knapsack Pro can split by file and not by directory.
:::

Run tests matching a pattern.

Default: all tests for the given test runner

Available: anything that [Dir.glob](https://ruby-doc.org/core-3.0.0/Dir.html#method-c-glob) accepts

Examples:
```
KNAPSACK_PRO_TEST_FILE_PATTERN="spec/system/**/*_spec.rb"

KNAPSACK_PRO_TEST_DIR=spec KNAPSACK_PRO_TEST_FILE_PATTERN="{spec,engines/*/spec}/**/*_spec.rb"
```

### Related FAQs

- [How to run tests from a specific directory (only system tests or features specs)?](https://knapsackpro.com/faq/question/how-to-run-tests-from-a-specific-directory-only-system-tests-or-features-specs)
- [How can I run tests from multiple directories?](https://knapsackpro.com/faq/question/how-can-i-run-tests-from-multiple-directories)

## `KNAPSACK_PRO_TEST_DIR` (RSpec)

Passed as-is to RSpec's [`--default-path`](https://relishapp.com/rspec/rspec-core/v/3-0/docs/configuration/setting-the-default-spec-path).

Default: `rspec`

Available: any folder relative to the root of your project that contains `spec_helper.rb`

Example:
```
KNAPSACK_PRO_TEST_DIR=spec KNAPSACK_PRO_TEST_FILE_PATTERN="{spec,engines/*/spec}/**/*_spec.rb"
```

:::caution
You may need to make your test files require `spec_helper` with:

```ruby
require_relative 'spec_helper' # ✅ Good

require 'spec_helper' # ⛔️ Bad
:::

### Related FAQs

- [How can I run tests from multiple directories?](https://knapsackpro.com/faq/question/how-can-i-run-tests-from-multiple-directories)
