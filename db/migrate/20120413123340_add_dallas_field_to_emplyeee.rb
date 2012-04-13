class AddDallasFieldToEmplyeee < ActiveRecord::Migration
  def self.up
    add_column :employees, :dallas_code, :string
  end

  def self.down
    remove_column :employees, :dallas_code, :string
  end
end
