//
//
// DECALARE ALL JS GLOBAL SETTINGS VARS
//
//
//

//interface
var currentInterface;

//load the setting for bypass pin
var bypassPin;

//are we allowing bypassing of open orders for z totals on this terminal
var bypassOpenOrdersForCashTotal;

//clock format
var clockFormat;

var defaultJSDateFormat;
var defaultJSTimeFormat;

//licence expired screen?
var showLicenceExpiredScreen;

//is tax chargable
var taxChargable;

var taxLabel;

//global tax rate
var globalTaxRate;

var printVatReceipt;

var taxNumber;

//service charge label
var serviceChargeLabel;

var globalDefaultServiceChargePercent;

//default payment method
var defaultPaymentMethod;

var cashPaymentMethodName;
var loyaltyPaymentMethodName;
var accountPaymentMethodName;

//load the dynamically set currency symbol
var dynamicCurrencySymbol;

//load the dynamically set screen that appears after a sale and login screen
var defaultHomeScreen;
var defaultPostLoginScreen;
var LOGIN_SCREEN;
var MENU_SCREEN;
var TABLES_SCREEN;

var menuScreenType;
var RESTAURANT_MENU_SCREEN;
var RETAIL_MENU_SCREEN;
var CUSTOMER_MENU_SCREEN;

//this is for the order ready notifications on mobile
var lastOrderReadyNotificationTime;

var autoPrintReceipt;

var receiptMessage;

var customReceiptFooters;

var businessInfoMessage;

var defaultDiscountPercent;

var terminalID;

var TERMINAL_TYPE_NORMAL;
var TERMINAL_TYPE_MOBILE;
var TERMINAL_TYPE_KITCHEN;

var pollingAmount;
var pollingMinSeconds;
var pollingMaxSeconds;

var using_mobile;

var doBeep;

var railsEnvironment;

var kioskMode;
var overrideKiosk;

//business info
var business_name;
var business_address;
var business_telephone;
var business_fax;
var business_email_address;

var selectedDisplayId;

//we need some button ids to mark them as selected and set permissions etsc
var modifyOrderItemButtonID;
var addNoteButtonID;
var tablesButtonID;
var discountButtonID;
var changePriceButtonID;
var removeItemButtonID;
var toggleMenuItemDoubleModeButtonID;
var toggleMenuItemHalfModeButtonID;
var toggleMenuItemStandardPriceOverrideModeButtonID;
var oiaButtonID;
var courseNumButtonID;
var voidOrderItemButtonID;
var priceChangeButtonID;
var toggleProductInfoButtonID;
var toggleTrainingModeButtonID;
var deliveryButtonID;
var changeCostPriceButtonID;
var editLoyaltyPointsButtonID;
var cashOutButtonID;

var updateStockType;
var transferStockType;

var creditCardChargeServiceIP;
var creditCardTerminalIP;
var creditCardTerminalPort;

var allDevicesOrderNotification;

//these variables are used to get a syncronised time on each device
var serverCounterStartTimeMillis;
var counterStartTimeMillis;

//payment integration IDs
var zalionPaymentIntegrationId;

var zalionChargeRoomServiceIP;

var disableAdvancedTouch;

//enumerate the course labels
var courseLabels

var isProcessingTable0Orders;

var loyaltyCardPrefix;
var enableLoyaltyCardRedemption;
var loyaltyPointsPerCurrencyUnit;

var halfMeasureLabel;

var allowedZalionSplitPayments;

var currentResolution;
var normalResolution;
var resolution1360x786;

var triggerCashDrawerViaPrinter;
var cashDrawerViaPrinterMappedPort;
var cashDrawerLocalPrinterShareName;

var cashDrawerComPort;
var cashDrawerCode;

var pmShortcut1ID;
var pmShortcut2ID;
var pmShortcut3ID;

var pmShortcutMap

var globalAutoPromptForCovers;

var clueyUserId;
var chefUserId;

var printLocalDeliveryReceipts;

var printDelegateTerminalID;
var offlineOrderDelegateTerminal;

var accountsURL;
var outletTerminalsURL;

var terminal_fingerprint;

var enablePollingForKitchenScreen;

var systemWideUpdatePromptRequired;

var SYSTEM_WIDE_UPDATE_TYPE_NONE;
var SYSTEM_WIDE_UPDATE_TYPE_SOFT;
var SYSTEM_WIDE_UPDATE_TYPE_HARD;

// code to initialise these settings
var globalSettingsMapStorageKey = "global_settings_map";

var comPortModeString;

var printSummaryReceipt;

var systemPrinterTypesArray;

function initJSGlobalSettings() {
    if(typeof(globalSettingsMap) != "undefined") {
        storeSalesResourceInStorage(globalSettingsMapStorageKey, globalSettingsMap);
    } else {
        console.log("loading global settings map from storage");
        globalSettingsMap = getSalesResourceFromStorage(globalSettingsMapStorageKey);        
    }
    
    populateSettingsFromMap(globalSettingsMap);
}

