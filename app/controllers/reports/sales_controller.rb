class Reports::SalesController < Admin::AdminController

  Mime::Type.register "application/pdf", :pdf

  layout 'reports'

  def index
    session[:search_type] = :best_seller
    session[:category] = ''
    session[:product] = ''
    session[:from_date] = Time.now - 30.days
    session[:to_date] = Time.now
    @current_category = nil
    @current_product = nil
    sales_search
    @products = Product.all
  end

  def sales_print
    #session[:search_type] = :best_seller
    #session[:category] = ''
    #session[:product] = ''
    #session[:from_date] = Time.now - 6.months
    #session[:to_date] = Time.now
    #@current_category = nil
    #@current_product = nil
    sales_search
    @products = Product.all

respond_to do |format|
format.html # show.html.erb
format.pdf { render :layout => false } # Add this line in the show action
end

  end


  def sales_search
    @opening_time = GlobalSetting.parsed_setting_for GlobalSetting::EARLIEST_OPENING_HOUR
    @closing_time = GlobalSetting.parsed_setting_for GlobalSetting::LATEST_CLOSING_HOUR
    @selected_from_date = Date.today.midnight + @opening_time.hours
    @selected_to_date = Date.tomorrow.midnight + @closing_time.hours
    @all_terminals = all_terminals
      # get_sales_data
    @orders = get_sales_data
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
    elsif params[:search][:search_type] == 'best_seller'
      session[:search_type] = :best_seller
    elsif params[:search][:search_type] == 'worst_seller'
      session[:search_type] = :worst_seller
    end
    session[:category] = params[:search][:category]
    session[:product] = params[:search][:product]
    if params[:search][:from_date]
        session[:from_date] = params[:search][:from_date]
    end
    if params[:search][:to_date]
        session[:to_date] = params[:search][:to_date]
    end

    render :nothing => true
  end

  def get_sales_data

      @selected_from_date = session[:from_date].to_s
      @selected_to_date = session[:to_date].to_s

    if !session[:search]
        query = OrderItem.find_by_sql("select o.id, o.product_id, SUM(total_price) total_price, SUM(quantity) quantity from order_items o where o.created_at <= '#{@selected_to_date}' and o.created_at >= '#{@selected_from_date}' group by o.product_id order by total_price desc")
        session[:search] = 'init'
    else
      #query = Order.find_by_sql("select * from orders o inner join order_items oi on o.id = oi.order_id")
      #query = Order.find_by_sql("select * from orders o inner join order_items oi on o.id = oi.order_id inner join products p on p.category_id = 1 group by o.id")


      if session[:category] != '' && session[:product] == ''
      query = Order.find_by_sql("select DISTINCT o.* from orders o inner join order_items oi on oi.order_id = o.id inner join products p on oi.product_id = p.id and p.category_id = #{session[:category]} where o.created_at <= '#{@selected_to_date}' and o.created_at >= '#{@selected_from_date}'")
      end

      if session[:category] != '' && session[:product] != ''
      query = Order.find_by_sql("select DISTINCT o.* from orders o inner join order_items oi on oi.order_id = o.id and oi.product_id = #{session[:product]} where o.created_at <= '#{@selected_to_date}' and o.created_at >= '#{@selected_from_date}'")
      end

      if session[:category] == '' && session[:product] != ''
      query = Order.find_by_sql("select DISTINCT o.* from orders o inner join order_items oi on oi.order_id = o.id and oi.product_id = #{session[:product]} where o.created_at <= '#{@selected_to_date}' and o.created_at >= '#{@selected_from_date}'")
      end


      if session[:category] == '' && session[:product] == ''
      query = Order.find_by_sql("select DISTINCT o.* from orders o where o.created_at <= '#{@selected_to_date}' and o.created_at >= '#{@selected_from_date}'")
      end

      if session[:search_type] == :worst_seller
      query = OrderItem.find_by_sql("select o.id, o.product_id, SUM(total_price) total_price, SUM(quantity) quantity from order_items o where o.created_at <= '#{@selected_to_date}' and o.created_at >= '#{@selected_from_date}' group by o.product_id order by total_price asc")
      end

      if session[:search_type] == :best_seller
      query = OrderItem.find_by_sql("select o.id, o.product_id, SUM(total_price) total_price, SUM(quantity) quantity from order_items o where o.created_at <= '#{@selected_to_date}' and o.created_at >= '#{@selected_from_date}' group by o.product_id order by total_price desc")
      end

      end
    return query

    end

end