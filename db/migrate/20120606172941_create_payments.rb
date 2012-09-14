class CreatePayments < ActiveRecord::Migration
  def self.up
    create_table :payments do |t|
      t.string :transaction_type
      t.integer :employee_id
      t.integer :card_transaction_id
      t.float :amount, :default => 0, :null => false
      t.float :amount_tendered, :default => 0, :null => false
      t.string :payment_method
      t.timestamps
    end
    
    remove_column :customer_transactions, :amount_tendered
    remove_column :customer_transactions, :payment_method
    
    add_column :customer_transactions, :payment_id, :integer
  end

  def self.down
    drop_table :payments
  end
end
