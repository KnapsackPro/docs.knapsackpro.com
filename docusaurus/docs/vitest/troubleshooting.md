---
pagination_next: null
pagination_prev: null
---

# Vitest Troubleshooting

## JavaScript heap out of memory

You can increase the memory available to Node with [`--max_old_space_size`](https://nodejs.org/api/cli.html#--max-old-space-sizesize-in-megabytes):

```bash
export NODE_OPTIONS=--max_old_space_size=4096

npx knapsack-pro-jest

npx knapsack-pro-cypress

npx knapsack-pro-vitest
```

## Debug Knapsack Pro on your development environment/machine

To reproduce what Knapsack Pro executed on a specific CI node, check out the same branch and run:

```bash
KNAPSACK_PRO_TEST_SUITE_TOKEN_VITEST=MY_TOKEN \
KNAPSACK_PRO_CI_NODE_INDEX=MY_INDEX \
KNAPSACK_PRO_CI_NODE_TOTAL=MY_TOTAL \
KNAPSACK_PRO_BRANCH=MY_BRANCH \
KNAPSACK_PRO_COMMIT_HASH=MY_COMMIT \
KNAPSACK_PRO_CI_NODE_BUILD_ID=MY_BUILD_ID \
KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true \
KNAPSACK_PRO_TEST_FILE_PATTERN="**/*.{test,spec}.?(c|m)[jt]s?(x)" \
npx knapsack-pro-vitest
```

`KNAPSACK_PRO_CI_NODE_BUILD_ID` must be the same as the CI build you are trying to reproduce (if it helps, take a look at what Knapsack Pro uses as `ciNodeBuildId` for your [CI provider](https://github.com/KnapsackPro/knapsack-pro-js/tree/main/packages/core/src/ci-providers)).

## No tests are executed (or `test_files: [ 'parameter is required' ]`)

Make sure [`KNAPSACK_PRO_TEST_FILE_PATTERN`](reference.md#knapsack_pro_test_file_pattern) is correct.
