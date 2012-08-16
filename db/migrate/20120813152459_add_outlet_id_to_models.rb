class AddOutletIdToModels < ActiveRecord::Migration
  def self.up
    add_column :products, :outlet_id, :integer
    add_index :products, :outlet_id
    add_column :displays, :outlet_id, :integer
    add_index :displays, :outlet_id
    add_column :menu_pages, :outlet_id, :integer
    add_index :menu_pages, :outlet_id
    add_column :menu_items, :outlet_id, :integer
    add_index :menu_items, :outlet_id
    add_column :global_settings, :outlet_id, :integer
    add_index :global_settings, :outlet_id
    add_column :card_transactions, :outlet_id, :integer
    add_index :card_transactions, :outlet_id
    add_column :cash_outs, :outlet_id, :integer
    add_index :cash_outs, :outlet_id
    add_column :cash_out_presets, :outlet_id, :integer
    add_index :cash_out_presets, :outlet_id
    add_column :cash_totals, :outlet_id, :integer
    add_index :cash_totals, :outlet_id
    add_column :categories, :outlet_id, :integer
    add_index :categories, :outlet_id
    add_column :client_transactions, :outlet_id, :integer
    add_index :client_transactions, :outlet_id
    add_column :customers, :outlet_id, :integer
    add_index :customers, :outlet_id
    add_column :customer_points_allocations, :outlet_id, :integer
    add_index :customer_points_allocations, :outlet_id
    add_column :customer_transactions, :outlet_id, :integer
    add_index :customer_transactions, :outlet_id
    add_column :deliveries, :outlet_id, :integer
    add_index :deliveries, :outlet_id
    add_column :discounts, :outlet_id, :integer
    add_index :discounts, :outlet_id
    add_column :display_buttons, :outlet_id, :integer
    add_index :display_buttons, :outlet_id
    add_column :display_button_groups, :outlet_id, :integer
    add_index :display_button_groups, :outlet_id
    add_column :display_button_roles, :outlet_id, :integer
    add_index :display_button_roles, :outlet_id
    add_column :employees, :outlet_id, :integer
    add_index :employees, :outlet_id
    add_column :ingredients, :outlet_id, :integer
    add_index :ingredients, :outlet_id
    add_column :loyalty_levels, :outlet_id, :integer
    add_index :loyalty_levels, :outlet_id
    add_column :modifiers, :outlet_id, :integer
    add_index :modifiers, :outlet_id
    add_column :modifier_categories, :outlet_id, :integer
    add_index :modifier_categories, :outlet_id
    add_column :orders, :outlet_id, :integer
    add_index :orders, :outlet_id
    add_column :order_items, :outlet_id, :integer
    add_index :order_items, :outlet_id
    add_column :order_item_additions, :outlet_id, :integer
    add_index :order_item_additions, :outlet_id
    add_column :order_item_addition_grids, :outlet_id, :integer
    add_index :order_item_addition_grids, :outlet_id
    add_column :payments, :outlet_id, :integer
    add_index :payments, :outlet_id
    add_column :payment_methods, :outlet_id, :integer
    add_index :payment_methods, :outlet_id
    add_column :receipt_footers, :outlet_id, :integer
    add_index :receipt_footers, :outlet_id
    add_column :roles, :outlet_id, :integer
    add_index :roles, :outlet_id
    add_column :rooms, :outlet_id, :integer
    add_index :rooms, :outlet_id
    add_column :room_objects, :outlet_id, :integer
    add_index :room_objects, :outlet_id
    add_column :shift_timestamps, :outlet_id, :integer
    add_index :shift_timestamps, :outlet_id
    add_column :stock_transactions, :outlet_id, :integer
    add_index :stock_transactions, :outlet_id
    add_column :stored_receipt_htmls, :outlet_id, :integer
    add_index :stored_receipt_htmls, :outlet_id
    add_column :table_infos, :outlet_id, :integer
    add_index :table_infos, :outlet_id
    add_column :tax_rates, :outlet_id, :integer
    add_index :tax_rates, :outlet_id
    add_column :terminal_display_links, :outlet_id, :integer
    add_index :terminal_display_links, :outlet_id
    add_column :terminal_sync_data, :outlet_id, :integer
    add_index :terminal_sync_data, :outlet_id
    add_column :work_reports, :outlet_id, :integer
    add_index :work_reports, :outlet_id
  end

  def self.down
    remove_column :products, :outlet_id
    remove_column :displays, :outlet_id
    remove_column :menu_pages, :outlet_id
    remove_column :menu_items, :outlet_id
    remove_column :global_settings, :outlet_id
    remove_column :card_transactions, :outlet_id
    remove_column :cash_outs, :outlet_id
    remove_column :cash_out_presets, :outlet_id
    remove_column :cash_totals, :outlet_id
    remove_column :categories, :outlet_id
    remove_column :client_transactions, :outlet_id
    remove_column :customers, :outlet_id
    remove_column :customer_points_allocations, :outlet_id
    remove_column :customer_transactions, :outlet_id
    remove_column :deliveries, :outlet_id
    remove_column :discounts, :outlet_id
    remove_column :display_buttons, :outlet_id
    remove_column :display_button_groups, :outlet_id
    remove_column :display_button_roles, :outlet_id
    remove_column :employees, :outlet_id
    remove_column :ingredients, :outlet_id
    remove_column :loyalty_levels, :outlet_id
    remove_column :modifiers, :outlet_id
    remove_column :modifier_categories, :outlet_id
    remove_column :orders, :outlet_id
    remove_column :order_items, :outlet_id
    remove_column :order_item_additions, :outlet_id
    remove_column :order_item_addition_grids, :outlet_id
    remove_column :payments, :outlet_id
    remove_column :payment_methods, :outlet_id
    remove_column :receipt_footers, :outlet_id
    remove_column :roles, :outlet_id
    remove_column :rooms, :outlet_id
    remove_column :room_objects, :outlet_id
    remove_column :shift_timestamps, :outlet_id
    remove_column :stock_transactions, :outlet_id
    remove_column :stored_receipt_htmls, :outlet_id
    remove_column :table_infos, :outlet_id
    remove_column :tax_rates, :outlet_id
    remove_column :terminal_display_links, :outlet_id
    remove_column :terminal_sync_data, :outlet_id
    remove_column :work_reports, :outlet_id    
  end
end
