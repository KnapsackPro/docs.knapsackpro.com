---
pagination_next: null
pagination_prev: null
---

# Troubleshooting

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

## Rake tasks under tests are run more than once in Queue Mode

Make sure the Rake task is [loaded once](https://github.com/KnapsackPro/rails-app-with-knapsack_pro/commit/9f068e900deb3554bd72633e8d61c1cc7f740306):

```ruby
before do
  Rake::Task[MY_TASK_NAME].clear if Rake::Task.task_defined?(MY_TASK_NAME)
  Rake.application.rake_require(MY_TASK_FILENAME)
  Rake::Task.define_task(:environment)
end
```

## Related FAQs

- [Why `knapsack_pro` hangs / freezes / is stale i.e. for Codeship in Queue Mode?](https://knapsackpro.com/faq/question/why-knapsack_pro-hangs--freezes--is-stale-ie-for-codeship-in-queue-mode)
- [Why `knapsack_pro` freezes / hangs my CI (for instance Travis)?](https://knapsackpro.com/faq/question/why-knapsack_pro-freezes--hangs-my-ci-for-instance-travis)
- [Why `knapsack_pro` hangs / freezes / is stale for tests in Chrome (disallow downloads in Sandboxed iframes)?](https://knapsackpro.com/faq/question/why-knapsack_pro-hangs-freezes-is-stale-for-tests-in-chrome-disallow-downloads-in-sandboxed-iframes)
- [Why when I use Queue Mode for RSpec then my rake tasks are run twice?](https://knapsackpro.com/faq/question/why-when-i-use-queue-mode-for-rspec-then-my-rake-tasks-are-run-twice)
