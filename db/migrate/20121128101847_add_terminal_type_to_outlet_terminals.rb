class AddTerminalTypeToOutletTerminals < ActiveRecord::Migration
  def self.up
    add_column :outlet_terminals, :terminal_type, :integer, :default => 1, :null => false
    
    execute("update outlet_terminals set terminal_type = 1")
  end

  def self.down
    remove_column :outlet_terminals, :terminal_type
  end
end
