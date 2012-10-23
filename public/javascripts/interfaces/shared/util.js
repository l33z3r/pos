var clearHTML = "<div class='clear'>&nbsp;</div>";
var clear10HTML = "<div class='clear_top_margin_10'>&nbsp;</div>";
var clear30HTML = "<div class='clear_top_margin_30'>&nbsp;</div>";
var clear10BottomBorderHTML = "<div class='clear_top_margin_10_bottom_border'>&nbsp;</div>";

var appOnline = true;

var activeTableIDSStorageKey = "active_table_ids";
var breakUserIDSSStorageKey = "break_user_ids";
var clockedInUserIDSSStorageKey = "clocked_in_user_ids";

var activeUserIDCookieName = "current_user_id";

function isTouchDevice() {
    return !disableAdvancedTouch;
}

function goTo(place) {
    //only allow if not offline
    if(!appOnline) {
        appOfflinePopup();
        return false;
    }
    
    if(cacheDownloading) {
        cacheDownloadingPopup();
        return false;
    }
    
    showSpinner();
    window.location = place;
    return false;
}

function goToNewWindow(place) {
    window.open(place,'_blank');
}

function postTo(path, params) {
    showSpinner();
    
    var form = document.createElement("form");
    
    form.setAttribute("method", "post");
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}

function inMobileContext() {
    return $('body.mobile').length > 0;
}

function inKitchenContext() {
    return $('body div.kitchen').length > 0;
}

function inLargeInterface() {
    return currentInterface == "large";
}

function inMediumInterface() {
    return currentInterface == "medium";
}

function inAndroidWrapper() {
    return (typeof clueyAndroidJSInterface != "undefined");
}

function currencyBalance(balance) {
    if(balance < 0) {
        return currency(Math.abs(balance)) + "CR";
    } else {
        return currency(balance);
    }
}

function currency(number, showUnit) {
    if(typeof showUnit == "undefined") {
        showUnit = true;
    }
    
    return number_to_currency(number, {
        precision : 2,
        showunit : showUnit
    });
}

function number_to_currency(number, options) {
    try {
        var options   = options || {};
        var precision = options["precision"] || 2;
        var unit      = options["unit"] || dynamicCurrencySymbol;
        var separator = precision > 0 ? options["separator"] || "." : "";
        var delimiter = options["delimiter"] || ",";
  
        var parts = parseFloat(number).toFixed(precision).split('.');
  
        showUnit = options["showunit"] || false
        
        return (showUnit ? unit : "") + number_with_delimiter(parts[0], delimiter) + separator + parts[1].toString();
    } catch(e) {
        alert("error on number: " + number + " " + e.toString());
        return number
    }
}

function number_with_delimiter(number, delimiter, separator) {
    try {
        var delimiter = delimiter || ",";
        var separator = separator || ".";
    
        var parts = number.toString().split('.');
        parts[0] = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + delimiter);
        return parts.join(separator);
    } catch(e) {
        return number
    }
}

function roundNumber(num, dec) {
    var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
    return result;
}

function roundNumberUp(num, dec) {
    var result = Math.ceil(num*Math.pow(10,dec))/Math.pow(10,dec);
    return result;
}

function roundNumberDown(num, dec) {
    var result = Math.floor(num*Math.pow(10,dec))/Math.pow(10,dec);
    return result;
}

function doReload(resetSession) {
    if(!appOnline) {
        appOfflinePopup();
        return;
    }
    
    var reload_location;
    
    showSpinner();
    
    if(resetSession) {
        reload_location = "/";
        reload_location += "?reset_session=true";
        window.location = reload_location;
    } else {
        //pick up current url
        window.location.reload();
    }
}

function refreshClicked() {
    callHome = false;
    doReload(false);
}

function resetOrderTimestamp() {
    callHome = false;
    
    lastSyncTableOrderTime = 0;
    storeKeyValue(lastSyncKey, lastSyncTableOrderTime);
    
    doReload(false);
}

function doClearAndReload() {
    callHome = false;
    
    showSpinner();
    clearLocalStorageAndCookies();
    doReload(true);
}

