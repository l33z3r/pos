class Admin::DisplayButtonsController < Admin::AdminController
  cache_sweeper :display_button_sweeper
  
  def access
    
  end

  def screen
    
  end
  
  def edit_multiple
    
  end
  
  def update_multiple
    @display_buttons = DisplayButton.update(params[:display_buttons].keys, params[:display_buttons].values).reject { |p| p.errors.empty? }
    
    #have to manually set the service charge button label to the global value
    @service_charge_button = DisplayButton.find_by_outlet_id_and_perm_id(current_outlet.id, ButtonMapper::SERVICE_CHARGE_BUTTON)
    @service_charge_button.button_text = @service_charge_label
    @service_charge_button.save
    
    if @display_buttons.empty?
      #send a reload request to other terminals
      request_sales_resources_reload @terminal_id
    
      flash[:notice] = "Buttons updated"
      redirect_to edit_multiple_admin_display_buttons_path
    else
      render :action => "edit_multiple"
    end
  end
  
  def button_group_create
    DisplayButtonGroup.create({:outlet_id => current_outlet.id, :name => params[:name]})
    
    #send a reload request to other terminals
    request_sales_resources_reload @terminal_id
    
    flash[:notice] = "Button Group created"
    render :json => {:success => true}.to_json
  end

  def button_group_update_multiple
    @display_button_groups = DisplayButtonGroup.update(params[:display_button_groups].keys, params[:display_button_groups].values).reject { |p| p.errors.empty? }
    
    if @display_button_groups.empty?
      #send a reload request to other terminals
      request_sales_resources_reload @terminal_id
    
      flash[:notice] = "Button Groups updated"
      redirect_to edit_multiple_admin_display_buttons_path
    else
      render :action => "edit_multiple"
    end
  end
  
  def button_group_delete
    @dbg = current_outlet.display_button_groups.find(params[:dbg_id])
    @dbg.destroy
    
    #send a reload request to other terminals
    request_sales_resources_reload @terminal_id
    
    flash[:notice] = "Button Group deleted"
    render :json => {:success => true}.to_json
  end
  
  def update_sales_screen_button_role
    #send a reload request to other terminals
    request_sales_resources_reload @terminal_id
    
    @dbr = current_outlet.display_button_roles.find(params[:id])
    @dbr.show_on_sales_screen = params[:checked]
    @dbr.save!
    
    render :json => {:success => true}.to_json
  end

  def update_admin_screen_button_role
    @dbr = current_outlet.display_button_roles.find(params[:id])
    
    if params[:checked]
      @dbr.show_on_admin_screen = params[:checked]
    elsif params[:passcode_required]
      @dbr.passcode_required = params[:passcode_required]
    end
    
    @dbr.save!

    #send a reload request to other terminals
    request_sales_resources_reload @terminal_id
    
    render :json => {:success => true}.to_json
  end
  
end
