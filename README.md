# docs.knapsackpro.com

Documentation for KnapsackPro.com

https://docs.knapsackpro.com

# How can I report a bug or improvement

If you found a bug in our API or you have just an idea how to improve it then please create issue here:

https://github.com/KnapsackPro/docs.knapsackpro.com/issues

# How to publish a new blog post

You can copy example blog post file and read it content to find out how to create a new guest post on our blog.

See [_posts/2099-01-31-example-article.md](_posts/2099-01-31-example-article.md)

# Development of blog

    $ bundle install

Show post with future publish date.

    $ bundle exec jekyll serve --watch --future

Now you can preview blog at [http://localhost:4000/](http://localhost:4000/2099/example-article)

# Development of Knapsack Pro API docs

## Dependencies

* https://nodejs.org

Run to install dependencies:

    $ npm install

We are using Raml, you can learn more here:

* http://raml.org/
* https://github.com/kevinrenskers/raml2html

## Generate API docs

Raml files with docs are in `_api` directory.

Run to compile them:

    $ bundle exec rake api:generate_docs

Compiled files are in `api` directory. Please commit them into repository.

## Guard

You can run guard to recompile raml files whenever they change.

    $ guard
