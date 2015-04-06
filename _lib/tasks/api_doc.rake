namespace :api do
  task :generate_docs do
    raml2html = 'node_modules/raml2html/lib/raml2html.js'

    raml_files = [
      {
        src: '_api/v1/doc.raml',
        dest: 'api/v1/index.html'
      }
    ]

    raml_files.each do |file|
      raml_file = "#{ROOT_PATH}/#{file[:src]}"
      html_file = "#{ROOT_PATH}/#{file[:dest]}"

      cmd = %Q[#{raml2html} #{raml_file} > #{html_file}]
      puts `#{cmd}`
      puts "Done for #{file[:src]} and generated file #{file[:dest]}"
    end

    puts 'Finished!'
  end
end
