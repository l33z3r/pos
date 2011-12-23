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
  SERVICE_CHARGE_BUTTON = 46
  PREVIOUS_ORDERS_BUTTON = 47
  MODIFY_ORDER_ITEM_BUTTON = 48
  MANAGE_ORDER_ITEM_ADDITION_GRIDS_BUTTON = 49
  CURRENT_ORDERS_BUTTON = 50
  MODIFY_TERMINALS_BUTTON = 51
  PRINT_BILL_BUTTON = 52
  COURSE_BUTTON = 53
  KITCHEN_SCREEN_BUTTON = 54
  PREVIOUS_CASH_TOTALS_BUTTON = 55
  TOGGLE_MENU_ITEM_DOUBLE_BUTTON = 56
  ADD_NAME_TO_TABLE_BUTTON = 57
  REPORTS_BUTTON = 58
  
  RESTRICTED_BUTTON_IDS = [
    ORDER_TYPES_BUTTON, GIFT_VOUCHER_BUTTON, RECEIPT_SETUP_BUTTON, SERVICE_CHARGE_BUTTON,
    CASH_OUT_BUTTON, DELIVERY_BUTTON, STOCK_TAKE_BUTTON, SPLIT_ORDER_BUTTON,
    PRINTERS_BUTTON, CHANGE_WAITER_BUTTON, REFUND_BUTTON, WASTE_BUTTON, CLIENT_BUTTON
  ]
  
  def action_for_button button

    @retval = ""

    case button.perm_id
    when X_TOTAL_BUTTON
      @retval = wrap_with_menu_screen_function_check "prepareXTotal();"
    when Z_TOTAL_BUTTON
      @retval = wrap_with_menu_screen_function_check "prepareZTotal();"
    when X_REPORTS_BUTTON
      @retval = "goTo('#{admin_cash_total_options_path}?section=x'); return false;"
    when Z_REPORTS_BUTTON
      @retval = "goTo('#{admin_cash_total_options_path}?section=z'); return false;"
    when MANAGE_USERS_BUTTON
      @retval = "goTo('#{admin_employees_path}'); return false;"
    when MANAGE_ROLES_BUTTON
      @retval = "goTo('#{admin_roles_path}'); return false;"
    when MANAGE_PRODUCTS_BUTTON
      @retval = "goTo('#{admin_products_path}'); return false;"
    when MANAGE_CATEGORIES_BUTTON
      @retval = "goTo('#{admin_categories_path}'); return false;"
    when MANAGE_DISPLAYS_BUTTON
      @retval = "goTo('#{admin_displays_path}'); return false;"
    when MANAGE_SALES_SCREEN_BUTTON
      @retval = "goTo('#{screen_admin_display_buttons_path}'); return false;"
    when ACCESS_CONTROL_BUTTON
      @retval = "goTo('#{access_admin_display_buttons_path}'); return false;"
    when MANAGE_MODIFIER_CATEGORIES_BUTTON
      @retval = "goTo('#{admin_modifier_categories_path}'; return false;"
    when ROOM_BUILDER_BUTTON
      @retval = "goTo('#{admin_rooms_path}'); return false;"
    when TOTAL_BUTTON
      @retval = "quickSale();"
    when SUBTOTAL_BUTTON
      @retval = "doTotal(true);"
    when SAVE_BUTTON
      @retval = "doLogout();"
    when MORE_OPTIONS_BUTTON
      @retval = "showMoreOptionsScreen(); return false;"
    when BUTTON_CONFIG_BUTTON
      @retval = "goTo('#{edit_multiple_admin_display_buttons_path}'); return false;"
    when TABLES_BUTTON
      @retval = "showTablesScreen(); return false;"
    when SYSTEM_BUTTON
      @retval = "showGlobalSettingsPage();"
    when THEMES_BUTTON
      @retval = "goTo('#{admin_custom_themes_path}'); return false;"
    when DISCOUNT_BUTTON
      @retval = wrap_with_menu_screen_function_check "showDiscountPopup(null);"
    when CLIENT_BUTTON
      @retval = wrap_with_menu_screen_function_check "alert('client button clicked');"
    when WASTE_BUTTON
      @retval = wrap_with_menu_screen_function_check "alert('waste button clicked');"
    when COMPLIMENTARY_BUTTON
      @retval = wrap_with_menu_screen_function_check "markFreeLastOrderItem();"
    when CHANGE_PRICE_BUTTON
      @retval = wrap_with_menu_screen_function_check "changePriceLastOrderItem();"
    when FLOAT_BUTTON
      @retval = "initFloatScreen();"
    when NO_SALE_BUTTON
      @retval = wrap_with_menu_screen_function_check "openCashDrawer();"
    when REFUND_BUTTON
      @retval = "alert('refund button clicked');"
    when REMOVE_ITEM_BUTTON
      @retval = wrap_with_menu_screen_function_check "removeLastOrderItem();"
    when ADD_NOTE_BUTTON
      @retval = wrap_with_menu_screen_function_check "showAddNoteToOrderItemScreen(); return false;"
    when CHANGE_WAITER_BUTTON
      @retval = "alert('change waiter button clicked');"
    when PRINTERS_BUTTON
      @retval = "alert('printers button clicked');"
    when TRANSFER_ORDER_BUTTON
      @retval = wrap_with_menu_screen_function_check "startTransferOrderMode();"
    when SPLIT_ORDER_BUTTON
      @retval = "alert('split order button clicked');"
    when STOCK_TAKE_BUTTON
      @retval = "alert('stock take button clicked');"
    when DELIVERY_BUTTON
      @retval = "alert('delivery button clicked');"
    when CASH_OUT_BUTTON
      @retval = "alert('cash out button clicked');"
    when RECEIPT_SETUP_BUTTON
      @retval = "alert('receipt setup button clicked');"
    when PAYMENT_METHODS_BUTTON
      @retval = "goTo('#{admin_global_settings_path}?section=payment_methods'); return false;"
    when GIFT_VOUCHER_BUTTON
      @retval = wrap_with_menu_screen_function_check "alert('gift voucher button clicked');"
    when ORDER_TYPES_BUTTON
      @retval = "alert('order types button clicked');"
    when DISCOUNTS_SURCHARGES_BUTTON
      @retval = "goTo('#{admin_global_settings_path}?section=discounts'); return false;"
    when PRINT_RECEIPT_BUTTON
      @retval = "printCurrentReceipt();"
    when ORDER_BUTTON
      @retval = "doSyncTableOrder()"
    when SERVICE_CHARGE_BUTTON
      @retval = wrap_with_menu_screen_function_check "promptForServiceCharge()"
    when PREVIOUS_ORDERS_BUTTON
      @retval = "goTo('#{admin_orders_path}'); return false;"
    when MODIFY_ORDER_ITEM_BUTTON
      @retval = wrap_with_menu_screen_function_check "toggleModifyOrderItemScreen(); return false;"
    when MANAGE_ORDER_ITEM_ADDITION_GRIDS_BUTTON
      @retval = "goTo('#{admin_order_item_addition_grids_path}'); return false;"
    when CURRENT_ORDERS_BUTTON
      @retval = "goTo('#{admin_orders_path}?section=open_orders'); return false;"
    when MODIFY_TERMINALS_BUTTON
      @retval = "goTo('#{admin_terminals_path}'); return false;"
    when COURSE_BUTTON
      @retval = wrap_with_menu_screen_function_check "addCourseEndToOrder(); return false;";
    when PRINT_BILL_BUTTON
      @retval = "printBill();"
    when KITCHEN_SCREEN_BUTTON
      @retval = "goTo('#{kitchen_path}'); return false;"
    when PREVIOUS_CASH_TOTALS_BUTTON
      @retval = "goTo('#{admin_previous_cash_totals_path}'); return false;"
    when TOGGLE_MENU_ITEM_DOUBLE_BUTTON
      @retval = wrap_with_menu_screen_function_check "toggleMenuItemDoubleMode(); return false;"
    when ADD_NAME_TO_TABLE_BUTTON
      @retval = wrap_with_menu_screen_function_check "promptAddNameToTable(); return false;"
    when REPORTS_BUTTON
      @retval = "goTo('#{reports_glances_path}'); return false;"
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
  
  #if we switch to the menu screen, we hold off calling the function
  #so that all the widths etc have time to render on the menu screen
  def wrap_with_menu_screen_function_check the_script
    @js = "var switchHappened = checkMenuScreenForFunction();" 
    @js += "if(switchHappened) {timeout = 100;} else {timeout = 0;}"
    @js += "setTimeout(function() {#{the_script}}, timeout);"
    return @js
  end
  
end