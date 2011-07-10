class Admin::OrdersController < Admin::AdminController
  
  def index
    @all_terminals = all_terminals
    @all_servers = all_servers
    
    @selected_from_date = @selected_to_date = ""
    
    #must push the "to" date forward a day to match today
    if params[:search] and params[:search][:created_at_lte] and !params[:search][:created_at_lte].empty?
      @selected_from_date = params[:search][:created_at_gte]
      @selected_to_date = params[:search][:created_at_lte]
      
      params[:search][:created_at_lte] = @selected_to_date.to_date.tomorrow.midnight
    end
    
    
    
    @search = Order.search(params[:search])
    
    #for lazy loading use: @search.relation
    
    
    @orders = @search.paginate :page => params[:page], :per_page => Order.per_page
  end
  
  def previous_order
    @order = Order.find(params[:id])
  end
  
end
