# == Schema Information
# Schema version: 20110429080107
#
# Table name: employees
#
#  id            :integer(4)      not null, primary key
#  staff_id      :string(255)
#  name          :string(255)
#  nickname      :string(255)
#  passcode      :string(255)
#  address       :string(255)
#  telephone     :string(255)
#  hourly_rate   :float
#  overtime_rate :float
#  last_login    :datetime        default(2011-04-30 09:10:05 UTC)
#  last_active   :datetime        default(2011-04-30 09:10:05 UTC)
#  last_logout   :datetime        default(2011-04-30 09:10:05 UTC)
#  created_at    :datetime
#  updated_at    :datetime
#  role_id       :integer(4)      default(1)
#

class Employee < ActiveRecord::Base

  has_many :orders

  belongs_to :role
  
  validates :staff_id, :presence => true, :uniqueness => true
  validates :name, :presence => true
  validates :nickname, :presence => true, :uniqueness => true
  validates :passcode, :presence => true, :numericality => true
  validates :address, :presence => true
  validates :telephone, :presence => true
  validates :hourly_rate, :presence => true, :numericality => true
  validates :overtime_rate, :presence => true, :numericality => true
  validates :role_id, :presence => true
  
  def is_admin
    return role.id == Role::SUPER_USER_ROLE_ID
  end
end
