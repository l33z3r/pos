class Admin::DisplayButtonsController < Admin::AdminController
  
  def access
    
  end

  def screen
    
  end
  
  def edit_multiple
    
  end
  
  def update_multiple
    @display_buttons = DisplayButton.update(params[:display_buttons].keys, params[:display_buttons].values).reject { |p| p.errors.empty? }
    
    if @display_buttons.empty?
      flash[:notice] = "Buttons updated!"
      redirect_to edit_multiple_admin_display_buttons_path
    else
      render :action => "edit_multiple"
    end
  end
  
  def update_multiple_groups
    @display_button_groups = DisplayButtonGroup.update(params[:display_button_groups].keys, params[:display_button_groups].values).reject { |p| p.errors.empty? }
    
    if @display_button_groups.empty?
      flash[:notice] = "Button Groups updated!"
      redirect_to edit_multiple_admin_display_buttons_path
    else
      render :action => "edit_multiple"
    end
  end
  
  def destroy_button_group
    @dbg = DisplayButtonGroup.find(params[:dbg_id])
    
    @dbg.display_buttons.each do |db|
      db.display_button_group_id = nil
      db.save!
    end
    
    @dbg.destroy
    
    flash[:notice] = "Button Group deleted!"
    redirect_to edit_multiple_admin_display_buttons_path
  end

  def update_sales_screen_button_role
    @dbr = DisplayButtonRole.find(params[:id])
    @dbr.show_on_sales_screen = params[:checked]
    @dbr.save!
    
    render :json => {:success => true}.to_json
  end

  def update_admin_screen_button_role
    @dbr = DisplayButtonRole.find(params[:id])
    
    if params[:checked]
      @dbr.show_on_admin_screen = params[:checked]
    elsif params[:passcode_required]
      @dbr.passcode_required = params[:passcode_required]
    end
    
    @dbr.save!

    render :json => {:success => true}.to_json
  end
  
  def create_button_group
    DisplayButtonGroup.create({:name => params[:name]})
    
    render :json => {:success => true}.to_json
  end
end
