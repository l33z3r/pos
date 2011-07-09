# == Schema Information
# Schema version: 20110705150431
#
# Table name: roles
#
#  id           :integer(4)      not null, primary key
#  name         :string(255)
#  created_at   :datetime
#  updated_at   :datetime
#  pin_required :boolean(1)
#

class Role < ActiveRecord::Base
  has_many :employees
  has_many :display_button_roles

  validates :name, :presence => true

  #TODO: load from config file
  SUPER_USER_ROLE_ID = find_by_name("Super User").try(:id)
end
