---
layout: post
title:  "How to run tests in Minitest continuously with dynamic test files loading"
date:   2018-05-27 12:00:00 +0200
author: "Artur Trzop"
categories: techtips Minitest "test suite" "queue"
og_image: "/images/blog/posts/how-to-run-tests-in-minitest-continuously-with-dynamic-test-files-loading/minitest_continuously.png"
---

Recently I've been looking into the source code of Minitest to find out if I can run some tests and then dynamically run another set of tests once the previous run is done. This would allow me to provide dynamically a list of tests to execute on my parallel CI nodes to run CI builds faster.

<img src="/images/blog/posts/how-to-run-tests-in-minitest-continuously-with-dynamic-test-files-loading/minitest_continuously.png" style="width:250px;float:right;" alt="Minitest" />

Something similar exists in RSpec thanks to `RSpec::Core::Runner` feature that allows running specs multiple times with different runner options in the same process.

In RSpec flow looks like:

{% highlight ruby %}
require "spec_helper"

RSpec::Core::Runner.run([... some parameters ...])

RSpec.clear_examples

RSpec::Core::Runner.run([... different parameters ...])
{% endhighlight %}

As you can see one of the steps is to clear examples with `RSpec.clear_examples` for the previous run to ensure the executed tests won't affect the next list of tests we will run.

I was also looking if something similar exists in Minitest to ensure we have a pristine state of test runner before we run another set of test files. I step on `Minitest::Runnable.reset` method that could do it.

## Digging into Minitest source code

I found out that Minitest has [class method `run`](https://github.com/minitest/minitest/blob/8a59450038f31f30fe591946bbb0418ac9f65617/lib/minitest.rb#L546) that will start running the loaded test files.

{% highlight ruby %}
# minitest/lib/minitest.rb
module Minitest
  ##
  # This is the top-level run method. Everything starts from here. It
  # tells each Runnable sub-class to run, and each of those are
  # responsible for doing whatever they do.
  #
  # The overall structure of a run looks like this:
  #
  #   Minitest.autorun
  #     Minitest.run(args)
  #       Minitest.__run(reporter, options)
  #         Runnable.runnables.each
  #           runnable.run(reporter, options)
  #             self.runnable_methods.each
  #               self.run_one_method(self, runnable_method, reporter)
  #                 Minitest.run_one_method(klass, runnable_method)
  #                   klass.new(runnable_method).run

  def self.run args = []
{% endhighlight %}

Knowing that I could run tests with it. The first step thou was to ensure we will be able to load test files but I realized at the top of each of test file I have a line like:

{% highlight ruby %}
require 'test_helper'
{% endhighlight %}

and the `test_helper.rb` file was not found while I attempt to load test file so I had to first add a directory with my tests to load path to make above require work.

{% highlight ruby %}
# add test directory to load path to make require 'test_helper' work
$LOAD_PATH.unshift('test')

# now load test files
require './test/models/user_test.rb'
require './test/models/article_test.rb'

# if all tests pass we want to exit process with 0 exit code
final_exit_code = 0

# run tests loaded into memory
args  = ['--verbose']
# We need to duplicate the args because the run method will change the Array object.
# We will reuse args later.
tests_passed? = Minitest.run(args.dup)

# now the tests will be executed

# the variable tests_passed? will be true if tests passed. Otherwise would be false
final_exit_code = 1 unless tests_passed?

# Before we run another set of test files we need to reset the test runner state
Minitest::Runnable.reset


# Let's load another set of test files
require './test/controllers/users_controller_test.rb'
require './test/controllers/articles_controller_test.rb'

# we can run new set of test files
tests_passed? = Minitest.run(args.dup)
final_exit_code = 1 unless tests_passed?

# now the second set of test files will be executed

# once the tests files finished run then we can exit process with proper exit code
# 0 - when all tests are green
# 1 - when at least one test failed. Exit code 1 tells our CI provider
#     that process running tests failed.
exit(final_exit_code)
{% endhighlight %}

## Running Minitest continuously and fetching test files from the Queue in a dynamic way

Digging into the source code of Minitest helped me to find out a way to run my tests in a more efficient way. I applied this to the [knapsack_pro gem](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=run-tests-in-minitest-continuously) I'm working on.

You can see in the below video how dynamic tests allocation across CI nodes can save time and run test suite faster. Last week one of my users from [https://wellfound.com](https://wellfound.com) tried the Queue Mode in knapsack_pro for Minitest and it helped him run CI builds faster. Maybe this will help you too. :)

<div class="video-container">
  <iframe src="https://www.youtube.com/embed/hUEB1XDKEFY" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>
