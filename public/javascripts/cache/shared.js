var currentMenuPage;

var selectedTable = 0;
var currentOrder = null;
var tableOrders = new Array();

var currentTableOrder = null;
var totalOrder = null;
var currentOrderItem;

var currentSelectedMenuItemElement;

function getCurrentOrder() {
    if(selectedTable == 0) {
        return currentOrder;
    } else {
        return tableOrders[selectedTable];
    }
    
    return null;
}

function doReceiveTableOrderSync(recvdTerminalID, tableID, tableLabel, terminalEmployeeID, terminalEmployee, tableOrderDataJSON) {
    //save the current users table order to reload it after sync
    savedTableID = selectedTable;
    
    for (var i = 0; i < employees.length; i++) {
        nextUserIDToSyncWith = employees[i].id;
        
        //skip if terminal and user same
        if(recvdTerminalID == terminalID && terminalEmployeeID == nextUserIDToSyncWith) {
            continue;
        }
        
        doTableOrderSync(recvdTerminalID, tableID, tableLabel, terminalEmployee, tableOrderDataJSON, nextUserIDToSyncWith);
    }
    
    if(callHomePollInitSequenceComplete) {
        checkForItemsToPrint(tableOrderDataJSON, tableOrderDataJSON.items, terminalEmployee, recvdTerminalID);
        
        //we don't want to show the initial messages as there may be a few of them
        if(recvdTerminalID != terminalID) {
            setStatusMessage("<b>" + terminalEmployee + "</b> modified the order for table <b>" 
                + tableLabel + "</b> from terminal <b>" + recvdTerminalID + "</b>");
        }
    }
    
    newlyAdded = addActiveTable(tableID);
        
    if(newlyAdded) {
        renderActiveTables();
    }
    
    if(current_user_id) {
        //now load back up the current users order
        getTableOrderFromStorage(current_user_id, savedTableID);
    }
}

function doTableOrderSync(recvdTerminalID, tableID, tableLabel, terminalEmployee, tableOrderDataJSON, nextUserIDToSyncWith) {
    //the order is in json form, we need to turn it back into an array
    syncOrderItems = new Array();
    
    for(var itemKey in tableOrderDataJSON.items) {
        //        alert(tableOrderDataJSON.items[itemKey].product.name);
        
        var copiedOrderItem = {};
    
        var copiedOrderItemForStore = $.extend(true, copiedOrderItem, tableOrderDataJSON.items[itemKey]);
        
        copiedOrderItemForStore.synced = "true";
        syncOrderItems.push(copiedOrderItemForStore);
    }
    
    //    alert("Order for sync has " + syncOrderItems.length + " items. About to sync with existing " + tableOrders[tableID].items.length + " items");
    
    getTableOrderFromStorage(nextUserIDToSyncWith, tableID);
    
    //delete all items that have been synced already
    existingOrderItems = tableOrders[tableID].items;
    
    for(i=0;i<existingOrderItems.length;i++) {
        if(existingOrderItems[i].synced) {
            //            alert("deleting already synced item " + i + " " + existingOrderItems[i].synced);
            existingOrderItems.splice(i, 1);
            i--;
        }
    }
    
    //now merge the two based on time added
    newOrderItems = new Array();
    syncOrderItemsIndex = 0;
    existingOrderItemsIndex = 0;
    
    loopLength = syncOrderItems.length + existingOrderItems.length;
    
    for(i=0;i<loopLength;i++) {
        if(syncOrderItemsIndex == syncOrderItems.length) {
            //there are no more items left in syncOrderItems
            newOrderItems.push(existingOrderItems[existingOrderItemsIndex]);
            existingOrderItemsIndex++;
        } else if(existingOrderItemsIndex == existingOrderItems.length) {
            //there are no more items left in existingOrderItems
            newOrderItems.push(syncOrderItems[syncOrderItemsIndex]);
            syncOrderItemsIndex++;
        } else if(syncOrderItems[syncOrderItemsIndex].time_added <= existingOrderItems[existingOrderItemsIndex].time_added) {
            newOrderItems.push(syncOrderItems[syncOrderItemsIndex]);
            syncOrderItemsIndex++;
        } else if(syncOrderItems[syncOrderItemsIndex].time_added > existingOrderItems[existingOrderItemsIndex].time_added) {
            newOrderItems.push(existingOrderItems[existingOrderItemsIndex]);
            existingOrderItemsIndex++;
        }
    }
    
    tableOrders[tableID].items = newOrderItems;
    
    //alert("new order items length: " + tableOrders[tableID].items.length);
    //re number the items
    for(i=0;i<tableOrders[tableID].items.length;i++) {
        tableOrders[tableID].items[i].itemNumber = i + 1;
    }
    
    //copy over the order number
    tableOrders[tableID].order_num = tableOrderDataJSON.order_num;
    //alert("OrderNum: " + tableOrders[tableID].order_num);
    
    //copy over the discount
    tableOrders[tableID].discount_percent = tableOrderDataJSON.discount_percent;
    
    calculateOrderTotal(tableOrders[tableID]);
    storeTableOrderInStorage(nextUserIDToSyncWith, tableID, tableOrders[tableID]);
    
    if(tableID == selectedTable && nextUserIDToSyncWith == current_user_id) {
        loadReceipt(tableOrders[tableID]);
    }
}

