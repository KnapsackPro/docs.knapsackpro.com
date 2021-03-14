# docs.knapsackpro.com

Documentation for KnapsackPro.com

https://docs.knapsackpro.com

# How can I report a bug or improvement

If you found a bug in our API or you have just an idea how to improve it then please create issue here:

https://github.com/KnapsackPro/docs.knapsackpro.com/issues

# How to publish a new guest blog post

## What can I write about?

We welcome any blog post in categories:

* Category: [blog](https://docs.knapsackpro.com/)
  * anything about testing software or CI tips for Ruby, JavaScript, Python, PHP or any other programming language
  * any technical article about popular web or mobile frameworks
  * anything else in your mind? [Get in touch](https://knapsackpro.com/contact) and let's talk about your idea.
* Category: [techtips](https://docs.knapsackpro.com/tech_tips/)
  * this can be super short blog post like a few sentences and block of code that solves some problem or error you found and might be helpful for others.
  * tips how to do something useful on CI server
* Category: [continuous_integration](https://docs.knapsackpro.com/continuous_integration/)
  * articles about integration with various CI servers and Knapsack Pro

## How to publish guest blog post?

* Fork this repository and create a new branch for your blog post.

* You can copy example blog post file and read its content to find out how to create a new guest post on our blog.
  See [_posts/2099-01-31-example-article.md](https://raw.githubusercontent.com/KnapsackPro/docs.knapsackpro.com/gh-pages/_posts/2099-01-31-example-article.md)

* You can create thumbnail image for blog post with [Memopad app](https://www.tayasui.com/memopad/) which is free on iOS.
  Then you need to compress image with [TinyJPG](https://tinyjpg.com).
  Please ensure `img` tag in blog post has `alt` attribute.

* Please create a new blog post as a pull request to this repository.
  You can modify an existing pull request to [let repository maintainers make commits to your branch](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/allowing-changes-to-a-pull-request-branch-created-from-a-fork).
  Thanks to that we can make tweaks to your article and help with publication of it at the right time. :)

* Your blog post will be under [GNU Affero General Public License v3.0](LICENSE).

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
