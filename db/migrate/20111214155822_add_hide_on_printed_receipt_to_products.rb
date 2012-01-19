class AddHideOnPrintedReceiptToProducts < ActiveRecord::Migration
  def self.up
    add_column :products, :hide_on_printed_receipt, :boolean, :default => false
  end

  def self.down
    remove_column :products, :hide_on_printed_receipt
  end
end
