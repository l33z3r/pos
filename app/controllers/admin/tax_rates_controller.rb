class Admin::TaxRatesController < Admin::AdminController
  
  def create
    @tax_rate = TaxRate.new(params[:tax_rate])

    @tax_rate.outlet_id = current_outlet.id
    
    if @tax_rate.save
      set_system_wide_update_prompt_required GlobalSetting::SYSTEM_WIDE_UPDATE_SOFT
    
      redirect_to admin_global_settings_path, :notice => 'Tax Rate was successfully created.'
    else
      redirect_to admin_global_settings_path, :error => 'Error creating new tax rate.'
    end
  end

  def update_multiple
    @tax_rates = TaxRate.update(params[:tax_rates].keys, params[:tax_rates].values).reject { |p| p.errors.empty? }
    
    if @tax_rates.empty?
      set_system_wide_update_prompt_required GlobalSetting::SYSTEM_WIDE_UPDATE_SOFT
    
      flash[:notice] = "Tax Rates Updated"
      redirect_to admin_global_settings_path
    else
      render admin_global_settings_path
    end
  end

  def destroy
    #Don't allow deleting of last one
    if current_outlet.tax_rates.all.size == 1
      flash[:notice] = "You must have at least one tax rate"
      redirect_to admin_global_settings_path
      return
    end
    
    @tax_rate = current_outlet.tax_rates.find(params[:id])
    @tax_rate.destroy

    set_system_wide_update_prompt_required GlobalSetting::SYSTEM_WIDE_UPDATE_SOFT
    
    flash[:notice] = "Tax Rate Deleted"
    redirect_to admin_global_settings_path
  end
  
  def default
    @old_default_tax_rate = TaxRate.load_default(current_outlet)
    @old_default_tax_rate.is_default = false
    @old_default_tax_rate.save

    @new_default_tax_rate = current_outlet.tax_rates.find(params[:id])
    @new_default_tax_rate.is_default = true
    @new_default_tax_rate.save

    set_system_wide_update_prompt_required GlobalSetting::SYSTEM_WIDE_UPDATE_SOFT
    
    render :json => {:success => true}.to_json
  end
end
