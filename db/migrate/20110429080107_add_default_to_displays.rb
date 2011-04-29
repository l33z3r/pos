class AddDefaultToDisplays < ActiveRecord::Migration
  def self.up
    add_column :displays, :is_default, :boolean, :default => false
  end

  def self.down
    remove_column :displays, :is_default
  end
end
