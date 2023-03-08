---
pagination_next: null
pagination_prev: null
---

# Troubleshooting

## Error with `--project`

Please use [`KNAPSACK_PRO_TEST_FILE_PATTERN`](/cypress/reference/#knapsack_pro_test_file_pattern) instead of `--project`.

If you really need to use `--project`, you can do so with an NPM script:

```json
{
  ...
  "scripts": {
    "knapsack-pro-cypress-subdirectory": "cd subdirectory && knapsack-pro-cypress"
  }
}
```

and invoke it with:

```bash
npm run knapsack-pro-cypress-for-subdirectory
```

## JavaScript heap out of memory

You can increase the memory available to Node with [`--max_old_space_size`](https://nodejs.org/api/cli.html#--max-old-space-sizesize-in-megabytes):

```bash
export NODE_OPTIONS=--max_old_space_size=4096

$(npm bin)/knapsack-pro-jest

$(npm bin)/knapsack-pro-cypress
```

## Debug Knapsack Pro on your development environment/machine

To reproduce what Knapsack Pro executed on a specific CI node, check out the same branch and run:

```bash
KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS=MY_TOKEN \
KNAPSACK_PRO_CI_NODE_INDEX=MY_INDEX \
KNAPSACK_PRO_CI_NODE_TOTAL=MY_TOTAL \
KNAPSACK_PRO_BRANCH=MY_BRANCH \
KNAPSACK_PRO_COMMIT_HASH=MY_COMMIT \
KNAPSACK_PRO_CI_NODE_BUILD_ID=MY_BUILD_ID \
KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true \
KNAPSACK_PRO_TEST_FILE_PATTERN="cypress/e2e/**/*.{js,jsx,coffee,cjsx}" \
$(npm bin)/knapsack-pro-cypress
```

`KNAPSACK_PRO_CI_NODE_BUILD_ID` must be the same as the CI build you are trying to reproduce (if it helps, take a look at what Knapsack Pro uses as `ciNodeBuildId` for your [CI provider](https://github.com/KnapsackPro/knapsack-pro-core-js/tree/master/src/ci-providers)).

## No tests are executed (or `test_files: [ 'parameter is required' ]`)

Make sure [`KNAPSACK_PRO_TEST_FILE_PATTERN`](/cypress/reference/#knapsack_pro_test_file_pattern) is correct.

## Related FAQs

- [How to run Cypress tests locally with Knapsack Pro?](https://knapsackpro.com/faq/question/how-to-run-cypress-tests-locally-with-knapsack-pro)
- [How to run tests only from a specific directory in Cypress? Define your test files pattern with `KNAPSACK_PRO_TEST_FILE_PATTERN`](https://knapsackpro.com/faq/question/how-to-run-tests-only-from-specific-directory-in-cypress)
- [I'm getting an error when I run Cypress with the `--project` option](https://knapsackpro.com/faq/question/i-m-getting-an-error-when-i-run-cypress-with-the-project-option)
- [JavaScript heap out of memory - how to increase the max memory for Node with `max_old_space_size`](https://knapsackpro.com/faq/question/javascript-heap-out-of-memory-how-to-increase-the-max-memory-for-node-with-max_old_space_size)
