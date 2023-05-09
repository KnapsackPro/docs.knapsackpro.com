You need to install the [`rspec_junit_formatter`](https://github.com/sj26/rspec_junit_formatter) gem.

Format stdout with the `documentation` formatter and file output with the `RspecJunitFormatter` formatter:

```bash
bundle exec rake "knapsack_pro:rspec[--format documentation --format RspecJunitFormatter --out tmp/rspec.xml]"
```
