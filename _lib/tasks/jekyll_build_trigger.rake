task :jekyll_build_trigger do
  jekyll_build_trigger_file = "#{ROOT_PATH}/.jekyll_build_trigger"
  cmd = "touch #{jekyll_build_trigger_file}"
  puts `#{cmd}`
  puts "Touched the #{jekyll_build_trigger_file} file to trigger a jekyll build."
end
