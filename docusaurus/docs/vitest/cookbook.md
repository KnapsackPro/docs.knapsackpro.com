---
pagination_next: null
pagination_prev: null
---

# Vitest Cookbook

## Run a subset of tests

To run a subset of your test suite you can use the `KNAPSACK_PRO_TEST_FILE_*` environment variables:

- [`KNAPSACK_PRO_TEST_FILE_PATTERN`](reference.md#knapsack_pro_test_file_pattern)
- [`KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN`](reference.md#knapsack_pro_test_file_exclude_pattern)
- [`KNAPSACK_PRO_TEST_FILE_LIST_SOURCE_FILE`](reference.md#knapsack_pro_test_file_list_source_file)

## Test coverage

Use the [blob reporter](https://vitest.dev/guide/reporters.html#blob-reporter) without specifying an `outputFile`. Later, execute `vitest --merge-reports` to output coverage or any aggregated reports you need (e.g., `json`):

```bash
npx @knapsack-pro/vitest --coverage --reporter=blob
npx vitest --merge-reports --coverage
```

Knapsack Pro generates one blob file per batch of tests executed named as follows: `.vitest-reports/blob-[NODE_INDEX]-[NODE_TOTAL]-[UUID].json` (e.g., `.vitest-reports/blob-0-1-c841c55d-4fb9-449d-a701-09f3549ad8e3.json`).
