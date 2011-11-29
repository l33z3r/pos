var currentMenuPage;
var currentMenuPageId;

var currentMenuItemQuantity = "";

var selectedTable = 0;
var currentOrder = null;
var tableOrders = new Array();

var currentTableOrder = null;
var totalOrder = null;
var currentOrderItem;

var currentSelectedMenuItemElement;

var oiaIsAdd = true;

var currentSelectedReceiptItemEl;

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
        //        if(recvdTerminalID == terminalID && terminalEmployeeID == nextUserIDToSyncWith) {
        //            continue;
        //        }
        
        doTableOrderSync(recvdTerminalID, tableID, tableLabel, terminalEmployee, tableOrderDataJSON, nextUserIDToSyncWith);
    }
    
    if(inKitchenContext()) {
        renderReceipt(tableID);
    }
    
    if(callHomePollInitSequenceComplete) {
        checkForItemsToPrint(tableOrderDataJSON, tableOrderDataJSON.items, terminalEmployee, recvdTerminalID);
    }
    
    newlyAdded = addActiveTable(tableID);
    renderActiveTables();
    
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
            //we must convert the oia_items hash to an array (the server turned our array into some indexed hash)
            var newOIAItems = new Array();
        
            for(var oiaItemKey in tableOrderDataJSON.items[itemKey].oia_items) {
                var nextOIA = tableOrderDataJSON.items[itemKey].oia_items[oiaItemKey];
                
                //console.log("copying oia " + oiaItemKey + " " + nextOIA);
                //console.log(nextUserIDToSyncWith + " Is add " + nextOIA.description + " " + nextOIA.is_add.toString() + " " + (nextOIA.is_add.toString() == "true"));
                
                //make sure the data types are converted correctly
                nextOIA.is_add = (nextOIA.is_add.toString() == "true" ? true : false);
                nextOIA.is_note = (nextOIA.is_note.toString() == "true" ? true : false);
                
                nextOIA.hide_on_receipt = (nextOIA.hide_on_receipt.toString() == "true" ? true : false);
                
                nextOIA.abs_charge = parseFloat(nextOIA.abs_charge);
                //console.log("converted abs_charge: " + nextOIA.abs_charge);
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
    
    for(var i=0;i<existingOrderItems.length;i++) {
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
    
    for(var i=0;i<loopLength;i++) {
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
    
    //re number the items
    for(var z=0;i<tableOrders[tableID].items.length;z++) {
        tableOrders[tableID].items[z].itemNumber = z + 1;
    }
    
    //re-apply the discounts
    for(var z=0;i<tableOrders[tableID].items.length;z++) {
        applyExistingDiscountToOrderItem(tableOrders[tableID], tableOrders[tableID].items[z].itemNumber);
    }
    
    //copy over the order number
    tableOrders[tableID].order_num = tableOrderDataJSON.order_num;
    //alert("OrderNum: " + tableOrders[tableID].order_num);
    
    //copy over the discount
    tableOrders[tableID].discount_percent = tableOrderDataJSON.discount_percent;
    
    //copy over the discount
    tableOrders[tableID].service_charge = tableOrderDataJSON.service_charge;
    
    //copy over the discount
    tableOrders[tableID].cashback = tableOrderDataJSON.cashback;
    
    //copy over the courses array
    tableOrders[tableID].courses = tableOrderDataJSON.courses;
    
    //if courses was empty on remote device, then courses will be turned into an empty string by json, so we need to reinit the courses to an empty array 
    if(tableOrders[tableID].courses == "") {
        tableOrders[tableID].courses = new Array();
    }
    
    //turn courses back into integers
    for(var j = 0; j < tableOrders[tableID].courses.length; j++) {
        tableOrders[tableID].courses[j] = parseInt(tableOrders[tableID].courses[j]);
    }
    
    //when we hit order we send the table if embedded in the json, so we must copy it here so that it is save in the web db
    tableOrders[tableID].table = tableOrderDataJSON.table;
    
    calculateOrderTotal(tableOrders[tableID]);
    storeTableOrderInStorage(nextUserIDToSyncWith, tableID, tableOrders[tableID]);
    
    if(tableID == selectedTable && nextUserIDToSyncWith == current_user_id) {
        loadReceipt(tableOrders[tableID]);
    }
}

function checkForItemsToPrint(orderJSON, items, serverNickname, recvdTerminalID) {
    var itemsToPrint = new Array();
    
    //TODO: the course line gets lost when it is not on the item that is going to be printed here...
    
    
    
    
    
    
    
    
    
    
    
    var foundPrinter = false;
    
    for(var itemKey in items) {
        //we only want to print items from the order that are new i.e. not synced on the other terminal yet
        var isItemSynced = (items[itemKey].synced === 'true');
        
        if(!isItemSynced) {
            foundPrinter = false;
            
            var itemPrinters = items[itemKey].product.printers;
            
            if((typeof itemPrinters != "undefined") && itemPrinters.length > 0) {
                var printersArray = itemPrinters.split(",");
                
                if($.inArray(terminalID.toLowerCase(), printersArray) != -1) {
                    foundPrinter = true;
                    itemsToPrint.push(items[itemKey]);
                }
            } 
            
            var categoryId = items[itemKey].product.category_id;
            var categoryPrinters = categories[categoryId].printers;
            
            if(!foundPrinter && (typeof categoryPrinters != "undefined") && categoryPrinters.length > 0) {
                var categoryPrintersArray = categoryPrinters.split(",");
                
                if($.inArray(terminalID.toLowerCase(), categoryPrintersArray) != -1) {
                    foundPrinter = true;
                    //pushcount++;
                    itemsToPrint.push(items[itemKey]);
                }
            } 
        }
    }
    
    if(itemsToPrint.length > 0) {
        printItemsFromOrder(serverNickname, recvdTerminalID, orderJSON, itemsToPrint);
    }
}

function doReceiveClearTableOrder(recvdTerminalID, tableID, orderNum, tableLabel, terminalEmployeeID, terminalEmployee) {
    //save the current users table order to reload it after sync
    savedTableID = selectedTable;
    
    for (var i = 0; i < employees.length; i++){
        nextUserIDToSyncWith = employees[i].id;
        
        doClearTableOrder(recvdTerminalID, tableID, tableLabel, terminalEmployee, nextUserIDToSyncWith);
    }
    
    if(inKitchenContext()) {
        tableCleared(tableID, orderNum);
    }
    
    //remove the table from the active table ids array
    removeActiveTable(tableID);
    renderActiveTables();
    
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
    
    for(var i=0;i<existingOrderItems.length;i++) {
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

function applyExistingDiscountToOrderItem(order, itemNumber) {
    applyDiscountToOrderItem(order, itemNumber, -1);
}

function applyDiscountToOrderItem(order, itemNumber, amount) {
    //should already be a float, but just to be sure
    amount = parseFloat(amount);
    
    if(itemNumber == -1) {
        orderItem = order.items[order.items.length-1];
    } else {
        orderItem = order.items[itemNumber-1];
    }
    
    //overwrite the discount amount, or just apply the existing one?
    if(amount == -1) {
        //return if no existing discount
        if(!orderItem['discount_percent']) {
            return;
        }
        
        amount = orderItem['discount_percent']
    } else {
        orderItem['discount_percent'] = amount;
    }
   
    if(orderItem['pre_discount_price']) {
        oldPrice = orderItem['pre_discount_price'];
    } else {
        oldPrice = orderItem['total_price'];
        orderItem['pre_discount_price'] = oldPrice;
    }
    
    preDiscountPrice = orderItem['pre_discount_price'];

    newPrice = preDiscountPrice - ((preDiscountPrice * amount) / 100);
    orderItem['total_price'] = newPrice;

    if(selectedTable == 0) {
        //mark the item as synced as we are not on a table receipt
        orderItem.synced = true;
    } else {
        //mark this item as unsynced
        orderItem['synced'] = false;
    }
    
    calculateOrderTotal(order);
}

function calculateOrderTotal(order) {
    if(!order) return;
    
    orderTotal = 0;

    for(var i=0; i<order.items.length; i++) {
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
    var receiptScrollerOpts = null;
    
    //mobile receipts
    $('#mobile_terminal_till_roll').touchScroll(receiptScrollerOpts);
    $('#mobile_server_till_roll').touchScroll(receiptScrollerOpts);
    $('#mobile_table_till_roll').touchScroll(receiptScrollerOpts);
    
    //large screen interface receipts
    $('.large_interface #till_roll').touchScroll(receiptScrollerOpts);
    $('.large_interface #login_till_roll').touchScroll(receiptScrollerOpts);
    $('.large_interface #totals_till_roll').touchScroll(receiptScrollerOpts);
    $('.large_interface #reports_center_till_roll').touchScroll(receiptScrollerOpts);
    $('.large_interface #reports_left_till_roll').touchScroll(receiptScrollerOpts);
    $('.large_interface #float_till_roll').touchScroll(receiptScrollerOpts);
    $('.large_interface #admin_order_list_till_roll').touchScroll(receiptScrollerOpts);
    
    //medium screen interface receipts
    $('.medium_interface #menu_screen_till_roll').touchScroll(receiptScrollerOpts);
    $('.medium_interface #large_menu_screen_till_roll').touchScroll(receiptScrollerOpts);
    
    //kitchen screen receipts
    if(inKitchenContext()) {
        $('#kitchen_screen .till_roll').touchScroll(receiptScrollerOpts);
    }
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
    orderItem['time_added'] = clueyTimestamp();

    currentOrderItem = orderItem;
}

function addItemToOrderAndSave(orderItem) {
    //mark the item as synced as we are not on a table receipt
    orderItem.synced = true;

    //lazy init currentOrder
    if(currentOrder == null) {
        currentOrder = {
            'items': new Array(),
            'courses' : new Array(),
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
        //jscrollpane force scroll to end
        var jscroll_api = $('#' + targetPrefix + 'receipt').data('jsp');
        
        if(jscroll_api) {
            currentHeight = $('#' + targetPrefix + 'till_roll').height();
            scrollHeight = $('#' + targetPrefix + 'till_roll').attr('scrollHeight');
            newHeight = scrollHeight - currentHeight;
        
            jscroll_api.scrollToY(newHeight + 20);
        } else {
            newHeight = $('#' + targetPrefix + 'receipt').attr('scrollHeight');
            $('#' + targetPrefix + 'receipt').scrollTop(newHeight);
        }
    }
}

function doSelectTable(tableNum) {
    selectedTable = tableNum;
    
    //write to storage that this user was last looking at this receipt
    storeLastReceipt(current_user_id, tableNum);
    
    if(tableNum == 0) {
        currentSelectedRoom = 0;
        
        loadCurrentOrder();
        
        if(currentOrder && currentOrder.service_charge) {
            serviceCharge = parseFloat(currentOrder.service_charge);
        }
        
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
    
    storeLastRoom(current_user_id, currentSelectedRoom);

    //fetch this tables order from storage
    //this will fill the tableOrders[tableNum] variable
    getTableOrderFromStorage(current_user_id, selectedTable);

    //display the receipt for this table
    loadReceipt(tableOrders[tableNum]);
    
    postDoSelectTable();
}

function removeSelectedOrderItem() {
    //fetch the item number
    itemNumber = currentSelectedReceiptItemEl.data("item_number");
    
    if(selectedTable != 0) {
        order = tableOrders[selectedTable];
        order = doRemoveOrderItem(order, itemNumber);
    
        storeTableOrderInStorage(current_user_id, selectedTable, order);
    }else {
        order = currentOrder;
        
        order = doRemoveOrderItem(order, itemNumber);
        
        storeOrderInStorage(current_user_id, order);
    }
    
    currentSelectedReceiptItemEl.hide();
    loadReceipt(order);
    
    closeEditOrderItem();
}

function doRemoveOrderItem(order, itemNumber) {
    //WE HAVE A LOT OF LOGIC HERE TO DEAL WITH COURSES
    
    
    //if this item marks the end of a course, 
    //we must pass the line back to the previous menu item
    //if the item number is only one, then this is the first 
    //item in the receipt and we don't worry about it
    var courseIndex = $.inArray(itemNumber, order.courses);
    
    if(courseIndex >= 0) {
        //3 cases here, 
        //1. this is a first item on the list (so delete the first entry which will be 1)
        //2. the previous item is already a course
        //3. we can pass back the course
        if(itemNumber == 1) {
            //remove this so it doesn't get decremented to 0
            order.courses.splice(0, 1);
        } else if(order.items[itemNumber-2].is_course) {
            //remove this from the courses array as the previous item is a course
            order.courses.splice(courseIndex, 1);
        } else {
            //pass back the course line
            order.courses[courseIndex]--;
            order.items[itemNumber-2].is_course = true;
        }
    }
    
    order.items.splice(itemNumber-1, 1);
    
    //update the order items of following items
    for(var i=itemNumber-1; i<order.items.length; i++) {
        order.items[i].itemNumber--;
        
        var courseIndex2 = $.inArray((i+1), order.courses);
        
        if(courseIndex2 >= 0) {
            //make sure that this course index is not already in the array
            if($.inArray(order.courses[courseIndex2] - 1, order.courses) == -1) {
                order.courses[courseIndex2]--;
            }
        }
    }
    
    //have to retotal the order
    calculateOrderTotal(order);
        
    return order;
}

function currentOrderEmpty(){
    fetchedCurrentOrder = getCurrentOrder();
    return orderEmpty(fetchedCurrentOrder);
}

function orderEmpty(order) {
    return !order || order.items.length == 0;
}

function orderStartTime(order) {
    if(orderEmpty(order)) {
        return "";
    }
    
    return order.items[0].time_added;
}