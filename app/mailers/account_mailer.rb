class AccountMailer < ActionMailer::Base
  MAILER_FROM_ADDRESS = "noreply@clueypos.com"

  def signup_notification cluey_account
    @subject        = "Activate Your Clueypos Account!"
    @body['cluey_account']   = cluey_account
    @from           = MAILER_FROM_ADDRESS
    @recipients     = cluey_account.email
    content_type "text/html"
  end
  
  def forgot_password(email, name, login, password)
    @subject        = "Password reset from Clueypos Account!"
    @body['user']   = [email, name, login, password]
    @from           = MAILER_FROM_ADDRESS
    @recipients     = email  
    content_type "text/html"
  end
  
end
