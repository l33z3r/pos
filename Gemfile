source 'http://rubygems.org'

gem 'rails', '3.0.5'

# Bundle edge Rails instead:
# gem 'rails', :git => 'git://github.com/rails/rails.git'

#had an issue with arel auto updating and breaking code, so sticking to 2.0.9
gem 'arel', '2.0.9'

gem 'rake', '0.8.7'

gem 'populator'
gem 'faker'
  
gem "will_paginate", "3.0.pre2"
gem "meta_search", "1.0.5"

gem 'lazy_high_charts', '1.1.5'

gem 'aws-s3', '0.6.2'

#smurf for minifying js and css
gem 'smurf', '1.0.8'

# for building json
gem 'jbuilder', '0.3.2'

gem 'prawn', '0.12.0'
gem 'prawnto' , '0.1.1'

#lock down on version of tzinfo gem
gem "tzinfo", "0.3.33"

# Use unicorn as the web server
# gem 'unicorn'

# Deploy with Capistrano
# gem 'capistrano'

# To use debugger (ruby-debug for Ruby 1.8.7+, ruby-debug19 for Ruby 1.9.2+)
# gem 'ruby-debug'

# Bundle the extra gems:
# gem 'bj'
# gem 'nokogiri'
# gem 'sqlite3-ruby', :require => 'sqlite3'

# Bundle gems for the local environment. Make sure to
# put test-only gems in this group so their generators
# and rake tasks are available in development mode:
group :development, :test do
  gem 'annotate'
  
  #gem 'rails-footnotes', :git => 'https://github.com/josevalim/rails-footnotes.git'
  
  gem "rspec-rails", "2.6.1"
  gem 'ruby-debug19'
  gem "mongrel", '1.2.0.pre2'
  
  gem 'mysql2', '0.2.6'
end

group :production do
  gem 'mysql2', '0.2.6'
end