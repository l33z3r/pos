class OrderController < ApplicationController

  def create
    @success = create_order(params[:order])
  end

  def create_outstanding
    @orders = params[:orders]

    @success = true

    @orders.each do |key, order|
      @success = @success and create_order(order)
    end

    if @success
      render :json => {:success => true}.to_json
    else
      render :json => {:success => false}.to_json
    end
  end
  
  def cash_total
    @total_type = params[:total_type]
    
    @commit = params[:commit]
    
    if @commit
      @commit = (@commit.to_s == "true")
    else
      @commit = false
    end
    
    @cash_count = params[:cash_count]
    
    if(!@cash_count)
      @cash_count = 0
    end
    
    @cash_count = @cash_count.to_f
    
    @open_orders_total = params[:open_orders_total]
    
    @open_orders_total = @open_orders_total.to_f
    
    @cash_total_obj, @cash_total, @cash_total_data = CashTotal.do_total @total_type, @commit, @cash_count, @open_orders_total, current_employee, @terminal_id
  end

  def add_float
    @float_amount = params[:float_total]
    CashTotal.do_add_float current_employee, @terminal_id, @float_amount
    render :json => {:success => true}.to_json
  end
  
  def float_history
    @last_z_total, @previous_floats = CashTotal.floats_since_last_z_total @terminal_id
  end
  
  def cash_total_history
    @last_z_total, @previous_floats = CashTotal.floats_since_last_z_total @terminal_id
    @previous_x_totals = CashTotal.all_cash_totals CashTotal::X_TOTAL, @terminal_id
  end
  
  def sync_table_order
    @table_order_data = params[:tableOrderData]
    @order_num = @table_order_data[:orderData][:order_num]
    
    @table_id = @table_order_data['tableID']
    
    @error = false
    
    #check if this order has been cashed out already but let the table 0 order through
    if @table_id != "0" and @order_num 
      if Order.find_by_order_num @order_num
        #this order has already been cashed, so do nothing...
        logger.info "Order has already been cashed. Ignoring..."
        @error = true
        @message = "This order (##{@order_num}) has already been cashed"
        render and return
      end
    end
    
    @employee_id = params[:employee_id]
    
    #make sure the table still exists in the system as it will cause a weird error if not
    @table = TableInfo.find_by_id(@table_id)
    
    @employee = Employee.find_by_id(@employee_id)
    
    @last_sync_time = params[:lastSyncTableOrderTime]
    @retry = false
    
    if @table and @employee
      @retry = do_request_sync_table_order(@terminal_id, @table_order_data, @table_id, @employee_id, @last_sync_time)
    else
      @error = true
      @message = "Table or employee does not exist"
      render and return
    end
  end
  
  def delete_table_order
    @table_id = params[:table_id]
    @table = TableInfo.find_by_id(@table_id)
      
    if @table
      @order_num = params[:order_num]
      do_request_clear_table_order @terminal_id, now_millis, @table_id, @order_num, e
    end
    
    render :json => {:success => true}.to_json
  end
  
  def cash_out
    @description = params[:description]
    @amount = params[:amount]
    
    CashOut.create(:terminal_id => @terminal_id, :amount => @amount, :note => @description)
    
    render :json => {:success => true}.to_json
  end
  
  def transfer_order
    @error = false
    
    @table_from_id = params[:table_from_id]
    
    @table_to_id = params[:table_to_id]
    @table_to = TableInfo.find_by_id(@table_to_id)
    
    if @table_to
      if @table_from_id.to_i != 0 and @table_from_id.to_i != -1 and @table_from_id.to_i != -2
        @table_from = TableInfo.find_by_id(@table_from_id)      
    
        if @table_from
          @table_from_order_num = params[:table_from_order_num] 
          do_request_clear_table_order @terminal_id, now_millis, @table_from_id, @table_from_order_num, e
        else
          @error = true
        end
      end
    else
      @error = true
    end
  end

  private

  def create_order order_params
    Order.transaction do
      @order_params = order_params
      @order_details = @order_params.delete(:order_details)
    
      #make sure we have not already cashed this order out. 
      #We use a combination of terminal ID and time started to uniquely identify orders
      @existing_order = Order.where("terminal_id = ?", @terminal_id).where("time_started = ?", order_params["time_started"])
      
      if !@existing_order.empty?
        #simply ignore the order
        logger.info "Ignoring existing order"
        return true
      end
      
      @card_charge_details = @order_details.delete(:card_charge)
    
      @is_split_bill_order_param = @order_params.delete(:is_split_bill)
      @is_training_mode_sale_order_param = @order_params.delete(:is_training_mode_sale)
      
      @loyalty_details = @order_details.delete(:loyalty)
      @customer_details = @order_details.delete(:customer)
    
      @is_split_bill_order = @is_split_bill_order_param == "true"      
    
      @order = Order.new(@order_params)
    
      #pick up if this is a training mode sale or not      
      @is_training_mode_sale = @is_training_mode_sale_order_param == "true"
      @order.training_mode_sale = @is_training_mode_sale
      
      @deduct_stock_during_training_mode = GlobalSetting.parsed_setting_for GlobalSetting::DEDUCT_STOCK_DURING_TRAINING_MODE
      
      if(!Employee.find_by_id(@order.employee_id))
        #employee id not set correctly, so just grab the last active employee
        @order.employee_id = Employee.order("last_active desc").first
      end
    
      if !@order.order_num or @order.order_num.to_s.length == 0
        @order.order_num = Order.next_order_num
      end
    
      #is this a re initiailised previous order?
      if @order.void_order_id
        @order_to_void = Order.find(@order.void_order_id)
        @order_to_void.is_void = true
        @order_to_void.save
        
        #do we need to post a refund to zalion
        
        
        
        #do we need to post a refund to an account
        if @order_to_void.customer_transaction
          @customer = @order_to_void.customer_transaction.customer
        
          CustomerTransaction.create({:transaction_type => CustomerTransaction::REFUND,
              :refund_order_id => @order_to_void.id, :customer_id => @customer.id, :terminal_id => @terminal_id,
              :abs_amount => @order_to_void.total, :actual_amount => @order_to_void.total, :is_credit => true
            })
        
          @customer.current_balance = @customer.current_balance - @order_to_void.total 
          @customer.save
        end
      end

      @order_saved = @order.save
      @order.reload

      @order_item_saved = true

      #build order items
      @order_details[:items].each do |index, item|
        @order_item = @order.order_items.build
        @order_item.employee_id = item[:serving_employee_id]

        @order_item.product_id = item[:product][:id]
        @order_item.product_name = item[:product][:name]

        @order_item.quantity = item[:amount]
        @order_item.total_price = item[:total_price]

        @order_item.terminal_id = item[:terminal_id]
      
        #modifier
        if item[:modifier]
          @order_item.modifier_name = item[:modifier][:name]
          @order_item.modifier_price = item[:modifier][:price]
        end
      
        @order_item.is_void = item[:is_void] == "true"
        
        if @order_item.is_void
          @order_item.void_employee_id = item[:void_employee_id]
        end
        
        @order_item.is_refund = item[:is_refund] == "true"
        
        #oias
        if item[:oia_items]
          item[:oia_items].each do |index, oia|
            if !@is_training_mode_sale or @deduct_stock_during_training_mode
              if !@order_item.is_void and oia[:product_id] != "-1" and !oia[:product_id].blank?
                #decrement stock for this oia product
                @oia_stock_usage = @order_item.quantity.to_f
      
                if @order_item.is_double
                  @oia_stock_usage *= 2
                elsif @order_item.is_half
                  @oia_stock_usage /= 2
                end
      
                @oia_product = Product.find_by_id(oia[:product_id])
      
                @old_stock_amount = @oia_product.quantity_in_stock
                @actual_stock_usage = @oia_product.decrement_stock @oia_stock_usage
                
                #build a stock_transaction
                @st = @order_item.stock_transactions.build(:transaction_type => StockTransaction::SALE, 
                  :employee_id => @order_item.employee_id, :product_id => @oia_product.id,
                  :old_amount => @old_stock_amount, :change_amount => (-1 * @actual_stock_usage))
              
                @st.save
              end
            end
          end
        
          #store this hash of oia items
          @order_item.oia_data = item[:oia_items]
        end
      
        #discount
        if item[:discount_percent]
          @order_item.discount_percent = item[:discount_percent]
          @order_item.pre_discount_price = item[:pre_discount_price]
        end
      
        #tax rate
        @order_item.tax_rate = item[:tax_rate]
      
        #the time it was added to the order
        @order_item.time_added = item[:time_added]

        #do we want to show the serveraddeditem text
        @order_item.show_server_added_text = item[:showServerAddedText]
      
        @order_item.is_double = item[:is_double]
        @order_item.is_half = item[:is_half]
      
        @item_stock_usage = @order_item.quantity.to_f
      
        if @order_item.is_double
          @item_stock_usage *= 2
        elsif @order_item.is_half
          @item_stock_usage /= 2
        end
      
        if !@is_training_mode_sale or @deduct_stock_during_training_mode
          if !@order_item.is_void
            #decrement the stock for this item
            if @order_item.product.is_stock_item
              @old_stock_amount = @order_item.product.quantity_in_stock
              @actual_stock_usage = @order_item.product.decrement_stock @item_stock_usage
              
              #build a stock_transaction
              @st = @order_item.stock_transactions.build(:transaction_type => StockTransaction::SALE, 
                :employee_id => @order_item.employee_id, :product_id => @order_item.product.id,
                :old_amount => @old_stock_amount, :change_amount => (-1 * @actual_stock_usage))
              
              @st.save
            end
            
            #decrement the ingredient stock
            @order_item.product.ingredients.each do |ingredient|
              if ingredient.product.is_stock_item
                @old_stock_amount = ingredient.product.quantity_in_stock
              
                @ingredient_usage = ingredient.stock_usage
                @actual_stock_usage = ingredient.product.decrement_stock @item_stock_usage * @ingredient_usage
                
                #build a stock_transaction
                @st = @order_item.stock_transactions.build(:transaction_type => StockTransaction::SALE, 
                  :employee_id => @order_item.employee_id, :product_id => ingredient.product.id,
                  :old_amount => @old_stock_amount, :change_amount => (-1 * @actual_stock_usage))
              
                @st.save
              end
            end
          end
        end
        
        #this happens for every item
        @order_item_saved = @order_item_saved and @order_item.save
      end
      
      #record a card charge if there was one
      if @card_charge_details
        @card_charge_payment_method = @card_charge_details[:paymentMethod]
        @card_charge_amount = @card_charge_details[:amount]
        @card_charge_reference_number = @card_charge_details[:reference_number]
        
        CardTransaction.create({
            :order_id => @order.id, 
            :payment_method => @card_charge_payment_method, 
            :amount => @card_charge_amount,
            :reference_number => @card_charge_reference_number})
      end
      
      #was the loyalty system used
      if @loyalty_details
        @loyalty_customer = Customer.find_by_id(@loyalty_details[:customer_id])
        
        if @loyalty_customer
          if @order_details[:split_payments][:loyalty]
            @points_per_currency_unit = GlobalSetting.parsed_setting_for GlobalSetting::LOYALTY_POINTS_PER_CURRENCY_UNIT
            @points_used_this_sale = @order_details[:split_payments][:loyalty].to_f * @points_per_currency_unit
            
            @loyalty_customer.decrement!(:available_points, @points_used_this_sale.to_f)
            
            CustomerPointsAllocation.create({:customer_id => @loyalty_customer.id, :order_id => @order.id, 
                :allocation_type => CustomerPointsAllocation::SALE_REDUCE, :amount => @points_used_this_sale * -1, 
                :loyalty_level_percent => @loyalty_customer.loyalty_level.percent})
          end
          
          @points_earned = @loyalty_details[:points_earned]
          CustomerPointsAllocation.create({:customer_id => @loyalty_customer.id, :order_id => @order.id, 
              :allocation_type => CustomerPointsAllocation::SALE_EARN, :amount => @points_earned, 
              :loyalty_level_percent => @loyalty_customer.loyalty_level.percent})
          
          @loyalty_customer.increment!(:available_points, @points_earned.to_f)
        end
      end
      
      if @customer_details
        @customer = Customer.find_by_id(@customer_details[:customer_id])
        
        @customer.current_balance = @customer.current_balance + @order.total 
        @customer.save
        
        CustomerTransaction.create({:transaction_type => CustomerTransaction::CHARGE,
            :order_id => @order.id, :customer_id => @customer.id, :terminal_id => @terminal_id,
            :abs_amount => @order.total, :actual_amount => @order.total, 
            :is_credit => false, :closing_balance => @customer.current_balance})          
      end
    
      @table_info = TableInfo.find_by_id(@order.table_info_id)
    
      #must tell all terminals that this order is cleared
      #only do this if that table still exists!
      if @order.is_table_order and @table_info and !@is_split_bill_order
        @employee_id = @order_params['employee_id']
        do_request_clear_table_order @terminal_id, now_millis, @order.table_info_id, @order.order_num, @employee_id
        
        #record the room number in the order
        @order.room_id = @table_info.room_object.room.id
        @order.save
      end

      @success = @order_saved and @order_item_saved
    
      @success
    end
  end

end
