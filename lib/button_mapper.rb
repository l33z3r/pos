class ButtonMapper
  include Rails.application.routes.url_helpers

  X_TOTAL_BUTTON = 1
  Z_TOTAL_BUTTON = 2
  X_REPORTS_BUTTON = 3
  Z_REPORTS_BUTTON = 4
  MANAGE_USERS_BUTTON = 5
  MANAGE_ROLES_BUTTON = 6
  MANAGE_PRODUCTS_BUTTON = 7
  MANAGE_CATEGORIES_BUTTON = 8
  MANAGE_DISPLAYS_BUTTON = 9
  MANAGE_SALES_SCREEN_BUTTON = 10
  ACCESS_CONTROL_BUTTON = 11
  MANAGE_MODIFIER_CATEGORIES_BUTTON = 12
  ROOM_BUILDER_BUTTON = 13
  TOTAL_BUTTON = 14
  SUBTOTAL_BUTTON = 15
  SAVE_BUTTON = 16
  MORE_OPTIONS_BUTTON = 17
  BUTTON_CONFIG_BUTTON = 18
  TABLES_BUTTON = 19
  SYSTEM_BUTTON = 20
  THEMES_BUTTON = 21
  DISCOUNT_BUTTON = 22
  CLIENT_BUTTON = 23
  WASTE_BUTTON = 24
  COMPLIMENTARY_BUTTON = 25
  CHANGE_PRICE_BUTTON = 26
  FLOAT_BUTTON = 27
  NO_SALE_BUTTON = 28
  REFUND_BUTTON = 29
  REMOVE_ITEM_BUTTON = 30
  ADD_NOTE_BUTTON = 31
  CHANGE_WAITER_BUTTON = 32
  PRINTERS_BUTTON = 33
  TRANSFER_ORDER_BUTTON = 34
  SPLIT_ORDER_BUTTON = 35
  STOCK_TAKE_BUTTON = 36
  DELIVERY_BUTTON = 37
  CASH_OUT_BUTTON = 38
  RECEIPT_SETUP_BUTTON = 39
  PAYMENT_METHODS_BUTTON = 40
  GIFT_VOUCHER_BUTTON = 41
  ORDER_TYPES_BUTTON = 42
  DISCOUNTS_SURCHARGES_BUTTON = 43
  PRINT_RECEIPT_BUTTON = 44
  ORDER_BUTTON = 45
  
  def action_for_button button

    @retval = ""

    case button.perm_id
    when X_TOTAL_BUTTON
      @retval = "doXTotal();"
    when Z_TOTAL_BUTTON
      @retval = "doZTotal();"
    when X_REPORTS_BUTTON
      @retval = "alert('x reports clicked');"
    when Z_REPORTS_BUTTON
      @retval = "alert('z reports clicked');"
    when MANAGE_USERS_BUTTON
      @retval = "window.location = '#{admin_employees_path}'; return false;"
    when MANAGE_ROLES_BUTTON
      @retval = "window.location = '#{admin_roles_path}'; return false;"
    when MANAGE_PRODUCTS_BUTTON
      @retval = "window.location = '#{admin_products_path}'; return false;"
    when MANAGE_CATEGORIES_BUTTON
      @retval = "window.location = '#{admin_categories_path}'; return false;"
    when MANAGE_DISPLAYS_BUTTON
      @retval = "window.location = '#{admin_displays_path}'; return false;"
    when MANAGE_SALES_SCREEN_BUTTON
      @retval = "window.location = '#{screen_admin_display_buttons_path}'; return false;"
    when ACCESS_CONTROL_BUTTON
      @retval = "window.location = '#{access_admin_display_buttons_path}'; return false;"
    when MANAGE_MODIFIER_CATEGORIES_BUTTON
      @retval = "window.location = '#{admin_modifier_categories_path}'; return false;"
    when ROOM_BUILDER_BUTTON
      @retval = "window.location = '#{admin_rooms_path}'; return false;"
    when TOTAL_BUTTON
      @retval = wrap_with_menu_screen_function_check "doTotalFinal();"
    when SUBTOTAL_BUTTON
      @retval = wrap_with_menu_screen_function_check "doTotal();"
    when SAVE_BUTTON
      @retval = "doLogout();"
    when MORE_OPTIONS_BUTTON
      @retval = "window.location = '#{admin_path}'; return false;"
    when BUTTON_CONFIG_BUTTON
      @retval = "window.location = '#{edit_multiple_admin_display_buttons_path}'; return false;"
    when TABLES_BUTTON
      @retval = wrap_with_menu_screen_function_check "showTablesScreen(); return false;"
    when SYSTEM_BUTTON
      @retval = "window.location = '#{admin_global_settings_path}'; return false;"
    when THEMES_BUTTON
      @retval = "window.location = '#{admin_custom_themes_path}'; return false;"
    when DISCOUNT_BUTTON
      @retval = wrap_with_menu_screen_function_check "showDiscountPopup(null);"
    when CLIENT_BUTTON
      @retval = "alert('client button clicked');"
    when WASTE_BUTTON
      @retval = wrap_with_menu_screen_function_check "alert('waste button clicked');"
    when COMPLIMENTARY_BUTTON
      @retval = wrap_with_menu_screen_function_check "alert('complimentary button clicked');"
    when CHANGE_PRICE_BUTTON
      @retval = wrap_with_menu_screen_function_check "alert('change price button clicked');"
    when FLOAT_BUTTON
      @retval = "alert('float button clicked');"
    when NO_SALE_BUTTON
      @retval = wrap_with_menu_screen_function_check "alert('no sale button clicked');"
    when REFUND_BUTTON
      @retval = wrap_with_menu_screen_function_check "alert('refund button clicked');"
    when REMOVE_ITEM_BUTTON
      @retval = wrap_with_menu_screen_function_check "alert('remove item button clicked');"
    when ADD_NOTE_BUTTON
      @retval = wrap_with_menu_screen_function_check "alert('add note button clicked');"
    when CHANGE_WAITER_BUTTON
      @retval = "alert('change waiter button clicked');"
    when PRINTERS_BUTTON
      @retval = "alert('printers button clicked');"
    when TRANSFER_ORDER_BUTTON
      @retval = "alert('transfer order button clicked');"
    when SPLIT_ORDER_BUTTON
      @retval = "alert('split order button clicked');"
    when STOCK_TAKE_BUTTON
      @retval = "alert('stock take button clicked');"
    when DELIVERY_BUTTON
      @retval = "alert('delivery button clicked');"
    when CASH_OUT_BUTTON
      @retval = wrap_with_menu_screen_function_check "alert('cash out button clicked');"
    when RECEIPT_SETUP_BUTTON
      @retval = "alert('receipt setup button clicked');"
    when PAYMENT_METHODS_BUTTON
      @retval = "window.location = '#{admin_global_settings_path}?section=payment_methods'; return false;"
    when GIFT_VOUCHER_BUTTON
      @retval = "alert('gift voucher button clicked');"
    when ORDER_TYPES_BUTTON
      @retval = "alert('order types button clicked');"
    when DISCOUNTS_SURCHARGES_BUTTON
      @retval = "window.location = '#{admin_global_settings_path}?section=discounts'; return false;"
    when PRINT_RECEIPT_BUTTON
      @retval = "alert('print receipt button clicked');"
    when ORDER_BUTTON
      @retval = "alert('order button clicked');"
    end

    @retval
  end
  
  def icon_path_for button
    ButtonMapper.constants.each do |constant_name|
      #puts "#{constant_name.to_s} : #{eval(constant_name.to_s)}"
    
      if button.perm_id.to_s == eval(constant_name.to_s).to_s
        return "#{constant_name.to_s.downcase}.png"
      end
    end
    
    return ""
  end
  
  def wrap_with_menu_screen_function_check the_script
    return "if(checkMenuScreenForFunction()){#{the_script}}"
  end
  
end