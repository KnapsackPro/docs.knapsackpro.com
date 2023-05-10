---
pagination_next: null
pagination_prev: null
---

import { TOCBottom } from '@site/src/components/TOCBottom'
import { IconExternalLink } from '@site/src/components/IconExternalLink'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import XmlRegularModeFormatter from './formatters/_xml_regular_mode.md';
import JsonRegularModeFormatter from './formatters/_json_regular_mode.md';
import XmlQueueModeFormatter from './formatters/_xml_queue_mode.md';
import JsonQueueModeFormatter from './formatters/_json_queue_mode.md';

# Using Knapsack Pro with RSpec

<TOCBottom heading="Reference" Icon={<IconExternalLink />}>

- [`KNAPSACK_PRO_MODIFY_DEFAULT_RSPEC_FORMATTERS`](reference.md#knapsack_pro_modify_default_rspec_formatters-rspec)
- [`KNAPSACK_PRO_RSPEC_SPLIT_BY_TEST_EXAMPLES`](reference.md#knapsack_pro_rspec_split_by_test_examples-rspec)
- [`KNAPSACK_PRO_RSPEC_TEST_EXAMPLE_DETECTOR_PREFIX`](reference.md#knapsack_pro_rspec_test_example_detector_prefix-rspec)
- [`KNAPSACK_PRO_TEST_DIR`](reference.md#knapsack_pro_test_dir-rspec)

</TOCBottom>

## Retry failed/flaky tests

You have a couple of options:

- [rspec-retry](https://github.com/NoRedInk/rspec-retry) (recommended)
- [RSpec's `--only-failures`](https://relishapp.com/rspec/rspec-core/docs/command-line/only-failures)
  ```bash
  bundle exec rake knapsack_pro:queue:rspec
  bundle exec rspec --only-failures
  ```

## `--fail-fast`

You can use the [Rake argument syntax](reference.md#command-line-arguments) to fail fast:

```bash
# Stop when 1 test failed
bundle exec rake "knapsack_pro:queue:rspec[--fail-fast]"

# Stop when 3 tests failed
bundle exec rake "knapsack_pro:queue:rspec[--fail-fast 3]"
```

## Run a subset of tests

To run a subset of your test suite you have a couple of options:

- `KNAPSACK_PRO_TEST_FILE_*` [environment variables](reference.md) (recommended)
- RSpec's `--tag MY_TAG`, `--tag ~MY_TAG`, `--tag type:feature`, or `--tag ~type:feature`

If you are seeking faster performance on your CI, you may want to read [Parallelize test examples (instead of files)](#parallelize-test-examples-instead-of-files)

## Parallelize test examples (instead of files)

See [Split by test examples](split-by-test-examples.md).

## Formatters ([`rspec_junit_formatter`](https://github.com/sj26/rspec_junit_formatter), [`json`](https://rspec.info/features/3-12/rspec-core/formatters/json-formatter/))

Format stdout with the `documentation` formatter and file output with any RSpec supported formatter.

### Regular Mode

<Tabs>
  <TabItem value="junit-formatter" label="JUnit XML" default>
    <XmlRegularModeFormatter />
  </TabItem>
  <TabItem value="json-formatter" label="JSON">
    <JsonRegularModeFormatter />
  </TabItem>
</Tabs>

### Queue Mode

<Tabs>
  <TabItem value="junit-formatter" label="JUnit XML" default>
    <XmlQueueModeFormatter />
  </TabItem>
  <TabItem value="json-formatter" label="JSON">
    <JsonQueueModeFormatter />
  </TabItem>
</Tabs>

## Rswag gem integration

If you use the [Rswag gem](https://github.com/rswag/rswag) that extends rspec-rails "request specs" with a Swagger-based DSL, then you can configure Knapsack Pro to run Rswag tests with the Rswag formatter (`Rswag::Specs::SwaggerFormatter`) and run other tests without it.

```bash
export KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=api-token-for-rswag-tests
# define a list of Rswag test files
export KNAPSACK_PRO_TEST_FILE_PATTERN={spec/requests/**/*_spec.rb,spec/api/**/*_spec.rb,spec/integration/**/*_spec.rb}
bundle exec rake "knapsack_pro:queue:rspec[--format Rswag::Specs::SwaggerFormatter]"

# run non-rswag tests
export KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=api-token-for-non-rswag-tests
# skip rswag tests
export KNAPSACK_PRO_TEST_FILE_EXCLUDE_PATTERN={spec/requests/**/*_spec.rb,spec/api/**/*_spec.rb,spec/integration/**/*_spec.rb}
bundle exec rake knapsack_pro:queue:rspec
```

## Troubleshooting

If you cannot find what you are looking for in this section, please refer to the Ruby [troubleshooting page](troubleshooting.md).

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

### Some tests are failing in Queue Mode

Since Knapsack Pro [ignores `.rspec`](rspec.md#rspec-is-ignored-in-queue-mode) and many projects use it to require `spec_helper.rb` or `rails_helper.rb`, some tests may be falling. Make sure you either require the correct helper at the top of each test file or pass it as an argument:

```bash
bundle exec rake "knapsack_pro:queue:rspec[--require rails_helper]"
```

Also, please make sure you have explicitly set `RAILS_ENV=test` on your CI nodes.

### `.rspec` is ignored in Queue Mode

The `.rspec` file is ignored in Queue Mode because `knapsack_pro` needs to pass arguments explicitly to `RSpec::Core::Runner`. You can inline them with the [Rake argument syntax](reference.md#command-line-arguments) instead.

### Something is wrong with my custom formatter

Try with [`KNAPSACK_PRO_MODIFY_DEFAULT_RSPEC_FORMATTERS=false`](reference.md#knapsack_pro_modify_default_rspec_formatters-rspec).

### I see the summary of failed/pending tests multiple times in Queue Mode

It may happen if you use:

- a custom RSpec formatter
- `knapsack_pro` < 0.33.0
- [`KNAPSACK_PRO_MODIFY_DEFAULT_RSPEC_FORMATTERS=false`](reference.md#knapsack_pro_modify_default_rspec_formatters-rspec)

This is due to the fact that Knapsack Pro in Queue Mode [runs tests in batches](../overview/index.md#queue-mode-dynamic-split), and RSpec accumulates failures/pending tests for all batches.

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

Also, you can try to use the [`knapsack_pro` binary](cookbook.md#use-the-knapsack-pro-binary) instead of `bundle exec rake knapsack_pro:rspec`.

### `before(:suite)` / `after(:suite)` are executed multiple times in Queue Mode

See [Hooks: Before and After](hooks.md#rspec)
