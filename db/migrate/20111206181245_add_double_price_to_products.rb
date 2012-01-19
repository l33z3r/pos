class AddDoublePriceToProducts < ActiveRecord::Migration
  def self.up
    add_column :products, :double_price, :float, :default => 0.0
    add_column :order_items, :is_double, :boolean, :default => false
  end

  def self.down
    remove_column :products, :double_price
    remove_column :order_items, :is_double
  end
end
