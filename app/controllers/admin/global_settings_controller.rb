class Admin::GlobalSettingsController < Admin::AdminController
  def index
  end
  
  def toggle_print_receipt
    @gs = GlobalSetting.setting_for GlobalSetting::AUTO_PRINT_RECEIPT
    @gs.value = (!@gs.parsed_value).to_s
    @gs.save!
    
    #must reload the setting
    @gs = GlobalSetting.setting_for GlobalSetting::AUTO_PRINT_RECEIPT
  end

  def update_multiple
    @global_settings = GlobalSetting.update(params[:global_settings].keys, params[:global_settings].values).reject { |p| p.errors.empty? }
    
    if @global_settings.empty?
      flash[:notice] = "Settings Updated!"
      redirect_to :action => "index"
    else
      render :action => "index"
    end
  end

end