var terminalFingerPrintCookieName = "terminal_fingerprint";
var sessionIdCookieName = "_session_id";
var lastReloadCookieName = "last_reload_time";
var lastPrintCheckCookieName = "last_print_check_time";
var salesInterfaceForwardFunctionCookieName = "sales_interface_forward_function";
var salesInterfaceForwardJSExecuteCookieName = "sales_interface_forward_js_execute";
var inTrainingModeCookieName = "in_training_mode";

//deletes everything but the fingerprint cookie
function clearLocalStorageAndCookies() {
    //clear the local and session web storage
    var nextKey = null;
    
    //must record the loop length first as it will change during the course of the loop
    var loopLength = localStorage.length;
    
    for (var i = 0; i < loopLength; i++){
        nextKey = localStorage.key(i);

        if(nextKey == breakUserIDSSStorageKey || nextKey == clockedInUserIDSSStorageKey) {
            continue;
        }
        
        localStorage.removeItem(nextKey);
    }
    
    //now clear cookies
    var c = document.cookie.split(";");
        
    for(i=0;i<c.length;i++) {
        var e = c[i].indexOf("=");
        var cname = c[i].substr(0,e);
        
        if($.trim(cname) == terminalFingerPrintCookieName || $.trim(cname) == sessionIdCookieName 
            || $.trim(cname) == lastReloadCookieName || $.trim(cname) == lastPrintCheckCookieName) {
            continue;
        }
        
        var n= e>-1 ? cname : c[i];
        setRawCookie(n, "", -365);
    }
}

//used for setting the terminal id using the browsers fingerprint and save it in a cookie
//uses the fingerprint library with md5 hash
function setFingerPrintCookie() {
    if(getRawCookie(terminalFingerPrintCookieName) == null) {
        
        var uuid;
        
        if(inAndroidWrapper()) {
            uuid = "android_device_" + getAndroidFingerPrint();
        } else {
            uuid = Math.uuid();
        }
        
        c_value = uuid;
        
        //100 year expiry, but will really end up in year 2038 due to limitations in browser
        exdays = 365 * 100;
    
        setRawCookie(terminalFingerPrintCookieName, c_value, exdays);
    }
}

function regenerateTerminalFingerprintCookie() {
    setRawCookie(terminalFingerPrintCookieName, "", -365);
    setFingerPrintCookie()
    goTo("/");
}

function storeOrderInStorage(current_user_id, order_to_store) {
    key = "user_" + current_user_id + "_current_order";
    value = JSON.stringify(order_to_store);
    return storeKeyValue(key, value);
}

function getOrderFromStorage(current_user_id) {
    key = "user_" + current_user_id + "_current_order";
    storageData = retrieveStorageValue(key);
    
    if(storageData != null) {
        return JSON.parse(storageData);
    } else {
        return null;
    }
}

function clearOrderInStorage(current_user_id) {
    deleteStorageValue("user_" + current_user_id + "_current_order");
}

function storeTableOrderInStorage(current_user_id, table_num, order_to_store) {
    key = "user_" + current_user_id + "_table_" + table_num + "_current_order";
    value = JSON.stringify(order_to_store);
    
    if(current_user_id != masterOrdersUserId) {
        //if value same as master, dont store it
        var masterOrderKey = "user_" + masterOrdersUserId + "_table_" + table_num + "_current_order";
    
        if(retrieveStorageValue(masterOrderKey) == value) {
            deleteStorageValue(key);
            return null;
        }
    }
    
    return storeKeyValue(key, value);
}

function getTableOrderFromStorage(current_user_id, selectedTable) {
    key = "user_" + current_user_id + "_table_" + selectedTable + "_current_order";
    storageData = retrieveStorageValue(key);

    tableOrderDataJSON = null;
    
    if(storageData != null) {
        tableOrderDataJSON = JSON.parse(storageData);
    } else {
        if(current_user_id != masterOrdersUserId) {
            //try fetch the master order
            var masterOrderKey = "user_" + masterOrdersUserId + "_table_" + selectedTable + "_current_order";
        
            storageData = retrieveStorageValue(masterOrderKey);
        
            if(storageData != null) {
                tableOrderDataJSON = JSON.parse(storageData);
            }
        }
    }

    tableNum = selectedTable;
    parseAndFillTableOrderJSON(tableOrderDataJSON);
}

