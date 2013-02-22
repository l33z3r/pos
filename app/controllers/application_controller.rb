class ApplicationController < AppBaseController
  before_filter :setup_for_subdomain, :except => [:ping, :build_assets, :force_error]
  before_filter :set_outlet_time_zone
  
  before_filter :set_current_employee, :except => [:ping, :cache_manifest, :build_assets, :force_error]

  before_filter :check_reset_session, :except => [:ping, :cache_manifest, :build_assets, :force_error]
  
  helper_method :e, :is_cluey_user?, :cluey_pw_used?, :current_employee, :print_money, :print_credit_balance
  helper_method :mobile_device?, :all_terminals, :all_printers, :all_servers, :current_interface
  helper_method :development_mode?, :heroku_staging_mode?, :heroku_production_mode?, :server_ip, :now_local_millis
  
  before_filter :load_global_vars, :except => [:ping, :cache_manifest, :build_assets, :force_error]
  
  include ActionView::Helpers::NumberHelper
  
  def cluey_pw_used?
    params[:cp] == "cluey100"
  end

  def set_current_employee
    @current_employee_id = request.cookies["current_user_id"]
    
    begin
      @current_employee = current_outlet.employees.find(@current_employee_id)
    rescue ActiveRecord::RecordNotFound
      @current_employee = nil
    end
  end
  
  def current_employee
    @current_employee
  end
  
  def e
    @current_employee_id
  end
  
  def is_cluey_user?
    Employee.is_cluey_user? e
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
    #update the cache_manifest
    @timestamp_setting = GlobalSetting.setting_for GlobalSetting::RELOAD_HTML5_CACHE_TIMESTAMP, current_outlet
    @timestamp_setting.value = now_local_millis
    @timestamp_setting.save
  end
  
  #this only causes the assets to reload
  def request_sales_resources_reload terminal_id
    TerminalSyncData.request_reload_app terminal_id, current_outlet
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
  
  def do_request_sync_table_order terminal_id, table_order_data, table_id, employee_id, last_sync_time
    TerminalSyncData.transaction do
      @sync_table_order_times = TerminalSyncData.fetch_sync_table_order_times current_outlet
      @last_table_order_sync = @sync_table_order_times.last
      
      @sync_table_order_times_reversed = @sync_table_order_times.reverse
      
      #if we dont have the latest timestamp for this tables order we must retry
      if table_id != "0"
        @sync_table_order_times_reversed.each do |tsd|
          if tsd.data[:table_id].to_s == table_id.to_s and tsd.time.to_i > last_sync_time.to_i
            return true
          end
        end
      end
      
      if table_id != "0"
        remove_previous_sync_for_table table_id, false
      else
        remove_old_table_0_orders
      end
      
      #does this order have an order id? if not generate one
      if !table_order_data[:orderData][:order_num] or table_order_data[:orderData][:order_num].blank?
        table_order_data[:orderData][:order_num] = Order.next_order_num current_outlet
      end
      
      table_order_data = table_order_data.to_json
      
      @sync_data = {:terminal_id => terminal_id, :order_data => table_order_data, :table_id => table_id, :serving_employee_id => employee_id}.to_yaml
      
      @time = now_local_millis
      
      #make sure the time is at least 2 milliseconds after the last sync so that it gets picked up ok
      if @last_table_order_sync
        @last_sync_time = @last_table_order_sync.time.to_i
      
        if (@last_sync_time + 2) > @time
          @time = @last_sync_time + 2
        end
      end
      
      TerminalSyncData.create!({:outlet_id => current_outlet.id, :sync_type => TerminalSyncData::SYNC_TABLE_ORDER_REQUEST, 
          :time => @time, :data => @sync_data})
      
      return false
    end
  end
  
  def do_request_clear_table_order terminal_id, time, table_id, order_num, employee_id
    TerminalSyncData.transaction do
      remove_previous_sync_for_table table_id, true
    
      @sync_data = {:terminal_id => terminal_id, :clear_table_order => true, :table_id => table_id, :order_num => order_num, :serving_employee_id => employee_id}
      
      TerminalSyncData.create!({:outlet_id => current_outlet.id, :sync_type => TerminalSyncData::SYNC_TABLE_ORDER_REQUEST, 
          :time => time, :data => @sync_data})
    end
  end
  
  def remove_previous_sync_for_table table_id, delete_clear_table_order_syncs
    #we keep the previous 5 orders for this table so that orders from
    #multiple terminals at once do not overwrite eachother and they
    #all get printed
    @max_orders_kept = 5
    @order_count = 0
    
    @tsds = TerminalSyncData.fetch_sync_table_order_times(current_outlet).reverse
    
    @tsds.each do |tsd|
      if tsd.data[:table_id].to_s == table_id.to_s
        #don't delete the clear table order syncs as we need at least one there at all times
        if tsd.data[:clear_table_order] and !delete_clear_table_order_syncs
          next
        end
        
        @order_count += 1
        
        #always keep @max_orders_kept orders, unless we are clearing the table
        if delete_clear_table_order_syncs or (@order_count >= @max_orders_kept)
          tsd.destroy
        end
      end
    end
  end
  
  def remove_old_table_0_orders
    @max_table_0_orders = 30
    @tsds_reversed = TerminalSyncData.fetch_sync_table_order_times(current_outlet).reverse
    
    #remove table orders
    @table_0_order_count = 0
    
    @tsds_reversed.each do |tsd|
      if tsd.data[:table_id].to_s == "0"
        @table_0_order_count += 1
        
        if @table_0_order_count >= @max_table_0_orders
          tsd.destroy
        end
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
      order_ready_request_order_num = order_ready_data[:order_num]
      
      if order_ready_request_time.to_i > time.to_i
        @order_ready = {}
        @order_ready['order_ready_request_time'] = order_ready_request_time
        @order_ready['order_ready_request_employee_id'] = order_ready_request_employee_id
        @order_ready['order_ready_request_terminal_id'] = order_ready_request_terminal_id
        @order_ready['order_ready_request_table_id'] = order_ready_request_table_id
        @order_ready['order_ready_request_table_label'] = order_ready_request_table_label
        @order_ready['order_ready_request_order_num'] = order_ready_request_order_num
        return @order_ready
      end
    end
    
    return nil
  end
  
  def print_money value
    number_to_currency value, :precision => 2, :unit => @currency_symbol
  end
  
  def print_credit_balance value
    value < 0 ? "#{print_money(value.abs)}CR" : print_money(value)
  end

  def development_mode?
    Rails.env == "development"
  end
  
  def heroku_staging_mode?
    Rails.env == "heroku_staging"
  end
  
  def heroku_production_mode?
    Rails.env == "heroku_production"
  end
  
  rescue_from StandardError do |exception|
    
    EXCEPTION_LOGGER.error('CLUEY ERROR!!!!!')
    EXCEPTION_LOGGER.error("OUTELET ID: #{current_outlet.id}") if current_outlet
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
    
    TerminalSyncData.fetch_terminal_reload_request_times(current_outlet).each do |reload|
      @reload_interface_times[reload.time.to_i.to_s] = reload.data
    end
    
    @reload_interface_times
  end
  
  def sync_table_order_times
    @sync_table_order_times = {}
    
    TerminalSyncData.fetch_sync_table_order_times(current_outlet).each do |sync_table|
      @sync_table_order_times[sync_table.time.to_i.to_s] = sync_table.data
    end
    
    @sync_table_order_times
  end
  
  def order_ready_notification_times
    @order_ready_notification_times = {}
    
    TerminalSyncData.fetch_order_ready_request_times(current_outlet).each do |order_ready|
      @order_ready_notification_times[order_ready.time.to_i.to_s] = order_ready.data
    end
    
    @order_ready_notification_times
  end
  
  def load_global_vars
    @terminal_fingerprint = request.cookies["terminal_fingerprint"]
    
    if(@terminal_fingerprint)
      @terminal_id_gs = GlobalSetting.terminal_id_gs_for_fingerprint @terminal_fingerprint, current_outlet
      @terminal_id = @terminal_id_gs.parsed_value
    else
      @terminal_id = "Initializing"
    end

    @currency_symbol = GlobalSetting.parsed_setting_for GlobalSetting::CURRENCY_SYMBOL, current_outlet
    @currency_symbol_small = GlobalSetting.parsed_setting_for GlobalSetting::SMALL_CURRENCY_SYMBOL, current_outlet

    @earliest_opening_hour = GlobalSetting.parsed_setting_for GlobalSetting::EARLIEST_OPENING_HOUR, current_outlet
    @latest_closing_hour = GlobalSetting.parsed_setting_for GlobalSetting::LATEST_CLOSING_HOUR, current_outlet
    
    @currency_note_image_setting = GlobalSetting.parsed_setting_for GlobalSetting::CURRENCY_NOTES_IMAGES, current_outlet
    
    @auto_print_receipt = GlobalSetting.parsed_setting_for GlobalSetting::AUTO_PRINT_RECEIPT, current_outlet
    
    @service_charge_label = GlobalSetting.parsed_setting_for GlobalSetting::SERVICE_CHARGE_LABEL, current_outlet
    @business_name = GlobalSetting.parsed_setting_for GlobalSetting::BUSINESS_NAME, current_outlet
    @business_address = GlobalSetting.parsed_setting_for GlobalSetting::ADDRESS, current_outlet
    @business_fax = GlobalSetting.parsed_setting_for GlobalSetting::FAX, current_outlet
    @business_telephone = GlobalSetting.parsed_setting_for GlobalSetting::TELEPHONE, current_outlet
    @business_email_address = GlobalSetting.parsed_setting_for GlobalSetting::EMAIL, current_outlet
    
    @defaultDateFormat = GlobalSetting.default_date_format current_outlet

    @reportDateFormat = GlobalSetting.report_date_format current_outlet

    @tax_label = GlobalSetting.parsed_setting_for GlobalSetting::TAX_LABEL, current_outlet
    @tax_chargable = GlobalSetting.parsed_setting_for GlobalSetting::TAX_CHARGABLE, current_outlet
    
    @zalion_charge_room_service_ip_gs = GlobalSetting.setting_for GlobalSetting::ZALION_ROOM_CHARGE_SERVICE_IP, current_outlet
    
    if @zalion_charge_room_service_ip_gs.value.blank?
      @zalion_charge_room_service_ip_gs.value = request.remote_ip
      @zalion_charge_room_service_ip_gs.save
      @zalion_charge_room_service_ip_gs.reload
    end
    
    @zalion_charge_room_service_ip = @zalion_charge_room_service_ip_gs.value
    
    @credit_card_charge_service_ip_gs = GlobalSetting.setting_for GlobalSetting::CREDIT_CARD_CHARGE_SERVICE_IP, current_outlet, {:fingerprint => @terminal_fingerprint}
    
    if @credit_card_charge_service_ip_gs.value.blank?
      @credit_card_charge_service_ip_gs.value = request.remote_ip
      @credit_card_charge_service_ip_gs.save
      @credit_card_charge_service_ip_gs.reload
    end
    
    @credit_card_charge_service_ip = @credit_card_charge_service_ip_gs.value
    
    @credit_card_terminal_ip_gs = GlobalSetting.setting_for GlobalSetting::CREDIT_CARD_TERMINAL_IP, current_outlet, {:fingerprint => @terminal_fingerprint}
    
    if @credit_card_terminal_ip_gs.value.blank?
      @credit_card_terminal_ip_gs.value = request.remote_ip
      @credit_card_terminal_ip_gs.save
      @credit_card_terminal_ip_gs.reload
    end
    
    @credit_card_terminal_ip = @credit_card_terminal_ip_gs.value
    
    #white space in menus
    @use_whitespace_in_mobile_menus = GlobalSetting.parsed_setting_for GlobalSetting::USE_WHITE_SPACE_MOBILE_MENUS, current_outlet
    @use_whitespace_in_desktop_menus = GlobalSetting.parsed_setting_for GlobalSetting::USE_WHITE_SPACE_DESKTOP_MENUS, current_outlet
    
    #menu screen type
    @menu_screen_type = GlobalSetting.parsed_setting_for GlobalSetting::MENU_SCREEN_TYPE, current_outlet, {:fingerprint => @terminal_fingerprint}
    
    @show_charge_card_button = GlobalSetting.parsed_setting_for GlobalSetting::SHOW_CHARGE_CARD_BUTTON, current_outlet
    
    @currentResolution = GlobalSetting.parsed_setting_for GlobalSetting::SCREEN_RESOLUTION, current_outlet, {:fingerprint => @terminal_fingerprint}
    @normalResolution = GlobalSetting::SCREEN_RESOLUTION_NORMAL
    @resolution1360x786 = GlobalSetting::SCREEN_RESOLUTION_1360x786
  
    #menu screen buttons etc
    @menu_screen_buttons_per_row = 8
    @admin_screen_buttons_per_row = 11
    
    if @currentResolution == @resolution1360x786
      @menu_screen_buttons_per_row = 11
      @admin_screen_buttons_per_row = 14
    end
    
    @timekeeping_terminal = GlobalSetting.parsed_setting_for GlobalSetting::TIMEKEEPING_TERMINAL, current_outlet
    
    @accounts_url = accounts_accounts_url(:subdomain => @account.name)
    @outlet_terminals_url = accounts_outlet_url(@current_outlet, :subdomain => @account.name)     
  end
  
  def mobile_device?
    request.user_agent =~ /Mobile|webOS/
  end
  
  def all_terminals
    GlobalSetting.all_terminals current_outlet
  end
  
  def all_printers
    current_outlet.printers.where("printer_type != ?", Printer::LOCAL)
    .where("printer_type != ?", Printer::KITCHEN_2)
    .where("printer_type != ?", Printer::BAR_2)
  end
  
  def all_servers
    current_outlet.employees.all.collect(&:nickname)
  end
  
  def now_local_millis
    GlobalSetting.now_local_millis
  end
  
  def current_interface
    session[:current_interface]
  end
  
  def current_interface_large?
    current_interface == GlobalSetting::LARGE_INTERFACE
  end
  
  def current_interface_medium?
    current_interface == GlobalSetting::MEDIUM_INTERFACE
  end
  
  def setup_for_subdomain
    @subdomain = request.subdomain
    @subdomain = "cluey-cluey"
    
    if @subdomain == "signup"
      redirect_to account_sign_up_url
      return
    end
    
    #split the subdomain
    @subdomain_parts = @subdomain.split("-")
    
    if @subdomain_parts.length == 1
      @account_name = @subdomain_parts[0]    
    
      @account = ClueyAccount.find_by_name @account_name
    
      if !@account
        redirect_to account_not_found_accounts_accounts_url(:subdomain => "signup")
        return
      end
      
      redirect_to accounts_accounts_path
      
      return
    elsif @subdomain_parts.length == 2
      #accessing an outlet
      @outlet_name = @subdomain_parts[0]
      @account_name = @subdomain_parts[1]    
    
      @account = ClueyAccount.find_by_name @account_name
    
      if !@account
        flash[:error] = "Account #{@account_name} not found!"
        redirect_to root_url(:subdomain => "signup")
        return
      end
                   
      @account.outlets.each do |outlet|
        if outlet.name == @outlet_name
          #now check the session for the current terminal to be logged into this outlet
          #are we logged in to this outlet
          if current_outlet and outlet.id == current_outlet.id
            logger.info("OUTLET ID: #{current_outlet.id}")
            
            return true
          end
          
          #check if we have the cross domain login auth token cookie that was 
          #set in the accounts pages to allow a login from those pages without a prompt here
          @login_auth_token = cookies[:login_auth_token]
          
          @login_auth_token = "2FDHRE8dhudhU3PJMfc8A"
          
          
          
          
          
          
          if @login_auth_token
            @auth_token_cluey_account = ClueyAccount.find_by_login_crossdomain_auth_token @login_auth_token
            
            if @auth_token_cluey_account
              #make sure that the auth_token_cluey_account owns this outlet
              if @auth_token_cluey_account.outlets.map(&:id).include?(outlet.id)
                logger.info "!!!!!!!!!!!!!!!!!!!!!!!LOGGED IN WITH AUTH TOKEN #{@login_auth_token}"
                set_current_outlet outlet
                return true
              end
            end
          end
          
          #login required
          authenticate_or_request_with_http_basic "Enter username and password for outlet: #{@o}" do |username, password|
            logger.info "#{username} #{password}"
                                 
            @username_matches = outlet.username == username
            @password_matches = outlet.password_hash == BCrypt::Engine.hash_secret(password, outlet.password_salt)
                  
            @auth_ok = @username_matches && @password_matches
            
            if @auth_ok
              set_current_outlet outlet
            end
            
            @auth_ok
          end
        
          return
        end
      end
    
      redirect_to outlet_not_found_accounts_accounts_url(:subdomain => "signup")
      return
    else
      redirect_to outlet_not_found_accounts_accounts_url(:subdomain => "signup")
      return
    end
    
  end
  
  def check_for_firefox   
    if current_interface_large?
      #check for firefox
      #we also allow android and ipad
      @test_for_chrome = "Chrome"
      @test_for_firefox = "Firefox"
      @test_for_android = "Android"
      @test_for_ipad = "iPad"
      
      @user_agent = request.user_agent
      
      @is_firefox_or_ipad_or_android = @user_agent.include?(@test_for_firefox) || @user_agent.include?(@test_for_ipad) || @user_agent.include?(@test_for_android)
    
      if !@is_firefox_or_ipad_or_android
        redirect_to browser_not_supported_accounts_accounts_url(:subdomain => current_outlet.cluey_account.name)
        return
      end
    end
  end
  
  def set_current_outlet outlet
    session[:current_outlet_id] = outlet.id
                  
    if !outlet.has_seed_data
      OutletBuilder::build_outlet_seed_data(outlet.id)
      outlet.has_seed_data = true
      outlet.save
    end
  end
  
  private
  
  def set_system_wide_update_prompt_required update_type
    @update_gs = GlobalSetting.setting_for GlobalSetting::SYSTEM_WIDE_UPDATE_PROMPT_REQUIRED, current_outlet, {:fingerprint => @terminal_fingerprint}
    @update_gs.value = update_type
    @update_gs.save
  end
  
  def set_outlet_time_zone
    if current_outlet
      Time.zone = current_outlet.time_zone
    end
  end

end
