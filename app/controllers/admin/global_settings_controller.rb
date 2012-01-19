class Admin::GlobalSettingsController < Admin::AdminController
  cache_sweeper :display_button_sweeper
  #uses_tiny_mce :options => {  :theme => 'simple', :editor_selector => 'mceEditor', :plugins => "maxlength", :maxlength_textarea_0 => 200, :maxlength_textarea_1 => 100}
  
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
      flash[:notice] = "Settings Updated. A reload request has been sent to all terminals."
      
      #have to manually set the service charge button label to the global value
      @service_charge_button = DisplayButton.find_by_perm_id(ButtonMapper::SERVICE_CHARGE_BUTTON)
      @service_charge_button.button_text = GlobalSetting.parsed_setting_for GlobalSetting::SERVICE_CHARGE_LABEL
      @service_charge_button.save
    
      #send a reload request to other terminals
      request_reload_app @terminal_id
      
      #this action is also used in the medium interface, so we have to conditionally redirect
      #what is the entry point for each interface?
      if current_interface_large?
        redirect_to :action => "index"
      elsif current_interface_medium?
        #if we are on the medium interface, we want the mbl to be the entry point
        redirect_to home_path
      else
        redirect_to :action => "index"
      end
    else
      render :action => "index"
    end
  end
  
  def cash_total_options
    
  end
  
  def toggle_cash_total_option
    @total_type = params[:total_type]
    @employee_role = params[:role]
    @report_section = params[:report_section]
    
    @gs = GlobalSetting.setting_for GlobalSetting::CASH_TOTAL_OPTION, {:total_type => @total_type, :employee_role => @employee_role, :report_section => @report_section}
    
    @checked = params[:checked]
    
    @gs.value = @checked == "true" ? "true" : "false"
    @gs.save!
    
    render :json => {:success => true}.to_json
  end
  
  def update_show_report_in_cash_total
    @dbr = DisplayButtonRole.find(params[:id])
    @dbr.show_on_sales_screen = params[:checked]
    @dbr.save!
    
    render :json => {:success => true}.to_json
  end

end
