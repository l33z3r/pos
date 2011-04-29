class CreateDisplayButtons < ActiveRecord::Migration
  def self.up
    create_table :display_buttons do |t|
      t.integer :display_id
      t.string :button_text
      t.integer :grid_x
      t.integer :grid_y

      t.timestamps
    end
  end

  def self.down
    drop_table :display_buttons
  end
end
