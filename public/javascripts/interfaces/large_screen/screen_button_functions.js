function prepareXTotal() {
    var doIt = true;//checkAllOrdersClosedForCashTotal();
    
    if(doIt) {
        doCashTotalReport("X", false);
    }
}

function prepareZTotal() {
    var doIt = checkAllOrdersClosedForCashTotal();
    
    if(doIt) {
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
    popupHTML = $("#service_charge_popup_markup").html();
        
    if(currentScreenIsMenu()) {
        popupEl = showMenuScreenDefaultPopup(popupHTML);
    } else if (currentScreenIsTotals()) {
        popupEl = showTotalsScreenDefaultPopup(popupHTML);
    }
        
    popupId = popupEl.GetBubblePopupID();
    
    keypadPosition = $('#' + popupId).find('.service_charge_popup_keypad_container');
    
    clickFunction = function(val) {
        if(serviceCharge == 0) serviceCharge = "";
        
        serviceCharge = serviceCharge.toString() + val;
        
        $('#' + popupId).find('.service_charge_popup_amount').html(serviceCharge);
    };
    
    cancelFunction = function() {
        oldVal = $('#' + popupId).find('.service_charge_popup_amount').html();
        newVal = oldVal.substring(0, oldVal.length - 1);
        $('#' + popupId).find('.service_charge_popup_amount').html(newVal);
        
        if(newVal == "") newVal = 0;
        
        serviceCharge = parseFloat(newVal);
    };
    
    console.log("Setting sc: " + serviceCharge);
    $('#' + popupId).find('.service_charge_popup_amount').html(serviceCharge);
    
    setUtilKeypad(keypadPosition, clickFunction, cancelFunction);
}

function saveServiceCharge() {
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
    
    if (currentScreenIsTotals()) {
        doTotal();
    }
}

function cancelServiceCharge() {
    //reset the sercice charge
    if(typeof tableOrders[tableNum].service_charge == "undefined") {
        serviceCharge = 0;
    } else {
        serviceCharge = tableOrders[tableNum].service_charge;
    }
    
    hideServiceChargePopup();
}

function hideServiceChargePopup() {
    if(currentScreenIsMenu()) {
        hideMenuScreenDefaultPopup();
    } else if (currentScreenIsTotals()) {
        hideTotalsScreenDefaultPopup();
    }
}

function presetServiceChargePercentageClicked(percentage) {
    if(currentOrderEmpty()) {
        serviceCharge = 0;
    } else {
        serviceCharge = currency((percentage * parseFloat(getCurrentOrder().total))/100, false);
    }
    
    if(currentScreenIsMenu()) {
        popupEl = $('#menu_screen_default_popup_anchor');
    } else if (currentScreenIsTotals()) {
        popupEl = $('#totals_screen_default_popup_anchor');
    }
        
    popupId = popupEl.GetBubblePopupID();
    
    $('#' + popupId).find('.service_charge_popup_amount').html(serviceCharge);
}

function promptForCashback() {
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
        doTotal();
    }
}

function cancelCashback() {
    //reset the cashback
    if(typeof tableOrders[tableNum].cashback == "undefined") {
        cashback = 0;
    } else {
        cashback = tableOrders[tableNum].cashback;
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
        loadReceipt(order);
    }
    
    currentSelectedReceiptItemEl = null;
}

function showAddNoteToOrderItemScreen() {
    order = getCurrentOrder();
    
    currentSelectedReceiptItemEl = getSelectedOrLastReceiptItem();
    
    if(currentSelectedReceiptItemEl) {
        if(currentScreenIsMenu()) {
            if(currentMenuSubscreenIsModifyOrderItem()) {
                if(doSaveNote()) {
                    $('#sales_button_' + addNoteButtonID).removeClass("selected");
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

function openCashDrawer() {
    
    
    var cash_drawer_service_url = 'http://' + webSocketServiceIP + ':8080/ClueyWebSocketServices/cash_drawer_controller';
    
    $.ajax({
        type: 'POST',
        url: '/forward_cash_drawer_request',
        error: function() {
            alert("Error Sending Data To Cash Drawer Service!");
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