function checkForItemsToPrint(orderJSON, items, serverNickname, recvdTerminalID) {
    //alert("TID:" + terminalID);
    
    var itemsToPrint = new Array();
    
    var icount = 0;
    var pushcount = 0;
    
    for(var itemKey in items) {
        icount++;
        
        //we only want to print items from the order that are new i.e. not synced on the other terminal yet
        var isItemSynced = (items[itemKey].synced === 'true');
        
        console.log(items[itemKey].synced + " "  + isItemSynced);
        if(!isItemSynced) {
            var itemPrinters = items[itemKey].product.printers;
            console.log(items[itemKey].product.printers + " " + terminalID);
            if((typeof itemPrinters != "undefined") && itemPrinters.length > 0) {
                var printersArray = itemPrinters.split(",");
                console.log(printersArray + " " + $.inArray(terminalID, printersArray));
                if($.inArray(terminalID.toLowerCase(), printersArray) != -1) {
                    pushcount++;
                    itemsToPrint.push(items[itemKey]);
                }
            } 
        }
    }
    
    console.log("Got" + icount + " items, pushed " + pushcount);
    
    if(itemsToPrint.length > 0) {
        console.log("printing " + itemsToPrint.length + " items");
        printItemsFromOrder(serverNickname, recvdTerminalID, orderJSON, itemsToPrint);
    }
}

function doReceiveClearTableOrder(recvdTerminalID, tableID, tableLabel, terminalEmployeeID, terminalEmployee) {
    //save the current users table order to reload it after sync
    savedTableID = selectedTable;
    
    for (var i = 0; i < employees.length; i++){
        nextUserIDToSyncWith = employees[i].id;
        
        //skip if terminal and user same
        //        alert("Skip? user id: " + terminalEmployeeID + " - " + nextUserIDToSyncWith + " : terminal id: " + recvdTerminalID + " - " + terminalID);
        //        if(recvdTerminalID == terminalID && terminalEmployeeID == nextUserIDToSyncWith) {
        //            alert("Skipping for user id: " + nextUserIDToSyncWith);
        //            continue;
        //        }
        
        doClearTableOrder(recvdTerminalID, tableID, tableLabel, terminalEmployee, nextUserIDToSyncWith);
    }
    
    //we don't want to show the initial messages as there may be a few of them
    if(callHomePollInitSequenceComplete && recvdTerminalID != terminalID) {
        setStatusMessage("<b>" + terminalEmployee + "</b> totalled the order for table <b>" + tableLabel + "</b> from terminal <b>" + recvdTerminalID + "</b>");
    }
    
    //remove the table from the active table ids array
    newlyRemoved = removeActiveTable(tableID);
    
    //alert("Newly Removed " + selectedTable + " " + newlyRemoved);
    
    if(newlyRemoved) {
        renderActiveTables();
    }
    
    if(current_user_id) {
        //now load back up the current users order
        getTableOrderFromStorage(current_user_id, savedTableID);
    }
}

