class AddClockinCodeToEmployees < ActiveRecord::Migration
  def self.up
    add_column :employees, :clockin_code, :string
  end

  def self.down
    remove_column :employees, :clockin_code
  end
end
