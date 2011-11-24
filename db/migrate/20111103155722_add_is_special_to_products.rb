class AddIsSpecialToProducts < ActiveRecord::Migration
  def self.up
    add_column :products, :is_special, :boolean, :default => false
  end
  def self.down
    remove_column :products, :is_special
  end
end
