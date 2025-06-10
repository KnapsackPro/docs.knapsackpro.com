---
layout: post
title:  "Setting up Knapsack Pro in your Ruby RSpec project"
date:   2021-02-25 09:00:00 +0100
author: "Shadi Rezek"
categories: techtips continuous_integration
og_image: "/images/blog/posts/setting-up-knapsack-pro-in-ruby-rspec-project/regular_vs_queue.jpeg"
---

Knapsack Pro offers two modes for RSpec tests in your Ruby application: the Regular Mode and the Queue Mode. They differ in their approach towards dividing your test files between parallel CI nodes.

<img src="/images/blog/posts/setting-up-knapsack-pro-in-ruby-rspec-project/regular_vs_queue.jpeg" style="width:300px;margin-left: 15px;float:right;" alt="Knapsack Pro Regular Mode vs Queue Mode in Ruby RSpec" />

## Regular Mode vs Queue Mode

The **Regular Mode** uses timing data for every test file and splits all tests based on that. For example, if you use 6 parallel CI nodes, it will split your tests into 6 sets, roughly equal by their combined timings (based on previously collected timing data). These sets will then be distributed across parallel machines and run by them. We call this a _static_ distribution of tests.

With the **Queue Mode**, there is one central queue comprising all of the test files. Each parallel node receives a small subset of tests from the queue and runs them. The pattern repeats until the whole queue is empty. (BTW, The Queue Mode also uses the timing data - but this is used only to order the tests in the queue in a way that ensures the best overall performance.)
We don't know which tests will end up distributed to which node beforehand - that's why this distribution is _dynamic_.

The way the Queue Mode works helps mitigate unstable test run times and parallel node performance. When the metrics can vary, the queue mode is the answer.

The Regular vs Queue Mode distinction is covered more in-depth in a [separate post](/2020/how-to-speed-up-ruby-and-javascript-tests-with-ci-parallelisation).

After helping many different projects over the years, we can say, that the Queue Mode is usually the best solution. In the real world, the performance of individual machines and tests is subject to all sorts of unpredictability. Using Queue Mode results in the most robust optimization despite these constraints.

## Always start your setup with Regular Mode

Since we are claiming that the Queue Mode is the ultimate best for most projects, you might be tempted to jump right in and give it a try. This is _not_ what we advise, however. Let me explain why.


### Non-trivial setup

We are doing our best to make the [Knapsack setup](https://docs.knapsackpro.com/) experience as smooth as possible for every project giving our solution a try. Some things just lie outside of our control, though.

The combination of your specific CI pipeline configuration and your RSpec usage might require some adjustments along the way.

What we know from experience is that usually the Queue Mode uncovers different adjustment needs than the Regular Mode. The reason behind that is that in the Queue Mode, each one of your parallel CI nodes will usually run the RSpec command multiple times (as compared to just one run per node in the Regular Mode). This distinction might result in additional challenges to solve.

As with all debugging, it's best to narrow down (isolate) possible issues we are tackling at a given time. This is why we strongly suggest to [set up](https://docs.knapsackpro.com/) the Regular Mode first. When you ensure it works as expected, and confirm that in your [User Dashboard](https://knapsackpro.com/sessions?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=setting-up-knapsack-pro-in-rspec-project), you are ready to proceed to the Queue Mode setup.

And now for the good news: we have documented all of the common issues you might encounter during your setup in our [FAQ](https://knapsackpro.com/faq?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=setting-up-knapsack-pro-in-rspec-project). Keep that in mind during your onboarding.

Head over to our [installation guide](https://docs.knapsackpro.com/) and get the best out of Knapsack for your project today! We would very happy to assist you along the way, so do not hesitate to [contact us](https://knapsackpro.com/contact?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=setting-up-knapsack-pro-in-rspec-project) if you need anything.

## Conclusion

Following the described order of steps (using Regular Mode before Queue Mode) should result in the smoothest [Knapsack Pro setup](https://docs.knapsackpro.com/) experience. In case you are stuck at any point, please consult our [installation guide](https://docs.knapsackpro.com/knapsack_pro-ruby/guide/), [FAQ](https://knapsackpro.com/faq?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=setting-up-knapsack-pro-in-rspec-project), or simply [contact us](https://knapsackpro.com/contact?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=setting-up-knapsack-pro-in-rspec-project). We'll be more than happy to help!
