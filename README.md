# docs.knapsackpro.com

Documentation for KnapsackPro.com

https://docs.knapsackpro.com

# How can I report a bug or improvement

If you found a bug in our API or you have just an idea of how to improve it then please create an issue here:

https://github.com/KnapsackPro/docs.knapsackpro.com/issues

# How to publish a new guest blog post

## What can I write about?

We welcome any blog post in the following categories:

- Category: [Blog](https://docs.knapsackpro.com/)
  - anything about testing software or CI tips for Ruby, JavaScript, Python, PHP or any other programming language
  - any technical article about popular web or mobile frameworks
  - anything else in your mind? [Get in touch](https://knapsackpro.com/contact) and let's talk about your idea.
- Category: [TechTips](https://docs.knapsackpro.com/tech_tips/)
  - this can be a super short blog post like a few sentences and a block of code that solves some problem or error you found and might be helpful for others.
    tips on how to do something useful on the CI server
- Category: [continuous_integration](https://docs.knapsackpro.com/continuous_integration/)
  - articles about integration with various CI servers and Knapsack Pro

## How to publish a guest blog post?

- Fork this repository and create a new branch for your blog post.

- You can copy an example blog post file and read its content to find out how to create a new guest post on our blog.
  See [\_posts/2099-01-31-example-article.md](https://raw.githubusercontent.com/KnapsackPro/docs.knapsackpro.com/gh-pages/_posts/2099-01-31-example-article.md)

- You can create a thumbnail image for a blog post with the [Memopad app](https://www.tayasui.com/memopad/) which is free on iOS.
  Then you need to compress the image with [TinyJPG](https://tinyjpg.com)](https://tinyjpg.com).
  Please ensure `img` tags in the blog post have the `alt` attribute.

- Please create a new blog post as a pull request to this repository.
  You can modify an existing pull request to [let repository maintainers make commits to your branch](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/allowing-changes-to-a-pull-request-branch-created-from-a-fork).
  Thanks to that we can make tweaks to your article and help with the publication. :)

- Your blog post will be under [MIT license](LICENSE).

# Development

## Intro

* Blog: We use Jekyll for blog posts.
* API docs: We use `raml2html` npm package to compile RAML files into HTML files for API docs.
* Docs: We use Docusaurus for new documentation.

## Install dependencies

Install node packages like `raml2html` which is needed to compile API docs.

```bash
npm install
```

Install Ruby gems (needed for Jekyll).

```bash
bundle config build.eventmachine --with-cppflags=-I$(brew --prefix openssl@1.1)/include
bundle install
```

We are moving incrementally from Jekyll to Docusaurus. Please install Docusaurus dependencies.

```bash
cd docusaurus
npm install
```

## How to build everything (Jekyll, Docusaurus, API docs)

```bash
bundle exec jekyll serve --watch --future
```

It shows a blog post with a future publish date.
Now you can preview the blog at [http://localhost:4000/](http://localhost:4000/2099/example-article).

## How to build Docusaurus only

```bash
cd docusaurus
npm start
```

## How to build API docs only

[Raml](http://raml.org/) files for API docs are in the `_api` directory. You can edit them.

We use [raml2html](https://github.com/kevinrenskers/raml2html) to compile them.
If you need to compile API docs manually, you can run the rake task:

```bash
bundle exec rake api:generate_docs
```

Compiled files are in the `api` directory.

## Deployment

Push to `main` to have a GitHub Action:

- build Jekyll, Docusaurus ([`_plugins/docusaurus.rb`](./_plugins/docusaurus.rb)) and API docs ([`_plugins/raml2html.rb`](./_plugins/raml2html.rb))
- publish the built files to the `gh-pages` branch
- deploy to GitHub pages