function userHasUniqueTableOrder(userID, tableID) {
    var key = "user_" + userID + "_table_" + tableID + "_current_order";
    return localStorage.getItem(key) != null;
}

function clearTableOrderInStorage(current_user_id, selectedTable) {
    return deleteStorageValue("user_" + current_user_id + "_table_" + selectedTable + "_current_order");
}

function parseAndFillTableOrderJSON(currentTableOrderJSON) {
    //init an in memory version of this order
    tableOrders[tableNum] = buildInitialOrder();
    
    //fill in the table order array
    if(currentTableOrderJSON != null) {
        for(var i=0; i<currentTableOrderJSON.items.length; i++) {
            tableOrderItem = currentTableOrderJSON.items[i];
            
            //we want to mark the item as synced if we are loading in a previous order
            if(tableNum == -1) {
                tableOrderItem.synced = true;
            }
            
            tableOrders[tableNum].items.push(tableOrderItem);
        }

        tableOrders[tableNum].order_num = currentTableOrderJSON.order_num;
        tableOrders[tableNum].table = currentTableOrderJSON.table;
        tableOrders[tableNum].total = currentTableOrderJSON.total;
        
        //is it a split bill
        tableOrders[tableNum].split_bill_table_num = currentTableOrderJSON.split_bill_table_num;
        
        tableOrders[tableNum].client_name = currentTableOrderJSON.client_name;
        
        //covers
        tableOrders[tableNum].covers = currentTableOrderJSON.covers;
        
        //load the cashback
        tableOrders[tableNum].cashback = currentTableOrderJSON.cashback;
                
        if(typeof tableOrders[tableNum].cashback == "undefined") {
            tableOrders[tableNum].cashback = 0;
        }
    
        cashback = parseFloat(tableOrders[tableNum].cashback);
    
        //load the service charge
        tableOrders[tableNum].service_charge = currentTableOrderJSON.service_charge;
        
        //load the void order id if there is one
        if(currentTableOrderJSON.void_order_id) {
            tableOrders[tableNum].void_order_id = currentTableOrderJSON.void_order_id;
        }
        
        if(typeof tableOrders[tableNum].service_charge == "undefined") {
            tableOrders[tableNum].service_charge = 0;
        }
    
        serviceCharge = parseFloat(tableOrders[tableNum].service_charge);
    
        if(currentTableOrderJSON.discount_percent) {
            tableOrders[tableNum].discount_percent = currentTableOrderJSON.discount_percent;
            tableOrders[tableNum].pre_discount_price = currentTableOrderJSON.pre_discount_price;
        }
        
        //load the courses
        if(typeof currentTableOrderJSON.courses != "undefined") {
            tableOrders[tableNum].courses = currentTableOrderJSON.courses;
        }
        
        tableOrders[tableNum].order_taxes = currentTableOrderJSON.order_taxes;
    
        if(tableNum == -1) {
            //we have a previous table order and must copy over the table number and payment method and service charge and cashback
            tableOrders[tableNum].table_info_label = currentTableOrderJSON.table_info_label;
            tableOrders[tableNum].tableInfoId = currentTableOrderJSON.tableInfoId;
            tableOrders[tableNum].payment_method = currentTableOrderJSON.payment_method;
            serviceCharge = tableOrders[tableNum].service_charge = currentTableOrderJSON.service_charge;
            cashback = tableOrders[tableNum].cashback = currentTableOrderJSON.cashback;
            tableOrders[tableNum].void_order_id = currentTableOrderJSON.void_order_id;
            
            //clear the previous order number
            tableOrders[tableNum].order_num = "";
        }
    } else {
        cashback = serviceCharge = 0;
    }
        
    //total the order first
    calculateOrderTotal(tableOrders[tableNum]);
}

function buildInitialOrder() {
    var initOrder = {
        'items': new Array(),
        'courses' : new Array(),
        'total': 0,
        'client_name' : "",
        'covers' : -1
    };
    
    return initOrder;
}

function storeKeyValue(key, value) {
    return localStorage.setItem(key, value);
}

function retrieveStorageValue(key) {
    return localStorage.getItem(key);
}

