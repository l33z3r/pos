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
    
  def action_for_button button

    @retval = ""

    case button.perm_id
    when X_TOTAL_BUTTON
      @retval = "doXTotal();"
    when Z_TOTAL_BUTTON
      @retval = "doZTotal();"
    when X_REPORTS_BUTTON
      @retval = "alert('x reports clicked')"
    when Z_REPORTS_BUTTON
      @retval = "alert('z reports clicked')"
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
      @retval = "doTotalFinal();"
    when SUBTOTAL_BUTTON
      @retval = "doTotal();"
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
      @retval = "alert('discount clicked');"
    end

    @retval
  end
  
  def wrap_with_menu_screen_function_check the_script
    return "if(checkMenuScreenForFunction()){#{the_script}}"
  end
  
end