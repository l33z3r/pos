class Accounts::SessionsController < Accounts::ApplicationController
  skip_before_filter :ensure_logged_in, :only => [:new, :create] 
  
  layout :choose_layout
  
  def new
    
  end

  def create
    @login_cluey_account = ClueyAccount.authenticate(params[:email], params[:password])
    
    if @login_cluey_account and @login_cluey_account.id == @cluey_account.id
      if !@login_cluey_account.activated?
        AccountMailer.deliver_signup_notification @login_cluey_account
        flash[:error] = "You have not yet activated your account. An activation email has been resent to your inbox. Please check your spam inbox too."
        redirect_to account_log_in_path
        return
      end
      
      set_login_credentials @login_cluey_account
      
      redirect_to accounts_accounts_path, :notice => "Logged In Successfully!"
    else
      flash.now[:error] = "Invalid email or password"
      render "new"
    end
  end

  def destroy
    session[:current_cluey_account_id] = nil
    redirect_to root_url(:subdomain => "signup"), :notice => "Logged out!"
  end
  
  private 
  
  def choose_layout
    @accounts_logged_out_layout_action_array = ["new", "create"]
    
    if @accounts_logged_out_layout_action_array.include? action_name
      return "accounts_logged_out"
    else 
      return "accounts"
    end
  end
  
end
