class Reports::GlancesController < ApplicationController
  layout 'reports'
  def index
    @selected_to_date = @selected_from_date = Date.today   
    glances_search
  end

  def glances_search
    @all_terminals = all_terminals
    get_sales_data
    @voided_orders = get_voided_orders
    iterate_orders
    calculate_summary    
    if !@orders.nil? and !@orders.empty?
      create_sales_per_hour_graph
      get_busiest_hour
    end
  end

  def iterate_orders
    @sales_per_hour = Hash.new { |h,k| h[k] = 0.0 }
    @items_per_hour = Hash.new { |h,k| h[k] = [0,0.0] }
    @sales_by_payment_type = Hash.new { |h,k| h[k] = 0.0 }
    @total_discount =  @average_sale =  @total_of_sales =  @cash_paid_out_total =  @sales_last_7_days_total = @sales_by_payment_total = @sales_by_server_total = @sales_by_department_total = 0.0
    @voided_sales = @number_of_sales = 0
    @sales_by_server = Hash.new { |h,k| h[k] = 0.0 }
    @top_selling_items = Hash.new { |h,k| h[k] = ["",0,0.0] }
    @sales_by_department = Hash.new { |h,k| h[k] = 0.0 }
    @sales_last_7_days = Hash.new { |h,k| h[k] = ["",0.0] }

    for order in @orders
      if !order.is_void
        #iterate order items
        iterate_order_items(order)
        #sales per hour for graph
        calculate_sales_per_hour(order)
        #sales by payment type
        calculate_sales_by_payment_type(order)
        #by server
        calculate_sales_by_server(order)
        #misca data
        calculate_misc_values(order)
      else
        @voided_sales += 1
      end
    end
    @top_selling_items = @top_selling_items.sort_by { |k, v| v[1] }.reverse.first(5)
  end

  def get_busiest_hour
    if !@items_per_hour.nil? and !@items_per_hour.empty?
      @busiest_hour = @items_per_hour.sort_by { |k, v| v }.reverse.first[0]
    end
  end

  def calculate_misc_values order
    @number_of_sales += 1
    @total_of_sales += order.total
    @average_sale = @total_of_sales / @number_of_sales
    if !order.pre_discount_price.nil? and !order.discount_percent.eql?(0)
      @total_discount += order.pre_discount_price - order.total
    end
  end

  def calculate_summary
    date_to = Date.today.prev_day(1).tomorrow.midnight
    date_from = Date.today.prev_day(7)
    @orders = Order.where("created_at >= ? AND created_at < ?", date_from, date_to)
    for order in @orders
      if(@sales_last_7_days[order.created_at.to_date.to_s][0].eql?(""))
        @sales_last_7_days[order.created_at.to_date.to_s][0] = order.created_at.to_date.strftime("%A")
      end
      @sales_last_7_days[order.created_at.to_date.to_s][1] += order.total
      @sales_last_7_days_total += order.total
    end
  end

  def calculate_sales_by_server order
    @sales_by_server[order.employee.nickname] += order.total
    @sales_by_server_total += order.total
  end

  def calculate_sales_by_payment_type order
    @sales_by_payment_type[order.payment_type] += order.total
    @sales_by_payment_total += order.total
  end

  def calculate_sales_per_hour order
    order_hour = order.created_at.strftime('%Y-%m-%d %H:%M:%S').to_time.hour
#    if(order_hour % 2 != 0)
#      order_hour -= 1
#    end
    @sales_per_hour[order_hour] += order.total
    @sales_per_hour[order_hour] = @sales_per_hour[order_hour].round(2)
  end

  def iterate_order_items order
    for order_item in order.order_items
      calculate_top_selling_items(order_item)
      calculate_items_by_hour(order_item)
      calculate_sales_by_department(order_item)
      calculate_discount_by_item(order_item)
    end
  end

  def calculate_discount_by_item order_item
    if !order_item.pre_discount_price.nil? and order_item.discount_percent > 0
      @total_discount += order_item.pre_discount_price - order_item.total_price
    end
  end

  def calculate_top_selling_items order_item
    @top_selling_items[order_item.product_id][0] = order_item.product_name
    @top_selling_items[order_item.product_id][1] += order_item.quantity.to_i
    @top_selling_items[order_item.product_id][2] += order_item.total_price 
  end

  def calculate_items_by_hour order_item
    order_hour = order_item.order.created_at.strftime('%Y-%m-%d %H:%M:%S').to_time.hour
    @items_per_hour[order_hour][0] += order_item.quantity.to_i
    @items_per_hour[order_hour][1] += order_item.total_price
  end

  def calculate_sales_by_department order_item
    if order_item.product and order_item.product.category and order_item.product.category.parent_category
      department_name = order_item.product.category.parent_category.name
    else
      department_name = "No Dept."
    end
    @sales_by_department[department_name] += order_item.total_price 
    @sales_by_department_total += order_item.total_price 
  end

  def create_sales_per_hour_graph
    values = Array.new
    for item in @sales_per_hour.sort_by { |k, v| k }
      values.push(item[1])
    end
    @graph = LazyHighCharts::HighChart.new('graph') do |f|
      f.options[:chart][:defaultSeriesType] = "line"
      f.options[:chart][:animation] = true
      f.options[:title][:text] = "Sales Per Hour"
      f.options[:xAxis][:categories] = @sales_per_hour.keys.sort
      f.options[:yAxis][:min] = "0"
      f.options[:yAxis][:max] = @sales_per_hour.values.max_by { |obj| obj }
      f.options[:yAxis][:title][:text] = "Total (Euros)"
      f.series(:name=>'Sales', :data=> values )
    end
  end

  def get_voided_orders

  end

  def get_sales_data
    #must push the "to" date forward a day to match today
    if params[:search] and params[:search][:created_at_lte] and !params[:search][:created_at_lte].empty?
     @selected_to_date = params[:search][:created_at_lte]
     params[:search][:created_at_lte] = @selected_to_date.to_date.tomorrow.midnight
    end
    if !params[:search]
      @orders = Order.where("created_at >= ? AND created_at < ?", @selected_from_date, @selected_to_date.to_date.tomorrow.midnight)
    else
      @orders = Order.search(params[:search])
    end
  end
end