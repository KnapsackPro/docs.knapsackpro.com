---
pagination_next: null
pagination_prev: null
---

# Troubleshooting

## Jest hangs after running tests

You may have open handles preventing Jest from exiting cleanly. You can check it with [`--detectOpenHandles`](https://jestjs.io/docs/cli#--detectopenhandles) or force exit with [`--forceExit`](https://jestjs.io/docs/cli#--forceexit):

```bash
$(npm bin)/knapsack-pro-jest --detectOpenHandles

$(npm bin)/knapsack-pro-jest --forceExit
```

Also, make sure `node` has enough [heap memory](/javascript-typescript/troubleshooting/#javascript-heap-out-of-memory) on your CI.

## Debug Knapsack Pro on your development environment/machine

To reproduce what Knapsack Pro executed on a specific CI node, check out the same branch and run:

```bash
KNAPSACK_PRO_TEST_SUITE_TOKEN_JEST=MY_TOKEN \
KNAPSACK_PRO_CI_NODE_INDEX=MY_INDEX \
KNAPSACK_PRO_CI_NODE_TOTAL=MY_TOTAL \
KNAPSACK_PRO_BRANCH=MY_BRANCH \
KNAPSACK_PRO_COMMIT_HASH=MY_COMMIT \
KNAPSACK_PRO_CI_NODE_BUILD_ID=MY_BUILD_ID \
KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true \
KNAPSACK_PRO_TEST_FILE_PATTERN="{**/__tests__/**/*.js?(x),**/?(*.)(spec|test).js?(x)}" \
$(npm bin)/knapsack-pro-jest --runInBand
```

`KNAPSACK_PRO_CI_NODE_BUILD_ID` must be the same as the CI build you are trying to reproduce (if it helps, take a look at what Knapsack Pro uses as `ciNodeBuildId` for your [CI provider](https://github.com/KnapsackPro/knapsack-pro-core-js/tree/master/src/ci-providers)).

## No tests are executed

Make sure [`KNAPSACK_PRO_TEST_FILE_PATTERN`](/jest/reference/#knapsack_pro_test_file_pattern) is correct.

## Related FAQs

- [How to run Jest tests locally with Knapsack Pro?](https://knapsackpro.com/faq/question/how-to-run-jest-tests-locally-with-knapsack-pro)
- [How to run tests only from a specific directory in Jest? Define your test files pattern with `KNAPSACK_PRO_TEST_FILE_PATTERN`](https://knapsackpro.com/faq/question/how-to-run-tests-only-from-specific-directory-in-jest)
- [Why Jest freezes after tests run? (Jest hangs indefinitely)](https://knapsackpro.com/faq/question/why-jest-freezes-after-tests-run-jest-hangs-indefinitely)
