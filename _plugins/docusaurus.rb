def system!(*args)
  system(*args) || abort("\n== Command #{args} failed ==")
end

Jekyll::Hooks.register :site, :post_write do |page|
  Dir.chdir("docusaurus") do
    system!("npm install")
    system!("npm run build")
  end
  system!("cp -R docusaurus/build/img _site")
  system!("cp -R docusaurus/build/assets _site")
  system!("cp docusaurus/build/knapsack_pro-ruby/guide/index.html _site/knapsack_pro-ruby/guide")

  system!("mkdir -p _site/cypress/guide")
  system!("cp docusaurus/build/cypress/guide/index.html _site/cypress/guide")

  system!("mkdir -p _site/jest/guide")
  system!("cp docusaurus/build/jest/guide/index.html _site/jest/guide")
end
