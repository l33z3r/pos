class DeliveryController < ApplicationController

  def receive
    Delivery.transaction do
      @success = true
    
      @delivery_params = params[:delivery]
      @employee_id = @delivery_params[:employee_id]
    
      @delivery = Delivery.create(:employee_id => @employee_id, :total => @delivery_params[:total])
    
      @delivery_items = @delivery_params[:items]
    
      @delivery_items.each do |index, delivery_item|
        @product_id = delivery_item[:product][:id]
        @product = Product.find_by_id(@product_id)
      
        @old_amount = @product.quantity_in_stock
        @change_amount = delivery_item[:amount]
      
        @product.quantity_in_stock = @old_amount.to_f + @change_amount.to_f
        @product.save
        
        @is_return = delivery_item[:is_return]
      
        @st = StockTransaction.create(
          :delivery_id => @delivery.id, :product_id => @product.id, :is_return => @is_return, :employee_id => @employee_id,
          :old_amount => @old_amount, :change_amount => @change_amount, :transaction_type => StockTransaction::DELIVERY)
      end
    
      if @success
        render :json => {:success => true}.to_json
      else
        render :json => {:success => false}.to_json
      end
    end
  end

end
