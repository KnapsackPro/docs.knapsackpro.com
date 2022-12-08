guard 'rake', task: 'api:generate_docs' do
  watch(%r{^_api/.+\.raml$})
end

guard 'rake', task: 'jekyll_build_trigger' do
  ignore /docusaurus\/\.docusaurus/
  ignore /docusaurus\/build/
  ignore /docusaurus\/node_modules/

  watch(%r{^docusaurus/docs/.+$})
  watch(%r{^docusaurus/src/.+$})
  watch(%r{^docusaurus/static/.+$})
  watch(%r{^docusaurus/.+\.js$})
end
