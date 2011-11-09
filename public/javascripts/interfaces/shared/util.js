var clearHTML = "<div class='clear'>&nbsp;</div>";
var clear10HTML = "<div class='clear_top_margin_10'>&nbsp;</div>";
var clear30HTML = "<div class='clear_top_margin_30'>&nbsp;</div>";
var clear10BottomBorderHTML = "<div class='clear_top_margin_10_bottom_border'>&nbsp;</div>";

function isTouchDevice() {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
}

function goTo(place) {
    window.location = place;
    return false;
}

function inMobileContext() {
    return $('body.mobile').length > 0;
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
    //we must do a delayed reload so that the appcache has a chance to re-download before the refresh
    var reload_location = "/";
    
    if(resetSession) {
        reload_location += "?reset_session=true";
    }
    
    window.location = reload_location;
}

function doClearAndReload() {
    doIt = confirm("Are you sure you want to clear your cookies and local web storage?");
    
    if(doIt) {
        //clear the local and session web storage
        localStorage.clear();
        
        //now clear cookies
        var c = document.cookie.split(";");
        
        for(var i=0;i<c.length;i++){
            var e = c[i].indexOf("=");
            var n= e>-1 ? c[i].substr(0,e) : c[i];
            document.cookie = n + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        
        doReload(true);
    }
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
    return storeKeyValue(key, value);
}

function getTableOrderFromStorage(current_user_id, selectedTable) {
    key = "user_" + current_user_id + "_table_" + selectedTable + "_current_order";
    storageData = retrieveStorageValue(key);
    
    tableOrderDataJSON = null;
    
    if(storageData != null) {
        tableOrderDataJSON = JSON.parse(storageData);
    }
    
    tableNum = selectedTable;
    parseAndFillTableOrderJSON(tableOrderDataJSON);
}

function clearTableOrderInStorage(current_user_id, selectedTable) {
    return deleteStorageValue("user_" + current_user_id + "_table_" + selectedTable + "_current_order");
}

function parseAndFillTableOrderJSON(currentTableOrderJSON) {
    
    //init an in memory version of this order
    tableOrders[tableNum] = {
        'items': new Array(),
        'courses' : new Array(),
        'total':0
    };
    
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
        
        //load the cashback
        tableOrders[tableNum].cashback = currentTableOrderJSON.cashback;
                
        if(typeof tableOrders[tableNum].cashback == "undefined") {
            tableOrders[tableNum].cashback = 0;
        }
    
        cashback = tableOrders[tableNum].cashback;
    
        //load the service charge
        tableOrders[tableNum].service_charge = currentTableOrderJSON.service_charge;
        
        if(typeof tableOrders[tableNum].service_charge == "undefined") {
            tableOrders[tableNum].service_charge = 0;
        }
    
        serviceCharge = tableOrders[tableNum].service_charge;
    
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
    activeTableIDSString = retrieveStorageValue("active_table_ids");
    
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
    storeKeyValue("active_table_ids", activeTableIDSString);
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

function setRawCookie(c_name, value, exdays) {
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value;
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

String.prototype.startsWith = function(str){
    return (this.indexOf(str) === 0);
}

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
    return railsEnvironment == 'production' || railsEnvironment == 'production_heroku';
}

function inKioskMode() {
    return kioskMode && !overrideKiosk;
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

function initModifierGrid() {
    //set the width of each grid item
    var rowWidth = $('div#order_item_additions .grid_row:first').css("width");
    
    var newWidth = roundNumberDown(parseFloat(rowWidth)/modifierGridXSize, 0) - 5;
    
    $('div#order_item_additions .grid_row .grid_item').css("width", newWidth + "px");
    
    var panelHeight = $('div#order_item_additions').css("height");
    
    //take away the height of the tabs if they exist
    if($('#oia_tabs .tab').length>0) {
        panelHeight = parseFloat(panelHeight) - parseFloat($('#oia_tabs .tab').css("height"));
    }
    
    var newHeight = roundNumberDown(parseFloat(panelHeight)/modifierGridYSize, 0) - 4;
    
    $('div#order_item_additions .grid_row .grid_item').css("height", newHeight + "px");
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
    //init all the scroll panes
    setTimeout(function() {
        $('.jscrollpane, .admin #content_container section:not(.no_scroll_pane)').jScrollPane({
            showArrows: true
        });
        
        
    }, 500);
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

function niceAlert(message, title) {
    //hide previous ones
    hideNiceAlert();
    
    if (typeof title == "undefined") {
        title = "Notice";
    }
    
    ModalPopups.Alert('niceAlertContainer',
        title, "<div id='nice_alert'>" + message + "</div>",
        {
            width: 360,
            height: 250,
            okButtonText: 'Dismiss',
            onOk: "hideNiceAlert()"
        });
}

function hideNiceAlert() {
    try {
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
    
    if(isTouchDevice()) {
        startEventName = "touchstart";
        stopEventName = "touchend";
    }
    
    $('div.button, div.item, div.key, div.go_key, div.cancel_key, div.employee_box, div.mobile_button').live(startEventName,function() {
        $(this).addClass("pressed");
        
        $(this).bind(stopEventName, function() {
           $(this).removeClass("pressed"); 
           $(this).unbind(startEventName);
           $(this).unbind(stopEventName);
        });
    });
}

function inAndroidWrapper() {
    return (typeof demoJSInterface != "undefined");
}