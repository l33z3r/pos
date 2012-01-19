class AddPrintersToCategory < ActiveRecord::Migration
  def self.up
    add_column :categories, :printers, :string, :default => ""
  end

  def self.down
    remove_column :categories, :printers
  end
end
