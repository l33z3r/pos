class AddRefundOrderIdToCustomerTransaction < ActiveRecord::Migration
  def self.up
    add_column :customer_transactions, :refund_order_id, :integer
  end

  def self.down
    remove_column :customer_transactions, :refund_order_id
  end
end
