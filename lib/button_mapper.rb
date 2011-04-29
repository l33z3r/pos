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

  def action_for_button button

    @retval = ""

    case button.perm_id
    when X_TOTAL_BUTTON
      @retval = "alert('x total clicked')"
    when Z_TOTAL_BUTTON
      @retval = "alert('z ddtotal clicked')"
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
    end

    @retval
  end
end