class AddTimeStartedToOrders < ActiveRecord::Migration
  def self.up
    add_column :orders, :time_started, :string
    
    execute("update orders set time_started = 0")
  end

  def self.down
    remove_column :orders, :time_started
  end
end
