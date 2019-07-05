---
layout: post
title:  "How to run parallel jobs for RSpec tests on GitLab CI Pipeline and speed up Ruby & JavaScript testing"
date:   2019-07-05 17:00:00 +0200
author: "Artur Trzop"
categories: continuous_integration
og_image: "/images/blog/posts/how-to-run-parallel-jobs-for-rspec-tests-on-gitlab-ci-pipeline-and-speed-up-ruby-javascript-testing/gitlab.jpeg"
---

This is example blog post. If you need to create a new blog post you can copy this file and change the file name to reflect the date of publishing the article and keep blog post title in the name of the blog post file:

{% highlight plain %}
_posts/2099-01-31-example-article.md
{% endhighlight %}

You should update the info about article at the beginning of the blog post file.

{% highlight plain %}
layout: post
title:  "Example article"
date:   2099-01-31 12:00:00 +0100 <-- put here date of publishing the article
author: "Artur Trzop"
categories: techtips continuous_integration <-- here you need to set techtips or continuous_integration category
                                                to show blog post on homepage in proper category.
                                                You can also add some fake categories like Ruby JavaScript etc
og_image: "/images/blog/posts/example-article/image.jpg"
published: false <--- remove this line
{% endhighlight %}

In order to see the blog post you need to run Jekyll with future flag:

{% highlight bash %}
$ bundle exec jekyll serve --watch --future
{% endhighlight %}

Now you can preview blog post at [http://localhost:4000/](http://localhost:4000/2099/example-article)

## Use h2 headers

We can highlight some words like `ApplicationController`. We can paste block of code (note it's highlighted as `ruby` code).

{% highlight ruby %}
module API
  class BaseController < ActionController::Base
    def something
      # example
    end
  end
end
{% endhighlight %}

Keep in the article link to Knapsack Pro website with utm tags in the url. This way we can track which article brings traffic to the website. Example below:

If you want to learn more how to faster test your Rails application then check out <a href="/">blog</a> and website about <a href="https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog&utm_campaign=example-article">knapsack_pro gem for CI parallelisation</a>.
