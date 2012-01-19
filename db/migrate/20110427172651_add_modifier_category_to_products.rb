class AddModifierCategoryToProducts < ActiveRecord::Migration
  def self.up
    add_column :products, :modifier_category_id, :integer
  end

  def self.down
    remove_column :products, :modifier_category_id
  end
end
