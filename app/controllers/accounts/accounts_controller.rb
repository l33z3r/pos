class Accounts::AccountsController < Accounts::ApplicationController
  skip_before_filter :setup_for_master_subdomain, :ensure_logged_in, :only => [:welcome, :new, :create]
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
      
      flash[:notice] = "Signed up successfully! Welcome to Cluey!"
      redirect_to accounts_accounts_url(:subdomain => @cluey_account.name)
    else
      render "new"
    end
  end
  
  def activate
    @user = params[:activation_code].blank? ? false : User.find_by_activation_code(params[:activation_code])
    if @user && !@user.activated?
      @user.activate
      self.user = @user unless logged_in?
      AccountMailer.deliver_signup @user
      flash[:positive] = "Thanks, your account has been activated"
      redirect_back_or_default('/')
    else
      flash[:negative] = "You have already activated your account!"
      redirect_back_or_default('/')
    end
  end
  
end
