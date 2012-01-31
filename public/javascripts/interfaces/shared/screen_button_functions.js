var lastSyncedOrder = null;
var orderInProcess = false;

function doSyncTableOrder() {
    if(!ensureLoggedIn()) {
        return;
    }
    
    if(!callHomePollInitSequenceComplete) {
        niceAlert("Downloading data from server, please wait.");
        return;
    }
    
    if(orderInProcess) {
        niceAlert("There is an order being processed, please wait.");
        return;
    }
    
    if(selectedTable == -1) {
        setStatusMessage("Not valid for reopened orders!");
        return;
    } else if(selectedTable == 0) {
        startTransferOrderMode();
        return;
    } else {
        lastOrderSaleText = "Last Order";
        
        order = tableOrders[selectedTable];
        if(order.items.length == 0) {
            setStatusMessage("No items present in current table order.");
            return;
        }
    }
    
    setStatusMessage("Sending Order.");
    
    orderInProcess = true;
    
    lastSyncedOrder = order;
    
    order.table = tables[selectedTable].label;
    
    //add the serverAddedText to the first non synced item
    var checkForShowServerAddedText = true;
    
    //mark all items in this order as synced
    for(var i=0; i<order.items.length; i++) {
        if(checkForShowServerAddedText && !order.items[i].synced) {
            order.items[i].showServerAddedText = true;
            checkForShowServerAddedText = false;
        }
    }
    
    var copiedOrder = {};
    
    var copiedOrderForSend = $.extend(true, copiedOrder, order);

    tableOrderData = {
        tableID : selectedTable,
        orderData : copiedOrderForSend
    }
    
    $.ajax({
        type: 'POST',
        url: '/sync_table_order',
        error: syncTableOrderFail,
        success: finishSyncTableOrder,
        data: {
            tableOrderData : tableOrderData,
            employee_id : current_user_id
        }
    });
}

function finishSyncTableOrder() {
    var order = lastSyncedOrder;
    
    //mark all items in this order as synced
    for(var i=0; i<order.items.length; i++) {
        order.items[i]['synced'] = true;
    }
    
    //store the order in the cookie
    storeTableOrderInStorage(current_user_id, selectedTable, order);
    
    orderInProcess = false;
    
    postDoSyncTableOrder();
}

function syncTableOrderFail() {
    orderInProcess = false;
    
    niceAlert("Order not sent, no connection, please try again");
}

function removeLastOrderItem() {
    currentSelectedReceiptItemEl = getSelectedOrLastReceiptItem();
    
    if(currentSelectedReceiptItemEl) {
        removeSelectedOrderItem();
    }
    
    currentSelectedReceiptItemEl = null;
}

function quickSale() {
    if(currentOrderEmpty()) {
        setStatusMessage("No order present to total!", true, true);
        return;
    }
    
    if(!ensureLoggedIn()) {
        return;
    }
    
    applyDefaultServiceChargePercent();
    doTotalFinal();
}

function printBill() {
    applyDefaultServiceChargePercent();
    
    totalOrder = getCurrentOrder();
    
    if(orderEmpty(totalOrder)) {
        setStatusMessage("No order present");
        return;
    }
    
    //don't print vat on this receipt
    var printVat = false;
    
    printReceipt(fetchFinalReceiptHTML(true, false, printVat), true);
}

function applyDefaultServiceChargePercent() {
    serviceCharge = (defaultServiceChargePercent * parseFloat(getCurrentOrder().total))/100;
    saveServiceCharge(false);
}

function startTransferOrderMode() {
    if(!callHomePollInitSequenceComplete) {
        niceAlert("Downloading data from server, please wait.");
        return;
    }
    
    if(selectedTable == -1) {
        setStatusMessage("Only valid for table orders!");
        return;
    }
    
    var order = getCurrentOrder();
    
    if(order.items.length == 0) {
        setStatusMessage("No items present in current table order.");
        return;
    }
    
    //make sure all items in this order have already been ordered
    var orderSynced = true;
    
    for(var i=0; i<order.items.length; i++) {
        if(!order.items[i].synced) {
            orderSynced = false;
            break;
        }
    }
    
    if(!orderSynced && selectedTable != 0) {
        niceAlert("All items in the order must be ordered before you can transfer. You can also delete un-ordered items.");
        return;
    }
    
    inTransferOrderMode = true;
    
    showTablesScreen();
    setStatusMessage("Please choose a free table to transfer this order to.", false, false);
}

function startTransferOrderItemMode() {
    if(!callHomePollInitSequenceComplete) {
        niceAlert("Downloading data from server, please wait.");
        return;
    }
    
    //only allow transfer if the item has already been orderd
    var itemNumber = currentSelectedReceiptItemEl.data("item_number");
      
    var order = getCurrentOrder();

    if(!order.items[itemNumber-1]['synced']) {
        niceAlert("Only ordered items can be transfered.");
        return;
    }
    
    inTransferOrderItemMode = true;
    
    hideBubblePopup(editItemPopupAnchor);
    showTablesScreen();
    setStatusMessage("Please choose a table to transfer this order item to.", false, false);
}

function toggleMenuItemDoubleMode() {
    setMenuItemDoubleMode(!menuItemDoubleMode);
}

function setMenuItemDoubleMode(turnOn) {
    if(turnOn) {
        menuItemDoubleMode = true;
        $('.button[id=sales_button_' + toggleMenuItemDoubleModeButtonID + ']').addClass("selected");
    } else {
        menuItemDoubleMode = false;
        $('.button[id=sales_button_' + toggleMenuItemDoubleModeButtonID + ']').removeClass("selected");
    }
}