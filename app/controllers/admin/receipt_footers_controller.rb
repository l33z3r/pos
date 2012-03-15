class Admin::ReceiptFootersController < Admin::AdminController
  
  def create
    @receipt_footer = ReceiptFooter.new(params[:receipt_footer])

    if @receipt_footer.save
      redirect_to admin_global_settings_path, :notice => 'Receipt Footer was successfully created.'
    else
      render :action => admin_global_settings_path
    end
  end

  def update_multiple
    @receipt_footers = ReceiptFooter.update(params[:receipt_footers].keys, params[:receipt_footers].values).reject { |p| p.errors.empty? }
    
    if @receipt_footers.empty?
      flash[:notice] = "Receipt Footers Updated!"
      redirect_to admin_global_settings_path
    else
      render admin_global_settings_path
    end
  end

  def destroy
    @receipt_footer = ReceiptFooter.find(params[:id])
    @receipt_footer.destroy

    flash[:notice] = "Receipt Footer Deleted!"
    redirect_to admin_global_settings_path
  end
end
