class ChangeQuantityToFloatInOrderItems < ActiveRecord::Migration
  def self.up
    change_column :order_items, :quantity, :float
  end

  def self.down
    change_column :order_items, :quantity, :integer
  end
end
