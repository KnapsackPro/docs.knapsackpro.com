---
pagination_next: null
pagination_prev: null
---

# Run multiple test suites with one script

## Run all tests

Create `bin/my_script`:

```bash
#!/bin/bash

# Cucumber suite
bundle exec rake knapsack_pro:queue:cucumber
export CUCUMBER_EXIT_CODE=$?

# RSpec suite
bundle exec rake knapsack_pro:queue:rspec
export RSPEC_EXIT_CODE=$?

if [ "$CUCUMBER_EXIT_CODE" -ne "0" ]; then
  exit $CUCUMBER_EXIT_CODE
fi

if [ "$RSPEC_EXIT_CODE" -ne "0" ]; then
  exit $RSPEC_EXIT_CODE
fi
```

## Fail fast

:::caution
CI nodes that fail on the first suite won't run the second suite: tests will be distributed to fewer CI nodes and the CI run will take longer.
:::

```bash
#!/bin/bash

set -e # exit on error

bundle exec rake knapsack_pro:queue:rspec
bundle exec rake knapsack_pro:queue:cucumber
```

## Related FAQs

- [How to run multiple test suite commands in Heroku CI?](https://knapsackpro.com/faq/question/how-to-run-multiple-test-suite-commands-in-heroku-ci)
