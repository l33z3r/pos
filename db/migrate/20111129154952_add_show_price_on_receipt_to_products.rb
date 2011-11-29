class AddShowPriceOnReceiptToProducts < ActiveRecord::Migration
  def self.up
    add_column :products, :show_price_on_receipt, :boolean, :default => true
  end

  def self.down
    remove_column :products, :show_price_on_receipt
  end
end
