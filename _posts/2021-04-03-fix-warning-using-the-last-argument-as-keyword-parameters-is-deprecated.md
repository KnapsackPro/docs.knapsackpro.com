---
layout: post
title:  "Fix: 'warning: Using the last argument as keyword parameters is deprecated'"
date:   2021-04-03 08:00:00 +0100
author: "Shadi Rezek"
categories: techtips ruby
og_image: ""
---

Have you encountered the `warning: Using the last argument as keyword parameters is deprecated` message in your Ruby project? You probably started seeing this after upgrading your project to Ruby 2.7. This version introduced the deprecation as a means to prepare users for a breaking change in Ruby 3. Let's learn how to fix this!

## The explanation

In Ruby 2, you could pass a Hash as the last argument to the method that expects keyword arguments, and the key-value pairs from the hash would be treated as keyword arguments.

{% highlight ruby %}
def greet(greeting, name:)
  puts "#{greeting}, #{name}!"
end

options = { name: "John" }

# Ruby 2.6
greet("Hello", options)
#=> "Hello, John!"
{% endhighlight %}

Ruby 2.7 still allows this, but now warns about this usage.

{% highlight ruby %}
# Ruby 2.7
greet("Hello", options)
warning: Using the last argument as keyword parameters is deprecated; maybe ** should be added to the call
#=> "Hello, John!"
{% endhighlight %}

And Ruby 3 raises an `ArgumentError`.

{% highlight ruby %}
# Ruby 3
greet("Hello", options)
ArgumentError (wrong number of arguments (given 2, expected 1; required keyword: name))
{% endhighlight %}

In the above example, `greeting` is a "positional argument" of the `#greet` method, while `name:` is a keyword argument. As we can see, in Ruby 2 we could invoke the method as if we were just passing two regular arguments to it, using a hash object as the last one. Ruby's interpreter would then automagically "deconstruct" the hash as needed and match its key-value pairs to the keyword argument expected by the method.

The Ruby team believed that this behavior is prone to be quite confusing and [decided to alter it in Ruby 3](https://www.ruby-lang.org/en/news/2019/12/12/separation-of-positional-and-keyword-arguments-in-ruby-3-0/){:target="_blank"}. That's why you see these deprecation warnings in Ruby 2.7, and the usage is no longer valid since Ruby 3.

## So how to fix it?

There are two ways to resolve the warnings in Ruby 2.7 (and prepare your code for Ruby 3).

### The simple solution

The most non-invasive way to fix the warning is to do what the warning itself suggests - just use the double splat (`**`) operator before the hash. This way, we explicitly say that the Hash's contents are meant to be "exploded" to match the required keyword arguments.


{% highlight ruby %}
def greet(greeting, name:)
  puts "#{greeting}, #{name}!"
end

options = { name: "John" }

# Ruby 2.7
greet("Hello", **options)
#=> "Hello, John!"

# Ruby 3
greet("Hello", **options)
#=> "Hello, John!"
{% endhighlight %}

Works like a charm!


### Not using the Hash

Another option would obviously be to abstain from using the hash object in the first place. This may require a bigger refactor in your code or simply be undesired. Still, it might be something to consider, especially in simple cases.

{% highlight ruby %}
def greet(greeting, name:)
  puts "#{greeting}, #{name}!"
end

# Ruby 2.7
greet("Hello", name: "John")
#=> "Hello, John!"

# Ruby 3
greet("Hello", name: "John")
#=> "Hello, John!"
{% endhighlight %}


## Avoiding the shortcuts

As with every warning, we might get an idea to ignore or even suppress it. I advise against this. The warning is there for a reason, and it's best to fix it and avoid troubles with future version upgrades. This is even more true given how straightforward this warning is to fix in most cases.

## Conclusion

Have you encountered this warning in your code? Please let us know in the comments!

And if your Ruby project suffers from slow CI builds, consider using [Knapsack Pro](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=fix-warning-using-the-last-argument-as-keyword-parameters-is-deprecated) to improve the productivity of your team!
