class AddOiaDataToOrderItem < ActiveRecord::Migration
  def self.up
    add_column :order_items, :oia_data, :longtext
  end

  def self.down
    remove_column :order_items, :oia_data
  end
end
