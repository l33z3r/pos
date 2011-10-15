class CreateStockTransactions < ActiveRecord::Migration
  def self.up
    create_table :stock_transactions do |t|
      t.integer :product_id
      t.integer :employee_id
      t.float :old_amount
      t.float :change_amount
      t.integer :transaction_type
      t.string :note
      t.timestamps
    end
    
    change_column :products, :quantity_in_stock, :float, :default => 0
  end

  def self.down
    drop_table :stock_transactions
  end
end
