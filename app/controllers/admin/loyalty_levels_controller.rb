class Admin::LoyaltyLevelsController < Admin::AdminController
  
  def create
    @loyalty_level = LoyaltyLevel.new(params[:loyalty_level])

    if @loyalty_level.save
      redirect_to admin_global_settings_path, :notice => 'Loyalty Level was successfully created.'
    else
      redirect_to admin_global_settings_path, :error => 'Error creating new Loyalty Level.'
    end
  end

  def update_multiple
    @loyalty_levels = LoyaltyLevel.update(params[:loyalty_levels].keys, params[:loyalty_levels].values).reject { |p| p.errors.empty? }
    
    if @loyalty_levels.empty?
      flash[:notice] = "Loyalty Levels Updated!"
      redirect_to admin_global_settings_path
    else
      render admin_global_settings_path
    end
  end

  def destroy
    #Don't allow deleting of last one
    if LoyaltyLevel.all.size == 1
      flash[:notice] = "You must have at least one loyalty level!"
      redirect_to admin_global_settings_path
      return
    end
    
    @loyalty_level = LoyaltyLevel.find(params[:id])
    @loyalty_level.destroy

    flash[:notice] = "Loyalty Level Deleted!"
    redirect_to admin_global_settings_path
  end
  
  def default
    @old_default_loyalty_level = LoyaltyLevel.load_default
    @old_default_loyalty_level.is_default = false
    @old_default_loyalty_level.save

    @new_default_loyalty_level = LoyaltyLevel.find(params[:id])
    @new_default_loyalty_level.is_default = true
    @new_default_loyalty_level.save

    render :json => {:success => true}.to_json
  end
end
