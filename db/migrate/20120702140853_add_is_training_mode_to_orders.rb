class AddIsTrainingModeToOrders < ActiveRecord::Migration
  def self.up
    add_column :orders, :training_mode_sale, :boolean, :default => false
  end

  def self.down
    remove_column :orders, :training_mode_sale
  end
end
