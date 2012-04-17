class AddClientNameToOrders < ActiveRecord::Migration
  def self.up
    add_column :orders, :client_name, :string, :default => "", :null => false
    execute("update orders set client_name = '' where client_name is null")
  end

  def self.down
    remove_column :orders, :client_name
  end
end
