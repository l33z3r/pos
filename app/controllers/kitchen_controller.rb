class KitchenController < ApplicationController
  def index
  end
  
  def order_ready
    @table_id = params[:table_id]
    @terminal_id = params[:terminal_id]
    @employee_id = params[:employee_id]
    
    @table_info = TableInfo.find_by_id(@table_id)
    @employee = Employee.find_by_id(@employee_id)
    
    @notification_sent = false
    
    if @table_info and @employee
      TerminalSyncData.request_notify_order_ready @employee_id, @terminal_id, @table_info
      @notification_sent = true
    end
  end

end
