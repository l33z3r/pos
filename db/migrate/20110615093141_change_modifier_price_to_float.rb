class ChangeModifierPriceToFloat < ActiveRecord::Migration
  def self.up
    change_column :order_items, :modifier_price, :float
  end

  def self.down
    change_column :order_items, :modifier_price, :integer
  end
end
