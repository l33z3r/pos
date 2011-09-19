require 'paperclip'

#path to paperclip tools, required on fergus pos linux box
if Rails.env == "production"
  Paperclip.options[:command_path] = "/usr/local/bin"
  #Paperclip.options[:command_path] = "/usr/bin"
end 

if Rails.env == "production_heroku"
  Paperclip.options[:command_path] = "/usr/bin"
end

Paperclip.options[:swallow_stderr] = false