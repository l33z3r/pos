class CreateOrderItemAdditions < ActiveRecord::Migration
  def self.up
    create_table :order_item_additions do |t|
      t.integer :order_item_addition_grid_id
      
      t.string :description
      
      t.float :add_charge
      t.float :minus_charge
      
      t.boolean :available, :default => true
      t.string :background_color
      t.string :text_color
      t.integer :text_size
      
      t.integer :pos_x
      t.integer :pos_y
      
      t.timestamps
    end
  end

  def self.down
    drop_table :order_item_additions
  end
end
