---
layout: post
title:  "Using Ruby's Object#method"
date:   2021-04-23 12:00:00 +0100
author: "Shadi Rezek"
categories: techtips ruby
og_image: ""
---
`Object#method` is a little-known, yet very interesting Ruby method. Let's see how it works and how you can use it in your code.

## The basics

Let's imagine we have some Ruby class, e.g.

{% highlight ruby %}
class Animal
  def speak(sound)
    puts "I say #{sound}!"
  end
end
{% endhighlight %}

Calling the `#method` on the instance of this class, would return a [Method](https://ruby-doc.org/core-3.0.1/Method.html){:target="_blank"} object. This `Method` object acts as a closure in the context of the associated object.

{% highlight ruby %}
animal = Animal.new
met = animal.method(:speak)

met.class
#=> Method
met.inspect
=> "#<Method: Animal#speak(sound)>"

met.call # we forget to pass the argument
#=> ArgumentError (wrong number of arguments (given 0, expected 1))
met.call('meow')
# I say meow!
# => nil
{% endhighlight %}

One thing that's interesting in `Method` objects, is the fact they implement the `#to_proc` method. To see how this could be useful, let's first remind ourselves of a widely-used Ruby shortcut.

## The ampersand operator

Consider this common Ruby shortcut:

{% highlight ruby %}
[1, 2, 3, 4, 5, 6].select { |num| num.even? }
#=> [2, 4, 6]

# commonly simplified with:

[1, 2, 3, 4, 5, 6].select(&:even?)
#=> [2, 4, 6]
{% endhighlight %}

The reason this works is two-fold. First, there is the `&` (ampersand) operator. When used at the beginning of a method argument, it transforms its operant into a `Proc` object (by calling `#to_proc` on it), and passes it to the method as if it was a block. Secondly, the `Symbol` class implements `#to_proc`. Because of the way it's implemented, it effectively allows us to `send` a given symbol to the provided argument. See `Symbol#to_proc` in action below:

{% highlight ruby %}
is_even = :even?.to_proc

is_even.call(1)
#=> false
is_even.call(2)
#=> true
{% endhighlight %}

This proc could also be passed to the `#select` method from the previous example. We still need to use the ampersand operator (so that Ruby knows to treat it like a block).

{% highlight ruby %}
[1, 2, 3, 4, 5, 6].select(&is_even)
#=> [2, 4, 6]
{% endhighlight %}

### Ampersand with the Method object

Given the fact that the Method object implements the `#to_proc` method as well, we can use it much the same way as we did the symbol. Let's circle back to our previous example to see this in action.

{% highlight ruby %}
class Animal
  def speak(sound)
    puts "I say #{sound}!"
  end
end

met = Animal.new.method(:speak)
animal_sounds = ['meow', 'woof', 'moo', 'oink', 'hee-haw']

animal_sounds.each(&met)
# I say meow!
# I say woof!
# I say moo!
# I say oink!
# I say hee-haw!
# => ["meow", "woof", "moo", "oink", "hee-haw"]
{% endhighlight %}

## So when is this useful?

One reason I used `#method` combined with the ampersand operator in the past was to get rid of repetitive, one-dimensional blocks. This is especially valuable, when you are chaining multiple methods together. Let's say we have multiple filters with the same interface (all returning `true` or `false`) that we want to use on a collection:

{% highlight ruby %}
class AboveMinThresholdChecker
  MIN_THRESHOLD = 200

  def self.call(number)
    new.call(number)
  end

  def call(number)
    number > MIN_THRESHOLD
  end
end

class BelowMaxThresholdChecker
  # ...
end

class PrimeNumberChecker
  # ...
end
{% endhighlight %}

Using explicit blocks, we would then do something like:

{% highlight ruby %}
numbers = (1..400).to_a

numbers.select { |num| AboveMinThresholdChecker.call(num) }.
        select { |num| BelowMaxThresholdChecker.call(num) }.
        select { |num| PrimeNumberChecker.call(num) }
{% endhighlight %}

With our new knowledge, we can simplify the above in the following way using the `#method`:

{% highlight ruby %}
numbers.select(&AboveMinThresholdChecker.method(:call)).
        select(&BelowMaxThresholdChecker.method(:call)).
        select(&PrimeNumberChecker.method(:call))
{% endhighlight %}

## Summary

Have you used `#method` in Ruby before? Can you think of other interesting situations it could prove handy? Please share in the comments below!

If your project suffers from long CI builds you can address this with [Knapsack Pro](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=using-ruby-object-method). Be the hero in your team by streamlining your CI process and [improving the developer productivity](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=using-ruby-object-method)!
