---
pagination_next: null
pagination_prev: null
---

# Troubleshooting

## JavaScript heap out of memory

You can increase the memory available to Node with [`--max_old_space_size`](https://nodejs.org/api/cli.html#--max-old-space-sizesize-in-megabytes):

```bash
export NODE_OPTIONS=--max_old_space_size=4096

$(npm bin)/knapsack-pro-jest

$(npm bin)/knapsack-pro-cypress
```

## Related FAQs

- [JavaScript heap out of memory - how to increase the max memory for Node with `max_old_space_size`](https://knapsackpro.com/faq/question/javascript-heap-out-of-memory-how-to-increase-the-max-memory-for-node-with-max_old_space_size)
