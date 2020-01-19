---
layout: post
title:  "URI.escape is obsolete. Percent-encoding your query string"
date:   2020-01-19 13:00:00 +0100
author: "Shadi Rezek"
categories: techtips ruby
og_image: "/images/blog/posts/uri-escape-is-obsolete-percent-encoding-your-query-string/encoded_space.jpeg"
---

Have you encountered one of those warnings in your Ruby 2.7.0 project?

<img src="/images/blog/posts/uri-escape-is-obsolete-percent-encoding-your-query-string/encoded_space.jpeg" style="width:200px;margin-left: 15px;float:right;" alt="url encoded space" />

{% highlight plain %}
warning: URI.escape is obsolete
warning: URI.encode is obsolete
{% endhighlight %}

Find out how to fix it!

## A little bit of history

Ruby 2.7.0 shows a warning when invoking `URI.escape` or its alias, `URI.encode`. It might look like a fresh deprecation, but the fact is, these methods have been marked as obsolete for... [over 10 years now](https://github.com/ruby/ruby/commit/238b979f1789f95262a267d8df6239806f2859cc)! If you're wondering how come you've never encountered the warning before, here's the answer: previously it was displayed only if you run your script in a verbose mode, and this has changed just recently.

## So why is `URI.escape` obsolete, anyway?

The trouble with a concept of "escaping the URI" is that URI consists of many components (like `path` or `query`), and we don't want to escape them in the same way. For example, it's fine for a `#` character to appear at the end of the URI (when it's used as what's usually called an anchor, or in URI parlance - a `fragment` component) - but when the same `#` is part of user's input (like in a search query), we want to encode it to ensure correct interpretation. Similarly, if the query string value contains other reserved characters, like `=` or `&`, we _do_ want to escape them so that they are not incorrectly interpreted as delimiters, as if they were used as reserved characters.

`URI.escape` relies on a simple `gsub` operation for the whole string and doesn't differentiate between distinct components, which doesn't take into account intricacies like those mentioned above.

## How to fix it?

Since I haven't found an existing solution that would, when given a whole-URI string, interpret distinct components and apply different escaping rules in a desired way on its own, my advice is to encode different components separately. The most common (and most sensitive) use-case is probably encoding of the query string in the `query` component, so I'll focus on this case. And Ruby's `URI` module itself provides two handy methods that will help as achieve just that!

## Percent-encoding your query string

#### `URI.encode_www_form_component(string, enc=nil)`

This method will percent-encode every reserved character, leaving only `*, -, ., 0-9, A-Z, _, a-z` intact.
It also substitues space with `+`. Examples:

{% highlight ruby %}
query = "Tom & Jerry"
query = URI.encode_www_form_component(query)
query # => "Tom+%26+Jerry"
{% endhighlight %}

{% highlight ruby %}
post = "So scared, but let's do this! #yolo"
post = URI.encode_www_form_component(post)
post # => "So+scared%2C+but+let%27s+do+this%21+%23yolo"
{% endhighlight %}

As you can see, we can now safely build our query strings with values escaped this way. But if this seems like too much of manual work, there is a handy way to handle the whole query for you. Introducing...

#### `URI.encode_www_form(enum, enc=nil)`

Slightly different interface. It takes an `Enumerable` (usually a nested `Array` or a `Hash`) and builds the query accordingly. It uses `.encode_www_form_component` internally, so the encoding rules stay the same. The difference lies in the way you use it. Examples:

{% highlight ruby %}
URI.encode_www_form([["search", "Tom & Jerry"], ["page", "3"]])
# => "search=Tom+%26+Jerry&page=3"

URI.encode_www_form(["search", "2 + 2 = 5"])
# => "search=2+%2B+2+%3D+5"

URI.encode_www_form(search: "why is URI.escape obsolete", category: "meta")
#=> "search=why+is+URI.escape+obsolete&category=meta"

# Shameless plug
URI.encode_www_form(q: "how to speed up your CI?", tag: ["#devops", "#productivity"], lang: "en")
#=> "q=how+to+speed+up+your+CI%3F&tag=%23devops&tag=%23productivity&lang=en"
{% endhighlight %}

Quite straightforward, isn't it?


### Rails project?

#### `Hash#to_query`
(also aliased as `Hash.to_param`)

Rails extends the `Hash` class with this handy method. It will return a query string in a correct format, with its values correctly encoded where needed.

{% highlight ruby %}
query_data = { q: "how to speed up your CI?", tag: ["#devops", "#productivity"], lang: "en" }
query_data.to_query
#=> "lang=en&q=how+to+speed+up+your+CI%3F&tag%5B%5D=%23devops&tag%5B%5D=%23productivity"
{% endhighlight %}
(Notice how it also sorts the keys alphabetically.)

You can also pass an optional namespace to this method, which would enclose the key names in the returned string, resulting in a format like `search[q]="how to speed up your CI?"` (but obviously percent-encoded):
{% highlight ruby %}
query_data = { q: "how to speed up your CI?", tag: ["#devops", "#productivity"], lang: "en" }
query_data.to_query("search")
#=> "search%5Blang%5D=en&search%5Bq%5D=how+to+speed+up+your+CI%3F&search%5Btag%5D%5B%5D=%23devops&search%5Btag%5D%5B%5D=%23productivity"
{% endhighlight %}

## Summing up

I hope that short article cleared up any confusion you might have had about encoding your strings for use in URI. Please let us know in the comments if you use any other ways of dealing with percent-encoding in your Ruby/Rails projects!

And if your project is struggling with long CI builds, check out [Knapsack Pro](https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=uri-escape-is-obsolete-percent-encoding-your-query-string), which can help you solve that problem.
