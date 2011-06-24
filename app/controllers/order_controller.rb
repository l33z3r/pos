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
      render :inline => "{success : true}"
    else
      render :inline => "{success : false}"
    end
  end
  
  def cash_total
    @total_type = params[:total_type]
    @cash_total, @cash_total_data = CashTotal.do_total @total_type, current_employee, @terminal_id
  end
  
  def sync_table_order
    @table_order_data = params[:tableOrderData]
    @employee_id = params[:employee_id]
    
    @table_id = @table_order_data['tableID']
    
    do_request_sync_table_order @terminal_id, Time.now.to_i, @table_order_data, @table_id, @employee_id
    render :json => {:success => true}.to_json
  end

  private

  def create_order order_params
    @order_params = order_params

    @order_details = @order_params.delete(:order_details)
    @order = Order.new(@order_params)

    @order_saved = @order.save

    @order_item_saved = true

    #build order items
    @order_details[:items].each do |index, item|
      @order_item = @order.order_items.build
      @order_item.employee_id = item[:serving_employee_id]

      @order_item.product_id = item[:product][:id]

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

      @order_item_saved = @order_item_saved and @order_item.save
    end
    
    #must tell all terminals that this order is cleared
    if @order.is_table_order
      @employee_id = @order_params['employee_id']
      do_request_clear_table_order @terminal_id, Time.now.to_i, @order.table_info_id, @employee_id
    end

    @success = @order_saved and @order_item_saved
    @success
  end

end