function doClearTableOrder(recvdTerminalID, tableID, tableLabel, terminalEmployee, nextUserIDToSyncWith) {
    //save the current users table order to reload it after sync
    savedTableID = selectedTable;
    
    doClear = true;
    
    //only clear the order on this users receipt if they have no unsynced items
    getTableOrderFromStorage(nextUserIDToSyncWith, tableID);
    
    //delete all items that have been synced already
    existingOrderItems = tableOrders[tableID].items;
    
    for(i=0;i<existingOrderItems.length;i++) {
        if(!existingOrderItems[i].synced) {
            doClear = false;
            break;
        }
    }
    
    if(doClear) {
        tableOrders[tableID] = {
            'items': new Array(),
            'total':0
        };
        
        clearTableOrderInStorage(nextUserIDToSyncWith, tableID);
        
        if(tableID == selectedTable && nextUserIDToSyncWith == current_user_id) {
            loadReceipt(tableOrders[tableID]);
        }
    }
}

function calculateOrderTotal(order) {
    if(!order) return;
    
    orderTotal = 0;

    for(i=0; i<order.items.length; i++) {
        item = order.items[i];
        orderTotal += parseFloat(item['total_price']);
    }

    order['total'] = orderTotal;

    //apply the discount if there is one
    discountAmount = order['discount_percent'];

    if(discountAmount) {
        //store the pre discount price 
        oldPrice = order['pre_discount_price'] = orderTotal;
        
        newPrice = oldPrice - ((oldPrice * discountAmount) / 100);
        order['total'] = newPrice;
    }
}

//a full list of receipts in the system across all interfaces
function initTouchRecpts() {
    //mobile receipts
    $('#mobile_terminal_till_roll').touchScroll();
    $('#mobile_server_till_roll').touchScroll();
    $('#mobile_table_till_roll').touchScroll();
    
    //large screen interface receipts
    $('.large_interface #till_roll').touchScroll();
    $('.large_interface #login_till_roll').touchScroll();
    $('.large_interface #totals_till_roll').touchScroll();
    $('.large_interface #reports_center_till_roll').touchScroll();
    $('.large_interface #reports_left_till_roll').touchScroll();
    $('.large_interface #float_till_roll').touchScroll();
    $('.large_interface #admin_order_list_till_roll').touchScroll();
    
    //medium screen interface receipts
    $('.medium_interface #menu_screen_till_roll').touchScroll();
}

function buildOrderItem(product, amount) {
    if(taxChargable) {
        taxRate = -1;
    } else {
        taxRate = product.tax_rate;
    }
    
    orderItem = {
        'amount':amount,
        'product':product,
        'tax_rate':taxRate,
        'product_price':product.price,
        'total_price':(product.price*amount)
    }

    //store the terminal id 
    orderItem['terminal_id'] = terminalID;
    
    //either way we want to store the user id
    orderItem['serving_employee_id'] = current_user_id;
    orderItem['time_added'] = new Date().getTime();

    currentOrderItem = orderItem;
}

function addItemToOrderAndSave(orderItem) {
    //mark the item as synced as we are not on a table receipt
    orderItem.synced = true;

    //lazy init currentOrder
    if(currentOrder == null) {
        currentOrder = {
            'items': new Array(),
            'total':0
        };
    }

    //attach the item number to the order item 
    //which is its number in the receipt
    orderItem.itemNumber = currentOrder.items.length + 1;
    
    //add this item to the order array
    currentOrder.items.push(orderItem);
    
    calculateOrderTotal(currentOrder);

    storeOrderInStorage(current_user_id, currentOrder);
}

function addItemToTableOrderAndSave(orderItem) {
    //mark as unsynced
    orderItem['synced'] = false;

    //add this item to the order array
    currentTableOrder = tableOrders[selectedTable];

    //attach the item number to the order item 
    //which is its number in the receipt
    orderItem.itemNumber = currentTableOrder.items.length + 1;
    
    currentTableOrder.items.push(orderItem);

    calculateOrderTotal(currentTableOrder);

    storeTableOrderInStorage(current_user_id, selectedTable, currentTableOrder);
    
    //add a line to the receipt
    writeOrderItemToReceipt(orderItem);
}

//load the current bar receipt order into memory
function loadCurrentOrder() {
    //retrieve the users current order from cookie
    currentOrder = getOrderFromStorage(current_user_id);
}

