class HomeController < ApplicationController
  cache_sweeper :product_sweeper  
  
  #main screen including the login overlay
  def index
    perform_interface_specific_actions
    
    #now the actions common to all interfaces
    do_common_interface_actions
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
      @new_reload_app_update_time = @reload_request_time.to_i + 1
    end
    
    #check the last timestamp for the table order sync
    @last_sync_table_order_time = params[:lastSyncTableOrderTime]
    
    @sync_table_order = fetch_sync_table_order @last_sync_table_order_time
    
    if @sync_table_order
      
      if @sync_table_order[:clear_table_order]
        @clear_table_order = @sync_table_order
        @sync_table_order = nil
        @table_label = TableInfo.find(@clear_table_order[:table_id]).perm_id
        
        @serving_employee_id = @clear_table_order[:serving_employee_id];
        @terminal_employee = Employee.find(@serving_employee_id).nickname;
        
        @clear_table_order_request_time = @clear_table_order[:sync_table_order_request_time]
        @new_clear_table_order_time = @clear_table_order_request_time.to_i + 1
      else
        @sync_table_order_request_time = @sync_table_order[:sync_table_order_request_time]
        @sync_table_order_request_terminal_id = @sync_table_order[:sync_table_order_request_terminal_id]
        @sync_table_order_data = JSON.parse(@sync_table_order[:order_data]).symbolize_keys!
      
        @table_label = TableInfo.find(@sync_table_order_data[:tableID]).perm_id
      
        @serving_employee_id = @sync_table_order[:serving_employee_id];
        @terminal_employee = Employee.find(@serving_employee_id).nickname;
      
        @new_sync_table_order_time = @sync_table_order_request_time.to_i + 1
      end
    end
    
    store_receipt_html
    update_terminal_timestamp
    
  end
  
  def load_price_for_menu_page
    @page_num = params[:page_num].to_i
    @display = TerminalDisplayLink.load_display_for_terminal @terminal_id
    
    @price_map = {}
    
    @display.menu_pages[@page_num-1].menu_items.each do |mi|
      next if !mi.product
      @price = mi.product.price
      @price_map[mi.id] = @price ? print_money(@price) : 0
    end
  end
  
  def load_price_receipt_for_product
    @product = Product.find(params[:product_id])
  end
  
  def update_price
    @product = Product.find(params[:product_id])
    @new_price = params[:new_price].to_f
    
    @menu_item_id = params[:menu_item_id]
    
    @change_amount = @new_price - @product.price
    
    @product.price = @new_price
    @product.save!
  end
  
  def load_stock_for_menu_page    
    @page_num = params[:page_num].to_i
    @display = TerminalDisplayLink.load_display_for_terminal @terminal_id
    
    @stock_map = {}
    
    @display.menu_pages[@page_num-1].menu_items.each do |mi|
      next if !mi.product
      @stock = mi.product.quantity_in_stock
      @stock_map[mi.id] = @stock ? number_to_human(@stock) : 0
    end
  end
  
  def load_stock_receipt_for_product
    @product = Product.find(params[:product_id])
    
    @stock_transaction = @product.last_stock_transaction.last
  end
  
  def update_stock
    @product = Product.find(params[:product_id])
    @new_amount = params[:new_amount].to_f
    @type = params[:t_type]
    
    @menu_item_id = params[:menu_item_id]
    
    @change_amount = @new_amount - @product.quantity_in_stock
    
    @st = StockTransaction.create(:product_id => @product.id, :employee_id => current_employee.id, 
      :old_amount => @product.quantity_in_stock, :change_amount => @change_amount, :transaction_type => @type)
    
    @product.quantity_in_stock = @new_amount
    @product.save!
  end
  
  def request_terminal_reload
    request_reload_app @terminal_id
    
    update_html5_cache_timestamp
    
    redirect_to(:back, :notice => 'Reload request sent.')
  end
  
  def clear_all_fragment_caches
    clear_caches
    redirect_to home_path
  end
  
  def active_employees
    load_active_employees
  end

  #do login procedure
  def login
    @employee = Employee.find(params[:id])

    session[:current_employee_id] = @employee.id
    session[:current_employee_nickname] = @employee.nickname
    session[:current_employee_admin] = 1 if @employee.is_admin
    session[:current_employee_role_id] = @employee.role.id
    session[:current_employee_passcode] = @employee.passcode 
    
    @employee.last_login = Time.now
    @employee.save!

    render :json => {:success => true}.to_json
  end
  
  def clockin
    @employee = Employee.find(params[:id])
    
    if !active_employee_ids.include? @employee.id
      #add this employee to the active users list
      active_employee_ids << @employee.id
    end

    update_last_active @employee

    load_active_employees

    render :action => :active_employees
  end

  def clockout
    @employee = Employee.find(params[:id])

    redirect_to :back, :flash => {:error => "Employee not found."} and return if @employee.nil?

    #remove the user from active employee list and refetch the list
    @active_employee_ids = active_employee_ids
    @active_employee_ids.delete @employee.id

    clear_session

    update_last_active @employee

    load_active_employees

    render :action => :active_employees
  end

  def logout
    @employee = Employee.find(e)
    @employee.last_logout = Time.now
    @employee.save!

    update_last_active @employee

    clear_session

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
    
    @response = Net::HTTP.post_form(URI.parse(@url), {"content_to_print" => @html_data})

    logger.info "Got response from print service: #{@response}"
    
    render :json => {:success => true}.to_json
  end
  
  def forward_cash_drawer_request
    @url = params[:cash_drawer_service_url]
    @message = params[:message]
    
    logger.info "Forwarding a cash drawer request to #{@url}"
    
    @response = Net::HTTP.post_form(URI.parse(@url), {"message" => @message})

    logger.info "Got response from cash drawer service: #{@response}"
    
    render :json => {:success => true}.to_json
  end

  private

  def do_common_interface_actions
    load_active_employees
    
    @display = TerminalDisplayLink.load_display_for_terminal @terminal_id
    @rooms = Room.all
  end
  
  def perform_interface_specific_actions
    if current_interface_large?
      do_large_interface_actions
    elsif current_interface_medium?
      do_medium_interface_actions
    else
      do_large_interface_actions
    end
  end
  
  def do_large_interface_actions
    #load the buttons for roles
    @menu_screen_buttons_map = {}
    @options_screen_buttons_map = {}
    
    Role.all.each do |role|
      @menu_screen_buttons_map[role.id] = DisplayButtonRole.menu_screen_buttons_for_role(role.id)
      @options_screen_buttons_map[role.id] = DisplayButtonRole.admin_screen_buttons_for_role(role.id)
    end  
  end
  
  def do_medium_interface_actions
    
    #make sure we have an active session, otherwise, redirect to the mobile interface and force login
    if !current_employee
      redirect_to mbl_path and return
    end
    
    @tables_button = DisplayButton.find_by_perm_id(ButtonMapper::TABLES_BUTTON) 
    @order_button = DisplayButton.find_by_perm_id(ButtonMapper::ORDER_BUTTON) 
    @modify_button = DisplayButton.find_by_perm_id(ButtonMapper::MODIFY_ORDER_ITEM_BUTTON) 
    @more_options_button = DisplayButton.find_by_perm_id(ButtonMapper::MORE_OPTIONS_BUTTON)
    @course_button = DisplayButton.find_by_perm_id(ButtonMapper::COURSE_BUTTON)
    @remove_item_button = DisplayButton.find_by_perm_id(ButtonMapper::REMOVE_ITEM_BUTTON);
    
    @display_buttons = []
    
    @display_buttons << @tables_button << @order_button << @modify_button
    
    @functions_display_buttons = []
    @functions_display_buttons << @course_button << @remove_item_button << @more_options_button
    
  end
  
  def clear_session
    session[:current_employee_id] = nil
    session[:current_employee_nickname] = nil
    session[:current_employee_admin] = nil
    session[:current_employee_role_id] = nil
    session[:current_employee_passcode] = nil
  end
  
  def update_last_active employee
    employee.last_active = Time.now
    employee.save!
  end

  def load_active_employees
    @ids = active_employee_ids
    @active_employees ||= []
    @active_employees = Employee.find(@ids, :order => :last_active) if @ids
  end
  
  def store_receipt_html
    return unless current_employee
    
    #store the last receipt html for the terminal, server and table
    if params[:currentTerminalRecptHTML] and !params[:currentTerminalRecptHTML].blank?
      StoredReceiptHtml.find_all_by_receipt_type_and_receipt_key(StoredReceiptHtml::TERMINAL, @terminal_id).each(&:destroy)
      @srh = StoredReceiptHtml.new({:receipt_type => StoredReceiptHtml::TERMINAL, :receipt_key => @terminal_id, :stored_html => params[:currentTerminalRecptHTML]})
      @srh.save!
      
      StoredReceiptHtml.find_all_by_receipt_type_and_receipt_key(StoredReceiptHtml::EMPLOYEE, current_employee.nickname).each(&:destroy)
      @serh = StoredReceiptHtml.new({:receipt_type => StoredReceiptHtml::EMPLOYEE, :receipt_key => current_employee.nickname, :stored_html => params[:currentTerminalRecptHTML]})
      @serh.save!
      
      @current_table_label = params[:currentTerminalRecptTableLabel]
      
      if @current_table_label and !@current_table_label.blank?
        StoredReceiptHtml.find_all_by_receipt_type_and_receipt_key(StoredReceiptHtml::TABLE, @current_table_label).each(&:destroy)
        @strh = StoredReceiptHtml.new({:receipt_type => StoredReceiptHtml::TABLE, :receipt_key => @current_table_label, :stored_html => params[:currentTerminalRecptHTML]})
        @strh.save!
      end
    end
  end
  
  #this function updates the timestamp of the gs used to represent the terminal,
  #it allows us to see what terminals are currently active
  def update_terminal_timestamp
    #@@terminal_id_gs is set in a before filter in application controller
    @terminal_id_gs.updated_at = Time.now
    @terminal_id_gs.save!
  end

end