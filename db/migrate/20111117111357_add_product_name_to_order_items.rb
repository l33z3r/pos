class AddProductNameToOrderItems < ActiveRecord::Migration
  def self.up
    add_column :order_items, :product_name, :string
  end

  def self.down
    remove_column :order_items, :product_name
  end
end


