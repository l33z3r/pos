class AddLoginCrossdomainAuthTokenToClueyAccounts < ActiveRecord::Migration
  def self.up
    add_column :cluey_accounts, :login_crossdomain_auth_token, :string
    
    ClueyAccount.all.each do |ca|
      ca.generate_login_crossdomain_auth_token
    end
  end

  def self.down
    remove_column :cluey_accounts, :login_crossdomain_auth_token
  end
end
