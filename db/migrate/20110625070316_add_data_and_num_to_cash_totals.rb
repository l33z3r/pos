class AddDataAndNumToCashTotals < ActiveRecord::Migration
  def self.up
    add_column :cash_totals, :report_num, :integer
    add_column :cash_totals, :report_data, :text
  end

  def self.down
    remove_column :cash_totals, :report_num
    remove_column :cash_totals, :report_data
  end
end
