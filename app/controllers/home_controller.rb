class HomeController < ApplicationController

  #main screen including the login overlay
  def index
    load_active_employees
    @display = Display.load_default
    
    @rooms = Room.all
  end

  def init_sales_screen_buttons
    #we get passed the user id as it may not have been set in the session yet,
    #as the ajax login call may not yet have happened
    @current_employee_id = params[:current_user_id]
    @employee = Employee.find(@current_employee_id)

    @dbrs = DisplayButtonRole.find(:all, :include => "display_button",
      :conditions => "role_id = #{@employee.role.id} and (show_on_sales_screen is true 
      and (show_on_admin_screen is true or role_id = #{Role::SUPER_USER_ROLE_ID}) 
      or (display_buttons.perm_id = #{ButtonMapper::MORE_OPTIONS_BUTTON} and role_id = #{Role::SUPER_USER_ROLE_ID}))")
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
    session[:current_employee_role_id] = @employee.role.id
    session[:current_employee_passcode] = @employee.passcode 
    
    @employee.last_login = Time.now
    @employee.save!

    render :inline => "{success : true}"
  end
  
  def clockin
    @employee = Employee.find(params[:id])
    
    session[:active_employee_ids] ||= []

    if !session[:active_employee_ids].include? @employee.id
      #add this employee to the active users list
      session[:active_employee_ids] << @employee.id
    end

    update_last_active @employee

    load_active_employees

    render :action => :active_employees
  end

  def clockout
    @employee = Employee.find(params[:id])

    redirect_to :back, :flash => {:error => "Employee not found."} and return if @employee.nil?

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
    session[:current_employee_role_id] = nil
    session[:current_employee_passcode] = nil
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