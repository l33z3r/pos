class Admin::LoyaltyLevelsController < Admin::AdminController
  
  def create
    @loyalty_level = LoyaltyLevel.new(params[:loyalty_level])

    @loyalty_level.outlet_id = current_outlet.id
    
    if @loyalty_level.save
      #send a reload request to other terminals
      request_sales_resources_reload @terminal_id
    
      redirect_to admin_global_settings_path, :notice => 'Loyalty Level was successfully created.'
    else
      redirect_to admin_global_settings_path, :error => 'Error creating new Loyalty Level.'
    end
  end

  def update_multiple
    @loyalty_levels = LoyaltyLevel.update(params[:loyalty_levels].keys, params[:loyalty_levels].values).reject { |p| p.errors.empty? }
    
    if @loyalty_levels.empty?
      #send a reload request to other terminals
      request_sales_resources_reload @terminal_id
    
      flash[:notice] = "Loyalty Levels Updated!"
      redirect_to admin_global_settings_path
    else
      render admin_global_settings_path
    end
  end

  def destroy
    #Don't allow deleting of last one
    if current_outlet.loyalty_levels.all.size == 1
      flash[:notice] = "You must have at least one loyalty level!"
      redirect_to admin_global_settings_path
      return
    end
    
    @loyalty_level = current_outlet.loyalty_levels.find(params[:id])
    @loyalty_level.destroy

    #send a reload request to other terminals
    request_sales_resources_reload @terminal_id
    
    flash[:notice] = "Loyalty Level Deleted!"
    redirect_to admin_global_settings_path
  end
  
  def default
    @old_default_loyalty_level = LoyaltyLevel.load_default(current_outlet)
    @old_default_loyalty_level.is_default = false
    @old_default_loyalty_level.save

    @new_default_loyalty_level = current_outlet.loyalty_levels.find(params[:id])
    @new_default_loyalty_level.is_default = true
    @new_default_loyalty_level.save

    #send a reload request to other terminals
    request_sales_resources_reload @terminal_id
    
    render :json => {:success => true}.to_json
  end
end
