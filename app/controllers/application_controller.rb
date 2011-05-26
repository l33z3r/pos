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
        @reload_app['reload_request_terminal_id'] = reload_request_terminal_id
        @reload_app['reload_request_time'] = reload_request_time
        
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
  
  def need_sync_table_orders? time
    false
  end
  
  def print_money value
    return "arse"
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
  
  def load_global_vars
    if(request.cookies["terminal_fingerprint"])
      @terminal_id_gs = GlobalSetting.setting_for GlobalSetting::TERMINAL_ID, {:fingerprint => request.cookies["terminal_fingerprint"]}
      @terminal_id = @terminal_id_gs.parsed_value
    else
      @terminal_id = "Initializing"
    end
  end

end
