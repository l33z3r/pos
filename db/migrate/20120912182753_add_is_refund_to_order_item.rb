class AddIsRefundToOrderItem < ActiveRecord::Migration
  def self.up
    add_column :order_items, :is_refund, :boolean, :default => false
    
    execute("update order_items set is_refund = false where is_refund is null")
  end

  def self.down
    remove_column :order_items, :is_refund
  end
end
