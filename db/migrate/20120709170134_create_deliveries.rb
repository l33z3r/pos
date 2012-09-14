class CreateDeliveries < ActiveRecord::Migration
  def self.up
    create_table :deliveries do |t|
      t.integer :employee_id
      t.float :total
      t.timestamps
    end

    add_column :stock_transactions, :delivery_id, :integer
    add_column :stock_transactions, :is_return, :boolean, :default => false
  end

  def self.down
    remove_column :stock_transactions, :is_return
    remove_column :stock_transactions, :delivery_id

    drop_table :deliveries
  end
end
