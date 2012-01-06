class AddOiagIdToProductsAndCategories < ActiveRecord::Migration
  def self.up
    add_column :products, :order_item_addition_grid_id, :integer
    add_column :products, :order_item_addition_grid_id_is_mandatory, :boolean, :default => false
    
    add_column :categories, :order_item_addition_grid_id, :integer
    add_column :categories, :order_item_addition_grid_id_is_mandatory, :boolean, :default => false
  end

  def self.down
    remove_column :products, :order_item_addition_grid_id
    remove_column :products, :order_item_addition_grid_id_is_mandatory
    
    remove_column :categories, :order_item_addition_grid_id
    remove_column :categories, :order_item_addition_grid_id_is_mandatory
  end
end
