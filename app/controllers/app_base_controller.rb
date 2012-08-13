class AppBaseController < ActionController::Base
  
  helper_method :current_cluey_account, :current_outlet_account

  private

  def current_cluey_account
    @current_cluey_account ||= ClueyAccount.find(session[:current_cluey_account_id]) if session[:current_cluey_account_id]
    @current_cluey_account
  end
  
  def current_outlet_account
    nil
  end
end
