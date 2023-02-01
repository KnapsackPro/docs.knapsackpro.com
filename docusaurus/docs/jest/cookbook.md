---
pagination_next: null
pagination_prev: null
---

# Cookbook

## Use a Jest config file

:::caution
To filter tests use [`KNAPSACK_PRO_TEST_FILE_PATTERN`](/jest/reference/#knapsack_pro_test_file_pattern).
:::

You can pass it with a [command-line argument](/jest/reference/#command-line-arguments):

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

## Related FAQs

- [How to use Jest config file with Knapsack Pro Jest?](https://knapsackpro.com/faq/question/how-to-use-jest-config-file-with-knapsack-pro-jest)
- [How to generate code coverage for Jest with Knapsack Pro Jest in Queue Mode?](https://knapsackpro.com/faq/question/how-to-generate-code-coverage-for-jest-with-knapsack-pro-jest-in-queue-mode)
- [How to generate XML report using jest-junit with Knapsack Pro Jest in Queue Mode?](https://knapsackpro.com/faq/question/how-to-generate-xml-report-using-jest-junit-with-knapsack-pro-jest-in-queue-mode)
