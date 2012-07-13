class AddVoidEmployeeIdToOrderItems < ActiveRecord::Migration
  def self.up
    add_column :order_items, :void_employee_id, :integer
  end

  def self.down
    remove_column :order_items, :void_employee_id
  end
end
