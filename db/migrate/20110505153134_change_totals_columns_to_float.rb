class ChangeTotalsColumnsToFloat < ActiveRecord::Migration
  def self.up
    change_column :orders, :total, :float
    change_column :order_items, :total_price, :float
  end

  def self.down
  end
end
