class Reports::GlancesController < Admin::AdminController
  
  before_filter :check_logged_in

  layout 'reports'

  def index
    glances_search
    last_z_total
  end

  def last_z_total
    @last_z_total = CashTotal.where("total_type = ?","Z").order("created_at DESC").first
    @last_z_total_by = @last_z_total.employee.nickname
    @last_z_total_date = @last_z_total.created_at.to_date.strftime("%d %b %Y")
    @last_z_total_time = @last_z_total.created_at.to_time.strftime("%H:%M")
  end

  def glances_search
    @opening_time = GlobalSetting.parsed_setting_for GlobalSetting::EARLIEST_OPENING_HOUR
    @closing_time = GlobalSetting.parsed_setting_for GlobalSetting::LATEST_CLOSING_HOUR
    @selected_from_date = Date.today.midnight + @opening_time.hours
    @selected_to_date = Date.tomorrow.midnight + @closing_time.hours
    @all_terminals = all_terminals
   # get_sales_data
    @orders = get_sales_data
    iterate_orders(@orders)
    calculate_summary    
    if !@orders.nil?
      create_sales_per_hour_graph
      get_busiest_hour
    end
  end

  def iterate_orders orders
    @sales_per_hour = Hash.new { |h,k| h[k] = 0.0 }
    @items_per_interval_hour = Hash.new { |h,k| h[k] = [0,0.0] }
    @items_per_hour = Hash.new { |h,k| h[k] = [0,0.0] }
    @sales_by_payment_type = Hash.new { |h,k| h[k] = 0.0 }
    @total_discount = 0.0
    @average_sale = 0.0
    @total_of_sales = 0.0
    @cash_paid_out_total = 0.0
    @sales_last_7_days_total = 0.0
    @sales_by_payment_total = 0.0
    @sales_by_server_total = 0.0
    @sales_by_department_total = 0.0
    @voided_sales = @number_of_sales = 0
    @sales_by_server = Hash.new { |h,k| h[k] = 0.0 }
    @top_selling_items = Hash.new { |h,k| h[k] = ["",0,0.0] }
    @sales_by_department = Hash.new { |h,k| h[k] = 0.0 }
    @sales_last_7_days = Hash.new { |h,k| h[k] = ["",0.0] }
    
    for order in orders
      if !order.is_void and check_interval_hour(order)
        #iterate order items
        iterate_order_items(order)
        #sales per hour for graph
        calculate_sales_per_hour(order)
        #sales by payment type
        calculate_sales_by_payment_type(order)
        #by server
        calculate_sales_by_server(order)
        #misc data
        calculate_misc_values(order)
      else
        @voided_sales += 1
      end
    end
    @top_selling_items = @top_selling_items.sort_by { |k, v| v[1] }.reverse.first(5)
  end

  def check_interval_hour order
    if @hour_interval_from.nil? and @hour_interval_to.nil?
      logger.info "ACAAAAAAAAAAA-1"    
      return true
    else
      order_hour = order.created_at.hour
      if @hour_interval_from.nil? and order_hour.to_i < @hour_interval_to.to_i
        logger.info "ACAAAAAAAAAAA-2"
        return true
      elsif @hour_interval_to.nil? and order_hour.to_i >= @hour_interval_from.to_i
        logger.info "ACAAAAAAAAAAA-3"
        return true
      elsif order_hour.to_i >= @hour_interval_from.to_i and order_hour.to_i < @hour_interval_to.to_i
        logger.info "ACAAAAAAAAAAA-4"
        return true
      end
    end
    logger.info "###########################}}"
    logger.info "#{order_hour.to_i}"
    logger.info "#{@hour_interval_from.to_i}"
    logger.info "#{@hour_interval_to.to_i}"
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
    date_to = Date.today.tomorrow.midnight + @closing_time.hours
    date_from = Date.today.prev_day(6).midnight + @opening_time.hours
    @summary_orders = Order.where("created_at >= ? AND created_at < ? AND is_void = ?", date_from, date_to, false)
    for order in @summary_orders
      #check if the order is of the past day after 24 hs
      if order.created_at.to_time.strftime("%H").to_i < @opening_time
        order.created_at = order.created_at.to_date - 1.day
      end
      if(@sales_last_7_days[order.created_at.to_date.to_s][0].eql?(""))
        @sales_last_7_days[order.created_at.to_date.to_s][0] = order.created_at.to_date.strftime("%A")
      end
      @sales_last_7_days[order.created_at.to_date.to_s][1] += order.total
      @sales_last_7_days_total += order.total
    end
    if @sales_last_7_days[Date.today.to_s] 
      @sales_last_7_days[Date.today.to_s][0] = "Today"
    end
    if @sales_last_7_days[Date.today.prev_day(1).to_s]
      @sales_last_7_days[Date.today.prev_day(1).to_s][0] = "Yesterday"
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
    order_hour = order.created_at.strftime('%Y-%m-%d %H:%M:%S').to_time.hour   # verrrrrrrrrrrrrrrrrrrrrr
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
    order_hour = order_item.order.created_at.hour
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
    #depending of the quantity hour items, show it at intervals or in plain hours
    x_axis = Array.new
    values = Array.new
    max_value = 0.0
    if @items_per_hour.length <= 10
      #items per hour table
      @items_per_interval_hour = @items_per_hour
      #graph's axis
      x_axis = @sales_per_hour.keys.sort
      for item in @sales_per_hour.sort_by { |k, v| k }
        values.push(item[1])
      end
      @h_interval = 1
      max_value = @sales_per_hour.values.max_by { |obj| obj }
    else
      #items per hour
      sum_total = 0.0
      sum_qty = 0.0
      total_sales = 0.0
      for i in 0..23
        sum_qty += (!@items_per_hour[i].nil?) ? @items_per_hour[i][0] : 0
        sum_total += (!@items_per_hour[i].nil?) ? @items_per_hour[i][1] : 0
        total_sales += (!@sales_per_hour[i].nil?) ? @sales_per_hour[i] : 0
        if(i % 2 != 0)
          @items_per_interval_hour[i-1][0] += sum_qty.to_i
          @items_per_interval_hour[i-1][1] += sum_total
          values.push(total_sales.round(2))
          total_sales = 0.0
          sum_qty = 0.0
          sum_total = 0.0
        end        
      end
      #graph's axis
      x_axis = ["0","2","4","6","8","10","12","14","16","18","20","22"]
      @h_interval = 2
      max_value = values.max_by { |v| v }
    end

    #start to show respect the opening time
    if @h_interval == 1
      @elems_to_move = x_axis.select { |elem| elem.to_i < @opening_time }.length
    else
      @elems_to_move = x_axis.select { |elem| elem.to_i < @opening_time and elem.to_i+1 < @opening_time }.length
    end
    x_axis = x_axis.rotate(@elems_to_move)
    values = values.rotate(@elems_to_move)

    @currency = GlobalSetting.parsed_setting_for GlobalSetting::CURRENCY_SYMBOL
    @graph = LazyHighCharts::HighChart.new('graph') do |f|
      f.options[:chart][:defaultSeriesType] = "column"
      f.options[:chart][:animation] = true
      f.options[:title][:text] = "Sales Per Hour"
      f.options[:xAxis][:categories] = x_axis
      f.options[:yAxis][:min] = "0"
      f.options[:yAxis][:max] = max_value
      f.options[:yAxis][:title][:text] = "Total (#{@currency})"
      f.series(:name=>'Sales', :data=> values )
    end
  end

  def get_sales_data
    if !params[:search]
      query = Order.where("created_at >= ? AND created_at < ?", @selected_from_date, @selected_to_date)
    else
      if params[:search2] and params[:search2][:hour_from]
        @hour_interval_from = params[:search2][:hour_from]
      end
      if params[:search2] and params[:search2][:hour_to]
        @hour_interval_to = params[:search2][:hour_to]
      end
      if params[:search] and params[:search][:created_at_gt] and !params[:search][:created_at_gt].empty?
        @selected_from_date = params[:search][:created_at_gt]
        params[:search][:created_at_gt] = @selected_from_date.to_date.midnight + @opening_time.hours
      end
      if params[:search] and params[:search][:created_at_lt] and !params[:search][:created_at_lt].empty?
        @selected_to_date = params[:search][:created_at_lt]
        params[:search][:created_at_lt] = @selected_to_date.to_date.tomorrow.midnight + @closing_time.hours
      end
      query = Order.search(params[:search])
    end
    return query
  end
end