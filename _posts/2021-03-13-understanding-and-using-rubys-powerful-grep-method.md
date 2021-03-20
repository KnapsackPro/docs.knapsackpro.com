---
layout: post
title:  "Understanding and using Ruby's powerful #grep method"
date:   2021-03-13 12:00:00 +0100
author: "Shadi Rezek"
categories: techtips ruby
og_image: "/images/blog/posts/understanding-and-using-rubys-powerful-grep-method/grep.png"
---

Ruby is known for its many handy methods. I'd like to take a look at one that is a little bit less known, but quite powerful nonetheless: the `#grep` method.

<img src="/images/blog/posts/understanding-and-using-rubys-powerful-grep-method/grep.png" style="width:300px;margin-left: 15px;float:right;" alt="#grep" />

## About the method

[#grep](https://ruby-doc.org/core-3.0.0/Enumerable.html#method-i-grep){:target="_blank"} is one of many instance methods defined on the `Enumerable` module. This essentially means that you can use it on all Ruby classes that include this module, e.g. `Array` or `Hash`. The `Enumerable` module is the place where many other popular "collection" methods are defined - `#map`, `#select`, and the like. Whatever Ruby object you can use the `#map` on, you should be able to use the `#grep` on as well.

## "Getting a #grep"

Let's see an example usage of the `#grep` method:

{% highlight ruby %}
array = ['foo', 'bar', 'baz']

array.grep(/^ba/)
# => ["bar", "baz"]
{% endhighlight %}

Seems pretty handy, right? And that's just one way of using it. But before showing more examples, let's deconstruct this to understand exactly how it works.

What happens under the hood here could be mimicked with a code like this:

{% highlight ruby %}
array.select { |element| /regexp/ === element }
{% endhighlight %}

Or, more generally:

{% highlight ruby %}
collection.select { |element| pattern === element }
{% endhighlight %}

Notice a few things here:
- The return value will always be an array. The length of this array will be between 0 (empty), and the size of the original collection (which is exactly how `#select` behaves too).
- We are using the _triple equals_ (`#===`) method ("operator").
  The `#===` is probably worthy of a separate article. But for now, we can just recall that it's implemented in classes as sort of a "lighter" (meaning: less strict) equality method (also called "case" equality due to its usage in case statements). We can illustrate the difference between regular and "case" equality with an example:

{% highlight ruby %}
# the two objects are obviously not the same
(1..2) == 2 #=> false
# 2 falls within the range of 1..2
(1..2) === 2 #=> true
{% endhighlight %}

- We don't have to limit ourselves to regexes. Any object could be passed as a "pattern" to compare against.

- The _triple equals_ method is invoked on the given _pattern_, not the elements of the collection. (The `pattern === element` bit is of course just a syntactical sugar for `pattern.=== element` - stripping out the 'sugar' exposes the method invocation). Invoking the method on the pattern makes sense, as it's this object that should "know" when something is passing its "light" equality requirements. Notice the difference here:

{% highlight ruby %}
"foobar" === /foo/ # invoking the `String#===` method
#=> false

/foo/ === "foobar" # invoking the `Regexp#===` method
#=> true
{% endhighlight %}

## When and how to use it

Enough theory. Let's get down to it and look at some concrete situations where the `#grep` method might come in very handy to you.

### #grep with a Regexp

You can easily match strings with a Regexp pattern.

Just use:

{% highlight ruby %}
string_collection.grep(/^pattern/)
{% endhighlight %}

instead of:

{% highlight ruby %}
string_collection.select { |str| /^pattern/ === str }
{% endhighlight %}

Apart from handling collections of strings in the code, I find the `#grep` method to be very handy for... recalling things (e.g. by performing a quick lookup in the terminal). These examples should illustrate the idea:


{% highlight ruby %}
Module.constants.grep(/RUBY/)
#=>[:RUBY_DESCRIPTION, :RUBY_VERSION, :RUBY_RELEASE_DATE, :RUBY_PLATFORM,
#   :RUBY_PATCHLEVEL, :RUBY_REVISION, :RUBY_COPYRIGHT, :RUBY_ENGINE,
#   :RUBY_ENGINE_VERSION, :RUBYGEMS_ACTIVATION_MONITOR]

Array.instance_methods.grep(/gr/)
#=> [:grep, :grep_v, :group_by]
{% endhighlight %}
(The `Regexp#===` works with symbols just as it does with strings)

### #grep with a Range

`Range#===` checks the inclusion of Numeric values in the given range. This means that we can pass a range to grep to quickly filter values falling within the range.

{% highlight ruby %}
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

numbers.grep(3..5)
#=> [3, 4, 5]
{% endhighlight %}

### #grep with a class name Constant


{% highlight ruby %}
all_sorts_of_things = [1, 2, 'apple', 3, { foo: 4 }, 'banana', nil]

all_sorts_of_things.grep(Hash)
#=> [{:foo=>4}]

all_sorts_of_things.grep(String)
#=> ["apple", "banana"]

{% endhighlight %}

### #grep with any object
Since the `#===` method in Ruby is implemented on an `Object`, you can pass any descendant of this class to the `#grep` method.
In the `Object` class, the `#===` method behaves the same way as `#==`. It's up to descending class to implement (or not) a different meaning between the two.

{% highlight ruby %}
all_sorts_of_things = [1, 2, 'apple', 3, { foo: 4 }, 'banana', nil]

all_sorts_of_things.grep('apple')
#=> ['apple']

all_sorts_of_things.grep(3.0)
#=> [3]
{% endhighlight %}


## The opposite: #grep_v

Just like `#select` has an opposite `#reject` method, there is also a `#grep_v` method that behaves like you would imagine - it rejects the matched objects, similar to how this code would:

{% highlight ruby %}
string_collection.reject { |str| pattern === str }
{% endhighlight %}

Example usage:

{% highlight ruby %}
all_sorts_of_things = [1, 2, 'apple', 3, { foo: 4 }, 'banana', nil]

all_sorts_of_things.grep_v(Integer)
#=> ["apple", {:foo=>4}, "banana", nil]
{% endhighlight %}

## Passing a block

Both `#grep`, and `#grep_v` are utilizing a block if one is supplied. The block is used to transform the matched values before returning them in an array (just like chaining a `#map` after `#select` would). E.g.

{% highlight ruby %}
IO.constants.grep(/SEEK/) { |cons| IO.const_get(cons) }
#=> [1, 0, 3, 2, 4] # (values of IO::SEEK_CUR, IO::SEEK_SET, IO::SEEK_DATA, IO::SEEK_END, and IO::SEEK_HOLE)
{% endhighlight %}

The same operation without a #grep would probably look something like that:

{% highlight ruby %}
IO.constants.select { |cons| cons =~ /SEEK/ }.
             map { |cons| IO.const_get(cons) }
#=> [1, 0, 3, 2, 4]
{% endhighlight %}

## Summary

As you can see, the `#grep` method is pretty powerful! If you haven't already, add it to your developer's arsenal and see where it can help you in your work.

Are you using the `#grep` method in your project? Please share in the comments below!

And if your Ruby project suffers from slow build times, consider using [Knapsack Pro](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=understanding-and-using-rubys-grep-method) to improve the productivity and delivery times of your team!
