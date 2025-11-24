---
pagination_next: null
pagination_prev: null
---

import { TOCBottom } from '@site/src/components/TOCBottom'
import { IconExternalLink } from '@site/src/components/IconExternalLink'

<TOCBottom heading="Reference" Icon={<IconExternalLink />}>

- [`KNAPSACK_PRO_LOG_LEVEL`](reference.md#knapsack_pro_log_level)

</TOCBottom>

# Retry only Failures

:::caution

This feature is limited to beta-testers: write to support@knapsackpro.com to request early-access.

:::

:::caution

Only RSpec ([Queue Mode](queue-mode.mdx)) on GitHub Actions, CircleCI, GitLab CI, and Buildkite are supported for now.

:::

A substantial percentage of your CI retries are spent running tests that already passed on the previous run. Not only is it a waste of time & resources, it's also an opportunity for flakes to cause troubles.

When executing a rerun, Retry only Failures executes only the tests that failed on the previous build.

## Configuration

To enable Retry only Failures, update your Gemfile as follows:

```ruby
gem "knapsack_pro", github: "knapsackpro/knapsack_pro-ruby", branch: "rof"
```

Also, it's recommended to enable debug logs during the beta testing: [`KNAPSACK_PRO_LOG_LEVEL=debug`](reference.md#knapsack_pro_log_level)

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

## Retry locally

After a build finished on CI, you can retry the failed tests locally with:

```bash
export KNAPSACK_PRO_TEST_SUITE_TOKEN=MY_TOKEN
bundle exec knapsack_pro retry
```

Check `bundle exec knapsack_pro help retry` for all the options.
