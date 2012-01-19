class CreateRoles < ActiveRecord::Migration
  def self.up
    create_table :roles do |t|
      t.string :name

      t.timestamps
    end

    add_column :employees, :role_id, :integer, :default => 1
  end

  def self.down
    remove_column :employees, :role_id
    drop_table :roles
  end
end
