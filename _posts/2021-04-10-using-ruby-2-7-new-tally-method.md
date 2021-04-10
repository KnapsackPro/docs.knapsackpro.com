---
layout: post
title:  "Using Ruby's 2.7 new #tally method"
date:   2021-04-10 09:00:00 +0100
author: "Shadi Rezek"
categories: techtips ruby
og_image: ""
---

Ruby 2.7 introduced the `Enumberable#tally` method. It allows to easily count elements' occurrences in a given collection. In other words, it literally _tallies them up_. :)


## The use case

Say we have a collection of words, and we'd like to count the occurrences of each word within it.

{% highlight ruby %}
words = %w(the be to of and a in that have I it for not on with he as you do at
           the not for it be we her so up and a to for on with)
# some of the most common English words based on https://en.wikipedia.org/wiki/Most_common_words_in_English
{% endhighlight %}


### Pre Ruby 2.7

In previous versions of Ruby, whenever we encountered a logic counting occurrences of collection elements (here: words in the array), we would most likely encounter a code similar to:

{% highlight ruby %}
word_counts = {}
words.each do |word|
  if word_counts[word]
    word_counts[word] += 1
  else
    word_counts[word] = 1
  end
end

word_counts
# => {"the"=>2, "be"=>2, "to"=>2, "of"=>1, "and"=>2, "a"=>2, "in"=>1, "that"=>1, "have"=>1, "I"=>1, "it"=>2, "for"=>3, "not"=>2, "on"=>2, "with"=>2, "he"=>1, "as"=>1, "you"=>1, "do"=>1, "at"=>1, "we"=>1, "her"=>1, "so"=>1, "up"=>1}
{% endhighlight %}

This could be simplified by initializing the Hash with a default value of `0` (which makes total sense in this case):

{% highlight ruby %}
word_counts = Hash.new(0)
words.each { |word| word_counts[word] += 1 }

word_counts
# => {"the"=>2, "be"=>2, "to"=>2, "of"=>1, "and"=>2, "a"=>2, "in"=>1, "that"=>1, "have"=>1, "I"=>1, "it"=>2, "for"=>3, "not"=>2, "on"=>2, "with"=>2, "he"=>1, "as"=>1, "you"=>1, "do"=>1, "at"=>1, "we"=>1, "her"=>1, "so"=>1, "up"=>1}
{% endhighlight %}

We could even transform it further to a one-liner using `#each_with_object`:

{% highlight ruby %}
words.each_with_object(Hash.new(0)) { |word, word_counts| word_counts[word] += 1 }
# => {"the"=>2, "be"=>2, "to"=>2, "of"=>1, "and"=>2, "a"=>2, "in"=>1, "that"=>1, "have"=>1, "I"=>1, "it"=>2, "for"=>3, "not"=>2, "on"=>2, "with"=>2, "he"=>1, "as"=>1, "you"=>1, "do"=>1, "at"=>1, "we"=>1, "her"=>1, "so"=>1, "up"=>1}
{% endhighlight %}

I personally like the second solution the most. I think it strikes the best balance between simplicity and ease of understanding.

As we can see, all of the above approaches rely on iterating through the collection to tally up its members.

There is also another approach that could be chosen: relying on `Enumerable#group_by`. If I were to use this one, the code I would write would probably look something like this:

{% highlight ruby %}
words.group_by(&:itself). # this produces a structure like: {"the"=>["the", "the"], "be"=>["be", "be"], ... }
      map { |word, occurrences| [word, occurrences.count] }.
      to_h
# => {"the"=>2, "be"=>2, "to"=>2, "of"=>1, "and"=>2, "a"=>2, "in"=>1, "that"=>1, "have"=>1, "I"=>1, "it"=>2, "for"=>3, "not"=>2, "on"=>2, "with"=>2, "he"=>1, "as"=>1, "you"=>1, "do"=>1, "at"=>1, "we"=>1, "her"=>1, "so"=>1, "up"=>1}
{% endhighlight %}

### The new way

Since Ruby 2.7, we could get the same result (a Hash containing numbers of occurrences of each element) by simply invoking the `#tally` method on the collection.

{% highlight ruby %}
words.tally
# => {"the"=>2, "be"=>2, "to"=>2, "of"=>1, "and"=>2, "a"=>2, "in"=>1, "that"=>1, "have"=>1, "I"=>1, "it"=>2, "for"=>3, "not"=>2, "on"=>2, "with"=>2, "he"=>1, "as"=>1, "you"=>1, "do"=>1, "at"=>1, "we"=>1, "her"=>1, "so"=>1, "up"=>1}
{% endhighlight %}

It's not only a nice shortcut, it also expresses the intent in a clear way - something many of us love in Ruby code.


## Summary

Have you had a chance to use the `Enumerable#tally` method in your production code yet? Please share in the comments below!

Do you use continuous integration in your Ruby project? Consider using [Knapsack Pro](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=using-ruby-2-7-new-tally-method) to increase your team's productivity by shortening build times on your CI server!
