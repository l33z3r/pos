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
    @order = (params[:order] and params[:order].eql?("DESC")) ? "DESC" : "ASC"
    @cash_total = CashTotal.search(params[:search]).order("created_at "+@order)
    @all_terminals = all_terminals
  end

  def previous_cash_total
    @cash_total_db = CashTotal.search(params[:search])
    @cash_total_data = @cash_total_db.first.report_data
    return @cash_total_data
  end

end