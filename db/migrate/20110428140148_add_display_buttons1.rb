class AddDisplayButtons1 < ActiveRecord::Migration
  def self.up
    DisplayButton.create({:button_text => "Users", :perm_id => 5})
    DisplayButton.create({:button_text => "Roles", :perm_id => 6})
    DisplayButton.create({:button_text => "Products", :perm_id => 7})
    DisplayButton.create({:button_text => "Categories", :perm_id => 8})
    DisplayButton.create({:button_text => "Displays", :perm_id => 9})
    DisplayButton.create({:button_text => "Sales Screen Design", :perm_id => 10})
    DisplayButton.create({:button_text => "Access Control", :perm_id => 11})
    DisplayButton.create({:button_text => "Modifier Categories", :perm_id => 12})
  end

  def self.down
    DisplayButton.find_all_by_perm_id(5..12).each do |db|
      db.destroy
    end
  end
end
