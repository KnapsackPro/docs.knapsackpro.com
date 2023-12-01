---
pagination_next: null
pagination_prev: null
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Using Knapsack Pro with CircleCI

## Collect metadata in Queue Mode

You may want to [collect metadata](https://circleci.com/docs/2.0/collect-test-data/#metadata-collection-in-custom-test-steps) in CircleCI. For example, to collect junit reports of your RSpec runs you would:

- Configure the [junit formatter for RSpec](rspec.md#queue-mode)
- Copy the report to the `$CIRCLE_TEST_REPORTS` directory as shown below

<Tabs>
<TabItem value="RSpec">

```ruby title="spec_helper.rb or rails_helper.rb"
# `TMP_REPORT` must be the same path as `--out`
# `TMP_REPORT` must be a full path (no `~`)
TMP_REPORT = "tmp/tmp_rspec_#{ENV['KNAPSACK_PRO_CI_NODE_INDEX']}.xml"
FINAL_REPORT = "tmp/final_rspec_#{ENV['KNAPSACK_PRO_CI_NODE_INDEX']}.xml"

KnapsackPro::Hooks::Queue.after_subset_queue do |queue_id, subset_queue_id|
  if File.exist?(TMP_REPORT)
    FileUtils.mv(TMP_REPORT, FINAL_REPORT)
  end
end

# highlight-start
KnapsackPro::Hooks::Queue.after_queue do |queue_id|
  if File.exist?(FINAL_REPORT) && ENV['CIRCLE_TEST_REPORTS']
    FileUtils.cp(FINAL_REPORT, "#{ENV['CIRCLE_TEST_REPORTS']}/rspec.xml")
  end
end
# highlight-end
```

</TabItem>
<TabItem value="CircleCI">

```yaml title=".circleci/config.yml"
- run:
    name: RSpec with Knapsack Pro in Queue Mode
    command: |
      export CIRCLE_TEST_REPORTS=/tmp/test-results
      mkdir -p $CIRCLE_TEST_REPORTS
      bundle exec rake "knapsack_pro:queue:rspec[--format documentation --format RspecJunitFormatter --out tmp/rspec.xml]"

- store_test_results:
    path: /tmp/test-results

- store_artifacts:
    path: /tmp/test-results
    destination: test-results
```

</TabItem>
</Tabs>

You can find a complete CircleCI configuration in [RSpec testing parallel jobs with CircleCI and JUnit XML report](https://docs.knapsackpro.com/2021/rspec-testing-parallel-jobs-with-circleci-and-junit-xml-report).
