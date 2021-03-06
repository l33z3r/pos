Pos::Application.configure do
  # Settings specified here will take precedence over those in config/application.rb

  # In the development environment your application's code is reloaded on
  # every request.  This slows down response time but is perfect for development
  # since you don't have to restart the webserver when you make code changes.
  config.cache_classes = false
  
  # Log error messages when you accidentally call methods on nil.
  config.whiny_nils = true

  #rotate every 20 megabytes
  config.logger = Logger.new(Rails.root.join("log", Rails.env + ".log"), 10, 20 * 1024 * 1024)
  config.logger.level = Logger::DEBUG
  
  # Show full error reports and disable caching
  config.consider_all_requests_local       = true
  config.action_view.debug_rjs             = true
  
  #turn this on for some fragment caching testing in development mode
  config.action_controller.perform_caching = false
  
  # Don't care if the mailer can't send
  config.action_mailer.raise_delivery_errors = false

  # Print deprecation notices to the Rails logger
  config.active_support.deprecation = :log

  # Only use best-standards-support built into browsers
  config.action_dispatch.best_standards_support = :builtin
  
  #enable this for html5 caching
  #ENV["RAILS_ASSET_ID"] = ""
end

