# == Schema Information
# Schema version: 20110429080107
#
# Table name: display_buttons
#
#  id          :integer(4)      not null, primary key
#  button_text :string(255)
#  created_at  :datetime
#  updated_at  :datetime
#  perm_id     :integer(4)
#

class DisplayButton < ActiveRecord::Base

  has_many :display_button_roles
  
  validates :button_text, :presence => true
  validates :perm_id, :presence => true
end
