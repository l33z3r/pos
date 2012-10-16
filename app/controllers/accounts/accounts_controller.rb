class Accounts::AccountsController < Accounts::ApplicationController
  skip_before_filter :setup_for_master_subdomain, :ensure_logged_in, :only => [:welcome, :new, :create, :activate]
  before_filter :do_setup_for_master_subdomain_if_not_signup_subdomain, :only => [:new, :create]

  def do_setup_for_master_subdomain_if_not_signup_subdomain
    @subdomain = request.subdomain
    
    if @subdomain != "signup"
      setup_for_master_subdomain
    end
  end
  
  def index
    
  end

  def welcome
    
  end
  
  def new
    @cluey_account = ClueyAccount.new
  end

  def create
    @cluey_account = ClueyAccount.new(params[:cluey_account])
    
    if @cluey_account.save
      
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
      redirect_to welcome_path(:subdomain => "signup")
      return
    end
    
    @cluey_account.activate
      
    #log in
    session[:current_cluey_account_id] = @cluey_account
      
    flash[:positive] = "Thanks, your account has been activated. Welcome to Cluey!"
    redirect_to accounts_accounts_path
  end
  
end
