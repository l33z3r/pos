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
      redirect_to account_sign_up_url(:subdomain => "signup")
      return
    end
    
    #split the subdomain
    @subdomain_parts = @subdomain.split("-")
    
    if @subdomain_parts.length != 1
      flash[:notice] = "Invalid Subdomain"
      redirect_to account_sign_up_url(:subdomain => "signup")
      return
    end
    
    @account_name = @subdomain_parts[0]    
    
    @cluey_account = ClueyAccount.find_by_name @account_name
    
    if !@cluey_account
      flash[:error] = "Account #{@account_name} not found!"
      redirect_to account_not_found_accounts_accounts_url(:subdomain => "signup")
      return
    end
  end

  def ensure_logged_in  
    if current_cluey_account and @cluey_account.id == current_cluey_account.id
      return true
    end
    
    #check if using auth token for accounts login
    #set in the accounts login page
    @accounts_login_auth_token = cookies[:accounts_login_auth_token]
          
    if @accounts_login_auth_token
      @accounts_auth_token_cluey_account = ClueyAccount.find_by_login_crossdomain_auth_token @accounts_login_auth_token
            
      if @accounts_auth_token_cluey_account
        #make sure that the auth_token_cluey_account owns this outlet
        if @accounts_auth_token_cluey_account.id == @cluey_account.id
          logger.info "!!!!!!!!!!!!!!!!!!!!!!!LOGGED TO ACCOUNTS IN WITH AUTH ACCOUNTS AUTH TOKEN #{@accounts_login_auth_token}"
          set_login_credentials @accounts_auth_token_cluey_account
          return true
        end
      end
    end
          
    flash[:notice] = "Please Log In"
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
