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
  
  has_attached_file :logo, PAPERCLIP_STORAGE_OPTIONS.merge(:styles => {:large => "400x400", :medium => "300x300>", :thumb => "115x115>" })
  
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
  AUTO_PRINT_RECEIPT = 11
  RECEIPT_MESSAGE = 12
  SMALL_CURRENCY_SYMBOL = 13
  THEME = 14
  DEFAULT_POST_LOGIN_SCREEN = 15
  CLOCK_FORMAT = 16
  TAX_CHARGABLE = 17
  GLOBAL_TAX_RATE = 18
  SERVICE_CHARGE_LABEL = 19
  CASH_TOTAL_OPTION = 20
  TAX_LABEL = 21
  DO_BEEP = 22
  LAST_ORDER_ID = 23
  RELOAD_HTML5_CACHE_TIMESTAMP = 24
  WEBSOCKET_IP = 25
  
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
    AUTO_PRINT_RECEIPT => "Auto Print Receipt",
    RECEIPT_MESSAGE => "Receipt Message",
    SMALL_CURRENCY_SYMBOL => "Small Currency Symbol",
    THEME => "Theme",
    DEFAULT_POST_LOGIN_SCREEN => "Post Login Screen", 
    CLOCK_FORMAT => "Clock Format", 
    TAX_CHARGABLE => "Tax Chargable",
    GLOBAL_TAX_RATE => "Global Tax Rate",
    SERVICE_CHARGE_LABEL => "Service Charge Label", 
    CASH_TOTAL_OPTION => "Cash Total Option",
    TAX_LABEL => "Tax Label",
    DO_BEEP => "Do Beep",
    LAST_ORDER_ID => "Last Order ID", 
    RELOAD_HTML5_CACHE_TIMESTAMP => "HTML5 Cache Reload Timestamp",
    WEBSOCKET_IP => "Web Socket Ip Adress"
  }
  
  LATEST_TERMINAL_HOURS = 24
  
  def self.setting_for property, args={}
    @gs = nil
    
    case property.to_i
    when LOGO
      @logo_type = args[:logo_type]
      @gs = find_or_create_by_key(:key => "#{LOGO.to_s}_#{@logo_type}", :value => "Not Used For Logo", :label_text => LABEL_MAP[LOGO])
      @gs.parsed_value = @gs.value
    when TERMINAL_ID
      if !args[:fingerprint]
        @gs = nil
      else
        #the key will be the key for terminal id followed by the terminal fingerprint
        @gs = find_or_create_by_key(:key => "#{TERMINAL_ID.to_s}_#{args[:fingerprint]}", :value => "NT##{Time.now.to_i.to_s[-4,4]}", :label_text => LABEL_MAP[TERMINAL_ID])
        @gs.parsed_value = @gs.value
      end
    when CURRENCY_SYMBOL
      @gs = find_or_create_by_key(:key => CURRENCY_SYMBOL.to_s, :value => "$", :label_text => LABEL_MAP[CURRENCY_SYMBOL])
      @gs.parsed_value = @gs.value
    when BYPASS_PIN
      @gs = find_or_create_by_key(:key => BYPASS_PIN.to_s, :value => "false", :label_text => LABEL_MAP[BYPASS_PIN])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when DEFAULT_HOME_SCREEN
      @gs = find_or_create_by_key(:key => DEFAULT_HOME_SCREEN.to_s, :value => 1, :label_text => LABEL_MAP[DEFAULT_HOME_SCREEN])
      @gs.parsed_value = @gs.value.to_i
    when AUTO_PRINT_RECEIPT
      @gs = find_or_create_by_key(:key => AUTO_PRINT_RECEIPT.to_s, :value => "false", :label_text => LABEL_MAP[AUTO_PRINT_RECEIPT])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when SMALL_CURRENCY_SYMBOL
      @gs = find_or_create_by_key(:key => SMALL_CURRENCY_SYMBOL.to_s, :value => "c", :label_text => LABEL_MAP[SMALL_CURRENCY_SYMBOL])
      @gs.parsed_value = @gs.value
    when THEME
      #the key will be the key for payment type followed by the actual description of that type
      @gs = find_or_create_by_key(:key => "#{THEME.to_s}_#{args[:theme_property]}", :value => nil, :label_text => LABEL_MAP[THEME])
      @gs.parsed_value = @gs.value
    when DEFAULT_POST_LOGIN_SCREEN
      @gs = find_or_create_by_key(:key => DEFAULT_POST_LOGIN_SCREEN.to_s, :value => 2, :label_text => LABEL_MAP[DEFAULT_POST_LOGIN_SCREEN])
      @gs.parsed_value = @gs.value.to_i
    when CLOCK_FORMAT
      @gs = find_or_create_by_key(:key => CLOCK_FORMAT.to_s, :value => "12", :label_text => LABEL_MAP[CLOCK_FORMAT])
      @gs.parsed_value = @gs.value
    when TAX_CHARGABLE
      @gs = find_or_create_by_key(:key => TAX_CHARGABLE.to_s, :value => "false", :label_text => LABEL_MAP[TAX_CHARGABLE])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when GLOBAL_TAX_RATE
      @gs = find_or_create_by_key(:key => GLOBAL_TAX_RATE.to_s, :value => 0, :label_text => LABEL_MAP[GLOBAL_TAX_RATE])
      @gs.parsed_value = @gs.value.to_f
    when CASH_TOTAL_OPTION
      @gs = find_or_create_by_key(:key => "#{CASH_TOTAL_OPTION.to_s}_#{args[:total_type]}_#{args[:employee_role]}_#{args[:report_section]}", :value => "true", :label_text => LABEL_MAP[CASH_TOTAL_OPTION])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when TAX_LABEL
      @gs = find_or_create_by_key(:key => TAX_LABEL.to_s, :value => "Tax", :label_text => LABEL_MAP[TAX_LABEL])
      @gs.parsed_value = @gs.value
    when DO_BEEP
      @gs = find_or_create_by_key(:key => DO_BEEP.to_s, :value => "false", :label_text => LABEL_MAP[DO_BEEP])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when RELOAD_HTML5_CACHE_TIMESTAMP
      @gs = find_or_create_by_key(:key => RELOAD_HTML5_CACHE_TIMESTAMP.to_s, :value => 0, :label_text => LABEL_MAP[RELOAD_HTML5_CACHE_TIMESTAMP])
      @gs.parsed_value = @gs.value.to_f
    when WEBSOCKET_IP
      @gs = find_or_create_by_key(:key => "#{WEBSOCKET_IP.to_s}_#{args[:terminal_fingerprint]}", :value => "127.0.0.1", :label_text => LABEL_MAP[WEBSOCKET_IP])
      @gs.parsed_value = @gs.value
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
    when LOGO
      #value not used in logo
      new_value = "Not Used For Logo"
      write_attribute("value", new_value)
    when AUTO_PRINT_RECEIPT
      new_value = (value == "true" ? "yes" : "no")
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
    when CASH_TOTAL_OPTION
      new_value = (value == "true" ? "yes" : "no")
      write_attribute("value", new_value)
    when DO_BEEP
      new_value = (value == "true" ? "yes" : "no")
      write_attribute("value", new_value)
    when TERMINAL_ID
      if value_changed?
        @res = GlobalSetting.where("global_settings.key != ?", key).where("global_settings.value = ?", value)
        if @res.size > 0
          #conflict, delete the old one
          @res.first.destroy
        end
      end
    when RELOAD_HTML5_CACHE_TIMESTAMP
      new_value = value.to_i
      write_attribute("value", new_value)
    else
    end
  end
  
  #this is just a shortcut method
  def self.parsed_setting_for property, args={}
    setting_for(property, args).try(:parsed_value)
  end
  
  def has_logo?
    return (!logo_file_name.nil? and !logo_file_name.blank?)
  end
  
  private
  
  def self.load_setting property
    @setting = find_or_create_by_key(:key => property.to_s, :value => "Not Set", :label_text => LABEL_MAP[property])
    @setting
  end
  
  def self.default_date_format
    @clockFormat = GlobalSetting.parsed_setting_for GlobalSetting::CLOCK_FORMAT
    
    if @clockFormat == "12"
      @defaultDateFormat = "%I:%M %d/%m/%Y"
    else
      @defaultDateFormat = "%H:%M %d/%m/%Y"
    end
    
    return @defaultDateFormat
  end
  
  def self.all_terminals
    where("global_settings.key like ?", "#{TERMINAL_ID}%").where("global_settings.value not like ?", "NT%").collect(&:value).uniq
  end
  
  def self.latest_terminals
    where("global_settings.key like ?", "#{TERMINAL_ID}%")
    .where("global_settings.value not like ?", "NT%")
    .where("updated_at > ?", LATEST_TERMINAL_HOURS.hours.ago)
    .collect(&:value).uniq
  end
  
  def self.older_terminals
    where("global_settings.key like ?", "#{TERMINAL_ID}%")
    .where("global_settings.value not like ?", "NT%")
    .where("updated_at <= ?", LATEST_TERMINAL_HOURS.hours.ago)
    .collect(&:value).uniq
  end
  
  def self.remove_all_terminal_ids
    where("global_settings.key like ?", "#{TERMINAL_ID}%").each(&:destroy)
  end
  
  def self.next_order_number
    @gs = find_or_create_by_key(:key => LAST_ORDER_ID.to_s, :value => 0, :label_text => LABEL_MAP[LAST_ORDER_ID])
    @gs.save!
    
    @gs.reload
    
    @gs.value = @gs.value.to_i + 1
    @gs.save!
    
    @gs.value
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
