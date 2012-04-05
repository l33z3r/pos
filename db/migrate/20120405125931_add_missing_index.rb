class AddMissingIndex < ActiveRecord::Migration
  def self.up
    add_index :display_button_roles, :role_id
    add_index :display_button_roles, :display_button_id
    add_index :menu_items, :menu_page_id
    add_index :menu_items, :product_id
    add_index :menu_items, [:product_id, :menu_page_id]
    add_index :menu_items, [:menu_page_id, :product_id]
    add_index :products, :category_id
    add_index :products, :tax_rate_id
    add_index :products, :order_item_addition_grid_id
    add_index :products, :modifier_category_id
    add_index :products, :menu_page_1_id
    add_index :products, :menu_page_2_id
    add_index :employees, :role_id
    add_index :client_transactions, :order_id
    add_index :table_infos, :room_object_id
    add_index :terminal_display_links, :display_id
    add_index :orders, :employee_id
    add_index :orders, :table_info_id
    add_index :orders, :void_order_id
    add_index :room_objects, :room_id
    add_index :categories, :tax_rate_id
    add_index :categories, :order_item_addition_grid_id
    add_index :categories, :parent_category_id
    add_index :menu_pages, :display_id
    add_index :menu_pages, :embedded_display_id
    add_index :order_item_additions, :order_item_addition_grid_id
    add_index :order_item_additions, :follow_on_grid_id
    add_index :order_item_additions, :product_id
    add_index :payment_methods, :receipt_footer_id
    add_index :modifiers, :modifier_category_id
    add_index :display_buttons, :display_button_group_id
    add_index :order_items, :order_id
    add_index :order_items, :employee_id
    add_index :order_items, :product_id
    add_index :ingredients, :product_id
    add_index :ingredients, :ingredient_product_id
    add_index :cash_totals, :start_calc_order_id
    add_index :cash_totals, :end_calc_order_id
    add_index :cash_totals, :employee_id
    add_index :stock_transactions, :product_id
    add_index :stock_transactions, :employee_id
  end

  def self.down
    remove_index :display_button_roles, :role_id
    remove_index :display_button_roles, :display_button_id
    remove_index :menu_items, :menu_page_id
    remove_index :menu_items, :product_id
    remove_index :menu_items, :column => [:product_id, :menu_page_id]
    remove_index :menu_items, :column => [:menu_page_id, :product_id]
    remove_index :products, :category_id
    remove_index :products, :tax_rate_id
    remove_index :products, :order_item_addition_grid_id
    remove_index :products, :modifier_category_id
    remove_index :products, :menu_page_1_id
    remove_index :products, :menu_page_2_id
    remove_index :employees, :role_id
    remove_index :client_transactions, :order_id
    remove_index :table_infos, :room_object_id
    remove_index :terminal_display_links, :display_id
    remove_index :orders, :employee_id
    remove_index :orders, :table_info_id
    remove_index :orders, :void_order_id
    remove_index :room_objects, :room_id
    remove_index :categories, :tax_rate_id
    remove_index :categories, :order_item_addition_grid_id
    remove_index :categories, :parent_category_id
    remove_index :menu_pages, :display_id
    remove_index :menu_pages, :embedded_display_id
    remove_index :order_item_additions, :order_item_addition_grid_id
    remove_index :order_item_additions, :follow_on_grid_id
    remove_index :order_item_additions, :product_id
    remove_index :payment_methods, :receipt_footer_id
    remove_index :modifiers, :modifier_category_id
    remove_index :display_buttons, :display_button_group_id
    remove_index :order_items, :order_id
    remove_index :order_items, :employee_id
    remove_index :order_items, :product_id
    remove_index :ingredients, :product_id
    remove_index :ingredients, :ingredient_product_id
    remove_index :cash_totals, :start_calc_order_id
    remove_index :cash_totals, :end_calc_order_id
    remove_index :cash_totals, :employee_id
    remove_index :stock_transactions, :product_id
    remove_index :stock_transactions, :employee_id
  end
end