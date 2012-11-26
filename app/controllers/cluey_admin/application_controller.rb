class ClueyAdmin::ApplicationController < ActionController::Base
  include ClueyAdminHelper
  
  before_filter :ensure_logged_in
    
  private
  
  def ensure_logged_in  
    if current_cluey_admin_account and @cluey_admin_account.id == current_cluey_admin_account.id
      return true
    end
          
    flash[:notice] = "Please Log In"
    redirect_to account_log_in_path
    return false
  end
  
end
