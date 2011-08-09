class Employee < ActiveRecord::Base

  has_attached_file :employee_image, :styles => { :medium => "300x300>", :thumb => "115x115>" },
    :storage => :s3,
    :bucket => S3_BUCKET_NAME,
    :s3_credentials => {
    :access_key_id => S3_ACCESS_KEY_ID,
    :secret_access_key => S3_SECRET_ACCESS_KEY
  }

  has_many :orders

  belongs_to :role
  
  validates :staff_id, :presence => true, :uniqueness => true
  validates :name, :presence => true
  validates :nickname, :presence => true, :uniqueness => true
  validates :passcode, :presence => true
  validates :clockin_code, :presence => true
  validates :hourly_rate, :numericality => true, :allow_blank => true
  validates :overtime_rate, :numericality => true, :allow_blank => true
  validates :role_id, :presence => true
  
  #for will_paginate
  cattr_reader :per_page
  @@per_page = 10
  
  def is_admin
    return role.id == Role::SUPER_USER_ROLE_ID
  end
  
  def has_employee_image?
    return (!employee_image_file_name.nil? and !employee_image_file_name.blank?)
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
#  last_login                  :datetime        default(2011-05-01 13:22:42 UTC)
#  last_active                 :datetime        default(2011-05-01 13:22:42 UTC)
#  last_logout                 :datetime        default(2011-05-01 13:22:42 UTC)
#  created_at                  :datetime
#  updated_at                  :datetime
#  role_id                     :integer(4)      default(1)
#  employee_image_file_name    :string(255)
#  employee_image_content_type :string(255)
#  employee_image_file_size    :integer(4)
#  employee_image_updated_at   :datetime
#  clockin_code                :string(255)
#

