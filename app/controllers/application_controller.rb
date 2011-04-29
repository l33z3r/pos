class ApplicationController < ActionController::Base
  helper_method :e, :current_employee
  
  def e
    session[:current_employee_id]
  end

  def current_employee
    @e ||= Employee.find(session[:current_employee_id])
    @e
  end
end
