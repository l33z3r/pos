class HomeController < ApplicationController

  #main screen including the login overlay
  def index
    load_active_employees
    @display = Display.load_default
  end

  def init_sales_screen_buttons
    #we get passed the user id as it may not have been set in the session yet,
    #as the ajax login call may not yet have happened
    @current_employee_id = params[:current_user_id]
    @employee = Employee.find(@current_employee_id)

    @dbrs = DisplayButtonRole.find_all_by_role_id(@employee.role.id)
  end

  def active_employees
    load_active_employees
  end

  #do login procedure
  def login
    @employee = Employee.find(params[:id])

    session[:current_employee_id] = @employee.id
    session[:current_employee_nickname] = @employee.nickname
    session[:current_employee_admin] = 1 if @employee.is_admin

    session[:active_employee_ids] ||= []

    if !session[:active_employee_ids].include? @employee.id
      #add this employee to the active users list
      session[:active_employee_ids] << @employee.id
      
      @employee.last_login = Time.now
      @employee.save!
    end

    update_last_active @employee

    load_active_employees

    render :action => :active_employees
  end

  def clockout
    @employee = Employee.find(e)

    redirect_to :back, :flash => {:error => "Employee not found."} and return if @employee.nil?

    @employee.last_logout = Time.now
    @employee.save!

    #remove the user from active employee list and refetch the list
    @active_employee_ids = session[:active_employee_ids]
    @active_employee_ids.delete @employee.id

    clear_session

    update_last_active @employee

    load_active_employees

    render :action => :active_employees
  end

  def logout
    @employee = Employee.find(e)
    @employee.last_logout = Time.now
    @employee.save!

    update_last_active @employee

    clear_session

    render :inline => "{success : true}"
  end

  private

  def clear_session
    session[:current_employee_id] = nil
    session[:current_employee_nickname] = nil
    session[:current_employee_admin] = nil
  end
  
  def update_last_active employee
    employee.last_active = Time.now
    employee.save!
  end

  def load_active_employees
    @ids = session[:active_employee_ids]
    @active_employees ||= []
    @active_employees = Employee.find(@ids) if @ids
  end

end