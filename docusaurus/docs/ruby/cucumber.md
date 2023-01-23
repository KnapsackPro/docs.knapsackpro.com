---
pagination_next: null
pagination_prev: null
---

# Use Knapsack Pro with Cucumber

## Require different config files

You may want to require different Cucumber configurations for different sets of tests (e.g., user dashboard tests vs admin dashboard tests). You can do so with [`KNAPSACK_PRO_TEST_DIR`](/ruby/reference/#knapsack_pro_test_dir-cucumber) and [`KNAPSACK_PRO_TEST_FILE_PATTERN`](/ruby/reference/#knapsack_pro_test_file_pattern):

```bash
# User
export KNAPSACK_PRO_TEST_DIR="features/support/cucumber_config_1.rb"
export KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=api_token_1
export KNAPSACK_PRO_TEST_FILE_PATTERN="features/user_dashboard/**{,/*/**}/*.feature"
bundle exec rake "knapsack_pro:queue:cucumber[--verbose]"

# Admin
export KNAPSACK_PRO_TEST_DIR="features/support/cucumber_config_2.rb"
export KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=api_token_2
export KNAPSACK_PRO_TEST_FILE_PATTERN="features/admin_dashboard/**{,/*/**}/*.feature"
bundle exec rake "knapsack_pro:queue:cucumber[--verbose]"
```

## Troubleshooting

### How do I fix `invalid option: --require`?

If you use Cucumber 2.99 and `cucumber-rails`, your tests could fail with exit status 1 and the following error:

```bash
invalid option: --require

minitest options:
    -h, --help                       Display this help.
        --no-plugins                 Bypass minitest plugin auto-loading (or set $MT_NO_PLUGINS).
    -s, --seed SEED                  Sets random seed. Also via env. Eg: SEED=n rake
    -v, --verbose                    Verbose. Show progress processing files.
    -n, --name PATTERN               Filter run on /regexp/ or string.
        --exclude PATTERN            Exclude /regexp/ or string from run.

Known extensions: rails, pride
    -w, --warnings                   Run with Ruby warnings enabled
    -e, --environment ENV            Run tests in the ENV environment
    -b, --backtrace                  Show the complete backtrace
    -d, --defer-output               Output test failures and errors after the test run
    -f, --fail-fast                  Abort test run on first failure or error
    -c, --[no-]color                 Enable color in the output
    -p, --pride                      Pride. Show your testing pride!
```

The [issue](https://github.com/cucumber/multi_test/pull/2#issuecomment-21863459) happens when MiniTest is required after `MultiTest.disable_autorun` has been called. You can fix it with:

```ruby
# features/support/env.rb

require 'cucumber/rails'

# After requiring cucumber/rails
require 'multi_test'
MultiTest.disable_autorun
```

### How do I fix `cannot load such file -- stripe_mock (LoadError)`?

Knapsack Pro relies on Cucumber::Rake::Task, which uses Bundler. Bundler employs a performance trick that may [*cause some subtle side-effects*](https://bundler.io/man/bundle-exec.1.html#Loading). You can disable such a trick with:

```bash
export BUNDLE_DISABLE_EXEC_LOAD=true
```

## Related FAQs

- [How to require different Cucumber config files in isolation?](https://knapsackpro.com/faq/question/how-to-require-different-cucumber-config-files-in-isolation)
- [Why green test suite for Cucumber 2.99 tests always fails with invalid option: --require?](https://knapsackpro.com/faq/question/why-green-test-suite-for-cucumber-299-tests-always-fails-with-invalid-option---require)
- [How to solve error cannot load such file -- `stripe_mock` (LoadError) when running tests with Cucumber?](https://knapsackpro.com/faq/question/how-to-solve-error-cannot-load-such-file-stripe_mock-loaderror-when-running-tests-with-cucumber)
