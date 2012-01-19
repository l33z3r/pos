class CreateCashTotals < ActiveRecord::Migration
  def self.up
    create_table :cash_totals do |t|
      t.string :total_type
      t.float :total
      t.integer :start_calc_order_id
      t.integer :end_calc_order_id

      t.timestamps
    end
  end

  def self.down
    drop_table :cash_totals
  end
end
