class CreateModifiers < ActiveRecord::Migration
  def self.up
    create_table :modifiers do |t|
      t.integer :modifier_category_id
      t.string :name
      t.float :price

      t.timestamps
    end
  end

  def self.down
    drop_table :modifiers
  end
end
