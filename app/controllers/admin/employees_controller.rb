class Admin::EmployeesController < Admin::AdminController

  def index
    @employees = Employee.all_except_cluey.paginate :page => params[:page], :order => 'nickname'
  end

  def show
    @employee = Employee.find(params[:id])
  end

  def new
    @employee = Employee.new
  end

  def edit
    @employee = Employee.find(params[:id])
  end

  def create
      @employee = Employee.new(params[:employee])

      if @employee.save
        redirect_to([:admin, @employee], :notice => 'Employee was successfully created.')
      else
        render :action => "new"
      end
  end

  def update
    @employee = Employee.find(params[:id])

    if params[:delete_employee_image]
      @employee.employee_image.destroy #Will remove the attachment and save the model
      @employee.employee_image.clear #Will queue the attachment to be deleted
    end
    
    if @employee.update_attributes(params[:employee])
      redirect_to([:admin, @employee], :notice => 'Employee was successfully updated.')
    else
      render :action => "edit"
    end
  end

  def destroy
    @employee = Employee.find(params[:id])
    @employee.destroy

    redirect_to(admin_employees_url)
  end
end
