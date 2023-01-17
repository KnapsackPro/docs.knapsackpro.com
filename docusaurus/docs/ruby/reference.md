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

Run tests matching a pattern. It can be used in tandem with `KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN`.

Default: all tests for the given test runner

Available: anything that [Dir.glob](https://ruby-doc.org/core-3.0.0/Dir.html#method-c-glob) accepts

Examples:
```bash
KNAPSACK_PRO_TEST_FILE_PATTERN="spec/system/**/*_spec.rb"

KNAPSACK_PRO_TEST_DIR=spec KNAPSACK_PRO_TEST_FILE_PATTERN="{spec,engines/*/spec}/**/*_spec.rb"

KNAPSACK_PRO_TEST_FILE_PATTERN="spec/controllers/**{,/*/**}/*_spec.rb" \
KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN="spec/controllers/admin/**{,/*/**}/*_spec.rb"
```

### Related FAQs

- [How to run tests from a specific directory (only system tests or features specs)?](https://knapsackpro.com/faq/question/how-to-run-tests-from-a-specific-directory-only-system-tests-or-features-specs)
- [How can I run tests from multiple directories?](https://knapsackpro.com/faq/question/how-can-i-run-tests-from-multiple-directories)
- [How to exclude tests?](https://knapsackpro.com/faq/question/how-to-exclude-tests-from-running-them)
- [Dir.glob pattern examples for `KNAPSACK_PRO_TEST_FILE_PATTERN` and `KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN`](https://knapsackpro.com/faq/question/dir-glob-pattern-examples-for-knapsack_pro_test_file_pattern-and-knapsack_pro_test_file_exclude_pattern)

## `KNAPSACK_PRO_TEST_DIR` (RSpec)

Passed as-is to RSpec's [`--default-path`](https://relishapp.com/rspec/rspec-core/v/3-0/docs/configuration/setting-the-default-spec-path).

Default: `rspec`

Available: any folder relative to the root of your project that contains `spec_helper.rb`

Example:
```bash
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

## `KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN`

Exclude tests matching a pattern. It can be used in tandem with `KNAPSACK_PRO_TEST_FILE_PATTERN`.

Default: `nil`

Available: anything that [Dir.glob](https://ruby-doc.org/core-3.0.0/Dir.html#method-c-glob) accepts

Examples:
```bash
KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN="spec/features/**{,/*/**}/*_spec.rb"

KNAPSACK_PRO_TEST_FILE_PATTERN="spec/controllers/**{,/*/**}/*_spec.rb" \
KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN="spec/controllers/admin/**{,/*/**}/*_spec.rb"
```

### Related FAQs

- [How to exclude tests?](https://knapsackpro.com/faq/question/how-to-exclude-tests-from-running-them)
- [Dir.glob pattern examples for `KNAPSACK_PRO_TEST_FILE_PATTERN` and `KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN`](https://knapsackpro.com/faq/question/dir-glob-pattern-examples-for-knapsack_pro_test_file_pattern-and-knapsack_pro_test_file_exclude_pattern)

## `KNAPSACK_PRO_TEST_FILE_LIST`

Comma-separated list of tests to run. When `KNAPSACK_PRO_TEST_FILE_LIST` is set, both `KNAPSACK_PRO_TEST_FILE_PATTERN` and `KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN` are ignored.

Default: `nil`

Example:
```bash
KNAPSACK_PRO_TEST_FILE_LIST=spec/features/dashboard_spec.rb,spec/models/user.rb:10,spec/models/user.rb:29
```

### Related FAQs

- [How to run a specific list of test files or only some tests from test file?](https://knapsackpro.com/faq/question/how-to-run-a-specific-list-of-test-files-or-only-some-tests-from-test-file)

## `KNAPSACK_PRO_TEST_FILE_LIST_SOURCE_FILE`

File containing the list of tests to run. When `KNAPSACK_PRO_TEST_FILE_LIST_SOURCE_FILE` is set, both `KNAPSACK_PRO_TEST_FILE_PATTERN` and `KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN` are ignored.

Default: `nil`

Example:
```bash
KNAPSACK_PRO_TEST_FILE_LIST_SOURCE_FILE=spec/fixtures/list.txt

# list.txt
./spec/test1_spec.rb
spec/test2_spec.rb[1]
./spec/test3_spec.rb[1:2:3:4]
./spec/test4_spec.rb:4
./spec/test4_spec.rb:5
```

### Related FAQs

- [How to run a specific list of test files or only some tests from test file?](https://knapsackpro.com/faq/question/how-to-run-a-specific-list-of-test-files-or-only-some-tests-from-test-file)
