---
pagination_next: null
pagination_prev: null
toc_max_heading_level: 2
---

# Reference

## `KNAPSACK_PRO_LOG_LEVEL`

Default: `debug`

Available: `debug` | `info` | `warn` | `error` | `fatal`

Recommended: `debug` when debugging issues, `info` to know what Knapsack Pro is doing

### Related FAQs

- [How can I change log level?](https://knapsackpro.com/faq/question/how-can-i-change-log-level)

## `KNAPSACK_PRO_LOG_DIR`

Default: `stdout`

Available: `stdout` | directory

When `KNAPSACK_PRO_LOG_DIR=log`, Knapsack Pro will write logs to the `log` directory and append the CI node index to the name. For example:

- `log/knapsack_pro_node_0.log`
- `log/knapsack_pro_node_1.log`

### Related FAQs

- [How to write `knapsack_pro` logs to a file?](https://knapsackpro.com/faq/question/how-to-write-knapsack_pro-logs-to-a-file)
