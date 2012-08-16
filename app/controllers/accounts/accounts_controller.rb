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
      flash[:notice] = "Signed up successfully! Welcome to Cluey!"
      redirect_to accounts_accounts_url(:subdomain => @cluey_account.name)
    else
      render "new"
    end
  end
  
end
