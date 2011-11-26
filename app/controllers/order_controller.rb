class OrderController < ApplicationController

  def create
    @success = create_order(params[:order])

    if @success
      render :json => {:success => true}.to_json
    else
      render :json => {:success => false}.to_json
    end
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

  private

  def create_order order_params
    @order_params = order_params

    @order_details = @order_params.delete(:order_details)
    @order = Order.new(@order_params)
    
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
      
      #this happens for every item
      @order_item_saved = @order_item_saved and @order_item.save
      
      #decrement the stock for this item
      @order_item.product.decrement_stock @order_item.quantity.to_f
    end
    
    #must tell all terminals that this order is cleared
    #skip it if it is a table order with id 0 as that is a previous order
    if @order.is_table_order and @order.table_info_id != 0
      @employee_id = @order_params['employee_id']
      do_request_clear_table_order @terminal_id, Time.now.to_i, @order.table_info_id, @order.order_num, @employee_id
    end

    @success = @order_saved and @order_item_saved
    @success
  end

end
