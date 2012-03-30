class ChangeGlobalSettingsValueColumnLength < ActiveRecord::Migration
  def self.up
    if Rails.env.production_heroku?
      execute("ALTER TABLE global_settings ALTER COLUMN global_settings.value TYPE TEXT")
    else
      change_column :global_settings, :value, :text
    end
  end

  def self.down
    #doesn't matter
    change_column :global_settings, :value, :string
  end
end
