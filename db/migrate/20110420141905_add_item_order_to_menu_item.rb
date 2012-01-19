class AddItemOrderToMenuItem < ActiveRecord::Migration
  def self.up
    remove_column :menu_items, :grid_x
    remove_column :menu_items, :grid_y

    add_column :menu_items, :order_num, :integer, :default => 0
  end

  def self.down
    add_column :menu_items, :grid_x, :integer
    add_column :menu_items, :grid_y, :integer

    remove_column :menu_items, :order_num
  end
end
