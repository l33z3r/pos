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
  TOGGLE_MENU_ITEM_STANDARD_PRICE_OVERRIDE_BUTTON = 35
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
  SPLIT_BILL_BUTTON = 59
  EXIT_APP_BUTTON = 60
  VOID_ORDER_ITEM_BUTTON = 61
  VOID_ALL_ORDER_ITEMS_BUTTON = 62
  
  RESTRICTED_BUTTON_IDS = [
    ORDER_TYPES_BUTTON, GIFT_VOUCHER_BUTTON, RECEIPT_SETUP_BUTTON, SERVICE_CHARGE_BUTTON,
    CASH_OUT_BUTTON, DELIVERY_BUTTON, STOCK_TAKE_BUTTON,
    PRINTERS_BUTTON, CHANGE_WAITER_BUTTON, REFUND_BUTTON, WASTE_BUTTON, CLIENT_BUTTON, THEMES_BUTTON
  ]
  
  def action_for_button button

    @retval = ""

    case button.perm_id
    when X_TOTAL_BUTTON
      @retval = si_check(X_TOTAL_BUTTON, ms_check("prepareXTotal();"))
    when Z_TOTAL_BUTTON
      @retval = si_check(Z_TOTAL_BUTTON, ms_check("prepareZTotal();"))
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
      @retval = "goTo('#{admin_modifier_categories_path}'); return false;"
    when ROOM_BUILDER_BUTTON
      @retval = "goTo('#{admin_rooms_path}'); return false;"
    when TOTAL_BUTTON
      @retval = si_check(TOTAL_BUTTON, "quickSale();")
    when SUBTOTAL_BUTTON
      @retval = si_check(SUBTOTAL_BUTTON, "totalPressed();")
    when SAVE_BUTTON
      @retval = si_check(SAVE_BUTTON, "saveButton();")
    when MORE_OPTIONS_BUTTON
      @retval = si_check(MORE_OPTIONS_BUTTON, "showMoreOptionsScreen();")
    when BUTTON_CONFIG_BUTTON
      @retval = "goTo('#{edit_multiple_admin_display_buttons_path}'); return false;"
    when TABLES_BUTTON
      @retval = si_check(TABLES_BUTTON, "tablesButtonPressed();")
    when SYSTEM_BUTTON
      @retval = si_check(SYSTEM_BUTTON, "showGlobalSettingsPage();")
    when THEMES_BUTTON
      @retval = "goTo('#{admin_custom_themes_path}'); return false;"
    when DISCOUNT_BUTTON
      @retval = si_check(DISCOUNT_BUTTON, ms_check("showDiscountPopup(null);"))
    when CLIENT_BUTTON
      @retval = ms_check "alert('client button clicked');"
    when WASTE_BUTTON
      @retval = ms_check "alert('waste button clicked');"
    when COMPLIMENTARY_BUTTON
      @retval = si_check(COMPLIMENTARY_BUTTON, ms_check("markFreeLastOrderItem();"))
    when CHANGE_PRICE_BUTTON
      @retval = si_check(CHANGE_PRICE_BUTTON, ms_check("changePriceLastOrderItem();"))
    when FLOAT_BUTTON
      @retval = si_check(FLOAT_BUTTON, "initFloatScreen();")
    when NO_SALE_BUTTON
      @retval = si_check(NO_SALE_BUTTON, ms_check("openCashDrawer();"))
    when REFUND_BUTTON
      @retval = "alert('refund button clicked');"
    when REMOVE_ITEM_BUTTON
      @retval = si_check(REMOVE_ITEM_BUTTON, ms_check("removeLastOrderItem();"))
    when ADD_NOTE_BUTTON
      @retval = si_check(ADD_NOTE_BUTTON, ms_check("showAddNoteToOrderItemScreen();"))
    when CHANGE_WAITER_BUTTON
      @retval = "alert('change waiter button clicked');"
    when PRINTERS_BUTTON
      @retval = "alert('printers button clicked');"
    when TRANSFER_ORDER_BUTTON
      @retval = si_check(TRANSFER_ORDER_BUTTON, ms_check("startTransferOrderMode();"))
    when TOGGLE_MENU_ITEM_STANDARD_PRICE_OVERRIDE_BUTTON
      @retval = si_check(TOGGLE_MENU_ITEM_STANDARD_PRICE_OVERRIDE_BUTTON, ms_check("toggleMenuItemStandardPriceOverrideMode();"))
    when STOCK_TAKE_BUTTON
      @retval = "alert('stock take button clicked');"
    when DELIVERY_BUTTON
      @retval = "alert('delivery button clicked');"
    when CASH_OUT_BUTTON
      @retval = "alert('cash out button clicked');"
    when RECEIPT_SETUP_BUTTON
      @retval = "alert('receipt setup button clicked');"
    when PAYMENT_METHODS_BUTTON
      @retval = "goTo('#{admin_global_settings_path}?section=payment_methods');"
    when GIFT_VOUCHER_BUTTON
      @retval = ms_check "alert('gift voucher button clicked');"
    when ORDER_TYPES_BUTTON
      @retval = "alert('order types button clicked');"
    when DISCOUNTS_SURCHARGES_BUTTON
      @retval = "goTo('#{admin_global_settings_path}?section=discounts');"
    when PRINT_RECEIPT_BUTTON
      @retval = si_check(PRINT_RECEIPT_BUTTON, "printCurrentReceipt();");
    when ORDER_BUTTON
      @retval = si_check(ORDER_BUTTON, "doSyncTableOrder();");
    when SERVICE_CHARGE_BUTTON
      @retval = si_check(SERVICE_CHARGE_BUTTON, ms_check("promptForServiceCharge();"))
    when PREVIOUS_ORDERS_BUTTON
      @retval = "goTo('#{admin_orders_path}'); return false;"
    when MODIFY_ORDER_ITEM_BUTTON
      @retval = si_check(MODIFY_ORDER_ITEM_BUTTON, ms_check("toggleModifyOrderItemScreen();"))
    when MANAGE_ORDER_ITEM_ADDITION_GRIDS_BUTTON
      @retval = "goTo('#{admin_order_item_addition_grids_path}');"
    when CURRENT_ORDERS_BUTTON
      @retval = "goTo('#{admin_orders_path}?section=open_orders');"
    when MODIFY_TERMINALS_BUTTON
      @retval = "goTo('#{admin_terminals_path}');"
    when COURSE_BUTTON
      @retval = si_check(COURSE_BUTTON, ms_check("changeCourseNum();"))
    when PRINT_BILL_BUTTON
      @retval = si_check(PRINT_BILL_BUTTON, "printBill();")
    when KITCHEN_SCREEN_BUTTON
      @retval = "goTo('#{kitchen_path}');"
    when PREVIOUS_CASH_TOTALS_BUTTON
      @retval = "goTo('#{admin_previous_cash_totals_path}');"
    when TOGGLE_MENU_ITEM_DOUBLE_BUTTON
      @retval = si_check(TOGGLE_MENU_ITEM_DOUBLE_BUTTON, ms_check("toggleMenuItemDoubleMode();"))
    when ADD_NAME_TO_TABLE_BUTTON
      @retval = si_check(ADD_NAME_TO_TABLE_BUTTON, ms_check("promptAddNameToTable();"))
    when REPORTS_BUTTON
      @retval = "goTo('#{reports_glances_path}');"
    when SPLIT_BILL_BUTTON
      @retval = si_check(SPLIT_BILL_BUTTON, ms_check("startSplitBillMode();"))
    when EXIT_APP_BUTTON
      @retval = si_check(EXIT_APP_BUTTON, "exitApp();")
    when VOID_ORDER_ITEM_BUTTON
      @retval = si_check(VOID_ORDER_ITEM_BUTTON, ms_check("voidOrderItem();"))
    when VOID_ALL_ORDER_ITEMS_BUTTON
      @retval = si_check(VOID_ALL_ORDER_ITEMS_BUTTON, ms_check("promptVoidAllOrderItems();"))
    end

    @retval
  end
  
  def icon_path_for button
    ButtonMapper.constants.each do |constant_name|
      if button.perm_id.to_s == eval(constant_name.to_s).to_s
        return "#{constant_name.to_s.downcase}.png"
      end
    end
    
    return ""
  end
  
  #CHECK ARE WE ON MENU SCREEN
  #if we switch to the menu screen, we hold off calling the function
  #so that all the widths etc have time to render on the menu screen
  def ms_check the_script
    @js = "var switchHappened = checkMenuScreenForFunction();" 
    @js += "if(switchHappened) {timeout = 100;} else {timeout = 0;}"
    @js += "setTimeout(function() {#{the_script}}, timeout);"
    return @js
  end
  
  #CHECK ARE WE IN SALES INTERFACE
  #some buttons will not work on the admin functions shortcut screen, 
  #so we perform a check and then forward the call to after we load the sales interface
  def si_check button_id, the_script
    return "checkSalesInterfaceForFunction(#{button_id}, function() {#{the_script}});"
  end
  
end