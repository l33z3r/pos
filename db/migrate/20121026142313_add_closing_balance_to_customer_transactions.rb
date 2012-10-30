class AddClosingBalanceToCustomerTransactions < ActiveRecord::Migration
  def self.up
    add_column :customer_transactions, :closing_balance, :float, :default => 0, :null => false
    
    execute("update customer_transactions set actual_amount = (-1 * actual_amount)")
  end

  def self.down
    remove_column :customer_transactions, :closing_balance
    
    execute("update customer_transactions set actual_amount = (-1 * actual_amount)")
  end
end
