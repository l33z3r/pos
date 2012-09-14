class AddAllowLoginToEmployeeRoles < ActiveRecord::Migration
  def self.up
    add_column :roles, :login_allowed, :boolean, :default => true
  end

  def self.down
    remove_column :roles, :login_allowed
  end
end
