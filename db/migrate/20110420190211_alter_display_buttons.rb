class AlterDisplayButtons < ActiveRecord::Migration
  def self.up
    remove_column :display_buttons, :grid_x
    remove_column :display_buttons, :grid_y
    remove_column :display_buttons, :display_id
  end

  def self.down
    add_column :display_buttons, :grid_x, :integer, :default => 0
    add_column :display_buttons, :grid_y, :integer, :default => 0
    add_column :display_buttons, :display_id, :integer
  end
end
