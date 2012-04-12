class PaymentMethod < ActiveRecord::Base
  belongs_to :receipt_footer
  
  validates :name, :presence => true
  validates :name, :uniqueness => true
 
  PAYMENT_INTEGRATION_ZALION = 1
  
  PAYMENT_INTEGRATION_TYPES_MAP = {
    PAYMENT_INTEGRATION_ZALION => "Zalion"
  }
  
  PAYMENT_INTEGRATION_TYPES = [
    PAYMENT_INTEGRATION_ZALION
  ]
  
  CASH_PAYMENT_METHOD_NAME = "cash"
  LOYALTY_PAYMENT_METHOD_NAME = "loyalty"
  ACCOUNT_PAYMENT_METHOD_NAME = "account"
  
  has_attached_file :logo, PAPERCLIP_STORAGE_OPTIONS.merge(:styles => { :medium => "300x300>", :thumb => "115x115>" })
  
  def is_cash?
    self.name.downcase == CASH_PAYMENT_METHOD_NAME
  end
  
  def is_loyalty?
    self.name.downcase == LOYALTY_PAYMENT_METHOD_NAME
  end
  
  def is_account?
    self.name.downcase == ACCOUNT_PAYMENT_METHOD_NAME
  end
  
  def is_system_pm?
    self.is_cash? or self.is_loyalty? or self.is_account?
  end
  
  def can_be_default?
    self.is_cash? or (!self.is_system_pm? and (self.payment_integration_id == 0))
  end
  
  def can_have_integration?
    !self.is_system_pm?
  end
  
  def self.payment_integration_options_for_select
    @options = []
    
    PAYMENT_INTEGRATION_TYPES_MAP.each do |key, val|
      @options << [val, key]
    end
    
    #the none option
    @options << ["None", 0]
    
    @options
  end
  
  def self.load_default
    payment_method = find_by_is_default(true)
    
    if !payment_method
      payment_method = find_by_name(CASH_PAYMENT_METHOD_NAME)
      
      payment_method.is_default = true
      payment_method.save
    end

    payment_method
  end
  
  def has_logo?
    return (!logo_file_name.nil? and !logo_file_name.blank?)
  end
  
end



# == Schema Information
#
# Table name: payment_methods
#
#  id                     :integer(4)      not null, primary key
#  name                   :string(255)
#  is_default             :boolean(1)
#  logo_file_name         :string(255)
#  logo_content_type      :string(255)
#  logo_file_size         :integer(4)
#  logo_updated_at        :datetime
#  created_at             :datetime
#  updated_at             :datetime
#  payment_integration_id :integer(4)      default(0)
#  receipt_footer_id      :integer(4)
#  open_cash_drawer       :boolean(1)      default(TRUE)
#

