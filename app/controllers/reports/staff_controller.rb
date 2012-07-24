class Reports::StaffController < Admin::AdminController

  helper_method :vat_rate, :net_result, :per_profit

  Mime::Type.register "application/pdf", :pdf

  layout 'reports'

  def vat_rate(tax, gross)
    (gross-(gross/(1+(tax/100))))
  end

  def net_result(gross, vat)
    gross - vat
  end


  def index
    session[:search_type] = :employee
    session[:search_type_label] = "Employee"
    session[:payment_type] = ''
    session[:terminal] = ''
    session[:search_product] = ''
    session[:from_date] = Time.now - 30.days
    session[:to_date] = Time.now
    session[:terminal] = ''
    session[:employee] = ''
    session[:discounts_only] = false
    session[:training_mode] = false

    session[:preselect] = -1

    session[:current_page] = 1

    @opening_time = GlobalSetting.parsed_setting_for GlobalSetting::EARLIEST_OPENING_HOUR
    @closing_time = GlobalSetting.parsed_setting_for GlobalSetting::LATEST_CLOSING_HOUR

    @selected_from_date = Time.now
    @selected_to_date = Time.now

    @current_method = nil
    @current_product = nil
    @all_terminals = all_terminals
      #sales_search
    @products = Product.all.sort_by { |p| p.name.downcase }

  end

  def staff_print
    staff_search

    respond_to do |format|
      format.html # show.html.erb
      format.pdf { render :layout => false } # Add this line in the show action
    end

  end

  def export_excel
    headers['Content-Type'] = "application/vnd.ms-excel"
    headers['Content-Disposition'] = 'attachment; filename="Staff Report-' + Time.now.strftime("%B %d, %Y").to_s + '.xls"'
    headers['Cache-Control'] = ''
    staff_search
  end


  def staff_search
    #if params[:page] != nil
    #  session[:current_page] = params[:page].to_i
    #end
    @orders = get_staff_data
    @s_type = session[:search_type]
    render_graph
  end

  def render_graph
    tax_rate = GlobalSetting::GLOBAL_TAX_RATE.to_i
    #if (@s_type == :day) || (@s_type == :month) || (@s_type == :week) || (@s_type == :year)
    #  @h = LazyHighCharts::HighChart.new('graph') do |f|
    #    f.options[:chart][:defaultSeriesType] = "column"
    #    f.options[:chart][:margin] = [50, 50, 100, 80]
    #    f.options[:title][:text] = "Sales By " + session[:search_type_label]
    #    @chartdata = []
    #    @chartdata2 = []
    #    @chartdata3 = []
    #    @chartdata4 = []
    #    xitems = []
    #    @orders.each do |order|
    #    if @s_type == :day
    #        @chartdata2 << order.created_at.strftime("%B %d, %Y")
    #      end
    #      if @s_type == :week
    #        @chartdata2 << order.created_at.beginning_of_week.strftime("%B %d, %Y")
    #      end
    #      if @s_type == :month
    #        @chartdata2 << order.created_at.strftime("%B, %Y")
    #      end
    #      if @s_type == :year
    #        @chartdata2 << order.created_at.strftime("%Y")
    #      end
    #
    #      @chartdata4 << order.total
    #    end
    #      #f.series(:name=> 'NET Sales', :data=>@chartdata2)
    #      #f.series(:name=> 'VAT', :data=>@chartdata3)
    #    f.series(:name=> 'Gross Sales', :data=>@chartdata4)
    #    f.options[:xAxis][:categories] = @chartdata2
    #    #f.options[:xAxis][:labels] = {:enabled=> true, :rotation=>-35}
    #    #f.options[:yAxis][:title] = "Price"
    #  end
    #else
    #  @h = LazyHighCharts::HighChart.new('graph') do |f|
    #    f.options[:chart][:defaultSeriesType] = "column"
    #    f.options[:chart][:margin] = [50, 50, 100, 80]
    #    f.options[:title][:text] = "Sales By " + session[:search_type_label]
    #    @chartdata = []
    #    @chartdata2 = []
    #    @chartdata3 = []
    #    @chartdata4 = []
    #    xitems = []
    #
    #    @orders[0..20].each do |week|
    #      net_sales = 0
    #      gross_sales = 0
    #
    #      total_items = week.total
    #      gross_sales = week.total
    #      product = week.id
    #
    #      vat = vat_rate(tax_rate, gross_sales)
    #      net_sales = net_result(gross_sales, vat)
    #
    #      @chartdata << net_sales
    #      @chartdata3 << vat
    #      @chartdata4 << gross_sales
    #      @chartdata2 << week.id
    #
    #    end
    #      #f.series(:name=> 'NET Sales', :data=>@chartdata)
    #      #f.series(:name=> 'VAT', :data=>@chartdata3)
    #    f.series(:name=> 'Gross Sales', :data=>@chartdata4)
    #    f.options[:xAxis][:categories] = @chartdata2
    #    #f.options[:yAxis][:title] = "Price"
    #  end
    #end
  end


  def load_dropdown

    session[:preselect] = 0
    if params[:search][:dropdown_type] == 'payment_type'
      session[:payment_type] = params[:search][:dropdown_id]
    end
    if params[:search][:dropdown_type] == 'employee'
      session[:employee] = params[:search][:dropdown_id]
    end
    if params[:search][:dropdown_type] == 'discounts_only'
      session[:discounts_only] = params[:search][:dropdown_id]
      logger.debug "**********************************************************************************************************  #{params[:search][:dropdown_id]}"
    end
    render :nothing => true
  end


  def set_params
    session[:current_page] = 1
    if params[:search][:select_type] != ''
      session[:preselect] = params[:search][:select_type].to_i
    else
      session[:preselect] = 0
    end

    if params[:search][:training_mode] == 'true'
      session[:training_mode] = true
    else
      session[:training_mode] = false
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
    elsif params[:search][:search_type] == 'employee'
      session[:search_type] = :employee
      session[:search_type_label] = 'employee'
    end
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


  def get_staff_data

    @selected_from_date = session[:from_date].to_s
    @selected_to_date = session[:to_date].to_s

    if (session[:search_type] == :employee)
      where = "select wr.* from work_reports wr"
      where << " where wr.created_at <= '#{@selected_to_date}' and wr.created_at >= '#{@selected_from_date}'"
      if session[:employee] != ''
        where << " and wr.employee_id = '#{session[:employee]}'"
      end
      where << " order by employee_id asc"
    else
      where = "select wr.id, wr.created_at, SUM(shift_seconds) shift_seconds, SUM(break_seconds) break_seconds, SUM(payable_seconds) payable_seconds, SUM(hourly_rate) hourly_rate, SUM(cost) cost, DATE_FORMAT(wr.created_at,'%Y-%m-%d') as created_day from work_reports wr"
      where << " where wr.created_at <= '#{@selected_to_date}' and wr.created_at >= '#{@selected_from_date}'"
      if session[:employee] != ''
        where << " and wr.employee_id = '#{session[:employee]}'"
      end
      if session[:search_type] == :day
        where << " group by created_day order by wr.created_at asc"
      else
        where << " group by #{session[:search_type]}(wr.created_at) order by wr.created_at asc"
      end
    end


    query = WorkReport.find_by_sql(where)

  end

end