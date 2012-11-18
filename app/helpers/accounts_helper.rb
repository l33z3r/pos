module AccountsHelper
  def current_cluey_account
    @current_cluey_account ||= ClueyAccount.find(session[:current_cluey_account_id]) if session[:current_cluey_account_id]
    @current_cluey_account
  end
  
  def current_outlet
    @current_outlet ||= Outlet.find(session[:current_outlet_id]) if session[:current_outlet_id]
    @current_outlet
  end
end
