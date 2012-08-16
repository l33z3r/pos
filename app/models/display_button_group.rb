class DisplayButtonGroup < ActiveRecord::Base
  belongs_to :outlet
  
  has_many :display_buttons, :dependent => :nullify
  
  validates :name, :presence => true, :length => { :minimum => 3 }
  
  def self.all_with_empty current_outlet
    @empty_group = DisplayButtonGroup.new({:name => "No Group"})
    @empty_group.display_buttons << DisplayButton.where("outlet_id = #{current_outlet.id} and display_button_group_id is null")
    
    @groups = DisplayButtonGroup.where("outlet_id = #{current_outlet.id}").order("name")
    
    @groups << @empty_group
    
    @groups
  end
end

# == Schema Information
#
# Table name: display_button_groups
#
#  id         :integer(4)      not null, primary key
#  name       :string(255)
#  created_at :datetime
#  updated_at :datetime
#  outlet_id  :integer(4)
#

