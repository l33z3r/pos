var lastSyncedOrder = null;

function doSyncTableOrder() {
    if(selectedTable == 0 || selectedTable == -1) {
        setStatusMessage("Only valid for table orders!");
        return;
    } else {
        lastOrderSaleText = "Last Order";
        
        order = tableOrders[selectedTable];
        if(order.items.length == 0) {
            setStatusMessage("No items present in current table order!");
            return;
        }
    }
    
    lastSyncedOrder = order;
    
    order.table = tables[selectedTable].label;
    
    var copiedOrder = {};
    
    var copiedOrderForSend = $.extend(true, copiedOrder, order);

    tableOrderData = {
        tableID : selectedTable,
        orderData : copiedOrderForSend
    }
    
    var checkForShowServerAddedText = true;
    
    //mark all items in this order as synced
    for(var i=0; i<order.items.length; i++) {
        if(checkForShowServerAddedText && !order.items[i].synced) {
            order.items[i].showServerAddedText = true;
            checkForShowServerAddedText = false;
        }
        
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
    
    postDoSyncTableOrder();
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
        
        var currentOrder = getCurrentOrder();
        
        if(!currentOrder.items[itemNumber-1].is_course) {
            currentOrder.items[itemNumber-1].is_course = true;
            currentOrder.courses.push(itemNumber);
            loadReceipt(currentOrder);
        }
    }
}

function printBill() {
    totalOrder = getCurrentOrder();
    
    if(orderEmpty(totalOrder)) {
        setStatusMessage("No order present");
        return;
    }
    
    printReceipt(fetchFinalReceiptHTML(true, false), true);
}