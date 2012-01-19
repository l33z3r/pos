class AddServiceChargeToOrders < ActiveRecord::Migration
  def self.up
    add_column :orders, :service_charge, :float
  end

  def self.down
    remove_column :orders, :service_charge
  end
end
