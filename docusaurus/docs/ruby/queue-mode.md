---
pagination_next: null
pagination_prev: null
---

# Queue Mode

import { TOCBottom } from '@site/src/components/TOCBottom'
import { IconExternalLink } from '@site/src/components/IconExternalLink'

<TOCBottom heading="Reference" Icon={<IconExternalLink />}>

- [`KNAPSACK_PRO_CUCUMBER_QUEUE_PREFIX`](reference.md#knapsack_pro_cucumber_queue_prefix-cucumber-queue-mode)
- [`KNAPSACK_PRO_FIXED_QUEUE_SPLIT`](reference.md#knapsack_pro_fixed_queue_split-queue-mode)
- [`KNAPSACK_PRO_CI_NODE_RETRY_COUNT`](reference.md#knapsack_pro_ci_node_retry_count)

</TOCBottom>

:::caution

Only RSpec >= 3.x, Minitest, and Cucumber are supported. [Let us know](https://knapsackpro.com/contact) if you use a different test runner.

:::

Knapsack Pro splits your tests dynamically (Queue Mode) between parallel CI nodes.

Each Knapsack Pro Client (parallel CI node):

1. Retrieves from the Knapsack Pro API a subset of tests to execute
2. Runs those tests
3. Repeats 1. and 2. as long as there are more tests in the API queue
4. Sends the test execution times to the API for the subsequent CI runs

With Queue Mode, Knapsack Pro distributes tests so that each CI node finishes at the same time. Thanks to that, your CI build time is as fast as possible.

Knapsack Pro allows distributing the tests in a static way (Regular Mode) too, but it’s rarely a good solution:

- Tests themselves, especially end to end, have varying execution times
- Failing tests execute faster than green ones
- CI nodes may differ in hardware/performance
- CI nodes boot at different times
- CI nodes are more or less busy when the environment is shared/virtualized
- CI nodes may load their caches at dissimilar times
- Test execution starts at different times on different CI nodes
- Flaky tests are.. Well, flaky!

## Use Queue Mode

- Create a new API token from your [dashboard](https://knapsackpro.com/dashboard) (to avoid mixing Regular Mode and Queue Mode runs)
- Update the `knapsack_pro` gem to the [latest version](https://rubygems.org/gems/knapsack_pro)
- Run Knapsack Pro in Queue Mode with:

  ```bash
  # RSpec >= 3.x
  bundle exec rake knapsack_pro:queue:rspec

  # Minitest
  bundle exec rake knapsack_pro:queue:minitest

  # Cucumber
  bundle exec rake knapsack_pro:queue:cucumber
  ```

Note that Knapsack Pro returns single-file subsets when dealing with test files that haven't been recorded yet. This ensures your CI nodes complete at a similar time. However, if your test runner requires a long time to boot on each subset, it may take longer to run your tests. **This applies only to the first Knapsack Pro run ever per API token.**

## Dynamic Split vs Fixed Split

:::info

By default, Knapsack Pro automagically decides how to split your tests depending on your CI provider. But you can continue reading if you prefer to have more control over the split strategy.

:::

Knapsack Pro generates a Dynamic Split from scratch for each CI build when [`KNAPSACK_PRO_FIXED_QUEUE_SPLIT=false`](reference.md#knapsack_pro_fixed_queue_split-queue-mode). In other words, Knapsack Pro:

- Creates a new queue filled with all the tests to run
- Distributes the tests to each parallel CI node connected to the queue
- Removes from the queue the tests that have been run

Parallel CI nodes connect to the same queue and run tests until it's consumed. If a CI node connects late and the queue is empty, it will receive an empty list of tests.

The behavior described above guarantees the most performant split for each CI build, but it's problematic if your CI allows retrying single CI nodes/jobs. In this case, you want Knapsack Pro to return a Fixed Split ([`KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true`](reference.md#knapsack_pro_fixed_queue_split-queue-mode)): the retried node gets the same subset of tests that it run previously (not an empty list as described above).

Notice that the Dynamic Split works great when your CI allows _only_ restarting all parallel CI nodes (instead of individual ones). In this case, each parallel CI node will receive a different subset of tests (because of the new queue), but the build would finish sooner.

If you use spot/preemptible CI nodes like [Google Cloud Preemptible VMs](https://cloud.google.com/preemptible-vms/) or [Amazon EC2 Spot Instances](https://aws.amazon.com/ec2/spot/), you also want a Fixed Split: when a preempted CI node restarts because of a manual or automatic retry, it re-runs the previous subset of tests before connecting to the queue to continue with the remaining ones.

Altogether, when using a Fixed Split, Knapsack Pro:

1. Checks if `(commit hash, branch name, number of nodes)` was already split
   1. YES: Returns to the CI node the subset of tests it run previously
   1. YES: Loads the queue with the remaining tests to run
   1. NO: Creates a new queue filled with all the tests to run (Dynamic Split)
1. Distributes the tests to each parallel CI node connected to the queue
1. Removes from the queue the tests that have been run
1. Caches the split for `(commit hash, branch name, number of nodes)`

When the Knapsack Pro API finds a previous split (i.) but the queue was already consumed (ii.), it logs:

```bash
[knapsack_pro] {"queue_name"=>nil, "test_files"=>[{"path"=>"spec/previously_executed_spec.rb", "time_execution"=>1.23}]}
```

When the Knapsack Pro API finds a previous split (i.) and remaining tests in the queue (ii.), it logs:

```bash
[knapsack_pro] {"queue_name"=>"retry-dead-ci-node:queue-id", "test_files"=>[{"path"=>"spec/previously_executed_spec.rb", "time_execution"=>1.23}]}
```

## Configuration and Troubleshooting

You can find additional configuration options and troubleshooting on the following pages:

- [Knapsack Pro Ruby - Troubleshooting](troubleshooting.md)
- [Using Knapsack Pro with RSpec](rspec.md)
- [Using Knapsack Pro with Cucumber](cucumber.md)
- [Using Knapsack Pro with Capybara](capybara.md)

import { YouTube } from "@site/src/components/YouTube"

<YouTube src="https://www.youtube.com/embed/hUEB1XDKEFY" />
