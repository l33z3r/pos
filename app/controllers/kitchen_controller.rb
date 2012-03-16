class KitchenController < ApplicationController
  def index
  end
  
  def order_ready
    @table_id = params[:table_id]
    @order_num = params[:order_num]
    @terminal_id = params[:terminal_id]
    @employee_id = params[:employee_id]
    
    @table_info = TableInfo.find_by_id(@table_id)
    @employee = Employee.find_by_id(@employee_id)
    
    @notification_sent = false
    
    if @table_info and @employee      
      TerminalSyncData.request_notify_order_ready @order_num, @employee_id, @terminal_id, @table_info 
      @notification_sent = true
    end
  end
  
  def table_0_kitchen_div
    @id = params[:id]
    render :partial => "kitchen_div", :locals => { :table_id => @id, :perm_id => "-" }
  end

end
