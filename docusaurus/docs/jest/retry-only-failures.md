---
pagination_next: null
pagination_prev: null
---

import { TOCBottom } from '@site/src/components/TOCBottom'
import { IconExternalLink } from '@site/src/components/IconExternalLink'

<TOCBottom heading="Reference" Icon={<IconExternalLink />}>

- [`KNAPSACK_PRO_TEST_QUEUE_ID`](reference.md#knapsack_pro_test_queue_id)

</TOCBottom>

# Retry only Failures

A substantial percentage of your CI retries are spent running tests that already passed on the previous run. Not only is it a waste of time & resources, it's also an opportunity for flakes to cause troubles.

With Retry only Failures, when you retry one (or all the) nodes, Knapsack Pro only executes *only* the tests that failed last time on that node.

## Configuration

To enable Retry only Failures, `npm install @knapsack-pro/jest` to v10 or later.

Knapsack Pro uses [`KNAPSACK_PRO_TEST_QUEUE_ID`](reference.md#knapsack_pro_test_queue_id) to uniquely identify a queue on the first run and all its retries.

## Additional configuration for CircleCI

On CircleCI, you need to expose the pipeline number as follows:

```yml
# ...
environment:
  CIRCLE_PIPELINE_NUMBER: << pipeline.number >>
```

## Example

Let's say your test suite contains 3 tests:
- `a.test.js`
- `b.test.js`
- `c.test.js`

If you run your tests on 2 nodes, you could expect the following split:
- Node 0: executes `a.test.js` and `b.test.js` where one test in `a.test.js` fails and one test in `b.test.js` is skipped
- Node 1: executes `c.test.js` successfully

If you retry Node 0, Retry only Failures will execute only `a.test.js`. If you retry Node 1, Retry only Failures will execute no tests.
