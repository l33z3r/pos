class AddDefaultValueToQuantityPerContainerProducts < ActiveRecord::Migration
  def self.up
    change_column :products, :quantity_per_container, :float, :default => 1
    
    Product.all.each do |p|
      if !p.quantity_per_container
        p.quantity_per_container = 1
        p.save
      end
    end
  end

  def self.down
  end
end
