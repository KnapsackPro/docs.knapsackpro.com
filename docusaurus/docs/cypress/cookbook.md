---
pagination_next: null
pagination_prev: null
---

# Cookbook

## Record CI builds in Cypress Dashboard

```bash
export CYPRESS_RECORD_KEY=MY_RECORD_KEY

$(npm bin)/knapsack-pro-cypress --record
```

If your CI is [supported by Knapsack Pro](https://github.com/KnapsackPro/knapsack-pro-core-js/tree/master/src/ci-providers), Cypress will merge the tests executed on parallel nodes into a single run in the Cypress Dashboard using the CI build ID. Otherwise, you will need to specify it:

```bash
$(npm bin)/knapsack-pro-cypress --record --ci-build-id $MY_CI_BUILD_ID
```

## Related FAQs

- [Record CI builds in Cypress Dashboard](https://knapsackpro.com/faq/question/how-to-record-ci-builds-in-cypress-dashboard)
