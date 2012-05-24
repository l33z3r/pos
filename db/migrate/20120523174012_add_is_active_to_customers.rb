class AddIsActiveToCustomers < ActiveRecord::Migration
  def self.up
    add_column :customers, :is_active, :boolean, :default => true
  end

  def self.down
    remove_column :customers, :is_active
  end
end
