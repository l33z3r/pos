class Admin::PaymentMethodsController < Admin::AdminController
  
  def create
    @payment_method = PaymentMethod.new(params[:payment_method])

    if @payment_method.save
      redirect_to admin_global_settings_path, :notice => 'Payment Method was successfully created.'
    else
      render :action => admin_global_settings_path
    end
  end

  def update_multiple
    @payment_methods = PaymentMethod.update(params[:payment_methods].keys, params[:payment_methods].values).reject { |p| p.errors.empty? }
    
    if @payment_methods.empty?
      #make sure that the default payment method is set within the bounds
      @dpm = PaymentMethod.load_default
      
      if !@dpm.can_be_default?
        @dpm.is_default = false
        @dpm.save
        PaymentMethod.load_default
        
        flash[:notice] = "Payment Methods Updated! Note that the default payment method has been set to cash as the one you chose is not eligible for default"
      else 
        flash[:notice] = "Payment Methods Updated!"
      end
      
      redirect_to admin_global_settings_path
    else
      render admin_global_settings_path
    end
  end

  def destroy
    #Don't allow deleting of last one
    if PaymentMethod.all.size == 1
      flash[:notice] = "You must have at least one payment method!"
      redirect_to admin_global_settings_path
      return
    end
    
    @payment_method = PaymentMethod.find(params[:id])
    @payment_method.destroy

    flash[:notice] = "Payment Method Deleted!"
    redirect_to admin_global_settings_path
  end
  
  def default
    @old_default_payment_method = PaymentMethod.load_default
    @old_default_payment_method.is_default = false
    @old_default_payment_method.save

    @new_default_payment_method = PaymentMethod.find(params[:id])
    @new_default_payment_method.is_default = true
    @new_default_payment_method.save

    render :json => {:success => true}.to_json
  end
end
