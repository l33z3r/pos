class CreateProducts < ActiveRecord::Migration
  def self.up
    create_table :products do |t|
      t.string :brand
      t.string :name
      t.integer :category_id
      t.string :description
      t.float :size
      t.string :unit
      t.integer :items_per_unit
      t.float :sales_tax_rate
      t.float :price
      
      t.timestamps
    end
  end

  def self.down
    drop_table :products
  end
end
