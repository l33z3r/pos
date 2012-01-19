function prepareXTotal() {
    var doIt = true;
    
    if(doIt) {
        doCashTotalReport("X", false);
    }
}

function prepareZTotal() {
    var doIt = checkAllOrdersClosedForCashTotal();
    
    if(doIt || bypassOpenOrdersForCashTotal) {
        doCashTotalReport("Z", false);
    }
}

function checkAllOrdersClosedForCashTotal() {
    var allOrdersClosed = (!currentOrder || currentOrder.items.length == 0) && getActiveTableIDS().length == 0;
    
    if(!allOrdersClosed) {
        setStatusMessage("All Orders Must Be Closed!", true, true);
        return false;
    }
    
    return true;
}

function printCurrentReceipt() {
    if(currentOrderEmpty()) {
        setStatusMessage("No order present to print!");
        return;
    }
    
    content = fetchOrderReceiptHTML(getCurrentOrder());
    
    printReceipt(content, false);
}

function printLastReceipt() {
    lastSaleInfo = getLastSaleInfo();
    content = fetchBusinessInfoHeaderHTML() + lastSaleInfo.contentHTML;
    printReceipt(content, true);
}

function promptForServiceCharge() {
    if(currentOrderEmpty()) {
        setStatusMessage("No order present!", true, true);
        return;
    }
    
    popupHTML = $("#service_charge_popup_markup").html();
        
    if(currentScreenIsMenu()) {
        popupEl = showMenuScreenDefaultPopup(popupHTML);
    } else if (currentScreenIsTotals()) {
        popupEl = showTotalsScreenDefaultPopup(popupHTML);
    }
        
    popupId = popupEl.GetBubblePopupID();
    
    keypadPosition = $('#' + popupId).find('.service_charge_popup_keypad_container');
    
    //    clickFunction = function(val) {
    //        if(serviceCharge == 0) serviceCharge = "";
    //        
    //        serviceCharge = serviceCharge.toString() + val;
    //        
    //        $('#' + popupId).find('.service_charge_popup_amount').html(serviceCharge);
    //    };
    clickFunction = null;
    
    cancelFunction = function() {
        alert("ok");
        oldVal = $('#' + popupId).find('.service_charge_popup_amount').html();
        newVal = oldVal.substring(0, oldVal.length - 1);
        $('#' + popupId).find('.service_charge_popup_amount').html(newVal);
        
        if(newVal == "") newVal = 0;
        
        serviceCharge = parseFloat(newVal);
    };
    
    var popupEl = $('#' + popupId);
    
    setDefaultServiceChargeButtonSelected(popupEl, defaultServiceChargePercent);
    
    serviceCharge = number_to_currency(serviceCharge);
    
    popupEl.find('.service_charge_popup_amount').html(serviceCharge);
    
    setUtilKeypad(keypadPosition, clickFunction, cancelFunction);
}

function saveServiceCharge(performTotal) {
    serviceCharge = parseFloat(serviceCharge);
    
    if(isNaN(serviceCharge)) {
        serviceCharge = 0;
    }
    
    //save the cashback in the order
    order = getCurrentOrder();
    order.service_charge = serviceCharge;
    
    //store the modified order
    if(selectedTable != 0) {
        storeTableOrderInStorage(current_user_id, selectedTable, order);
    }else {
        storeOrderInStorage(current_user_id, order);
    }
    
    hideServiceChargePopup();
    
    if(performTotal) {
        doTotal(false);
    }
}

function setServiceCharge() {
    popupEl = $('#totals_screen_default_popup_anchor');
    popupId = popupEl.GetBubblePopupID();
    var popupEl = $('#' + popupId);
    
    serviceCharge = parseFloat(popupEl.find('.service_charge_popup_amount').html());
    
    if(isNaN(serviceCharge)) {
        serviceCharge = 0;
    }
    
    saveServiceCharge(true);
}

function cancelServiceCharge() {
    //reset the sercice charge
    if(selectedTable == 0 || typeof tableOrders[selectedTable].service_charge == "undefined") {
        serviceCharge = 0;
    } else {
        serviceCharge = tableOrders[selectedTable].service_charge;
    }
    
    hideServiceChargePopup();
}

function hideServiceChargePopup() {
    hideTotalsScreenDefaultPopup();
}

function presetServiceChargePercentageClicked(percentage) {
    defaultServiceChargePercent = percentage;
    
    if(currentOrderEmpty()) {
        serviceCharge = 0;
    } else {
        serviceCharge = currency((percentage * parseFloat(getCurrentOrder().total))/100, false);
    }
    
    popupEl = $('#totals_screen_default_popup_anchor');
    popupId = popupEl.GetBubblePopupID();
    var popupEl = $('#' + popupId);
    
    popupEl.find('.service_charge_popup_amount').html(serviceCharge);
    
    setDefaultServiceChargeButtonSelected(popupEl, percentage);
}

