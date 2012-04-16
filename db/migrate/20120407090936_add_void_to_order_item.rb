class AddVoidToOrderItem < ActiveRecord::Migration
  def self.up
    add_column :order_items, :is_void, :boolean, :default => false
  end

  def self.down
    remove_column :order_items, :is_void
  end
end
