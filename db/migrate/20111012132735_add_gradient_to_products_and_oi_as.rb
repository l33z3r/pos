class AddGradientToProductsAndOiAs < ActiveRecord::Migration
  def self.up
    add_column :products, :button_bg_color_2, :string
    add_column :order_item_additions, :background_color_2, :string
  end

  def self.down
    remove_column :products, :button_bg_color_2
    remove_column :order_item_additions, :background_color_2
  end
end
