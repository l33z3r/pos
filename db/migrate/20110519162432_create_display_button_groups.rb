class CreateDisplayButtonGroups < ActiveRecord::Migration
  def self.up
    create_table :display_button_groups do |t|
      t.string :name
      t.timestamps
    end
    
    add_column :display_buttons, :display_button_group_id, :integer
  end

  def self.down
    remove_column :display_buttons, :display_button_group_id
    drop_table :display_button_groups
  end
end
