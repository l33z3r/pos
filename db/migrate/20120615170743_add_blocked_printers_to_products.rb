class AddBlockedPrintersToProducts < ActiveRecord::Migration
  def self.up
    add_column :products, :blocked_printers, :string
    add_column :categories, :blocked_printers, :string
  end

  def self.down
    remove_column :products, :blocked_printers
    remove_column :categories, :blocked_printers
  end
end
