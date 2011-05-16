class AddDisplayButtons4 < ActiveRecord::Migration
  def self.up
    DisplayButton.create({:button_text => "Tables", :perm_id => 19})
  end

  def self.down
    DisplayButton.find_by_perm_id(19).destroy
  end
end
