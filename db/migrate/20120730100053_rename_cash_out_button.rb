class RenameCashOutButton < ActiveRecord::Migration
  def self.up
    @cash_out_button = DisplayButton.find_by_perm_id(ButtonMapper::CASH_OUT_BUTTON)
    @cash_out_button.button_text = "Expenses"
    @cash_out_button.save
  end

  def self.down
  end
end
