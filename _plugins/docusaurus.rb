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

  system!("mkdir -p _site/integration")
  system!("cp docusaurus/build/integration/index.html _site/integration") # redirect to /
  system!("cp docusaurus/build/index.html _site")

  system!("mkdir -p _site/overview")
  system!("cp docusaurus/build/overview/index.html _site/overview")

  system!("mkdir -p _site/ruby")
  [
    "code-climate.md",
    "hooks.md",
    "parallel_tests.md",
    "puffing-billy.md",
    "reference.md",
    "simplecov.md",
    "spring.md",
  ].each do |filename|
    system!("cp docusaurus/build/ruby/#{filename} _site/ruby")
  end
end
