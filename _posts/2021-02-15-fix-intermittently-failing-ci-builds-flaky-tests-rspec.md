---
layout: post
title:  "Fix intermittently failing CI builds due to flaky tests in RSpec"
date:   2021-02-15 12:00:00 +0100
author: "Shadi Rezek"
categories: continuous_integration techtips rspec
og_image: "/images/blog/posts/fix-intermittently-failing-ci-builds-flaky-tests-rspec/flaky_tests.jpeg"
---

I hate randomly failing CI builds. One run is green, another is red (with no changes in the code!). So frustrating. Let's see what can be done with this.

<img src="/images/blog/posts/fix-intermittently-failing-ci-builds-flaky-tests-rspec/flaky_tests.jpeg" style="width:150px;margin-right: 15px;float:left;" alt="CI Builds, Flaky Tests, Knapsack Pro" />

## Random failures

When builds are randomly failing, flaky tests are often the culprit.

A flaky test is a test that can both fail and pass for the exact same code. In other (and more fancy) words, the test is _nondeterministic_. Its outcome varies, even if (seemingly) nothing else does.

## Trust issues

Nondeterministic tests erode trust. Keeping them in the mix can quickly cause the whole test suite to lose its value. Think about it. The failed build is useful when the failure actually signifies something. It needs to make us stop. To signal that something needs fixing. The more it happens for trivial reasons, the less alert we become to it.

It's better to not run the test case at all if it can't be trusted to provide useful feedback.

## First things first

When you encounter this problem, think if you need a given test at all. If it wasn't there already, would you write it? Ask other team members for their opinion.

If the test is deemed important, the correct (and safest) solution would be to debug and solve the underlying issues right away.

Not possible at the moment? At least make sure that it's the _failure_ of the test which is random, and not its _passing_. Then I strongly suggest documenting the issue, creating a ticket, or planning to solve it in some other way.

Raise the issue inside your team. If they care about quality assurance and continuous delivery (or their own _sanity_, really), they will understand.

When this is taken care of, we have a few short-term options.

## Rerunning failed builds

When the failure of a CI build is attributed to randomness, the natural reaction is to retry the build. If the rerun build passes, it would be best to still document what happened.

Some CI providers let you configure auto-retrying failed builds. It might be tempting to "solve" randomness this way. I advise against using it (for flaky tests anyway).

Here at Knapsack we are all about [decreasing build times](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=fix-intermittently-failing-ci-builds-flaky-tests-rspec). We strongly believe that the shorter the build times, the more productive the team becomes. Frequently rerunning the whole build results in just the opposite. It wastes a lot of time.

## If you don't trust it, X it!

In RSpec, we can change the `it` method (denoting a test example) to `xit` to skip a given test case [1]. By default, RSpec's output shows how many tests were skipped. This way, they stay visible. This increases the chance that they will be fixed. That's what makes this solution advantageous over just commenting the problematic code out.

## Rerunning failed test case

Some flaky tests are caused by inadvertent order dependence or timing issues. Rerunning the individual example could result in a pass. [`rspec-retry`](https://github.com/NoRedInk/rspec-retry) is a library for RSpec that allows doing just that. With it, you can configure which tests should be retried on failure, and how many times. It's also possible to specify wait time before subsequent retries.

Retrying on a test case level limits the amount of time wasted. If you use [Knapsack Pro in the Queue Mode](https://docs.knapsackpro.com/2020/how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation#dynamic-tests-split---queue-mode), the waste should be negligible.

If you don't use RSpec, just search for a similar solution for your test runner. It's likely to be built-in or provided as an extension by an additional library.

## Conclusion

By understanding the consequences of each solution, we are well-equipped to tackle flaky tests.

How does your team respond to random failures? Please share in the comments below!

<br/><br/>

___
[1] The 'x' prefix works with other methods as well. Please consult the [RSpec docs](https://relishapp.com/rspec/rspec-core/v/3-9/docs/pending-and-skipped-examples/skip-examples) for details.


