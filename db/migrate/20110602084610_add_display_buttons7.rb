class AddDisplayButtons7 < ActiveRecord::Migration
  def self.up
    DisplayButton.create({:button_text => "Order", :perm_id => 45})
  end

  def self.down
    DisplayButton.find_by_perm_id(45).destroy
  end
end
