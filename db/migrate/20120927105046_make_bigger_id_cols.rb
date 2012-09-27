class MakeBiggerIdCols < ActiveRecord::Migration
  def self.up
    execute("ALTER TABLE products MODIFY column id BIGINT")
    execute("ALTER TABLE products MODIFY column category_id BIGINT")
    execute("ALTER TABLE products MODIFY column modifier_category_id BIGINT")
    execute("ALTER TABLE products MODIFY column tax_rate_id BIGINT")
    execute("ALTER TABLE products MODIFY column parent_product_id BIGINT")
    
    execute("ALTER TABLE outlets MODIFY column id BIGINT")
    execute("ALTER TABLE outlets MODIFY column cluey_account_id BIGINT")
    
    execute("ALTER TABLE cluey_accounts MODIFY column id BIGINT")
    
    execute("ALTER TABLE displays MODIFY column id BIGINT")
    execute("ALTER TABLE displays MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE menu_pages MODIFY column id BIGINT")
    execute("ALTER TABLE menu_pages MODIFY column display_id BIGINT")
    execute("ALTER TABLE menu_pages MODIFY column embedded_display_id BIGINT")
    execute("ALTER TABLE menu_pages MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE menu_items MODIFY column id BIGINT")
    execute("ALTER TABLE menu_items MODIFY column menu_page_id BIGINT")
    execute("ALTER TABLE menu_items MODIFY column product_id BIGINT")
    execute("ALTER TABLE menu_items MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE global_settings MODIFY column id BIGINT")
    execute("ALTER TABLE global_settings MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE card_transactions MODIFY column id BIGINT")
    execute("ALTER TABLE card_transactions MODIFY column order_id BIGINT")
    execute("ALTER TABLE card_transactions MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE cash_outs MODIFY column id BIGINT")
    execute("ALTER TABLE cash_outs MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE cash_out_presets MODIFY column id BIGINT")
    execute("ALTER TABLE cash_out_presets MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE cash_totals MODIFY column id BIGINT")
    execute("ALTER TABLE cash_totals MODIFY column start_calc_order_id BIGINT")
    execute("ALTER TABLE cash_totals MODIFY column end_calc_order_id BIGINT")
    execute("ALTER TABLE cash_totals MODIFY column employee_id BIGINT")
    execute("ALTER TABLE cash_totals MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE categories MODIFY column id BIGINT")
    execute("ALTER TABLE categories MODIFY column parent_category_id BIGINT")
    execute("ALTER TABLE categories MODIFY column tax_rate_id BIGINT")
    execute("ALTER TABLE categories MODIFY column order_item_addition_grid_id BIGINT")
    execute("ALTER TABLE categories MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE client_transactions MODIFY column id BIGINT")
    execute("ALTER TABLE client_transactions MODIFY column order_id BIGINT")
    execute("ALTER TABLE client_transactions MODIFY column payment_integration_type_id BIGINT")
    execute("ALTER TABLE client_transactions MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE customers MODIFY column id BIGINT")
    execute("ALTER TABLE customers MODIFY column loyalty_level_id BIGINT")
    execute("ALTER TABLE customers MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE customer_points_allocations MODIFY column id BIGINT")
    execute("ALTER TABLE customer_points_allocations MODIFY column customer_id BIGINT")
    execute("ALTER TABLE customer_points_allocations MODIFY column order_id BIGINT")
    execute("ALTER TABLE customer_points_allocations MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE customer_transactions MODIFY column id BIGINT")
    execute("ALTER TABLE customer_transactions MODIFY column customer_id BIGINT")
    execute("ALTER TABLE customer_transactions MODIFY column order_id BIGINT")
    execute("ALTER TABLE customer_transactions MODIFY column payment_id BIGINT")
    execute("ALTER TABLE customer_transactions MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE deliveries MODIFY column id BIGINT")
    execute("ALTER TABLE deliveries MODIFY column employee_id BIGINT")
    execute("ALTER TABLE deliveries MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE discounts MODIFY column id BIGINT")
    execute("ALTER TABLE discounts MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE display_buttons MODIFY column id BIGINT")
    execute("ALTER TABLE display_buttons MODIFY column display_button_group_id BIGINT")
    execute("ALTER TABLE display_buttons MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE display_button_groups MODIFY column id BIGINT")
    execute("ALTER TABLE display_button_groups MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE employees MODIFY column id BIGINT")
    execute("ALTER TABLE employees MODIFY column role_id BIGINT")
    execute("ALTER TABLE employees MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE ingredients MODIFY column id BIGINT")
    execute("ALTER TABLE ingredients MODIFY column product_id BIGINT")
    execute("ALTER TABLE ingredients MODIFY column ingredient_product_id BIGINT")
    execute("ALTER TABLE ingredients MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE loyalty_levels MODIFY column id BIGINT")
    execute("ALTER TABLE loyalty_levels MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE modifiers MODIFY column id BIGINT")
    execute("ALTER TABLE modifiers MODIFY column modifier_category_id BIGINT")
    execute("ALTER TABLE modifiers MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE orders MODIFY column id BIGINT")
    execute("ALTER TABLE orders MODIFY column employee_id BIGINT")
    execute("ALTER TABLE orders MODIFY column table_info_id BIGINT")
    execute("ALTER TABLE orders MODIFY column void_order_id BIGINT")
    execute("ALTER TABLE orders MODIFY column room_id BIGINT")
    execute("ALTER TABLE orders MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE order_items MODIFY column id BIGINT")
    execute("ALTER TABLE order_items MODIFY column order_id BIGINT")
    execute("ALTER TABLE order_items MODIFY column employee_id BIGINT")
    execute("ALTER TABLE order_items MODIFY column product_id BIGINT")
    execute("ALTER TABLE order_items MODIFY column void_employee_id BIGINT")
    execute("ALTER TABLE order_items MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE order_item_addition_grids MODIFY column id BIGINT")
    execute("ALTER TABLE order_item_addition_grids MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE order_item_additions MODIFY column id BIGINT")
    execute("ALTER TABLE order_item_additions MODIFY column order_item_addition_grid_id BIGINT")
    execute("ALTER TABLE order_item_additions MODIFY column follow_on_grid_id BIGINT")
    execute("ALTER TABLE order_item_additions MODIFY column product_id BIGINT")
    execute("ALTER TABLE order_item_additions MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE payments MODIFY column id BIGINT")
    execute("ALTER TABLE payments MODIFY column employee_id BIGINT")
    execute("ALTER TABLE payments MODIFY column card_transaction_id BIGINT")
    execute("ALTER TABLE payments MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE payment_methods MODIFY column id BIGINT")
    execute("ALTER TABLE payment_methods MODIFY column payment_integration_id BIGINT")
    execute("ALTER TABLE payment_methods MODIFY column receipt_footer_id BIGINT")
    execute("ALTER TABLE payment_methods MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE receipt_footers MODIFY column id BIGINT")
    execute("ALTER TABLE receipt_footers MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE roles MODIFY column id BIGINT")
    execute("ALTER TABLE roles MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE rooms MODIFY column id BIGINT")
    execute("ALTER TABLE rooms MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE room_objects MODIFY column id BIGINT")
    execute("ALTER TABLE room_objects MODIFY column room_id BIGINT")
    execute("ALTER TABLE room_objects MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE shift_timestamps MODIFY column id BIGINT")
    execute("ALTER TABLE shift_timestamps MODIFY column employee_id BIGINT")
    execute("ALTER TABLE shift_timestamps MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE stock_transactions MODIFY column id BIGINT")
    execute("ALTER TABLE stock_transactions MODIFY column employee_id BIGINT")
    execute("ALTER TABLE stock_transactions MODIFY column product_id BIGINT")
    execute("ALTER TABLE stock_transactions MODIFY column delivery_id BIGINT")
    execute("ALTER TABLE stock_transactions MODIFY column order_item_id BIGINT")
    execute("ALTER TABLE stock_transactions MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE stored_receipt_htmls MODIFY column id BIGINT")
    execute("ALTER TABLE stored_receipt_htmls MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE table_infos MODIFY column id BIGINT")
    execute("ALTER TABLE table_infos MODIFY column room_object_id BIGINT")
    execute("ALTER TABLE table_infos MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE tax_rates MODIFY column id BIGINT")
    execute("ALTER TABLE tax_rates MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE terminal_display_links MODIFY column id BIGINT")
    execute("ALTER TABLE terminal_display_links MODIFY column display_id BIGINT")
    execute("ALTER TABLE terminal_display_links MODIFY column outlet_id BIGINT")
    
    execute("ALTER TABLE terminal_sync_data MODIFY column id BIGINT")
    execute("ALTER TABLE terminal_sync_data MODIFY column outlet_id BIGINT")

    execute("ALTER TABLE work_reports MODIFY column id BIGINT")
    execute("ALTER TABLE work_reports MODIFY column employee_id BIGINT")
    execute("ALTER TABLE work_reports MODIFY column outlet_id BIGINT")
  end

  def self.down
    #doesn't matter
  end
end
