class AddIsDeletedToProducts < ActiveRecord::Migration
  def self.up
    change_table :products do |t|
      t.boolean :is_deleted, :default => false
    end
  end

  def self.down
    change_table :products do |t|
      t.remove :is_deleted
    end
  end
end