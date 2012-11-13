class Accounts::AccountsController < Accounts::ApplicationController
  skip_before_filter :setup_for_master_subdomain, :ensure_logged_in, 
    :only => [:new, :create, :activate, :contact, :help, :privacy, :terms, :browser_not_supported, :pricing]
  
  before_filter :do_setup_for_master_subdomain_if_not_signup_subdomain, :only => [:new, :create]
    
  layout :choose_layout
  
  def do_setup_for_master_subdomain_if_not_signup_subdomain
    @subdomain = request.subdomain
    
    if @subdomain != "signup"
      setup_for_master_subdomain
    end
  end
  
  def index
  end

  def new
    @cluey_account = ClueyAccount.new
  end

  def create
    @cluey_account = ClueyAccount.new(params[:cluey_account])
    
    if @cluey_account.save
      #build a default outlet
      @outlet = Outlet.new
      @outlet.name = "main"
      @outlet.username = "main"
      @outlet.bypass_validate_password = true
      @outlet.password_hash = @cluey_account.password_hash
      @outlet.password_salt = @cluey_account.password_salt
      @outlet.cluey_account_id = @cluey_account.id
      @outlet.save!
      OutletBuilder::build_outlet_seed_data(@outlet.id)
      
      #deliver activate email
      AccountMailer.deliver_signup_notification @cluey_account
    else
      render "new"
    end
  end
  
  def activate
    @cluey_account = params[:activation_code].blank? ? false : ClueyAccount.find_by_activation_code(params[:activation_code])

    if !@cluey_account
      flash[:error] = "Account is either already activated, or does not exist!"
      redirect_to root_url(:subdomain => "signup")
      return
    end

    @cluey_account.activate
  
    #perform a log in
    set_login_credentials @cluey_account
    
    #deliver welcome email
    AccountMailer.deliver_welcome @cluey_account
      
    flash[:positive] = "Thanks, your account has been activated. Welcome to Cluey!"
    redirect_to accounts_accounts_path
  end
  
  def contact
    
  end
  
  def privacy
    
  end
  
  def terms
    
  end
  
  def browser_not_supported
    
  end
  
  def pricing
    
  end
  
  private 
  
  def choose_layout
    @accounts_logged_out_layout_action_array = ["new", "create", "contact", "help", "privacy", "terms", "browser_not_supported", "pricing"]
    
    if @accounts_logged_out_layout_action_array.include? action_name
      return "accounts_logged_out"
    else 
      return "accounts"
    end
  end
  
end
