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

You can pass all the [supported Cypress CLI options](https://docs.cypress.io/guides/guides/module-api#Options) as command-line arguments:

```bash
$(npm bin)/knapsack-pro-cypress --browser chrome
```

You can also pass options to Node with environment variables (e.g., [`--max_old_space_size`](/cypress/troubleshooting/#javascript-heap-out-of-memory)).

## `KNAPSACK_PRO_BRANCH`

Git branch under test.

You don't need to set it if either:
- Your CI is one of the [supported CIs](https://github.com/KnapsackPro/knapsack-pro-core-js/tree/master/src/ci-providers)
- Your CI has git installed so that Knapsack Pro can retrieve it

## `KNAPSACK_PRO_CI_NODE_BUILD_ID`

Unique ID that identifies a CI build. It must be the same for all the parallel CI nodes.

Default: Knapsack Pro will take it from the CI environment (see [supported CIs](https://github.com/KnapsackPro/knapsack-pro-core-js/tree/master/src/ci-providers))

If your CI is not supported, you may generate a build ID with `KNAPSACK_PRO_CI_NODE_BUILD_ID=$(openssl rand - base64 32)` and make it available to all parallel nodes.

## `KNAPSACK_PRO_CI_NODE_INDEX`

Index of current CI node (first should be 0, second should be 1, etc.).

Default: Knapsack Pro will take it from the CI environment (see [supported CIs](https://github.com/KnapsackPro/knapsack-pro-core-js/tree/master/src/ci-providers))

If your CI is not supported, you need to set it manually.

## `KNAPSACK_PRO_CI_NODE_TOTAL`

Total number of parallel CI nodes.

Default: Knapsack Pro will take it from the CI environment (see [supported CIs](https://github.com/KnapsackPro/knapsack-pro-core-js/tree/master/src/ci-providers))

If your CI is not supported, you need to set it manually.

## `KNAPSACK_PRO_COMMIT_HASH`

Hash of the commit under test.

You don't need to set it if either:
- Your CI is one of the [supported CIs](https://github.com/KnapsackPro/knapsack-pro-core-js/tree/master/src/ci-providers)
- Your CI has git installed so that Knapsack Pro can retrieve it

## `KNAPSACK_PRO_ENDPOINT` (Internal)

Default: `https://api.knapsackpro.com`

## `KNAPSACK_PRO_FIXED_QUEUE_SPLIT`

Dynamic or fixed tests split when retrying a CI build.

Default: `false`

Available:
- `false`: generate a new split when `KNAPSACK_PRO_CI_NODE_BUILD_ID` changes (see what Knapsack Pro uses as `ciNodeBuildId` for your [CI provider](https://github.com/KnapsackPro/knapsack-pro-core-js/tree/master/src/ci-providers))
- `true`: if the triplet `(branch name, commit hash, number of nodes)` was already split in a previous build use the same split, otherwise generate a new split

Recommended:
- `true` when your CI allows retrying single CI nodes or if your CI nodes are spot instances/preemptible
- `true` when your CI uses the same `KNAPSACK_PRO_CI_NODE_BUILD_ID` on retries (e.g., GitHub Actions, Travis, CodeShip)
- `false` otherwise

## `KNAPSACK_PRO_LOG_LEVEL`

Default: `info`

Available:
- `error`: critical errors
- `warn`: warnings (e.g. Fallback Mode has started)
- `info`: Knapsack Pro API request response body
- `verbose`
- `debug`: Knapsack Pro API request headers and body
- `silly`

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
Knapsack Pro ignores patterns specified as Cypress CLI arguments or Cypress config files.
:::

:::caution
If you are using Cypress < v10 use `"cypress/integration/**/*.{js,jsx,coffee,cjsx}"`.
:::

Run tests matching a pattern. It can be used in tandem with `KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN`.

Default: `"cypress/e2e/**/*.{js,jsx,coffee,cjsx}"`

Available: anything that [node-glob](https://github.com/isaacs/node-glob#glob-primer) accepts

Hint: you can debug in `node`

```js
var glob = require("glob")
var MY_GLOB="cypress/e2e/**/*.{js,jsx,coffee,cjsx}"
glob(MY_GLOB, {}, function (err, files) { console.log(files) })
```

Examples:
```bash
KNAPSACK_PRO_TEST_FILE_PATTERN="cypress/e2e/**/*.{js,jsx,coffee,cjsx}"

KNAPSACK_PRO_TEST_FILE_PATTERN="cypress/e2e/**/*.{js,jsx,coffee,cjsx}" \
KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN="cypress/e2e/admin/**/*.{js,jsx}"
```

## `KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS`

API token required to run Knapsack Pro.

Each Knapsack Pro command defined on CI should use an individual API token.

Example:
```bash
KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=MY_CYPRESS_API_TOKEN \
KNAPSACK_PRO_TEST_FILE_PATTERN="cypress/e2e/user/**/*.{js,jsx,coffee,cjsx}" \
  $(npm bin)/knapsack-pro-cypress

KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=MY_OTHER_CYPRESS_API_TOKEN \
KNAPSACK_PRO_TEST_FILE_PATTERN="cypress/e2e/admin/**/*.{js,jsx,coffee,cjsx}" \
  $(npm bin)/knapsack-pro-cypress
```