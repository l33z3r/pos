class ApplicationController < ActionController::Base
  helper_method :e, :current_employee, :print_money
  
  before_filter :load_global_vars
  
  include ActionView::Helpers::NumberHelper
  
  def e
    session[:current_employee_id]
  end

  def current_employee
    begin
      @e ||= Employee.find(session[:current_employee_id])
    rescue ActiveRecord::RecordNotFound
      @e = nil
    end
    
    @e
  end
  
  def fetch_reload_app time
    #fetch the hash of reload_time => terminal_id
    @reload_interface_times = reload_interface_times
    
    @reload_interface_times.each do |reload_request_time, reload_request_terminal_id|
      if reload_request_time > time.to_i
        @reload_app = {}
        @reload_app['reload_request_time'] = reload_request_time
        @reload_app['reload_request_terminal_id'] = reload_request_terminal_id
        
        return @reload_app
      end
    end
    
    return nil
  end
  
  def request_reload_app terminal_id, time
    #fetch the hash of reload_time => terminal_id
    @reload_interface_times = reload_interface_times
    @reload_interface_times[time] = terminal_id
  end
  
  def fetch_sync_table_order time
    #fetch the hash of sync_time => {terminal_id => id, data => data}
    @sync_table_order_times = sync_table_order_times
    
    @sync_table_order_times.each do |sync_table_order_request_time, sync_table_order_request_data|
      
      @sync_table_order_terminal_id = sync_table_order_request_data[:terminal_id]
      
      #ignore requests from same terminal
      next if @sync_table_order_terminal_id == @terminal_id
      
      if sync_table_order_request_time > time.to_i
        if sync_table_order_request_data[:clear_table_order]
          @clear_table_order = {
            :clear_table_order => true,
            :serving_employee_id => sync_table_order_request_data[:serving_employee_id],
            :sync_table_order_request_time => sync_table_order_request_time,
            :table_id => sync_table_order_request_data[:table_id], 
            :terminal_id => @sync_table_order_terminal_id
          }
          
          return @clear_table_order
        else
          @sync_table_order = {
            :sync_table_order_request_time => sync_table_order_request_time,
            :sync_table_order_request_terminal_id => @sync_table_order_terminal_id,
            :serving_employee_id => sync_table_order_request_data[:serving_employee_id],
            :order_data => sync_table_order_request_data[:order_data]
          }
        
          return @sync_table_order
        end
        
      end
    end
    
    return nil
  end
  
  def do_request_sync_table_order terminal_id, time, table_order_data, table_id, employee_id
    @sync_table_order_times = sync_table_order_times
    remove_previous_sync_for_table table_id
    @sync_table_order_times[time] = {:terminal_id => terminal_id, :order_data => table_order_data, :table_id => table_id, :serving_employee_id => employee_id}
  end
  
  def do_request_clear_table_order terminal_id, time, table_id, employee_id
    @sync_table_order_times = sync_table_order_times
    remove_previous_sync_for_table table_id
    @sync_table_order_times[time] = {:terminal_id => terminal_id, :clear_table_order => true, :table_id => table_id, :serving_employee_id => employee_id}
  end
  
  def remove_previous_sync_for_table table_id
    @sync_table_order_times = sync_table_order_times
    
    @sync_table_order_times.each do |sync_table_order_request_time, sync_table_order_request_data|
      if sync_table_order_request_data[:table_id] == table_id
        @sync_table_order_times.delete(sync_table_order_request_time)
        return;
      end
    end
  end
  
  def print_money value
    @dynamic_currency_symbol = GlobalSetting.parsed_setting_for GlobalSetting::CURRENCY_SYMBOL
    number_to_currency value, :precision => 0, :unit => "x"
  end
  
  def print_money value
    @dynamic_currency_symbol = GlobalSetting.parsed_setting_for GlobalSetting::CURRENCY_SYMBOL
    number_to_currency value, :precision => 2, :unit => @dynamic_currency_symbol
  end
  
  private
  
  def reload_interface_times
    @reload_interface_times = (GLOBAL_DATA['reload_interface_times'] ||= {})
    @reload_interface_times
  end
  
  def sync_table_order_times
    @sync_table_order_times = (GLOBAL_DATA['sync_table_order_times'] ||= {})
    @sync_table_order_times
  end
  
  def load_global_vars
    if(request.cookies["terminal_fingerprint"])
      @terminal_id_gs = GlobalSetting.setting_for GlobalSetting::TERMINAL_ID, {:fingerprint => request.cookies["terminal_fingerprint"]}
      @terminal_id = @terminal_id_gs.parsed_value
    else
      @terminal_id = "Initializing"
    end
  end

end
