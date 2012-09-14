class ChangeProductDefaults < ActiveRecord::Migration
  def self.up
    change_column :products, :quantity_per_container, :float, :default => 1, :null => false
    
    change_column :products, :size, :float, :default => 1, :null => false
  end

  def self.down
    #doesn't matter
  end
end
