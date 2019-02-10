---
layout: post
title:  "How to run Travis CI parallel jobs with build matrix feature fast"
date:   2018-11-30 19:00:00 +0100
author: "Artur Trzop"
categories: blog Travis CI parallelisation Ruby RSpec Minitest Javascript Cypress
og_image: "/images/blog/posts/how-to-run-travis-ci-parallel-jobs-with-build-matrix-feature-fast/travis-ci.jpg"
---

Travis CI allows you to run multiple jobs as part of the same CI build. They even allow for up to 200 parallel jobs for open source projects (the same for private repositories). You can leverage that using Travis build matrix feature to run your project way faster by splitting tests into many smaller jobs that will run a subset of your test suite.

<img src="/images/blog/posts/how-to-run-travis-ci-parallel-jobs-with-build-matrix-feature-fast/travis-ci.jpg" style="width:450px;margin-left: 15px;float:right;" />

## How build matrix feature works?

[Build matrix feature](https://docs.travis-ci.com/user/build-matrix/) allows to automatically create a matrix of all possible combinations of language and environment dependent set of configuration options. For instance, when you want to test your project on 2 different programming language versions and with 2 different browsers then Travis would generate 4 parallel jobs running your tests for each programming language and browser.

## Split tests across parallel jobs

We could use build matrix feature to split tests by adding to your project [Knapsack Pro](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-run-travis-ci-parallel-jobs-with-build-matrix-feature-fast) that will split your <b>Ruby</b> or <b>Javascript</b> tests automatically across parallel jobs in a way that all parallel jobs would run subset of test suite and finish work in similar time so you would get the result of your test suite passing or not as fast as possible without waiting for the slowest job.

How to run Ruby tests on parallel jobs with [knapsack_pro](https://github.com/KnapsackPro/knapsack_pro-ruby) ruby gem:

{% highlight yaml %}
# .travis.yml
script:
  # Step for RSpec
  - "bundle exec rake knapsack_pro:rspec"

  # Step for Cucumber
  - "bundle exec rake knapsack_pro:cucumber"

  # Step for Minitest
  - "bundle exec rake knapsack_pro:minitest"

  # Step for test-unit
  - "bundle exec rake knapsack_pro:test_unit"

  # Step for Spinach
  - "bundle exec rake knapsack_pro:spinach"

env:
  global:
    # tokens should be set in travis settings in web interface to avoid expose tokens in build logs
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC=rspec-token
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_CUCUMBER=cucumber-token
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_MINITEST=minitest-token
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_TEST_UNIT=test-unit-token
    - KNAPSACK_PRO_TEST_SUITE_TOKEN_SPINACH=spinach-token

    - KNAPSACK_PRO_CI_NODE_TOTAL=2
  matrix:
    - KNAPSACK_PRO_CI_NODE_INDEX=0
    - KNAPSACK_PRO_CI_NODE_INDEX=1
{% endhighlight %}

How to run Cypress tests in JavaScript on parallel jobs with [@knapsack-pro/cypress](https://github.com/KnapsackPro/knapsack-pro-cypress):

{% highlight yaml %}
# .travis.yml
script:
  - "$(npm bin)/knapsack-pro-cypress"

env:
  global:
    - KNAPSACK_PRO_CI_NODE_TOTAL=2
    # allows to be able to retry failed tests on one of parallel job (CI node)
    - KNAPSACK_PRO_FIXED_QUEUE_SPLIT=true

  matrix:
    - KNAPSACK_PRO_CI_NODE_INDEX=0
    - KNAPSACK_PRO_CI_NODE_INDEX=1
{% endhighlight %}

By doing test suite split in a dynamic way across Travis parallel jobs we save more time and keep our CI build fast. I also call parallel jobs as CI nodes because they are part of a single CI build. Here on the video, I describe a few more problems that can be solved with dynamic test suite split.

<iframe width="560" height="315" src="https://www.youtube.com/embed/hUEB1XDKEFY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Travis CI build matrix in action

If you would like to see how [Knapsack Pro helps split tests across parallel jobs](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-run-travis-ci-parallel-jobs-with-build-matrix-feature-fast) you can check open source project Consul - Open Government and E-Participation Web Software. There is a [list of CI builds for Consul](https://travis-ci.org/consul/consul).

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">I&#39;ve got cup gift for GitHub contribution to <a href="https://twitter.com/hashtag/Consul?src=hash&amp;ref_src=twsrc%5Etfw">#Consul</a> - Open Government and E-Participation Web Software <a href="https://t.co/NNIAgO3uXX">https://t.co/NNIAgO3uXX</a> that empowers <a href="https://t.co/eGO3aj0slM">https://t.co/eGO3aj0slM</a> The Consul team uses <a href="https://twitter.com/KnapsackPro?ref_src=twsrc%5Etfw">@KnapsackPro</a> to run <a href="https://twitter.com/hashtag/ruby?src=hash&amp;ref_src=twsrc%5Etfw">#ruby</a> tests faster :) Thanks <a href="https://twitter.com/bertocq?ref_src=twsrc%5Etfw">@bertocq</a> <a href="https://twitter.com/voodoorai2000?ref_src=twsrc%5Etfw">@voodoorai2000</a> <a href="https://t.co/8sowbeXlAJ">pic.twitter.com/8sowbeXlAJ</a></p>&mdash; Artur Trzop (@ArturTrzop) <a href="https://twitter.com/ArturTrzop/status/1012429838328754176?ref_src=twsrc%5Etfw">June 28, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## Summary

If you would like to learn more about testing with [Knapsack Pro](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-to-run-travis-ci-parallel-jobs-with-build-matrix-feature-fast) you can check other articles on our [blog](/) like [testing with Cypress test runner](/2018/run-javascript-e2e-tests-faster-with-cypress-on-parallel-ci-nodes).
