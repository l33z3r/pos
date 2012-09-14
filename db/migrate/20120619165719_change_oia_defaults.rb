class ChangeOiaDefaults < ActiveRecord::Migration
  def self.up
    change_column :order_item_additions, :hide_on_receipt, :boolean, :default => true
    change_column :order_item_additions, :is_addable, :boolean, :default => false
  end

  def self.down
    change_column :order_item_additions, :hide_on_receipt, :boolean, :default => false
    change_column :order_item_additions, :is_addable, :boolean, :default => true
  end
end
