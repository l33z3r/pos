class CreateModifierCategories < ActiveRecord::Migration
  def self.up
    create_table :modifier_categories do |t|
      t.string :name

      t.timestamps
    end
  end

  def self.down
    drop_table :modifier_categories
  end
end
