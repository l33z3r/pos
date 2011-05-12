class Admin::AdminController < ApplicationController
  #we used to check for admin, we use the access page now
  #before_filter :check_admin
  
  layout 'admin'

  private

  def check_admin
    if !is_admin?
      redirect_to :home, :flash => {:error => "You must be an administrator to use that section."}
    end
  end

  def is_admin?
    session[:current_employee_admin] == 1
  end

end
