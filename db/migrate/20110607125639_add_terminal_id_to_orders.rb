class AddTerminalIdToOrders < ActiveRecord::Migration
  def self.up
    add_column :orders, :terminal_id, :string
    add_column :order_items, :terminal_id, :string
    add_column :order_items, :time_added, :string
  end

  def self.down
    remove_column :orders, :terminal_id
    remove_column :order_items, :terminal_id
    remove_column :order_items, :time_added
  end
end
