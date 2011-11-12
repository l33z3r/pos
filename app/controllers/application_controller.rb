class ApplicationController < ActionController::Base
  
  before_filter :http_basic_authenticate
  
  before_filter :check_reset_session
  
  helper_method :e, :current_employee, :print_money, :mobile_device?
  helper_method :all_terminals, :all_servers, :current_interface
  helper_method :development_mode?, :production_mode?
  
  helper_method :active_employee_ids
  
  before_filter :load_global_vars
  
  LARGE_INTERFACE = "large"
  MEDIUM_INTERFACE = "medium"
  SMALL_INTERFACE = "small"
  
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
    
    @reload_interface_times.each do |reload_request_time, reload_request_data|
      reload_request_terminal_id = reload_request_data[:terminal_id]
      reload_request_hard_reset = reload_request_data[:hard_reset] ? true : false
      
      if reload_request_time.to_i > time.to_i
        @reload_app = {}
        @reload_app['reload_request_time'] = reload_request_time
        @reload_app['reload_request_terminal_id'] = reload_request_terminal_id
        @reload_app['reload_request_hard_reset'] = reload_request_hard_reset
        
        return @reload_app
      end
    end
    
    return nil
  end
  
  def request_reload_app terminal_id
    TerminalSyncData.request_reload_app terminal_id
  end
  
  def fetch_sync_table_order time
    TerminalSyncData.transaction do
      
      #fetch the hash of sync_time => {terminal_id => id, data => data}
      @sync_table_order_times = sync_table_order_times
    
      @sync_table_order_times.each do |sync_table_order_request_time, sync_table_order_request_data|
      
        @sync_table_order_terminal_id = sync_table_order_request_data[:terminal_id]
      
        #we used to ignore requests from same terminal, but now we store
        #a recpt per user per terminal so we need to sync with self
        #next if @sync_table_order_terminal_id == @terminal_id
      
        if sync_table_order_request_time.to_i > time.to_i
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
  end
  
  def do_request_sync_table_order terminal_id, time, table_order_data, table_id, employee_id
    TerminalSyncData.transaction do
      remove_previous_sync_for_table table_id
    
      #does this order have an order id? if not generate one
      if !table_order_data[:orderData][:order_num]
        table_order_data[:orderData][:order_num] = Order.next_order_num
      end
      
      table_order_data = table_order_data.to_json
      
      @sync_data = {:terminal_id => terminal_id, :order_data => table_order_data, :table_id => table_id, :serving_employee_id => employee_id}.to_yaml
      
      TerminalSyncData.create!({:sync_type => TerminalSyncData::SYNC_TABLE_ORDER_REQUEST, 
          :time => time, :data => @sync_data})
    end
  end
  
  def do_request_clear_table_order terminal_id, time, table_id, employee_id
    TerminalSyncData.transaction do
      remove_previous_sync_for_table table_id
    
      @sync_data = {:terminal_id => terminal_id, :clear_table_order => true, :table_id => table_id, :serving_employee_id => employee_id}
      
      TerminalSyncData.create!({:sync_type => TerminalSyncData::SYNC_TABLE_ORDER_REQUEST, 
          :time => time, :data => @sync_data})
    end
  end
  
  def remove_previous_sync_for_table table_id
    TerminalSyncData.fetch_sync_table_order_times.each do |tsd|
      if tsd.data[:table_id].to_s == table_id.to_s
        tsd.destroy
        return;
      end
    end
  end
  
  def fetch_order_ready_notification time
    @order_ready_notification_times = order_ready_notification_times
    
    @order_ready_notification_times.each do |order_ready_request_time, order_ready_data|
      order_ready_request_employee_id = order_ready_data[:employee_id]
      order_ready_request_table_id = order_ready_data[:table_id]
      order_ready_request_table_label = order_ready_data[:table_label]
      if order_ready_request_time.to_i > time.to_i
        @order_ready = {}
        @order_ready['order_ready_request_time'] = order_ready_request_time
        @order_ready['order_ready_request_employee_id'] = order_ready_request_employee_id
        @order_ready['order_ready_request_table_id'] = order_ready_request_table_id
        @order_ready['order_ready_request_table_label'] = order_ready_request_table_label
        return @order_ready
      end
    end
    
    return nil
  end
  
  def print_money value
    @dynamic_currency_symbol = GlobalSetting.parsed_setting_for GlobalSetting::CURRENCY_SYMBOL
    number_to_currency value, :precision => 2, :unit => @dynamic_currency_symbol
  end
  
  def development_mode?
    Rails.env == "development"
  end
  
  def production_mode?
    Rails.env == "production" or Rails.env == "production_heroku"
  end
  
  rescue_from StandardError do |exception|
    
    EXCEPTION_LOGGER.error('ERROR!')
    EXCEPTION_LOGGER.error("Time: #{Time.now.to_s(:long)}")
    EXCEPTION_LOGGER.error(params.inspect)
    EXCEPTION_LOGGER.error(exception.message)
    EXCEPTION_LOGGER.error(exception.backtrace.join("\n") + "\n\n\n\n")
    
    # Raise it anyway because you just want to put it in the log
    raise exception
  end
  
  private
  
  def check_reset_session
    if params[:reset_session]
      #save the interface we are on
      @current_interface = current_interface
      reset_session
      clear_caches
      flash[:notice] = "Session reset!"
      logger.info "saved interface: #{@current_interface}x"
      session[:current_interface] = @current_interface
      redirect_to home_path
    end
  end
  
  def clear_caches
    expire_fragment(%r{\.*})
  end
  
  def reload_interface_times
    @reload_interface_times = {}
    
    TerminalSyncData.fetch_terminal_reload_request_times.each do |reload|
      @reload_interface_times[reload.time.to_i.to_s] = reload.data
    end
    
    @reload_interface_times
  end
  
  def sync_table_order_times
    @sync_table_order_times = {}
    
    TerminalSyncData.fetch_sync_table_order_times.each do |sync_table|
      @sync_table_order_times[sync_table.time.to_i.to_s] = sync_table.data
    end
    
    @sync_table_order_times
  end
  
  def order_ready_notification_times
    @order_ready_notification_times = {}
    
    TerminalSyncData.fetch_order_ready_request_times.each do |order_ready|
      @order_ready_notification_times[order_ready.time.to_i.to_s] = order_ready.data
    end
    
    @order_ready_notification_times
  end
  
  def load_global_vars
    @terminal_fingerprint = request.cookies["terminal_fingerprint"]
    
    if(request.cookies["terminal_fingerprint"])
      @terminal_id_gs = GlobalSetting.setting_for GlobalSetting::TERMINAL_ID, {:fingerprint => @terminal_fingerprint}
      @terminal_id = @terminal_id_gs.parsed_value
    else
      @terminal_id = "Initializing"
    end

    @currency_symbol = GlobalSetting.parsed_setting_for GlobalSetting::CURRENCY_SYMBOL
    
    #TODO: make setting for
    @currency_symbol_small = GlobalSetting.parsed_setting_for GlobalSetting::SMALL_CURRENCY_SYMBOL
    
    @auto_print_receipt = GlobalSetting.parsed_setting_for GlobalSetting::AUTO_PRINT_RECEIPT
    @service_charge_label = GlobalSetting.parsed_setting_for GlobalSetting::SERVICE_CHARGE_LABEL
    @business_name = GlobalSetting.parsed_setting_for GlobalSetting::BUSINESS_NAME
    @business_address = GlobalSetting.parsed_setting_for GlobalSetting::ADDRESS
    @business_telephone = GlobalSetting.parsed_setting_for GlobalSetting::TELEPHONE
    @business_email_address = GlobalSetting.parsed_setting_for GlobalSetting::EMAIL
    
    @defaultDateFormat = GlobalSetting.default_date_format
    
    @tax_label = GlobalSetting.parsed_setting_for GlobalSetting::TAX_LABEL
  end
  
  def mobile_device?
    request.user_agent =~ /Mobile|webOS/
  end
  
  def all_terminals
    GlobalSetting.all_terminals
  end
  
  def all_servers
    Employee.all.collect(&:nickname)
  end
  
  def active_employee_ids
    session[:active_employee_ids] ||= []
    
    session[:active_employee_ids]
  end
  
  def current_interface
    
    return @current_interface if @current_interface
    
    #set it from param i=X
    if params[:i]
      if params[:i] == SMALL_INTERFACE
        session[:current_interface] = SMALL_INTERFACE
      elsif params[:i] == MEDIUM_INTERFACE
        session[:current_interface] = MEDIUM_INTERFACE
      else
        session[:current_interface] = LARGE_INTERFACE
      end
    end
    
    if session[:current_interface]
      @current_interface = session[:current_interface]
    else
      @current_interface = LARGE_INTERFACE
    end
    
    return @current_interface
  end
  
  def current_interface_large?
    current_interface == LARGE_INTERFACE
  end
  
  def current_interface_medium?
    current_interface == MEDIUM_INTERFACE
  end
  
  def http_basic_authenticate
    
    #skip if on mobile device
    if mobile_device?
      return
    end
   
    if DO_HTTP_BASIC_AUTH
      authenticate_or_request_with_http_basic do |username, password|
        username == HTTP_BASIC_AUTH_USERNAME && password == HTTP_BASIC_AUTH_PASSWORD
      end
    end
  end
  
end
