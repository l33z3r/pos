class AppBaseController < ActionController::Base  
  include AccountsHelper
  include UrlHelper
  
  private
  
  def set_interface_large
    session[:current_interface] = GlobalSetting::LARGE_INTERFACE
  end
  
  def set_interface_medium
    session[:current_interface] = GlobalSetting::MEDIUM_INTERFACE
  end
  
end
