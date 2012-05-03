class ChangeGlobalSettingsValueColumnLength < ActiveRecord::Migration
  def self.up
    change_column :global_settings, :value, :text
  end

  def self.down
    #doesn't matter
    change_column :global_settings, :value, :string
  end
end
