class EnsureProductDefaultsSet < ActiveRecord::Migration
  def self.up
    change_column :products, :size, :float, :default => 0, :null => false
    execute("update products set size = 0 where size is null")
    
    change_column :products, :price, :float, :default => 0, :null => false
    execute("update products set price = 0 where price is null")
    
    change_column :products, :double_price, :float, :default => 0, :null => false
    execute("update products set double_price = 0 where double_price is null")
    
    change_column :products, :price_2, :float, :default => 0, :null => false
    execute("update products set price_2 = 0 where price_2 is null")
    
    change_column :products, :price_3, :float, :default => 0, :null => false
    execute("update products set price_3 = 0 where price_3 is null")
    
    change_column :products, :price_4, :float, :default => 0, :null => false
    execute("update products set price_4 = 0 where price_4 is null")
    
    change_column :products, :items_per_unit, :integer, :default => 0, :null => false
    execute("update products set items_per_unit = 0 where items_per_unit is null")
    
    change_column :products, :sales_tax_rate, :float, :default => 0, :null => false
    execute("update products set sales_tax_rate = 0 where sales_tax_rate is null")
    
    change_column :products, :margin_percent, :float, :default => 0, :null => false
    execute("update products set margin_percent = 0 where margin_percent is null")
    
    change_column :products, :commission_percent, :float, :default => 0, :null => false
    execute("update products set commission_percent = 0 where commission_percent is null")
    
    change_column :products, :commission_percent, :float, :default => 0, :null => false
    execute("update products set commission_percent = 0 where commission_percent is null")
    
    change_column :products, :cost_price, :float, :default => 0, :null => false
    execute("update products set cost_price = 0 where cost_price is null")
    
    change_column :products, :shipping_cost, :float, :default => 0, :null => false
    execute("update products set shipping_cost = 0 where shipping_cost is null")
    
    change_column :products, :quantity_per_container, :float, :default => 0, :null => false
    execute("update products set quantity_per_container = 0 where quantity_per_container is null")       
  end

  def self.down
    #doesn't matter
  end
end
