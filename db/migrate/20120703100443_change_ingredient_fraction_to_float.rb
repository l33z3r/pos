class ChangeIngredientFractionToFloat < ActiveRecord::Migration
  def self.up
    change_column :ingredients, :quantity_numerator, :float
    change_column :ingredients, :quantity_denominator, :float
  end

  def self.down
    change_column :ingredients, :quantity_numerator, :integer
    change_column :ingredients, :quantity_denominator, :integer
  end
end