function storeKeyJSONValue(key, value) {
    JSONValue = JSON.stringify(value);
    return localStorage.setItem(key, JSONValue);
}

function retrieveStorageJSONValue(key) {
    storageData = retrieveStorageValue(key);
    if(storageData != null) {
        return JSON.parse(storageData);
    } else {
        return null;
    }
}

function deleteStorageValue(key) {
    return localStorage.removeItem(key);
}

function getActiveTableIDS() {
    activeTableIDSString = retrieveStorageValue(activeTableIDSStorageKey);
    
    //alert("got active table ids " + activeTableIDSString);
    
    if(activeTableIDSString) {
        return activeTableIDSString.split(",");
    } else {
        return new Array();
    }
}

function storeActiveTableIDS(activeTableIDS) {
    activeTableIDSString = activeTableIDS.join(",");
    //alert("Storing active table ids " + activeTableIDSString);
    storeKeyValue(activeTableIDSStorageKey, activeTableIDSString);
}

function addActiveTable(tableID) {
    activeTableIDS = getActiveTableIDS();
    
    newlyAdded = ($.inArray(tableID.toString(), activeTableIDS) == -1);
    
    if(newlyAdded) {
        activeTableIDS.push(tableID);
        storeActiveTableIDS(activeTableIDS);
    }
    
    return newlyAdded;
}

function removeActiveTable(tableID) {
    activeTableIDS = getActiveTableIDS();
    
    newlyRemoved = ($.inArray(tableID.toString(), activeTableIDS) != -1);
    
    activeTableIDS = $.grep(activeTableIDS, function(val) {
        return val.toString() != tableID.toString();
    });

    storeActiveTableIDS(activeTableIDS);
    
    return newlyRemoved;
}

function getBreakUsersIDS() {
    var breakUserIDSString = retrieveStorageValue(breakUserIDSSStorageKey);
    
    if(breakUserIDSString) {
        return breakUserIDSString.split(",");
    } else {
        return new Array();
    }
}

function storeBreakUsersIDS(breakUserIDS) {
    var breakUserIDSString = breakUserIDS.join(",");
    storeKeyValue(breakUserIDSSStorageKey, breakUserIDSString);
}

function addBreakUser(userID) {
    var breakUsersIDS = getBreakUsersIDS();
    
    var newlyAdded = ($.inArray(userID.toString(), breakUsersIDS) == -1);
    
    if(newlyAdded) {
        breakUsersIDS.push(userID);
        storeBreakUsersIDS(breakUsersIDS);
    }
    
    return newlyAdded;
}

function removeBreakUser(userID) {
    var breakUsersIDS = getBreakUsersIDS();
    
    var newlyRemoved = ($.inArray(userID.toString(), breakUsersIDS) != -1);
    
    breakUsersIDS = $.grep(breakUsersIDS, function(val) {
        return val.toString() != userID.toString();
    });

    storeBreakUsersIDS(breakUsersIDS);
    
    return newlyRemoved;
}

function getClockedInUsersIDS() {
    var clockedInUserIDSString = retrieveStorageValue(clockedInUserIDSSStorageKey);
    
    if(clockedInUserIDSString) {
        return clockedInUserIDSString.split(",");
    } else {
        return new Array();
    }
}

function storeClockedInUsersIDS(clockedInUserIDS) {
    var clockedInUserIDSString = clockedInUserIDS.join(",");
    storeKeyValue(clockedInUserIDSSStorageKey, clockedInUserIDSString);
}

function addClockedInUser(userID) {
    var clockedInUsersIDS = getClockedInUsersIDS();
    
    var newlyAdded = ($.inArray(userID.toString(), clockedInUsersIDS) == -1);
    
    if(newlyAdded) {
        clockedInUsersIDS.push(userID);
        storeClockedInUsersIDS(clockedInUsersIDS);
    }
    
    return newlyAdded;
}

function removeClockedInUser(userID) {
    var clockedInUsersIDS = getClockedInUsersIDS();
    
    var newlyRemoved = ($.inArray(userID.toString(), clockedInUsersIDS) != -1);
    
    clockedInUsersIDS = $.grep(clockedInUsersIDS, function(val) {
        return val.toString() != userID.toString();
    });

    storeClockedInUsersIDS(clockedInUsersIDS);
    
    return newlyRemoved;
}

