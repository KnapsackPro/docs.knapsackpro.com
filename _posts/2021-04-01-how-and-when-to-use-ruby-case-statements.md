---
layout: post
title:  "How and when to use Ruby case statements"
date:   2021-04-01 12:00:00 +0100
author: "Shadi Rezek"
categories: techtips ruby
og_image: ""
---

Using the `case` expression in Ruby is a great way to write conditionals in a clear, and succinct way.
Despite that, it's not hard to encounter convoluted `if` constructs in places where refactoring to the `case` statement would result in huge improvements. Let's learn more about the `case` expression and when it's best to use it.

## Expressing logic simply

Consider this piece of code:

{% highlight ruby %}
number = 6

if number > 0 && number <= 3
  'low value'
elsif number > 3 && number <= 7
  'medium value'
elsif number > 7 && number <= 10
  ' high value'
else
  'invalid value'
end
{% endhighlight %}


It seems like quite a complicated way to express a pretty straightforward logic, doesn't it? Still, I bet that you have seen a construct like that many times. I know I have.

This logic could be greatly simplified with the `case` expression:


{% highlight ruby %}
case number
when (0..3)
  'low value'
when (4..7)
  'medium value'
when (8..10)
  'high value'
else
  'invalid value'
end
{% endhighlight %}

We could also use the `then` keyword to make this even more succinct:

{% highlight ruby %}
case number
when (0..3)  then 'low value'
when (4..7)  then 'medium value'
when (8..10) then 'high value'
else              'invalid value'
end
{% endhighlight %}

This code effectively works like:

{% highlight ruby %}
if (0..3) === number
  'low value'
elsif (4..7) === number
  'medium value'
elsif (8..10) === number
  'high value'
else
  'invalid value'
end
{% endhighlight %}

As you can see, the `case` statements are most powerful when our logic is concerned with a value of a single object (the `number` in the above examples), which is provided next to the `case` keyword.
What comes after each `when` acts as a pattern. It doesn't have to be a Range necessarily - this would work with any object.
Similar to [how the #grep method behaves](/2021/understanding-and-using-rubys-powerful-grep-method), the `case` expression results in invoking the `#===` method on the given patterns.
In fact, the `#===` method in Ruby is often called the "case equality", as it's mostly known for being used in case statements.

You can consult the Ruby documentation and look into how the `#===` method is implement in various classes. On the `Object` class, it works the same as the regular equality method, the `#==`. It's then up to descending classes to implement their own interpretation of the "case equality".

## Patterns in the case statements

Let's look at some examples of objects being used as patterns in the case statements.

The case statement with integers as patterns:

{% highlight ruby %}
case number
when 0 then false
when 1 then true
end
{% endhighlight %}

With strings:

{% highlight ruby %}
case answer
when 'Y' then true
when 'N' then false
end
{% endhighlight %}

And with regexes:

{% highlight ruby %}
case string
when (/^a/) then 'starts with an A'
when (/^z/) then 'starts with a Z'
end
{% endhighlight %}

You can of course mix the types of patterns within one statement:

{% highlight ruby %}
case number
when 0       then 'zero'
when (1..3)  then 'low value'
when (4..7)  then 'medium value'
when (8..10) then 'high value'
end
{% endhighlight %}

One last tip. You can provide multiple patterns for each `when`. This would effectively mimic the logical `||` operator, with each pattern beig compared against.
To illustrate this, let's expand on a previous example:

{% highlight ruby %}
case answer.downcase
when 'y', 'yes' then true
when 'n', 'no' then false
end
{% endhighlight %}

Under the hood, this works just like:

{% highlight ruby %}
if 'y' === answer.downcase  || 'yes' === answer.downcase
  true
elsif 'n' === answer.downcase || 'no' === answer.downcase
  false
end
{% endhighlight %}

## Summary

I hope that you find this quick recap of the `case` expression useful. How often are you using case statements in your projects? Please share in the comments.

If your Ruby project suffers from slow CI build times, consider using [Knapsack Pro](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=how-and-when-to-use-ruby-case-statements) to improve the productivity of your team.
