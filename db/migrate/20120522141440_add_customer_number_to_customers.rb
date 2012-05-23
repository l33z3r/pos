class AddCustomerNumberToCustomers < ActiveRecord::Migration
  def self.up
    add_column :customers, :customer_number, :integer
    
    execute("update customers set customer_number = substring(swipe_card_code, 6, 7)")
  end

  def self.down
    remove_column :customers, :customer_number
  end
end