function recptScroll(targetPrefix) {
    $('#' + targetPrefix + 'till_roll').touchScroll('update');

    currentHeight = $('#' + targetPrefix + 'till_roll').height();
    scrollHeight = $('#' + targetPrefix + 'till_roll').attr('scrollHeight');
    newHeight = scrollHeight - currentHeight;

    //need an offset
    if(newHeight != 0) {
        newHeight -= 20;
    }

    if(!isTouchDevice()) {
        //this code is for pc based browsers
        $('#' + targetPrefix + 'receipt').scrollTop(currentHeight);
    } else {
        $('#' + targetPrefix + 'till_roll').touchScroll('setPosition', newHeight);
    }
}

function doSelectTable(tableNum) {
    selectedTable = tableNum;
    
    //write to storage that this user was last looking at this receipt
    storeLastReceipt(current_user_id, tableNum);

    if(tableNum == 0) {
        currentSelectedRoom = 0;
        
        loadCurrentOrder();
        
        //total the order first
        calculateOrderTotal(currentOrder);
        
        loadReceipt(currentOrder);
        return;
    }
    
    if(tableNum == -1) {
        currentSelectedRoom = -1;
    } else {
        currentSelectedRoom = tables[tableNum].room_id;
    }

    //fetch this tables order from storage
    //this will fill the tableOrders[tableNum] variable
    getTableOrderFromStorage(current_user_id, selectedTable);

    //display the receipt for this table
    loadReceipt(tableOrders[tableNum]);
}

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
        
        location = location + "?reset_session=true";
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
        'total':0
    };
    
    //console.log("filling table order " + tableNum);
    
    //fill in the table order array
    if(currentTableOrderJSON != null) {
        for(i=0; i<currentTableOrderJSON.items.length; i++) {
            //alert("in: " + currentTableOrderJSON.items[i].itemNumber);
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
        
        if(currentTableOrderJSON.discount_percent) {
            tableOrders[tableNum].discount_percent = currentTableOrderJSON.discount_percent;
            tableOrders[tableNum].pre_discount_price = currentTableOrderJSON.pre_discount_price;
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

var current_user_id;
var current_user_nickname;
var current_user_is_admin;
var current_user_passcode;

var lastActiveElement;

var callHomePollInitSequenceComplete = false;
var callHome = true;

function callHomePoll() {
    if(!callHome) return;
    
    callHomeURL = "/call_home.js"
    
    currentTerminalRecptHTML = "";
    
    if(getCurrentOrder()) {
        currentTerminalRecptHTML = getCurrentRecptHTML();
    }
    
    currentTableLabel = "";
    
    if(selectedTable != -1 && selectedTable != 0) {
        currentTableLabel = tableInfoLabel = tables[selectedTable].label;
    }
    
    $.ajax({
        url: callHomeURL,
        type : "POST",
        dataType: 'script',
        success: callHomePollComplete,
        error: function() {
            setTimeout(callHomePoll, 5000);
        },
        data : {
            lastInterfaceReloadTime : lastInterfaceReloadTime,
            lastSyncTableOrderTime : lastSyncTableOrderTime,
            currentTerminalUser : current_user_id,
            currentTerminalRecptHTML : currentTerminalRecptHTML,
            currentTerminalRecptTableLabel : currentTableLabel
        }
    });
}

var immediateCallHome = false;

function callHomePollComplete() {
    if(immediateCallHome) {
        callHomePoll();
    } else {
        callHomePollInitSequenceComplete = true;
        setTimeout(callHomePoll, pollingAmount);
    }
}

function storeLastReceipt(user_id, table_num) {
    storeKeyJSONValue("user_" + user_id + "_last_receipt", {
        'table_num':table_num
    });
}

function fetchLastReceiptID() {
    //retrieve the users last receipt from storage
    var lastReceiptIDOBJ = retrieveStorageJSONValue("user_" + current_user_id + "_last_receipt");
 
    var lastReceiptID = null;
 
    if(lastReceiptIDOBJ == null) {
        lastReceiptID = 0;
    } else {
        lastReceiptID = lastReceiptIDOBJ.table_num;
    }

    //last receipt is a number of a table or 0 for the current order
//    if(lastReceiptID == 0) {
//        order = currentOrder;
//    } else {
//        order = tableOrders[lastReceiptID];
//    }
    
    return lastReceiptID;
}