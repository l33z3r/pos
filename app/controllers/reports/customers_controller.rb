class Reports::CustomersController < Admin::AdminController

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
    session[:search_type] = :all
    session[:search_type_label] = "Customer"
    session[:terminal] = ''
    session[:search_product] = ''
    session[:from_date] = Time.zone.now - 30.days
    session[:to_date] = Time.zone.now
    session[:terminal] = ''
    session[:employee] = ''


    session[:preselect] = -1

    session[:current_page] = 1

    @opening_time = GlobalSetting.parsed_setting_for GlobalSetting::EARLIEST_OPENING_HOUR, current_outlet
    @closing_time = GlobalSetting.parsed_setting_for GlobalSetting::LATEST_CLOSING_HOUR, current_outlet

    @selected_from_date = Time.zone.now
    @selected_to_date = Time.zone.now

    @current_method = nil
    @current_product = nil
    @all_terminals = all_terminals


  end

  def customer_print
    customer_search

    respond_to do |format|
      format.html # show.html.erb
      format.pdf { render :layout => false } # Add this line in the show action
    end

  end

  def export_excel
    headers['Content-Type'] = "application/vnd.ms-excel"
    headers['Content-Disposition'] = 'attachment; filename="'+current_outlet.name+' customer Report-' + session[:search_type_label] + '-' + Time.zone.now.strftime("%B %d, %Y").to_s + '.xls"'
    headers['Cache-Control'] = ''
    customer_search
  end


  def customer_search
    #if params[:page] != nil
    #  session[:current_page] = params[:page].to_i
    #end
    @orders = get_customer_data
    @s_type = session[:search_type]
  end


  def load_dropdown

    session[:preselect] = 0
    if params[:search][:dropdown_id] == 'all'
      session[:search_type] = :all
    else
      session[:search_type] = :customer
      session[:customer] = params[:search][:dropdown_id]
    end

    render :nothing => true
  end


  def set_params
    if params[:search][:select_type] != ''
      session[:preselect] = params[:search][:select_type].to_i
    else
      session[:preselect] = 0
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


  def get_customer_data

    @selected_from_date = session[:from_date].to_s
    @selected_to_date = session[:to_date].to_s

    if session[:search_type] == :customer
      where = "select ct.* from customer_transactions ct"
      where << " where ct.created_at <= '#{@selected_to_date}' and ct.created_at >= '#{@selected_from_date}'"
      if session[:customer] != ''
        where << " and ct.customer_id = '#{session[:customer]}'"
      end
    else
      where = "select ct.* from customer_transactions ct"
      where << " where ct.created_at <= '#{@selected_to_date}' and ct.created_at >= '#{@selected_from_date}'"
    end
    where << " and ct.outlet_id = #{current_outlet.id}"
    where << " order by ct.customer_id"

    query = CustomerTransaction.find_by_sql(where)

  end

end