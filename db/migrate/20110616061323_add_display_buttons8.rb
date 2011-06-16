class AddDisplayButtons8 < ActiveRecord::Migration
  def self.up
    DisplayButton.create({:button_text => "Service Charge", :perm_id => 46})
  end

  def self.down
    DisplayButton.find_by_perm_id(46).destroy
  end
end
