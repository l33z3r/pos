class AddDefaultServiceChargeToRoom < ActiveRecord::Migration
  def self.up
    add_column :rooms, :default_service_charge_percent, :float
  end

  def self.down
    remove_column :rooms, :default_service_charge_percent
  end
end
