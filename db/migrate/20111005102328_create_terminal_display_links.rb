class CreateTerminalDisplayLinks < ActiveRecord::Migration
  def self.up
    create_table :terminal_display_links do |t|
      t.string :terminal_id
      t.integer :display_id
      t.timestamps
    end
  end

  def self.down
    drop_table :terminal_display_links
  end
end
