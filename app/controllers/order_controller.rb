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
    @cash_total = CashTotal.do_total @total_type, current_employee 
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
      @order_item.tax_rate = item[:product][:tax_rate]

      @order_item_saved = @order_item_saved and @order_item.save
    end

    @success = @order_saved and @order_item_saved
    @success
  end

end
