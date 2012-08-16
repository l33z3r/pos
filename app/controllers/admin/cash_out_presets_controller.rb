class Admin::CashOutPresetsController < Admin::AdminController
  
  def create
    @cash_out_preset = CashOutPreset.new(params[:cash_out_preset])

    @cash_out_preset.outlet_id = current_outlet.id
    
    if @cash_out_preset.save
      redirect_to admin_global_settings_path, :notice => 'Cash Out Preset was successfully created.'
    else
      redirect_to admin_global_settings_path, :error => 'Error creating new Cash Out Preset.'
    end
  end

  def update_multiple
    @cash_out_presets = CashOutPreset.update(params[:cash_out_presets].keys, params[:cash_out_presets].values).reject { |p| p.errors.empty? }
    
    if @cash_out_presets.empty?
      flash[:notice] = "Cash Out Presets Updated!"
      redirect_to admin_global_settings_path
    else
      render admin_global_settings_path
    end
  end

  def destroy
    @cash_out_preset = current_outlet.cash_out_presets.find(params[:id])
    @cash_out_preset.destroy

    flash[:notice] = "Cash Out Preset Deleted!"
    redirect_to admin_global_settings_path
  end
end
