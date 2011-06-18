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

function showLoginScreen() {
    hideAllScreens();
    $('#landing').show();
    loginRecptScroll();
}

function showMenuScreen() {
    hideAllScreens();
    $('#menu_screen').show();
}

function showTablesScreen() {
    hideAllScreens();
    $('#table_select_screen').show();
    initTableSelectScreen();
}

function showTotalsScreen() {
    hideAllScreens();
    $('#total_screen').show();
}

function showMoreOptionsScreen() {
    hideAllScreens();
    $('#more_options').show();
}

function hideAllScreens() {
    $('#landing').hide();
    $('#menu_screen').hide();
    $('#table_select_screen').hide();
    $('#total_screen').hide();
    $('#more_options').hide();
        
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