class Reports::GlancesController < Admin::AdminController
  
  layout 'reports'

  def index
    session[:category] = ''
    session[:product] = ''
    session[:terminal] = ''
    session[:search_product] = ''
    session[:from_date] = Time.now.beginning_of_day
    session[:to_date] = Time.now.end_of_day
    session[:terminal] = ''
    session[:training_mode] = false
    session[:search_type] = :today

    session[:preselect] = -1





    @current_category = nil
    @current_product = nil
    @all_terminals = all_terminals
      #sales_search
    #glances_search

  end


  def glances_search

    @opening_time = GlobalSetting.parsed_setting_for GlobalSetting::EARLIEST_OPENING_HOUR
    @closing_time = GlobalSetting.parsed_setting_for GlobalSetting::LATEST_CLOSING_HOUR

   # get_sales_data
    @today_sales = todays_sales
    @average_day_sales = average_day_sales
    @total_number_days = total_number_days
    @number_of_sales = number_of_sales
    @total_number_sales = total_number_sales
    @busiest_hour = busiest_hour
    unless @busiest_hour.empty?
      @busiest_hour = @busiest_hour[0].created_at
    else
      @busiest_hour = ""
    end
    @total_busiest_hour = total_busiest_hour
    unless @total_busiest_hour.empty?
      @total_busiest_hour = @total_busiest_hour[0].created_at
    else
      @total_busiest_hour = ""
    end
    @todays_voids = todays_voids
    @total_voids = total_voids
    @todays_discounts = todays_discounts
    @average_discounts = average_discounts
    @sales_by_payments = sales_by_payments
    @sales_by_server = sales_by_server
    @expenses_paid = expenses_paid
    @top_selling_items = top_selling_items
    @sales_by_hour = sales_by_hour

  end


  def set_params
    if params[:search][:search_type] == 'today'
      session[:search_type] = :today
    elsif params[:search][:search_type] == 'yesterday'
      session[:search_type] = :yesterday
    elsif params[:search][:search_type] == 'this_week'
      session[:search_type] = :this_week
    elsif params[:search][:search_type] == 'last_week'
      session[:search_type] = :last_week
    end
    if params[:search][:terminal]
      session[:terminal] = params[:search][:terminal]
    end
    render :nothing => true
  end


  def todays_sales
    @selected_from_date = get_from_date
    @selected_to_date = get_to_date
    where = "select oi.id, oi.created_at, DATE_FORMAT(oi.created_at,'%Y-%m-%d') as created_day, oi.product_id, SUM((oi.total_price-(oi.total_price/(1+(oi.tax_rate/100))))) as tax_rate, SUM(total_price) total_price, SUM(quantity) quantity from order_items oi inner join orders o on oi.order_id = o.id"
    if session[:terminal] != ''
        where << " where oi.created_at <= '#{@selected_to_date}' and oi.created_at >= '#{@selected_from_date}' and o.is_void = 0 and oi.is_void = 0 and o.terminal_id = '#{session[:terminal]}'"
      else
        where << " where oi.created_at <= '#{@selected_to_date}' and oi.created_at >= '#{@selected_from_date}' and o.is_void = 0 and oi.is_void = 0"
    end
    query = OrderItem.find_by_sql(where)[0].total_price
  end

  def average_day_sales
    @selected_from_date = Time.now.beginning_of_year
    @selected_to_date = get_to_date
    where = "select oi.id, oi.created_at, DATE_FORMAT(oi.created_at,'%Y-%m-%d') as created_day, oi.product_id, SUM((oi.total_price-(oi.total_price/(1+(oi.tax_rate/100))))) as tax_rate, SUM(total_price) total_price, day(oi.created_at), SUM(quantity) quantity from order_items oi inner join orders o on oi.order_id = o.id"
    if session[:terminal] != ''
        where << " where oi.created_at <= '#{@selected_to_date}' and oi.created_at >= '#{@selected_from_date}' and o.is_void = 0 and oi.is_void = 0 and o.terminal_id = '#{session[:terminal]}'"
      else
        where << " where oi.created_at <= '#{@selected_to_date}' and oi.created_at >= '#{@selected_from_date}' and o.is_void = 0 and oi.is_void = 0"
      end
     #where << " group by created_day order by oi.created_at asc"
    query = OrderItem.find_by_sql(where)[0].total_price
  end

  def total_number_days
    @selected_from_date = Time.now.beginning_of_year
    @selected_to_date = get_to_date
    where = "select oi.id, oi.created_at, DATE_FORMAT(oi.created_at,'%Y-%m-%d') as created_day, oi.product_id, SUM((oi.total_price-(oi.total_price/(1+(oi.tax_rate/100))))) as tax_rate, SUM(total_price) total_price, day(oi.created_at), SUM(quantity) quantity from order_items oi inner join orders o on oi.order_id = o.id"
    if session[:terminal] != ''
        where << " where oi.created_at <= '#{@selected_to_date}' and oi.created_at >= '#{@selected_from_date}' and o.is_void = 0 and oi.is_void = 0 and o.terminal_id = '#{session[:terminal]}'"
      else
        where << " where oi.created_at <= '#{@selected_to_date}' and oi.created_at >= '#{@selected_from_date}' and o.is_void = 0 and oi.is_void = 0"
      end
     where << " group by created_day order by oi.created_at asc"
    query = OrderItem.find_by_sql(where).count
  end

  def number_of_sales
    @selected_from_date = get_from_date
    @selected_to_date = get_to_date
    where = "select oi.id, oi.created_at from order_items oi inner join orders o on oi.order_id = o.id"
    if session[:terminal] != ''
        where << " where oi.created_at <= '#{@selected_to_date}' and oi.created_at >= '#{@selected_from_date}' and o.is_void = 0 and oi.is_void = 0 and o.terminal_id = '#{session[:terminal]}'"
      else
        where << " where oi.created_at <= '#{@selected_to_date}' and oi.created_at >= '#{@selected_from_date}' and o.is_void = 0 and oi.is_void = 0"
      end
    query = OrderItem.find_by_sql(where).count
  end

  def total_number_sales
    @selected_from_date = Time.now.beginning_of_year
    @selected_to_date = get_to_date
    where = "select oi.id, oi.created_at from order_items oi inner join orders o on oi.order_id = o.id"
    if session[:terminal] != ''
        where << " where oi.created_at <= '#{@selected_to_date}' and oi.created_at >= '#{@selected_from_date}' and o.is_void = 0 and oi.is_void = 0 and o.terminal_id = '#{session[:terminal]}'"
      else
        where << " where oi.created_at <= '#{@selected_to_date}' and oi.created_at >= '#{@selected_from_date}' and o.is_void = 0 and oi.is_void = 0"
      end
    query = OrderItem.find_by_sql(where).count
  end

  def busiest_hour
    @selected_from_date = get_from_date
    @selected_to_date = get_to_date
    where = "select oi.id, oi.created_at, oi.product_id, SUM((oi.total_price-(oi.total_price/(1+(oi.tax_rate/100))))) as tax_rate, SUM(total_price) total_price, SUM(quantity) quantity from order_items oi inner join orders o on oi.order_id = o.id"
    if session[:terminal] != ''
        where << " where oi.created_at <= '#{@selected_to_date}' and oi.created_at >= '#{@selected_from_date}' and o.is_void = 0 and oi.is_void = 0 and o.terminal_id = '#{session[:terminal]}'"
      else
        where << " where oi.created_at <= '#{@selected_to_date}' and oi.created_at >= '#{@selected_from_date}' and o.is_void = 0 and oi.is_void = 0"
      end
    where << " group by hour(oi.created_at) order by total_price desc"
    query = OrderItem.find_by_sql(where)
  end

  def total_busiest_hour
    @selected_from_date = Time.now.beginning_of_year
    @selected_to_date = get_to_date
    where = "select oi.id, oi.created_at, oi.product_id, SUM((oi.total_price-(oi.total_price/(1+(oi.tax_rate/100))))) as tax_rate, SUM(total_price) total_price, SUM(quantity) quantity from order_items oi inner join orders o on oi.order_id = o.id"
    if session[:terminal] != ''
        where << " where oi.created_at <= '#{@selected_to_date}' and oi.created_at >= '#{@selected_from_date}' and o.is_void = 0 and oi.is_void = 0 and o.terminal_id = '#{session[:terminal]}'"
      else
        where << " where oi.created_at <= '#{@selected_to_date}' and oi.created_at >= '#{@selected_from_date}' and o.is_void = 0 and oi.is_void = 0"
      end
    where << " group by hour(oi.created_at) order by total_price desc"
    query = OrderItem.find_by_sql(where)
  end

  def todays_voids
    @selected_from_date = get_from_date
    @selected_to_date = get_to_date
    where = "select oi.id, oi.created_at, DATE_FORMAT(oi.created_at,'%Y-%m-%d') as created_day, oi.product_id, SUM(total_price) total_price, SUM(quantity) quantity from order_items oi inner join orders o on oi.order_id = o.id"
    if session[:terminal] != ''
        where << " where oi.created_at <= '#{@selected_to_date}' and oi.created_at >= '#{@selected_from_date}' and o.terminal_id = '#{session[:terminal]}'"
      else
        where << " where oi.created_at <= '#{@selected_to_date}' and oi.created_at >= '#{@selected_from_date}'"
      end
    where << " and oi.is_void = 1"
    query = OrderItem.find_by_sql(where)[0].total_price
  end

  def total_voids
    @selected_from_date = Time.now.beginning_of_year
    @selected_to_date = get_to_date
    where = "select oi.id, oi.created_at, DATE_FORMAT(oi.created_at,'%Y-%m-%d') as created_day, oi.product_id, SUM(total_price) total_price, SUM(quantity) quantity from order_items oi inner join orders o on oi.order_id = o.id"
    if session[:terminal] != ''
        where << " where oi.created_at <= '#{@selected_to_date}' and oi.created_at >= '#{@selected_from_date}' and o.terminal_id = '#{session[:terminal]}'"
      else
        where << " where oi.created_at <= '#{@selected_to_date}' and oi.created_at >= '#{@selected_from_date}'"
      end
    where << " and oi.is_void = 1"
    query = OrderItem.find_by_sql(where)[0].total_price
  end

  def todays_discounts
    @selected_from_date = get_from_date
    @selected_to_date = get_to_date
    where = "select oi.id, oi.created_at, DATE_FORMAT(oi.created_at,'%Y-%m-%d') as created_day, oi.product_id, SUM(total_price) total_price, SUM(quantity) quantity from order_items oi inner join orders o on oi.order_id = o.id"
    if session[:terminal] != ''
        where << " where oi.created_at <= '#{@selected_to_date}' and oi.created_at >= '#{@selected_from_date}' and o.is_void = 0 and oi.is_void = 0 and o.terminal_id = '#{session[:terminal]}'"
      else
        where << " where oi.created_at <= '#{@selected_to_date}' and oi.created_at >= '#{@selected_from_date}' and o.is_void = 0 and oi.is_void = 0"
      end
    where << " and o.discount_percent IS NOT NULL"
    query = OrderItem.find_by_sql(where)
  end

  def average_discounts
    @selected_from_date = get_from_date
    @selected_to_date = get_to_date
    where = "select oi.id, oi.created_at, DATE_FORMAT(oi.created_at,'%Y-%m-%d') as created_day, oi.product_id, SUM(total_price) total_price, SUM(quantity) quantity from order_items oi inner join orders o on oi.order_id = o.id"
    if session[:terminal] != ''
        where << " where oi.created_at <= '#{@selected_to_date}' and oi.created_at >= '#{@selected_from_date}' and o.is_void = 0 and oi.is_void = 0 and o.terminal_id = '#{session[:terminal]}'"
      else
        where << " where oi.created_at <= '#{@selected_to_date}' and oi.created_at >= '#{@selected_from_date}' and o.is_void = 0 and oi.is_void = 0"
      end
    where << " and o.discount_percent IS NOT NULL"
    where << " group by created_day order by oi.created_at asc"
    query = OrderItem.find_by_sql(where)
  end

  def sales_by_payments
    @selected_from_date = get_from_date
    @selected_to_date = get_to_date
    where = "select o.id, o.created_at, o.discount_percent, o.pre_discount_price, sum(total) total, o.payment_type, o.terminal_id, o.employee_id from orders o"
    if session[:terminal] != ''
        where << " where o.created_at <= '#{@selected_to_date}' and o.created_at >= '#{@selected_from_date}' and o.is_void = 0 and o.is_void = 0 and o.terminal_id = '#{session[:terminal]}'"
      else
        where << " where o.created_at <= '#{@selected_to_date}' and o.created_at >= '#{@selected_from_date}' and o.is_void = 0 and o.is_void = 0"
      end
    where << " group by o.payment_type"
    query = Order.find_by_sql(where)
  end

  def sales_by_server
    @selected_from_date = get_from_date
    @selected_to_date = get_to_date
    where = "select o.id, o.created_at, o.discount_percent, o.pre_discount_price, sum(total) total, o.payment_type, o.terminal_id, o.employee_id from orders o"
    if session[:terminal] != ''
        where << " where o.created_at <= '#{@selected_to_date}' and o.created_at >= '#{@selected_from_date}' and o.is_void = 0 and o.is_void = 0 and o.terminal_id = '#{session[:terminal]}'"
      else
        where << " where o.created_at <= '#{@selected_to_date}' and o.created_at >= '#{@selected_from_date}' and o.is_void = 0 and o.is_void = 0"
      end
    where << " group by o.employee_id"
    query = Order.find_by_sql(where)
  end

  def expenses_paid
    @selected_from_date = get_from_date
    @selected_to_date = get_to_date
    where = "select o.id, o.terminal_id, o.note, o.amount, o.created_at from cash_outs o"
    if session[:terminal] != ''
        where << " where o.created_at <= '#{@selected_to_date}' and o.created_at >= '#{@selected_from_date}' and o.terminal_id = '#{session[:terminal]}'"
      else
        where << " where o.created_at <= '#{@selected_to_date}' and o.created_at >= '#{@selected_from_date}'"
      end
    query = Order.find_by_sql(where)
  end

  def top_selling_items
    @selected_from_date = get_from_date
    @selected_to_date = get_to_date
    where = "select oi.id, oi.created_at, DATE_FORMAT(oi.created_at,'%Y-%m-%d') as created_day, oi.product_id, SUM(total_price) total_price, SUM(quantity) quantity from order_items oi inner join orders o on oi.order_id = o.id"
    if session[:terminal] != ''
        where << " where oi.created_at <= '#{@selected_to_date}' and oi.created_at >= '#{@selected_from_date}' and o.terminal_id = '#{session[:terminal]}'"
      else
        where << " where oi.created_at <= '#{@selected_to_date}' and oi.created_at >= '#{@selected_from_date}'"
      end
    where << " group by oi.product_id order by total_price desc limit 10"
    query = OrderItem.find_by_sql(where)
  end

  def sales_by_hour
    @selected_from_date = get_from_date
    @selected_to_date = get_to_date
    where = "select oi.id, COUNT(oi.id) AS count, oi.created_at, oi.product_id, SUM((oi.total_price-(oi.total_price/(1+(oi.tax_rate/100))))) as tax_rate, SUM(total_price) total_price, SUM(quantity) quantity from order_items oi inner join orders o on oi.order_id = o.id"
    if session[:terminal] != ''
        where << " where oi.created_at <= '#{@selected_to_date}' and oi.created_at >= '#{@selected_from_date}' and o.is_void = 0 and oi.is_void = 0 and o.terminal_id = '#{session[:terminal]}'"
      else
        where << " where oi.created_at <= '#{@selected_to_date}' and oi.created_at >= '#{@selected_from_date}' and o.is_void = 0 and oi.is_void = 0"
      end
    where << " group by hour(oi.created_at) order by oi.created_at asc"
    query = OrderItem.find_by_sql(where)
  end

  def get_from_date
    if session[:search_type] == :today
       Time.now.beginning_of_day + @opening_time.hours
    else
    yesterday = Time.now - 1.day
    yesterday.beginning_of_day + @opening_time.hours
    end
  end

  def get_to_date
    if session[:search_type] == :today
       Time.now.end_of_day + @opening_time.hours
    else
    yesterday = Time.now - 1.day
    yesterday.end_of_day + @opening_time.hours
    end
  end

end