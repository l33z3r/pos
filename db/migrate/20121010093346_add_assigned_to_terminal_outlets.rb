class AddAssignedToTerminalOutlets < ActiveRecord::Migration
  def self.up
    add_column :outlet_terminals, :assigned, :boolean, :default => false
  end

  def self.down
    remove_column :outlet_terminals, :assigned, :boolean, :default => false
  end
end
