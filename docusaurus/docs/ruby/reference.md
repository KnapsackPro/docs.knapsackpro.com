---
pagination_next: null
pagination_prev: null
toc_max_heading_level: 2
---

# Reference

You can configure things in two ways:
- Command-line arguments for the test runner
- Environment variables for Knapsack Pro

Unless specified otherwise, everything on this page is environment variables.

## Command-line arguments

You can pass command-line arguments using the Rake argument syntax:

```bash
bundle exec rake "knapsack_pro:rspec[--tag focus --profile]"
# ==
bundle exec rake rspec --tag focus --profile
```

Or using the [`knapsack_pro` binary](https://github.com/KnapsackPro/knapsack_pro-ruby#knapsack-pro-binary):

```bash
knapsack_pro rspec "--tag focus --profile"
# ==
bundle exec rake rspec --tag focus --profile
```

## `KNAPSACK_PRO_BRANCH`

Git branch under test.

You don't need to set it if either:
- Your CI is one of the [supported CIs](https://github.com/KnapsackPro/knapsack_pro-ruby/tree/master/lib/knapsack_pro/config/ci)
- You are using `KNAPSACK_PRO_REPOSITORY_ADAPTER=git` and `KNAPSACK_PRO_PROJECT_DIR`

## `KNAPSACK_PRO_BRANCH_ENCRYPTED`

Enable [Branch Name Encryption](/ruby/encryption/).

Default: `false`

Available: `false` | `true`

## `KNAPSACK_PRO_CI_NODE_BUILD_ID`

Unique ID that identifies a CI build. It must be the same for all the parallel CI nodes.

Default: Knapsack Pro will take it from the CI environment (see [supported CIs](https://github.com/KnapsackPro/knapsack_pro-ruby/tree/master/lib/knapsack_pro/config/ci))

If your CI is not supported, you may generate a build ID with `KNAPSACK_PRO_CI_NODE_BUILD_ID=$(openssl rand - base64 32)` and make it available to all parallel nodes.

## `KNAPSACK_PRO_CI_NODE_INDEX`

Index of current CI node (first should be 0, second should be 1, etc.).

Default: Knapsack Pro will take it from the CI environment (see [supported CIs](https://github.com/KnapsackPro/knapsack_pro-ruby/tree/master/lib/knapsack_pro/config/ci))

If your CI is not supported, you need to set it manually.

## `KNAPSACK_PRO_CI_NODE_RETRY_COUNT`

Retry count of the current CI node in case of a single node/job retry.

On Buildkite, Knapsack Pro reads `BUILDKITE_RETRY_COUNT` from the environment, so you don't have to worry about this.

If you use `KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true` or `KNAPSACK_PRO_FIXED_TEST_SUITE_SPLIT=true`, you need to set `KNAPSACK_PRO_CI_NODE_RETRY_COUNT=1` when retrying a single node to disable Fallback Mode. Otherwise, the CI node would use a different split and run a different subset of tests. Alternatively, disable Fallback Mode completely with `KNAPSACK_PRO_FALLBACK_MODE_ENABLED=false`.

Default: `0` (or `BUILDKITE_RETRY_COUNT` on Buildkite)

Available:
- `0`: Fallback Mode is enabled according to `KNAPSACK_PRO_FALLBACK_MODE_ENABLED`
- `> 0`: Fallback Mode is disabled and Knapsack Pro raises an error if the API cannot be reached after `KNAPSACK_PRO_MAX_REQUEST_RETRIES` tries

## `KNAPSACK_PRO_CI_NODE_TOTAL`

Total number of parallel CI nodes.

Default: Knapsack Pro will take it from the CI environment (see [supported CIs](https://github.com/KnapsackPro/knapsack_pro-ruby/tree/master/lib/knapsack_pro/config/ci))

If your CI is not supported, you need to set it manually.

## `KNAPSACK_PRO_COMMIT_HASH`

Hash of the commit under test.

You don't need to set it if either:
- Your CI is one of the [supported CIs](https://github.com/KnapsackPro/knapsack_pro-ruby/tree/master/lib/knapsack_pro/config/ci)
- You are using `KNAPSACK_PRO_REPOSITORY_ADAPTER=git` and `KNAPSACK_PRO_PROJECT_DIR`

## `KNAPSACK_PRO_ENDPOINT` (Internal)

Default: `https://api.knapsackpro.com`

## `KNAPSACK_PRO_FALLBACK_MODE_ENABLED`

Enable/disable [Fallback Mode](/overview/#fallback-mode).

Default: `true`

Available:
- `false`: Knapsack Pro will fail the build after `KNAPSACK_PRO_MAX_REQUEST_RETRIES`
- `true`: Knapsack Pro will switch to Fallback Mode after `KNAPSACK_PRO_MAX_REQUEST_RETRIES`

### Related FAQs

- [What happens when Knapsack Pro API is not available/not reachable temporarily?](https://knapsackpro.com/faq/question/what-happens-when-knapsack-pro-api-is-not-availablenot-reachable-temporarily)

## `KNAPSACK_PRO_FIXED_QUEUE_SPLIT` (Queue Mode)

Dynamic or fixed tests split when retrying a CI build.

Default: `false`

Available:
- `false`: generate a new split when `KNAPSACK_PRO_CI_NODE_BUILD_ID` changes (see what Knapsack Pro uses as `node_build_id` for your [CI provider](https://github.com/KnapsackPro/knapsack_pro-ruby/tree/master/lib/knapsack_pro/config/ci))
- `true`: if the triplet `(branch name, commit hash, number of nodes)` was already split in a previous build use the same split, otherwise generate a new split

Recommended:
- `true` when your CI allows retrying single CI nodes or if your CI nodes are spot instances/preemptible
- `true` when your CI uses the same `KNAPSACK_PRO_CI_NODE_BUILD_ID` on retries (e.g., GitHub Actions, Travis, CodeShip)
- `false` otherwise

:::caution
With `KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true`, make sure you take care of [`KNAPSACK_PRO_CI_NODE_RETRY_COUNT`](#knapsack_pro_ci_node_retry_count).
:::

## `KNAPSACK_PRO_FIXED_TEST_SUITE_SPLIT` (Regular Mode)

Dynamic or fixed tests split when retrying a CI build.

Default: `true`

Available:
- `false`: generate a new split when `KNAPSACK_PRO_CI_NODE_BUILD_ID` changes (see what Knapsack Pro uses as `node_build_id` for your [CI provider](https://github.com/KnapsackPro/knapsack_pro-ruby/tree/master/lib/knapsack_pro/config/ci))
- `true`: if the triplet `(branch name, commit hash, number of nodes)` was already split in a previous build use the same split, otherwise generate a new split

Recommended:
- `true` when your CI allows retrying single CI nodes or if your CI nodes are spot instances/preemptible
- `true` when your CI uses the same `KNAPSACK_PRO_CI_NODE_BUILD_ID` on retries (e.g., GitHub Actions, Travis, CodeShip)
- `false` otherwise

:::caution
With `KNAPSACK_PRO_FIXED_TEST_SUITE_SPLIT=true`, make sure you take care of [`KNAPSACK_PRO_CI_NODE_RETRY_COUNT`](#knapsack_pro_ci_node_retry_count).
:::

## `KNAPSACK_PRO_LOG_DIR`

Default: `stdout`

Available: `stdout` | directory

When `KNAPSACK_PRO_LOG_DIR=log`, Knapsack Pro will write logs to the `log` directory and append the CI node index to the name. For example:

- `log/knapsack_pro_node_0.log`
- `log/knapsack_pro_node_1.log`

### Related FAQs

- [How to write `knapsack_pro` logs to a file?](https://knapsackpro.com/faq/question/how-to-write-knapsack_pro-logs-to-a-file)

## `KNAPSACK_PRO_LOG_LEVEL`

Default: `debug`

Available: `debug` | `info` | `warn` | `error` | `fatal`

Recommended: `debug` when debugging issues, `info` to know what Knapsack Pro is doing

### Related FAQs

- [How can I change log level?](https://knapsackpro.com/faq/question/how-can-i-change-log-level)

## `KNAPSACK_PRO_MAX_REQUEST_RETRIES`

Max amount of request attempts to try before switching to [Fallback Mode](/overview/#fallback-mode). Retries respect a linear back-off.

Default:
- `6` when `KNAPSACK_PRO_FALLBACK_MODE_ENABLED=false`
- `6` in Regular Mode
- `3` otherwise

Available: number

## `KNAPSACK_PRO_MODE` (Internal)

Default: `production`

Available:
- `production` sets `KNAPSACK_PRO_ENDPOINT` to `https://api.knapsackpro.com`
- `development` sets `KNAPSACK_PRO_ENDPOINT` to `http://api.knapsackpro.test:3000`
- `test` sets `KNAPSACK_PRO_ENDPOINT` to `https://api-staging.knapsackpro.com`

## `KNAPSACK_PRO_MODIFY_DEFAULT_RSPEC_FORMATTERS` (RSpec)

Enable/disable monkey patching of the [RSpec Formatters](https://www.relishapp.com/rspec/rspec-core/v/2-6/docs/command-line/format-option). You may want to set it to `false` if it interferes with your custom formatter.

Default: `true`

Available:
- `true`: Show the summary of pending and failed tests only at the end of the test run.
- `false`: Show the summary of pending and failed tests after each intermediate batch of tests. The summary is cumulative so you will the same tests mentioned multiple times, though they are executed only once.

## `KNAPSACK_PRO_PROJECT_DIR`

Absolute path to the project directory (containing `.git/`) on the CI node.

Required with `KNAPSACK_PRO_REPOSITORY_ADAPTER=git`.

Default: not set

Example: `/home/ubuntu/my-app-repository`

## `KNAPSACK_PRO_REPOSITORY_ADAPTER`

Controls how Knapsack Pro sets `KNAPSACK_PRO_BRANCH` and `KNAPSACK_PRO_COMMIT_HASH`.

Default: not set

Available:
- not set: Knapsack Pro will take `KNAPSACK_PRO_BRANCH` and `KNAPSACK_PRO_COMMIT_HASH` from the CI environment (see [supported CIs](https://github.com/KnapsackPro/knapsack_pro-ruby/tree/master/lib/knapsack_pro/config/ci))
- `git` (requires `KNAPSACK_PRO_PROJECT_DIR`): Knapsack Pro will set `KNAPSACK_PRO_BRANCH` and `KNAPSACK_PRO_COMMIT_HASH` using git on your CI

## `KNAPSACK_PRO_SLOW_TEST_FILE_PATTERN` (Internal)

Split by test examples only files matching the pattern (instead of letting Knapsack Pro decide for you).

Requires `KNAPSACK_PRO_RSPEC_SPLIT_BY_TEST_EXAMPLES=true`, and must be subset of `KNAPSACK_PRO_TEST_FILE_PATTERN`.

This is supposed to be used by gem developers for debugging Knapsack Pro. But if you decide to use it, **provide a short list of slow test files**. If the matched files are too many, the test suite may slow down or fail: the Knapsack Pro API could time out, or CI could run out of memory.

Default: `nil`

Available: anything that [Dir.glob](https://ruby-doc.org/core-3.0.0/Dir.html#method-c-glob) accepts

Example:
```bash
KNAPSACK_PRO_RSPEC_SPLIT_BY_TEST_EXAMPLES=true \
KNAPSACK_PRO_SLOW_TEST_FILE_PATTERN="{spec/models/user_spec.rb,spec/controllers/**/*_spec.rb}"
```

Make sure to read the details in [Split by test examples](/ruby/split-by-test-examples).

## `KNAPSACK_PRO_RSPEC_SPLIT_BY_TEST_EXAMPLES` (RSpec)

Parallelize test examples (instead of files) across CI nodes.

:::caution
- Requires RSpec >= 3.3.0
- Does not support `run_all_when_everything_filtered`
- Does not support `--tag`
:::

```bash
KNAPSACK_PRO_RSPEC_SPLIT_BY_TEST_EXAMPLES=true
```

Make sure to read the details in [Split by test examples](/ruby/split-by-test-examples).

### Related FAQs

- [How to split slow RSpec test files by test examples (by individual it)?](https://knapsackpro.com/faq/question/how-to-split-slow-rspec-test-files-by-test-examples-by-individual-it#warning-dont-use-deprecated-rspec-run_all_when_everything_filtered-option)

## `KNAPSACK_PRO_SALT`

Salt to use to [Encrypt Test File Names or Branch Names](/ruby/encryption/).

## `KNAPSACK_PRO_TEST_DIR` (Cucumber)

Passed as-is to Cucumber's [`--require`](https://github.com/cucumber/cucumber-ruby/blob/5220e53d91d5fb0dbca2eea1e650b54a83743a0c/lib/cucumber/cli/options.rb#L345).

Default: `features`

Available: any folder or file relative to the root of your project

Example:
```bash
KNAPSACK_PRO_TEST_DIR="features/support/cucumber_config.rb"
```

### Related FAQs

- [How to require different Cucumber config files in isolation?](https://knapsackpro.com/faq/question/how-to-require-different-cucumber-config-files-in-isolation)

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
```
:::

### Related FAQs

- [How can I run tests from multiple directories?](https://knapsackpro.com/faq/question/how-can-i-run-tests-from-multiple-directories)

## `KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN`

Exclude tests matching a pattern. It can be used in tandem with `KNAPSACK_PRO_TEST_FILE_PATTERN`.

Default: `nil`

Available: anything that [Dir.glob](https://ruby-doc.org/core-3.0.0/Dir.html#method-c-glob) accepts

Hint: you can debug `Dir.glob(MY_GLOB)` in irb or rails console

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

File containing the list of **relative paths** of tests to run. When `KNAPSACK_PRO_TEST_FILE_LIST_SOURCE_FILE` is set, both `KNAPSACK_PRO_TEST_FILE_PATTERN` and `KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN` are ignored.

Default: `nil`

Example:
```bash
KNAPSACK_PRO_TEST_FILE_LIST_SOURCE_FILE=spec/fixtures/list.txt

# ✅ list.txt
./spec/test1_spec.rb
spec/test2_spec.rb[1]
./spec/test3_spec.rb[1:2:3:4]
./spec/test4_spec.rb:4
./spec/test4_spec.rb:5

# ⛔️ list.txt
/home/user123/project/spec/test1_spec.rb
/home/user123/project/spec/test2_spec.rb[1]
/home/user123/project/spec/test3_spec.rb[1:2:3:4]
/home/user123/project/spec/test4_spec.rb:4
/home/user123/project/spec/test4_spec.rb:5
```

### Related FAQs

- [How to run a specific list of test files or only some tests from test file?](https://knapsackpro.com/faq/question/how-to-run-a-specific-list-of-test-files-or-only-some-tests-from-test-file)

## `KNAPSACK_PRO_TEST_FILE_PATTERN`

:::caution
Make sure to match individual files by adding the suffix (e.g., `_spec.rb`, `_test.rb`) so that Knapsack Pro can split by file and not by directory.
:::

Run tests matching a pattern. It can be used in tandem with `KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN`.

Default: all tests for the given test runner

Available: anything that [Dir.glob](https://ruby-doc.org/core-3.0.0/Dir.html#method-c-glob) accepts

Hint: you can debug `Dir.glob(MY_GLOB)` in irb or rails console

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

## `KNAPSACK_PRO_TEST_FILES_ENCRYPTED`

Enable [Test File Names Encryption](/ruby/encryption/).

Default: `false`

Available: `false` | `true`

## `KNAPSACK_PRO_TEST_SUITE_TOKEN_*`

- `KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC`
- `KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER`
- `KNAPSACK_PRO_TEST_SUITE_TOKEN_MINITEST`
- `KNAPSACK_PRO_TEST_SUITE_TOKEN_TEST_UNIT`
- `KNAPSACK_PRO_TEST_SUITE_TOKEN_SPINACH`

API token required to run `knapsack_pro`.

Each `knapsack_pro` command defined on CI should use an individual API token.

Example:
```bash
KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=MY_RSPEC_API_TOKEN \
  bundle exec rake knapsack_pro:rspec

KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=MY_OTHER_RSPEC_API_TOKEN \
  bundle exec rake knapsack_pro:rspec[--tag tagA]

KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=MY_CUCUMBER_API_TOKEN \
  bundle exec rake knapsack_pro:cucumber
```

### Related FAQs
- [How many API tokens/keys do I need?](https://knapsackpro.com/faq/question/how-many-api-keys-i-need)
- [Do I need to use separate API token for Queue Mode and Regular Mode?](https://knapsackpro.com/faq/question/do-i-need-to-use-separate-api-token-for-queue-mode-and-regular-mode)
