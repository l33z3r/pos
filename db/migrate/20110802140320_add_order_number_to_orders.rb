class AddOrderNumberToOrders < ActiveRecord::Migration
  def self.up
    add_column :orders, :order_num, :integer
    execute("ALTER TABLE orders MODIFY column order_num BIGINT")
  end

  def self.down
    remove_column :orders, :order_num
  end
end
