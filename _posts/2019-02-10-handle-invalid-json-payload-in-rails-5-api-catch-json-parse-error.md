---
layout: post
title:  "Handle invalid JSON payload in Rails 5+ API. Catch JSON parse error"
date:   2019-02-10 12:00:00 +0100
author: "Artur Trzop"
categories: techtips Ruby Rails API JSON
---

When someone post invalid JSON payload to your Ruby on Rails URL endpoint then Rails crashes with 500 error.
We could render nice message instead of the error. For instance if you have public API you may want to show reason of the error to explain to your API client why the request failed.

We can catch `ActionDispatch::Http::Parameters::ParseError` in `ApplicationController`. If you want to just catch this exception only for your API endpoints exposed by Rails then put the below code in proper API base controller.

{% highlight ruby %}
module API
  class BaseController < ActionController::Base
    # TODO remove this when a new version of Rails > 5.2.2 will be released
    # https://github.com/rails/rails/issues/34244#issuecomment-433365579
    def process_action(*args)
      super
    rescue ActionDispatch::Http::Parameters::ParseError => exception
      render status: 400, json: { errors: [ exception.message ] }
    end

    # This will work for Rails > 5.2.2
    # https://github.com/rails/rails/pull/34341#issuecomment-434727301
    rescue_from ActionDispatch::Http::Parameters::ParseError do |exception|
      render status: 400, json: { errors: [ exception.cause.message ] }
    end
  end
end
{% endhighlight %}

Above tip works for Rails 5+. Hope you will find this useful. If you want to learn more how to faster test your API and Rails application then check out <a href="/">blog</a> and website about <a href="https://knapsackpro.com?utm_source=docs_knapsackpro&utm_medium=tech_tips&utm_campaign=handle-invalid-json-payload-in-rails-5-api-catch-json-parse-error">knapsack_pro gem for CI parallelisation</a>.
