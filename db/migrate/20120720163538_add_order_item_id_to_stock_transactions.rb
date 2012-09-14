class AddOrderItemIdToStockTransactions < ActiveRecord::Migration
  def self.up
    add_column :stock_transactions, :order_item_id, :integer
  end

  def self.down
    remove_column :stock_transactions, :order_item_id
  end
end
