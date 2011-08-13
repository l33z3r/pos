class AddShowServerAddedTextToOrderItems < ActiveRecord::Migration
  def self.up
    add_column :order_items, :show_server_added_text, :boolean, :default => false
  end

  def self.down
    remove_column :order_items, :show_server_added_text
  end
end
