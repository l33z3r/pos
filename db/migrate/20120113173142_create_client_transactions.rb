class CreateClientTransactions < ActiveRecord::Migration
  def self.up
    create_table :client_transactions do |t|
      t.integer :order_id
      t.integer :payment_integration_type_id
      t.string :client_name
      t.text :transaction_data
      t.timestamps
    end
    
    change_column :client_transactions, :transaction_data, :longtext
  end

  def self.down
    drop_table :client_transactions
  end
end