function setDefaultServiceChargeButtonSelected(popupEl, percentage) {
    popupEl.find('.service_charge_button_percent').removeClass("selected");
    
    percentage = parseFloat(percentage);
    var percentage_without_decimal = percentage.toString().replace(".", "");
    
    popupEl.find('#service_charge_button_percent_' + percentage_without_decimal).addClass("selected");
}

function promptForCashback() {
    if(currentOrderEmpty()) {
        setStatusMessage("No order present!", true, true);
        return;
    }
    
    popupHTML = $("#cashback_popup_markup").html();
        
    popupEl = showTotalsScreenDefaultPopup(popupHTML);
       
    popupId = popupEl.GetBubblePopupID();
    
    keypadPosition = $('#' + popupId).find('.cashback_popup_keypad_container');
    
    clickFunction = function(val) {
        if(cashback == 0) cashback = "";
        
        cashback = cashback.toString() + val;
        
        $('#' + popupId).find('.cashback_popup_amount').html(cashback);
    };
    
    cancelFunction = function() {
        oldVal = $('#' + popupId).find('.cashback_popup_amount').html();
        newVal = oldVal.substring(0, oldVal.length - 1);
        $('#' + popupId).find('.cashback_popup_amount').html(newVal);
        
        if(newVal == "") newVal = 0;
        
        cashback = parseFloat(newVal);
    };
    
    $('#' + popupId).find('.cashback_popup_amount').html(cashback);
    
    setUtilKeypad(keypadPosition, clickFunction, cancelFunction);
}

function saveCashback() {    
    cashback = parseFloat(cashback);
    
    if(isNaN(cashback)) {
        cashback = 0;
    }
    
    //save the cashback in the order
    order = getCurrentOrder();
    order.cashback = cashback;
    
    //store the modified order
    if(selectedTable != 0) {
        storeTableOrderInStorage(current_user_id, selectedTable, order);
    }else {
        storeOrderInStorage(current_user_id, order);
    }
    
    hideCashbackPopup();
    
    if (currentScreenIsTotals()) {
        doTotal(false);
    }
}

function cancelCashback() {
    //reset the cashback
    if(selectedTable == 0 || typeof tableOrders[selectedTable].cashback == "undefined") {
        cashback = 0;
    } else {
        cashback = tableOrders[selectedTable].cashback;
    }
    
    hideServiceChargePopup();
}

function hideCashbackPopup() {
    hideTotalsScreenDefaultPopup();
}

function presetCashbackAmountClicked(amount) {
    cashback = amount;
    
    popupEl = $('#totals_screen_default_popup_anchor');
        
    popupId = popupEl.GetBubblePopupID();
    
    $('#' + popupId).find('.cashback_popup_amount').html(cashback);
}

var floatTotal = 0;

function initFloatScreen() {
    setNavTitle("Add Float");
    showNavBackLinkMenuScreen();
    
    coinCounterPosition = $('#float_coin_counter_widget_container');
    
    totalFunction = function(total) {
        floatTotal = total;
    };
    
    setUtilCoinCounter(coinCounterPosition, totalFunction);
    
    doCoinCounterTotal();
    
    $('#float_till_roll').html("Loading...");
    
    showFloatScreen();
    
    //show the last float and z total
    $.ajax({
        type: 'GET',
        url: '/float_history.js'
    }); 
}

function markFreeLastOrderItem() {
    order = getCurrentOrder();
    
    currentSelectedReceiptItemEl = getSelectedOrLastReceiptItem();
    
    if(currentSelectedReceiptItemEl) {
        itemNumber = currentSelectedReceiptItemEl.data("item_number");
        applyDiscountToOrderItem(order, itemNumber, 100);
    
        //store the modified order
        if(selectedTable != 0) {
            storeTableOrderInStorage(current_user_id, selectedTable, order);
        }else {
            storeOrderInStorage(current_user_id, order);
        }
    
        //redraw the receipt
        loadReceipt(order, true);
    }
    
    currentSelectedReceiptItemEl = null;
}

function changePriceLastOrderItem() {
    order = getCurrentOrder();
    
    currentSelectedReceiptItemEl = getSelectedOrLastReceiptItem();
    
    if(currentSelectedReceiptItemEl) {
        //must set a timeout here so that if we are on the more 
        //options screen, the widths have time to calculate correctly
        var popup = doSelectReceiptItem(currentSelectedReceiptItemEl);
        popup.find('.price').focus();
    }
}

function showAddNoteToOrderItemScreen() {
    order = getCurrentOrder();
    
    currentSelectedReceiptItemEl = getSelectedOrLastReceiptItem();
    
    if(currentSelectedReceiptItemEl) {
        if(currentScreenIsMenu()) {
            if(currentMenuSubscreenIsModifyOrderItem()) {
                if(doSaveNote()) {
                    $('.button[id=sales_button_' + addNoteButtonID + ']').removeClass("selected");
                    resetKeyboard();
                    switchToMenuItemsSubscreen();
                }
            } else {
                hideAllMenuSubScreens();
                $('#order_item_additions').show();
                doOpenOIANoteScreen();
            }
        }
        
    }
}

function showGlobalSettingsPage() {
    goTo('/admin/global_settings');
}

