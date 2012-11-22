class HomeController < ApplicationController
  prepend_before_filter :set_interface_large, :only => [:index]
  prepend_before_filter :set_interface_medium, :only => [:medium_home]
  
  skip_before_filter :set_current_employee, :only => [:login, :logout, :clockin, :clockout]
  cache_sweeper :product_sweeper  
  
  #main screen including the login overlay
  def index
    check_for_firefox
    
    do_large_interface_actions
          
    #now the actions common to all interfaces
    do_common_interface_actions
  end
  
  def force_error
    1/0
  end
  
  def medium_home
    do_medium_interface_actions
          
    #now the actions common to all interfaces
    do_common_interface_actions
    
    render :action => "index"
  end
  
  def mobile_index
    @all_terminals = all_terminals
    @all_servers = all_servers
      
    render :layout => "mobile"
  end
  
  def call_home
    #check if we need to reload the interface due to room builder or menu screen being accessed
    @last_interface_reload_time = params[:lastInterfaceReloadTime]
    
    @reload_app = fetch_reload_app @last_interface_reload_time
    
    if @reload_app
      @reload_request_time = @reload_app['reload_request_time']
      @reload_request_terminal_id = @reload_app['reload_request_terminal_id']
      @reload_request_hard_reset = @reload_app['reload_request_hard_reset']
    end
    
    #check the last timestamp for the table order sync
    @last_sync_table_order_time = params[:lastSyncTableOrderTime]
    
    @sync_table_order = fetch_sync_table_order @last_sync_table_order_time
    
    if @sync_table_order
      
      if @sync_table_order[:clear_table_order]
        @clear_table_order = @sync_table_order
        @sync_table_order = nil
        @table_label = current_outlet.table_infos.find_by_id(@clear_table_order[:table_id]).perm_id
        
        @serving_employee_id = @clear_table_order[:serving_employee_id];
        @terminal_employee = current_outlet.employees.find(@serving_employee_id).nickname;
        @order_num = @clear_table_order[:order_num]
        
        @clear_table_order_request_time = @clear_table_order[:sync_table_order_request_time]
        @new_clear_table_order_time = @clear_table_order_request_time.to_i + 1
      else
        @sync_table_order_request_time = @sync_table_order[:sync_table_order_request_time]
        @sync_table_order_request_terminal_id = @sync_table_order[:sync_table_order_request_terminal_id]
        @sync_table_order_data = JSON.parse(@sync_table_order[:order_data]).symbolize_keys!
      
        @table_label = current_outlet.table_infos.find_by_id(@sync_table_order_data[:tableID]).perm_id
      
        @serving_employee_id = @sync_table_order[:serving_employee_id];
        @terminal_employee = current_outlet.employees.find(@serving_employee_id).nickname;
      
        @new_sync_table_order_time = @sync_table_order_request_time.to_i + 1
      end
    end
    
    #check the last timestamp for the table order sync
    @last_order_ready_notification_time = params[:lastOrderReadyNotificationTime]
    
    @order_ready_notification = fetch_order_ready_notification @last_order_ready_notification_time
    
    if @order_ready_notification
      @order_ready_request_time = @order_ready['order_ready_request_time']
      @order_ready_request_employee_id = @order_ready['order_ready_request_employee_id']
      @order_ready_request_terminal_id = @order_ready['order_ready_request_terminal_id']
      @order_ready_request_table_id = @order_ready['order_ready_request_table_id']
      @order_ready_request_order_num = @order_ready['order_ready_request_order_num']
      @order_ready_reqeust_table_label = @order_ready['order_ready_request_table_label']
      
      @new_order_ready_update_time = @order_ready_request_time.to_i + 1  
    end
    
    store_receipt_html
    update_terminal_timestamp
    
  end
  
  def customer_payment
    CustomerTransaction.transaction do
      @customer = current_outlet.customers.find_by_id(params[:customer_id])
      @amount = params[:amount].to_f
      @amount_tendered = params[:amount_tendered].to_f
      @payment_method = params[:payment_method]
      
      @payment = Payment.create({:outlet_id => current_outlet.id, :transaction_type => Payment::CUSTOMER_PAYMENT,
          :employee_id => e, :amount => @amount, :amount_tendered => @amount_tendered,
          :payment_method => @payment_method, :terminal_id => @terminal_id})
    
      #deduct the customers balance
      @customer.current_balance = @customer.current_balance - @amount
      @customer.save
      
      CustomerTransaction.create({:outlet_id => current_outlet.id, :customer_id => @customer.id, :terminal_id => @terminal_id,
          :transaction_type => CustomerTransaction::SETTLEMENT, :is_credit => true,
          :abs_amount => @amount, :actual_amount => -@amount, 
          :payment_id => @payment.id, :closing_balance => @customer.current_balance})
    
      @card_charged = params[:card_charged].to_s == "true"
      
      if @card_charged
        @reference_number = params[:reference_number]
        
        @card_transaction = CardTransaction.create({:outlet_id => current_outlet.id, :payment_method => @payment_method,
            :amount => @amount, :reference_number => @reference_number
          })
        
        @payment.card_transaction_id = @card_transaction.id
        @payment.save
      end
    end
    render :json => {:success => true}.to_json
  end
  
  def ping
    render :json => {:success => true}.to_json
  end
  
  def load_price_for_menu_page
    @page_num = params[:page_num].to_i
    @sub_page_id = params[:sub_page_id].to_i
    
    @display = TerminalDisplayLink.load_display_for_terminal @terminal_id, current_outlet
    
    @price_map = {}
    
    @menu_page = @display.menu_pages[@page_num-1]
    
    if @sub_page_id and @sub_page_id > 0
      @menu_page = current_outlet.menu_pages.find(@sub_page_id)
    end
    
    @menu_page.menu_items.each do |mi|
      next if !mi.product
      @price = mi.product.price
      @price_map[mi.id] = @price ? print_money(@price) : 0
    end
  end
  
  def load_price_receipt_for_product
    @product = current_outlet.products.find(params[:product_id])
  end
  
  def update_price
    @product = current_outlet.products.find(params[:product_id])
    @new_price = params[:new_price].to_f
    
    @menu_item_id = params[:menu_item_id]
    
    @change_amount = @new_price - @product.price
    
    @product.price = @new_price
    @product.save!
  end
  
  def update_cost_price
    @product = current_outlet.products.find(params[:product_id])
    @new_cost_price = params[:new_cost_price].to_f
    
    @product.cost_price = @new_cost_price
    @product.save!
    
    render :json => {:success => true}.to_json
  end
  
  def load_stock_for_menu_page    
    @page_num = params[:page_num].to_i
    @sub_page_id = params[:sub_page_id].to_i
    
    @display = TerminalDisplayLink.load_display_for_terminal @terminal_id, current_outlet
    
    @stock_map = {}
    
    @menu_page = @display.menu_pages[@page_num-1]
    
    if @sub_page_id and @sub_page_id > 0
      @menu_page = current_outlet.menu_pages.find(@sub_page_id)
    end
    
    @menu_page.menu_items.each do |mi|
      next if !mi.product
      next if !mi.product.is_stock_item
      @stock = mi.product.quantity_in_stock
      @stock_map[mi.id] = @stock
    end
  end
  
  def load_stock_receipt_for_product
    @product = current_outlet.products.find(params[:product_id])
    
    @stock_transaction = @product.last_stock_transaction.last
  end
  
  def update_stock
    @product = current_outlet.products.find(params[:product_id])
    @new_amount = params[:new_amount].to_f
    @type = params[:t_type]
    
    @menu_item_id = params[:menu_item_id]
    
    @change_amount = @new_amount - @product.quantity_in_stock
    
    @st = StockTransaction.create(:outlet_id => current_outlet.id, :product_id => @product.id, :employee_id => current_employee.id, 
      :old_amount => @product.quantity_in_stock, :change_amount => @change_amount, :transaction_type => @type)
    
    @product.quantity_in_stock = @new_amount
    @product.save!
  end
  
  def request_terminal_reload
    request_reload_app @terminal_id
    
    flash[:notice] = "Reload Request Sent To All Terminals"
    redirect_to :back
  end
  
  def clear_all_fragment_caches
    clear_caches
    redirect_to home_path
  end

  def clockin
    @employee_id = params[:employee_id]
    @employee = current_outlet.employees.find(@employee_id)
    
    if @timekeeping_terminal == @terminal_id and !Employee.is_cluey_user?(@employee)
      #add an entry to the shift timestamps table
      ShiftTimestamp.create(:outlet_id => current_outlet.id, :employee_id => @employee.id, :timestamp_type => ShiftTimestamp::CLOCK_IN)
    end
    
    update_last_active @employee

    render :json => {:success => true}.to_json
  end

  def clockout
    @employee_id = params[:employee_id]
    @employee = current_outlet.employees.find(@employee_id)
    
    update_last_active @employee
    
    if @timekeeping_terminal == @terminal_id and !Employee.is_cluey_user?(@employee)
      #add an entry to the shift timestamps table
      @last_clockout = ShiftTimestamp.create(:outlet_id => current_outlet.id, :employee_id => @employee.id, :timestamp_type => ShiftTimestamp::CLOCK_OUT)
    end
    
    if @timekeeping_terminal == @terminal_id and !Employee.is_cluey_user?(@employee)
      @last_clockin = @employee.shift_timestamps.where("timestamp_type = #{ShiftTimestamp::CLOCK_IN}").order("created_at desc").first
      
      @breaks = @employee.shift_timestamps.where("timestamp_type = #{ShiftTimestamp::BREAK_IN} or timestamp_type = #{ShiftTimestamp::BREAK_OUT}").where("created_at >= ?", @last_clockin.created_at).where("created_at <= ?", @last_clockout.created_at)
    
      @report_data = {}
    
      @all_orders = @employee.orders.where("created_at >= ?", @last_clockin.created_at)
      
      @all_order_items_ordered = @employee.order_items.where("created_at >= ?", @last_clockin.created_at)
      @all_order_items_ordered_quantity = @all_order_items_ordered.count
      @all_order_items_ordered_amount = @all_order_items_ordered.sum("total_price")
      
      if @all_order_items_ordered_quantity != 0
        @all_order_items_ordered_avg = @all_order_items_ordered_amount / @all_order_items_ordered_quantity
      else 
        @all_order_items_ordered_avg = 0
      end
      
      @void_order_items = @employee.void_order_items.where("created_at >= ?", @last_clockin.created_at)
      @void_order_items_quantity = @void_order_items.count
      @void_order_items_amount = @void_order_items.sum("total_price")
    
      @total_discounts = 0
    
      @total_cash = 0
    
      @all_order_items_sold_quantity = 0
      @all_order_items_sold_amount = 0
      
      @all_orders.each do |order|
        
        @all_order_items_sold_quantity += order.order_items.count
        @all_order_items_sold_amount += order.total
          
        @payment_types = order.split_payments
        
        if @payment_types and @payment_types.length > 0
          @payment_types.each do |pt, amount|
            @amount = amount.to_f
            
            pt = pt.downcase
           
            if pt == PaymentMethod::CASH_PAYMENT_METHOD_NAME
              #don't count the change
              if order.amount_tendered > order.total
                @amount -= (order.amount_tendered - (order.total + order.service_charge))
              end
              
              @total_cash += @amount
            end
          end
        end
        
        #calculate total discounts
        order.order_items.each do |order_item|
          if order_item.pre_discount_price
            @order_item_price_including_item_discount = order_item.pre_discount_price
            @order_item_total_discount = order_item.pre_discount_price - order_item.total_price
          else 
            @order_item_price_including_item_discount = order_item.total_price
            @order_item_total_discount = 0
          end
          
          #add on whole order discount
          if order.discount_percent and order.discount_percent > 0
            @order_item_total_discount += (order.discount_percent * @order_item_price_including_item_discount)/100
          end
          
          @total_discounts += @order_item_total_discount
        end
      end
      
      if @all_order_items_sold_quantity != 0
        @all_order_items_sold_avg = @all_order_items_sold_amount / @all_order_items_sold_quantity
      else 
        @all_order_items_sold_avg = 0
      end
      
      @report_data[:all_order_items_ordered_quantity] = @all_order_items_ordered_quantity
      @report_data[:all_order_items_sold_quantity] = @all_order_items_sold_quantity
    
      @report_data[:void_order_items_quantity] = @void_order_items_quantity
      @report_data[:void_order_items_amount] = @void_order_items_amount
      
      @report_data[:all_order_items_ordered_amount] = @all_order_items_ordered_amount
      
      @report_data[:total_discounts] = @total_discounts
    
      @report_data[:all_order_items_ordered_avg] = @all_order_items_ordered_avg
      @report_data[:all_order_items_sold_avg] = @all_order_items_sold_avg
      
      @report_data[:total_cash] = @total_cash
      
      @total_payments = @all_order_items_sold_amount
      @report_data[:total_payments] = @total_payments
      
      @break_time_seconds = 0 
      @break_start = 0

      @breaks.each do |b|
        if(b.timestamp_type == ShiftTimestamp::BREAK_IN)
          @break_start = b.created_at
        else
          @break_time_seconds += (b.created_at - @break_start)
        end
      end

      @shift_seconds = (@last_clockout.created_at - @last_clockin.created_at)
      @payable_seconds = @shift_seconds - @break_time_seconds
   
      @hourly_rate = @employee.hourly_rate
        
      @payable_hours = (@payable_seconds / 3600.0).round(2)
      @cost = @hourly_rate * @payable_hours
        
      @wr = WorkReport.create(:outlet_id => current_outlet.id, :employee_id => @employee.id, :report_data => @report_data, 
        :hourly_rate => @hourly_rate, :cost => @cost, :clockin_time => @last_clockin.created_at, 
        :clockout_time => @last_clockout.created_at, :shift_seconds => @shift_seconds, 
        :break_seconds => @break_time_seconds, :payable_seconds => @payable_seconds)
    
      @custom_work_report_footer = GlobalSetting.parsed_setting_for GlobalSetting::WORK_REPORT_FOOTER_TEXT, current_outlet
    end
    
    @print_work_report = GlobalSetting.parsed_setting_for GlobalSetting::PRINT_WORK_REPORT, current_outlet
    
    if @print_work_report and @last_clockin
      render :template => "/home/print_work_report"
    else
      render :json => {:success => true}.to_json
    end
  end

  def login
    @employee_id = params[:employee_id]
    @employee = current_outlet.employees.find(@employee_id)
    
    @employee.last_login = Time.now
    
    update_last_active @employee

    render :json => {:success => true}.to_json
  end
  
  def logout
    @employee_id = params[:employee_id]
    @employee = current_outlet.employees.find(@employee_id)
    
    @employee.last_logout = Time.now
    
    update_last_active @employee

    render :json => {:success => true}.to_json
  end
  
  def break_in
    @employee = current_outlet.employees.find(params[:id])

    redirect_to :back, :flash => {:error => "Employee not found."} and return if @employee.nil?

    update_last_active @employee

    if @timekeeping_terminal == @terminal_id and !Employee.is_cluey_user?(@employee)
      #add an entry to the shift timestamps table
      ShiftTimestamp.create(:outlet_id => current_outlet.id, :employee_id => @employee.id, :timestamp_type => ShiftTimestamp::BREAK_IN)
    end
    
    render :json => {:success => true}.to_json
  end
  
  def break_out
    @employee = current_outlet.employees.find(params[:id])

    redirect_to :back, :flash => {:error => "Employee not found."} and return if @employee.nil?

    update_last_active @employee

    if @timekeeping_terminal == @terminal_id and !Employee.is_cluey_user?(@employee)
      #add an entry to the shift timestamps table
      ShiftTimestamp.create(:outlet_id => current_outlet.id, :employee_id => @employee.id, :timestamp_type => ShiftTimestamp::BREAK_OUT)
    end
    
    render :json => {:success => true}.to_json
  end
  
  def blank_receipt_for_print
    render :layout => nil
  end
  
  def last_receipt_for_terminal
    @terminal_id = params[:terminal_id]
    @receipt_html_object = StoredReceiptHtml.latest_for_terminal @terminal_id
  end
  
  def last_receipt_for_server
    @server_id = params[:server_id]
    @receipt_html_object = StoredReceiptHtml.latest_for_server @server_id
  end
  
  def last_receipt_for_table
    @table_label = params[:table_label]
    @receipt_html_object = StoredReceiptHtml.latest_for_table @table_label
  end
  
  def forward_print_service_request
    @url = params[:print_service_url]
    @html_data = params[:html_data]
    
    logger.info "Forwarding a print service request to #{@url}"

    url = URI.parse(@url)
    the_params = {"content_to_print" => @html_data}
    
    req = Net::HTTP::Post.new(url.path)
    req.form_data = the_params
  
    @http = Net::HTTP.new(url.host, url.port)
    
    @http.open_timeout = 5
    
    begin
      @forward_response = @http.start {|http|
        http.request(req)
      }
    rescue
      render :status => 503, :inline => "Cannot reach printer service" and return
    end

    logger.info "Got response from print service: #{@forward_response}"
    
    render :json => {:success => true}.to_json
  end
  
  def forward_cash_drawer_request
    @url = params[:cash_drawer_service_url]
    @message = params[:message]
    
    logger.info "Forwarding a cash drawer request to #{@url}"
    
    url = URI.parse(@url)
    the_params = {"message" => @message}
    
    req = Net::HTTP::Post.new(url.path)
    req.form_data = the_params
  
    @http = Net::HTTP.new(url.host, url.port)
    
    @http.open_timeout = 5
    
    begin
      @forward_response = @http.start {|http|
        http.request(req)
      }
    rescue
      render :status => 503, :inline => "Cannot reach cash drawer service"  and return
    end

    logger.info "Got response from cash drawer service: #{@forward_response}"
    
    render :json => {:success => true}.to_json
  end
  
  def forward_zalion_roomfile_request
    @url = params[:zalion_roomfile_request_url]
    
    logger.info "Forwarding a zalion roomfile request to #{@url}"

    url = URI.parse(@url)
    the_params = {"message" => "gimme the roomfile"}
    
    req = Net::HTTP::Post.new(url.path)
    req.form_data = the_params
  
    @http = Net::HTTP.new(url.host, url.port)
    
    @http.open_timeout = 5
    
    begin
      @forward_response = @http.start {|http|
        http.request(req)
      }
    rescue
      render :status => 503, :inline => "Cannot reach zalion roomfile service"  and return
    end

    logger.info "Got response from room file servlet: #{@forward_response.body}"
  end
  
  def forward_zalion_charge_request
    @url = params[:zalion_charge_request_url]
    @order_data_json_string = params[:order_data_json_string]
    @order_data = params[:order_data]
    
    logger.info "Forwarding a zalion charge request to #{@url}"

    url = URI.parse(@url)
    
    the_params = {
      "message" => "charge this room",
      "order_data" => @order_data_json_string
    }
    
    req = Net::HTTP::Post.new(url.path)
    req.form_data = the_params
  
    @http = Net::HTTP.new(url.host, url.port)
    
    @http.open_timeout = 5
    
    begin
      @forward_response = @http.start {|http|
        http.request(req)
      }
    
      #store a client transaction if this sale was linked to a charged_room
      @order_id = @order_data['id']
      @charged_room = @order_data['charged_room']
      
      @client_name = @charged_room['selected_folio_name']
      @payment_integration_type_id = @charged_room['payment_integration_type_id']
      
      @transaction_data = {
        :selected_room_number => @charged_room['selected_room_number'],
        :selected_folio_number => @charged_room['selected_folio_number']
      }
      
      @ct = ClientTransaction.create(
        :outlet_id => current_outlet.id,
        :order_id => @order_id, 
        :client_name => @client_name, 
        :transaction_data => @transaction_data,
        :payment_integration_type_id => @payment_integration_type_id
      )
    rescue
      render :status => 503, :inline => "Cannot reach zalion charge service" and return
    end

    logger.info "Got response from room charge servlet: #{@forward_response.body}"
    
    render :json => {:success => true}.to_json
  end
  
  def forward_credit_card_charge_request
    @url = params[:credit_card_charge_request_url]
    
    @order_data_json_string = params[:order_data_json_string]
    @order_data = params[:order_data]
    
    logger.info "Forwarding a credit card charge request to #{@url}"

    url = URI.parse(@url)
    
    the_params = {
      "credit_card_terminal_ip" => params[:credit_card_terminal_ip],
      "credit_card_terminal_port" => params[:credit_card_terminal_port],
      "transaction_type" => params[:transaction_type],
      "transaction_amount" => params[:transaction_amount],
      "cashback_amount" => params[:cashback_amount],
      "reference_message" => params[:reference_message],
      "gratuity_amount" => params[:gratuity_amount]
    }
    
    req = Net::HTTP::Post.new(url.path)
    req.form_data = the_params
  
    @http = Net::HTTP.new(url.host, url.port)
    
    @http.open_timeout = 5
    
    @cc_timeout_mins = 20
    @timeout_seconds = @cc_timeout_mins * 60
    
    #timeout to wait for card to be charged
    @http.read_timeout = @timeout_seconds
    
    @error = false
    
    begin
      @forward_response = @http.start {|http|
        http.request(req)
      }
      
      logger.info "Got response from credit card charge servlet: #{@forward_response.body}."
    rescue Timeout::Error => error
      @error = true
      @reason = "Timeout error. Transaction took longer than #{@cc_timeout_mins} minutes."
    rescue Exception => error
      @error = true
      @reason = "Problem with credit card service #{error.to_s}."
    end
  end
  
  #this links a terminal to an OutletTerminal model instance
  def link_terminal
    @outlet_terminal_name = params[:outletTerminalName]
    
    @outlet_terminal = current_outlet.outlet_terminals.find_by_name @outlet_terminal_name
    
    @error = false
    
    if @outlet_terminal and !@outlet_terminal.assigned
      @terminal_id_gs = GlobalSetting.terminal_id_for @terminal_fingerprint, current_outlet
      @outlet_terminal.link_terminal @terminal_id_gs
    else
      @error = true
    end
  end
  
  def unlink_terminal
    @terminal_id_gs = GlobalSetting.terminal_id_for @terminal_fingerprint, current_outlet
    @outlet_terminal = current_outlet.outlet_terminals.find_by_name @terminal_id
    
    @outlet_terminal.unlink_terminal @terminal_id_gs
    
    request_sales_resources_reload @terminal_id
    
    render :json => {:success => true}.to_json
  end
  
  # Rails controller action for an HTML5 cache manifest file.
  # Generates a plain text list of files that changes
  # when one of the listed files change...
  # So the client knows when to refresh its cache.
  def cache_manifest
  
    if development_mode?
      raise ActionController::RoutingError.new('Not Found')
      return
    end
  
    @files = ["CACHE MANIFEST\n\n"]

    #a timestamp that we can update from the app to force a reload
    @cache_timestamp = GlobalSetting.parsed_setting_for GlobalSetting::RELOAD_HTML5_CACHE_TIMESTAMP, current_outlet
    @files << "\n\n# Cache Timestamp: #{@cache_timestamp}\n\n"
    
   
    @all_images = Dir.glob("#{Rails.root}/public/images/**/*")
    
    @all_images.sort!
    
    @all_images.each do |rb_file|
      #ignore the product images dir as they are dealt with below
      next if rb_file.match(/\/images\/product_images\//)
      
      next if !rb_file.match /\.png$/ and !rb_file.match /\.jpg$/ and !rb_file.match /\.gif$/
      
      #escape whitespace
      if rb_file.match /\s+/ 
        rb_file.gsub!(" ", "%20")
        rb_file
      end
      
      @files << "#{Rails.application.config.action_controller.asset_host}#{rb_file[rb_file.rindex("/public/")+7..rb_file.length-1]}"
      
    end
    
    
    #now, load images relating to a particular outlet products
    @outlet_product_images = []
    @outlet_product_images_paperclip = []
    
    Product.non_deleted(current_outlet).all.each do |product|
      if product.has_product_image?
        @outlet_product_images_paperclip << product.product_image.url(:thumb, false)
      elsif product.display_image and !product.display_image.blank?
        @outlet_product_images << "/images/product_images/#{product.display_image}"
      end
    end
    
    @outlet_product_images.sort!
    
    @outlet_product_images.each do |rb_file|
      next if !rb_file.match /\.png$/ and !rb_file.match /\.jpg$/ and !rb_file.match /\.gif$/
      
      #escape whitespace
      if rb_file.match /\s+/ 
        rb_file.gsub!(" ", "%20")
        rb_file
      end
      
      @files << "#{Rails.application.config.action_controller.asset_host}#{rb_file}"
      
    end
    
    #we need to treat the paperclip images differently
    #they are in the form: http://s3.amazonaws.com/cluey_user_uploads/app/public/system/product_images/699/thumb/hot-nuts2.jpg
    #we need to strip out the part just before and including the bucket name and put our own in
    @outlet_product_images_paperclip.sort!
    
    @outlet_product_images_paperclip.each do |rb_file|
      
      @bucket_name_start_index = rb_file.index S3_USER_UPLOADS_BUCKET_NAME      
      @bucket_name_end_index = @bucket_name_start_index + S3_USER_UPLOADS_BUCKET_NAME.length
      rb_file = rb_file[@bucket_name_end_index..rb_file.length - 1]
      
      next if !rb_file.match /\.png$/ and !rb_file.match /\.jpg$/ and !rb_file.match /\.gif$/
      
      #escape whitespace
      if rb_file.match /\s+/ 
        rb_file.gsub!(" ", "%20")
        rb_file
      end
      
      @files << "#{S3_USER_UPLOADS_ASSET_HOST}#{rb_file}"
      
    end
    
    
    
    #now, load images relating to a particular outlet employees
    @outlet_employee_images = []
    
    current_outlet.employees.all.each do |employee|
      if Employee.is_cluey_user?(employee.id)
        @outlet_employee_images << "/images/cluey_user_image.jpg"
      elsif employee.has_employee_image?
        @outlet_employee_images << employee.employee_image.url(:thumb)
      end
    end
    
    @outlet_employee_images.sort!
    
    @outlet_employee_images.each do |rb_file|
      next if !rb_file.match /\.png$/ and !rb_file.match /\.jpg$/ and !rb_file.match /\.gif$/
      
      #escape whitespace
      if rb_file.match /\s+/ 
        rb_file.gsub!(" ", "%20")
        rb_file
      end
      
      @files << "#{Rails.application.config.action_controller.asset_host}#{rb_file}"
      
    end
    
    
    
    #now, load images relating to a particular outlet payment methods
    @outlet_payment_method_images = []
    
    current_outlet.payment_methods.all.each do |payment_method|
      if payment_method.has_logo?
        @outlet_payment_method_images << payment_method.logo.url(:thumb)
      end
    end
    
    @outlet_payment_method_images.sort!
    
    @outlet_payment_method_images.each do |rb_file|
      next if !rb_file.match /\.png$/ and !rb_file.match /\.jpg$/ and !rb_file.match /\.gif$/
      
      #escape whitespace
      if rb_file.match /\s+/ 
        rb_file.gsub!(" ", "%20")
        rb_file
      end
      
      @files << "#{Rails.application.config.action_controller.asset_host}#{rb_file}"
      
    end
    
    
    #
    ##
    ##
    ##
    ##
    #manually list out the js files
    @files << "#{Rails.application.config.action_controller.asset_host}/javascripts/cache/accounts.js"
    @files << "#{Rails.application.config.action_controller.asset_host}/javascripts/cache/jq_libs.js"
    @files << "#{Rails.application.config.action_controller.asset_host}/javascripts/cache/large_screen.js"
    @files << "#{Rails.application.config.action_controller.asset_host}/javascripts/cache/medium_screen.js"
    @files << "#{Rails.application.config.action_controller.asset_host}/javascripts/cache/plugin_libs_1.js"
    @files << "#{Rails.application.config.action_controller.asset_host}/javascripts/cache/plugin_libs_2.js"
    @files << "#{Rails.application.config.action_controller.asset_host}/javascripts/cache/shared.js"
    @files << "#{Rails.application.config.action_controller.asset_host}/javascripts/cache/modal_popups_libs.js"

    #
    ##
    ##
    ##
    ##
    #manually list out the stylesheet files
    @files << "#{Rails.application.config.action_controller.asset_host}/stylesheets/cache/accounts.css"
    @files << "#{Rails.application.config.action_controller.asset_host}/stylesheets/cache/large_screen_styles.css"
    @files << "#{Rails.application.config.action_controller.asset_host}/stylesheets/cache/medium_screen_styles.css"
    
    @files << "\nNETWORK:"
    @files << "*\n\n"
    
    response.headers["Expires"] = "access plus 10 seconds"
    response.headers["Cache-Control"] = "no-cache, private"
    
    render :text => @files.join("\n"), :content_type => 'text/cache-manifest', :layout => nil
  end
  
  def build_assets
    if !development_mode?
      redirect_to home_path and return
    end
    
    render :layout => nil
  end
  
  def js_error_log
    #spit out the params
    params.each do |key, value|
      logger.info "#{key}=#{CGI.unescape value}"
    end
    
    render :json => {:success => true}.to_json
  end

  private

  def do_common_interface_actions
    @employees = Employee.all_active current_outlet
    @display = TerminalDisplayLink.load_display_for_terminal @terminal_id, current_outlet
    @rooms = current_outlet.rooms.all
  end
  
  def do_large_interface_actions
    #load the buttons for roles
    @menu_screen_buttons_map = {}
    @options_screen_buttons_map = {}
    
    current_outlet.roles.each do |role|
      @menu_screen_buttons_map[role.id] = DisplayButtonRole.menu_screen_buttons_for_role(current_outlet, role.id)
      @options_screen_buttons_map[role.id] = DisplayButtonRole.admin_screen_buttons_for_role(current_outlet, role.id)
    end 
    
    @customer_letter_query = ActiveRecord::Base.connection.execute("select substr(name,1,1) as letter from customers where customer_type in ('#{Customer::NORMAL}', '#{Customer::BOTH}') and is_active = true and outlet_id = #{current_outlet.id} group by substr(name,1,1)")

    @customer_letters = []
    
    for element in @customer_letter_query
      element[0].downcase!
      @customer_letters += element
    end
    
    @product_letter_query = ActiveRecord::Base.connection.execute("select substr(name,1,1) as letter from products where products.is_stock_item = true and outlet_id = #{current_outlet.id} group by substr(name,1,1)")

    @product_letters = []
    
    for element in @product_letter_query
      element[0].downcase!
      @product_letters += element
    end
     
  end
  
  def do_medium_interface_actions
    @tables_button = DisplayButton.find_by_outlet_id_and_perm_id(current_outlet.id, ButtonMapper::TABLES_BUTTON) 
    @order_button = DisplayButton.find_by_outlet_id_and_perm_id(current_outlet.id, ButtonMapper::ORDER_BUTTON) 
    @modify_button = DisplayButton.find_by_outlet_id_and_perm_id(current_outlet.id, ButtonMapper::MODIFY_ORDER_ITEM_BUTTON)
    @course_button = DisplayButton.find_by_outlet_id_and_perm_id(current_outlet.id, ButtonMapper::COURSE_BUTTON)
    @remove_item_button = DisplayButton.find_by_outlet_id_and_perm_id(current_outlet.id, ButtonMapper::REMOVE_ITEM_BUTTON);
    @print_bill_button = DisplayButton.find_by_outlet_id_and_perm_id(current_outlet.id, ButtonMapper::PRINT_BILL_BUTTON);
    @global_settings_button = DisplayButton.find_by_outlet_id_and_perm_id(current_outlet.id, ButtonMapper::SYSTEM_BUTTON);
    @transfer_order_button = DisplayButton.find_by_outlet_id_and_perm_id(current_outlet.id, ButtonMapper::TRANSFER_ORDER_BUTTON);
    @toggle_menu_item_double_mode_button = DisplayButton.find_by_outlet_id_and_perm_id(current_outlet.id, ButtonMapper::TOGGLE_MENU_ITEM_DOUBLE_BUTTON);
    @toggle_menu_item_half_mode_button = DisplayButton.find_by_outlet_id_and_perm_id(current_outlet.id, ButtonMapper::TOGGLE_MENU_ITEM_HALF_BUTTON);
    
    @display_buttons = []

    @modify_button.button_text = @modify_button.button_text
    
    @display_buttons << @tables_button << @order_button << @modify_button
    
    @functions_display_buttons = []
    @functions_display_buttons << @remove_item_button 
    @functions_display_buttons << @print_bill_button << @transfer_order_button
    @functions_display_buttons << @toggle_menu_item_double_mode_button << @toggle_menu_item_half_mode_button
    
  end
  
  def update_last_active employee
    employee.last_active = Time.now
    employee.save!
  end
  
  def store_receipt_html
    return unless current_employee
    
    #store the last receipt html for the terminal, server and table
    if params[:currentTerminalRecptHTML] and !params[:currentTerminalRecptHTML].blank?
      current_outlet.stored_receipt_htmls.find_all_by_receipt_type_and_receipt_key(StoredReceiptHtml::TERMINAL, @terminal_id).each(&:destroy)
      @srh = StoredReceiptHtml.new({:outlet_id => current_outlet.id, :receipt_type => StoredReceiptHtml::TERMINAL, :receipt_key => @terminal_id, :stored_html => params[:currentTerminalRecptHTML]})
      @srh.save!
      
      current_outlet.stored_receipt_htmls.find_all_by_receipt_type_and_receipt_key(StoredReceiptHtml::EMPLOYEE, current_employee.nickname).each(&:destroy)
      @serh = StoredReceiptHtml.new({:outlet_id => current_outlet.id, :receipt_type => StoredReceiptHtml::EMPLOYEE, :receipt_key => current_employee.nickname, :stored_html => params[:currentTerminalRecptHTML]})
      @serh.save!
      
      @current_table_label = params[:currentTerminalRecptTableLabel]
      
      if @current_table_label and !@current_table_label.blank?
        current_outlet.stored_receipt_htmls.find_all_by_receipt_type_and_receipt_key(StoredReceiptHtml::TABLE, @current_table_label).each(&:destroy)
        @strh = StoredReceiptHtml.new({:outlet_id => current_outlet.id, :receipt_type => StoredReceiptHtml::TABLE, :receipt_key => @current_table_label, :stored_html => params[:currentTerminalRecptHTML]})
        @strh.save!
      end
    end
  end
  
  #this function updates the timestamp of the gs used to represent the terminal,
  #it allows us to see what terminals are currently active
  def update_terminal_timestamp
    #@@terminal_id_gs is set in a before filter in application controller
    @terminal_id_gs.updated_at = Time.now
    @terminal_id_gs.save
  end
  
  def set_interface_large
    session[:current_interface] = GlobalSetting::LARGE_INTERFACE
  end
  
  def set_interface_medium
    session[:current_interface] = GlobalSetting::MEDIUM_INTERFACE
  end

end