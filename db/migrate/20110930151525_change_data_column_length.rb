class ChangeDataColumnLength < ActiveRecord::Migration
  def self.up
    if Rails.env.production_heroku?
      execute("ALTER TABLE terminal_sync_data ALTER COLUMN terminal_sync_data.data TYPE TEXT")
    else
      change_column :terminal_sync_data, :data, :longtext
    end
  end

  def self.down
    change_column :terminal_sync_data, :data, :text
  end
end
