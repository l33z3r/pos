class AddEmployeeIdToCashTotals < ActiveRecord::Migration
  def self.up
    add_column :cash_totals, :employee_id, :integer
  end

  def self.down
    remove_column :cash_totals, :employee_id
  end
end
