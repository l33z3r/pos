class AddFieldsToClueyAccounts < ActiveRecord::Migration
  def self.up
    add_column :cluey_accounts, :first_name, :string, :null => false
    add_column :cluey_accounts, :last_name, :string, :null => false
    add_column :cluey_accounts, :country_id, :integer, :null => false
    
    execute("update cluey_accounts set first_name = 'firstname' where length(first_name) = 0")
    execute("update cluey_accounts set last_name = 'lastname' where length(last_name) = 0")
    execute("update cluey_accounts set country_id = 102 where country_id = 0")
  end

  def self.down
    remove_column :cluey_accounts, :first_name
    remove_column :cluey_accounts, :last_name
    remove_column :cluey_accounts, :country_id
  end
end
