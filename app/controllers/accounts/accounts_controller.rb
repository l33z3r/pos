class Accounts::AccountsController < Accounts::ApplicationController
  def index
  end

  def new
    @cluey_account = ClueyAccount.new
  end

  def create
    @cluey_account = ClueyAccount.new(params[:cluey_account])
    
    if @cluey_account.save
      redirect_to "index", :notice => "Signed up!"
    else
      render "new"
    end
  end
end
