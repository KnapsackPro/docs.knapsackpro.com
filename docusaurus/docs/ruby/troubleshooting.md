---
pagination_next: null
pagination_prev: null
---

# Troubleshooting

## `NameError: uninitialized constant MyModule::MyModelName`

Try with full namespacing `::SomeModule::MyModule::MyModelName`.

## Debug Knapsack Pro on your development environment/machine

### Regular Mode

To reproduce what Knapsack Pro executed on a specific CI node, check out the same branch and run:

```bash
KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=MY_TOKEN \
KNAPSACK_PRO_CI_NODE_INDEX=MY_INDEX \
KNAPSACK_PRO_CI_NODE_TOTAL=MY_TOTAL \
KNAPSACK_PRO_BRANCH=MY_BRANCH \
KNAPSACK_PRO_COMMIT_HASH=MY_COMMIT \
KNAPSACK_PRO_CI_NODE_BUILD_ID=MY_BUILD_ID \
bundle exec rake "knapsack_pro:rspec[--seed MY_SEED]"
```

`KNAPSACK_PRO_CI_NODE_BUILD_ID` must be the same as the CI build you are trying to reproduce (if it helps, take a look at what Knapsack Pro uses as `node_build_id` for your [CI provider](https://github.com/KnapsackPro/knapsack_pro-ruby/tree/master/lib/knapsack_pro/config/ci)).

You can also run the same subset of tests without Knapsack Pro: in the logs, find the command that Knapsack Pro used to invoke the test runner:

```bash
rspec  --default-path spec "spec/models/user_spec.rb" "spec/models/comment_spec.rb"
```

### Queue Mode

To reproduce what Knapsack Pro executed on a specific CI node, check out the same branch and run:

```bash
KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=MY_TOKEN \
KNAPSACK_PRO_CI_NODE_INDEX=MY_INDEX \
KNAPSACK_PRO_CI_NODE_TOTAL=MY_TOTAL \
KNAPSACK_PRO_BRANCH=MY_BRANCH \
KNAPSACK_PRO_COMMIT_HASH=MY_COMMIT \
KNAPSACK_PRO_CI_NODE_BUILD_ID=MY_BUILD_ID \
KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true \
bundle exec rake "knapsack_pro:queue:rspec[--seed MY_SEED]"
```

`KNAPSACK_PRO_CI_NODE_BUILD_ID` must be the same as the CI build you are trying to reproduce (if it helps, take a look at what Knapsack Pro uses as `node_build_id` for your [CI provider](https://github.com/KnapsackPro/knapsack_pro-ruby/tree/master/lib/knapsack_pro/config/ci)).

You can also run the same subset of tests without Knapsack Pro: in the logs, find the command that Knapsack Pro used to invoke the test runner.

You will find multiple commands to reproduce each batch:

```bash
[knapsack_pro] To retry the last batch of tests fetched from the API Queue, please run the following command on your machine:
[knapsack_pro] bundle exec rspec --format documentation --format RspecJunitFormatter --out tmp/rspec.xml --default-path spec --seed 24098 "spec/features/dashboard/billing/subscription_error_path_1_spec.rb[1:1:2:1:1:1]"
```

Or a single command at the end to execute all the batches the CI node executed:

```bash
[knapsack_pro] To retry all the tests assigned to this CI node, please run the following command on your machine:
[knapsack_pro] bundle exec rspec --format documentation --format RspecJunitFormatter --out tmp/rspec.xml --default-path spec --seed 24098 "spec/features/dashboard/billing/subscription_error_path_1_spec.rb[1:1:2:1:1:1]" "spec/features/dashboard/builds/build_distribution_for_build_spec.rb[1:1:1:10:2:1]" "spec/features/dashboard/builds/build_distribution_for_build_spec.rb[1:1:2:1]" "spec/features/dashboard/admin_statistics_spec.rb[1:6:1:1]" "spec/features/dashboard/identity_providers_spec.rb[1:6:1]" "spec/features/dashboard/onboarding_spec.rb[1:2:1:1:1]"
```

## Knapsack Pro hangs

Some users reported frozen CI nodes with:
- Test runners producing too much output (e.g., Codeship and Queue Mode): reduce it with [`KNAPSACK_PRO_LOG_LEVEL=warn`](/ruby/reference/#knapsack_pro_log_level)
- Test runners producing no output: make sure to use a formatter (like RSpec's [`--format progress`](/ruby/rspec#formatters-rspec_junit_formatter-json))
- Timecop (e.g., [Travis](https://docs.travis-ci.com/user/common-build-problems/#ruby-tests-frozen-and-cancelled-after-10-minute-log-silence)): ensure `Timecop.return` is executed after all examples
  ```ruby
  # spec/spec_helper.rb

  RSpec.configure do |c|
    c.after(:all) do
      Timecop.return
    end
  end
  ```
- Chrome 83+ [prevents downloads in sandboxed iframes](https://developer.chrome.com/blog/chrome-83-deps-rems/): add an `allow-downloads` keyword in the sandbox attribute list

## Knapsack Pro does not work on a forked repository

:::caution
Make sure your Knapsack Pro API token is set up as a secret in your CI (not hardcoded in the repository) to avoid leaking it.
:::

Since the token won't be available on forked CI builds, you can use a script to run:
- Knapsack Pro in [Fallback Mode](/overview/#fallback-mode)(static split by file names) on forked builds
- Knapsack Pro in [Queue Mode](/overview/#queue-mode-dynamic-split) or [Regular Mode](/overview/#regular-mode-static-split) on internal builds

Create `bin/knapsack_pro_tests`, make it executable `chmod u+x`, and use it on CI to run your tests:

```bash
#!/bin/bash

if [ "$KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC" = "" ]; then
  KNAPSACK_PRO_ENDPOINT=https://api-disabled-for-fork.knapsackpro.com \
  KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=disabled-for-fork \
  KNAPSACK_PRO_MAX_REQUEST_RETRIES=0 \
  bundle exec rake knapsack_pro:queue:rspec
else
  bundle exec rake knapsack_pro:queue:rspec
fi
```

## Error `commit_hash` parameter is required

Knapsack Pro takes `KNAPSACK_PRO_COMMIT_HASH` and `KNAPSACK_PRO_BRANCH` from the CI environment (see [supported CIs](https://github.com/KnapsackPro/knapsack_pro-ruby/tree/master/lib/knapsack_pro/config/ci)). If your CI is not supported you may see the following error:

```bash
ERROR -- : [knapsack_pro] {"errors"=>[{"commit_hash"=>["parameter is required"]}]}
```

In such a case, you have two options:
- If you have `git` installed on CI, set [`KNAPSACK_PRO_REPOSITORY_ADAPTER=git`](/ruby/reference/#knapsack_pro_repository_adapter) and [`KNAPSACK_PRO_PROJECT_DIR`](/ruby/reference/#knapsack_pro_project_dir)
- Otherwise, set [`KNAPSACK_PRO_COMMIT_HASH`](/ruby/reference/#knapsack_pro_commit_hash) and [`KNAPSACK_PRO_BRANCH`](/ruby/reference/#knapsack_pro_branch) yourself

## `LoadError: cannot load such file -- spec_helper`

If you are using a complex `KNAPSACK_PRO_TEST_FILE_PATTERN`, Knapsack Pro could have problems finding the directory containing the `spec_helper.rb` file. Please set [`KNAPSACK_PRO_TEST_DIR`](/ruby/reference/#knapsack_pro_test_dir-rspec).

## CI builds fail with `Test::Unit` but all tests passed

Please ensure you are using `Test::Unit` only and not loading minitest too.

## Tests hitting external APIs fail

Most likely, you have global shared state between your tests.

For example, you may have a hook that deletes Stripe data while a parallel CI node is testing the Stripe integration:

```ruby
before(:each) do
  Stripe::Subscription.all.each { |subscription| subscription.delete }
  Stripe::Customer.all.each { |customer| customer.delete }
end
```

You can fix it by either:
- Using a gem like [VCR](https://github.com/vcr/vcr) to record/replay your HTTP interactions
- Write your tests so that they can run in parallel (e.g., each test creates/deletes its own Stripe data)

## `OpenSSL::SSL::SSLError`

VCR, WebMock, or FakeWeb may trigger the following error when Knapsack Pro interacts with the Knapsack Pro API:

```bash
OpenSSL::SSL::SSLError: SSL_connect returned=1 errno=0 state=error: tlsv1 alert internal error
```

Make sure to follow the steps to [configure VCR/WebMock/FakeWeb](/knapsack_pro-ruby/guide/).

## `ActiveRecord::SubclassNotFound`

If files are changing during a tests run, you may get the following error:

```bash
ActiveRecord::SubclassNotFound:
Invalid single-table inheritance type: AuthenticationProviders::AnAuthenticationProvider is not a subclass of AuthenticationProvider
```

Please make sure classes are loaded once in the test environment:

```ruby
# environments/test.rb

config.eager_load = true
```

## Adding parallel CI nodes/jobs makes test slower

You can verify if the tests are getting slower on your [Knapsack Pro dashboard](/overview/#dashboard):
- Execution times of your CI builds are increasing: `Recorded CI builds > Show (build) > Test Files > Total execution time`
- Individual test stats are trending up: `Statistics of test files history > Stats (test file) > History of the test file (chart)`

Here are the most common reasons:
- CI nodes share resources (CPU/RAM/IO)
- Tests are accessing the same resource (e.g., Stripe sandbox, database)
- Your CI gives you a limited pool of parallel CI nodes (and runs the rest serially)

## Some tests were skipped in Regular Mode

There is an unlikely scenario where some CI nodes may start in Fallback Mode but others in Regular Mode resulting in some tests being skipped. Our recommendations are either
- Switch to [Queue Mode](/overview/#queue-mode-dynamic-split) and enjoy faster CI builds too
- Disable Fallback mode with [`KNAPSACK_PRO_FALLBACK_MODE_ENABLED=false`](/ruby/reference/#knapsack_pro_fallback_mode_enabled)
- Increase the request attempts with [`KNAPSACK_PRO_MAX_REQUEST_RETRIES`](/ruby/reference/#knapsack_pro_max_request_retries)

## FactoryBot/FactoryGirl raises in Queue Mode

- Use the [`knapsack_pro` binary](https://github.com/KnapsackPro/knapsack_pro-ruby#knapsack-pro-binary):
  ```bash
  bundle exec knapsack_pro queue:rspec
  ```
- Avoid implicit associations:
  ```ruby
  # ⛔️ Bad
  FactoryBot.define do
    factory :assignment do
      task
    end
  end

  # ✅ Good
  FactoryBot.define do
    factory :assignment do
      association :task
    end
  end
  ```

## One CI node run the test suite again in Queue Mode

Most likely, that CI node started when all the others finished running and initialized a new queue.

You have a couple of options:
- Make sure [`KNAPSACK_PRO_CI_NODE_BUILD_ID`](/ruby/reference/#knapsack_pro_ci_node_build_id) is set (recommended)
- Set [`KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true`](/ruby/reference/#knapsack_pro_fixed_queue_split-queue-mode)

## Rake tasks under tests are run more than once in Queue Mode

Make sure the Rake task is [loaded once](https://github.com/KnapsackPro/rails-app-with-knapsack_pro/commit/9f068e900deb3554bd72633e8d61c1cc7f740306):

```ruby
before do
  Rake::Task[MY_TASK_NAME].clear if Rake::Task.task_defined?(MY_TASK_NAME)
  Rake.application.rake_require(MY_TASK_FILENAME)
  Rake::Task.define_task(:environment)
end
```

## Tests distribution is unbalanced in Queue Mode

Please consider:
- [Splitting by test examples](/ruby/split-by-test-examples) if you have a bottleneck file that is packed with test examples
- If it's a retry, remember that [`KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true`](/ruby/reference/#knapsack_pro_fixed_queue_split-queue-mode) uses a cached split

## Related FAQs

- [Why `knapsack_pro` hangs / freezes / is stale i.e. for Codeship in Queue Mode?](https://knapsackpro.com/faq/question/why-knapsack_pro-hangs--freezes--is-stale-ie-for-codeship-in-queue-mode)
- [Why `knapsack_pro` freezes / hangs my CI (for instance Travis)?](https://knapsackpro.com/faq/question/why-knapsack_pro-freezes--hangs-my-ci-for-instance-travis)
- [Why `knapsack_pro` hangs / freezes / is stale for tests in Chrome (disallow downloads in Sandboxed iframes)?](https://knapsackpro.com/faq/question/why-knapsack_pro-hangs-freezes-is-stale-for-tests-in-chrome-disallow-downloads-in-sandboxed-iframes)
- [Why when I use Queue Mode for RSpec then my rake tasks are run twice?](https://knapsackpro.com/faq/question/why-when-i-use-queue-mode-for-rspec-then-my-rake-tasks-are-run-twice)
- [How to make `knapsack_pro` works for forked repositories of my project?](https://knapsackpro.com/faq/question/how-to-make-knapsack_pro-works-for-forked-repositories-of-my-project)
- [Why I see API error `commit_hash` parameter is required?](https://knapsackpro.com/faq/question/why-i-see-api-error-commit_hash-parameter-is-required)
- [Why I see LoadError: cannot load such file -- `spec_helper`?](https://knapsackpro.com/faq/question/why-i-see-loaderror-cannot-load-such-file----spec_helper)
- [Why my CI build fails when I use Test::Unit even when all tests passed?](https://knapsackpro.com/faq/question/why-my-ci-build-fails-when-i-use-testunit-even-when-all-tests-passed)
- [Why tests hitting external API fail?](https://knapsackpro.com/faq/question/why-tests-hitting-external-api-fail)
- [Failed request to API due to `OpenSSL::SSL::SSLError: SSL_connect returned=1 errno=0 state=error: tlsv1 alert internal error`](https://knapsackpro.com/faq/question/failed-request-to-api-due-to-openssl-ssl-sslerror-ssl_connect-returned-1-errno-0-state-error-tlsv1-alert-internal-error)
- [When Ruby/RSpec tests fail with error like ActiveRecord::SubclassNotFound: Invalid single-table inheritance type: AuthenticationProviders::AnAuthenticationProvider](https://knapsackpro.com/faq/question/when-ruby-rspec-tests-fail-with-error-like-activerecord-subclassnotfound-invalid-single-table-inheritance-type-authenticationproviders-anauthenticationprovider)
- [Why my tests are slower when I run more parallel CI nodes (jobs)?](https://knapsackpro.com/faq/question/why-my-tests-are-slower-when-i-run-more-parallel-ci-nodes-jobs)
- [How to run tests for particular CI node in your development environment](https://knapsackpro.com/faq/question/how-to-run-tests-for-particular-ci-node-in-your-development-environment)
- [Why my tests are executed twice in Queue Mode? Why CI node runs whole test suite again?](https://knapsackpro.com/faq/question/why-my-tests-are-executed-twice-in-queue-mode-why-ci-node-runs-whole-test-suite-again)
- [If one of the parallel CI nodes starts work very late after other parallel CI nodes already finished work then tests are executed twice on late CI node in Knapsack Pro Queue Mode](https://knapsackpro.com/faq/question/if-one-of-the-parallel-ci-nodes-starts-work-very-late-after-other-parallel-ci-nodes-already-finished-work-then-tests-are-executed-twice-on-late-ci-node-in-knapsack-pro-queue-mode)
- [Why is my distribution of tests unbalanced in the Queue Mode?](https://knapsackpro.com/faq/question/why-is-my-distribution-of-tests-unbalanced-in-the-queue-mode)
