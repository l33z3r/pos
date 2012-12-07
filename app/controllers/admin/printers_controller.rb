class Admin::PrintersController < Admin::AdminController
  
  def create
    @printer = Printer.new(params[:printer])

    @printer.outlet_id = current_outlet.id
    
    if @printer.save
      set_system_wide_update_prompt_required GlobalSetting::SYSTEM_WIDE_UPDATE_SOFT
    
      redirect_to admin_global_settings_path, :notice => 'Printer was successfully created.'
    else
      redirect_to admin_global_settings_path, :error => 'Error creating new printer.'
    end
  end

  def update_multiple
    @printers = Printer.update(params[:printers].keys, params[:printers].values).reject { |p| p.errors.empty? }
    
    if @printers.empty?
      set_system_wide_update_prompt_required GlobalSetting::SYSTEM_WIDE_UPDATE_SOFT
    
      flash[:notice] = "Printers Updated"
      redirect_to admin_global_settings_path
    else
      render admin_global_settings_path
    end
  end

  def destroy
    @printer = current_outlet.printers.find(params[:id])
    @printer.destroy

    set_system_wide_update_prompt_required GlobalSetting::SYSTEM_WIDE_UPDATE_SOFT
    
    flash[:notice] = "Printer Deleted"
    redirect_to admin_global_settings_path
  end
  
  def default
    @old_default_printer = Printer.load_default(current_outlet)
    @old_default_printer.is_default = false
    @old_default_printer.save

    @new_default_printer = current_outlet.printers.find(params[:id])
    @new_default_printer.is_default = true
    @new_default_printer.save

    set_system_wide_update_prompt_required GlobalSetting::SYSTEM_WIDE_UPDATE_SOFT
    
    render :json => {:success => true}.to_json
  end
end
