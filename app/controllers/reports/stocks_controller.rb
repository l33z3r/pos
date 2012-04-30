class Reports::StocksController < Admin::AdminController

  layout 'reports'

  def index
    session[:search_type] = :product
    session[:search_type] = :by_product
    session[:category] = ''
    session[:product] = ''
    session[:show_zeros] = false
    session[:from_date] = Time.now - 30.days
    session[:to_date] = Time.now
    session[:terminal] = ''
    @current_category = nil
    @current_product = nil
    @products_drop = Product.all

    @selected_from_date = session[:from_date]
    @selected_to_date = session[:to_date]
    @all_terminals = all_terminals

    session[:preselect] = -1
  end

  def stocks_search
    @products = get_stocks_data
    @s_type = session[:search_type]

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

    if params[:search][:select_type]
      session[:preselect] = params[:search][:select_type].to_i
    else
     session[:preselect] = 0
    end
    if params[:search][:search_type] == 'by_product'
      session[:search_type] = :by_product
      session[:show_zeros] = false
    elsif params[:search][:search_type] == 'by_category'
      session[:search_type] = :by_category
      session[:show_zeros] = false
    elsif params[:search][:search_type] == 'all'
      session[:search_type] = :by_category
      session[:show_zeros] = true
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



  def get_stocks_data

    @selected_from_date = session[:from_date].to_s
    @selected_to_date = session[:to_date].to_s

    if session[:show_zeros]
      query = Product.all
      session[:search] = 'init'
    else

      where = "select oi.* from order_items oi inner join products p on p.id = oi.product_id inner join categories c on c.id = p.category_id"



      if session[:terminal] != ''
        where << " where oi.created_at <= '#{@selected_to_date}' and oi.created_at >= '#{@selected_from_date}' and oi.terminal_id = '#{session[:terminal]}'"
      else
        where << " where oi.created_at <= '#{@selected_to_date}' and oi.created_at >= '#{@selected_from_date}'"
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

      if session[:search_type] == :by_category
        where << " group by c.id"
      end

      if session[:search_type] == :by_product
        where << " group by p.id"
      end

      query = OrderItem.find_by_sql(where)

      logger.debug "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss     #{where}"


    end

    return query
  end
end