class AddDisplayButtons9 < ActiveRecord::Migration
  def self.up
    DisplayButton.create({:button_text => "Previous Sales", :perm_id => 47})
  end

  def self.down
    DisplayButton.find_by_perm_id(47).destroy
  end
end