function populateSettingsFromMap(map) {
    //interface
    currentInterface = map['currentInterface'];

    //load the setting for bypass pin
    bypassPin = map['bypassPin'];

    //are we allowing bypassing of open orders for z totals on this terminal
    bypassOpenOrdersForCashTotal = map['bypassOpenOrdersForCashTotal'];

    //clock format
    clockFormat = map['clockFormat'];

    defaultJSDateFormat = map['defaultJSDateFormat'];
    defaultJSTimeFormat = map['defaultJSTimeFormat'];

    //licence expired screen?
    showLicenceExpiredScreen = map['showLicenceExpiredScreen'];

    //is tax chargable
    taxChargable = map['taxChargable'];

    taxLabel = map['taxLabel'];

    //global tax rate
    globalTaxRate = map['globalTaxRate'];

    printVatReceipt = map['printVatReceipt'];

    taxNumber = map['taxNumber'];

    //service charge label
    serviceChargeLabel = map['serviceChargeLabel'];

    globalDefaultServiceChargePercent = map['globalDefaultServiceChargePercent'];

    //default payment method
    defaultPaymentMethod = map['defaultPaymentMethod'];

    cashPaymentMethodName = map['cashPaymentMethodName'];
    loyaltyPaymentMethodName = map['loyaltyPaymentMethodName'];
    accountPaymentMethodName = map['accountPaymentMethodName'];

    //load the dynamically set currency symbol
    dynamicCurrencySymbol = map['dynamicCurrencySymbol'];

    //load the dynamically set screen that appears after a sale and login screen
    defaultHomeScreen = map['defaultHomeScreen'];
    defaultPostLoginScreen = map['defaultPostLoginScreen'];
    LOGIN_SCREEN = map['LOGIN_SCREEN'];
    MENU_SCREEN = map['MENU_SCREEN'];
    TABLES_SCREEN = map['TABLES_SCREEN'];

    menuScreenType = map['menuScreenType'];
    RESTAURANT_MENU_SCREEN = map['RESTAURANT_MENU_SCREEN'];
    RETAIL_MENU_SCREEN = map['RETAIL_MENU_SCREEN'];
    CUSTOMER_MENU_SCREEN = map['CUSTOMER_MENU_SCREEN'];

    //this is for the order ready notifications on mobile
    lastOrderReadyNotificationTime = map['lastOrderReadyNotificationTime'];

    autoPrintReceipt = map['autoPrintReceipt'];

    receiptMessage = map['receiptMessage'];

    customReceiptFooters = map['customReceiptFooters'];

    businessInfoMessage = map['businessInfoMessage'];

    defaultDiscountPercent = map['defaultDiscountPercent'];

    terminalID = map['terminalID'];

    TERMINAL_TYPE_NORMAL = map['TERMINAL_TYPE_NORMAL'];
    TERMINAL_TYPE_MOBILE = map['TERMINAL_TYPE_MOBILE'];
    TERMINAL_TYPE_KITCHEN = map['TERMINAL_TYPE_KITCHEN'];

    pollingAmount = map['pollingAmount'];
    pollingMinSeconds = map['pollingMinSeconds'];
    pollingMaxSeconds = map['pollingMaxSeconds'];

    using_mobile = map['using_mobile'];

    doBeep = map['doBeep'];

    railsEnvironment = map['railsEnvironment'];

    kioskMode = map['kioskMode'];
    overrideKiosk = map['overrideKiosk'];

    //business info
    business_name = map['business_name'];
    business_address = map['business_address'];
    business_telephone = map['business_telephone'];
    business_fax = map['business_fax'];
    business_email_address = map['business_email_address'];

    selectedDisplayId = map['selectedDisplayId'];

    //we need some button ids to mark them as selected and set permissions etsc
    modifyOrderItemButtonID = map['modifyOrderItemButtonID'];
    addNoteButtonID = map['addNoteButtonID'];
    tablesButtonID = map['tablesButtonID'];
    discountButtonID = map['discountButtonID'];
    changePriceButtonID = map['changePriceButtonID'];
    removeItemButtonID = map['removeItemButtonID'];
    toggleMenuItemDoubleModeButtonID = map['toggleMenuItemDoubleModeButtonID'];
    toggleMenuItemHalfModeButtonID = map['toggleMenuItemHalfModeButtonID'];
    toggleMenuItemStandardPriceOverrideModeButtonID = map['toggleMenuItemStandardPriceOverrideModeButtonID'];
    oiaButtonID = map['oiaButtonID'];
    courseNumButtonID = map[' courseNumButtonID'];
    voidOrderItemButtonID = map['voidOrderItemButtonID'];
    priceChangeButtonID = map['voidOrderItemButtonID'];
    toggleProductInfoButtonID = map['toggleProductInfoButtonID'];
    toggleTrainingModeButtonID = map['toggleTrainingModeButtonID'];
    deliveryButtonID = map['deliveryButtonID'];
    changeCostPriceButtonID = map['changeCostPriceButtonID'];
    editLoyaltyPointsButtonID = map['editLoyaltyPointsButtonID'];
    cashOutButtonID = map['cashOutButtonID'];

    updateStockType = map['updateStockType'];
    transferStockType = map['transferStockType'];

    creditCardChargeServiceIP = map['creditCardChargeServiceIP'];
    creditCardTerminalIP = map['creditCardTerminalIP'];
    creditCardTerminalPort = map['creditCardTerminalIP'];

    allDevicesOrderNotification = map['allDevicesOrderNotification'];

    //these variables are used to get a syncronised time on each device
    serverCounterStartTimeMillis = map['serverCounterStartTimeMillis'];
    counterStartTimeMillis = map['counterStartTimeMillis'];

    //payment integration IDs
    zalionPaymentIntegrationId = map['zalionPaymentIntegrationId'];

    zalionChargeRoomServiceIP = map['zalionPaymentIntegrationId'];

    disableAdvancedTouch = map['disableAdvancedTouch'];

    //enumerate the course labels
    courseLabels = map['courseLabels'];

    isProcessingTable0Orders = map['isProcessingTable0Orders'];

    loyaltyCardPrefix = map['loyaltyCardPrefix'];
    enableLoyaltyCardRedemption = map['enableLoyaltyCardRedemption'];
    loyaltyPointsPerCurrencyUnit = map['loyaltyPointsPerCurrencyUnit'];

    halfMeasureLabel = map['halfMeasureLabel'];

    allowedZalionSplitPayments = map['allowedZalionSplitPayments'];

    currentResolution = map['currentResolution'];
    normalResolution = map['normalResolution'];
    resolution1360x786 = map['resolution1360x786'];

    triggerCashDrawerViaPrinter = map['triggerCashDrawerViaPrinter'];

    cashDrawerViaPrinterMappedPort = map['cashDrawerViaPrinterMappedPort'];
    cashDrawerLocalPrinterShareName = map['cashDrawerLocalPrinterShareName'];

    cashDrawerComPort = map['cashDrawerComPort'];
    cashDrawerCode = map['cashDrawerCode'];

    pmShortcut1ID = map['pmShortcut1ID'];
    pmShortcut2ID = map['pmShortcut2ID'];
    pmShortcut3ID = map['pmShortcut3ID'];

    pmShortcutMap = map['pmShortcutMap'];

    globalAutoPromptForCovers = map['globalAutoPromptForCovers'];

    clueyUserId = map['clueyUserId'];
    chefUserId = map['chefUserId'];

    printLocalDeliveryReceipts = map['printLocalDeliveryReceipts'];

    printDelegateTerminalID = map['printDelegateTerminalID'];
    offlineOrderDelegateTerminal = map['offlineOrderDelegateTerminal'];

    accountsURL = map['accountsURL'];
    outletTerminalsURL = map['outletTerminalsURL'];

    terminal_fingerprint = map['terminal_fingerprint'];

    enablePollingForKitchenScreen = map['enablePollingForKitchenScreen'];
    
    SYSTEM_WIDE_UPDATE_TYPE_NONE = map['SYSTEM_WIDE_UPDATE_TYPE_NONE'];
    SYSTEM_WIDE_UPDATE_TYPE_SOFT = map['SYSTEM_WIDE_UPDATE_TYPE_SOFT'];
    SYSTEM_WIDE_UPDATE_TYPE_HARD = map['SYSTEM_WIDE_UPDATE_TYPE_HARD'];

    systemWideUpdatePromptRequired = map['systemWideUpdatePromptRequired']; 
    
    comPortModeString = map['comPortModeString'];
    
    printSummaryReceipt = globalSettingsMap['printSummaryReceipt'];
    
    PRINTER_TYPE_LOCAL = map['PRINTER_TYPE_LOCAL'];
    PRINTER_TYPE_KITCHEN_1 = map['PRINTER_TYPE_KITCHEN_1'];
    PRINTER_TYPE_BAR_1 = map['PRINTER_TYPE_BAR_1'];
    PRINTER_TYPE_KITCHEN_2 = map['PRINTER_TYPE_KITCHEN_2'];
    PRINTER_TYPE_BAR_2 = map['PRINTER_TYPE_BAR_2'];
    PRINTER_TYPE_OTHER = map['PRINTER_TYPE_OTHER'];
    
    systemPrinterTypesArray = new Array();
    systemPrinterTypesArray.push(PRINTER_TYPE_KITCHEN_1);
    systemPrinterTypesArray.push(PRINTER_TYPE_BAR_1);
    systemPrinterTypesArray.push(PRINTER_TYPE_KITCHEN_2);
    systemPrinterTypesArray.push(PRINTER_TYPE_BAR_2);
}