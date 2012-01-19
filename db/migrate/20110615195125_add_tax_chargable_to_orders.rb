class AddTaxChargableToOrders < ActiveRecord::Migration
  def self.up
    add_column :orders, :tax_chargable, :boolean, :default => false
    add_column :orders, :global_sales_tax_rate, :float
  end

  def self.down
    remove_column :orders, :tax_chargable
    remove_column :orders, :global_sales_tax_rate
  end
end
