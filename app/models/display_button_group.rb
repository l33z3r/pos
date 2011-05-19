# == Schema Information
# Schema version: 20110519162432
#
# Table name: display_button_groups
#
#  id         :integer(4)      not null, primary key
#  name       :string(255)
#  created_at :datetime
#  updated_at :datetime
#

class DisplayButtonGroup < ActiveRecord::Base
  has_many :display_buttons
  
  validates :name, :presence => true, :length => { :minimum => 3 }
  
  def self.all_with_empty
    @empty_group = DisplayButtonGroup.new({:name => "No Group"})
    @empty_group.display_buttons << DisplayButton.find_all_by_display_button_group_id(nil)
    
    @groups = find(:all, :order => "name")
    
    @groups << @empty_group
    
    @groups
  end
end
