class AddSalesTaxRatesToOrderItems < ActiveRecord::Migration
  def self.up
    add_column :order_items, :tax_rate, :float
  end

  def self.down
    remove_column :order_items, :tax_rate
  end
end
