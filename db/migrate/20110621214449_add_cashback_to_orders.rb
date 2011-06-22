class AddCashbackToOrders < ActiveRecord::Migration
  def self.up
    add_column :orders, :cashback, :float
  end

  def self.down
    remove_column :orders, :cashback
  end
end
