class AddHideOnReceiptToOia < ActiveRecord::Migration
  def self.up
    add_column :order_item_additions, :hide_on_receipt, :boolean, :default => false
    add_column :order_item_additions, :is_addable, :boolean, :default => true
  end

  def self.down
    remove_column :order_item_additions, :hide_on_receipt
    remove_column :order_item_additions, :is_addable
  end
end
