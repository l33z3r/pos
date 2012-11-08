  class GlobalSetting < ActiveRecord::Base
  
  belongs_to :outlet
  
  before_save :prepare_value_for_save
  
  has_attached_file :logo, PAPERCLIP_STORAGE_OPTIONS.merge(:styles => {:large => "400x400", :medium => "300x300>", :thumb => "115x115>" })
  
  validates :key, :presence => true
  
  
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
  
  #this is the printer ip
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
  PRICE_LEVEL_LABEL = 47
  USE_WHITE_SPACE_MOBILE_MENUS = 48
  USE_WHITE_SPACE_DESKTOP_MENUS = 49
  SHOW_LICENCE_EXPIRED_SCREEN = 50 
  CREDIT_CARD_CHARGE_SERVICE_IP = 51
  CREDIT_CARD_TERMINAL_IP = 52
  CREDIT_CARD_TERMINAL_PORT = 53
  POLLING_INTERVAL_SECONDS = 54
  PROCESS_TABLE_0_ORDERS = 55
  LOYALTY_CARD_PREFIX = 56
  ENABLE_LOYALTY_REDEMPTION = 57
  LOYALTY_POINTS_PER_CURRENCY_UNIT = 58
  USE_WSS_CASH_DRAWER = 59
  USE_WSS_RECEIPT_PRINTER = 60
  HALF_MEASURE_LABEL = 61
  SHOW_CHARGE_CARD_BUTTON = 62
  ALLOW_ZALION_SPLIT_PAYMENTS = 63
  SCREEN_RESOLUTION = 64
  PM_SHORTCUT_ID = 65
  PROMPT_FOR_COVERS = 66
  DEDUCT_STOCK_DURING_TRAINING_MODE = 67
  WORK_REPORT_OPTION = 68
  WORK_REPORT_FOOTER_TEXT = 69
  PRINT_WORK_REPORT = 70
  TIMEKEEPING_TERMINAL = 71
  ALLOW_REOPEN_ORDER_AFTER_Z = 72
  PRINT_LOCAL_RECIEVE_DELIVERY = 73
  CASH_DRAWER_COM_PORT = 74
  CASH_DRAWER_CODE = 75
  LOCAL_PRINTER_ID = 76
  PRINT_DELEGATE_TERMINAL_ID = 77
  OFFLINE_ORDER_DELEGATE_TERMINAL_ID = 78
  
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
    CASH_DRAWER_IP_ADDRESS => "Cash Drawer Ip Address",
    PRICE_LEVEL_LABEL => "Price Level Label",
    USE_WHITE_SPACE_MOBILE_MENUS => "Use White Space Mobile Menus",
    USE_WHITE_SPACE_DESKTOP_MENUS => "Use White Space Desktop Menus",
    SHOW_LICENCE_EXPIRED_SCREEN => "Show Licence Expired Screen",
    CREDIT_CARD_CHARGE_SERVICE_IP => "Credit Card Charge Service IP",
    CREDIT_CARD_TERMINAL_IP => "Credit Card Terminal IP",
    CREDIT_CARD_TERMINAL_PORT => "Credit Card Terminal Port",
    POLLING_INTERVAL_SECONDS => "Polling Amount Seconds",
    PROCESS_TABLE_0_ORDERS => "Process Table 0 Orders",
    LOYALTY_CARD_PREFIX => "Loyalty Card Prefix",
    ENABLE_LOYALTY_REDEMPTION => "Enable Loyalty Redemption",
    LOYALTY_POINTS_PER_CURRENCY_UNIT => "Loyalty Points Per Currency Unit",
    USE_WSS_CASH_DRAWER => "Use Web Sockets For Cash Drawer",
    USE_WSS_RECEIPT_PRINTER => "Use Web Sockets For Receipt Printing",
    HALF_MEASURE_LABEL => "Half Measure Label",
    SHOW_CHARGE_CARD_BUTTON => "Show Charge Card",
    ALLOW_ZALION_SPLIT_PAYMENTS => "Allow Zalion Split Payments",
    SCREEN_RESOLUTION => "Screen Resolution",
    PM_SHORTCUT_ID => "Payment Method Shortcut ID",
    PROMPT_FOR_COVERS => "Prompt For Covers",
    DEDUCT_STOCK_DURING_TRAINING_MODE => "Deduct Stock In Training Mode",
    WORK_REPORT_OPTION => "Work Report Option",
    WORK_REPORT_FOOTER_TEXT => "Work Report Footer Text",
    PRINT_WORK_REPORT => "Print Work Report",
    TIMEKEEPING_TERMINAL => "Timekeeping Terminal",
    ALLOW_REOPEN_ORDER_AFTER_Z => "Allow Reopening Of Orders After a Z Total", 
    PRINT_LOCAL_RECIEVE_DELIVERY => "Print Delivery Receipts Locally on Terminal Rather Than to Print Service", 
    CASH_DRAWER_COM_PORT => "Cash Drawer Com Port",
    CASH_DRAWER_CODE => "Cash Drawer Code",
    LOCAL_PRINTER_ID => "Local Printer ID",
    PRINT_DELEGATE_TERMINAL_ID => "Print Delegate Terminal ID",
    OFFLINE_ORDER_DELEGATE_TERMINAL_ID => "Offline Order Delegate Terminal ID"
  }
  
  LATEST_TERMINAL_HOURS = 24
  
  def self.setting_for property, current_outlet, args={}
    @gs = nil
    
    case property.to_i
    when LOGO
      @logo_type = args[:logo_type]
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => "#{LOGO.to_s}_#{@logo_type}", :value => "Not Used For Logo", :label_text => LABEL_MAP[LOGO])
      @gs.parsed_value = @gs.value
    when TERMINAL_ID
      if !args[:fingerprint]
        @gs = nil
      else
        #the key will be the key for terminal id followed by the terminal fingerprint
        GlobalSetting.transaction do
          @gs = find_by_outlet_id_and_key(current_outlet.id, "#{TERMINAL_ID.to_s}_#{args[:fingerprint]}", :lock => true)
	  
          if !@gs
            @gs = create(:outlet_id => current_outlet.id, :key => "#{TERMINAL_ID.to_s}_#{args[:fingerprint]}", :value => "NT##{Time.now.to_i.to_s[-4,4]}", :label_text => LABEL_MAP[TERMINAL_ID])
          end
	  
          @gs.parsed_value = @gs.value
        end
      end
    when CURRENCY_SYMBOL
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => CURRENCY_SYMBOL.to_s, :value => "$", :label_text => LABEL_MAP[CURRENCY_SYMBOL])
      @gs.parsed_value = @gs.value
    when BYPASS_PIN
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => BYPASS_PIN.to_s, :value => "false", :label_text => LABEL_MAP[BYPASS_PIN])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when DEFAULT_HOME_SCREEN
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => "#{DEFAULT_HOME_SCREEN.to_s}_#{args[:fingerprint]}", :value => 1, :label_text => LABEL_MAP[DEFAULT_HOME_SCREEN])
      @gs.parsed_value = @gs.value.to_i
    when AUTO_PRINT_RECEIPT
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => AUTO_PRINT_RECEIPT.to_s, :value => "false", :label_text => LABEL_MAP[AUTO_PRINT_RECEIPT])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when SMALL_CURRENCY_SYMBOL
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => SMALL_CURRENCY_SYMBOL.to_s, :value => "c", :label_text => LABEL_MAP[SMALL_CURRENCY_SYMBOL])
      @gs.parsed_value = @gs.value
    when THEME
      #the key will be the key for payment type followed by the actual description of that type
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => "#{THEME.to_s}_#{args[:theme_property]}", :value => nil, :label_text => LABEL_MAP[THEME])
      @gs.parsed_value = @gs.value
    when DEFAULT_POST_LOGIN_SCREEN
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => DEFAULT_POST_LOGIN_SCREEN.to_s, :value => 2, :label_text => LABEL_MAP[DEFAULT_POST_LOGIN_SCREEN])
      @gs.parsed_value = @gs.value.to_i
    when CLOCK_FORMAT
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => CLOCK_FORMAT.to_s, :value => "12", :label_text => LABEL_MAP[CLOCK_FORMAT])
      @gs.parsed_value = @gs.value
    when TAX_CHARGABLE
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => TAX_CHARGABLE.to_s, :value => "false", :label_text => LABEL_MAP[TAX_CHARGABLE])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when GLOBAL_TAX_RATE
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => GLOBAL_TAX_RATE.to_s, :value => 0, :label_text => LABEL_MAP[GLOBAL_TAX_RATE])
      @gs.parsed_value = @gs.value.to_f
    when CASH_TOTAL_OPTION
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => "#{CASH_TOTAL_OPTION.to_s}_#{args[:total_type]}_#{args[:employee_role]}_#{args[:report_section]}", :value => "true", :label_text => LABEL_MAP[CASH_TOTAL_OPTION])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when TAX_LABEL
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => TAX_LABEL.to_s, :value => "Tax", :label_text => LABEL_MAP[TAX_LABEL])
      @gs.parsed_value = @gs.value
    when DO_BEEP
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => "#{DO_BEEP.to_s}_#{args[:fingerprint]}", :value => "false", :label_text => LABEL_MAP[DO_BEEP])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when RELOAD_HTML5_CACHE_TIMESTAMP
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => RELOAD_HTML5_CACHE_TIMESTAMP.to_s, :value => 0, :label_text => LABEL_MAP[RELOAD_HTML5_CACHE_TIMESTAMP])
      @gs.parsed_value = @gs.value.to_f
    when WEBSOCKET_IP
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => "#{WEBSOCKET_IP.to_s}_#{args[:fingerprint]}", :value => "", :label_text => LABEL_MAP[WEBSOCKET_IP])
      @gs.parsed_value = @gs.value
    when CURRENCY_NOTES_IMAGES
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => CURRENCY_NOTES_IMAGES.to_s, :value => CURRENCY_NOTES_IMAGES_EURO, :label_text => LABEL_MAP[CURRENCY_NOTES_IMAGES])
      @gs.parsed_value = @gs.value
    when ORDER_RECEIPT_WIDTH
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => "#{ORDER_RECEIPT_WIDTH.to_s}_#{args[:fingerprint]}", :value => ORDER_RECEIPT_WIDTH_80MM, :label_text => LABEL_MAP[ORDER_RECEIPT_WIDTH])
      @gs.parsed_value = @gs.value
    when AUTHENTICATION_REQUIRED
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => AUTHENTICATION_REQUIRED.to_s, :value => "false", :label_text => LABEL_MAP[AUTHENTICATION_REQUIRED])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when LOCAL_AUTHENTICATION_REQUIRED
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => LOCAL_AUTHENTICATION_REQUIRED.to_s, :value => "false", :label_text => LABEL_MAP[LOCAL_AUTHENTICATION_REQUIRED])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when All_DEVICES_ORDER_NOTIFICATION
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => All_DEVICES_ORDER_NOTIFICATION.to_s, :value => "false", :label_text => LABEL_MAP[All_DEVICES_ORDER_NOTIFICATION])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when DEFAULT_SERVICE_CHARGE_PERCENT
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => DEFAULT_SERVICE_CHARGE_PERCENT.to_s, :value => 0, :label_text => LABEL_MAP[DEFAULT_SERVICE_CHARGE_PERCENT])
      @gs.parsed_value = @gs.value.to_f
    when TAX_NUMBER
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => TAX_NUMBER.to_s, :value => "", :label_text => LABEL_MAP[TAX_NUMBER])
      @gs.parsed_value = @gs.value
    when PRINT_VAT_RECEIPT
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => PRINT_VAT_RECEIPT.to_s, :value => "true", :label_text => LABEL_MAP[PRINT_VAT_RECEIPT])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when MENU_SCREEN_TYPE
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => "#{MENU_SCREEN_TYPE.to_s}_#{args[:fingerprint]}", :value => 1, :label_text => LABEL_MAP[MENU_SCREEN_TYPE])
      @gs.parsed_value = @gs.value.to_i
    when WINDOWS_PRINTER_MARGINS
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => "#{WINDOWS_PRINTER_MARGINS.to_s}_#{args[:fingerprint]}", :value => "false", :label_text => LABEL_MAP[WINDOWS_PRINTER_MARGINS])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when EARLIEST_OPENING_HOUR
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => EARLIEST_OPENING_HOUR.to_s, :value => 5, :label_text => LABEL_MAP[EARLIEST_OPENING_HOUR])
      @gs.parsed_value = @gs.value.to_i
    when LATEST_CLOSING_HOUR
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => LATEST_CLOSING_HOUR.to_s, :value => 5, :label_text => LABEL_MAP[LATEST_CLOSING_HOUR])
      @gs.parsed_value = @gs.value.to_i
    when BYPASS_OPEN_ORDERS_FOR_CASH_TOTAL
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => "#{BYPASS_OPEN_ORDERS_FOR_CASH_TOTAL.to_s}_#{args[:fingerprint]}", :value => "false", :label_text => LABEL_MAP[BYPASS_OPEN_ORDERS_FOR_CASH_TOTAL])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when ZALION_ROOM_CHARGE_SERVICE_IP
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => "#{ZALION_ROOM_CHARGE_SERVICE_IP.to_s}", :value => "", :label_text => LABEL_MAP[ZALION_ROOM_CHARGE_SERVICE_IP])
      @gs.parsed_value = @gs.value
    when COURSE_LABEL
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => "#{COURSE_LABEL.to_s}_#{args[:course_val]}", :value => "Course #{args[:course_val]}", :label_text => LABEL_MAP[COURSE_LABEL])
      @gs.parsed_value = @gs.value
    when PRINTER_LEFT_MARGIN
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => "#{PRINTER_LEFT_MARGIN.to_s}_#{args[:fingerprint]}", :value => 0, :label_text => LABEL_MAP[PRINTER_LEFT_MARGIN])
      @gs.parsed_value = @gs.value
    when DISABLE_ADVANCED_TOUCH
      
      # Base the advanced touch on the user agent if it is not set explicitly
      # we want to default the ipads and mobile devices to use the touch and to disable it for desktop
      
      # SAMPLE USER AGENTS:
      #desktop ua: Mozilla/5.0 (X11; Linux i686) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/14.0.835.186 Safari/535.1
      #android mobile ua: Mozilla/5.0 (Linux; U; Android 2.3.5; en-gb; GT-I9100 Build/GINGERBREAD) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1
      #ipad ua using atomic: Mozilla/5.0 (iPad; CPU OS 5_0_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/9A405
      #ipad ua using kiosk: Mozilla/5.0 (iPad; U; CPU OS 5_0_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A405 Safari/7534.48.3
      
      @test_for_chrome = "Chrome"
      @test_for_firefox = "Mozilla"
      @test_for_android = "Android"
      @test_for_ipad = "iPad"
      
      @user_agent = args[:user_agent]
      @default_disable_advanced_touch = (@user_agent.include?(@test_for_chrome) or @user_agent.include?(@test_for_firefox)) and !@user_agent.include?(@test_for_android) and !@user_agent.include?(@test_for_ipad)
      
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => "#{DISABLE_ADVANCED_TOUCH.to_s}_#{args[:fingerprint]}", :value => "#{@default_disable_advanced_touch}", :label_text => LABEL_MAP[DISABLE_ADVANCED_TOUCH])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when HTTP_AUTH_USERNAME
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => HTTP_AUTH_USERNAME.to_s, :value => "cluey", :label_text => LABEL_MAP[HTTP_AUTH_USERNAME])
      @gs.parsed_value = @gs.value
    when HTTP_AUTH_PASSWORD
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => HTTP_AUTH_PASSWORD.to_s, :value => "cluey100", :label_text => LABEL_MAP[HTTP_AUTH_PASSWORD])
      @gs.parsed_value = @gs.value
    when CASH_DRAWER_IP_ADDRESS
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => "#{CASH_DRAWER_IP_ADDRESS.to_s}_#{args[:fingerprint]}", :value => "", :label_text => LABEL_MAP[CASH_DRAWER_IP_ADDRESS])
      @gs.parsed_value = @gs.value
    when PRICE_LEVEL_LABEL
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => "#{PRICE_LEVEL_LABEL.to_s}_#{args[:price_level]}", :value => "Price #{args[:price_level]}", :label_text => LABEL_MAP[PRICE_LEVEL_LABEL])
      @gs.parsed_value = @gs.value
    when USE_WHITE_SPACE_MOBILE_MENUS
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => USE_WHITE_SPACE_MOBILE_MENUS.to_s, :value => "false", :label_text => LABEL_MAP[USE_WHITE_SPACE_MOBILE_MENUS])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when USE_WHITE_SPACE_DESKTOP_MENUS
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => USE_WHITE_SPACE_DESKTOP_MENUS.to_s, :value => "true", :label_text => LABEL_MAP[USE_WHITE_SPACE_DESKTOP_MENUS])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when SHOW_LICENCE_EXPIRED_SCREEN
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => SHOW_LICENCE_EXPIRED_SCREEN.to_s, :value => "false", :label_text => LABEL_MAP[SHOW_LICENCE_EXPIRED_SCREEN])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when CREDIT_CARD_CHARGE_SERVICE_IP
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => "#{CREDIT_CARD_CHARGE_SERVICE_IP.to_s}_#{args[:fingerprint]}", :value => "", :label_text => LABEL_MAP[CREDIT_CARD_CHARGE_SERVICE_IP])
      @gs.parsed_value = @gs.value
    when CREDIT_CARD_TERMINAL_IP
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => "#{CREDIT_CARD_TERMINAL_IP.to_s}_#{args[:fingerprint]}", :value => "", :label_text => LABEL_MAP[CREDIT_CARD_TERMINAL_IP])
      @gs.parsed_value = @gs.value
    when CREDIT_CARD_TERMINAL_PORT
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => "#{CREDIT_CARD_TERMINAL_PORT.to_s}_#{args[:fingerprint]}", :value => "25000", :label_text => LABEL_MAP[CREDIT_CARD_TERMINAL_PORT])
      @gs.parsed_value = @gs.value.to_i
    when POLLING_INTERVAL_SECONDS
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => "#{POLLING_INTERVAL_SECONDS.to_s}", :value => 20, :label_text => LABEL_MAP[POLLING_INTERVAL_SECONDS])
      @gs.parsed_value = @gs.value.to_i
    when PROCESS_TABLE_0_ORDERS
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => PROCESS_TABLE_0_ORDERS.to_s, :value => "true", :label_text => LABEL_MAP[PROCESS_TABLE_0_ORDERS])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when LOYALTY_CARD_PREFIX
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => LOYALTY_CARD_PREFIX.to_s, :value => "%ICR", :label_text => LABEL_MAP[LOYALTY_CARD_PREFIX])
      @gs.parsed_value = @gs.value
    when ENABLE_LOYALTY_REDEMPTION
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => ENABLE_LOYALTY_REDEMPTION.to_s, :value => "true", :label_text => LABEL_MAP[ENABLE_LOYALTY_REDEMPTION])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when LOYALTY_POINTS_PER_CURRENCY_UNIT
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => "#{LOYALTY_POINTS_PER_CURRENCY_UNIT.to_s}", :value => 100, :label_text => LABEL_MAP[LOYALTY_POINTS_PER_CURRENCY_UNIT])
      @gs.parsed_value = @gs.value.to_i
    when USE_WSS_CASH_DRAWER
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => "#{USE_WSS_CASH_DRAWER.to_s}_#{args[:fingerprint]}", :value => "false", :label_text => LABEL_MAP[USE_WSS_CASH_DRAWER])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when USE_WSS_RECEIPT_PRINTER
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => "#{USE_WSS_RECEIPT_PRINTER.to_s}_#{args[:fingerprint]}", :value => "false", :label_text => LABEL_MAP[USE_WSS_RECEIPT_PRINTER])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when HALF_MEASURE_LABEL
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => HALF_MEASURE_LABEL.to_s, :value => "Half", :label_text => LABEL_MAP[HALF_MEASURE_LABEL])
      @gs.parsed_value = @gs.value
    when SHOW_CHARGE_CARD_BUTTON
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => SHOW_CHARGE_CARD_BUTTON.to_s, :value => "true", :label_text => LABEL_MAP[SHOW_CHARGE_CARD_BUTTON])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when ALLOW_ZALION_SPLIT_PAYMENTS
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => ALLOW_ZALION_SPLIT_PAYMENTS.to_s, :value => "false", :label_text => LABEL_MAP[ALLOW_ZALION_SPLIT_PAYMENTS])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when SCREEN_RESOLUTION
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => "#{SCREEN_RESOLUTION.to_s}_#{args[:fingerprint]}", :value => SCREEN_RESOLUTION_NORMAL, :label_text => LABEL_MAP[SCREEN_RESOLUTION])
      @gs.parsed_value = @gs.value
    when PM_SHORTCUT_ID
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => "#{PM_SHORTCUT_ID.to_s}_#{args[:shortcut_num]}", :value => PaymentMethod.load_default(current_outlet).id, :label_text => LABEL_MAP[PM_SHORTCUT_ID])
      @gs.parsed_value = @gs.value.to_i
    when PROMPT_FOR_COVERS
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => PROMPT_FOR_COVERS.to_s, :value => "false", :label_text => LABEL_MAP[PROMPT_FOR_COVERS])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when DEDUCT_STOCK_DURING_TRAINING_MODE
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => DEDUCT_STOCK_DURING_TRAINING_MODE.to_s, :value => "false", :label_text => LABEL_MAP[DEDUCT_STOCK_DURING_TRAINING_MODE])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when WORK_REPORT_OPTION
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => "#{WORK_REPORT_OPTION.to_s}_#{args[:report_section]}", :value => "true", :label_text => LABEL_MAP[WORK_REPORT_OPTION])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when WORK_REPORT_FOOTER_TEXT
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => WORK_REPORT_FOOTER_TEXT.to_s, :value => "Please Retain For Records Or Disputes", :label_text => LABEL_MAP[WORK_REPORT_FOOTER_TEXT])
      @gs.parsed_value = @gs.value
    when PRINT_WORK_REPORT
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => PRINT_WORK_REPORT.to_s, :value => "false", :label_text => LABEL_MAP[PRINT_WORK_REPORT])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)    
    when TIMEKEEPING_TERMINAL
      
      if GlobalSetting.all_terminals(current_outlet).length > 0
	@timekeeping_terminal = GlobalSetting.all_terminals(current_outlet).first
      else 
	@timekeeping_terminal = ""
      end
      
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => TIMEKEEPING_TERMINAL.to_s, :value => @timekeeping_terminal, :label_text => LABEL_MAP[TIMEKEEPING_TERMINAL])
      @gs.parsed_value = @gs.value
    when ALLOW_REOPEN_ORDER_AFTER_Z
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => ALLOW_REOPEN_ORDER_AFTER_Z.to_s, :value => "false", :label_text => LABEL_MAP[ALLOW_REOPEN_ORDER_AFTER_Z])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when PRINT_LOCAL_RECIEVE_DELIVERY
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => "#{PRINT_LOCAL_RECIEVE_DELIVERY.to_s}_#{args[:fingerprint]}", :value => "false", :label_text => LABEL_MAP[PRINT_LOCAL_RECIEVE_DELIVERY])
      @gs.parsed_value = (@gs.value == "yes" ? true : false)
    when CASH_DRAWER_COM_PORT
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => "#{CASH_DRAWER_COM_PORT.to_s}_#{args[:fingerprint]}", :value => "COM1", :label_text => LABEL_MAP[CASH_DRAWER_COM_PORT])
      @gs.parsed_value = @gs.value
    when CASH_DRAWER_CODE
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => "#{CASH_DRAWER_CODE.to_s}_#{args[:fingerprint]}", :value => "27,112,48,48,48", :label_text => LABEL_MAP[CASH_DRAWER_CODE])
      @gs.parsed_value = @gs.value
    when LOCAL_PRINTER_ID
      @gs = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => "#{LOCAL_PRINTER_ID.to_s}_#{args[:fingerprint]}", :value => -1, :label_text => LABEL_MAP[LOCAL_PRINTER_ID])
      @gs.parsed_value = @gs.value.to_i
    else
      @gs = load_setting property, current_outlet
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
    when USE_WHITE_SPACE_MOBILE_MENUS
      new_value = (value == "true" ? "yes" : "no")
      write_attribute("value", new_value)
    when USE_WHITE_SPACE_DESKTOP_MENUS
      new_value = (value == "true" ? "yes" : "no")
      write_attribute("value", new_value)
    when SHOW_LICENCE_EXPIRED_SCREEN
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
    when CREDIT_CARD_TERMINAL_PORT
      new_value = value.to_i
      write_attribute("value", new_value)
    when POLLING_INTERVAL_SECONDS
      #make sure it is a number between POLLING_MIN_SECONDS and POLLING_MAX_SECONDS
      value_as_num = value.to_i
      
      if value_as_num > POLLING_MAX_SECONDS
        new_value = POLLING_MAX_SECONDS
      elsif value_as_num < POLLING_MIN_SECONDS
        new_value = POLLING_MIN_SECONDS
      else
        new_value = value_as_num
      end
      
      write_attribute("value", new_value)
    when PROCESS_TABLE_0_ORDERS
      new_value = (value == "true" ? "yes" : "no")
      write_attribute("value", new_value)
    when ENABLE_LOYALTY_REDEMPTION
      new_value = (value == "true" ? "yes" : "no")
      write_attribute("value", new_value)
    when LOYALTY_POINTS_PER_CURRENCY_UNIT
      #make sure it is a number bigger than 0
      value_as_num = value.to_i
      
      if value_as_num < 1
        new_value = 1
      else
        new_value = value_as_num
      end
      
      write_attribute("value", new_value)
    when SHOW_CHARGE_CARD_BUTTON
      new_value = (value == "true" ? "yes" : "no")
      write_attribute("value", new_value)
    when ALLOW_ZALION_SPLIT_PAYMENTS
      new_value = (value == "true" ? "yes" : "no")
      write_attribute("value", new_value)
    when RELOAD_HTML5_CACHE_TIMESTAMP
      new_value = value.to_i
      write_attribute("value", new_value)
    when PROMPT_FOR_COVERS
      new_value = (value == "true" ? "yes" : "no")
      write_attribute("value", new_value)
    when DEDUCT_STOCK_DURING_TRAINING_MODE
      new_value = (value == "true" ? "yes" : "no")
      write_attribute("value", new_value)
    when PRINT_WORK_REPORT
      new_value = (value == "true" ? "yes" : "no")
      write_attribute("value", new_value)
    when ALLOW_REOPEN_ORDER_AFTER_Z
      new_value = (value == "true" ? "yes" : "no")
      write_attribute("value", new_value)
    else
      if key.starts_with?  "#{WINDOWS_PRINTER_MARGINS.to_s}_"
        new_value = (value == "true" ? "yes" : "no")
        write_attribute("value", new_value)
      elsif key.starts_with? "#{BYPASS_OPEN_ORDERS_FOR_CASH_TOTAL.to_s}_"
        new_value = (value == "true" ? "yes" : "no")
        write_attribute("value", new_value)
      elsif key.starts_with? "#{PRINTER_LEFT_MARGIN.to_s}_"
        new_value = value.to_i
        write_attribute("value", new_value)
      elsif key.starts_with? "#{DISABLE_ADVANCED_TOUCH.to_s}_"
        new_value = (value == "true" ? "yes" : "no")
        write_attribute("value", new_value)
      elsif key.starts_with? "#{DO_BEEP.to_s}_"
        new_value = (value == "true" ? "yes" : "no")
        write_attribute("value", new_value)
      elsif key.starts_with? "#{USE_WSS_CASH_DRAWER.to_s}_"
        new_value = (value == "true" ? "yes" : "no")
        write_attribute("value", new_value)
      elsif key.starts_with? "#{USE_WSS_RECEIPT_PRINTER.to_s}_"
        new_value = (value == "true" ? "yes" : "no")
        write_attribute("value", new_value)
      elsif key.starts_with? "#{CASH_TOTAL_OPTION.to_s}_"
        new_value = (value == "true" ? "yes" : "no")
        write_attribute("value", new_value)
      elsif key.starts_with? "#{WORK_REPORT_OPTION.to_s}_"
        new_value = (value == "true" ? "yes" : "no")
        write_attribute("value", new_value)
      elsif key.starts_with? "#{PRINT_LOCAL_RECIEVE_DELIVERY.to_s}_"
        new_value = (value == "true" ? "yes" : "no")
        write_attribute("value", new_value)
      elsif key.starts_with? "#{LOCAL_PRINTER_ID.to_s}_"
        new_value = value.to_i
        write_attribute("value", new_value)
      end
    
    end
  end
  
  #this is just a shortcut method
  def self.parsed_setting_for property, current_outlet, args={}
    setting_for(property, current_outlet, args).try(:parsed_value)
  end
  
  def has_logo?
    return (!logo_file_name.nil? and !logo_file_name.blank?)
  end
  
  private
  
  def self.load_setting property, current_outlet
    @setting = find_or_create_by_outlet_id_and_key(:outlet_id => current_outlet.id, :key => property.to_s, :value => "Not Set", :label_text => LABEL_MAP[property])
    @setting
  end

  def self.report_date_format current_outlet
    @clockFormat = GlobalSetting.parsed_setting_for GlobalSetting::CLOCK_FORMAT, current_outlet

    if @clockFormat == "12"
      @report_date_format = "%d/%m/%Y %I:%M"
    else
      @report_date_format = "%d/%m/%Y %H:%M"
    end

    return @report_date_format
  end
  
  def self.default_date_format current_outlet
    @clockFormat = GlobalSetting.parsed_setting_for GlobalSetting::CLOCK_FORMAT, current_outlet
    
    if @clockFormat == "12"
      @defaultDateFormat = "%I:%M %d/%m/%Y"
    else
      @defaultDateFormat = "%H:%M %d/%m/%Y"
    end
    
    return @defaultDateFormat
  end
  
  def self.all_terminals current_outlet
    current_outlet.global_settings.where("global_settings.key like '#{TERMINAL_ID}\\_%'").where("global_settings.value not like ?", "NT%").order("value").collect(&:value).uniq
  end
  
  def self.latest_terminals current_outlet
    current_outlet.global_settings.where("global_settings.key like ?", "#{TERMINAL_ID}\\_%")
    .where("global_settings.value not like ?", "NT%")
    .where("updated_at > ?", LATEST_TERMINAL_HOURS.hours.ago)
    .collect(&:value).uniq
  end
  
  def self.older_terminals current_outlet
    current_outlet.global_settings.where("global_settings.key like ?", "#{TERMINAL_ID}\\_%")
    .where("global_settings.value not like ?", "NT%")
    .where("updated_at <= ?", LATEST_TERMINAL_HOURS.hours.ago)
    .collect(&:value).uniq
  end
  
  def self.remove_all_terminal_ids current_outlet    
    current_outlet.global_settings.where("global_settings.key like ?", "#{TERMINAL_ID}\\_%").each(&:destroy)
  end
  
  def self.next_order_number current_outlet
    GlobalSetting.transaction do
      @gs = current_outlet.global_settings.where("global_settings.key = ?", LAST_ORDER_ID.to_s).lock(true).first
      @gs.save!
    
      @gs.reload
    
      @gs.value = @gs.value.to_i + 1
      @gs.save!
    
      return @gs.value
    end
  end
  
  def self.course_vals
    return 1..7
  end
  
  def self.course_options current_outlet
    @options = [["None", -1]]
    
    course_vals.each do |val|
      @options << [GlobalSetting.parsed_setting_for(GlobalSetting::COURSE_LABEL, current_outlet, {:course_val => val}), val]
    end
    
    @options
  end
  
  def self.price_levels 
    return 2..4
  end
  
  def self.now_millis
    (Time.now.to_f * 1000).to_i
  end
  
  def self.terminal_id_for fingerprint, current_outlet
    GlobalSetting.setting_for GlobalSetting::TERMINAL_ID, current_outlet, {:fingerprint => fingerprint}
  end
  
  def self.clear_dup_keys_gs current_outlet
    logger.info "Clearing DUP keys gs for #{current_outlet.id}"
    
    current_outlet.global_settings.order("created_at desc, id desc").group_by(&:key).each do |gs_key, gs_set|
      if gs_set.size > 1
        #we have duplicates
        @del_count = gs_set.size - 1
	
        logger.info "Found #{gs_set.size} duplicate keys for Key: #{gs_key} Label: '#{gs_set.first.label_text}'. Removing #{@del_count} duplicates!"
	
        gs_set.each do |gs|
          break if @del_count == 0
          gs.destroy
          @del_count -= 1
        end
      end
    end
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
  CUSTOMER_MENU_SCREEN = 3
  
  #min and max values for polling in seconds
  POLLING_MIN_SECONDS = 10
  POLLING_MAX_SECONDS = 120
  
  #screen resolutions
  SCREEN_RESOLUTION_NORMAL = "1024x768"
  SCREEN_RESOLUTION_1360x786 = "1360x786"
end



# == Schema Information
#
# Table name: global_settings
#
#  id                :integer(8)      not null, primary key
#  key               :string(255)
#  value             :text
#  label_text        :string(255)
#  logo_file_name    :string(255)
#  logo_content_type :string(255)
#  logo_file_size    :integer(4)
#  logo_updated_at   :datetime
#  created_at        :datetime
#  updated_at        :datetime
#  outlet_id         :integer(8)
#

