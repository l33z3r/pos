class Admin::AdminController < ApplicationController
  #we used to check for admin, we use the access page now
  #before_filter :check_admin
  
  before_filter :check_logged_in
  before_filter :load_more_options_buttons_for_role
  
  layout 'admin'

  private

#  def check_admin
#    if !is_admin?
#      redirect_to :home, :flash => {:error => "You must be an administrator to use that section."}
#    end
#  end
  
  def load_more_options_buttons_for_role
    @more_options_buttons_dbrs = DisplayButtonRole.admin_screen_buttons_for_role(current_employee.role.id)
  end
  
  def check_logged_in
    if current_employee == nil
      flash[:error] = "You must be logged in to access admin section"
      redirect_to :home and return
    end
  end

  def is_admin?
    session[:current_employee_admin] == 1
  end

end
