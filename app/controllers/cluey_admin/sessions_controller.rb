class Accounts::SessionsController < ClueyAdmin::ApplicationController
  skip_before_filter :ensure_logged_in, :only => [:new, :create] 
  
  def new
  end

  def create
  end

  def destroy
  end
  
end
