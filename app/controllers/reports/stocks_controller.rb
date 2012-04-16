class Reports::StocksController < Admin::AdminController

  layout 'reports'

  def index
    session[:search_type] = :product
    session[:category] = ''
    session[:product] = ''
    @current_category = nil
    @current_product = nil
    @products = Product.all
    stocks_search
  end

  def stocks_search
    @opening_time = GlobalSetting.parsed_setting_for GlobalSetting::EARLIEST_OPENING_HOUR
    @closing_time = GlobalSetting.parsed_setting_for GlobalSetting::LATEST_CLOSING_HOUR
    @selected_from_date = Date.today.midnight + @opening_time.hours
    @selected_to_date = Date.tomorrow.midnight + @closing_time.hours
    @all_terminals = all_terminals
      # get_sales_data
    @products = get_stocks_data
    @s_type = session[:search_type]

  end

  def load_dropdown
    if params[:search][:dropdown_type] == 'category' && params[:search][:dropdown_id] != ''
      @products = Product.find_all_by_category_id(params[:search][:dropdown_id])
      session[:category] = params[:search][:dropdown_id]
      session[:product] = ''
    elsif params[:search][:dropdown_type] == 'product' && params[:search][:dropdown_id] != ''
      if session[:category] == ''
         @products = Product.all
      else
        @products = Product.find_all_by_category_id(session[:category])
      end
      session[:product] = params[:search][:dropdown_id]
      @current_product = session[:product]
    elsif params[:search][:dropdown_type] == 'category' && params[:search][:dropdown_id] == ''
      session[:category] = ''
      session[:product] = ''
      @products = Product.all
    else
      session[:product] = ''
      @products = Product.all
    end
  end

  def set_params
    if params[:search][:search_type] == 'day'
      session[:search_type] = :day
    elsif params[:search][:search_type] == 'week'
      session[:search_type] = :week
    elsif params[:search][:search_type] == 'month'
      session[:search_type] = :month
    elsif params[:search][:search_type] == 'year'
      session[:search_type] = :year
    end
    session[:category] = params[:search][:category]
    session[:product] = params[:search][:product]

    render :nothing => true
  end



  def get_stocks_data
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

      #query = Order.find_by_sql("select * from orders o inner join order_items oi on o.id = oi.order_id")
      #query = Order.find_by_sql("select * from orders o inner join order_items oi on o.id = oi.order_id inner join products p on p.category_id = 1 group by o.id")

      query = Product.find_by_sql("select products.*, (SELECT SUM(products.quantity_in_stock) FROM products) - (SELECT SUM(order_items.quantity) FROM order_items WHERE products.id = order_items.product_id) FROM products")

    end

    return query
  end
end