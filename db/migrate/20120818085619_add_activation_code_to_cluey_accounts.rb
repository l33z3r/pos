class AddActivationCodeToClueyAccounts < ActiveRecord::Migration
  def self.up
    add_column :cluey_accounts, :activation_code, :string
    add_column :cluey_accounts, :activated_at, :datetime
  end

  def self.down
    remove_column :cluey_accounts, :activation_code
    remove_column :cluey_accounts, :activated_at
  end
end
