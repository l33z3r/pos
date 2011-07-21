class Admin::OrdersController < Admin::AdminController
  
  def index
    @all_terminals = all_terminals
    @all_servers = all_servers
    
    @todaysDateFormatted = Date.today.strftime("%d-%m-%Y")
    @tomorrowsDateFormatted = Date.tomorrow.midnight.strftime("%d-%m-%Y")
    
    #do we have date search params?
    if params[:search] and params[:search][:created_at_lte] and !params[:search][:created_at_lte].empty?
      @selected_from_date = params[:search][:created_at_gte]
      @selected_to_date = params[:search][:created_at_lte]
      
      #must push the "to" date forward a day to match today
      params[:search][:created_at_lte] = @selected_to_date.to_date.tomorrow.midnight
    else
      if !params[:search]
        params[:search] = {}
      end
      
      params[:search][:created_at_gte] = @selected_from_date = @selected_to_date = @todaysDateFormatted
      params[:search][:created_at_lte] = @tomorrowsDateFormatted
    end
    
    #inject a default sort order
    params[:search] = params[:search] ? {:meta_sort => 'created_at.desc'}.merge(params[:search]) : {:meta_sort => 'created_at.desc'}
    
    @search = Order.search(params[:search])
    
    #for lazy loading use: @search.relation
    
    
    @orders = @search.paginate :page => params[:page], :per_page => Order.per_page
  end
  
  def previous_order
    @order = Order.find(params[:id])
    @order_items = @order.order_items
  end
  
end
