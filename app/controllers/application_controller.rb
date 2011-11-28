class ApplicationController < ActionController::Base
  
  before_filter :http_basic_authenticate
  
  before_filter :check_reset_session
  
  helper_method :e, :current_employee, :print_money, :mobile_device?
  helper_method :all_terminals, :all_servers, :current_interface
  helper_method :development_mode?, :production_mode?
  helper_method :server_ip, :active_employee_ids
  
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
              :order_num => sync_table_order_request_data[:order_num],
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
  
  def do_request_sync_table_order terminal_id, table_order_data, table_id, employee_id
    TerminalSyncData.transaction do
      remove_previous_sync_for_table table_id, false
    
      #does this order have an order id? if not generate one
      if !table_order_data[:orderData][:order_num]
        table_order_data[:orderData][:order_num] = Order.next_order_num
      end
      
      table_order_data = table_order_data.to_json
      
      @sync_data = {:terminal_id => terminal_id, :order_data => table_order_data, :table_id => table_id, :serving_employee_id => employee_id}.to_yaml
      
      @time = Time.now.to_i
      
      #make sure the time is at least 2 milliseconds afte the last sync so that it gets picked up ok
      @last_table_order_sync = TerminalSyncData.fetch_sync_table_order_times.last
      
      if @last_table_order_sync
        @last_sync_time = @last_table_order_sync.time.to_i
      
        if (@last_sync_time + 2) > @time
          @time = @last_sync_time + 2
        end
      end
      
      TerminalSyncData.create!({:sync_type => TerminalSyncData::SYNC_TABLE_ORDER_REQUEST, 
          :time => @time, :data => @sync_data})
    end
  end
  
  def do_request_clear_table_order terminal_id, time, table_id, order_num, employee_id
    TerminalSyncData.transaction do
      remove_previous_sync_for_table table_id, true
    
      @sync_data = {:terminal_id => terminal_id, :clear_table_order => true, :table_id => table_id, :order_num => order_num, :serving_employee_id => employee_id}
      
      TerminalSyncData.create!({:sync_type => TerminalSyncData::SYNC_TABLE_ORDER_REQUEST, 
          :time => time, :data => @sync_data})
    end
  end
  
  def remove_previous_sync_for_table table_id, delete_clear_table_order_syncs
    TerminalSyncData.fetch_sync_table_order_times.each do |tsd|
      if tsd.data[:table_id].to_s == table_id.to_s
        
        #don't delete the clear table order syncs as we need at least one there at all times
        if tsd.data[:clear_table_order] and !delete_clear_table_order_syncs
          next
        end
        
        tsd.destroy
      end
    end
  end
  
  def fetch_order_ready_notification time
    @order_ready_notification_times = order_ready_notification_times
    
    @order_ready_notification_times.each do |order_ready_request_time, order_ready_data|
      order_ready_request_employee_id = order_ready_data[:employee_id]
      order_ready_request_terminal_id = order_ready_data[:terminal_id]
      order_ready_request_table_id = order_ready_data[:table_id]
      order_ready_request_table_label = order_ready_data[:table_label]
      if order_ready_request_time.to_i > time.to_i
        @order_ready = {}
        @order_ready['order_ready_request_time'] = order_ready_request_time
        @order_ready['order_ready_request_employee_id'] = order_ready_request_employee_id
        @order_ready['order_ready_request_terminal_id'] = order_ready_request_terminal_id
        @order_ready['order_ready_request_table_id'] = order_ready_request_table_id
        @order_ready['order_ready_request_table_label'] = order_ready_request_table_label
        return @order_ready
      end
    end
    
    return nil
  end
  
  def print_money value
    number_to_currency value, :precision => 2, :unit => @currency_symbol
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
      session[:current_interface] = @current_interface
      
      #clear_storage_after_page_load?
      @clear_storage_after_page_load = params[:clear_storage_after_page_load] ? "true" : "false"
      
      @forward_params = {
        :reset_local_storage => @clear_storage_after_page_load,
        :u => params[:u],
        :p => params[:p]
      }
      
      #what is the entry point for each interface?
      if current_interface_large?
        @path = home_path @forward_params
      elsif current_interface_medium?
        #if we are on the medium interface, we want the mbl to be the entry point
        @path = mbl_path @forward_params
      else
        @path = home_path @forward_params
      end
      
      redirect_to @path
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
    @currency_symbol_small = GlobalSetting.parsed_setting_for GlobalSetting::SMALL_CURRENCY_SYMBOL
    
    @currency_note_image_setting = GlobalSetting.parsed_setting_for GlobalSetting::CURRENCY_NOTES_IMAGES
    
    @auto_print_receipt = GlobalSetting.parsed_setting_for GlobalSetting::AUTO_PRINT_RECEIPT
    @order_receipt_width_setting = GlobalSetting.parsed_setting_for GlobalSetting::ORDER_RECEIPT_WIDTH, {:fingerprint => @terminal_fingerprint}
    
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
    logger.info "Checking auth for remote ip: #{request.remote_ip}"
    
    @need_auth = false
    
    @authentication_required = GlobalSetting.parsed_setting_for GlobalSetting::AUTHENTICATION_REQUIRED
    @local_auth_required = GlobalSetting.parsed_setting_for GlobalSetting::LOCAL_AUTHENTICATION_REQUIRED
    
    if @authentication_required 
      logger.info "Auth is required by setting"
      
      @need_auth = true
      
      if !@local_auth_required
        logger.info "Local Auth not required, testing for local"
        
        @local_access = false
        
        @remote_ip = request.remote_ip
        
        #check ip on same lan
        @server_ip_parts = server_ip.split(".")
        
        @server_ip_base = "#{@server_ip_parts[0]}.#{@server_ip_parts[1]}.#{@server_ip_parts[2]}."
          
        logger.info "Testing remote ip #{@remote_ip} again server base #{@server_ip_base}"
        
        if @remote_ip.starts_with? @server_ip_base or @remote_ip == "127.0.0.1"
          @local_access = true
        else 
          logger.info "Request not on same LAN. Requesting auth!"
          @local_access = false
        end
        
        if @local_access
          @need_auth = false
        end
      end
    else
      logger.info "Auth is not required by setting"
    end
    
    if !@need_auth
      return
    end

    logger.info "previous succeed? #{session[:auth_succeeded] == true}"
    
    if !session[:auth_succeeded]
      logger.info "Checking manual auth with params u=#{params[:u]} and p=#{params[:p]}"
      #check is the name and password sent in the url and authenticate off that first if it is present
      @username_param = params[:u]
      @password_param = params[:p]
    
      @username_ok = (@username_param and @username_param == HTTP_BASIC_AUTH_USERNAME)
      @password_ok = (@password_param and @password_param == HTTP_BASIC_AUTH_PASSWORD)
    
      if @username_ok and @password_ok
        logger.info "Manual Auth succeeded"
        session[:auth_succeeded] = true
        return
      end
    else
      return
    end
    
    logger.info "Doing http basic auth"
    
    authenticate_or_request_with_http_basic do |username, password|
      @auth_ok = username == HTTP_BASIC_AUTH_USERNAME && password == HTTP_BASIC_AUTH_PASSWORD
      
      if @auth_ok
        session[:auth_succeeded] = true
      end
      
      @auth_ok
    end
  end
  
  ###
  ### CODE TO GET SERVER IP
  ###
  require 'socket'

  def server_ip
    orig, Socket.do_not_reverse_lookup = Socket.do_not_reverse_lookup, true  # turn off reverse DNS resolution temporarily

    UDPSocket.open do |s|
      s.connect '64.233.187.99', 1
      s.addr.last
    end
  ensure
    Socket.do_not_reverse_lookup = orig
  end

end
