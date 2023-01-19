---
pagination_next: null
pagination_prev: null
---

# Use Knapsack Pro with RSpec

## Run a subset of tests

To run a subset of your test suite you have a couple of options:
- `KNAPSACK_PRO_TEST_FILE_*` [environment variables](/ruby/reference/) (recommended)
- RSpec's `--tag MY_TAG`, `--tag ~MY_TAG`, `--tag type:feature`, or `--tag ~type:feature`

If you are seeking faster performance on your CI, you may want to read [Parallelize test examples (instead of files)](#parallelize-test-examples-instead-of-files)

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

On your [Knapsack Pro dashboard](/overview/#dashboard), you can see the yellow highlights because of the bottleneck.

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

## Troubleshooting

### Why are some of my test files not executed?

First, check if the RSpec output mentions any filtering like the following:

```bash
Run options: include {:focus=>true, :ids=>{"./spec/example_spec.rb"=>["1:1:2"]}}
```

Second, you may want to grep the codebase (including `.rspec`) for:
- `--tag MY_TAG`, `-t MY_TAG`
- `fit`, `fdescribe`, or `fcontext`
- test examples or groups tagged with `:focus`

:::caution
Do not use `run_all_when_everything_filtered`
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

### How do I fix `LoadError: cannot load such file -- MY_RUBY_GEM`?

Probably, you load `MY_RUBY_GEM` in `Rakefile` so when `knapsack_pro` runs a rake task it fails. To fix the problem either:
- Don't load `MY_RUBY_GEM` when `RAILS_ENV=test`
- Add `MY_RUBY_GEM` in the `:test` group in the `Gemfile`

### Why do I fix `Don't know how to build task 'knapsack_pro:rspec_test_example_detector'`?

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

## Related FAQs

- [How to use junit formatter?](https://knapsackpro.com/faq/question/how-to-use-junit-formatter)
- [How to use JSON formatter for RSpec?](https://knapsackpro.com/faq/question/how-to-use-json-formatter-for-rspec)
- [How to split slow RSpec test files by test examples (by individual it)?](https://knapsackpro.com/faq/question/how-to-split-slow-rspec-test-files-by-test-examples-by-individual-it#warning-dont-use-deprecated-rspec-run_all_when_everything_filtered-option)
- [How to run only a specific set of test files in RSpec (using tags or test file pattern)?](https://knapsackpro.com/faq/question/how-to-run-only-a-specific-set-of-test-files-in-rspec)
- [How to split tests based on test level instead of test file level?](https://knapsackpro.com/faq/question/how-to-split-tests-based-on-test-level-instead-of-test-file-level)
- [How to run only RSpec feature tests or non feature tests?](https://knapsackpro.com/faq/question/how-to-run-only-rspec-feature-tests-or-non-feature-tests)
- [RSpec is not running some tests](https://knapsackpro.com/faq/question/rspec-is-not-running-some-tests)
