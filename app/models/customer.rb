class Customer < ActiveRecord::Base
  has_many :customer_points
  belongs_to :loyalty_level
  
  has_many :customer_transactions
  
  NORMAL = "normal"
  LOYALTY = "loyalty"
  BOTH = "both"
  
  VALID_CUSTOMER_TYPES = [NORMAL, LOYALTY, BOTH]
  
  CUSTOMER_TYPE_LABELS = {
    "normal" => "Account", 
    "loyalty" => "Loyalty", 
    "both" => "Both"
  }
  
  validates :name, :presence => true
  validates :swipe_card_code, :uniqueness => true, :allow_blank => true
  validates :customer_number, :uniqueness => true, :allow_blank => true
  validates :customer_number, :numericality => {:less_than_or_equal_to => 9999999}, :allow_blank => true
  
  validates :customer_type, :presence => true, :inclusion => { :in => VALID_CUSTOMER_TYPES }
  
  attr_accessor :is_loyalty_customer
  attr_accessor :is_normal_customer
  
  def self.customer_type_options_for_select
    @options = []
    
    VALID_CUSTOMER_TYPES.each do |ct|
      @options << [CUSTOMER_TYPE_LABELS[ct], ct]
    end
    
    @options
  end
  
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
  
  def swipe_card_code=(card_code)
    if card_code.blank?
      @customer_number = nil
    else
      @swipe_card_prefix = GlobalSetting.parsed_setting_for GlobalSetting::LOYALTY_CARD_PREFIX
    
      @customer_number_prefix = "10000000"
    
      @start_index = @swipe_card_prefix.length + 1
      @end_index = @start_index + @customer_number_prefix.length - 2
      
      @customer_number = card_code[@start_index..@end_index]
    end
    
    write_attribute("swipe_card_code", card_code)
    
    if @customer_number
      write_attribute("customer_number", @customer_number)
    end
  end
  
  def is_loyalty_customer?
    customer_type == LOYALTY or customer_type == BOTH
  end
  
  def is_normal_customer?
    customer_type == NORMAL or customer_type == BOTH
  end
  
  def credit_limit=(c_limit)
    @credit_available = c_limit.to_f - current_balance
    write_attribute("credit_available", @credit_available)
    write_attribute("credit_limit", c_limit)
  end
  
  def current_balance=(c_balance)
    @credit_available = credit_limit - c_balance.to_f
    write_attribute("credit_available", @credit_available)
    write_attribute("current_balance", c_balance)
  end
  
  def self.all_active
    Customer.where("is_active = ?", true)
  end
  
  ACCOUNT_NUMBER_BASE = 100000
  
  def account_number
    ACCOUNT_NUMBER_BASE + id
  end
  
  def validate
    errors.add(:credit_limit, "cannot be set to a value lower than the users current balance outstanding") if credit_limit < current_balance
    errors.add(:customer_number, " not valid. You must enter either a swipe card code or a customer number if this customer is a loyalty customer") if is_loyalty_customer? and (swipe_card_code.blank? and customer_number.blank?)
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
#  customer_number  :integer(4)
#  customer_type    :string(255)
#  is_active        :boolean(1)      default(TRUE)
#

