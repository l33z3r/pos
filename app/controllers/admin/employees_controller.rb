class Admin::EmployeesController < Admin::AdminController

  def index
    @employees = Employee.all_except_cluey(current_outlet).paginate :page => params[:page], :order => 'nickname'
  end

  def show
    @employee = current_outlet.employees.find(params[:id])
  end

  def new
    @employee = Employee.new
  end

  def edit
    @employee = current_outlet.employees.find(params[:id])
  end

  def create
    @employee = Employee.new(params[:employee])

    @employee.outlet_id = current_outlet.id
    
    if @employee.save
      #send a reload request to other terminals
      request_sales_resources_reload @terminal_id
    
      redirect_to([:admin, @employee], :notice => 'Employee was successfully created.')
    else
      render :action => "new"
    end
  end

  def update
    @employee = current_outlet.employees.find(params[:id])

    if params[:delete_employee_image]
      @employee.employee_image.destroy #Will remove the attachment and save the model
      @employee.employee_image.clear #Will queue the attachment to be deleted
    end
    
    if @employee.update_attributes(params[:employee])
      #send a reload request to other terminals
      request_sales_resources_reload @terminal_id
    
      redirect_to([:admin, @employee], :notice => 'Employee was successfully updated.')
    else
      render :action => "edit"
    end
  end

  def destroy
    @employee = current_outlet.employees.find(params[:id])
    @employee.destroy

    #send a reload request to other terminals
    request_sales_resources_reload @terminal_id
    
    redirect_to(admin_employees_url)
  end
end
