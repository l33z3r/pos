class Accounts::SessionsController < Accounts::ApplicationController
  skip_before_filter :ensure_logged_in, :only => [:new, :create]
  
  def new
  end

  def create
    @cluey_account = ClueyAccount.authenticate(params[:name], params[:password])
    
    if @cluey_account
      session[:current_cluey_account_id] = @cluey_account.id
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
