class Employee < ActiveRecord::Base

  has_attached_file :employee_image, PAPERCLIP_STORAGE_OPTIONS.merge(:styles => { :medium => "300x300>", :thumb => "115x115>" })

  has_many :orders

  has_many :stock_transactions
  
  belongs_to :role
  
  validates :staff_id, :presence => true, :uniqueness => true
  validates :name, :presence => true
  validates :nickname, :presence => true, :uniqueness => true
  validates :passcode, :presence => true, :uniqueness => true
  validates :clockin_code, :presence => true, :uniqueness => true
  validates :hourly_rate, :numericality => true, :allow_blank => true
  validates :overtime_rate, :numericality => true, :allow_blank => true
  validates :role_id, :presence => true
  
  CLUEY_USER_STAFF_ID = -1
  
  #for will_paginate
  cattr_reader :per_page
  @@per_page = 10
  
  def is_admin
    return role.id == Role::SUPER_USER_ROLE_ID
  end
  
  def has_employee_image?
    return (!employee_image_file_name.nil? and !employee_image_file_name.blank?)
  end
  
  def self.all_except_cluey
    where("staff_id != ?", CLUEY_USER_STAFF_ID)
  end
  
  def self.is_cluey_user? id
    @employee = find_by_id(id)
    @employee and (@employee.staff_id.to_i == CLUEY_USER_STAFF_ID)
  end
end


# == Schema Information
#
# Table name: employees
#
#  id                          :integer(4)      not null, primary key
#  staff_id                    :string(255)
#  name                        :string(255)
#  nickname                    :string(255)
#  passcode                    :string(255)
#  address                     :string(255)
#  telephone                   :string(255)
#  hourly_rate                 :float
#  overtime_rate               :float
#  last_login                  :datetime        default(2012-01-07 09:28:01 UTC)
#  last_active                 :datetime        default(2012-01-07 09:28:01 UTC)
#  last_logout                 :datetime        default(2012-01-07 09:28:01 UTC)
#  created_at                  :datetime
#  updated_at                  :datetime
#  role_id                     :integer(4)      default(1)
#  employee_image_file_name    :string(255)
#  employee_image_content_type :string(255)
#  employee_image_file_size    :integer(4)
#  employee_image_updated_at   :datetime
#  clockin_code                :string(255)
#

