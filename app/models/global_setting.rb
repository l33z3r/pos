# == Schema Information
# Schema version: 20110526094125
#
# Table name: global_settings
#
#  id                :integer(4)      not null, primary key
#  key               :string(255)
#  value             :string(255)
#  label_text        :string(255)
#  logo_file_name    :string(255)
#  logo_content_type :string(255)
#  logo_file_size    :integer(4)
#  logo_updated_at   :datetime
#  created_at        :datetime
#  updated_at        :datetime
#

class GlobalSetting < ActiveRecord::Base
  
  before_save :prepare_value_for_save
  
  has_attached_file :logo, :styles => {:large => "400x400", :medium => "300x300>", :thumb => "115x115>" }
  
  validates :key, :presence => true, :uniqueness => true
  validates :label_text, :presence => true
  
  #this is a semantic value built from the raw value, depending on the property
  attr_accessor :parsed_value
  
  BUSINESS_NAME = 1
  ADDRESS = 2
  TELEPHONE = 3
  FAX = 4
  EMAIL = 5
  LOGO = 6
  TERMINAL_ID = 7
  CURRENCY_SYMBOL = 8
  BYPASS_PIN = 9
  DEFAULT_HOME_SCREEN = 10
  PAYMENT_METHOD = 11
  RECEIPT_MESSAGE = 12
  ACCEPTED_CREDIT_CARD_TYPE = 13
  THEME = 14
  DEFAULT_POST_LOGIN_SCREEN = 15
  CLOCK_FORMAT = 16
  TAX_CHARGABLE = 17
  GLOBAL_TAX_RATE = 18
  SERVICE_CHARGE_LABEL = 19
  
  LABEL_MAP = {
    BUSINESS_NAME => "Business Name", 
    ADDRESS => "Address",
    TELEPHONE => "Telephone",
    FAX => "Fax",
    EMAIL => "Email",
    LOGO => "Logo",
    TERMINAL_ID => "Terminal ID",
    CURRENCY_SYMBOL => "Currency Symbol", 
    BYPASS_PIN => "Bypass Pin Number",
    DEFAULT_HOME_SCREEN => "Default Home Screen",
    PAYMENT_METHOD => "Payment Method",
    RECEIPT_MESSAGE => "Receipt Message",
    ACCEPTED_CREDIT_CARD_TYPE => "Accepted Credit Card Type",
    THEME => "Theme",
    DEFAULT_POST_LOGIN_SCREEN => "Post Login Screen", 
    CLOCK_FORMAT => "Clock Format", 
    TAX_CHARGABLE => "Tax Chargable",
    GLOBAL_TAX_RATE => "Global Tax Rate",
    SERVICE_CHARGE_LABEL => "Service Charge Label"
  }
  
  def self.setting_for property, args={}
    @gs = nil
    
    case property.to_i
    when LOGO
      @logo_type = args[:logo_type]
      @gs = find_or_create_by_key(:key => "#{LOGO}_#{@logo_type}", :value => "Not Used For Logo", :label_text => LABEL_MAP[LOGO])
      @gs.parsed_value = @gs.value
    when TERMINAL_ID
      if !args[:fingerprint]
        @gs = nil
      else
        #the key will be the key for terminal id followed by the terminal fingerprint
        @gs = find_or_create_by_key(:key => "#{TERMINAL_ID}_#{args[:fingerprint]}", :value => "Terminal #{Time.now.to_i}", :label_text => LABEL_MAP[TERMINAL_ID])
        @gs.parsed_value = @gs.value
      end
    when CURRENCY_SYMBOL
      @gs = find_or_create_by_key(:key => CURRENCY_SYMBOL, :value => "$", :label_text => LABEL_MAP[CURRENCY_SYMBOL])
      @gs.parsed_value = @gs.value
    when BYPASS_PIN
      @gs = find_or_create_by_key(:key => BYPASS_PIN, :value => "no", :label_text => LABEL_MAP[BYPASS_PIN])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when DEFAULT_HOME_SCREEN
      @gs = find_or_create_by_key(:key => DEFAULT_HOME_SCREEN, :value => 1, :label_text => LABEL_MAP[DEFAULT_HOME_SCREEN])
      @gs.parsed_value = @gs.value.to_i
    when PAYMENT_METHOD
      #the key will be the key for payment type followed by the actual description of that type
      @initial_value = (args[:payment_method] == "cash" ? "yes" : "no")
      @gs = find_or_create_by_key(:key => "#{PAYMENT_METHOD}_#{args[:payment_method]}", :value => @initial_value, :label_text => LABEL_MAP[PAYMENT_METHOD])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when ACCEPTED_CREDIT_CARD_TYPE
      #the key will be the key for payment type followed by the actual description of that type
      @gs = find_or_create_by_key(:key => "#{ACCEPTED_CREDIT_CARD_TYPE}_#{args[:credit_card_type]}", :value => "no", :label_text => LABEL_MAP[ACCEPTED_CREDIT_CARD_TYPE])
      @gs.parsed_value = @gs.value = (@gs.value == "yes" ? true : false)
    when THEME
      #the key will be the key for payment type followed by the actual description of that type
      @gs = find_or_create_by_key(:key => "#{THEME}_#{args[:theme_property]}", :value => nil, :label_text => LABEL_MAP[THEME])
      @gs.parsed_value = @gs.value
    when DEFAULT_POST_LOGIN_SCREEN
      @gs = find_or_create_by_key(:key => DEFAULT_POST_LOGIN_SCREEN, :value => 2, :label_text => LABEL_MAP[DEFAULT_POST_LOGIN_SCREEN])
      @gs.parsed_value = @gs.value.to_i
    when CLOCK_FORMAT
      @gs = find_or_create_by_key(:key => CLOCK_FORMAT, :value => "12", :label_text => LABEL_MAP[CLOCK_FORMAT])
      @gs.parsed_value = @gs.value
    when TAX_CHARGABLE
      @gs = find_or_create_by_key(:key => TAX_CHARGABLE, :value => "no", :label_text => LABEL_MAP[TAX_CHARGABLE])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when GLOBAL_TAX_RATE
      @gs = find_or_create_by_key(:key => GLOBAL_TAX_RATE, :value => 0, :label_text => LABEL_MAP[GLOBAL_TAX_RATE])
      @gs.parsed_value = @gs.value.to_f
    else
      @gs = load_setting property
      @gs.parsed_value = @gs.value
    end
    
    @gs
  end
  
  def prepare_value_for_save
    case key.to_i
    when BYPASS_PIN
      new_value = (value == "true" ? "yes" : "no")
      write_attribute("value", new_value)
    when PAYMENT_METHOD
      new_value = ((value == "true" or value == "yes") ? "yes" : "no")
      write_attribute("value", new_value)
    when ACCEPTED_CREDIT_CARD_TYPE
      new_value = ((value == "1" or value == "yes") ? "yes" : "no")
      write_attribute("value", new_value)
    when LOGO
      #value not used in logo
      new_value = "Not Used For Logo"
      write_attribute("value", new_value)
    when CLOCK_FORMAT
      new_value = ((value == "12") ? "12" : "24")
      write_attribute("value", new_value)
    when TAX_CHARGABLE
      new_value = (value == "true" ? "yes" : "no")
      write_attribute("value", new_value)
    when GLOBAL_TAX_RATE
      new_value = value.to_f
      write_attribute("value", new_value)
    else
    end
  end
  
  #this is just a shortcut method
  def self.parsed_setting_for property, args={}
    setting_for(property, args).try(:parsed_value)
  end
  
  #load a set of strings representing the accepted payment methods
  def self.accepted_payment_methods
    @pms = []
    
    #find all where key begins with PAYMENT_METHOD
    find(:all, :conditions => "global_settings.key like '#{PAYMENT_METHOD}%' and global_settings.value = 'yes'").each do |gs|
      @pm_val_array = gs.key.split('_');
      @pm_val_array.delete_at(0)
      @pm_val = @pm_val_array.join('_')
      @pms << @pm_val;
    end
    
    @pms
  end
  
  #load a set of strings representing the accepted payment methods
  def self.accepted_card_types
    @cts = []
    
    @accepting_cc_cards = parsed_setting_for GlobalSetting::PAYMENT_METHOD, {:payment_method => "credit_card"}
    if !@accepting_cc_cards
      return @cts
    end
    
    #find all where key begins with PAYMENT_METHOD
    find(:all, :conditions => "global_settings.key like '#{ACCEPTED_CREDIT_CARD_TYPE}%' and global_settings.value = 'yes'").each do |gs|
      @ct_val_array = gs.key.split('_');
      @ct_val_array.delete_at(0)
      @ct_val = @ct_val_array.join('_')
      @cts << @ct_val;
    end
    
    @cts
  end
  
  def has_logo?
    return (!logo_file_name.nil? and !logo_file_name.blank?)
  end
  
  private
  
  def self.load_setting property
    @setting = find_or_create_by_key(:key => property, :value => "Not Set", :label_text => LABEL_MAP[property])
    @setting
  end
  
  #these properties are for particular properties in the db
  
  #properties for home screen
  LOGIN_SCREEN = 1
  MENU_SCREEN = 2
  TABLES_SCREEN = 3
  
  #properties for clock
  CLOCK_FORMAT_12 = "12"
  CLOCK_FORMAT_24 = "24"
  
end
