class AddTimezoneToClueyAccountsAndOutlets < ActiveRecord::Migration
  def self.up
#    add_column :cluey_accounts, :time_zone, :string, :null => false
#    add_column :outlets, :time_zone, :string, :null => false
#    
#    ClueyAccount.all.each do |ca|
#      ca.time_zone = "Dublin"
#      ca.save
#    end
#    
#    Outlet.all.each do |o|
#      o.time_zone = "Dublin"
#      o.save
#    end
    
  end

  def self.down
    remove_column :cluey_accounts, :time_zone
    remove_column :outlets, :time_zone
  end
end
