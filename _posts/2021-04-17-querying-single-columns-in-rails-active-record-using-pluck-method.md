---
layout: post
title:  "Querying single columns in Rails Active Record using the #pluck method"
date:   2021-04-17 09:00:00 +0100
author: "Shadi Rezek"
categories: techtips ruby rails
og_image: ""
---

Have you heard of the [#pluck](https://api.rubyonrails.org/classes/ActiveRecord/Calculations.html#method-i-pluck){:target="_blank"} method from Rails' Active Record? Read on to see what it does and how it can be used to easily query single columns from your database!

## The use case

Sometimes when retrieving data from the database, we are only interested in certain attributes (e.g., just emails of all the users, instead of data residing in all columns of the `users` table).

The _naïve_ approach would be to load all the data into the memory and then `map` it so that only the subset of the data is left, e.g.:

{% highlight ruby %}
User.all.map(&:email)
# SELECT "users".* FROM "users"

#=> ["kate@example.com", "john@example.org", "janet@example.com"]
{% endhighlight %}

This is quite inefficient.

First of all, the SQL query is retrieving data from all columns from the table.
Secondly, the `ActiveRecrodCollection` object is created in the memory. Its members are initialized with all the data retrieved from the DB. The `map` at the end returns a regular Ruby `Array` object, making this intermediate step unnecessary.

Knowing we only really need to load the data from the `email` column, we could improve the above by chaining the Active Record's `#select` method:

{% highlight ruby %}
User.all.select(:email).map(&:email)
# SELECT "users"."email" FROM "users"

#=> ["kate@example.com", "john@example.org", "janet@example.com"]
{% endhighlight %}

The SQL query is limited to one column now, but the `ActiveRecord` objects are still being created in the intermediate step before `map`. Granted, they contain less data now (as the attributes we didn't `select` are omitted), but it's still quite unnecessary in this use case.

## Using the #pluck

The good news is, we can use `#pluck` instead to solve this issue. It's as simple as:

{% highlight ruby %}
User.pluck(:email)
# SELECT "users"."email" FROM "users"

#=> ["kate@example.com", "john@example.org", "janet@example.com"]
{% endhighlight %}

The SQL is still retrieving just the data we need. The data is then returned in the _Plain Old Ruby_ Array, and no `ActiveRecord` object is being created in between!

### Retrieving data from multiple columns

The `#pluck` method works with multiple DB columns, too. Just pass their names as arguments.

Instead of this:
{% highlight ruby %}
User.select(:id, :email).map { |user| [user.id, user.email] }
# SELECT "users"."id", "users"."email" FROM "users"

#=> [[1, "kate@example.com"], [4, "john@example.org"], [5, "janet@example.com"]]
{% endhighlight %}

Just do this:
{% highlight ruby %}
User.pluck(:id, :email)
# SELECT "users"."id", "users"."email" FROM "users"

#=> [[1, "kate@example.com"], [4, "john@example.org"], [5, "janet@example.com"]]
{% endhighlight %}

## Summary

When querying the database, it's important to be mindful about what data we retrieve and what is being done with it. The `#pluck` method both keeps the SQL query to the minimum and avoids the ActiveRecord object creation overhead when it's not needed in a given scenario.

Have you used the `#pluck` method in your project? Please share in the comments.

And if your project could benefit from faster CI builds, consider using [Knapsack Pro](https://knapsackpro.com/?utm_source=docs_knapsackpro&utm_medium=blog_post&utm_campaign=querying-single-columns-in-rails-active-record-using-pluck-method) to achieve that!
