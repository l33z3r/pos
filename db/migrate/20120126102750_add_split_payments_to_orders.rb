class AddSplitPaymentsToOrders < ActiveRecord::Migration
  def self.up
    add_column :orders, :split_payments, :longtext
  end

  def self.down
    remove_column :orders, :split_payments
  end
end
