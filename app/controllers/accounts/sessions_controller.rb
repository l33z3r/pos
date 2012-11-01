class Accounts::SessionsController < Accounts::ApplicationController
  skip_before_filter :ensure_logged_in, :only => [:new, :create]
  
  def new
  end

  def create
    @cluey_account = ClueyAccount.authenticate(params[:name], params[:password])
    
    if @cluey_account
      if !@cluey_account.activated?
        AccountMailer.deliver_signup_notification @cluey_account
        flash[:error] = "You have not yet activated your account. An activation email has been resent to your inbox. Please check your spam inbox too."
        redirect_to account_log_in_path
        return
      end
      
      session[:current_cluey_account_id] = @cluey_account.id
      
      #set the auth_token cookie to allow the master user to log in 
      #to seperate pos systems without the password prompt
      cookies[:login_auth_token] = {
        :value => @cluey_account.login_crossdomain_auth_token,
        :expires => 20.years.from_now,
        :domain => ".#{APP_DOMAIN}"
      }
      
      redirect_to accounts_accounts_path, :notice => "Logged In Successfully!"
    else
      flash.now.alert = "Invalid email or password"
      render "new"
    end
  end

  def destroy
    session[:current_cluey_account_id] = nil
    redirect_to welcome_url, :notice => "Logged out!"
  end
end
