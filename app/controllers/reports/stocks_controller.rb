class Reports::StocksController < Admin::AdminController

  helper_method :vat_rate, :net_result , :per_profit

  layout 'reports'


  def vat_rate(tax, gross)
    (gross-(gross/(1+(tax/100))))
  end

  def net_result(gross, vat_rate)
    gross - vat_rate
  end

  def per_profit(sales_price, cost_price, vat)
    (((sales_price.to_d/(1+(vat/100)))-cost_price.to_d)/(sales_price.to_d/(1+(vat/100))))*100
  end

  def index
    session[:search_type] = :product
    session[:search_type] = :by_product
    session[:category] = ''
    session[:product] = ''
    session[:show_zeros] = false
    session[:from_date] = Time.now - 30.days
    session[:to_date] = Time.now
    session[:terminal] = ''
    session[:search_type_label] = 'Product'
    session[:training_mode] = false
    @current_category = nil
    @current_product = nil
    @products_drop = Product.all

    @opening_time = GlobalSetting.parsed_setting_for GlobalSetting::EARLIEST_OPENING_HOUR


    @selected_from_date = Time.now
    @selected_to_date = Time.now
    @all_terminals = all_terminals

    session[:preselect] = -1
  end

  def stocks_search
    @products = get_stocks_data
    @s_type = session[:search_type]
    render_graph

  end

  def stocks_print
    stocks_search
    @products_drop = Product.all

    respond_to do |format|
      format.html # show.html.erb
      format.pdf { render :layout => false } # Add this line in the show action
    end
  end

    def export_excel
    headers['Content-Type'] = "application/vnd.ms-excel"
    headers['Content-Disposition'] = 'attachment; filename="Stock Report-' + Time.now.strftime("%B %d, %Y").to_s + '.xls"'
    headers['Cache-Control'] = ''
    stocks_search
  end

  def load_dropdown

    session[:preselect] = 0

    if params[:search][:dropdown_type] == 'category' && params[:search][:dropdown_id] != ''
      @products_drop = Product.find_all_by_category_id(params[:search][:dropdown_id])
      session[:category] = params[:search][:dropdown_id]
      session[:product] = ''
    elsif params[:search][:dropdown_type] == 'product' && params[:search][:dropdown_id] != ''
      if session[:category] == ''
         @products_drop = Product.all
      else
        @products_drop = Product.find_all_by_category_id(session[:category])
      end
      session[:product] = params[:search][:dropdown_id]
      @current_product = session[:product]
    elsif params[:search][:dropdown_type] == 'category' && params[:search][:dropdown_id] == ''
      session[:category] = ''
      session[:product] = ''
      @products_drop = Product.all
    else
      session[:product] = ''
      @products_drop = Product.all
    end
  end

  def set_params

    unless params[:search][:select_type] == ""
      session[:preselect] = params[:search][:select_type].to_i
    else
     session[:preselect] = 0
    end

    if params[:search][:training_mode] == 'true'
      session[:training_mode] = true
    else
      session[:training_mode] = false
    end

    if params[:search][:search_type] == 'by_product'
      session[:search_type] = :by_product
      session[:search_type_label] = 'Product'
      session[:show_zeros] = false
    elsif params[:search][:search_type] == 'by_category'
      session[:search_type] = :by_category
      session[:show_zeros] = false
      session[:search_type_label] = 'Category'
    elsif params[:search][:search_type] == 'all'
      session[:search_type] = :by_category
      session[:show_zeros] = true
      session[:search_type_label] = 'Category'
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

  def render_graph
      @h = LazyHighCharts::HighChart.new('graph') do |f|
        f.options[:chart][:defaultSeriesType] = "column"
        f.options[:chart][:margin] = [50, 50, 100, 80]
        f.options[:title][:text] = "Stock By " + session[:search_type_label]
        @chartdata = []
        @chartdata2 = []
        @chartdata3 = []
        @chartdata4 = []
        xitems = []
        @products[0..14].each do |item|
          product = Product.find_by_id(item.product_id)
          unless session[:search_type] == :by_category
                 xitems << product.name
          else
               xitems << Category.find_by_id(product.category_id).name
          end
          quantity_sold = item.quantity

          #@chartdata << product.quantity_in_stock
          @chartdata << quantity_sold
        end
        f.series(:name=> 'Quantity in Stock', :data => @chartdata)
        f.options[:xAxis][:categories] = xitems
      end
  end



  def get_stocks_data

    @selected_from_date = session[:from_date].to_s
    @selected_to_date = session[:to_date].to_s



      where = "select oi.product_id, p.category_id, p.quantity_in_stock, p.cost_price, p.code_num, SUM(oi.total_price) AS total_price, SUM(oi.quantity) AS quantity from order_items oi inner join products p on p.id = oi.product_id inner join categories c on c.id = p.category_id inner join orders o on oi.order_id = o.id"

      if session[:terminal] != ''
        where << " where oi.created_at <= '#{@selected_to_date}' and oi.created_at >= '#{@selected_from_date}' and o.is_void = 0 and oi.is_void = 0 and o.terminal_id = '#{session[:terminal]}'"
      else
        where << " where oi.created_at <= '#{@selected_to_date}' and oi.created_at >= '#{@selected_from_date}' and o.is_void = 0 and oi.is_void = 0"
      end

      if session[:category] != '' && session[:product] == ''
        where << " and c.id = #{session[:category]}"
      end

      if session[:category] != '' && session[:product] != ''
        where << " and p.id = #{session[:product]}"
      end

      if session[:category] == '' && session[:product] != ''
        where << " and p.id = #{session[:product]}"
      end

      if session[:training_mode] == true
        where << " and o.training_mode_sale = 1"
      else
        where << " and o.training_mode_sale = 0"
      end

      if session[:search_type] == :by_category
        where << " group by c.id"
      end

      if session[:search_type] == :by_product
        where << " group by p.id"
      end



      query = OrderItem.find_by_sql(where)

      logger.debug "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss     #{where}"



    return query
  end
end