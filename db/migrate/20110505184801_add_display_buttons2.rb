class AddDisplayButtons2 < ActiveRecord::Migration
  def self.up
    DisplayButton.create({:button_text => "Room Builder", :perm_id => 13})
  end

  def self.down
    DisplayButton.find_by_perm_id(13).destroy
  end
end
