---
pagination_next: null
pagination_prev: null
---

# Using Knapsack Pro with Heroku CI

## Run multiple test suites

Heroku CI allows only one test script in `app.json`, but you may want to run multiple test suites (e.g., RSpec and Cucumber).

You can create a script as described in [Run multiple test suites with one script](/ruby/cookbook/#run-multiple-test-commands-with-one-script) and use it in `scripts.test`:

```json
{
  "environments": {
    "test": {
      "formation": {
        "test": {
          "quantity": 2
        }
      },
      "addons": ["heroku-postgresql"],
      "scripts": {
        "test": "bin/knapsack_pro_run_tests"
      },
      "env": {
        "KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC": "MY_TOKEN"
      }
    }
  }
}
```
