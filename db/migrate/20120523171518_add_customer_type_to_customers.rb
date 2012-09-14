class AddCustomerTypeToCustomers < ActiveRecord::Migration
  def self.up
    add_column :customers, :customer_type, :string
    
    execute("update customers set customer_type = 'both'")
  end

  def self.down
    remove_column :customers, :customer_type
  end
end
