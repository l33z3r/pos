class AddPasswordReset < ActiveRecord::Migration
  def self.up
    add_column :cluey_accounts, :password_reset_token, :string
    add_column :cluey_accounts, :password_reset_sent_at, :datetime
  end

  def self.down
    remove_column :cluey_accounts, :password_reset_token
    remove_column :cluey_accounts, :passowrd_reset_sent_at
  end
end
