---
pagination_next: null
pagination_prev: null
---

# Use Knapsack Pro in Queue Mode with `puffing-billy`

:::caution
This is needed only if you are using Knapsack Pro in [Queue Mode](https://github.com/KnapsackPro/knapsack_pro-ruby#queue-mode).
:::

If you use the [puffing-billy](https://github.com/oesmith/puffing-billy) gem and encounter the crash described in this [Github issue](https://github.com/oesmith/puffing-billy/issues/253), apply the following patch:

```ruby
# rails_helper.rb or spec_helper.rb

# A patch to `puffing-billy`'s proxy so that it doesn't try to stop eventmachine's reactor if it's not running.
module BillyProxyPatch
  def stop
    return unless EM.reactor_running?
    super
  end
end
Billy::Proxy.prepend(BillyProxyPatch)

# A patch to `puffing-billy` to start EM if it has been stopped.
Billy.module_eval do
  def self.proxy
    if @billy_proxy.nil? || !(EventMachine.reactor_running? && EventMachine.reactor_thread.alive?)
      proxy = Billy::Proxy.new
      proxy.start
      @billy_proxy = proxy
    else
      @billy_proxy
    end
  end
end

if ENV["KNAPSACK_PRO_TEST_SUITE_TOKEN_RSPEC"]
  KnapsackPro::Hooks::Queue.before_queue do
    Billy.proxy.start
  end

  KnapsackPro::Hooks::Queue.after_queue do
    Billy.proxy.stop
  end
end
```

This problem is caused by how [`knapsack_pro` in Queue Mode uses](https://knapsackpro.com/faq/question/why-when-i-use-queue-mode-for-rspec-then-my-tests-fail) `RSpec::Core::Runner`.

## Related FAQs

- [How to configure puffing-billy gem with Knapsack Pro Queue Mode?](https://knapsackpro.com/faq/question/how-to-configure-puffing-billy-gem-with-knapsack-pro-queue-mode)
