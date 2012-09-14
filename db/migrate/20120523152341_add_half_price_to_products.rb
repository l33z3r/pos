class AddHalfPriceToProducts < ActiveRecord::Migration
  def self.up
    add_column :products, :half_price, :float, :default => 0.0
    add_column :order_items, :is_half, :boolean, :default => false
  end

  def self.down
    remove_column :products, :half_price
    remove_column :order_items, :is_half
  end
end