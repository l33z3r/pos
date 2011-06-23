class CreateTerminalSyncData < ActiveRecord::Migration
  def self.up
    create_table :terminal_sync_data do |t|
      t.integer :sync_type
      t.string :time
      t.text :data
      t.timestamps
    end
  end

  def self.down
    drop_table :terminal_sync_data
  end
end
