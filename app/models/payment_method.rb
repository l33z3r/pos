class PaymentMethod < ActiveRecord::Base
  belongs_to :outlet
  
  belongs_to :receipt_footer
  
  validates :name, :presence => true
  validates_uniqueness_of :name, :case_sensitive => false, :scope => :outlet_id
 
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
  
  def self.all_active current_outlet
    current_outlet.payment_methods.where("is_active = ?", true)
  end
  
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
  
  def can_be_shortcut?
    self.is_cash? or (!self.is_system_pm? and (self.payment_integration_id == 0))
  end
  
  def can_be_disabled?
    !self.is_cash?
  end
  
  def self.options_for_shortcut_linking current_outlet
    options_for_select(current_outlet) << ["None", -1]
  end
  
  def self.options_for_select current_outlet
    @options = []
    
    PaymentMethod.for_util_payment(current_outlet).each do |pm|
      @options << [pm.name, pm.id]
    end
    
    @options
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
  
  #only return payment options that don't have an integration
  #or are not the account payment method or loyalty payment method
  def self.for_util_payment current_outlet
    current_outlet.payment_methods.where("payment_integration_id = 0 and name != '#{LOYALTY_PAYMENT_METHOD_NAME}' and name != '#{ACCOUNT_PAYMENT_METHOD_NAME}'")
  end
  
  def self.load_default current_outlet
    payment_method = find_by_outlet_id_and_is_default(current_outlet.id, true)
    
    if !payment_method
      payment_method = find_by_outlet_id_and_name(current_outlet.id, CASH_PAYMENT_METHOD_NAME)
      
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
#  id                     :integer(8)      not null, primary key
#  name                   :string(255)
#  is_default             :boolean(1)
#  logo_file_name         :string(255)
#  logo_content_type      :string(255)
#  logo_file_size         :integer(4)
#  logo_updated_at        :datetime
#  created_at             :datetime
#  updated_at             :datetime
#  payment_integration_id :integer(8)      default(0), not null
#  receipt_footer_id      :integer(8)
#  open_cash_drawer       :boolean(1)      default(TRUE)
#  is_active              :boolean(1)      default(TRUE)
#  outlet_id              :integer(8)
#

