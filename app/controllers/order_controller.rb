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
    
    if @order_num 
      if Order.find_by_order_num @order_num
        #this order has already been cashed, so do nothing...
        logger.info "Order has already been cashed. Ignoring..."
        render :json => {:success => false}.to_json and return
      end
    end
    
    @employee_id = params[:employee_id]
    
    @table_id = @table_order_data['tableID']
    
    #make sure the table still exists in the system as it will cause a weird error if not
    @table = TableInfo.find_by_id(@table_id)
    
    @employee = Employee.find_by_id(@employee_id)
    
    if @table and @employee
      do_request_sync_table_order @terminal_id, @table_order_data, @table_id, @employee_id
      render :json => {:success => true}.to_json
    else
      render :json => {:success => false}.to_json
    end
  end
  
  def transfer_order
    @error = false
    
    @table_from_id = params[:table_from_id]
    
    @table_to_id = params[:table_to_id]
    @table_to = TableInfo.find(@table_to_id)
    
    if @table_to
      if @table_from_id.to_i != 0
        @table_from = TableInfo.find(@table_from_id)      
    
        if @table_from
          @table_from_order_num = params[:table_from_order_num] 
          do_request_clear_table_order @terminal_id, Time.now.to_i, @table_from_id, @table_from_order_num, e
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
    @order_params = order_params

    @order_details = @order_params.delete(:order_details)
    @charged_room = @order_params.delete(:charged_room)
    
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
      
      #oias
      if item[:oia_items]
        item[:oia_items].each do |index, oia|
          if oia[:product_id] != "-1"
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
      
      #decrement the stock for this item
      @order_item.product.decrement_stock @item_stock_usage
    end
    
    @table_info = TableInfo.find_by_id(@order.table_info_id)
    
    #must tell all terminals that this order is cleared
    #only do this if that table still exists!
    if @order.is_table_order and @table_info
      @employee_id = @order_params['employee_id']
      do_request_clear_table_order @terminal_id, Time.now.to_i, @order.table_info_id, @order.order_num, @employee_id
    end

    @success = @order_saved and @order_item_saved
    
    #store a client transaction if this sale was linked to a charged_room
    if @charged_room
      @client_name = @charged_room['selected_folio_name']
      @payment_integration_type_id = @charged_room['payment_integration_type_id']
      
      @transaction_data = {
        :selected_room_number => @charged_room['selected_room_number'],
        :selected_folio_number => @charged_room['selected_folio_number']
      }
      
      @ct = ClientTransaction.create(
        :order_id => @order.id, 
        :client_name => @client_name, 
        :transaction_data => @transaction_data,
        :payment_integration_type_id => @payment_integration_type_id
      )
    end
    
    @success
  end

end
