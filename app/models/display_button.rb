class DisplayButton < ActiveRecord::Base
  belongs_to :outlet
  
  belongs_to :display_button_group
  has_many :display_button_roles
  
  validates :button_text, :presence => true, :length => { :minimum => 1 }
  validates :perm_id, :presence => true
end

# == Schema Information
#
# Table name: display_buttons
#
#  id                      :integer(4)      not null, primary key
#  button_text             :string(255)
#  created_at              :datetime
#  updated_at              :datetime
#  perm_id                 :integer(4)
#  display_button_group_id :integer(4)
#  outlet_id               :integer(4)
#

