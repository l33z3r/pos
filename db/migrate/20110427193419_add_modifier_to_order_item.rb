class AddModifierToOrderItem < ActiveRecord::Migration
  def self.up
    add_column :order_items, :modifier_name, :string
    add_column :order_items, :modifier_price, :integer
  end

  def self.down
    remove_column :order_items, :modifier_name
    remove_column :order_items, :modifier_price
  end
end
