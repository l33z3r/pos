class AddProductNameToOrderItems < ActiveRecord::Migration
  def self.up
    change_table :order_items do |t|
      t.string :product_name
    end
  end

  def self.down
    change_table :order_items do |t|
      t.remove :product_name
    end
  end
end
