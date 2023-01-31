---
pagination_next: null
pagination_prev: null
toc_max_heading_level: 2
---

# Reference

## `KNAPSACK_PRO_TEST_FILE_LIST_SOURCE_FILE`

File containing the list of tests to run. When `KNAPSACK_PRO_TEST_FILE_LIST_SOURCE_FILE` is set, both `KNAPSACK_PRO_TEST_FILE_PATTERN` and `KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN` are ignored.

Default: `undefined`

Example:
```bash
KNAPSACK_PRO_TEST_FILE_LIST_SOURCE_FILE=__tests__/fixtures/list.txt

# list.txt
__tests__/a.test.js
__tests__/b.test.js
__tests__/c.test.js 
```
