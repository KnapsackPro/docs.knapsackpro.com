def system!(*args)
  system(*args) || abort("\n== Command #{args} failed ==")
end

Jekyll::Hooks.register :site, :post_write do |page|
  Dir.chdir("docusaurus") do
    system!("npm run build")
  end
  system!("cp -R docusaurus/build/img _site")
  system!("cp -R docusaurus/build/assets _site")
  system!("mkdir -p _site/docs/intro")
  system!("cp docusaurus/build/docs/intro/index.html _site/docs/intro")
end
