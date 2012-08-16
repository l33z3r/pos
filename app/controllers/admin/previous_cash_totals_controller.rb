class Admin::PreviousCashTotalsController < Admin::AdminController

  def index
    @selected_to_date = @selected_from_date = Date.today
  end

  def cash_total_search
    #must push the "to" date forward a day to match today
    if params[:search] and params[:search][:created_at_lte] and !params[:search][:created_at_lte].empty?
       @selected_to_date = params[:search][:created_at_lte]
       params[:search][:created_at_lte] = @selected_to_date.to_date.tomorrow.midnight
    end
    
    #omit the float cashtotal types
    params[:search][:total_type_ne] = CashTotal::FLOAT
    
    @order = (params[:order] and params[:order].eql?("DESC")) ? "DESC" : "ASC"
    @cash_total = current_outlet.cash_totals.search(params[:search]).order("created_at "+@order)
    @cash_total = @cash_total.paginate :page => params[:page], :per_page => 20
    @all_terminals = all_terminals
  end

  def previous_cash_total
    @cash_total_db = current_outlet.cash_totals.search(params[:search])
    @cash_total = @cash_total_db.first.total
    @cash_total_data = @cash_total_db.first.report_data
    @show_header_section = true
    render :template => "/order/cash_total"
  end

end