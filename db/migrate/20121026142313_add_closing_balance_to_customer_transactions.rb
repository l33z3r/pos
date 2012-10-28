class AddClosingBalanceToCustomerTransactions < ActiveRecord::Migration
  def self.up
    add_column :customer_transactions, :closing_balance, :float, :default => 0, :null => false
  end

  def self.down
    remove_column :customer_transactions, :closing_balance
  end
end
