class ChangeDataColumnLength < ActiveRecord::Migration
  def self.up
    change_column :terminal_sync_data, :data, :longtext
  end

  def self.down
    #doesn't matter
  end
end
