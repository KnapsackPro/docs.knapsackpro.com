---
pagination_prev: index
pagination_next: null
---

import { Carousel } from "@site/src/components/Carousel"
import Architecture from "@site/static/img/architecture.svg";
import dashboardCiNodesGraph from "@site/static/img/dashboard-ci-nodes-graph.png"
import dashboardCiNodesTable from "@site/static/img/dashboard-ci-nodes-table.png"
import dashboardMonthlyCiBuilds from "@site/static/img/dashboard-monthly-ci-builds.png"
import dashboardTestFileHistory from "@site/static/img/dashboard-test-file-history.png"
import dashboardTestFiles from "@site/static/img/dashboard-test-files.png"

# Overview

Knapsack Pro wraps your current test runner(s) and works with your existing CI infrastructure to parallelize tests optimally:

- Dynamically splits your tests based on up-to-date test execution data
- Is designed from the ground up for CI and supports all of them
- Tracks your CI builds to detect bottlenecks
- Does not have access to your source code and collects minimal test data (with opt-in encryption)
- Enables you to export historical metrics about your CI builds
- Supports out-of-the-box any Ruby test runners, Cypress, Jest (and provides both SDK and API to integrate with any other language)
- Replaces local dependencies like Redis with an API and runs your tests regardless of network problems

<Architecture className="w-full h-auto center" />

## Components

### Knapsack Pro API

The Knapsack Pro API splits test files between parallel CI nodes based on the test execution time of your preview CI runs. See [Test Orchestration Modes](#tests-orchestration-modes) below for more information.

### Knapsack Pro Client

The Knapsack Pro Client is a library to install in your project that wraps your current test runners/frameworks. It connects with the Knapsack Pro API to:

- Retrieve the list of tests to run for the current parallel CI node
- Record the test execution time, including additional information from the CI environment variables:
  - Commit hash
  - Branch name
  - Number of parallel CI nodes
  - CI node index

### Dashboard

Knapsack Pro comes with a web UI that displays graphs and stats about your test runs:

<Carousel images={[
{ src: dashboardCiNodesGraph, alt: "Dashboard - CI nodes graph" },
{ src: dashboardCiNodesTable, alt: "Dashboard - CI nodes table" },
{ src: dashboardMonthlyCiBuilds, alt: "Dashboard - Monthly CI builds" },
{ src: dashboardTestFileHistory, alt: "Dashboard - Test file history" },
{ src: dashboardTestFiles, alt: "Dashboard - Test files" },
]} />

## Tests Orchestration Modes

### Queue Mode (Dynamic Split)

Knapsack Pro splits your tests dynamically (Queue Mode) between parallel CI nodes.

Each Knapsack Pro Client (parallel CI node):

1. Retrieves from the Knapsack Pro API a subset of tests to execute
2. Runs those tests
3. Repeats 1. and 2. as long as there are more tests in the API queue
4. Sends the test execution times to the API for the subsequent CI runs

With Queue Mode, Knapsack Pro distributes tests so that each CI node finishes at the same time. Thanks to that, your CI build time is as fast as possible.

Knapsack Pro allows distributing the tests in a static way (Regular Mode) too, but it’s rarely a good solution:

- Tests themselves, especially end to end, have varying execution times
- Failing tests execute faster than green ones
- CI nodes may differ in hardware/performance
- CI nodes boot at different times
- CI nodes are more or less busy when the environment is shared/virtualized
- CI nodes may load their caches at dissimilar times
- Test execution starts at different times on different CI nodes
- Flaky tests are.. Well, flaky!

### Regular Mode (Static Split)

Even if Queue Mode is recommended, Knapsack Pro supports a static split of tests between parallel CI nodes (Regular Mode).

In this mode, the Knapsack Pro API returns to each Knapsack Pro client the subset of tests to execute in one batch.

However, as explained in the [Queue Mode](#queue-mode-dynamic-split) section, this will result in a suboptimal split.

### Fallback Mode

In case of network issues, Knapsack Pro logs a warning and automatically switches to Fallback Mode to run your tests with a split based on test file names.

## SAML-based single sign-on (SSO)

Besides traditional authentication (magic links, email/password), Knapsack Pro supports your organization's Identity Provider (IdP) like Okta, OneLogin, Google Workspace, or any other SAML SSO provider.

## Customer Support

If you have questions, feel free to [contact us](https://knapsackpro.com/contact) directly and we will be happy to help.