function setSalesScreenForwardFunction(button_id) {
    var exdays = 365 * 100;
    setRawCookie(salesInterfaceForwardFunctionCookieName, button_id, exdays);
}

function setRawCookie(c_name, value, expires) {
    var today = new Date();
    today.setTime( today.getTime() );
    
    if (expires) {
        expires = expires * 1000 * 60 * 60 * 24;
    }
    
    var expires_date = new Date(today.getTime() + (expires));
    
    var c_value= escape(value) + ((expires==null) ? "" : ";path=/;expires=" + expires_date.toUTCString());
    document.cookie= c_name + "=" + c_value;
}

function getRawCookie(c_name) {
    var i,x,y,ARRcookies=document.cookie.split(";");
    for (i=0;i<ARRcookies.length;i++)
    {
        x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
        y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
        x=x.replace(/^\s+|\s+$/g,"");
        if (x==c_name)
        {
            return unescape(y);
        }
    }

    return null;
}

function deleteRawCookie(c_name) {
    var exdays = -1 * 365 * 100;
    setRawCookie(c_name, null, exdays);
}

String.prototype.startsWith = function(str){
    return (this.indexOf(str) === 0);
};

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.contains = function(str){
    return (this.indexOf(str) != -1);
};

String.prototype.splice = function( idx, rem, s ) {
    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
};

function utilFormatDate(date) {
    return formatDate(date, defaultJSDateFormat);
}

function utilFormatTime(date) {
    return formatDate(date, defaultJSTimeFormat);
}

function inDevMode() {
    return railsEnvironment == 'development';
}

function inProdMode() {
    return railsEnvironment != 'development';
}

function inKioskMode() {
    return kioskMode && !overrideKiosk && !inMobileContext();
}

function pauseScript(ms) {
    ms += new Date().getTime();
    while (new Date() < ms){}
}

function firstServerID(order) {
    if(orderEmpty(order)) {
        return "";
    }
    
    return order.items[0].serving_employee_id;
}

function firstServerNickname(order) {
    user_id = firstServerID(order);
    return serverNickname(user_id);
}

function serverNickname(user_id) {
    var server = null;
    
    for (var i = 0; i < employees.length; i++){
        id = employees[i].id;
        if(id == user_id) {
            server = employees[i].nickname;
            break;
        }
    }
    
    return server;
}

function employeeForID(employeeId) {
    for (var i = 0; i < employees.length; i++) {
        var id = employees[i].id;
        if (id == employeeId) {
            return employees[i];
        }
    }
    
    return null;
}

function serverRoleID(user_id) {
    var role_id = null;
    
    for (var i = 0; i < employees.length; i++){
        id = employees[i].id;
        if(id == user_id) {
            role_id = employees[i].role_id;
            break;
        }
    }
    
    return role_id;
}

function getTableForLabel(table_label) {
    var table_info = null;
    
    for(var i in tables){
        label = tables[i].label;
        if(label == table_label) {
            table_info = tables[i];
            break;
        }
    }
    
    return table_info;
}

function getPaymentMethodId(paymentMethodName) {
    var paymentMethodId = null;
    
    for(var id in paymentMethods) {
        if(paymentMethods[id].name == paymentMethodName) {
            paymentMethodId = id;
            break;
        }
    }
    
    return paymentMethodId;
}

function initUIElements() {
    //initialize the tabs
    $(".vtabs").jVertTabs({
        select: function(index){
            initScrollPanes();
            initCheckboxes();
        }
    });
    
    //initialize scroll panes
    initScrollPanes();
        
    //initialize checkboxes
    initCheckboxes();
    
    //init radio buttons
    initRadioButtons();
    
    initMcDropDowns();
}

function initScrollPanes() {
    if(isTouchDevice()) {
        //init all the scroll panes
        $('.jscrollpane, .admin #content_container section:not(.no_scroll_pane)').jScrollPane({
            showArrows: true,
            autoReinitialise : true
        });
        
        //get rid of the webkit scrollbars
        var sheet = document.createElement('style')
        sheet.innerHTML = "::-webkit-scrollbar {display: none;}";
        document.body.appendChild(sheet);
    } else {
        //remove all jscrollpane css classes
        $('*').removeClass("jscrollpane");
    }
}

