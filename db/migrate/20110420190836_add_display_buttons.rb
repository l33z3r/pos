class AddDisplayButtons < ActiveRecord::Migration
  def self.up
    DisplayButton.create({:button_text => "X Total", :perm_id => 1})
    DisplayButton.create({:button_text => "Z Total", :perm_id => 2})
    DisplayButton.create({:button_text => "X Reports", :perm_id => 3})
    DisplayButton.create({:button_text => "Z Reports", :perm_id => 4})
  end

  def self.down
    DisplayButton.find_all_by_perm_id(1..4).each do |db|
      db.destroy
    end
  end
end
