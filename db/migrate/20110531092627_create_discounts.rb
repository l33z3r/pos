class CreateDiscounts < ActiveRecord::Migration
  def self.up
    create_table :discounts do |t|
      t.string :name
      t.float :percent
      t.boolean :is_default
      
      t.timestamps
    end
    
    add_column :orders, :discount_percent, :float
    add_column :orders, :pre_discount_price, :float
    
    add_column :order_items, :discount_percent, :float
    add_column :order_items, :pre_discount_price, :float
  end

  def self.down
    remove_column :orders, :discount_percent
    remove_column :orders, :pre_discount_price
    
    remove_column :order_items, :discount_percent
    remove_column :order_items, :pre_discount_price
    
    drop_table :discounts
  end
end
