class RemoveNameFromMenuItem < ActiveRecord::Migration
  def self.up
    remove_column :menu_items, :name
  end

  def self.down
    add_column :menu_items, :name, :string
  end
end
