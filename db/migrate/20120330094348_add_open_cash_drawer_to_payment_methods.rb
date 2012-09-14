class AddOpenCashDrawerToPaymentMethods < ActiveRecord::Migration
  def self.up
    add_column :payment_methods, :open_cash_drawer, :boolean, :default => true
  end

  def self.down
    remove_column :payment_methods, :open_cash_drawer
  end
end
