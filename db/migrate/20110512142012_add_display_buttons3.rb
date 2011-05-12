class AddDisplayButtons3 < ActiveRecord::Migration
  def self.up
  DisplayButton.create({:button_text => "Total", :perm_id => 14})
    DisplayButton.create({:button_text => "Sub-Total", :perm_id => 15})
    DisplayButton.create({:button_text => "Save", :perm_id => 16})
    DisplayButton.create({:button_text => "More Options", :perm_id => 17})
    DisplayButton.create({:button_text => "Button Config", :perm_id => 18})
  end

  def self.down
    DisplayButton.find_all_by_perm_id(14..18).each do |db|
      db.destroy
    end
  end
end
