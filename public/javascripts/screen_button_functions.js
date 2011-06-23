function doXTotal() {
    doCashTotalReport("X");
}

function doZTotal() {
    doCashTotalReport("Z");
}

function doCashTotalReport(total_type) {
    $.ajax({
        type: 'POST',
        url: '/cash_total.js',
        data: {
            total_type : total_type
        }
    });
}

function doSyncTableOrder() {
    if(selectedTable == 0) {
        alert("Only valid for table orders!");
        return;
    } else {
        lastOrderSaleText = "Last Order";
        
        order = tableOrders[selectedTable];
        if(order.items.length == 0) {
            alert("No items present in current table order!");
            return;
        }
    }
    
    //alert("Syncing order for table " + selectedTable);
    
    tableOrderData = {
        tableID : selectedTable,
        orderData : order
    }
    
    //mark all items in this order as synced
    for(i=0; i<order.items.length; i++) {
        //alert("item " + order.items[i].itemNumber + " synced?: " + order.items[i]['synced'])
        order.items[i]['synced'] = true;
    }
    
    //store the order in the cookie
    storeTableOrderInStorage(current_user_id, selectedTable, order);

    $.ajax({
        type: 'POST',
        url: '/sync_table_order',
        data: {
            tableOrderData : tableOrderData,
            employee_id : current_user_id
        }
    });
    
    setStatusMessage("Order Sent");

    orderReceiptHTML = fetchOrderReceiptHTML();
    setLoginReceipt("Last Order", orderReceiptHTML);
    
    //redraw the receipt if we dont leave this screen
    //so that the highlighted items are no longer highlighted
    doSelectTable(selectedTable);
    
    //pick up the default home screen and load it
    loadAfterSaleScreen();
}

function printCurrentReceipt() {
    if(currentOrderEmpty()) {
        alert("No order present to print!");
        return;
    }
    
    content = fetchOrderReceiptHTML();
    
    printReceipt(content, false);
}

function printLastReceipt() {
    lastSaleInfo = getLastSaleInfo();
    content = lastSaleInfo.contentHTML;
    
    printReceipt(content, false);
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
    
    $('#' + popupId).find('.service_charge_popup_amount').html(serviceCharge);
    
    setUtilKeypad(keypadPosition, clickFunction, cancelFunction);
}

function saveServiceCharge() {
    serviceCharge = parseFloat(serviceCharge);
    
    if(isNaN(serviceCharge)) {
        serviceCharge = 0;
    }
    
    hideServiceChargePopup();
    
    if (currentScreenIsTotals()) {
        doTotal();
    }
}

function cancelServiceCharge() {
    serviceCharge = 0;
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
    
    hideCashbackPopup();
    
    if (currentScreenIsTotals()) {
        doTotal();
    }
    
    $('#cashback_amount_holder').html(currency(cashback));
}

function cancelCashback() {
    cashback = 0;
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