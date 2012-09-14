class CreateCustomerPointsAllocations < ActiveRecord::Migration
  def self.up
    create_table :customer_points_allocations do |t|
      t.integer :customer_id
      t.integer :order_id
      
      t.integer :amount
      t.float :loyalty_level_percent
      
      t.timestamps
    end
  end

  def self.down
    drop_table :customer_points_allocations
  end
end
