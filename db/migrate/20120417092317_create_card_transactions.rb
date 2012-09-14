class CreateCardTransactions < ActiveRecord::Migration
  def self.up
    create_table :card_transactions do |t|
      t.integer :order_id
      t.string :payment_method
      t.float :amount
      t.timestamps
    end
  end

  def self.down
    drop_table :card_transactions
  end
end
