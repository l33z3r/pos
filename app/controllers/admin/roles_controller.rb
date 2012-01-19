class Admin::RolesController < Admin::AdminController
  cache_sweeper :display_button_sweeper
  before_filter :disallow_edit_super_user_role, :only => [:edit, :update]
  
  def index
    @roles = Role.all
  end

  def show
    @role = Role.find(params[:id])
  end

  def new
    @role = Role.new
  end

  def edit
    
  end

  def create
    @role = Role.new(params[:role])

    if @role.save
      redirect_to([:admin, @role], :notice => 'Role was successfully created.')
    else
      render :action => "new"
    end
  end

  def update
    if @role.update_attributes(params[:role])
      redirect_to([:admin, @role], :notice => 'Role was successfully updated.')
    else
      render :action => "edit"
    end
  end
  
  def pin_required_for_role
    @role = Role.find(params[:id])
    @role.pin_required = params[:checked]
    @role.save!
    
    render :json => {:success => true}.to_json
  end

  def destroy
    @role = Role.find(params[:id])
    @role.destroy

    redirect_to(admin_roles_url)
  end
  
  private
  
  def disallow_edit_super_user_role
    @role = Role.find(params[:id])
    
    @editing_super_user = (Role::SUPER_USER_ROLE_ID == @role.id)
    
    if @editing_super_user
      redirect_to([:admin, @role], :flash => {:error => "You cannot edit the Administrator Role!"}) and return
    end
  end
  
end
