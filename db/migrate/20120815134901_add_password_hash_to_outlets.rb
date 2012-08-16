class AddPasswordHashToOutlets < ActiveRecord::Migration
  def self.up
    rename_column :outlets, :password, :password_hash
    add_column :outlets, :password_salt, :string
  end

  def self.down
    rename_column :outlets, :password_hash, :password
    remove_column :outlets, :password_salt
  end
end
