class RemoveIsDefaultFromOiaGs < ActiveRecord::Migration
  def self.up
    remove_column :order_item_addition_grids, :is_default
    remove_column :displays, :order_item_addition_grid_id
  end

  def self.down
    add_column :displays, :order_item_addition_grid_id, :integer
    add_column :order_item_addition_grids, :is_default, :boolean, :default => false
  end
end
