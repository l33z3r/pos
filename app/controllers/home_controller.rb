class HomeController < ApplicationController

  #main screen including the login overlay
  def index
    load_active_employees
    @display = Display.load_default
    
    @rooms = Room.all
  end
  
  def mobile_index
    @all_terminals = all_terminals
    @all_servers = all_servers
      
    render :layout => "mobile"
  end

  def init_sales_screen_buttons
    #we get passed the user id as it may not have been set in the session yet,
    #as the ajax login call may not yet have happened
    @current_employee_id = params[:current_user_id]
    @employee = Employee.find(@current_employee_id)
  end
  
  def call_home
    #check if we need to reload the interface due to room builder or menu screen being accessed
    @last_interface_reload_time = params[:lastInterfaceReloadTime]
    
    @reload_app = fetch_reload_app @last_interface_reload_time
    
    if @reload_app
      @reload_request_time = @reload_app['reload_request_time']
      @reload_request_terminal_id = @reload_app['reload_request_terminal_id']
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
    
  end
  
  def request_terminal_reload
    request_reload_app @terminal_id
    redirect_to(:back, :notice => 'Reload request sent.')
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
    
    session[:active_employee_ids] ||= []

    if !session[:active_employee_ids].include? @employee.id
      #add this employee to the active users list
      session[:active_employee_ids] << @employee.id
    end

    update_last_active @employee

    load_active_employees

    render :action => :active_employees
  end

  def clockout
    @employee = Employee.find(params[:id])

    redirect_to :back, :flash => {:error => "Employee not found."} and return if @employee.nil?

    #remove the user from active employee list and refetch the list
    @active_employee_ids = session[:active_employee_ids]
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

  private

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
    session[:active_employee_ids] ||= []
    
    @ids = session[:active_employee_ids]
    @active_employees ||= []
    @active_employees = Employee.find(@ids) if @ids
  end
  
  def store_receipt_html
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

end