function openCashDrawer() {
    var cash_drawer_service_url = 'http://' + webSocketServiceIP + ':8080/ClueyWebSocketServices/cash_drawer_controller';
    
    $.ajax({
        type: 'POST',
        url: '/forward_cash_drawer_request',
        error: function() {
            setStatusMessage("Error Sending Data To Cash Drawer Service. URL: " + cash_drawer_service_url, false, false);
        },
        data: {
            cash_drawer_service_url : cash_drawer_service_url,
            message : "open cash drawer"
        }
    });
    
    return;
    
    //TODO: display an error if the service is not running...
    
    
    
    
    
    
    
    
    
    if ("WebSocket" in window) {
        console.log("Sending cash drawer message");
        
        // Let us open a web socket
        var ws = new WebSocket("ws://" + webSocketServiceIP + ":8080/ClueyWebSocketServices/cash_drawer_controller");
        
        ws.onopen = function()
        {
            // Web Socket is connected, send data using send()
            ws.send("open cash drawer!");
            console.log("Cash Drawer message sent");
            ws.close();
        };
        
        ws.onmessage = function (evt) 
        { 
            var received_msg = evt.data;
            console.log("Message received: " + received_msg);
        };
        ws.onclose = function()
        { 
            // websocket is closed.
            console.log("Connection closed!"); 
        };
    } else {
        // The browser doesn't support WebSocket
        alert("WebSocket NOT supported by your Browser!");
    
    //DO IT THE OLD FASHIONED WAY
    
    //    //search for "signed.applets.codebase_principal_support" 
    //    //in this list and toggle its value to "true"
    //    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    //
    //    // create an nsILocalFile for the executable
    //    var file = Components.classes["@mozilla.org/file/local;1"]
    //    .createInstance(Components.interfaces.nsILocalFile);
    //    file.initWithPath("c:\\open_cash_drawer.bat");
    //
    //    // create an nsIProcess
    //    var process = Components.classes["@mozilla.org/process/util;1"]
    //    .createInstance(Components.interfaces.nsIProcess);
    //    process.init(file);
    //
    //    // Run the process.
    //    // If first param is true, calling thread will be blocked until
    //    // called process terminates.
    //    // Second and third params are used to pass command-line arguments
    //    // to the process.
    //    var args = [];
    //    process.run(false, args, args.length);
    }
}

var addTableNamePopupEl;
var addTableNamePopupAnchor;

function promptAddNameToTable() {
    if(!callHomePollInitSequenceComplete) {
        niceAlert("Downloading data from server, please wait.");
        return;
    }    
    
    if(selectedTable == 0 || selectedTable == -1) {
        setStatusMessage("Only valid for table orders!");
        return;
    }
    
    var popupHTML = $("#name_table_popup_markup").html();
        
    addTableNamePopupAnchor = $('#receipt');
    
    if(addTableNamePopupAnchor.HasBubblePopup()) {
        addTableNamePopupAnchor.RemoveBubblePopup();
    }
    
    addTableNamePopupAnchor.CreateBubblePopup();
    
    addTableNamePopupAnchor.ShowBubblePopup({
        position: 'right',  
        align: 'top',
        tail	 : {
            align: 'middle'
        },
        innerHtml: popupHTML,
														   
        innerHtmlStyle:{ 
            'text-align':'left'
        },
        
        themeName: 	'all-grey',
        themePath: 	'/images/jquerybubblepopup-theme',
        alwaysVisible: false        
    }, false);
    
    addTableNamePopupAnchor.FreezeBubblePopup();
         
    var popupId = addTableNamePopupAnchor.GetBubblePopupID();
    
    addTableNamePopupEl = $('#' + popupId);
    
    var tableOrder = getCurrentOrder();
    
    if(tableOrder.client_name) {
        addTableNamePopupEl.find('input').val(tableOrder.client_name);
    }
    
    addTableNamePopupEl.find('input').focus();
    
    //show the keyboard
    $('#util_keyboard_container').slideDown(300);
}

function closePromptAddNameToTable() {
    if(addTableNamePopupEl) {
        hideBubblePopup(addTableNamePopupAnchor);
    }
    
    //hide the keyboard
    $('#util_keyboard_container').slideUp(300);
}

function saveAddNameToTable() {
    //do nothing if not table order
    if(selectedTable == 0 || selectedTable == -1) {
        closePromptAddNameToTable();
        return;
    }
    
    var tableOrder = getCurrentOrder();
    
    tableOrder.client_name = addTableNamePopupEl.find("#table_name_input").val().toUpperCase();
    
    closePromptAddNameToTable();
    
    storeTableOrderInStorage(current_user_id, selectedTable, tableOrder);
    
    if(!currentOrderEmpty()) {
        doAutoLoginAfterSync = true;
        doSyncTableOrder();
    } else {
        //must manually set the label
        if(tableOrder.client_name.length > 0) {
            $('#table_label_' + selectedTable).html(tables[selectedTable].label + " (" + tableOrder.client_name + ")");
        }
    }
    
    setStatusMessage("Name added to table");
}