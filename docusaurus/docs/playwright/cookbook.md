---
pagination_next: null
pagination_prev: null
---

# Playwright Cookbook

## Run a subset of tests

To run a subset of your test suite you can use the `KNAPSACK_PRO_TEST_FILE_LIST_SOURCE_FILE` environment variable:

- [`KNAPSACK_PRO_TEST_FILE_LIST_SOURCE_FILE`](reference.md#knapsack_pro_test_file_list_source_file)

## Reporters

Use the [blob reporter](https://playwright.dev/docs/test-reporters#blob-reporter) without specifying an `outputDir` or `outputFile`. Later, execute `playwright --merge-reports` to output any aggregated reports you need (e.g., `json`):

```bash
npx @knapsack-pro/playwright --reporter=blob,@knapsack-pro/playwright/reporters/batch
npx playwright merge-reports --reporter=list blob-report/
```

Knapsack Pro generates one blob file per batch of tests executed named as follows: `blob-report/report-[HASH].zip` (e.g., `blob-report/report-24ad5ce.zip`).
