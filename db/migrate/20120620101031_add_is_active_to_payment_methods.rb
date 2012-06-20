class AddIsActiveToPaymentMethods < ActiveRecord::Migration
  def self.up
    add_column :payment_methods, :is_active, :boolean, :default => true
  end

  def self.down
    remove_column :payment_methods, :is_active
  end
end
