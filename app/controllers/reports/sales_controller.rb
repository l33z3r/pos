class Reports::SalesController < Admin::AdminController

  helper_method :vat_rate, :net_result , :per_profit

  Mime::Type.register "application/pdf", :pdf

  layout 'reports'

  def vat_rate(tax, gross)
    (gross-(gross/(1+(tax/100))))
  end

  def net_result(gross, vat)
    gross - vat
  end

  def per_profit(revenue, total_price)
    (revenue.to_d/total_price.to_d)*100
  end

  def index
    session[:search_type] = :best_seller
    session[:search_type_label] = "Best Seller"
    session[:category] = ''
    session[:product] = ''
    session[:terminal] = ''
    session[:search_product] = ''
    session[:from_date] = Time.now - 30.days
    session[:to_date] = Time.now
    session[:terminal] = ''

    session[:preselect] = -1

    @selected_from_date = session[:from_date]
    @selected_to_date = session[:to_date]

    @current_category = nil
    @current_product = nil
    @all_terminals = all_terminals
    #sales_search
    @products = Product.all.sort_by{|p| p.name.downcase}

  end

  def sales_print
    sales_search
    @products = Product.all

    respond_to do |format|
      format.html # show.html.erb
      format.pdf { render :layout => false } # Add this line in the show action
    end

  end

  def export_excel
    headers['Content-Type'] = "application/vnd.ms-excel"
    headers['Content-Disposition'] = 'attachment; filename="Report-' + Time.now.strftime("%B %d, %Y").to_s + '.xls"'
    headers['Cache-Control'] = ''
    sales_search
    @products = Product.all
  end


  def sales_search
    @orders = get_sales_data
    @s_type = session[:search_type]
    render_graph
  end

  def render_graph
    tax_rate = GlobalSetting::GLOBAL_TAX_RATE.to_i
    if session[:search_type] == :best_seller || session[:search_type] == :worst_seller
      @h = LazyHighCharts::HighChart.new('graph') do |f|
        f.options[:chart][:defaultSeriesType] = "column"
        f.options[:chart][:margin] = [50, 50, 100, 80]
        f.options[:title][:text] = "Sales By " + session[:search_type_label]
        @chartdata = []
        @chartdata2 = []
        @chartdata3 = []
        @chartdata4 = []
        xitems = []
        @orders[0..18].each do |order|
          product = Product.find_by_id(order.product_id)
          gross_sales = order.total_price
          vat = gross_sales * tax_rate / 100
          net_sales = gross_sales - vat

          @chartdata << order.quantity
          @chartdata2 << net_sales
          @chartdata3 << vat
          @chartdata4 << gross_sales
          xitems << product.name
        end
        #f.series(:name=> 'NET Sales', :data=>@chartdata2)
        #f.series(:name=> 'VAT', :data=>@chartdata3)
        f.series(:name=> 'Gross Sales', :data=>@chartdata4)
        f.options[:xAxis][:categories] = xitems
        #f.options[:xAxis][:labels] = {:enabled=> true, :rotation=>-35}
        #f.options[:yAxis][:title] = "Price"
      end
    else
      @h = LazyHighCharts::HighChart.new('graph') do |f|
        f.options[:chart][:defaultSeriesType] = "column"
        f.options[:chart][:margin] = [50, 50, 100, 80]
        f.options[:title][:text] = "Sales By " + session[:search_type_label]
        @chartdata = []
        @chartdata2 = []
        @chartdata3 = []
        @chartdata4 = []
        xitems = []

        @orders.group_by(&@s_type).sort.each do |week|
          net_sales = 0
          gross_sales = 0

          total_items = week[1][0].quantity
          gross_sales = week[1][0].total_price
          product = Product.find_by_id(week[1][0].product_id)

          vat = vat_rate(tax_rate, gross_sales)
          net_sales = net_result(gross_sales, vat)

          @chartdata << net_sales
          @chartdata3 << vat
          @chartdata4 << gross_sales
          if @s_type == :day
            @chartdata2 << week[1][0].created_at.strftime("%B %d, %Y")
          end
          if @s_type == :week
            @chartdata2 << week[1][0].created_at.beginning_of_week.strftime("%B %d, %Y")
          end
          if @s_type == :month
            @chartdata2 << week[1][0].created_at.strftime("%B, %Y")
          end
          if @s_type == :year
            @chartdata2 << week[1][0].created_at.strftime("%Y")
          end
        end
        #f.series(:name=> 'NET Sales', :data=>@chartdata)
        #f.series(:name=> 'VAT', :data=>@chartdata3)
        f.series(:name=> 'Gross Sales', :data=>@chartdata4)
        f.options[:xAxis][:categories] = @chartdata2
        #f.options[:yAxis][:title] = "Price"
      end
    end
  end


  def load_dropdown

    session[:preselect] = 0

    if params[:search][:search_product] != ''
       session[:search_product] = params[:search][:search_product]
    else
       session[:search_product] = ''
    end
    if params[:search][:dropdown_type] == 'category' && params[:search][:dropdown_id] != ''
      @products = Product.find_all_by_category_id(params[:search][:dropdown_id])
      session[:category] = params[:search][:dropdown_id]
      session[:product] = ''
    elsif params[:search][:dropdown_type] == 'product' && params[:search][:dropdown_id] != ''
      if session[:category] == ''
        @products = Product.all.sort_by{|p| p.name.downcase}
      else
        @products = Product.find_all_by_category_id(session[:category]).sort_by{|p| p.name.downcase}
      end
      session[:product] = params[:search][:dropdown_id]
      @current_product = session[:product]
    elsif params[:search][:dropdown_type] == 'category' && params[:search][:dropdown_id] == ''
      session[:category] = ''
      session[:product] = ''
      @products = Product.all.sort_by{|p| p.name.downcase}
    else
      session[:product] = ''
      @products = Product.all.sort_by{|p| p.name.downcase}
    end
  end

  def set_params
    if params[:search][:select_type] != ''
    session[:preselect] = params[:search][:select_type].to_i
    else
     session[:preselect] = 0
    end

    if params[:search][:search_type] == 'day'
      session[:search_type] = :day
      session[:search_type_label] = 'Day'
    elsif params[:search][:search_type] == 'week'
      session[:search_type] = :week
      session[:search_type_label] = 'Week'
    elsif params[:search][:search_type] == 'month'
      session[:search_type] = :month
      session[:search_type_label] = 'Month'
    elsif params[:search][:search_type] == 'year'
      session[:search_type] = :year
      session[:search_type_label] = 'Year'
    elsif params[:search][:search_type] == 'best_seller'
      session[:search_type] = :best_seller
      session[:search_type_label] = 'Best Seller'
    elsif params[:search][:search_type] == 'worst_seller'
      session[:search_type] = :worst_seller
      session[:search_type_label] = 'Worst Seller'
    end
    session[:category] = params[:search][:category]
    session[:product] = params[:search][:product]
    if params[:search][:from_date]
      session[:from_date] = params[:search][:from_date]
    end
    if params[:search][:to_date]
      session[:to_date] = params[:search][:to_date]
    end
    if params[:search][:terminal]
      session[:terminal] = params[:search][:terminal]
    end
    render :nothing => true
  end


  def get_sales_data

    @selected_from_date = session[:from_date].to_s
    @selected_to_date = session[:to_date].to_s

    #if !session[:search]
    #  query = OrderItem.find_by_sql("select o.id, o.tax_rate, o.product_id, SUM(total_price) total_price, SUM(quantity) quantity from order_items o where o.created_at <= '#{@selected_to_date}' and o.created_at >= '#{@selected_from_date}' group by o.product_id order by total_price desc")
    #  session[:search] = 'init'
    #else
      #query = Order.find_by_sql("select * from orders o inner join order_items oi on o.id = oi.order_id")
      #query = Order.find_by_sql("select * from orders o inner join order_items oi on o.id = oi.order_id inner join products p on p.category_id = 1 group by o.id")
    if (session[:search_type] == :day || :month || :year || :week)
      where = 'select o.id, o.tax_rate, o.product_id, o.created_at, SUM(total_price) total_price, SUM(quantity) quantity from order_items o'



      if session[:category] == '' && session[:product] == '' && session[:search_product] != ''
        where << " inner join products p on o.product_id = p.id"
      end

      if session[:category] != '' && session[:product] == ''
        where << " inner join products p on o.product_id = p.id and p.category_id = #{session[:category]}"
      end

      if session[:category] != '' && session[:product] != ''
        where << " and o.product_id = #{session[:product]}"
      end

      if session[:category] == '' && session[:product] != ''
        where << " and o.product_id = #{session[:product]}"
      end
      if session[:terminal] != ''
      where << " where o.created_at <= '#{@selected_to_date}' and o.created_at >= '#{@selected_from_date}' and o.terminal_id = '#{session[:terminal]}'"
      else
      where << " where o.created_at <= '#{@selected_to_date}' and o.created_at >= '#{@selected_from_date}'"
      end

      if session[:category] == '' && session[:product] == '' && session[:search_product] != ''
        where << " and p.name like '%#{session[:search_product]}%' or p.code_num like '%#{session[:search_product]}%'"
      end

      if session[:terminal] != ''
        where << " and o.terminal_id = '#{session[:terminal]}'"
      end

      where << " group by o.product_id order by o.created_at asc"


      query = OrderItem.find_by_sql(where)
    end

      if session[:search_type] == :worst_seller
        where = "select o.id, o.tax_rate, o.product_id, SUM(total_price) total_price, SUM(quantity) quantity from order_items o"

        if session[:category] != ''
          where << " inner join products p on o.product_id = p.id and p.category_id = #{session[:category]}"
        end

        if session[:terminal] != ''
          where << " where o.created_at <= '#{@selected_to_date}' and o.created_at >= '#{@selected_from_date}' and o.terminal_id = '#{session[:terminal]}'"
        else
          where << " where o.created_at <= '#{@selected_to_date}' and o.created_at >= '#{@selected_from_date}'"
        end

        where << " group by o.product_id order by total_price asc"
        query = OrderItem.find_by_sql(where)

      end

      if session[:search_type] == :best_seller
        where = "select o.id, o.tax_rate, o.product_id, SUM(total_price) total_price, SUM(quantity) quantity from order_items o"

        if session[:category] != ''
          where << " inner join products p on o.product_id = p.id and p.category_id = #{session[:category]}"
        end

        if session[:terminal] != ''
          where << " where o.created_at <= '#{@selected_to_date}' and o.created_at >= '#{@selected_from_date}' and o.terminal_id = '#{session[:terminal]}'"
        else
          where << " where o.created_at <= '#{@selected_to_date}' and o.created_at >= '#{@selected_from_date}'"
        end

        where << " group by o.product_id order by total_price desc"
        query = OrderItem.find_by_sql(where)
        logger.debug "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss     #{where}"

      end

    #end
    return query

  end

end