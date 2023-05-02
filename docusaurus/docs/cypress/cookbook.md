---
pagination_next: null
pagination_prev: null
---

# Cookbook

## Keep screenshots and videos

Since Knapsack Pro runs Cypress multiple times, you need to set [`trashAssetsBeforeRuns`](https://docs.cypress.io/guides/references/configuration.html#Screenshots) to `false`.

You can do so by either invoking Knapsack Pro with:

```bash
$(npm bin)/knapsack-pro-cypress --config trashAssetsBeforeRuns=false
```

Or in `cypress.config.js`:

```json
{
  "trashAssetsBeforeRuns": false
}
```

## Component tests

You can pass the `testingType` option to run [component tests](https://docs.cypress.io/guides/component-testing/introduction):

```bash
$(npm bin)/knapsack-pro-cypress --testingType=component
```

## Record CI builds in Cypress Dashboard

```bash
export CYPRESS_RECORD_KEY=MY_RECORD_KEY

$(npm bin)/knapsack-pro-cypress --record
```

If Cypress supports your CI, it will merge the tests executed on parallel nodes into a single run in the Cypress Dashboard using the CI build ID. Otherwise, you will need to specify it:

```bash
$(npm bin)/knapsack-pro-cypress --record --ci-build-id $MY_CI_BUILD_ID
```

You should replace `$MY_CI_BUILD_ID` with the correct environment variable provided by your CI:

| CI Provider    | Environment Variable |
| -------------- | -------------------- |
| AppVeyor       | `APPVEYOR_BUILD_NUMBER` |
| Bamboo         | `BAMBOO_BUILD_NUMBER` |
| Buildkite      | `BUILDKITE_BUILD_NUMBER` |
| Circle         | `CIRCLE_WORKFLOW_ID` |
| Cirrus         | `CIRRUS_BUILD_ID` |
| Codeship       | `CI_BUILD_NUMBER` |
| Codeship Basic | `CI_BUILD_NUMBER` |
| Codeship Pro   | `CI_BUILD_ID` |
| Drone          | `DRONE_BUILD_NUMBER` |
| Gitlab         | `CI_PIPELINE_ID` |
| Github Actions | `GITHUB_RUN_ID` |
| Heroku         | `HEROKU_TEST_RUN_ID` |
| Jenkins        | `BUILD_NUMBER` |
| Semaphore 1.0  | `SEMAPHORE_BUILD_NUMBER` |
| Semaphore 2.0  | `SEMAPHORE_WORKFLOW_ID` |
| Travis         | `TRAVIS_BUILD_ID` |
| Codefresh.io   | `CF_BUILD_ID` |
