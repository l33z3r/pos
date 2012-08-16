class Employee < ActiveRecord::Base

  belongs_to :outlet
  
  has_attached_file :employee_image, PAPERCLIP_STORAGE_OPTIONS.merge(:styles => { :medium => "300x300>", :thumb => "115x115>" })

  has_many :orders
  has_many :order_items
  has_many :void_order_items, :class_name => "OrderItem", :foreign_key => "void_employee_id"
  
  has_many :stock_transactions
  
  has_many :shift_timestamps
  has_many :work_reports
   
  belongs_to :role
  
  validates :staff_id, :presence => true
  validates_uniqueness_of :staff_id, :case_sensitive => false, :scope => :outlet_id
  
  validates :name, :presence => true
  
  validates :nickname, :presence => true
  validates_uniqueness_of :nickname, :case_sensitive => false, :scope => :outlet_id
  
  validates :passcode, :presence => true
  validates_uniqueness_of :passcode, :case_sensitive => false, :scope => :outlet_id
  
  validates :clockin_code, :presence => true
  validates_uniqueness_of :clockin_code, :case_sensitive => false, :scope => :outlet_id
  
  validates :hourly_rate, :numericality => true, :allow_blank => true
  validates :overtime_rate, :numericality => true, :allow_blank => true
  validates :role_id, :presence => true
  
  CLUEY_USER_STAFF_ID = -1
  CHEF_USER_STAFF_ID = -2
  
  #for will_paginate
  cattr_reader :per_page
  @@per_page = 10
  
  def is_admin current_outlet
    return role.id == Role::super_user_role_id(current_outlet)
  end
  
  def has_employee_image?
    return (!employee_image_file_name.nil? and !employee_image_file_name.blank?)
  end
  
  def self.all_except_cluey current_outlet
    #don't return the cluey user, or the chef user
    current_outlet.employees.where("staff_id != ?", CLUEY_USER_STAFF_ID).where("staff_id != ?", CHEF_USER_STAFF_ID)
  end
  
  def self.is_cluey_user? id
    @employee = find_by_id(id)
    @employee and (@employee.staff_id.to_i == CLUEY_USER_STAFF_ID)
  end
  
  def self.cluey_user current_outlet
    find_by_outlet_id_and_staff_id(current_outlet.id, CLUEY_USER_STAFF_ID)
  end
  
  def self.is_chef_user? id
    @employee = find_by_id(id)
    @employee and (@employee.staff_id.to_i == CHEF_USER_STAFF_ID)
  end
  
  def self.chef_user current_outlet
    find_by_outlet_id_and_staff_id(current_outlet.id, CHEF_USER_STAFF_ID)
  end
  
  def self.all_active current_outlet
    current_outlet.employees.all
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
#  dallas_code                 :string(255)
#  outlet_id                   :integer(4)
#

