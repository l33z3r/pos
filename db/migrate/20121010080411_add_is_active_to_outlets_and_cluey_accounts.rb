class AddIsActiveToOutletsAndClueyAccounts < ActiveRecord::Migration
  def self.up
    add_column :outlets, :is_active, :boolean, :default => true
    add_column :cluey_accounts, :is_active, :boolean, :default => true
  end

  def self.down
    remove_column :outlets
    remove_column :cluey_accounts
  end
end
