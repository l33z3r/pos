class AddOrderNumberToOrders < ActiveRecord::Migration
  def self.up
    add_column :orders, :order_num, :integer
    
    if Rails.env.production?
      execute("ALTER TABLE orders ALTER COLUMN order_num TYPE BIGINT")
    else
      execute("ALTER TABLE orders MODIFY column order_num BIGINT")
    end
  end

  def self.down
    remove_column :orders, :order_num
  end
end
