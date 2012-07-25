class DeliveryController < ApplicationController

  def receive
    Delivery.transaction do
      @success = true
    
      @delivery_params = params[:delivery]
      @employee_id = @delivery_params[:employee_id]
    
      @reference_number = @delivery_params[:reference_number]
      @received_date = @delivery_params[:received_date]
      
      @delivery = Delivery.create(:employee_id => @employee_id, :total => @delivery_params[:total], 
        :reference_number => @reference_number, :received_date => @received_date)
    
      @delivery_items = @delivery_params[:items]
    
      @delivery_items.each do |index, delivery_item|
        @product_id = delivery_item[:product][:id]
        @product = Product.find_by_id(@product_id)
      
        @old_amount = @product.quantity_in_stock
        @change_amount = delivery_item[:amount]
      
        @product.quantity_in_stock = @old_amount.to_f + @change_amount.to_f
        @product.save
        
        @is_return = delivery_item[:is_return]
        @note = delivery_item[:note]
        
        @st = StockTransaction.create(
          :delivery_id => @delivery.id, :product_id => @product.id, :is_return => @is_return, :employee_id => @employee_id,
          :old_amount => @old_amount, :change_amount => @change_amount, 
          :note => @note, :transaction_type => StockTransaction::DELIVERY)
        
        @st.created_at = @st.updated_at = @delivery.received_date
        @st.save
        
        #need to modify all transactions after this delivery
        @st_modify = @product.stock_transactions.where("created_at > ?", @delivery.received_date)
        
        if !@st_modify.empty?
          @st_modify.each do |st|
            logger.info "Modifying st: #{@st.id}"
            st.old_amount += @change_amount.to_f
            st.save
          end
          #have to adjust the old_amount of the transaction we are creating here
          @prior_st = @product.stock_transactions.where("created_at <= ?", @delivery.received_date).where("id != ?", @st.id).order("created_at desc, id desc").first
          
          if @prior_st
            @st.old_amount = @prior_st.old_amount + @prior_st.change_amount
          else
            @st.old_amount = 0
          end
          
          @st.save
        end
      
      end
    
      if @success
        #send a reload request to other terminals
        request_reload_app @terminal_id
      
        render :json => {:success => true}.to_json
      else
        render :json => {:success => false}.to_json
      end
    end
  end

end
