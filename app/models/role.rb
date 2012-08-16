class Role < ActiveRecord::Base
  belongs_to :outlet
  
  has_many :employees
  has_many :display_button_roles

  validates :name, :presence => true
  validates_uniqueness_of :name, :case_sensitive => false, :scope => :outlet_id
  
  def self.super_user_role_id current_outlet
    find_by_outlet_id_and_name(current_outlet.id, "Administrator").try(:id)
  end
  
  def self.employee_role_id current_outlet
    find_by_outlet_id_and_name(current_outlet.id, "Employee").try(:id)
  end
  
end



# == Schema Information
#
# Table name: roles
#
#  id            :integer(4)      not null, primary key
#  name          :string(255)
#  created_at    :datetime
#  updated_at    :datetime
#  pin_required  :boolean(1)      default(FALSE)
#  login_allowed :boolean(1)      default(TRUE)
#  outlet_id     :integer(4)
#

