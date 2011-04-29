class Admin::EmployeesController < Admin::AdminController

  # GET /employees
  def index
    @employees = Employee.all
  end

  # GET /employees/1
  def show
    @employee = Employee.find(params[:id])
  end

  # GET /employees/new
  def new
    @employee = Employee.new
  end

  # GET /employees/1/edit
  def edit
    @employee = Employee.find(params[:id])
  end

  # POST /employees
  def create
      @employee = Employee.new(params[:employee])

      if @employee.save
        redirect_to([:admin, @employee], :notice => 'Employee was successfully created.')
      else
        render :action => "new"
      end
  end

  # PUT /employees/1
  def update
    @employee = Employee.find(params[:id])

    if @employee.update_attributes(params[:employee])
      redirect_to([:admin, @employee], :notice => 'Employee was successfully updated.')
    else
      render :action => "edit"
    end
  end

  # DELETE /employees/1
  def destroy
    @employee = Employee.find(params[:id])
    @employee.destroy

    redirect_to(admin_employees_url)
  end
end
