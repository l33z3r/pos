class OutletBuilder
  def self.build_outlet_seed_data outlet_id
    @super_user_role = Role.find_or_create_by_outlet_id_and_name({:outlet_id => outlet_id, :name => "Administrator"})

    @admin_employee = Employee.find_or_create_by_outlet_id_and_nickname({:outlet_id => outlet_id, :nickname => "admin", :staff_id => "1111", :name => "admin", 
        :passcode => "1111", :clockin_code => "1111", :address => "admin address", :telephone => "admin telephone",
        :hourly_rate => "1", :overtime_rate => "1", :role_id => @super_user_role.id})

    @cluey_employee = Employee.find_or_create_by_outlet_id_and_nickname({:outlet_id => outlet_id, :nickname => "cluey", :staff_id => "-1", :name => "cluey", 
        :passcode => "999", :clockin_code => "999", :address => "cluey", :telephone => "cluey",
        :hourly_rate => "1", :overtime_rate => "1", :role_id => @super_user_role.id})

    @employee_role = Role.find_or_create_by_outlet_id_and_name({:outlet_id => outlet_id, :name => "Employee"})

    @chef_employee = Employee.find_or_create_by_outlet_id_and_nickname({:outlet_id => outlet_id, :nickname => "chef", :staff_id => "-2", :name => "chef", 
        :passcode => "1010", :clockin_code => "1010", :address => "chef address", :telephone => "chef telephone",
        :hourly_rate => "1", :overtime_rate => "1", :role_id => @employee_role.id})
    #
    #
    #
    #
    #
    #
    #
    #
    #
    #Display Buttons and Roles
    @display_buttons_map = OutletBuilder::display_buttons_map
    
    #now create the buttons and also init a button role for admin user
    @display_buttons_map.each do |perm_id, button_text|
      @display_button = DisplayButton.find_or_create_by_outlet_id_and_perm_id(:outlet_id => outlet_id, :perm_id => perm_id, :button_text => button_text)
     
      DisplayButtonRole.find_or_create_by_outlet_id_and_display_button_id_and_role_id(:outlet_id => outlet_id, :display_button_id => @display_button.id, :role_id => @super_user_role.id, :show_on_admin_screen => true)
    end

    @default_sales_screen_button_perm_ids = OutletBuilder::default_sales_screen_button_perm_ids
      
    #set the default sales screen buttons
    @default_sales_screen_button_perm_ids.each do |display_button_perm_id|
      DisplayButton.find_by_outlet_id_and_perm_id(outlet_id, display_button_perm_id).display_button_roles.each do |dbr|
        dbr.show_on_sales_screen = true
        dbr.save!
      end
    end

    @display_button_group_names = ["Administration", "Management", "Reports", "Sales", "Tables"]
    
    @display_button_group_names.each do |group_name|
      DisplayButtonGroup.find_or_create_by_outlet_id_and_name(:outlet_id => outlet_id, :name => group_name)
    end
    
    #
    #
    #
    #
    #
    #
    #
    #
    #
    #Taxes and Payment Methods ETC
    @cash_payment_method = PaymentMethod.find_or_create_by_outlet_id_and_name(:outlet_id => outlet_id, :name => PaymentMethod::CASH_PAYMENT_METHOD_NAME, :payment_integration_id => 0, :open_cash_drawer => true, :is_default => true)
    @loyalty_payment_method = PaymentMethod.find_or_create_by_outlet_id_and_name(:outlet_id => outlet_id, :name => PaymentMethod::LOYALTY_PAYMENT_METHOD_NAME, :payment_integration_id => 0, :open_cash_drawer => false, :is_default => false)
    @account_payment_method = PaymentMethod.find_or_create_by_outlet_id_and_name(:outlet_id => outlet_id, :name => PaymentMethod::ACCOUNT_PAYMENT_METHOD_NAME, :payment_integration_id => 0, :open_cash_drawer => false, :is_default => false)

    @default_tax_rate = TaxRate.find_or_create_by_outlet_id_and_name(:outlet_id => outlet_id, :name => "default", :rate => 12, :is_default => true)

    @default_discount_rate = Discount.find_or_create_by_outlet_id_and_name(:outlet_id => outlet_id, :name => "default", :percent => "10", :is_default => true)

    #
    #
    #
    #
    #
    #
    #
    #
    #
    #Default Display and Modifier Grid

    @default_display = Display.find_by_outlet_id_and_name(outlet_id, "Default")

    if !@default_display
      @default_display = Display.create({:outlet_id => outlet_id, :name => "Default"})
        
      @default_display.save!
        
      #give the display an initial 2 pages
      @page_1 = @default_display.menu_pages.build({:outlet_id => outlet_id, :name => "Favourites", :page_num => 1})
      @page_2 = @default_display.menu_pages.build({:outlet_id => outlet_id, :name => "Page 2", :page_num => 2})

      @page_1.save!
      @page_2.save!

      (1..16).each do |num|
        @page_1.menu_items.build({:outlet_id => outlet_id, :order_num => num}).save!
        @page_2.menu_items.build({:outlet_id => outlet_id, :order_num => num}).save!
      end
      
      @default_display.is_default = true
      
      #build a modifier grid and set it as the default grid and link it to the above display
      @default_grid = OrderItemAdditionGrid.create({:outlet_id => outlet_id, :name => "Default", :grid_x_size => 6, :grid_y_size => 6})
    
      @default_display.save!
    end


    #Loyalty
    LoyaltyLevel.find_or_create_by_outlet_id_and_label({:outlet_id => outlet_id, :label => "Default", :percent => 10, :is_default => true})
    
    #some initial settings
    GlobalSetting.create({
        :outlet_id => outlet_id, :key => GlobalSetting::LAST_ORDER_ID.to_s, 
        :value => 0, 
        :label_text => GlobalSetting::LABEL_MAP[GlobalSetting::LAST_ORDER_ID]})
    
    #add a default terminal
    @default_terminal = @outlet.outlet_terminals.build
    @default_terminal.name = "terminal1"
    @default_terminal.save
  end
  
  def self.display_buttons_map
    return [[1, "X Total"],[2, "Z Total"],[3, "X/Z Options"], [4, "Z Options"], [5, "Employees"],
      [6, "Employee Roles"], [7, "Products"], [8, "Categories"], [9, "Displays"], [10, "Sales Screen"],
      [11, "Access Control"], [12, "Modifier Categories"], [13, "Room Design"], [14, "Cash"],
      [15, "Sub-Total"], [16, "Wait"], [17, "Functions"], [18, "Button Names"], [19, "Tables"],
      [20, "System Settings"], [21, "Themes"], [22, "Discount"], [23, "Clients"], [24, "Waste"],
      [25, "Free"], [26, "Change Price"], [27, "Float"], [28, "No Sale"], [29, "Refund"],
      [30, "Remove Item"], [31, "Add Note"], [32, "Change Waiter"], [33, "Printers"], [34, "Transfer"],
      [35, "Standard Price"], [36, "Stock Take"], [37, "Delivery"], [38, "Cash Out"], [39, "Receipt Setup"],
      [40, "Payment Methods"], [41, "Gift Voucher"], [42, "Order Types"], [43, "Set Up Discounts"],
      [44, "Print Receipt"], [45, "Order"], [46, "Service Charge"], [47, "Previous Sales"], [48, "Modify"],
      [49, "Modifier Grids"], [50, "Current Orders"], [51, "Manage Terminals"], [52, "Print Bill"], [53, "Course"],
      [54, "Kitchen Screen"], [55, "X/Z History"], [56, "Double"], [57, "Table Name"], [58, "Reports"], 
      [59, "Split Bill"], [60, "Exit App"], [61, "Void Item"], [62, "Void All Items"], [63, "Delete Order"], 
      [64, "Change Prices"], [65, "Charge Card"], [66, "Covers"], [67, "Product Info"], 
      [68, "Customers"], [69, "Loyalty Customers"], [70, "Half"], [71, "Payment Method Button 1"], 
      [72, "Payment Method Button 2"], [73, "Payment Method Button 3"], [74, "Training Mode"], [75, "Change Cost Price"],
      [76, "Edit Loyalty Points"]
    ]
  end
  
  def self.default_sales_screen_button_perm_ids
    return [ButtonMapper::MORE_OPTIONS_BUTTON, ButtonMapper::TOTAL_BUTTON, 
      ButtonMapper::SUBTOTAL_BUTTON, ButtonMapper::SAVE_BUTTON, ButtonMapper::TABLES_BUTTON, 
      ButtonMapper::CHANGE_PRICE_BUTTON, ButtonMapper::NO_SALE_BUTTON, ButtonMapper::REMOVE_ITEM_BUTTON, 
      ButtonMapper::ADD_NOTE_BUTTON, ButtonMapper::TRANSFER_ORDER_BUTTON, ButtonMapper::ORDER_BUTTON, 
      ButtonMapper::PRINT_BILL_BUTTON]
  end
end