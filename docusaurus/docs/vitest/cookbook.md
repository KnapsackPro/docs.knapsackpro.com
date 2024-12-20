---
pagination_next: null
pagination_prev: null
---

# Vitest Cookbook

cli args vitest supported?
what needs to be done for coverage KNAPSACK_PRO_COVERAGE_DIRECTORY and --coverage and config? https://github.com/KnapsackPro/knapsack-pro-js/blob/main/packages/vitest-example-test-suite/vitest.config.ts

## Use a Jest config file

:::caution

To filter tests use [`KNAPSACK_PRO_TEST_FILE_PATTERN`](reference.md#knapsack_pro_test_file_pattern).

:::

You can pass it with a [command-line argument](reference.md#command-line-arguments):

```bash
npx knapsack-pro-jest --config=jest.config.e2e.js
```

## Generate code coverage reports

```bash
export KNAPSACK_PRO_COVERAGE_DIRECTORY=coverage

npx knapsack-pro-jest --coverage
```

Knapsack Pro will generate one coverage report for each batch of tests executed on the CI node. To merge the reports you may consider [this script](https://github.com/facebook/jest/issues/2418#issuecomment-478932514).

## Generate XML reports

You can generate [jest-junit](https://github.com/jest-community/jest-junit) reports with:

```bash
export JEST_JUNIT_UNIQUE_OUTPUT_NAME=true

npx knapsack-pro-jest --ci --reporters=jest-junit
```

Knapsack Pro will generate one XML reports for each batch of tests executed on the CI node. Some CI providers (e.g., GitLab CI) can merge multiple XML files from parallel CI nodes.
