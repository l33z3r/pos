class AddTableInfoIdToOrders < ActiveRecord::Migration
  def self.up
    add_column :orders, :table_info_id, :integer
  end

  def self.down
    remove_column :orders, :table_info_id
  end
end
