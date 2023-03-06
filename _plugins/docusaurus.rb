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

  system!("mkdir -p _site/knapsack_pro-ruby/guide")
  system!("cp docusaurus/build/knapsack_pro-ruby/guide/index.html _site/knapsack_pro-ruby/guide")

  system!("mkdir -p _site/cypress/guide")
  system!("cp docusaurus/build/cypress/guide/index.html _site/cypress/guide")

  system!("mkdir -p _site/cypress/reference")
  system!("cp docusaurus/build/cypress/reference/index.html _site/cypress/reference")

  system!("mkdir -p _site/cypress/cookbook")
  system!("cp docusaurus/build/cypress/cookbook/index.html _site/cypress/cookbook")

  system!("mkdir -p _site/cypress/troubleshooting")
  system!("cp docusaurus/build/cypress/troubleshooting/index.html _site/cypress/troubleshooting")

  system!("mkdir -p _site/jest/guide")
  system!("cp docusaurus/build/jest/guide/index.html _site/jest/guide")

  system!("mkdir -p _site/jest/reference")
  system!("cp docusaurus/build/jest/reference/index.html _site/jest/reference")

  system!("mkdir -p _site/jest/cookbook")
  system!("cp docusaurus/build/jest/cookbook/index.html _site/jest/cookbook")

  system!("mkdir -p _site/jest/troubleshooting")
  system!("cp docusaurus/build/jest/troubleshooting/index.html _site/jest/troubleshooting")

  system!("mkdir -p _site/integration")
  system!("cp docusaurus/build/integration/index.html _site/integration") # redirect to /
  system!("cp docusaurus/build/index.html _site")

  system!("mkdir -p _site/overview")
  system!("cp docusaurus/build/overview/index.html _site/overview")

  system!("mkdir -p _site/ruby")
  [
    "capybara",
    "circleci",
    "code-climate",
    "cookbook",
    "cucumber",
    "encryption",
    "heroku",
    "hooks",
    "parallel_tests",
    "puffing-billy",
    "queue-mode",
    "reference",
    "rspec",
    "simplecov",
    "split-by-test-examples",
    "spring",
    "troubleshooting",
  ].each do |directory|
    system!("cp -R docusaurus/build/ruby/#{directory} _site/ruby")
  end

  system!("mv _site/sitemap.xml _site/jekyll-sitemap.xml")
  system!("cp docusaurus/build/sitemap.xml _site/docusaurus-sitemap.xml")

  File.open("_site/sitemap.xml", "w") do |file|
    file.write <<~HEREDOC
    <?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <sitemap>
        <loc>https://docs.knapsackpro.com/jekyll-sitemap.xml</loc>
      </sitemap>
      <sitemap>
        <loc>https://docs.knapsackpro.com/docusaurus-sitemap.xml</loc>
      </sitemap>
    </sitemapindex>
    HEREDOC
  end
end
