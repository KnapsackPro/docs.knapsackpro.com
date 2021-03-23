---
layout: post
title:  "How to load Ruby gems from cache on Github Actions"
date:   2021-03-25 08:00:00 +0100
author: "Artur Trzop"
categories: techtips continuous_integration
og_image: "/images/blog/posts/how-to-load-ruby-gems-from-cache-on-github-actions/cache.jpeg"
---

How to start CI build faster by loading Ruby gems from cache on Github Actions? You can start running your tests for a Ruby on Rails project quicker if you manage to set up all dependencies in a short amount of time. Caching can be helpful with that. Ruby gems needed for your project can be cached by Github Actions and thanks to that they can be loaded much faster when you run a new CI build.

<img src="/images/blog/posts/how-to-load-ruby-gems-from-cache-on-github-actions/cache.jpeg" style="width:300px;margin-left: 15px;float:right;" alt="Buildkite, CI, RSpec, testing, Ruby" />

You will learn how to configure Github Actions using:

* [actions/cache](https://github.com/actions/cache) - it's a popular solution to cache Ruby gems.
* [ruby/setup-ruby](https://github.com/ruby/setup-ruby) - it's a solution to install a specific Ruby version and cache Ruby gems with bundler. Two features in one action.

## actions/cache - just cache dependencies

[Actions/cache](https://github.com/actions/cache) is a popular solution that can be used to save data into the cache and restore it during the next CI build. It's often used for Ruby on Rails projects that also use `actions/setup-ruby` for managing the Ruby version on Github Actions.

Let's look at the Github Actions caching config example using `actions/cache`.

{% highlight yml %}
{% raw %}
# .github/workflows/main.yml
name: Main
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

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
{% endraw %}
{% endhighlight %}

* You need to specify a directory path that will be cached. It's `vendor/bundle` in our case.
* You also generate a unique cache `key` based on the OS version and `Gemfile.lock` file. Thanks to that when you change the operating system version or you install a new gem and `Gemfile.lock` changes then a new `key` value will be generated.
* You need to configure the bundler to install all your Ruby gems to the directory `vendor/bundle`.
* You can use bundler options:
  * `--jobs 4` - install gems using parallel workers. This allows faster gems installation.
  * `--retry 3` - makes 3 attempts to connect to Rubygems if there is a network issue (for instance temporary downtime of Rubygems.org)

If you would like to see the full YAML config for the Github Actions and Rails project you can take a look at some of our articles:

* [How to run RSpec on GitHub Actions for Ruby on Rails app using parallel jobs](/2019/how-to-run-rspec-on-github-actions-for-ruby-on-rails-app-using-parallel-jobs)
* [GitHub Actions CI config for Ruby on Rails project with MySQL, Redis, Elasticsearch - how to run parallel tests](/2019/github-actions-ci-config-for-ruby-on-rails-project-with-mysql-redis-elasticsearch-how-to-run-parallel-tests)
* [How to run slow RSpec files on Github Actions with parallel jobs by doing an auto split of the spec file by test examples](/2020/how-to-run-slow-rspec-files-on-github-actions-with-parallel-jobs-by-doing-an-auto-split-of-the-spec-file-by-test-examples)
* [Cucumber BDD testing using Github Actions parallel jobs to run tests quicker](/2021/cucumber-bdd-testing-using-github-actions-parallel-jobs-to-run-tests-quicker)

## ruby/setup-ruby - install Ruby and cache gems

In the previous chapter, we mentioned the `actions/setup-ruby` is often used with Ruby on Rails projects. The `actions/setup-ruby` has been deprecated so it's recommended to use `ruby/setup-ruby` action nowadays. It already has caching feature that you could use. Let's see how.

{% highlight yml %}
{% raw %}
# .github/workflows/main.yml
name: Main
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2

    - uses: ruby/setup-ruby@v1
      with:
        # Not needed with a .ruby-version file
        ruby-version: 2.7
        # runs 'bundle install' and caches installed gems automatically
        bundler-cache: true

    # run RSpec tests
    - run: bundle exec rspec
{% endraw %}
{% endhighlight %}

As you can see using `ruby/setup-ruby` for managing the Ruby version and gems caching is much simpler. You just add an option `bundler-cache: true` and that's it.

You can read in [`ruby/setup-ruby` documentation](https://github.com/ruby/setup-ruby#caching-bundle-install-automatically):

"It is also possible to cache gems manually, but this is not recommended because it is verbose and very difficult to do correctly. There are many concerns which means using `actions/cache` is never enough for caching gems (e.g., incomplete cache key, cleaning old gems when restoring from another key, correctly hashing the lockfile if not checked in, OS versions, ABI compatibility for ruby-head, etc). So, please use `bundler-cache: true` instead..."

## Summary

You saw 2 ways of caching Ruby gems on Github Actions. There are also other ways to make your CI build faster like running tests in parallel. You can learn more about [test parallelisation here](/2020/how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation) or simply check the [Knapsack Pro](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-load-ruby-gems-from-cache-on-github-actions) homepage.
