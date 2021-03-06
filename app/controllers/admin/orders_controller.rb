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
    else
      if !params[:search]
        params[:search] = {}
      end
      
      params[:search][:created_at_gte] = @selected_from_date = @selected_to_date = @todaysDateFormatted
      params[:search][:created_at_lte] = @tomorrowsDateFormatted
    end
    
    #inject a default sort order
    params[:search] = params[:search] ? {:meta_sort => 'created_at.desc'}.merge(params[:search]) : {:meta_sort => 'created_at.desc'}
    
    if params[:only_void_orders]
      @search = Order.where("void_order_id is not ? or is_void is true", nil).search(params[:search])
    else
      @search = Order.search(params[:search])
    end
    
    #for lazy loading use: @search.relation
    
    @orders = @search.paginate :page => params[:page], :per_page => Order.per_page
  end
  
  def previous_order
    @order = Order.find(params[:id])
    
    @order_terminal_id = @order.terminal_id
    @order_created_at = @order.created_at
    
    @post_order_z_cash_total = CashTotal.where("total_type = ?", CashTotal::Z_TOTAL).where("terminal_id = ?", @order_terminal_id).where("created_at >= ?", @order_created_at)
    
    #are we allowed reopen z orders
    @allow_reopen_after_z = true
    
    @is_order_pre_z = !@post_order_z_cash_total.empty?
    
    if @is_order_pre_z
      @allow_reopen_after_z = GlobalSetting.parsed_setting_for GlobalSetting::ALLOW_REOPEN_ORDER_AFTER_Z
    end
    
    #not allowed reopen refund orders
    @allow_reopen_refund_order =  true
    
    if @order.total < 0
      @allow_reopen_refund_order = false
    end
    
    #check does this order have to post a refund to zalion
    @must_refund_zalion = false
    
    if @order.client_transaction
      @must_refund_zalion = true
    end
    
    @order_items = @order.order_items
  end
  
end
