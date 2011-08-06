require 'paperclip'

#path to paperclip tools, required on fergus pos linux box
if Rails.env == "production"
  #ferg linux and pos stick
  Paperclip.options[:command_path] = "/usr/local/bin"
  
  #heroku
#  Paperclip.options[:command_path] = "/usr/bin"
end 

Paperclip.options[:swallow_stderr] = false