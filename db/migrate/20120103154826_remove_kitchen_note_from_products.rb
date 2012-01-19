class RemoveKitchenNoteFromProducts < ActiveRecord::Migration
  def self.up
    remove_column :products, :kitchen_note
  end

  def self.down
    add_column :products, :kitchen_note, :text
  end
end
