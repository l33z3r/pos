class CreateOrders < ActiveRecord::Migration
  def self.up
    create_table :orders do |t|
      t.integer :employee_id
      t.integer :total
      t.string :payment_type
      t.integer :amount_tendered
      t.boolean :is_table_order, :default => false
      t.integer :num_persons
      t.timestamps
    end
  end

  def self.down
    drop_table :orders
  end
end
