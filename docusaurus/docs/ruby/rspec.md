---
pagination_next: null
pagination_prev: null
---

# Use Knapsack Pro with RSpec

## Parallelize test examples (instead of files)

You can set [`KNAPSACK_PRO_RSPEC_SPLIT_BY_TEST_EXAMPLES`](/ruby/reference/#knapsack_pro_rspec_split_by_test_examples-rspec) to parallelize tests at the `it`/`specify` level across CI nodes.

As an example, imagine you have two test files in your suite:

<div style={{ overflowX: 'auto' }}>
  <table style={{ width: '100%', display: 'table' }}>
    <thead>
      <tr>
        <th style={{ whiteSpace: 'nowrap' }}>Test file path (2 files)</th>
        <th style={{ width: '250px', whiteSpace: 'nowrap' }}>Time execution</th>
      </tr>
    </thead>
    <tbody>
      <tr style={{ backgroundColor: '#fcf8e3' }}>
        <td style={{ whiteSpace: 'nowrap' }}>spec/controllers/api/v3/books_controller_spec.rb</td>
        <td style={{ width: '250px', whiteSpace: 'nowrap' }}>
          6 minutes and 30 seconds
        </td>
      </tr>
      <tr style={{ backgroundColor: '#fcf8e3' }}>
        <td style={{ whiteSpace: 'nowrap' }}>spec/features/books_spec.rb</td>
        <td style={{ width: '250px', whiteSpace: 'nowrap' }}>
          2 minutes and 30 seconds
        </td>
      </tr>
    </tbody>
  </table>
</div>

On your [Knapsack Pro dashboard](/overview/#dashboard), you can see one is highlighted in yellow because it's a bottleneck.

By enabling `KNAPSACK_PRO_RSPEC_SPLIT_BY_TEST_EXAMPLES`, the bottleneck disappears because Knapsack Pro can distribute tests so that each CI node is balanced (e.g., 4.5 minutes + 4.5 minutes):

<div style={{ overflowX: 'auto' }}>
  <table style={{ width: '100%', display: 'table' }}>
    <thead>
      <tr>
        <th style={{ whiteSpace: 'nowrap' }}>Test file path (5 files)</th>
        <th style={{ whiteSpace: 'nowrap' }}>Time execution</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style={{ whiteSpace: 'nowrap' }}>spec/controllers/api/v3/books_controller_spec.rb[1:1]</td>
        <td style={{ width: '250px', whiteSpace: 'nowrap' }}>
          2 minutes
        </td>
      </tr>
      <tr>
        <td style={{ whiteSpace: 'nowrap' }}>spec/controllers/api/v3/books_controller_spec.rb[1:2]</td>
        <td style={{ width: '250px', whiteSpace: 'nowrap' }}>
          2 minutes
        </td>
      </tr>
      <tr>
        <td style={{ whiteSpace: 'nowrap' }}>spec/controllers/api/v3/books_controller_spec.rb[1:3]</td>
        <td style={{ width: '250px', whiteSpace: 'nowrap' }}>
          2 minutes
        </td>
      </tr>
      <tr>
        <td style={{ whiteSpace: 'nowrap' }}>spec/controllers/api/v3/books_controller_spec.rb[1:4]</td>
        <td style={{ width: '250px', whiteSpace: 'nowrap' }}>
          30 seconds
        </td>
      </tr>
      <tr>
        <td style={{ whiteSpace: 'nowrap' }}>spec/features/books_spec.rb[1:1]</td>
        <td style={{ width: '250px', whiteSpace: 'nowrap' }}>
          1 minute and 15 seconds
        </td>
      </tr>
      <tr>
        <td style={{ whiteSpace: 'nowrap' }}>spec/features/books_spec.rb[1:2]</td>
        <td style={{ width: '250px', whiteSpace: 'nowrap' }}>
          1 minute and 15 seconds
        </td>
      </tr>
    </tbody>
  </table>
</div>

To avoid memory overhead, Knapsack Pro only splits bottleneck files by test examples and parallelizes the rest of your test suite by file.

We recommend running at least 2 CI builds after you enable this feature or change the number of CI nodes to allow the Knapsack Pro API to learn about your test suite.

:::caution
Does not support `--tag`
:::

Due to the [RSpec internals](https://github.com/rspec/rspec-core/issues/2522), `--tag` might be ignored when used together with `KNAPSACK_PRO_RSPEC_SPLIT_BY_TEST_EXAMPLES`. But you can use the [environment variables](/ruby/reference) to filter the test files to run.

:::caution
Does not support `run_all_when_everything_filtered`
:::

Make sure to use [`filter_run_when_matching`](https://relishapp.com/rspec/rspec-core/v/3-12/docs/filtering/filter-run-when-matching) instead of the deprecated [`run_all_when_everything_filtered`](https://relishapp.com/rspec/rspec-core/v/2-3/docs/filtering/run-all-when-everything-filtered). The latter may cause skipping some of your tests.

```ruby
# ⛔️ Bad
RSpec.configure do |c|
  c.filter_run :focus => true
  c.run_all_when_everything_filtered = true
end

# ✅ Ok
RSpec.configure do |c|
  c.filter_run_when_matching :focus
end
```

### Related FAQs

- [How to split slow RSpec test files by test examples (by individual it)?](https://knapsackpro.com/faq/question/how-to-split-slow-rspec-test-files-by-test-examples-by-individual-it#warning-dont-use-deprecated-rspec-run_all_when_everything_filtered-option)

## Formatters ([`rspec_junit_formatter`](https://github.com/sj26/rspec_junit_formatter), [`json`](https://relishapp.com/rspec/rspec-core/v/3-12/docs/formatters/json-formatter))

### Regular Mode

Format stdout with the `documentation` formatter and file output with the `RspecJunitFormatter` formatter (you can use any RSpec supported formatter):

```bash
bundle exec rake "knapsack_pro:rspec[--format documentation --format RspecJunitFormatter --out tmp/rspec.xml]"
```

### Queue Mode

```bash
# Refer to your CI docs for `$MY_CI_NODE_INDEX`
export KNAPSACK_PRO_CI_NODE_INDEX=$MY_CI_NODE_INDEX

bundle exec rake "knapsack_pro:queue:rspec[--format documentation --format RspecJunitFormatter --out tmp/rspec_$KNAPSACK_PRO_CI_NODE_INDEX.xml]"
```

```ruby
# spec_helper.rb or rails_helper.rb

# `TMP_REPORT` must be the same path as `--out`
# `TMP_REPORT` must be a full path (no `~`)
TMP_REPORT = "tmp/tmp_rspec_#{ENV['KNAPSACK_PRO_CI_NODE_INDEX']}.xml"
FINAL_REPORT = "tmp/final_rspec_#{ENV['KNAPSACK_PRO_CI_NODE_INDEX']}.xml"

KnapsackPro::Hooks::Queue.after_subset_queue do |queue_id, subset_queue_id|
  if File.exist?(TMP_REPORT)
    FileUtils.mv(TMP_REPORT, FINAL_REPORT)
  end
end
```

`FINAL_REPORT` will contain all the tests run on the CI node (not just the last subset). For more information, you can read this [Github issue](https://github.com/KnapsackPro/knapsack_pro-ruby/issues/40).

If your CI nodes write to the same disk, you need to append the CI node index to the solution presented above to avoid conflicts:

```ruby
TMP_REPORT = "tmp/tmp_rspec_#{ENV['KNAPSACK_PRO_CI_NODE_INDEX']}.xml"
FINAL_REPORT = "tmp/final_rspec_#{ENV['KNAPSACK_PRO_CI_NODE_INDEX']}.xml"
```
This applies also if you are running parallel test processes on each CI node (see our page on to integrate Knapsack Pro with [`parallel_tests`](/ruby/parallel_tests) for an example).

### Related FAQs

- [How to use junit formatter?](https://knapsackpro.com/faq/question/how-to-use-junit-formatter)
- [How to use JSON formatter for RSpec?](https://knapsackpro.com/faq/question/how-to-use-json-formatter-for-rspec)
