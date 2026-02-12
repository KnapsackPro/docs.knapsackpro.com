---
pagination_next: null
pagination_prev: null
---

import { TOCBottom } from '@site/src/components/TOCBottom'
import { IconExternalLink } from '@site/src/components/IconExternalLink'

<TOCBottom heading="Reference" Icon={<IconExternalLink />}>

- [`KNAPSACK_PRO_TEST_QUEUE_ID`](reference.md#knapsack_pro_test_queue_id-queue-mode-rspec)

</TOCBottom>

# Retry only Failures

:::caution

Only RSpec ([Queue Mode](queue-mode.mdx)) is supported for now.

:::

A substantial percentage of your CI retries are spent running tests that already passed on the previous run. Not only is it a waste of time & resources, it's also an opportunity for flakes to cause troubles.

With Retry only Failures, when you retry one (or all the) nodes, Knapsack Pro only executes *only* the tests that failed last time on that node.

## Configuration

To enable Retry only Failures, `bundle update knapsack_pro` to v10 or later.

Knapsack Pro uses [`KNAPSACK_PRO_TEST_QUEUE_ID`](reference.md#knapsack_pro_test_queue_id-queue-mode-rspec) to uniquely identify a queue on the first run and all its retries.

## Additional configuration for CircleCI

On CircleCI, you need to expose the pipeline number as follows:

```yml
# ...
environment:
  CIRCLE_PIPELINE_NUMBER: << pipeline.number >>
```

## Example

Let's say your test suite contains 3 specs:
- `a_spec.rb`
- `b_spec.rb`
- `c_spec.rb`

If you run your tests on 2 nodes, you could expect the following split:
- Node 0: executes `a_spec.rb` and `b_spec.rb` where `a_spec.rb[1:1:2]` fails and `b_spec.rb[2:1]` is skipped
- Node 1: executes `c_spec.rb` successfully

If you retry Node 0, Retry only Failures will execute only `a_spec.rb[1:1:2]`. If you retry Node 1, Retry only Failures will execute no tests.

## You can also retry locally

After a build finished on CI, you can retry the failed tests locally with:

```bash
export KNAPSACK_PRO_TEST_SUITE_TOKEN=MY_TOKEN
bundle exec knapsack_pro retry
```

Check `bundle exec knapsack_pro help retry` for all the options.
