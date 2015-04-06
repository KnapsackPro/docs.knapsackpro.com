# docs.knapsackpro.com

Documentation for KnapsackPro.com

http://docs.knapsackpro.com

# Development

    $ bundle install
    $ bundle exec jekyll serve --watch

## Dependencies

`npm i -g raml2html`

https://github.com/kevinrenskers/raml2html

## Generate API docs

Raml files with docs are in `_api` directory.

Run to compile them:

    $ bundle exec rake api:generate_docs

You can watch changes with:

    $ watch -n 1 bundle exec rake api:generate_docs

Compiled files are in `api` directory. Please commit them into repository.
