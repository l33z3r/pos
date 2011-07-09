class AddPinRequiredToRoles < ActiveRecord::Migration
  def self.up
    add_column :roles, :pin_required, :boolean, :default => false
  end

  def self.down
    remove_column :roles, :pin_required
  end
end
