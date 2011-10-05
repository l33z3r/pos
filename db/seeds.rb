@super_user_role = Role.find_or_create_by_name({:name => "Super User"})

@admin_employee = Employee.find_or_create_by_nickname({:nickname => "admin", :staff_id => "1111", :name => "admin", 
    :passcode => "1111", :clockin_code => "1111", :address => "admin address", :telephone => "admin telephone",
    :hourly_rate => "1", :overtime_rate => "1", :role_id => @super_user_role.id})

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
@display_buttons_map = [[1, "X Total"],[2, "Z Total"],[3, "X Reports"], [4, "Z Reports"], [5, "Users"],
  [6, "Roles"], [7, "Products"], [8, "Categories"], [9, "Displays"], [10, "Sales Screen"],
  [11, "Access Control"], [12, "Modifier Categories"], [13, "Room Builder"], [14, "Total"],
  [15, "Sub-Total"], [16, "Save"], [17, "More Options"], [18, "Button Config"], [19, "Tables"],
  [20, "System"], [21, "Themes"], [22, "Discount"], [23, "Client"], [24, "Waste"],
  [25, "Free"], [26, "Change Price"], [27, "Float"], [28, "No Sale"], [29, "Refund"],
  [30, "Remove Item"], [31, "Add Note"], [32, "Change Waiter"], [33, "Printers"], [34, "Transfer Order"],
  [35, "Split Order"], [36, "Stock Take"], [37, "Delivery"], [38, "Cash Out"], [39, "Receipt Setup"],
  [40, "Payment Methods"], [41, "Gift Voucher"], [42, "Order Types"], [43, "Set Up Discounts"],
  [44, "Print Receipt"], [45, "Order"], [46, "Service Charge"], [47, "Previous Sales"], [48, "Modify"],
  [49, "Modifier Grids"], [50, "Current Orders"], [51, "Manage Terminals"]]

#now create the buttons and also init a button role for admin user
@display_buttons_map.each do |perm_id, button_text|
  @display_button = DisplayButton.find_or_create_by_perm_id(:perm_id => perm_id, :button_text => button_text)
  DisplayButtonRole.find_or_create_by_display_button_id_and_role_id(:display_button_id => @display_button.id, :role_id => @super_user_role.id, :show_on_admin_screen => true)
end

#set the functions button to be visible on the menu screen
DisplayButton.find(17).display_button_roles.each do |dbr|
  dbr.show_on_sales_screen = true
  dbr.save!
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
@default_payment_method = PaymentMethod.find_or_create_by_name(:name => "cash", :is_default => true)

@default_tax_rate = TaxRate.find_or_create_by_name(:name => "default", :rate => 12, :is_default => true)

@default_discount_rate = Discount.find_or_create_by_name(:name => "default", :percent => "10", :is_default => true)

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

@default_display = Display.find_by_name("Default")

if !@default_display
  @default_display = Display.create({:name => "Default"})
        
  @default_display.save!
        
  #give the display an initial 2 pages
  @page_1 = @default_display.menu_pages.build({:name => "Favourites", :page_num => 1})
  @page_2 = @default_display.menu_pages.build({:name => "Page 2", :page_num => 2})

  @page_1.save!
  @page_2.save!

  (1..16).each do |num|
    @page_1.menu_items.build({:order_num => num}).save!
    @page_2.menu_items.build({:order_num => num}).save!
  end
      
  @default_display.is_default = true
      
  #build a modifier grid and set it as the default grid and link it to the above display
  @default_grid = OrderItemAdditionGrid.create({:name => "Default", :grid_x_size => 8, :grid_y_size => 4})
  @default_display.order_item_addition_grid_id = @default_grid.id
    
  @default_display.save!
end