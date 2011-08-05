# == Schema Information
# Schema version: 20110620143943
#
# Table name: payment_methods
#
#  id                :integer(4)      not null, primary key
#  name              :string(255)
#  is_default        :boolean(1)
#  logo_file_name    :string(255)
#  logo_content_type :string(255)
#  logo_file_size    :integer(4)
#  logo_updated_at   :datetime
#  created_at        :datetime
#  updated_at        :datetime
#

class PaymentMethod < ActiveRecord::Base
  validates :name, :presence => true
  validates :name, :uniqueness => true
  
  has_attached_file :logo, :styles => { :medium => "300x300>", :thumb => "115x115>" }

  def self.load_default
    payment_method = find_by_is_default(true)
    
    if !payment_method
      payment_method = find(:first)
      
      payment_method.is_default = true
      payment_method.save
    end

    payment_method
  end
  
  def has_logo?
    return (!logo_file_name.nil? and !logo_file_name.blank?)
  end
  
end
