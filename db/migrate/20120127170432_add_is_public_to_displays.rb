class AddIsPublicToDisplays < ActiveRecord::Migration
  def self.up
    add_column :displays, :is_public, :boolean, :default => false
  end

  def self.down
    remove_column :displays, :is_public
  end
end
