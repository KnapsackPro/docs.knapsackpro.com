---
layout: post
title:  "Example article"
date:   2049-01-31 12:00:00 +0100
author: "Artur Trzop"
categories: hidethispost
og_image: "/images/blog/posts/example-article/image.jpg"
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
categories: blog techtips <-- here you need to set blog or techtips category 
                              to show blog post on homepage in proper category.
                              You can also add some fake categories like Ruby JavaScript etc
og_image: "/images/blog/posts/example-article/image.jpg"
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

Keep in the article link to Knapsack Pro website with utm tags in the url. This way we can track what article brings traffic to the website. Example below:

If you want to learn more how to faster test your Rails application then check out <a href="/">blog</a> and website about <a href="https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog&utm_campaign=example-article">knapsack_pro gem for CI parallelisation</a>.
