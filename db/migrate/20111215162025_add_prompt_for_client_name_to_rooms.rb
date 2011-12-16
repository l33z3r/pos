class AddPromptForClientNameToRooms < ActiveRecord::Migration
  def self.up
    add_column :rooms, :prompt_for_client_name, :boolean, :default => false
  end

  def self.down
    remove_column :rooms, :prompt_for_client_name
  end
end
