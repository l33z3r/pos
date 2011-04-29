class CreateEmployees < ActiveRecord::Migration
  def self.up
    create_table :employees do |t|
      t.string :staff_id
      t.string :name
      t.string :nickname
      t.string :passcode
      t.string :address
      t.string :telephone
      t.float :hourly_rate
      t.float :overtime_rate
      t.datetime :last_login, :default => Time.now
      t.datetime :last_active, :default => Time.now
      t.datetime :last_logout, :default => Time.now
      t.boolean :is_admin

      t.timestamps
    end
  end

  def self.down
    drop_table :employees
  end
end
