class Admin::DiscountsController < Admin::AdminController
  
  def create
    @discount = Discount.new(params[:discount])

    @discount.outlet_id = current_outlet.id
    
    if @discount.save
      #send a reload request to other terminals
      request_sales_resources_reload @terminal_id
    
      redirect_to admin_global_settings_path, :notice => 'Discount was successfully created.'
    else
      render :action => admin_global_settings_path
    end
  end

  def update_multiple
    @discounts = Discount.update(params[:discounts].keys, params[:discounts].values).reject { |p| p.errors.empty? }
    
    if @discounts.empty?
      #send a reload request to other terminals
      request_sales_resources_reload @terminal_id
    
      flash[:notice] = "Discounts Updated!"
      redirect_to admin_global_settings_path
    else
      render admin_global_settings_path
    end
  end

  def destroy
    #send a reload request to other terminals
    request_sales_resources_reload @terminal_id
    
    @discount = current_outlet.discounts.find(params[:id])
    @discount.destroy

    flash[:notice] = "Discount Deleted!"
    redirect_to admin_global_settings_path
  end
  
  def default
    @old_default_discount = Discount.load_default(current_outlet)
    @old_default_discount.is_default = false
    @old_default_discount.save

    @new_default_discount = current_outlet.discounts.find(params[:id])
    @new_default_discount.is_default = true
    @new_default_discount.save

    render :json => {:success => true}.to_json
  end
end
