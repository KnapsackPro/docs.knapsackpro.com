---
pagination_next: null
pagination_prev: null
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { YouTube } from '@site/src/components/YouTube';

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

## Rerun _only_ failed tests

Use the [CircleCI rerun failed tests](https://circleci.com/docs/rerun-failed-tests/) feature with Knapsack Pro to only rerun a subset of tests instead of rerunning the entire test suite when a transient test failure arises.

<YouTube src="https://www.youtube.com/embed/9WEsUosgTGw" />

<br />

```yaml title=".circleci/config.yml"
- run:
    name: RSpec with Knapsack Pro in Queue Mode
    command: |
      export CIRCLE_TEST_REPORTS=/tmp/test-results
      mkdir -p $CIRCLE_TEST_REPORTS

      # Split by test examples
      # https://docs.knapsackpro.com/ruby/split-by-test-examples/
      export KNAPSACK_PRO_RSPEC_SPLIT_BY_TEST_EXAMPLES=true

      # highlight-start
      # Retrieve the tests to run (all or just the failed ones), and let Knapsack Pro split them optimally.
      circleci tests glob "spec/**/*_spec.rb" | circleci tests run --index 0 --total 1 --command ">/tmp/tests_to_run.txt xargs echo" --verbose > /tmp/tests_to_run.txt

      # replace all spaces with newlines in the file
      sed -i 's/ /\n/g' /tmp/tests_to_run.txt

      if [[ -s "/tmp/tests_to_run.txt" ]]; then
        export KNAPSACK_PRO_TEST_FILE_LIST_SOURCE_FILE=/tmp/tests_to_run.txt
        bundle exec rake "knapsack_pro:queue:rspec[--format documentation --format RspecJunitFormatter --out tmp/rspec.xml]"
      fi
      # highlight-end

- store_test_results:
    path: /tmp/test-results

- store_artifacts:
    path: /tmp/test-results
    destination: test-results
```

- We use [`KNAPSACK_PRO_TEST_FILE_LIST_SOURCE_FILE`](reference.md#knapsack_pro_test_file_list_source_file) to feed Knapsack Pro with a list of test files to run.
- Optionally, you can use [`KNAPSACK_PRO_RSPEC_SPLIT_BY_TEST_EXAMPLES`](split-by-test-examples.md) to split slow test files by test examples automatically.
