---
layout: post
title:  "How to run slow RSpec files on Github Actions with parallel jobs by doing an auto split of the spec file by test examples"
date:   2020-06-15 08:00:00 +0200
author: "Knapsack Pro"
categories: techtips continuous_integration
og_image: "/images/blog/posts/how-to-run-slow-rspec-files-on-github-actions-with-parallel-jobs-by-doing-an-auto-split-of-the-spec-file-by-test-examples/cut-spec-file.jpeg"
---

Splitting your CI build jobs between multiple machines running in parallel is a great way to make the process fast, which results in more time for building features. Github Actions allows running parallel jobs easily. In a previous article, we explained how you can use Knapsack Pro to [split your RSpec test files efficiently between parallel jobs on GitHub Actions](/2019/how-to-run-rspec-on-github-actions-for-ruby-on-rails-app-using-parallel-jobs). Today we'd like to show how to address the problem of slow test files negatively impacting the whole build times.

<img src="/images/blog/posts/how-to-run-slow-rspec-files-on-github-actions-with-parallel-jobs-by-doing-an-auto-split-of-the-spec-file-by-test-examples/cut-spec-file.jpeg" style="width:300px;margin-left: 15px;float:right;" alt="GitHub, Actions, RSpec, spec file, test file, cut, scissors" />

## Consider the split

Imagine you have a project with 30 RSpec spec files. Each file contains multiple test examples (RSpec "`it`s"). Most of the files are fairly robust, fast unit tests. Let's say there are also some slower files, like feature specs. Perhaps one such feature spec file takes approximately 5 minutes to execute.

When we run different spec files on different parallel machines, we strive for similar execution time on all of them. In a described scenario, even if we run 30 parallel jobs (each one running just one test file), the 5 minute feature spec would be a bottleneck of the whole build. 29 machines may finish their work in a matter of seconds, but the whole build won't be complete until the 1 remaining node finishes executing its file.

## Divide and conquer

To solve the problem of a slow test file, we need to split what's inside it. We could refactor it and ensure the test examples live in separate, smaller test files. There are two problems with that though:

First, it needs work. Although admittedly quite plausible in a described scenario, in real life it's usually not just the one file that's causing problems. Oftentimes there is a number of slow and convoluted test files, with their own complex setups, like nested `before` blocks, `let`s, etc. We've all seen them (and probably contributed to them ending-up this way), haven't we? ;-) Refactoring files like that is no fun, and there seem to always be more higher priority work to be done, at least from our experience.

Second, we belive that the code organization should be based on other considerations. How you create your files and classes is most likely a result of following some approach agreed upon in your project. Dividing classes into smaller ones so that the CI build can run faster encroaches on your conventions. It might be more disturbing to some than the others, but we feel it's fair to say it'd be best to avoid - if there was a better way to achieve the same...

## Enter split by test examples

As you certainly know, RSpec allows us to run individual examples instead of whole files. We decided to take advantage of that, and solve the problem of bottleneck test files by gathering information about individual examples from such slower files. Such examples are then dynamically distributed between your parallel nodes and run individually, so no individual file can be a bottleneck for the whole build. What's important, no additional work is needed - this is done automatically by the `knapsack_pro` gem. Each example is run in its correct context that's set-up exactly the same as if you had run the whole file.

If you are already using [Knapsack Pro](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-run-slow-rspec-files-on-github-actions-with-parallel-jobs-by-doing-an-auto-split-of-the-spec-file-by-test-examples) in queue mode, you can enable this feature just by adding one ENV variable to your GitHub Actions workflow config: `KNAPSACK_PRO_RSPEC_SPLIT_BY_TEST_EXAMPLES: true` (please make sure you're running the newest version of `knapsack_pro` gem). After a few runs, Knapsack Pro will start automatically splitting your slowest test files by individual examples.

Here's a full example GitHub Actions workflow config for a Rails project using RSpec:

{% highlight yml %}
{% raw %}
# .github/workflows/main.yaml

name: Main

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest

    # If you need DB like PostgreSQL, Redis then define service below.
    # https://github.com/actions/example-services/tree/master/.github/workflows
    services:
      postgres:
        image: postgres:10.8
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: ""
          POSTGRES_DB: postgres
        ports:
          - 5432:5432
        # needed because the postgres container does not provide a healthcheck
        # tmpfs makes DB faster by using RAM
        options: >-
          --mount type=tmpfs,destination=/var/lib/postgresql/data
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis
        ports:
          - 6379:6379
        options: --entrypoint redis-server

    # https://help.github.com/en/articles/workflow-syntax-for-github-actions#jobsjob_idstrategymatrix
    strategy:
      fail-fast: false
      matrix:
        # Set N number of parallel jobs you want to run tests on.
        # Use higher number if you have slow tests to split them on more parallel jobs.
        # Remember to update ci_node_index below to 0..N-1
        ci_node_total: [8]
        # set N-1 indexes for parallel jobs
        # When you run 2 parallel jobs then first job will have index 0, the second job will have index 1 etc
        ci_node_index: [0, 1, 2, 3, 4, 5, 6, 7]

    steps:
      - uses: actions/checkout@v2

      - name: Set up Ruby
        uses: actions/setup-ruby@v1
        with:
          ruby-version: 2.6

      - uses: actions/cache@v2
        with:
          path: vendor/bundle
          key: ${{ runner.os }}-gems-${{ hashFiles('**/Gemfile.lock') }}
          restore-keys: |
            ${{ runner.os }}-gems-
      - name: Bundle install
        env:
          RAILS_ENV: test
        run: |
          bundle config path vendor/bundle
          bundle install --jobs 4 --retry 3
      - name: Create DB
        env:
          # use localhost for the host here because we have specified a container for the job.
          # If we were running the job on the VM this would be postgres
          PGHOST: localhost
          PGUSER: postgres
          RAILS_ENV: test
        run: |
          bin/rails db:prepare
      - name: Run tests
        env:
          PGHOST: localhost
          PGUSER: postgres
          RAILS_ENV: test
          KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC: ${{ secrets.KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC }}
          KNAPSACK_PRO_CI_NODE_TOTAL: ${{ matrix.ci_node_total }}
          KNAPSACK_PRO_CI_NODE_INDEX: ${{ matrix.ci_node_index }}
          KNAPSACK_PRO_FIXED_QUEUE_SPLIT: true
          KNAPSACK_PRO_RSPEC_SPLIT_BY_TEST_EXAMPLES: true
          KNAPSACK_PRO_LOG_LEVEL: info
        run: |
          bundle exec rake knapsack_pro:queue:rspec
{% endraw %}
{% endhighlight %}

You can find more details in the video below:
<iframe width="560" height="315" src="https://www.youtube.com/embed/N7i2FF0DSIw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Let us know in the comments what you think about this solution. If you'd like to give this setup a try, you can also consult our FAQ entry  explaining [how to split slow RSpec test files](https://knapsackpro.com/faq/question/how-to-split-slow-rspec-test-files-by-test-examples-by-individual-it?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-run-slow-rspec-files-on-github-actions-with-parallel-jobs-by-doing-an-auto-split-of-the-spec-file-by-test-examples).

As always, don't hesitate to ask questions if you encounter any troubles with configuring GitHub Actions in your project - we'd be happy to help!
