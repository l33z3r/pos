class CreateRoomObjects < ActiveRecord::Migration
  def self.up
    create_table :room_objects do |t|
      t.string :object_type
      t.string :permid
      t.string :label
      t.integer :room_id
      t.integer :grid_x
      t.integer :grid_y
      t.integer :grid_x_size
      t.integer :grid_y_size

      t.timestamps
    end
  end

  def self.down
    drop_table :room_objects
  end
end
