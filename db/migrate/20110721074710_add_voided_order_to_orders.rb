class AddVoidedOrderToOrders < ActiveRecord::Migration
  def self.up
    add_column :orders, :void_order_id, :integer
    add_column :orders, :is_void, :boolean, :default => false
  end

  def self.down
    remove_column :orders, :void_order_id
    remove_column :orders, :is_void
  end
end
