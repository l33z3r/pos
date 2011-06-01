class Admin::TaxRatesController < Admin::AdminController
  
  def create
    @tax_rate = TaxRate.new(params[:tax_rate])

    if @tax_rate.save
      redirect_to admin_global_settings_path, :notice => 'Tax Rate was successfully created.'
    else
      render :action => admin_global_settings_path
    end
  end

  def update_multiple
    @tax_rates = TaxRate.update(params[:tax_rates].keys, params[:tax_rates].values).reject { |p| p.errors.empty? }
    
    if @tax_rates.empty?
      flash[:notice] = "Tax Rates Updated!"
      redirect_to admin_global_settings_path
    else
      render admin_global_settings_path
    end
  end

  def destroy
    @tax_rate = TaxRate.find(params[:id])
    @tax_rate.destroy

    flash[:notice] = "Tax Rate Deleted!"
    redirect_to admin_global_settings_path
  end
  
  def default
    @old_default_tax_rate = TaxRate.load_default
    @old_default_tax_rate.is_default = false
    @old_default_tax_rate.save

    @new_default_tax_rate = TaxRate.find(params[:id])
    @new_default_tax_rate.is_default = true
    @new_default_tax_rate.save

    render :json => {:success => true}.to_json
  end
end