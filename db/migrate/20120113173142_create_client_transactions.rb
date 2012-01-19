class CreateClientTransactions < ActiveRecord::Migration
  def self.up
    create_table :client_transactions do |t|
      t.integer :order_id
      t.integer :payment_integration_type_id
      t.string :client_name
      t.text :transaction_data
      t.timestamps
    end
    
    if Rails.env.production_heroku?
      execute("ALTER TABLE client_transactions ALTER COLUMN transaction_data TYPE TEXT")
    else
      change_column :client_transactions, :transaction_data, :longtext
    end
  end

  def self.down
    drop_table :client_transactions
  end
end
