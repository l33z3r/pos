class CreateOrderItemAdditionGrids < ActiveRecord::Migration
  def self.up
    create_table :order_item_addition_grids do |t|
      t.string :name
      
      t.integer :grid_x_size
      t.integer :grid_y_size
      
      t.boolean :is_default, :default => false
      
      t.timestamps
    end
    
    add_column :displays, :order_item_addition_grid_id, :integer
  end

  def self.down
    drop_table :order_item_addition_grids
    
    remove_column :displays, :order_item_addition_grid_id
  end
end
