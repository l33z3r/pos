class CreatePayments < ActiveRecord::Migration
  def self.up
    create_table :payments do |t|
      t.string :transaction_type
      t.integer :employee_id
      t.float :amount, :default => 0, :null => false
      t.float :amount_tendered, :default => 0, :null => false
      t.string :payment_method
      t.timestamps
    end
  end

  def self.down
    drop_table :payments
  end
end
