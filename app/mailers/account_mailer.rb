class AccountMailer < ActionMailer::Base
  default :from => "noreply@clueypos.com"

  def signup_notification cluey_account
    @subject        = "Activate Your Clueypos Account!"
    @body['cluey_account']   = cluey_account
    @recipients     = cluey_account.email
    content_type "text/html"
  end
  
  def forgot_password(email, name, login, password)
    @subject        = "Password reset from Clueypos Account!"
    @body['user']   = [email, name, login, password]
    @recipients     = email  
    content_type "text/html"
  end
  
end
