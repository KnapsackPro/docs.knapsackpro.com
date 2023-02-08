---
pagination_next: null
pagination_prev: null
---

# Use Knapsack Pro with RSpec

## Retry failed/flaky tests

You have a couple of options:
- [rspec-retry](https://github.com/NoRedInk/rspec-retry) (recommended)
- [RSpec's `--only-failures`](https://relishapp.com/rspec/rspec-core/docs/command-line/only-failures)
  ```bash
  bundle exec rake knapsack_pro:queue:rspec
  bundle exec rspec --only-failures
  ```

## `--fail-fast`

You can use the [Rake argument syntax](/ruby/reference/#command-line-arguments) to fail fast:

```bash
# Stop when 1 test failed
bundle exec rake "knapsack_pro:queue:rspec[--fail-fast]"

# Stop when 3 tests failed
bundle exec rake "knapsack_pro:queue:rspec[--fail-fast 3]"
```

## Run a subset of tests

To run a subset of your test suite you have a couple of options:
- `KNAPSACK_PRO_TEST_FILE_*` [environment variables](/ruby/reference/) (recommended)
- RSpec's `--tag MY_TAG`, `--tag ~MY_TAG`, `--tag type:feature`, or `--tag ~type:feature`

If you are seeking faster performance on your CI, you may want to read [Parallelize test examples (instead of files)](#parallelize-test-examples-instead-of-files)

## Parallelize test examples (instead of files)

See [Split by test examples](/ruby/split-by-test-examples).

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

If you cannot find what you are looking for in this section, please refer to the Ruby [troubleshooting page](/ruby/troubleshooting).

### Some of my test files are not executed

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

# ✅ Good
RSpec.configure do |c|
  c.filter_run_when_matching :focus
end

# 🤘 FYeah
CI=true # Refer to your CI docs

RSpec.configure do |c|
  unless ENV['CI']
    c.filter_run_when_matching :focus
  end
end
```

### I see the summary of failed/pending tests multiple times in Queue Mode

It may happen if you use:
- a custom RSpec formatter
- `knapsack_pro` < 0.33.0
- [`KNAPSACK_PRO_MODIFY_DEFAULT_RSPEC_FORMATTERS=false`](https://github.com/KnapsackPro/knapsack_pro-ruby#knapsack_pro_modify_default_rspec_formatters-hide-duplicated-summary-of-pending-and-failed-tests)

This is due to the fact that Knapsack Pro in Queue Mode [runs tests in batches](/overview/#queue-mode-dynamic-split), and RSpec accumulates failures/pending tests for all batches.

### `.rspec` is ignored in Queue Mode

The `.rspec` file is ignored in Queue Mode because `knapsack_pro` needs to pass arguments explicitly to `RSpec::Core::Runner`. You can inline them with the [Rake argument syntax](/ruby/reference/#command-line-arguments) instead.

### `TypeError: superclass mismatch for class MyClass` in Queue Mode

Probably, you are in the following situation:

```ruby
# spec/a_spec.rb

class BaseClassA
end

module Mock
  module FakeModels
    class MyClass < BaseClassA
      def args
      end
    end
  end
end

describe 'A test of something' do
  it do
  end
end


# spec/b_spec.rb

class BaseClassB
end

module Mock
  module FakeModels
    # 👇 Base class is different
    class MyClass < BaseClassB
      def args
      end
    end
  end
end

describe 'B test of something' do
  it do
  end
end
```

Use RSpec's [`stub_const`](https://relishapp.com/rspec/rspec-mocks/docs/mutating-constants) instead.

### My tests fail in Queue Mode

Knapsack Pro uses [`RSpec::Core::Runner`](https://relishapp.com/rspec/rspec-core/docs/running-specs-multiple-times-with-different-runner-options-in-the-same-process) in Queue Mode to run tests without reloading Ruby/Rails for each batch of tests. If you monkey-patch RSpec or mutate its global state, the test runner may not be able to clean up properly after each batch.

Also, you can try to use the [`knapsack_pro` binary](https://github.com/KnapsackPro/knapsack_pro-ruby#knapsack-pro-binary) instead of `bundle exec rake knapsack_pro:rspec`.

## Related FAQs

- [How to use junit formatter?](https://knapsackpro.com/faq/question/how-to-use-junit-formatter)
- [How to use JSON formatter for RSpec?](https://knapsackpro.com/faq/question/how-to-use-json-formatter-for-rspec)
- [How to run only a specific set of test files in RSpec (using tags or test file pattern)?](https://knapsackpro.com/faq/question/how-to-run-only-a-specific-set-of-test-files-in-rspec)
- [How to split tests based on test level instead of test file level?](https://knapsackpro.com/faq/question/how-to-split-tests-based-on-test-level-instead-of-test-file-level)
- [How to run only RSpec feature tests or non feature tests?](https://knapsackpro.com/faq/question/how-to-run-only-rspec-feature-tests-or-non-feature-tests)
- [RSpec is not running some tests](https://knapsackpro.com/faq/question/rspec-is-not-running-some-tests)
- [How to stop running tests on the first failed test (fail fast tests in RSpec)?](https://knapsackpro.com/faq/question/how-to-stop-running-tests-on-the-first-failed-test-fail-fast-tests-in-rspec)
- [Why when I use Queue Mode for RSpec then .rspec config is ignored?](https://knapsackpro.com/faq/question/why-when-i-use-queue-mode-for-rspec-then-rspec-config-is-ignored)
- [Why when I use Queue Mode for RSpec and test fails then I see multiple times info about failed test in RSpec result?](https://knapsackpro.com/faq/question/why-when-i-use-queue-mode-for-rspec-and-test-fails-then-i-see-multiple-times-info-about-failed-test-in-rspec-result)
- [Why when I use Queue Mode for RSpec then I see multiple times the same pending tests?](https://knapsackpro.com/faq/question/why-when-i-use-queue-mode-for-rspec-then-i-see-multiple-times-the-same-pending-tests)
- [Why when I use Queue Mode for RSpec then FactoryBot/FactoryGirl tests fail?](https://knapsackpro.com/faq/question/why-when-i-use-queue-mode-for-rspec-then-factorybotfactorygirl-tests-fail)
- [Why when I use Queue Mode for RSpec then I see error superclass mismatch for class?](https://knapsackpro.com/faq/question/why-when-i-use-queue-mode-for-rspec-then-i-see-error-superclass-mismatch-for-class)
- [How to retry failed tests (flaky tests)?](https://knapsackpro.com/faq/question/how-to-retry-failed-tests-flaky-tests)
- [Why when I use Queue Mode for RSpec then my tests fail?](https://knapsackpro.com/faq/question/why-when-i-use-queue-mode-for-rspec-then-my-tests-fail)