function initCheckboxes() {
    $(':checkbox.iphone_style').iphoneStyle({
        resizeContainer: false, 
        resizeHandle : false, 
        checkedLabel: 'Yes', 
        uncheckedLabel: 'No'
    });
}

function initRadioButtons() {
    $(':radio.iphone_style').iButton({
        labelOn: "On", 
        labelOff: "Off"
    });
}

var hideNiceAlertListener = null;

function niceAlert(message, title) {
    //hide previous ones
    hideNiceAlert();
    
    if (typeof title == "undefined") {
        title = "Notice";
    }
    
    ModalPopups.Alert('niceAlertContainer',
        title, "<div id='nice_alert' class='nice_alert'>" + message + "</div>",
        {
            width: 360,
            height: 310,
            okButtonText: 'Ok',
            onOk: "hideNiceAlert()"
        });
        
    hideNiceAlertListener = function(event) {
        if(getEventKeyCode(event) == 13) {
            hideNiceAlert();
        }
    };
        
    $(window).bind('keypress', hideNiceAlertListener);
}

function hideNiceAlert() {
    try {
        if(hideNiceAlertListener != null) {
            $(window).unbind('keypress', hideNiceAlertListener);
        }
        
        ModalPopups.Close('niceAlertContainer');
    } catch (e) {
        
    }
}

//extend jquery to slide divs
jQuery.fn.extend({
    slideRightShow: function() {
        return this.each(function() {
            $(this).show('slide', {
                direction: 'right'
            }, screenSlideSpeed);
        });
    },
    slideLeftHide: function() {
        return this.each(function() {
            $(this).hide('slide', {
                direction: 'left'
            }, screenSlideSpeed);
        });
    },
    slideRightHide: function() {
        return this.each(function() {
            $(this).hide('slide', {
                direction: 'right'
            }, screenSlideSpeed);
        });
    },
    slideLeftShow: function() {
        return this.each(function() {
            $(this).show('slide', {
                direction: 'left'
            }, screenSlideSpeed);
        });
    }
});

function initPressedCSS() {
    var startEventName = "mousedown";
    var stopEventName = "mouseup";
    var cancelEventName = "mouseout"
    
    if(isTouchDevice()) {
        startEventName = "touchstart";
        stopEventName = "touchend";
        cancelEventName = "touchcancel";
    }
    
    $('div.button, div.small_button, div.item, div.key, div.go_key, div.cancel_key, div.employee_box, \n\
        div.mobile_button, div.page, #table_screen_button, div#nav_util_button, input[type="submit"]').live(startEventName,function() {
        $(this).addClass("pressed");
        
        $(this).bind(stopEventName, function() {
            $(this).removeClass("pressed"); 
            $(this).unbind(startEventName);
            $(this).unbind(stopEventName);
        });
        
        $(this).bind(cancelEventName, function() {
            $(this).removeClass("pressed"); 
            $(this).unbind(cancelEventName);
            $(this).unbind(cancelEventName);
        });
    });
}

function clueyTimestamp() {
    return (new Date().getTime() - counterStartTimeMillis) + serverCounterStartTimeMillis;
}

var ignoreReloadRequest = false;

//THERE ARE 2 TYPES OF RELOAD, ONE IS A HARD RESET, AND THE OTHER IS A SALES RESOURCES RESET
function alertReloadRequest(reloadTerminalId, hardReload) {
    if(ignoreReloadRequest) {
        return;
    }
    
    //hide any previous popups
    hideNiceAlert();
    
    //must write the last reload time to cookie here so that the reload message does not keep popping up
    writeLastReloadTimeCookie();
    
    var timeoutSeconds = 5;
    
    if(hardReload) {
        message = "A hard reset has been requested by " + reloadTerminalId + ". Screen will reload in " + timeoutSeconds + " seconds.";
        okFuncCall = "doClearAndReload();";
        
        ModalPopups.Alert('niceAlertContainer',
            "Please Reload Screen", "<div id='nice_alert' class='nice_alert'>" + message + "</div>",
            {
                width: 360,
                height: 280,
                okButtonText: 'Reload Now',
                onOk: okFuncCall
            });
        
        setTimeout(okFuncCall, timeoutSeconds * 1000);
    } else {
        indicateSalesResourcesReloadRequired(reloadTerminalId);
    }
}

