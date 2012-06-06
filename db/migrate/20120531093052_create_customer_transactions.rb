class CreateCustomerTransactions < ActiveRecord::Migration
  def self.up
    create_table :customer_transactions do |t|
      t.integer :customer_id
      
      t.string :transaction_type
      
      t.integer :order_id
      t.boolean :is_credit, :default => true, :null => false
      t.float :abs_amount, :default => 0, :null => false
      t.float :actual_amount, :default => 0, :null => false
      
      t.integer :payment_id
      
      t.timestamps
    end
  end

  def self.down
    drop_table :customer_transactions
  end
end
