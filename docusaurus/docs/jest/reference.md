---
pagination_next: null
pagination_prev: null
toc_max_heading_level: 2
---

# Jest Reference

You can configure things in two ways:

- Command-line arguments for the test runner
- Environment variables for Knapsack Pro or Node

Unless specified otherwise, everything on this page is environment variables.

## Command-line arguments

:::caution

Use long options instead of short (e.g., `--updateSnapshot` instead of `-u`).

:::

You can pass all the [supported Jest CLI options](https://jestjs.io/docs/cli#options) as command-line arguments:

```bash
npx knapsack-pro-jest --debug
```

You can also pass options to Node with environment variables (e.g., [`--max_old_space_size`](troubleshooting.md#javascript-heap-out-of-memory)).

## `KNAPSACK_PRO_BRANCH`

Git branch under test.

You don't need to set it if either:

- Your CI is one of the [supported CIs](https://github.com/KnapsackPro/knapsack-pro-js/tree/main/packages/core/src/ci-providers)
- Your CI has git installed so that Knapsack Pro can retrieve it

In some cases, particularly for pull request merge commits or if the CI provider checks out a specific git commit during the build process, Git might only expose `HEAD` instead of the actual branch name.

## `KNAPSACK_PRO_CI_NODE_BUILD_ID`

Unique ID that identifies a CI build. It must be the same for all the parallel CI nodes.

Default: Knapsack Pro will take it from the CI environment (see [supported CIs](https://github.com/KnapsackPro/knapsack-pro-js/tree/main/packages/core/src/ci-providers))

If your CI is not supported, you may generate a build ID with `KNAPSACK_PRO_CI_NODE_BUILD_ID=$(openssl rand -base64 32)` and make it available to all parallel nodes.

## `KNAPSACK_PRO_CI_NODE_INDEX`

Index of current CI node (first should be 0, second should be 1, etc.).

Default: Knapsack Pro will take it from the CI environment (see [supported CIs](https://github.com/KnapsackPro/knapsack-pro-js/tree/main/packages/core/src/ci-providers))

If your CI is not supported, you need to set it manually.

## `KNAPSACK_PRO_CI_NODE_RETRY_COUNT`

A retry count of the current CI node in case of a single node/job retry.

There is no need to set this for the following CI providers that are supported out of the box:

* GitHub Actions
* Buildkite

For other CI providers:

If you use `KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true`, you need to set `KNAPSACK_PRO_CI_NODE_RETRY_COUNT=1` when retrying a single node to disable Fallback Mode. Otherwise, the CI node would use a different (fallback) split and run a different subset of tests when the API cannot be reached.

Default: `0` (or an environment variable for supported CI providers)

Available:

- `0`: Fallback Mode is enabled
- `> 0`: Fallback Mode is disabled and Knapsack Pro raises an error if the API cannot be reached

## `KNAPSACK_PRO_CI_NODE_TOTAL`

Total number of parallel CI nodes.

Default: Knapsack Pro will take it from the CI environment (see [supported CIs](https://github.com/KnapsackPro/knapsack-pro-js/tree/main/packages/core/src/ci-providers))

If your CI is not supported, you need to set it manually.

## `KNAPSACK_PRO_COMMIT_HASH`

Hash of the commit under test.

You don't need to set it if either:

- Your CI is one of the [supported CIs](https://github.com/KnapsackPro/knapsack-pro-js/tree/main/packages/core/src/ci-providers)
- Your CI has git installed so that Knapsack Pro can retrieve it

## `KNAPSACK_PRO_COVERAGE_DIRECTORY`

The directory where Jest should output its coverage files.

Default: `undefined`

Read more on [Generate code coverage reports](cookbook.md#generate-code-coverage-reports).

## `KNAPSACK_PRO_ENDPOINT` (Internal)

Default: `https://api.knapsackpro.com`

## `KNAPSACK_PRO_FIXED_QUEUE_SPLIT`

Dynamic or fixed tests split when retrying a CI build.

Default: automagically set to the correct value for your [CI provider](https://github.com/KnapsackPro/knapsack-pro-js/tree/main/packages/core/src/ci-providers)

Available:

- `false`: generate a new split when `KNAPSACK_PRO_CI_NODE_BUILD_ID` changes (see what Knapsack Pro uses as `ciNodeBuildId` for your [CI provider](https://github.com/KnapsackPro/knapsack-pro-js/tree/main/packages/core/src/ci-providers))
- `true`: if the triplet `(branch name, commit hash, number of nodes)` was already split in a previous build use the same split, otherwise generate a new split

Recommended:

- `true` when your CI allows retrying single CI nodes (e.g., Buildkite, GitHub Actions) or if your CI nodes are spot instances/preemptible
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

## `KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN`

Exclude tests matching a pattern. It can be used in tandem with `KNAPSACK_PRO_TEST_FILE_PATTERN`.

Default: `undefined`

Available: anything that [node-glob](https://github.com/isaacs/node-glob#glob-primer) accepts

Hint: you can debug in `node`

```js
const { globSync } = require("glob");
const MY_GLOB = "{**/__tests__/**/*.js?(x),**/?(*.)(spec|test).js?(x)}";
const files = globSync(MY_GLOB);
console.log(files);
```

Examples:

```bash
KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN="**/__tests__/admin/**/*.js"
# or
KNAPSACK_PRO_TEST_FILE_PATTERN=="{**/__tests__/**/*.js?(x),**/?(*.)(spec|test).js?(x)}" \
KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN="**/__tests__/admin/**/*.js"
```

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
const { globSync } = require("glob");
const MY_GLOB = "{**/__tests__/**/*.js?(x),**/?(*.)(spec|test).js?(x)}";
const files = globSync(MY_GLOB);
console.log(files);
```

Examples:

```bash
KNAPSACK_PRO_TEST_FILE_PATTERN=="{**/__tests__/**/*.js?(x),**/?(*.)(spec|test).js?(x)}"
# or
KNAPSACK_PRO_TEST_FILE_PATTERN=="{**/__tests__/**/*.js?(x),**/?(*.)(spec|test).js?(x)}" \
KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN="**/__tests__/admin/**/*.js"
```

## `KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST`

API token required to run Knapsack Pro.

Each Knapsack Pro command defined on CI should use an individual API token.

Example:

```bash
KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST=MY_JEST_API_TOKEN \
KNAPSACK_PRO_TEST_FILE_PATTERN=="src/user/__tests__/**/*.js" \
  npx knapsack-pro-jest

KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST=MY_OTHER_JEST_API_TOKEN \
KNAPSACK_PRO_TEST_FILE_PATTERN=="src/admin/__tests__/**/*.js" \
  npx knapsack-pro-jest
```

## `KNAPSACK_PRO_USER_SEAT`

A user name that started the CI build. It is usually the same person that made the git commit.

You don't need to set it if:

- Your CI is one of the [supported CIs](https://github.com/KnapsackPro/knapsack-pro-js/tree/main/packages/core/src/ci-providers), and we can read the user seat for the given CI provider.

Examples:

```bash
KNAPSACK_PRO_USER_SEAT="John Doe <john.doe@example.com>"
```
