class Admin::EmployeesController < Admin::AdminController

  def index
    @employees = Employee.all_except_cluey(current_outlet).paginate :page => params[:page], :order => 'nickname'
  end

  def csv_import

  end

  def csv_upload
    @employee_count = 0
    @role_count = 0
    
    @employees = []

    @csv_validation_errors = {}
    @validation_passed = true

    @first_row = true

    @roles = {}

    CSV.parse(params[:dump_file].read) do |row|
      if @first_row
        @first_row = false
        next
      end

      @employee_count += 1

      @role_name = EmployeeCSVMapper::role_from_row row

      if @role_name and !@roles[@role_name]
        @roles[@role_name] = []
      end

      @new_employee = EmployeeCSVMapper::employee_from_row row, current_outlet

      if @role_name
        @roles[@role_name] << @new_employee
      end
      
      #for the sake of validation we just assign a default role until we build the roles further down
      @new_employee.role_id = Role.employee_role_id current_outlet
      
      #validate the employee
      logger.info "!!!VALID? #{@new_employee.valid?}"

      @nickname_taken = false

      @employees.each do |p|
        if p.name == @new_employee.nickname
          @name_taken = true
        end
      end
      
      @passcode_taken = false

      @employees.each do |p|
        if p.passcode == @new_employee.passcode
          @passcode_taken = true
        end
      end
      
      @clockin_code_taken = false

      @employees.each do |p|
        if p.clockin_code == @new_employee.clockin_code
          @clockin_code_taken = true
        end
      end

      if !@new_employee.valid? or @nickname_taken
        @validation_passed = false

        if @nickname_taken
          #need to manually add in a name taken error
          @new_employee.errors.add(:nickname, "is a duplicate of another employee")
        end
        
        if @passcode_taken
          #need to manually add in a name taken error
          @new_employee.errors.add(:passcode, "is a duplicate of another employee")
        end
        
        if @clockin_code_taken
          #need to manually add in a name taken error
          @new_employee.errors.add(:clockin_code, "is a duplicate of another employee")
        end
        
        @employee_errors = []
        
        @new_employee.errors.each do |var, error|
          @employee_errors << "Employee #{var}: #{error}"
        end
        
        #add 1 to account for unused 1st line
        @csv_validation_errors[@employee_count + 1] = {
          :row_data => row,
          :errors => @employee_errors
        }
                    
      end

      @employees << @new_employee

      logger.info "!!!!#{@new_employee.name}"
    end

    if @validation_passed

      @employees.each do |e|
        e.save
      end
      
      #build the roles
      @roles.each do |name, employees|
        @role_employee_ids = employees.collect &:id

        @new_role = Role.find_or_initialize_by_outlet_id_and_name(current_outlet.id, name)

        if @new_role.new_record?
          @role_count += 1
          @new_role.save
          @new_role.reload
        end

        Employee.update_all({:role_id => @new_role.id}, {:id => @role_employee_ids})
      end

      set_system_wide_update_prompt_required GlobalSetting::SYSTEM_WIDE_UPDATE_SOFT
    
      flash[:notice] = "CSV Import Successful! #{@employee_count} new employees, and #{@role_count} new roles have been added to the database."
      redirect_to admin_employees_path
    else
      flash.now[:error] = "Import Failed, please check the errors and modify the CSV file accordingly."
      render :csv_import
    end

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
      set_system_wide_update_prompt_required GlobalSetting::SYSTEM_WIDE_UPDATE_HARD
    
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
      set_system_wide_update_prompt_required GlobalSetting::SYSTEM_WIDE_UPDATE_SOFT
    
      redirect_to([:admin, @employee], :notice => 'Employee was successfully updated.')
    else
      render :action => "edit"
    end
  end

  def destroy
    @employee = current_outlet.employees.find(params[:id])
    @employee.destroy

    set_system_wide_update_prompt_required GlobalSetting::SYSTEM_WIDE_UPDATE_SOFT
    
    redirect_to(admin_employees_url)
  end
end
