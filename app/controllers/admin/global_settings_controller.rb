class Admin::GlobalSettingsController < Admin::AdminController
  cache_sweeper :display_button_sweeper

  def index
    GlobalSetting.clear_dup_keys_gs current_outlet
  end
  
  def toggle_print_receipt
    @gs = GlobalSetting.setting_for GlobalSetting::AUTO_PRINT_RECEIPT, current_outlet
    @gs.value = (!@gs.parsed_value).to_s
    @gs.save!
    
    #must reload the setting
    @gs = GlobalSetting.setting_for GlobalSetting::AUTO_PRINT_RECEIPT, current_outlet
  end

  def update_multiple
    @global_settings = GlobalSetting.update(params[:global_settings].keys, params[:global_settings].values)
    
    if @global_settings.reject{ |p| p.errors.empty? }.empty?
      #have to manually set the service charge button label to the global value
      @service_charge_button = current_outlet.display_buttons.find_by_perm_id(ButtonMapper::SERVICE_CHARGE_BUTTON)
      @service_charge_button.button_text = GlobalSetting.parsed_setting_for GlobalSetting::SERVICE_CHARGE_LABEL, current_outlet
      @service_charge_button.save
      
      GlobalSetting.check_for_system_wide_update_required @global_settings, current_outlet, @terminal_fingerprint
      
      #this action is also used in the medium interface, so we have to conditionally redirect
      #what is the entry point for each interface?
      if current_interface_large?
        redirect_to :action => "index"
      elsif current_interface_medium?
        #if we are on the medium interface, we want the mbl to be the entry point
        redirect_to mbl_path
      else
        redirect_to :action => "index"
      end
    else
      flash[:notice] = "No settings were changed"
      redirect_to :action => "index"
    end
  end
  
  def cash_total_options
    
  end
  
  def toggle_cash_total_option
    @total_type = params[:total_type]
    @employee_role = params[:role]
    @report_section = params[:report_section]
    
    @gs = GlobalSetting.setting_for GlobalSetting::CASH_TOTAL_OPTION, current_outlet, {:total_type => @total_type, :employee_role => @employee_role, :report_section => @report_section}
    
    @checked = params[:checked]
    
    @gs.value = @checked == "true" ? "true" : "false"
    @gs.save!
    
    render :json => {:success => true}.to_json
  end
  
  def update_show_report_in_cash_total
    @dbr = current_outlet.display_button_roles.find(params[:id])
    @dbr.show_on_sales_screen = params[:checked]
    @dbr.save!
    
    render :json => {:success => true}.to_json
  end

end
