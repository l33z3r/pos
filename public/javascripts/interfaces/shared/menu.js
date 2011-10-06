var currentMenuPage;

var selectedTable = 0;
var currentOrder = null;
var tableOrders = new Array();

var currentTableOrder = null;
var totalOrder = null;
var currentOrderItem;

var currentSelectedMenuItemElement;

var oiaIsAdd = true;

function getCurrentOrder() {
    if(selectedTable == 0) {
        return currentOrder;
    } else {
        return tableOrders[selectedTable];
    }
    
    return null;
}

function doReceiveTableOrderSync(recvdTerminalID, tableID, tableLabel, terminalEmployeeID, terminalEmployee, tableOrderDataJSON) {
    //console.log("order num " + tableOrderDataJSON.order_num);
    
    if(lastSyncedOrder) {
        //set the order id on the lastSyncedOrder variable so that it prints on the login receipt
        lastSyncedOrder.order_num = tableOrderDataJSON.order_num;
    }
    
    //save the current users table order to reload it after sync
    savedTableID = selectedTable;
    
    for(var i = 0; i < employees.length; i++) {
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
    //        if(recvdTerminalID != terminalID) {
    //            setStatusMessage("<b>" + terminalEmployee + "</b> modified the order for table <b>" 
    //                + tableLabel + "</b> from terminal <b>" + recvdTerminalID + "</b>");
    //        }
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
        //console.log("OIAITEMS: " + tableOrderDataJSON.items[itemKey].oia_items + " " + (tableOrderDataJSON.items[itemKey].oia_items.length>0));
        
        if(typeof(tableOrderDataJSON.items[itemKey].oia_items) != "undefined") {
            //we must convert the oia_items hash to an array (the server turned our array into some indexed hash
            var newOIAItems = new Array();
        
            for(var oiaItemKey in tableOrderDataJSON.items[itemKey].oia_items) {
                var nextOIA = tableOrderDataJSON.items[itemKey].oia_items[oiaItemKey];
                //console.log("copying oia " + oiaItemKey + " " + nextOIA);
            console.log(nextUserIDToSyncWith + " Is add " + nextOIA.description + " " + nextOIA.is_add.toString() + " " + (nextOIA.is_add.toString() == "true"));
                //make sure the data types are converted correctly
                nextOIA.is_add = (nextOIA.is_add.toString() == "true" ? true : false);
                nextOIA.is_note = (nextOIA.is_note.toString() == "true" ? true : false);
                nextOIA.abs_charge = parseFloat(nextOIA.abs_charge);
            
                newOIAItems.push(nextOIA);
            }
        
            tableOrderDataJSON.items[itemKey].oia_items = newOIAItems;
        }
    
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
        
        //console.log(items[itemKey].synced + " "  + isItemSynced);
        if(!isItemSynced) {
            var itemPrinters = items[itemKey].product.printers;
            //console.log(items[itemKey].product.printers + " " + terminalID);
            if((typeof itemPrinters != "undefined") && itemPrinters.length > 0) {
                var printersArray = itemPrinters.split(",");
                //console.log(printersArray + " " + $.inArray(terminalID, printersArray));
                if($.inArray(terminalID.toLowerCase(), printersArray) != -1) {
                    pushcount++;
                    itemsToPrint.push(items[itemKey]);
                }
            } 
        }
    }
    
    //console.log("Got" + icount + " items, pushed " + pushcount);
    
    if(itemsToPrint.length > 0) {
        //console.log("printing " + itemsToPrint.length + " items");
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
    //    if(callHomePollInitSequenceComplete && recvdTerminalID != terminalID) {
    //        setStatusMessage("<b>" + terminalEmployee + "</b> totalled the order for table <b>" + tableLabel + "</b> from terminal <b>" + recvdTerminalID + "</b>");
    //    }
    
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
    //console.log("Updating receipt: " + '#' + targetPrefix + 'till_roll');
    
    if(isTouchDevice()) {
        $('#' + targetPrefix + 'till_roll').touchScroll('update');
        
        currentHeight = $('#' + targetPrefix + 'till_roll').height();
        scrollHeight = $('#' + targetPrefix + 'till_roll').attr('scrollHeight');
        newHeight = scrollHeight - currentHeight;
    
        $('#' + targetPrefix + 'till_roll').touchScroll('setPosition', newHeight);
    
    } else {
        newHeight = $('#' + targetPrefix + 'receipt').attr('scrollHeight');
        $('#' + targetPrefix + 'receipt').scrollTop(newHeight);
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
    
    postDoSelectTable();
}