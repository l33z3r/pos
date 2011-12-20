class ChangeUpcOnProducts < ActiveRecord::Migration
  def self.up
    change_column :products, :upc, :string
  end

  def self.down
    change_column :products, :upc, :integer
  end
end
