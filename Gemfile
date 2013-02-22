source 'http://rubygems.org'

gem 'rails', '3.0.19'

gem 'mysql2', '0.2.6'

# Bundle edge Rails instead:
# gem 'rails', :git => 'git://github.com/rails/rails.git'

#had an issue with arel auto updating and breaking code, so sticking to 2.0.9
gem 'arel', '2.0.10'

gem 'rake', '0.8.7'

gem "bcrypt-ruby", '3.0.1', :require => "bcrypt"

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

gem 'newrelic_rpm', '3.5.3.25'

gem "recaptcha", '0.3.4', :require => "recaptcha/rails"

#lock down on version of tzinfo gem
gem "tzinfo", "0.3.33"

#lock down pdf reader gem
gem "pdf-reader", "1.1.0"

#lock down mime types gem
gem "mime-types", "1.17.2"

#lock down blankslate gem
gem "blankslate", "2.1.2.4"

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
  gem 'annotate', "2.4.0"
  
  #gem 'rails-footnotes', :git => 'https://github.com/josevalim/rails-footnotes.git'
  
  gem "rspec-rails", "2.6.1"
  gem 'ruby-debug19'
  gem "mongrel", '1.2.0.pre2'
end

#this is only used in development to sync assets with s3
group :build_assets do
  gem 's3', '0.3.7'
end

group :heroku_staging, :heroku_production do
  gem "thin", "1.5.0"
end