---
layout: post
title:  "CircleCI 2.0 cache Ruby gems or npm dependencies"
date:   2018-12-08 13:00:00 +0100
author: "Artur Trzop"
categories: CircleCI cache ruby gems npm dependencies packages
og_image: "/images/blog/posts/circleci-2-0-cache-ruby-gems-or-npm-dependencies/cache.jpg"
---

CircleCI 2.0 allows us to cache specific files or folders. We can use that to cache ruby gems installed with bundler and restore them when we will run another CI build. This way new CI build could run faster by using cached files from the previous build. This article shows you how to cache npm dependencies as well.

<img src="/images/blog/posts/circleci-2-0-cache-ruby-gems-or-npm-dependencies/cache.jpg" style="width:450px;margin-left: 15px;float:right;" />

## Cache ruby gems

One of the first steps is to check if an available cache exists `v1-dependencies-bundler-{ { checksum "Gemfile.lock" }}` for our `Gemfile.lock`. That's why we include as part of cache key the checksum of the `Gemfile.lock` file. This way if you will have different content of `Gemfile.lock` for different git commits we will use proper cached files when a new CI build would have the same checksum of `Gemfile.lock`.

When you will install new gems and push a new git commit with updated content of `Gemfile.lock` then the cache key for that new `Gemfile.lock` won't exist. In such case, we want to use fallback cache key matching pattern `v1-dependencies-bundler-`.

After the cache is restored we can install gems with bundler to a specified directory `vendor/bundle` and then we can cache it under specific cache key `v1-dependencies-bundler-{ { checksum "Gemfile.lock" }}`

{% highlight yaml %}
# .circleci/config.yml
version: 2
jobs:
  build:
    # other config

    steps:
      - checkout

      # Restore bundle cache
      - type: cache-restore
        keys:
          # NOTE: remove space between { { here and in all below examples
          - v1-dependencies-bundler-{ { checksum "Gemfile.lock" }}
          # fallback to using the latest cache if no exact match is found
          - v1-dependencies-bundler-

      # Bundle install dependencies
      - run: bundle install --jobs=4 --retry=3 --path vendor/bundle

      # Store bundle cache
      - type: cache-save
        key: v1-dependencies-bundler-{ { checksum "Gemfile.lock" }}
        paths:
          - vendor/bundle

      # other config
{% endhighlight %}

If you would like to see a full example of [CircleCI 2.0 config file for Ruby on Rails project](/2017/circleci-2-0-capybara-feature-specs-selenium-webdriver-with-chrome-headless) check this article.

## Cache npm dependencies 

The flow for caching npm packages is similar. Here you can see an example.

{% highlight yaml %}
# .circleci/config.yml
version: 2
jobs:
  build:
    # other config

    steps:
      # other config

      - restore_cache:
          keys:
          - v1-dependencies-{ { checksum "package.json" }}
          # fallback to using the latest cache if no exact match is found
          - v1-dependencies-

      - run: npm install

      - save_cache:
          paths:
            - node_modules
          key: v1-dependencies-{ { checksum "package.json" }}

      # other config
{% endhighlight %}

## Summary

Caching available for CircleCI 2.0 can be very helpful and helps us cut down the time of CI build. There are also more options to speed up our CI build. One of it is [CI parallelization for CircleCI 2.0](/2018/improve-circleci-parallelisation-for-rspec-minitest-cypress), you can learn more in the article or check demo on [Knapsack Pro](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=circleci-2-0-cache-ruby-gems-or-npm-dependencies).
