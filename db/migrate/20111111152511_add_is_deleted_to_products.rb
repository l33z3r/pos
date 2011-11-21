class AddIsDeletedToProducts < ActiveRecord::Migration
  def self.up
    add_column :products, :is_deleted, :boolean, :default => false
  end
  def self.down
    add_column :products, :is_deleted
  end
end