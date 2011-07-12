@super_user_role = Role.find_or_create_by_name({:name => "Super User"})

@admin_employee = Employee.find_or_create_by_nickname({:nickname => "admin", :staff_id => "1111", :name => "admin", 
    :passcode => "1111", :clockin_code => "1111", :address => "admin address", :telephone => "admin telephone",
    :hourly_rate => "1", :overtime_rate => "1", :role_id => @super_user_role.id})

@display_buttons_map = [[1, "X Total"],[2, "Z Total"],[3, "X Reports"], [4, "Z Reports"], [5, "Users"],
[6, "Roles"], [7, "Products"], [8, "Categories"], [9, "Displays"], [10, "Sales Screen"],
[11, "Access Control"], [12, "Modifier Categories"], [13, "Room Builder"], [14, "Total"],
[15, "Sub-Total"], [16, "Save"], [17, "More Options"], [18, "Button Config"], [19, "Tables"],
[20, "System"], [21, "Themes"], [22, "Discount"], [23, "Client"], [24, "Waste"],
[25, "Free"], [26, "Change Price"], [27, "Float"], [28, "No Sale"], [29, "Refund"],
[30, "Remove Item"], [31, "Add Note"], [32, "Change Waiter"], [33, "Printers"], [34, "Transfer Order"],
[35, "Split Order"], [36, "Stock Take"], [37, "Delivery"], [38, "Cash Out"], [39, "Receipt Setup"],
[40, "Payment Methods"], [41, "Gift Voucher"], [42, "Order Types"], [43, "Set Up Discounts"],
[44, "Print Receipt"], [45, "Order"], [46, "Service Charge"], [47, "Previous Sales"]]

@display_buttons_map.each do |perm_id, button_text|
  DisplayButton.find_or_create_by_perm_id({:perm_id => perm_id, :button_text => button_text})
end