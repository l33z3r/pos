class Customer < ActiveRecord::Base
  belongs_to :loyalty_level
  has_many :customer_points
  
  validates :name, :presence => true
  validates :swipe_card_code, :uniqueness => true
  validates :customer_number, :uniqueness => true
  validates :customer_number, :numericality => {:less_than_or_equal_to => 9999999}, :allow_blank => true
  
  def customer_number=(c_num)
    if c_num.blank?
      @card_code = ""  
    else
      @swipe_card_prefix = GlobalSetting.parsed_setting_for GlobalSetting::LOYALTY_CARD_PREFIX
    
      @customer_number_prefix = "10000000"
    
      @end_index = @customer_number_prefix.length - c_num.length - 1
      @card_code = @swipe_card_prefix + @customer_number_prefix[0..@end_index] + c_num + "?C"
    end
    
    write_attribute("swipe_card_code", @card_code)
    write_attribute("customer_number", c_num)
  end
  
  def is_loyalty_customer?
    !loyalty_level_id.blank? and !swipe_card_code.blank?
  end
end



# == Schema Information
#
# Table name: customers
#
#  id               :integer(4)      not null, primary key
#  name             :string(255)
#  contact_name     :string(255)
#  dob              :date
#  address          :string(255)
#  postal_address   :string(255)
#  telephone        :string(255)
#  mobile           :string(255)
#  fax              :string(255)
#  email            :string(255)
#  credit_limit     :float           default(0.0), not null
#  current_balance  :float           default(0.0), not null
#  credit_available :float           default(0.0), not null
#  loyalty_level_id :integer(4)
#  available_points :integer(4)      default(0), not null
#  swipe_card_code  :string(255)
#  created_at       :datetime
#  updated_at       :datetime
#

