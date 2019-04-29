---
layout: post
title:  "How to run parallel dynos on Heroku CI to complete tests faster"
date:   2018-12-01 20:00:00 +0100
author: "Artur Trzop"
categories: blog Heroku CI parallel test parallelisation Ruby RSpec Minitest Javascript Cypress
og_image: "/images/blog/posts/how-to-run-parallel-dynos-on-heroku-ci-to-complete-tests-faster/heroku.jpg"
---

Heroku provides a CI solution out of the box for teams. They can run tests in dyno instance for your project. What's more interesting you can run parallel dynos as part of your CI build. This allows you to split tests on parallel dynos to complete CI build faster and save time.

<img src="/images/blog/posts/how-to-run-parallel-dynos-on-heroku-ci-to-complete-tests-faster/heroku.jpg" style="width:450px;margin-left: 15px;float:right;" />

Heroku charges you for seconds spent in runtime for each dyno. It means instead of running your slow test suite on a single dyno you could split it across multiple dynos and pay more or less the same and significantly reduce the CI build time for your project.

## How to start with Heroku CI

If you or your company has already created a team in Heroku then you can use Heroku CI and run tests for your project there.

In Heroku, you can open your team and particular pipeline for one of your projects. You will find there a <i>Tests</i> tab where you can enable Heroku CI.

You will also need an <i>app.json</i> file in a repository of your project. The file contains information about what's needed to run the project on Heroku. We will add to the <i>app.json</i> file additional configuration needed for Heroku CI.

In order to use Heroku CI parallel test runs, we need to have it enabled. You will have to ask Heroku support to activate it for your project. This feature allows to run up to 32 parallel dynos for your CI build.

You can also watch all the steps on more detailed video or copy some examples from this article.

<iframe width="560" height="315" src="https://www.youtube.com/embed/4lJVzdA11OQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Below I will show you examples how to split tests on Heroku CI for Ruby and JavaScript projects.

## How to run parallel dynos for test suite in Ruby on Rails project

We can split Ruby tests written in RSpec, Minitest or other tests runners across parallel dynos in a dynamic way where all dynos will finish work at similar time so we will get results about our test suite being green or red as soon as possible. To do it we will use [Knapsack Pro](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-run-parallel-dynos-on-heroku-ci-to-complete-tests-faster) tool with its [Queue Mode for dynamic test suite split](https://youtu.be/hUEB1XDKEFY). With <i>quantity</i> key, we can set how many parallel dynos we want to use to run our <i>scripts test</i> command.

{% highlight json %}
{
  "environments": {
    "test": {
      "formation": {
        "test": {
          "quantity": 2
        }
      },
      "addons": [
        "heroku-postgresql"
      ],
      "scripts": {
        "test": "bundle exec rake knapsack_pro:rspec"
      },
      "env": {
        "KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC": "rspec-token"
      }
    }
  }
}
{% endhighlight %}

We also can change dyno size for our CI build. If you run complex tests that need more CPU or memory you could add <i>size</i> parameter to <i>app.json</i> to define [dyno type](https://devcenter.heroku.com/articles/dyno-types).

{% highlight json %}
{
  "environments": {
    "test": {
      "formation": {
        "test": {
          "quantity": 1,
          "size": "performance-l"
        }
      }
   }
}
{% endhighlight %}

## Run JavaScript tests across parallel Heroku CI dynos for Cypress E2E test suite

End-to-end tests (E2E) often takes a lot of time because clicking through multiple scenarios of your website is time-consuming. Splitting Cypress test suite on multiple dynos will help us save a lot of time and keep CI build fast.

We can use [@knapsack-pro/cypress](https://github.com/KnapsackPro/knapsack-pro-cypress) project for that. It uses [Knapsack Pro Queue Mode](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-run-parallel-dynos-on-heroku-ci-to-complete-tests-faster).

Here is a config for your <i>app.json</i>

{% highlight json %}
{
  "environments": {
    "test": {
      "formation": {
        "test": {
          "quantity": 2
        }
      },
      "addons": [
        "heroku-postgresql"
      ],
      "scripts": {
        "test": "$(npm bin)/knapsack-pro-cypress"
      },
      "env": {
        "KNAPSACK_PRO_TEST_SUITE_TOKEN_CYPRESS": "example"
      }
    }
  }
}
{% endhighlight %}

If you would like to learn more about Cypress then check the video in an article about [running javascript E2E tests with Cypress on parallel CI nodes](/2018/run-javascript-e2e-tests-faster-with-cypress-on-parallel-ci-nodes).

## Summary

Heroku CI is a great addition to Heroku. If you already use Heroku you can easily leverage dynos and keep low costs of your CI as you pay only for dyno usage. The great thing is that you can run many parallel CI dynos with a subset of your test suite to save a ton of time for your engineering team. You can learn more about how [Knapsack Pro can help you save time with faster CI builds](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-run-parallel-dynos-on-heroku-ci-to-complete-tests-faster).
