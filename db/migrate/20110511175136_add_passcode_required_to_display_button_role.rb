class AddPasscodeRequiredToDisplayButtonRole < ActiveRecord::Migration
  def self.up
    add_column :display_button_roles, :passcode_required, :boolean, :default => false
  end

  def self.down
    add_column :display_button_roles, :passcode_required
  end
end
