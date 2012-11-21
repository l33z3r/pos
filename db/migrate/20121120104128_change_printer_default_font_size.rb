class ChangePrinterDefaultFontSize < ActiveRecord::Migration
  def self.up
    change_column :printers, :font_size, :integer, :default => 13
    change_column :order_item_additions, :is_addable, :boolean, :default => false
    change_column :order_item_additions, :hide_on_receipt, :boolean, :default => true
  end

  def self.down
  end
end
