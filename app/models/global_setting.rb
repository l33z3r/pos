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
  CURRENCY_NOTES_IMAGES = 26
  ORDER_RECEIPT_WIDTH = 27
  AUTHENTICATION_REQUIRED = 28
  LOCAL_AUTHENTICATION_REQUIRED = 29
  All_DEVICES_ORDER_NOTIFICATION = 30
  DEFAULT_SERVICE_CHARGE_PERCENT = 31
  TAX_NUMBER = 32
  PRINT_VAT_RECEIPT = 33
  MENU_SCREEN_TYPE = 34
  WINDOWS_PRINTER_MARGINS = 35
  EARLIEST_OPENING_HOUR = 36
  LATEST_CLOSING_HOUR = 37
  BUSINESS_INFO_MESSAGE = 38
  BYPASS_OPEN_ORDERS_FOR_CASH_TOTAL = 39
  ZALION_ROOM_CHARGE_SERVICE_IP = 40
  COURSE_LABEL = 41
  PRINTER_LEFT_MARGIN = 42
  DISABLE_ADVANCED_TOUCH = 43
  HTTP_AUTH_USERNAME = 44
  HTTP_AUTH_PASSWORD = 45
  CASH_DRAWER_IP_ADDRESS = 46
  
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
    WEBSOCKET_IP => "Web Socket IP Address",
    CURRENCY_NOTES_IMAGES => "Currency Notes Images", 
    ORDER_RECEIPT_WIDTH => "Order Receipt Width",
    AUTHENTICATION_REQUIRED => "Authentication Required",
    LOCAL_AUTHENTICATION_REQUIRED => "Local Authentication Required",
    All_DEVICES_ORDER_NOTIFICATION => "All Device Receive Order Notification",
    DEFAULT_SERVICE_CHARGE_PERCENT => "Default Service Charge Percent",
    TAX_NUMBER => "Tax Number",
    PRINT_VAT_RECEIPT => "Print VAT Receipt",
    MENU_SCREEN_TYPE => "Menu Screen Type",
    WINDOWS_PRINTER_MARGINS => "Use Windows Printer Margins",
    EARLIEST_OPENING_HOUR => "Earliest Opening Hour",
    LATEST_CLOSING_HOUR => "Latest Closing Hour",
    BUSINESS_INFO_MESSAGE => "Business Information",
    BYPASS_OPEN_ORDERS_FOR_CASH_TOTAL => "Bypass open orders for z total",
    ZALION_ROOM_CHARGE_SERVICE_IP => "Zalion room charge service ip address",
    COURSE_LABEL => "Course Label", 
    PRINTER_LEFT_MARGIN => "Printer Left Margin",
    DISABLE_ADVANCED_TOUCH => "Disable Advanced Touch",
    HTTP_AUTH_USERNAME => "HTTP Basic Auth Username",
    HTTP_AUTH_PASSWORD => "HTTP Basic Auth Password",
    CASH_DRAWER_IP_ADDRESS => "Cash Drawer Ip Address"
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
      @gs = find_or_create_by_key(:key => "#{WEBSOCKET_IP.to_s}_#{args[:fingerprint]}", :value => "", :label_text => LABEL_MAP[WEBSOCKET_IP])
      @gs.parsed_value = @gs.value
    when CURRENCY_NOTES_IMAGES
      @gs = find_or_create_by_key(:key => CURRENCY_NOTES_IMAGES.to_s, :value => CURRENCY_NOTES_IMAGES_EURO, :label_text => LABEL_MAP[CURRENCY_NOTES_IMAGES])
      @gs.parsed_value = @gs.value
    when ORDER_RECEIPT_WIDTH
      @gs = find_or_create_by_key(:key => "#{ORDER_RECEIPT_WIDTH.to_s}_#{args[:fingerprint]}", :value => ORDER_RECEIPT_WIDTH_80MM, :label_text => LABEL_MAP[ORDER_RECEIPT_WIDTH])
      @gs.parsed_value = @gs.value
    when AUTHENTICATION_REQUIRED
      @gs = find_or_create_by_key(:key => AUTHENTICATION_REQUIRED.to_s, :value => "false", :label_text => LABEL_MAP[AUTHENTICATION_REQUIRED])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when LOCAL_AUTHENTICATION_REQUIRED
      @gs = find_or_create_by_key(:key => LOCAL_AUTHENTICATION_REQUIRED.to_s, :value => "false", :label_text => LABEL_MAP[LOCAL_AUTHENTICATION_REQUIRED])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when All_DEVICES_ORDER_NOTIFICATION
      @gs = find_or_create_by_key(:key => All_DEVICES_ORDER_NOTIFICATION.to_s, :value => "false", :label_text => LABEL_MAP[All_DEVICES_ORDER_NOTIFICATION])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when DEFAULT_SERVICE_CHARGE_PERCENT
      @gs = find_or_create_by_key(:key => DEFAULT_SERVICE_CHARGE_PERCENT.to_s, :value => 0, :label_text => LABEL_MAP[DEFAULT_SERVICE_CHARGE_PERCENT])
      @gs.parsed_value = @gs.value.to_f
    when TAX_NUMBER
      @gs = find_or_create_by_key(:key => TAX_NUMBER.to_s, :value => "", :label_text => LABEL_MAP[TAX_NUMBER])
      @gs.parsed_value = @gs.value
    when PRINT_VAT_RECEIPT
      @gs = find_or_create_by_key(:key => PRINT_VAT_RECEIPT.to_s, :value => "true", :label_text => LABEL_MAP[PRINT_VAT_RECEIPT])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when MENU_SCREEN_TYPE
      @gs = find_or_create_by_key(:key => "#{MENU_SCREEN_TYPE.to_s}_#{args[:fingerprint]}", :value => 1, :label_text => LABEL_MAP[MENU_SCREEN_TYPE])
      @gs.parsed_value = @gs.value.to_i
    when WINDOWS_PRINTER_MARGINS
      @gs = find_or_create_by_key(:key => "#{WINDOWS_PRINTER_MARGINS.to_s}_#{args[:fingerprint]}", :value => "false", :label_text => LABEL_MAP[WINDOWS_PRINTER_MARGINS])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when EARLIEST_OPENING_HOUR
      @gs = find_or_create_by_key(:key => EARLIEST_OPENING_HOUR.to_s, :value => 5, :label_text => LABEL_MAP[EARLIEST_OPENING_HOUR])
      @gs.parsed_value = @gs.value.to_i
    when LATEST_CLOSING_HOUR
      @gs = find_or_create_by_key(:key => LATEST_CLOSING_HOUR.to_s, :value => 5, :label_text => LABEL_MAP[LATEST_CLOSING_HOUR])
      @gs.parsed_value = @gs.value.to_i
    when BYPASS_OPEN_ORDERS_FOR_CASH_TOTAL
      @gs = find_or_create_by_key(:key => "#{BYPASS_OPEN_ORDERS_FOR_CASH_TOTAL.to_s}_#{args[:fingerprint]}", :value => "false", :label_text => LABEL_MAP[BYPASS_OPEN_ORDERS_FOR_CASH_TOTAL])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when ZALION_ROOM_CHARGE_SERVICE_IP
      @gs = find_or_create_by_key(:key => "#{ZALION_ROOM_CHARGE_SERVICE_IP.to_s}", :value => "", :label_text => LABEL_MAP[ZALION_ROOM_CHARGE_SERVICE_IP])
      @gs.parsed_value = @gs.value
    when COURSE_LABEL
      @gs = find_or_create_by_key(:key => "#{COURSE_LABEL.to_s}_#{args[:course_val]}", :value => "Course #{args[:course_val]}", :label_text => LABEL_MAP[COURSE_LABEL])
      @gs.parsed_value = @gs.value
    when PRINTER_LEFT_MARGIN
      @gs = find_or_create_by_key(:key => "#{PRINTER_LEFT_MARGIN.to_s}_#{args[:fingerprint]}", :value => 0, :label_text => LABEL_MAP[PRINTER_LEFT_MARGIN])
      @gs.parsed_value = @gs.value
    when DISABLE_ADVANCED_TOUCH
      @gs = find_or_create_by_key(:key => "#{DISABLE_ADVANCED_TOUCH.to_s}_#{args[:fingerprint]}", :value => "false", :label_text => LABEL_MAP[DISABLE_ADVANCED_TOUCH])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when HTTP_AUTH_USERNAME
      @gs = find_or_create_by_key(:key => HTTP_AUTH_USERNAME.to_s, :value => "cluey", :label_text => LABEL_MAP[HTTP_AUTH_USERNAME])
    when HTTP_AUTH_PASSWORD
      @gs = find_or_create_by_key(:key => HTTP_AUTH_PASSWORD.to_s, :value => "cluey100", :label_text => LABEL_MAP[HTTP_AUTH_PASSWORD])
    when CASH_DRAWER_IP_ADDRESS
      @gs = find_or_create_by_key(:key => "#{CASH_DRAWER_IP_ADDRESS.to_s}_#{args[:fingerprint]}", :value => "", :label_text => LABEL_MAP[CASH_DRAWER_IP_ADDRESS])
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
      new_value = ((value == CLOCK_FORMAT_12) ? CLOCK_FORMAT_12 : CLOCK_FORMAT_24)
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
    when RELOAD_HTML5_CACHE_TIMESTAMP
      new_value = value.to_i
      write_attribute("value", new_value)
    when CURRENCY_NOTES_IMAGES
      new_value = ((value == CURRENCY_NOTES_IMAGES_EURO) ? CURRENCY_NOTES_IMAGES_EURO : CURRENCY_NOTES_IMAGES_STERLING)
      write_attribute("value", new_value)
    when ORDER_RECEIPT_WIDTH
      new_value = ((value == ORDER_RECEIPT_WIDTH_80MM) ? ORDER_RECEIPT_WIDTH_80MM : ORDER_RECEIPT_WIDTH_76MM)
      write_attribute("value", new_value)
    when AUTHENTICATION_REQUIRED
      new_value = (value == "true" ? "yes" : "no")
      write_attribute("value", new_value)
    when LOCAL_AUTHENTICATION_REQUIRED
      new_value = (value == "true" ? "yes" : "no")
      write_attribute("value", new_value)
    when All_DEVICES_ORDER_NOTIFICATION
      new_value = (value == "true" ? "yes" : "no")
      write_attribute("value", new_value)
    when DEFAULT_SERVICE_CHARGE_PERCENT
      #make sure it is a number between 0 and 100
      value_as_num = value.to_f
      
      if value_as_num > 100
        new_value = 100
      elsif value_as_num < 0
        new_value = 0
      else
        new_value = value_as_num
      end
      
      write_attribute("value", new_value)
    when PRINT_VAT_RECEIPT
      new_value = (value == "true" ? "yes" : "no")
      write_attribute("value", new_value)
    else
      #catch the keys that are not only integers and wont get caught in the switch statement
      if key.starts_with? TERMINAL_ID.to_s
        if value_changed?
          @res = GlobalSetting.where("global_settings.key != ?", key).where("global_settings.value = ?", value)
          if @res.size > 0
            #copy the settings over to the new fingerprint
            @old_terminal_gs = @res.first
            @old_fingerprint = @old_terminal_gs.key.split("_").last
            
            #web socket ip
            @websocket_ip_gs = GlobalSetting.setting_for GlobalSetting::WEBSOCKET_IP, {:fingerprint => @old_fingerprint}
            
            @my_terminal_fingerprint = key.split("_").last
            
            @my_websocket_ip_gs = GlobalSetting.setting_for GlobalSetting::WEBSOCKET_IP, {:fingerprint => @my_terminal_fingerprint}
            @my_websocket_ip_gs.value = @websocket_ip_gs.value
            @my_websocket_ip_gs.save

            #cash drawer ip
            @cash_drawer_ip_gs = GlobalSetting.setting_for GlobalSetting::CASH_DRAWER_IP_ADDRESS, {:fingerprint => @old_fingerprint}
            
            @my_cash_drawer_ip_gs = GlobalSetting.setting_for GlobalSetting::CASH_DRAWER_IP_ADDRESS, {:fingerprint => @my_terminal_fingerprint}
            @my_cash_drawer_ip_gs.value = @cash_drawer_ip_gs.value
            @my_cash_drawer_ip_gs.save
              
            #order receipt width
            @order_reciept_width_gs = GlobalSetting.setting_for GlobalSetting::ORDER_RECEIPT_WIDTH, {:fingerprint => @old_fingerprint}
            
            @my_order_reciept_width_gs = GlobalSetting.setting_for GlobalSetting::ORDER_RECEIPT_WIDTH, {:fingerprint => @my_terminal_fingerprint}
            @my_order_reciept_width_gs.value = @order_reciept_width_gs.value
            @my_order_reciept_width_gs.save
            
            #menu screen type
            @menu_screen_type_gs = GlobalSetting.setting_for GlobalSetting::MENU_SCREEN_TYPE, {:fingerprint => @old_fingerprint}
            
            @my_menu_screen_type_gs = GlobalSetting.setting_for GlobalSetting::MENU_SCREEN_TYPE, {:fingerprint => @my_terminal_fingerprint}
            @my_menu_screen_type_gs.value = @menu_screen_type_gs.value
            @my_menu_screen_type_gs.save
            
            #printer left margin
            @printer_left_margin_gs = GlobalSetting.setting_for GlobalSetting::PRINTER_LEFT_MARGIN, {:fingerprint => @old_fingerprint}
            
            @my_printer_left_margin_gs = GlobalSetting.setting_for GlobalSetting::PRINTER_LEFT_MARGIN, {:fingerprint => @my_terminal_fingerprint}
            @my_printer_left_margin_gs.value = @printer_left_margin_gs.value
            @my_printer_left_margin_gs.save
            
            #disable advanced touch
            @disable_advanced_touch_gs = GlobalSetting.setting_for GlobalSetting::DISABLE_ADVANCED_TOUCH, {:fingerprint => @old_fingerprint}
            
            @my_disable_advanced_touch_gs = GlobalSetting.setting_for GlobalSetting::DISABLE_ADVANCED_TOUCH, {:fingerprint => @my_terminal_fingerprint}
            @my_disable_advanced_touch_gs.value = @disable_advanced_touch_gs.value
            @my_disable_advanced_touch_gs.save
            
            #delete old gs objects
            @websocket_ip_gs.destroy
            @cash_drawer_ip_gs.destroy
            @order_reciept_width_gs.destroy
            @old_terminal_gs.destroy
            @menu_screen_type_gs.destroy
            @printer_left_margin_gs.destroy
            @disable_advanced_touch_gs.destroy
          end
        end
        if value
          new_value = (value ? value.gsub(" ", "").gsub("'", "").gsub("\"", "") : nil)
          write_attribute("value", new_value)
        end
      elsif key.starts_with? WINDOWS_PRINTER_MARGINS.to_s
        new_value = (value == "true" ? "yes" : "no")
        write_attribute("value", new_value)
      elsif key.starts_with? BYPASS_OPEN_ORDERS_FOR_CASH_TOTAL.to_s
        new_value = (value == "true" ? "yes" : "no")
        write_attribute("value", new_value)
      elsif key.starts_with? PRINTER_LEFT_MARGIN.to_s
        new_value = value.to_i
        write_attribute("value", new_value)
      elsif key.starts_with? DISABLE_ADVANCED_TOUCH.to_s
        new_value = (value == "true" ? "yes" : "no")
        write_attribute("value", new_value)
      end
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
  
  def self.course_vals
    return 1..7
  end
  
  def self.course_options
    @options = [["None", -1]]
    
    course_vals.each do |val|
      @options << [GlobalSetting.parsed_setting_for(GlobalSetting::COURSE_LABEL, {:course_val => val}), val]
    end
    
    @options
  end
  
  #these properties are for particular properties in the db
  
  #properties for home screen
  LOGIN_SCREEN = 1
  MENU_SCREEN = 2
  TABLES_SCREEN = 3
  
  #properties for clock
  CLOCK_FORMAT_12 = "12"
  CLOCK_FORMAT_24 = "24"
  
  #properties for currency notes images
  CURRENCY_NOTES_IMAGES_EURO = "euro"
  CURRENCY_NOTES_IMAGES_STERLING = "sterling"
  
  #settings for order receipt width
  ORDER_RECEIPT_WIDTH_80MM = "80mm"
  ORDER_RECEIPT_WIDTH_76MM = "76mm"
  
  #properties for menu screen type
  RESTAURANT_MENU_SCREEN = 1
  RETAIL_MENU_SCREEN = 2
end
