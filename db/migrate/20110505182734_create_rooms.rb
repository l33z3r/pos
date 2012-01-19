class CreateRooms < ActiveRecord::Migration
  def self.up
    create_table :rooms do |t|
      t.string :name
      t.integer :grid_x_size
      t.integer :grid_y_size

      t.timestamps
    end
  end

  def self.down
    drop_table :rooms
  end
end
