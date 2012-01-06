class AddFieldsToOia < ActiveRecord::Migration
  def self.up
    add_column :order_item_additions, :follow_on_grid_id, :integer
    add_column :order_item_additions, :product_id, :integer
  end

  def self.down
    remove_column :order_item_additions, :follow_on_grid_id
    remove_column :order_item_additions, :product_id
  end
end
