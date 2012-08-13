class CreateOutlets < ActiveRecord::Migration
  def self.up
    create_table :outlets do |t|
      t.integer :cluey_account_id
      t.string :name
      t.string :username
      t.string :password
      t.timestamps
    end
  end

  def self.down
    drop_table :outlets
  end
end
