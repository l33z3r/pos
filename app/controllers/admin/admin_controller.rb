class Admin::AdminController < ApplicationController
  before_filter :check_logged_in
  before_filter :load_more_options_buttons_for_role

  layout 'admin'

  private
  
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
    @current_employee.is_admin
  end

end
