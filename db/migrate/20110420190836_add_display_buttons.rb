class AddDisplayButtons < ActiveRecord::Migration
  def self.up
    DisplayButton.create({:button_text => "Z Total"})
    DisplayButton.create({:button_text => "X Total"})
    DisplayButton.create({:button_text => "Z Reports"})
    DisplayButton.create({:button_text => "X Reports"})
  end

  def self.down
    DisplayButton.find_by_button_text("Z Total").destroy
    DisplayButton.find_by_button_text("X Total").destroy
    DisplayButton.find_by_button_text("Z Reports").destroy
    DisplayButton.find_by_button_text("X Reports").destroy
  end
end
