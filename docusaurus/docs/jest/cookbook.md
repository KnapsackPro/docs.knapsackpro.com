---
pagination_next: null
pagination_prev: null
---

# Cookbook

## Type-check in a separate CI step with `ts-jest`

Since Knapsack Pro runs Jest multiple times, you can speed up tests execution by moving type-checking ([`isolatedModules`](https://huafu.github.io/ts-jest/user/config/isolatedModules)) and [`diagnostics`](https://huafu.github.io/ts-jest/user/config/diagnostics) to a separate CI step. On larger codebases, it increases execution time by more than 50%.

```js title="jest.config.js"
{
  "globals": {
    "ts-jest": {
      "diagnostics": false,
      "isolatedModules": true
    }
  }
}
```

## Speed up tests with `--runInBand`

Since Knapsack Pro runs Jest multiple times, you can speed up tests execution with `--runInBand`. This way tests run serially in the current process, rather than creating a worker pool of child processes that run tests:

```bash
$(npm bin)/knapsack-pro-jest --runInBand
```

## Use a Jest config file

:::caution
To filter tests use [`KNAPSACK_PRO_TEST_FILE_PATTERN`](reference.md#knapsack_pro_test_file_pattern).
:::

You can pass it with a [command-line argument](reference.md#command-line-arguments):

```bash
$(npm bin)/knapsack-pro-jest --config=jest.config.e2e.js
```

## Generate code coverage reports

```bash
export KNAPSACK_PRO_COVERAGE_DIRECTORY=coverage

$(npm bin)/knapsack-pro-jest --coverage
```

Knapsack Pro will generate one coverage report for each batch of tests executed on the CI node. To merge the reports you may consider [this script](https://github.com/facebook/jest/issues/2418#issuecomment-478932514).

## Generate XML reports

You can generate [jest-junit](https://github.com/jest-community/jest-junit) reports with:

```bash
export JEST_JUNIT_UNIQUE_OUTPUT_NAME=true

$(npm bin)/knapsack-pro-jest --ci --reporters=jest-junit
```

Knapsack Pro will generate one XML reports for each batch of tests executed on the CI node. Some CI providers (e.g., GitLab CI) can merge multiple XML files from parallel CI nodes.
