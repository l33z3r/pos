class AddDisplayButtons5 < ActiveRecord::Migration
  def self.up
    DisplayButton.create({:button_text => "System", :perm_id => 20})
    DisplayButton.create({:button_text => "Themes", :perm_id => 21})
    DisplayButton.create({:button_text => "Discount", :perm_id => 22})
  end

  def self.down
    DisplayButton.find_all_by_perm_id(20..22).each do |db|
      db.destroy
    end
  end
end
