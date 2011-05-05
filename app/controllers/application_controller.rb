class ApplicationController < ActionController::Base
  helper_method :e, :current_employee, :print_money
  
  include ActionView::Helpers::NumberHelper
  
  def e
    session[:current_employee_id]
  end

  def current_employee
    @e ||= Employee.find(session[:current_employee_id])
    @e
  end
  
  def print_money value
    number_to_currency value, :precision => 2
  end

end