function promptReloadSalesResources(reloadTerminalId) {
    var message = "Your POS data has been changed by " + reloadTerminalId + ", click OK to pick up the new data!";
    var okFuncCall = "doReloadSalesResources();";
        
    ModalPopups.Alert('niceAlertContainer',
        "Click OK To Refresh", "<div id='nice_alert' class='nice_alert'>" + message + "</div>",
        {
            width: 360,
            height: 280,
            okButtonText: 'Refresh',
            onOk: okFuncCall
        });
}

function writeLastReloadTimeCookie() {
    ////write it to cookie        
    //100 year expiry, but will really end up in year 2038 due to limitations in browser
    var interfaceReloadTimeCookeExpDays = 365 * 100;
    setRawCookie(lastReloadCookieName, lastInterfaceReloadTime, interfaceReloadTimeCookeExpDays);
}

function alertCacheReloadRequest() {
    //hide any previous popups
    hideNiceAlert();
    
    var timeoutSeconds = 5;
    
    var message = "New cache downloaded! App will reload in " + timeoutSeconds + " seconds.";
    var okFuncCall = "doReload(false);";
    
    ModalPopups.Alert('niceAlertContainer',
        "Please Reload Screen", "<div id='nice_alert' class='nice_alert'>" + message + "</div>",
        {
            width: 360,
            height: 280,
            okButtonText: 'Reload Now',
            onOk: okFuncCall
        });
        
    setTimeout(okFuncCall, timeoutSeconds * 1000);
}

function getURLHashParams() {
    var hashParams = {};
    
    var e,
    a = /\+/g,  // Regex for replacing addition symbol with a space
    r = /([^&;=]+)=?([^&;]*)/g,
    d = function (s) {
        return decodeURIComponent(s.replace(a, " "));
    },
    q = window.location.hash.substring(1);

    while (e = r.exec(q)) {
        hashParams[d(e[1])] = d(e[2]);
    }

    return hashParams;
}

jQuery.parseQuery = function(qs,options) {
    var q = (typeof qs === 'string'?qs:window.location.search), o = {
        'f':function(v){
            return unescape(v).replace(/\+/g,' ');
        }
    }, options = (typeof qs === 'object' && typeof options === 'undefined')?qs:options, o = jQuery.extend({}, o, options), params = {};
    jQuery.each(q.match(/^\??(.*)$/)[1].split('&'),function(i,p){
        p = p.split('=');
        p[1] = o.f(p[1]);
        params[p[0]] = params[p[0]]?((params[p[0]] instanceof Array)?(params[p[0]].push(p[1]),params[p[0]]):[params[p[0]],p[1]]):p[1];
    });
    return params;
}

function checkUpdateOpenOrdersScreen() {
    var onPreviousSalesScreen = $('#admin_order_list').length > 0;
    
    if(onPreviousSalesScreen) {
        if(typeof loadOpenOrders != 'undefined') {
            loadOpenOrders();
        }
    }
}

function ensureLoggedIn() {
    if(current_user_id == null) {
        //hide previous popups
        hideNiceAlert();
    
        var message = "You have been logged out, please log in again";
        
        ModalPopups.Alert('niceAlertContainer',
            "Logged Out", "<div id='nice_alert' class='nice_alert'>" + message + "</div>",
            {
                width: 360,
                height: 280,
                okButtonText: 'Ok',
                onOk: "doReload(false)"
            });
            
        return false;
    }
    
    return true;
}

function showLoadingDiv(optionalText) {
    if(typeof(optionalText) == "undefined") {
        text = "Please Wait...";
    } else {
        text = optionalText;
    }
    
    if(inAndroidWrapper()) {
        showSpinner();
    } else {
        hideNiceAlert();
    
        ModalPopups.Indicator("niceAlertContainer",
            "Loading...",
            "<div id='nice_alert' class='nice_alert'>" + text + "</div>",
            { 
                width: 360,
                height: 280
            } );
    }
}

