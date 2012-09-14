class AddIsStockItemToProducts < ActiveRecord::Migration
  def self.up
    add_column :products, :is_stock_item, :boolean, :default => true
  end

  def self.down
    remove_column :products, :is_stock_item
  end
end
