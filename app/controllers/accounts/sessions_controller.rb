class Accounts::SessionsController < Accounts::ApplicationController
  def new
  end

  def create
    @cluey_account = ClueyAccount.authenticate(params[:name], params[:password])
    
    if @cluey_account
      session[:current_cluey_account_id] = @cluey_account.id
      redirect_to root_url, :notice => "Welcome to cluey!"
    else
      flash.now.alert = "Invalid email or password"
      render "new"
    end
  end

  def destroy
    session[:current_cluey_account_id] = nil
    redirect_to root_url, :notice => "Logged out!"
  end
end
