---
pagination_next: null
pagination_prev: null
toc_max_heading_level: 2
---

# Reference

You can configure things in two ways:
- Command-line arguments for the test runner
- Environment variables for Knapsack Pro or Node

Unless specified otherwise, everything on this page is environment variables.

## Command-line arguments

:::caution
Use long options instead of short (e.g., `--updateSnapshot` instead of `-u`).
:::

You can pass all the [supported Jest CLI options](https://jestjs.io/docs/en/cli#options) as command-line arguments:

```bash
$(npm bin)/knapsack-pro-jest --debug
```

You can also pass options to Node with environment variables (e.g., [`--max_old_space_size`](/jest/troubleshooting/#javascript-heap-out-of-memory)).

## `KNAPSACK_PRO_LOG_LEVEL`

Default: `info`

Available:
- `error`: critical errors
- `warn`: warnings (e.g. Fallback Mode has started)
- `info`: Knapsack Pro API request response body
- `verbose`
- `debug`: Knapsack Pro API request headers and body
- `silly`

### Related FAQs

- [How can I change log level?](https://knapsackpro.com/faq/question/how-to-change-log-level)

## `KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN`

Exclude tests matching a pattern. It can be used in tandem with `KNAPSACK_PRO_TEST_FILE_PATTERN`.

Default: `undefined`

Available: anything that [node-glob](https://github.com/isaacs/node-glob#glob-primer) accepts

Hint: you can debug in `node`

```js
var glob = require("glob")
var MY_GLOB="{**/__tests__/**/*.js?(x),**/?(*.)(spec|test).js?(x)}"
glob(MY_GLOB, {}, function (err, files) { console.log(files) })
```

Examples:
```bash
KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN="**/__tests__/admin/**/*.js"

KNAPSACK_PRO_TEST_FILE_PATTERN=="{**/__tests__/**/*.js?(x),**/?(*.)(spec|test).js?(x)}" \
KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN="**/__tests__/admin/**/*.js"
```

### Related FAQs

- [How to exclude tests to ignore them from running in Jest?](https://knapsackpro.com/faq/question/how-to-exclude-tests-to-ignore-them-from-running-in-jest)

## `KNAPSACK_PRO_TEST_FILE_LIST_SOURCE_FILE`

File containing the list of **relative paths** of tests to run. When `KNAPSACK_PRO_TEST_FILE_LIST_SOURCE_FILE` is set, both `KNAPSACK_PRO_TEST_FILE_PATTERN` and `KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN` are ignored.

Default: `undefined`

Example:
```bash
KNAPSACK_PRO_TEST_FILE_LIST_SOURCE_FILE=__tests__/fixtures/list.txt

# ✅ list.txt
__tests__/a.test.js
__tests__/b.test.js
__tests__/c.test.js

# ⛔️ list.txt
/home/user123/project/__tests__/a.test.js
/home/user123/project/__tests__/b.test.js
/home/user123/project/__tests__/c.test.js
```

## `KNAPSACK_PRO_TEST_FILE_PATTERN`

:::caution
Make sure to match individual files by adding the suffix (e.g., `.js`) so that Knapsack Pro can split by file and not by directory.
:::

:::caution
Knapsack Pro ignores patterns specified as Jest CLI arguments or Jest config files.
:::

Run tests matching a pattern. It can be used in tandem with `KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN`.

Default: `"{**/__tests__/**/*.js?(x),**/?(*.)(spec|test).js?(x)}"`

Available: anything that [node-glob](https://github.com/isaacs/node-glob#glob-primer) accepts

Hint: you can debug in `node`

```js
var glob = require("glob")
var MY_GLOB="{**/__tests__/**/*.js?(x),**/?(*.)(spec|test).js?(x)}"
glob(MY_GLOB, {}, function (err, files) { console.log(files) })
```

Examples:
```bash
KNAPSACK_PRO_TEST_FILE_PATTERN=="{**/__tests__/**/*.js?(x),**/?(*.)(spec|test).js?(x)}"

KNAPSACK_PRO_TEST_FILE_PATTERN=="{**/__tests__/**/*.js?(x),**/?(*.)(spec|test).js?(x)}" \
KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN="**/__tests__/admin/**/*.js"
```

### Related FAQs

- [How to run tests only from a specific directory in Jest? Define your test files pattern with `KNAPSACK_PRO_TEST_FILE_PATTERN`](https://knapsackpro.com/faq/question/how-to-run-tests-only-from-specific-directory-in-jest)
