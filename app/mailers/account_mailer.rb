class AccountMailer < ActionMailer::Base
  MAILER_FROM_ADDRESS = "support@#{APP_DOMAIN}"

  def welcome cluey_account
    @subject        = "Welcome to Cluey!"
    @body['cluey_account']   = cluey_account
    @from           = MAILER_FROM_ADDRESS
    @recipients     = cluey_account.email
    @host = "#{cluey_account.name}-#{default_url_options[:host]}"
    content_type "text/html"
  end
  
  def signup_notification cluey_account
    @subject        = "Activate Your Cluey Account!"
    @body['cluey_account']   = cluey_account
    @from           = MAILER_FROM_ADDRESS
    @recipients     = cluey_account.email
    @host = "#{cluey_account.name}-#{default_url_options[:host]}"
    content_type "text/html"
  end
  
  def password_reset cluey_account
    @subject        = "Password reset request for your Cluey Account!"
    @body['cluey_account']   = cluey_account
    @from           = MAILER_FROM_ADDRESS
    @recipients     = cluey_account.email
    @host = "#{cluey_account.name}-#{default_url_options[:host]}"
    content_type "text/html"
  end
  
end
