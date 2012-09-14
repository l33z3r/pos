class CreateIngredients < ActiveRecord::Migration
  def self.up
    create_table :ingredients do |t|
      t.integer :product_id
      t.integer :ingredient_product_id
      t.integer :quantity_numerator, :default => 1
      t.integer :quantity_denominator, :default => 1
      t.timestamps
    end
  end

  def self.down
    drop_table :ingredients
  end
end
