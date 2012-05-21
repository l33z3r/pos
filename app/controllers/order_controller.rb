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
    
    @cash_total_obj, @cash_total, @cash_total_data = CashTotal.do_total @total_type, @commit, @cash_count, current_employee, @terminal_id
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
      
      @card_charge_details = @order_details.delete(:card_charge)
    
      @is_split_bill_order_param = @order_params.delete(:is_split_bill)
      
      @loyalty_details = @order_details.delete(:loyalty)
    
      @is_split_bill_order = @is_split_bill_order_param == "true"
    
      @order = Order.new(@order_params)
    
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
        
        #oias
        if item[:oia_items]
          item[:oia_items].each do |index, oia|
            if !@order_item.is_void and oia[:product_id] != "-1" and !oia[:product_id].blank?
              #decrement stock for this oia product
              @oia_stock_usage = @order_item.quantity.to_f
      
              if(@order_item.is_double)
                @oia_stock_usage *= 2
              end
      
              Product.find_by_id(oia[:product_id]).decrement_stock @oia_stock_usage
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
      
        #this happens for every item
        @order_item_saved = @order_item_saved and @order_item.save
      
        @item_stock_usage = @order_item.quantity.to_f
      
        if(@order_item.is_double)
          @item_stock_usage *= 2
        end
      
        if !@order_item.is_void
          #decrement the stock for this item
          if @order_item.product.is_stock_item
            @order_item.product.decrement_stock @item_stock_usage
          else
            #decrement the ingredient stock
            @order_item.product.ingredients.each do |ingredient|
              @ingredient_usage = ingredient.stock_usage
              ingredient.product.decrement_stock @item_stock_usage * @ingredient_usage
            end
          end
        end
      end
      
      #record a card charge if there was one
      if @card_charge_details
        @card_charge_payment_method = @card_charge_details[:paymentMethod]
        @card_charge_amount = @card_charge_details[:amount]
        
        CardTransaction.create({
            :order_id => @order.id, 
            :payment_method => @card_charge_payment_method, 
            :amount => @card_charge_amount})
      end
      
      #was the loyalty system used
      if @loyalty_details
        @loyalty_customer = Customer.find_by_id(@loyalty_details[:customer_id])
        
        if @loyalty_customer
          if @order_details[:split_payments][:loyalty]
            @points_per_currency_unit = GlobalSetting.parsed_setting_for GlobalSetting::LOYALTY_POINTS_PER_CURRENCY_UNIT
            @points_used_this_sale = @order_details[:split_payments][:loyalty].to_f * @points_per_currency_unit
            logger.info("!!!!!!!!!!!!!!!!!!!!!!!Decrementing points by #{@points_used_this_sale}")
            @loyalty_customer.decrement!(:available_points, @points_used_this_sale.to_f)
            
            CustomerPointsAllocation.create({:customer_id => @loyalty_customer.id, :order_id => @order.id, 
              :amount => @points_used_this_sale * -1, :loyalty_level_percent => @loyalty_customer.loyalty_level.percent})
          end
          
          @points_earned = @loyalty_details[:points_earned]
          CustomerPointsAllocation.create({:customer_id => @loyalty_customer.id, :order_id => @order.id, 
              :amount => @points_earned, :loyalty_level_percent => @loyalty_customer.loyalty_level.percent})
          
          @loyalty_customer.increment!(:available_points, @points_earned.to_f)
        end
      end
    
      @table_info = TableInfo.find_by_id(@order.table_info_id)
    
      #must tell all terminals that this order is cleared
      #only do this if that table still exists!
      if @order.is_table_order and @table_info and !@is_split_bill_order
        @employee_id = @order_params['employee_id']
        do_request_clear_table_order @terminal_id, now_millis, @order.table_info_id, @order.order_num, @employee_id
      end

      @success = @order_saved and @order_item_saved
    
      @success
    end
  end

end
