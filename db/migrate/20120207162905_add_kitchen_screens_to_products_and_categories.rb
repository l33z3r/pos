class AddKitchenScreensToProductsAndCategories < ActiveRecord::Migration
  def self.up
    add_column :products, :kitchen_screens, :string, :default => ""
    add_column :categories, :kitchen_screens, :string, :default => ""
  end

  def self.down
    remove_column :products, :kitchen_screens
    remove_column :categories, :kitchen_screens
  end
end
