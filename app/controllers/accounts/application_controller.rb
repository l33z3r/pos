class Accounts::ApplicationController < AppBaseController
  before_filter :setup_for_master_subdomain, :ensure_logged_in
  helper_method :request_sales_resources_reload_for_outlet
    
  def request_sales_resources_reload_for_outlet outlet
    TerminalSyncData.request_reload_app "Admin", outlet
  end
  
  private
  
  def setup_for_master_subdomain
    @subdomain = request.subdomain
    
    if @subdomain == "signup"
      redirect_to root_url(:subdomain => "signup")
      return
    end
    
    #split the subdomain
    @subdomain_parts = @subdomain.split("-")
    
    if @subdomain_parts.length != 1
      flash[:notice] = "Invalid Subdomain"
      redirect_to root_url(:subdomain => "signup")
      return
    end
    
    @account_name = @subdomain_parts[0]    
    
    @cluey_account = ClueyAccount.find_by_name @account_name
    
    if !@cluey_account
      flash[:error] = "Account #{@account_name} not found!"
      redirect_to root_url(:subdomain => "signup")
      return
    end
  end

  def ensure_logged_in  
    if current_cluey_account and @cluey_account.id == current_cluey_account.id
      return true
    end
          
    flash[:error] = "Please Log In"
    redirect_to account_log_in_path
    return false
  end
  
  def check_captcha(redirect=nil)
    if !verify_recaptcha
      @message = "Please enter the captcha correctly!"
      if redirect
        flash[:error] = @message
      else
        flash.now[:error] = @message
      end
      false
    else
      true
    end
  end
  
  def set_login_credentials cluey_account
    session[:current_cluey_account_id] = cluey_account.id
      
    #set the auth_token cookie to allow the master user to log in 
    #to seperate pos systems without the password prompt
    cookies[:login_auth_token] = {
      :value => cluey_account.login_crossdomain_auth_token,
      :expires => 20.years.from_now,
      :domain => ".#{APP_DOMAIN}"
    }
  end
  
end
