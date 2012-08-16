class Admin::RolesController < Admin::AdminController
  cache_sweeper :display_button_sweeper
  before_filter :disallow_edit_super_user_role, :only => [:edit, :update]
  before_filter :disallow_edit_employee_role, :only => [:edit, :update]
  
  def index
    @roles = current_outlet.roles.all
  end

  def show
    @role = current_outlet.roles.find(params[:id])
  end

  def new
    @role = Role.new
  end

  def edit
    
  end

  def create
    @role = Role.new(params[:role])

    @role.outlet_id = current_outlet.id
    
    if @role.save
      
      #build role permissions
      @display_buttons_map = OutletBuilder::display_buttons_map
      
      #now create the buttons and also init a button role for admin user
      @display_buttons_map.each do |perm_id, button_text|
        @display_button = DisplayButton.find_or_create_by_outlet_id_and_perm_id(:outlet_id => current_outlet.id, :perm_id => perm_id, :button_text => button_text)
     
        DisplayButtonRole.find_or_create_by_outlet_id_and_display_button_id_and_role_id(:outlet_id => current_outlet.id, :display_button_id => @display_button.id, :role_id => @role.id, :show_on_admin_screen => true)
      end

      @default_sales_screen_button_perm_ids = OutletBuilder::default_sales_screen_button_perm_ids
      
      #set the default sales screen buttons
      @default_sales_screen_button_perm_ids.each do |display_button_perm_id|
        DisplayButton.find_by_outlet_id_and_perm_id(current_outlet.id, display_button_perm_id).display_button_roles.each do |dbr|
          dbr.show_on_sales_screen = true
          dbr.save!
        end
      end
    
      redirect_to([:admin, @role], :notice => 'Role was successfully created.')
    else
      render :action => "new"
    end
  end

  def update
    if @role.update_attributes(params[:role])
      #prevent renaming system roles
      @editing_super_user = (Role::super_user_role_id(current_outlet) == @role.id)
    
      if @editing_super_user
        #make sure we are not changing the name "Administrator"
        @role.name = "Administrator"
        @role.save
      end
    
      @editing_employee = (Role::employee_role_id(current_outlet) == @role.id)
    
      if @editing_employee
        #make sure we are not changing the name "Employee"
        @role.name = "Employee"
        @role.save
      end
    
      redirect_to([:admin, @role], :notice => 'Role was successfully updated.')
    else
      render :action => "edit"
    end
  end
  
  def pin_required_for_role
    @role = current_outlet.roles.find(params[:id])
    @role.pin_required = params[:checked]
    @role.save!
    
    render :json => {:success => true}.to_json
  end
  
  def login_allowed_for_role
    @role = current_outlet.roles.find(params[:id])
    @role.login_allowed = params[:checked]
    @role.save!
    
    render :json => {:success => true}.to_json
  end
  
  private
  
  def disallow_edit_super_user_role
    @role = current_outlet.roles.find(params[:id])
    
    @editing_super_user = (Role::super_user_role_id(current_outlet) == @role.id)
    
    if @editing_super_user
      redirect_to([:admin, @role], :flash => {:error => "You cannot edit the Administrator Role!"}) and return
    end
  end
  
  def disallow_edit_employee_role
    @role = current_outlet.roles.find(params[:id])
    
    @editing_employee = (Role::employee_role_id(current_outlet) == @role.id)
    
    if @editing_employee
      redirect_to([:admin, @role], :flash => {:error => "You cannot edit the Employee Role!"}) and return
    end
  end
  
end
