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
    
    if(selectedTable == 0 || selectedTable == -1) {
        setStatusMessage("Only valid for table orders!");
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

function addCourseEndToOrder() {
    var lastReceiptItem = getLastReceiptItem();
 
    if(lastReceiptItem) {
        var itemNumber = lastReceiptItem.data("item_number");
        console.log("adding to " + itemNumber);
        var currentOrder = getCurrentOrder();
        console.log("item " + itemNumber + " is course? " + (currentOrder.items[itemNumber-1].is_course) + " " + (currentOrder.items[itemNumber-1].is_course == true));
        if(!currentOrder.items[itemNumber-1].is_course) {
            currentOrder.items[itemNumber-1].is_course = true;
            currentOrder.courses.push(itemNumber);
            loadReceipt(currentOrder);
        }
    }
}

function quickSale() {
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
    
    printReceipt(fetchFinalReceiptHTML(true, false), true);
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
    
    if(selectedTable == 0 || selectedTable == -1) {
        setStatusMessage("Only valid for table orders!");
        return;
    }
    
    order = tableOrders[selectedTable];
    
    if(order.items.length == 0) {
        setStatusMessage("No items present in current table order.");
        return;
    }
    
    inTransferOrderMode = true;
    
    showTablesScreen();
    setStatusMessage("Please choose a free table to transfer this order to.", false, false);
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