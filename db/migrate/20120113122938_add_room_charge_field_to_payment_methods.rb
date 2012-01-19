class AddRoomChargeFieldToPaymentMethods < ActiveRecord::Migration
  def self.up
    add_column :payment_methods, :payment_integration_id, :integer, :default => 0
  end

  def self.down
    remove_column :payment_methods, :payment_integration_id
  end
end
