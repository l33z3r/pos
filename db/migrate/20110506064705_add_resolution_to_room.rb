class AddResolutionToRoom < ActiveRecord::Migration
  def self.up
    add_column :rooms, :grid_resolution, :integer, :default => 5
  end

  def self.down
    remove_column :rooms, :grid_resolution
  end
end
