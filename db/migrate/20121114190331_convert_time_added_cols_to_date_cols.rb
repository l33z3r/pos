class ConvertTimeAddedColsToDateCols < ActiveRecord::Migration
  def self.up
#    add_column :order_items, :date_added, :datetime
#    
#    OrderItem.all.each do |oi|
#      oi.date_added = Time.at(oi.time_added.to_i/1000)
#      oi.save
#    end
#    
#    remove_column :order_items, :time_added
#    
#    add_column :orders, :date_started, :datetime
#    
#    Order.all.each do |o|
#      o.date_started = Time.at(o.time_started.to_i/1000)
#      o.save
#    end
#    
#    remove_column :orders, :time_started
  end

  def self.down
    remove_column :order_items, :date_added, :datetime
    add_colu
  end
end
