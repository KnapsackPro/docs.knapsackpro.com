---
pagination_next: null
pagination_prev: null
---

# Split by test examples

:::caution

Only RSpec >= 3.3.0 is supported. [Let us know](https://knapsackpro.com/contact) if you use a different test runner. As an alternative, consider:

- spreading test examples into multiple files
- tagging test examples (e.g., RSpec's [`--tag`](rspec.md#run-a-subset-of-tests))

:::

You can set [`KNAPSACK_PRO_RSPEC_SPLIT_BY_TEST_EXAMPLES`](reference.md#knapsack_pro_rspec_split_by_test_examples-rspec) to parallelize tests across CI nodes by example (`it`/`specify`). This is useful when you have slow test files but don't want to manually split test examples into smaller test files.

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

On your [Knapsack Pro dashboard](../overview/index.md#dashboard), you can see the yellow highlights because of the bottleneck.

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

RSpec consumes a lot of memory when running individual test examples, so Knapsack Pro only splits bottleneck files by test examples and parallelizes the rest of your test suite by file. In other words, files are split by test examples just enough to guarantee all the parallel CI nodes finish at a similar time to maximize performance.

We recommend running at least 2 CI builds after you enable this feature or change the number of CI nodes to allow the Knapsack Pro API to learn about your test suite.

:::caution

Does not support `--tag`

:::

Due to the [RSpec internals](https://github.com/rspec/rspec-core/issues/2522), `--tag` might be ignored when used together with `KNAPSACK_PRO_RSPEC_SPLIT_BY_TEST_EXAMPLES`. But you can use the `KNAPSACK_PRO_TEST_FILE_*` [environment variables](reference.md) to filter the test files to run.

:::caution

Does not support [`run_all_when_everything_filtered`](rspec.md#some-of-my-test-files-are-not-executed)

:::

## Troubleshooting

### Why are some of my test files not executed?

Read the answer on the [RSpec page](rspec.md#some-of-my-test-files-are-not-executed).

### How do I fix `LoadError: cannot load such file -- MY_RUBY_GEM`?

Probably, you load `MY_RUBY_GEM` in `Rakefile` so when `knapsack_pro` runs a rake task it fails. To fix the problem either:

- Don't load `MY_RUBY_GEM` when `RAILS_ENV=test`
- Add `MY_RUBY_GEM` in the `:test` group in the `Gemfile`

### How do I fix `Don't know how to build task 'knapsack_pro:rspec_test_example_detector'`?

Try to remove the default prefix `bundle exec` used by `knapsack_pro` by setting `KNAPSACK_PRO_RSPEC_TEST_EXAMPLE_DETECTOR_PREFIX=""`.

### How do I fix `Could not generate JSON report for RSpec. Rake task failed when running RACK_ENV=test RAILS_ENV=test bundle exec rake knapsack_pro:rspec_test_example_detector`?

Most likely, RSpec is causing your CI machine to freeze due to a lack of resources: you could try to use fewer parallel nodes, or add more CPU/RAM. There is nothing we can do on our side, sorry!

Check the terminal output for the actionable error message:

```
E, [2021-03-30T17:33:12.199274 #103] ERROR -- : [knapsack_pro] ---------- START of actionable error message --------------------------------------------------
E, [2021-03-30T17:33:12.199329 #103] ERROR -- : [knapsack_pro] There was a problem while generating test examples for the slow test files using the RSpec dry-run flag. To reproduce the error triggered by the RSpec, please try to run below command (this way, you can find out what is causing the error):
E, [2021-03-30T17:33:12.199348 #103] ERROR -- : [knapsack_pro] bundle exec rspec --format json --dry-run --out .knapsack_pro/test_case_detectors/rspec/rspec_dry_run_json_report_node_0.json --default-path spec spec/models/user_spec.rb spec/features/articles_spec.rb
E, [2021-03-30T17:33:12.199368 #103] ERROR -- : [knapsack_pro] ---------- END of actionable error message --------------------------------------------------
```
