def system!(*args)
  system(*args) || abort("\n== Command #{args} failed ==")
end

Jekyll::Hooks.register :site, :post_write do |page|
  system!("bundle exec rake api:generate_docs")
end
