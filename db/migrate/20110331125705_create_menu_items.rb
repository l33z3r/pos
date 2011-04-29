class CreateMenuItems < ActiveRecord::Migration
  def self.up
    create_table :menu_items do |t|
      t.string :name
      t.integer :menu_page_id
      t.integer :product_id
      t.integer :grid_x
      t.integer :grid_y

      t.timestamps
    end
  end

  def self.down
    drop_table :menu_items
  end
end
