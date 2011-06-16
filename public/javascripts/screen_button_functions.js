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

function showTablesScreen() {
    $('#table_select_screen').show();
    $('#menu_screen').hide();
    initTableSelectScreen();
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
    storeTableOrderInStorage(selectedTable, order);

    $.ajax({
        type: 'POST',
        url: '/sync_table_order',
        data: {
            tableOrderData : tableOrderData
        }
    });
    
    setStatusMessage("Order Sent");

    orderReceiptHTML = fetchOrderReceiptHTML();
    setLoginReceipt("Last Order", orderReceiptHTML);
    
    //pick up the default home screen and load it
    loadAfterSaleScreen();
}