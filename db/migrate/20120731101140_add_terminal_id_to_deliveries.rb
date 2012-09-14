class AddTerminalIdToDeliveries < ActiveRecord::Migration
  def self.up
    add_column :deliveries, :terminal_id, :string
    
    @some_terminal = GlobalSetting.all_terminals.first
    
    Delivery.all.each do |d|      
      d.terminal_id = @some_terminal
      d.save
    end
  end

  def self.down
    remove_column :deliveries, :terminal_id
  end
end
