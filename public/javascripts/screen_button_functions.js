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

function promptForServiceCharge() {
    popupHTML = $("#service_charge_popup_markup").html();
        
    popupEl = showMenuScreenDefaultPopup(popupHTML);
    
    clickFunction = function(val) {
        if(val == ".") val = ".0";
        serviceCharge = serviceCharge.toString() + val;
        alert(serviceCharge);
    };
    cancelFunction = function() {
        cancelServiceCharge();
    };
    
    popupId = popupEl.GetBubblePopupID();
    
    keypadPosition = $('#' + popupId).find('.service_charge_popup_keypad_container');
    
    setUtilKeypad(keypadPosition, clickFunction, cancelFunction);
    
//serviceCharge = parseFloat(serviceCharge);
}

function saveServiceCharge() {
    hideMenuScreenDefaultPopup();
}

function cancelServiceCharge() {
    serviceCharge = 0;
    hideMenuScreenDefaultPopup();
}