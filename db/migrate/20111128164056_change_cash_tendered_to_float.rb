class ChangeCashTenderedToFloat < ActiveRecord::Migration
  def self.up
    change_column :orders, :amount_tendered, :float
  end

  def self.down
    change_column :orders, :amount_tendered, :integer
  end
end