function hideLoadingDiv() {
    if(inAndroidWrapper()) {
        hideSpinner();
    } else {
        hideNiceAlert();
    }
}

function setConnectionStatus(connected) {
    appOnline = connected;
    postSetConnectionStatus(connected);
}

function appOfflinePopup() {
    niceAlert("Server cannot be contacted. App will operate in restricted mode. Some features may not be available.");
}

function cacheDownloadingPopup() {
    niceAlert("The cache is downloading. App will operate in restricted mode. Some features may not be available.");
}

//function to force a button to be clicked that works with both advanced touch and non
function doClickAButton(el) {
    el.mousedown().mouseup().click();
}

function userAbortedXHR(xhr) {
    return !xhr.getAllResponseHeaders();
}

//HTML5 AUDIO BEEP
var playHTML5Audio = false;
 
function initBeep() {
    playHTML5Audio = isHTML5AudioSupported();
    
    var els = $("div.button, div.small_button, div.item, div.key, div.go_key, div.cancel_key, div.employee_box, \n\
        div.mobile_button, div.page, #table_screen_button, div#nav_util_button, input[type='submit']");
    
    els.live("click", doBeepSound);
}

function isHTML5AudioSupported() {
    var a = document.createElement('audio');
    return !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
}

function doBeepSound() {
    playSound('/sounds/beep.mp3');
}

function playSound(url) {
    if(playHTML5Audio) {
        var snd = new Audio(url);
        snd.load();
        snd.play();
    } else {
        $("#sound").remove();
        var sound = $("<embed id='sound' type='audio/mpeg' />");
        sound.attr('src', url);
        sound.attr('loop', false);
        sound.attr('hidden', true);
        sound.attr('autostart', true);
        $('body').append(sound);
    }
}

function setEventyKeyCode(e, code) {
    e.keyCode = code;
}

function getEventKeyCode(e) {
    //console.log("KC: " + e.keyCode + " - " + e.charCode + " : " + (e.charCode || e.keyCode));
    return e.charCode || e.keyCode;
}

function sizeOfHash(theHash) {
    return Object.keys(theHash).length
}

function sizeOfObjectInBytes(value) {
    return lengthInUtf8Bytes(JSON.stringify(value));
}

function lengthInUtf8Bytes(str) {
    // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
    var m = encodeURIComponent(str).match(/%[89ABab]/g);
    return str.length + (m ? m.length : 0);
}

function doKeyboardInput(input, val) {
    var caretStart = input.caret().start;
    var caretEnd = input.caret().end;
        
    var newStartVal = input.val().substring(0, caretStart);
    var newEndVal = input.val().substring(caretEnd);
        
    input.val(newStartVal + val + newEndVal);
    input.caret({
        start : caretStart + 1, 
        end : caretStart + 1
    });
}

function doKeyboardInputCancel(input) {
    var caretStart = input.caret().start;
    var caretEnd = input.caret().end;
        
    var newStartVal;
    var newEndVal;
        
    if(caretEnd > caretStart) {
        newStartVal = input.val().substring(0, caretStart);
        newEndVal = input.val().substring(caretEnd);
        input.val(newStartVal + newEndVal);
        input.caret({
            start : caretStart, 
            end : caretStart
        });
    } else {
        newStartVal = input.val().substring(0, caretStart - 1);
        newEndVal = input.val().substring(caretEnd);
        input.val(newStartVal + newEndVal);
        input.caret({
            start : caretStart - 1, 
            end : caretStart - 1
        });
    }
}

function focusSelectInput(inputEl) {
    addTableNamePopupEl.find('input').focus();
    addTableNamePopupEl.find('input').caret({
        start : 0, 
        end : 0
    });
}

function storeActiveUserID(userID) {
    if(userID == null) {
        deleteRawCookie(activeUserIDCookieName);
        return;
    }
    
    var exdays = 365 * 100;
    setRawCookie(activeUserIDCookieName, userID, exdays);
}

function fetchActiveUserID() {
    return getRawCookie(activeUserIDCookieName);
}

function requestReload() {
    $.ajax({
        type: 'POST',
        url: '/request_terminal_reload',        
        success: function() {
            console.log("Reload request sent to server!");
        }
    });
}