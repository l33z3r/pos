class CreateCashOuts < ActiveRecord::Migration
  def self.up
    create_table :cash_outs do |t|
      t.string :terminal_id
      t.string :note
      t.float :amount
      t.timestamps
    end
  end

  def self.down
    drop_table :cash_outs
  end
end
