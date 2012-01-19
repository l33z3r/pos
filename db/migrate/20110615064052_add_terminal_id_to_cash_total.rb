class AddTerminalIdToCashTotal < ActiveRecord::Migration
  def self.up
    add_column :cash_totals, :terminal_id, :string
  end

  def self.down
    remove_column :cash_totals, :terminal_id
  end
end
