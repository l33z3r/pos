var currentMenuPage;
var currentMenuPageId;
var currentMenuSubPageId;

var menuItemDoubleMode = false;
var menuItemHalfMode = false;
var productInfoPopupMode = false;
var menuItemStandardPriceOverrideMode = false;
var currentMenuItemQuantity = "";

var selectedTable = 0;
var currentOrder = null;
var tableOrders = new Array();

var currentTableOrder = null;
var totalOrder = null;
var currentOrderItem;

var paymentMethod = null;
var serviceCharge = 0;
var cashback = 0;

var defaultServiceChargePercent = 0;

var currentSelectedMenuItemElement;

var oiaIsAdd = true;

var currentSelectedReceiptItemEl;

var inTransferOrderMode = false;
var transferOrderInProgress = false;

var inTransferOrderItemMode = false;
var transferOrderItemInProgress = false;

var modifierGridXSize;
var modifierGridYSize;
var currentModifierGridIdForProduct;

var previousOrderTableNum = -1;
var tempSplitBillTableNum = -2;

var globalPriceLevel = null;
var globalPriceLevelKey = "global_price_level";

var lastOrderSentTime = null;

var lastSaleObj;

var mandatoryFooterMessageHTML = null;

//this is used to hold the master 
var masterOrdersUserId = -1;

var tableOrderItemsToMerge = null;

var sendOrderAfterCovers = false;

function getCurrentOrder() {
    if(selectedTable == 0) {
        return currentOrder;
    } else {
        return tableOrders[selectedTable];
    }
    
    return null;
}

//this stores the newly synced items so we can build an order to print if we are the print delegate
var newlySyncedItems; 

function doReceiveTableOrderSync(recvdTerminalID, tableID, tableLabel, terminalEmployeeID, terminalEmployee, tableOrderDataJSON) {
    //data types need to be cast
    convertOrderItemStringsToBooleans(tableOrderDataJSON);
    
    //save the current users table order to reload it after sync
    var savedTableID = selectedTable;
    var savedServiceCharge = serviceCharge;
    var savedCashback = cashback;
    
    for(var i = 0; i < employees.length; i++) {
        nextUserIDToSyncWith = employees[i].id;
        
        if(!userHasUniqueTableOrder(nextUserIDToSyncWith, tableID)) {
            continue;
        }
        
        doTableOrderSync(recvdTerminalID, tableID, tableLabel, terminalEmployee, tableOrderDataJSON, nextUserIDToSyncWith);
    }
    
    //sync the master orders array 
    doTableOrderSync(recvdTerminalID, tableID, tableLabel, terminalEmployee, tableOrderDataJSON, masterOrdersUserId);
    
    if(inKitchenContext()) {
        renderReceipt(tableID);
    } 
    
    if(printDelegateTerminalID == terminalID && recvdTerminalID != terminalID && tableOrderDataJSON.needsPrintDelegate) {
        if(lastSyncTableOrderTime > lastPrintCheckTime) {
            
            //load the synced order
            getTableOrderFromStorage(current_user_id, tableID);
    
            //copy it
            var copiedOrder = {};

            var copiedOrderForPrintCheck = $.extend(true, copiedOrder, tableOrders[tableID]);        
            copiedOrderForPrintCheck.items = newlySyncedItems;
            
            checkForItemsToPrint(copiedOrderForPrintCheck, terminalEmployee);
        }
    }
    
    if(tableID != 0) {
        newlyAdded = addActiveTable(tableID);
        renderActiveTables();
    }
    
    if(current_user_id) {
        //now load back up the current users order
        getTableOrderFromStorage(current_user_id, savedTableID);
        doSelectTable(savedTableID);
    }
    
    //restore vars
    serviceCharge = savedServiceCharge;
    cashback = savedCashback;
    
    //if we are looking at the open orders page, then update them
    checkUpdateOpenOrdersScreen();
}

function doTableOrderSync(recvdTerminalID, tableID, tableLabel, terminalEmployee, tableOrderDataJSON, nextUserIDToSyncWith) {
    //the order is in json form, we need to turn it back into an array
    syncOrderItems = new Array();
    newlySyncedItems = new Array();
    
    for(var itemKey in tableOrderDataJSON.items) {
        var theItem = tableOrderDataJSON.items[itemKey];

        if(typeof(theItem.oia_items) != "undefined") {
            //we must convert the oia_items hash to an array (the server turned our array into some indexed hash)
            var newOIAItems = new Array();
        
            for(var oiaItemKey in theItem.oia_items) {
                var nextOIA = theItem.oia_items[oiaItemKey];
                
                //make sure the data types are converted correctly
                nextOIA.is_add = (nextOIA.is_add.toString() == "true" ? true : false);
                nextOIA.is_note = (nextOIA.is_note.toString() == "true" ? true : false);
                
                nextOIA.hide_on_receipt = (nextOIA.hide_on_receipt.toString() == "true" ? true : false);
                nextOIA.is_addable = (nextOIA.is_addable.toString() == "true" ? true : false);
                
                nextOIA.abs_charge = parseFloat(nextOIA.abs_charge);
                
                newOIAItems.push(nextOIA);
            }
        
            theItem.oia_items = newOIAItems;
        }
    
        var copiedOrderItem = {};
        var copiedOrderItem2 = {};
        
        var copiedOrderItemForStore = $.extend(true, copiedOrderItem, theItem);
        var copiedOrderItemForPrint = $.extend(true, copiedOrderItem2, theItem);
        
        if(!copiedOrderItemForStore.synced) {
            newlySyncedItems.push(copiedOrderItemForPrint);
            copiedOrderItemForStore.synced = "true";
        }
        
        syncOrderItems.push(copiedOrderItemForStore);
    }
    
    getTableOrderFromStorage(nextUserIDToSyncWith, tableID);
    
    //delete all items that have been synced already
    existingOrderItems = tableOrders[tableID].items;
    
    for(var i=0;i<existingOrderItems.length;i++) {
        if(existingOrderItems[i].synced) {
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
    
    //copy over the client name
    var clientName = tableOrderDataJSON.client_name;
    
    tableOrders[tableID].client_name = clientName;
    
    //set the client name on the tables screen if there is one present
    if(clientName.length > 0) {
        $('#table_label_' + tableID).html(tables[tableID].label + " (" + clientName + ")");
    }
        
    //copy over the covers
    var covers = tableOrderDataJSON.covers;
    tableOrders[tableID].covers = covers;
    
    //copy over the discount
    tableOrders[tableID].discount_percent = tableOrderDataJSON.discount_percent;
    
    //copy over the service charge
    if(typeof tableOrderDataJSON.service_charge != 'undefined') {
        tableOrders[tableID].service_charge = parseFloat(tableOrderDataJSON.service_charge);
    }
    
    //copy over the cashback
    if(typeof tableOrderDataJSON.cashback != 'undefined') {
        tableOrders[tableID].cashback = parseFloat(tableOrderDataJSON.cashback);
    }
    
    //copy over the void order id if there is one
    if(typeof tableOrderDataJSON.void_order_id != 'undefined') {
        tableOrders[tableID].void_order_id = tableOrderDataJSON.void_order_id;
    }
    
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
    
    if(tableID != 0 && tableID == selectedTable && nextUserIDToSyncWith == current_user_id) {
        loadReceipt(tableOrders[tableID], true);
    }
}

function checkForItemsToPrint(order, serverNickname) {
    if(!inLargeInterface()) {
        niceAlert("Not yet implemented for mobiles!");
        return;
    }
    
    var printerOrders = {};
    var items = order.items;
    
    for(i=0; i<items.length; i++) {
        var theItem = items[i];
        
        //we only want to print items from the order that are new i.e. not synced on the other terminal yet
        var isItemSynced = theItem.synced;
        var isItemVoid = theItem.is_void;
        
        if(!isItemSynced && !isItemVoid) {
            var itemPrinters = theItem.product.printers;
            
            if((typeof itemPrinters != "undefined") && itemPrinters.length > 0) {
                //are we allowed print from this terminal
                var blockedPrinter = false;
                var itemBlockedPrinters = theItem.product.blocked_printers;
                
                if((typeof itemBlockedPrinters != "undefined") && itemBlockedPrinters.length > 0) {
                    var blockedPrintersArray = itemBlockedPrinters.split(",");
                    blockedPrinter = $.inArray(terminalID.toLowerCase(), blockedPrintersArray) != -1;
                }
                
                if(blockedPrinter) {
                    continue;
                }
                
                //now loop through the printer ids
                var printersArray = itemPrinters.split(",");
                
                for(j=0; j<printersArray.length; j++) {
                    var nextPrinterID = printersArray[j];
                    
                    //lazy init
                    if(typeof(printerOrders[nextPrinterID]) == 'undefined') {
                        printerOrders[nextPrinterID] = new Array();
                    }
                    
                    printerOrders[nextPrinterID].push(theItem);
                }
            } else {
                //check category printers
                var categoryId = theItem.product.category_id;
            
                if(categoryId != null) {
                    var categoryPrinters = categories[categoryId].printers;
            
                    if((typeof categoryPrinters != "undefined") && categoryPrinters.length > 0) {
                        //are we allowed print from this terminal
                        var blockedCategoryPrinter = false;
                        var categoryBlockedPrinters = categories[categoryId].blocked_printers;
                
                        if((typeof categoryBlockedPrinters != "undefined") && categoryBlockedPrinters.length > 0) {
                            var blockedCategoryPrintersArray = categoryBlockedPrinters.split(",");
                
                            blockedCategoryPrinter = $.inArray(terminalID.toLowerCase(), blockedCategoryPrintersArray) != -1;
                        }
                
                        if(blockedCategoryPrinter) {
                            continue;
                        }
                        
                        //now loop through the printer ids
                        var categoryPrintersArray = categoryPrinters.split(",");
                
                        for(j=0; j<categoryPrintersArray.length; j++) {
                            nextPrinterID = categoryPrintersArray[j];
                    
                            //lazy init
                            if(typeof(printerOrders[nextPrinterID]) == 'undefined') {
                                printerOrders[nextPrinterID] = new Array();
                            }
                    
                            printerOrders[nextPrinterID].push(theItem);
                        }
                    }
                }
            }
        }
    }
    
    for(var printerID in printerOrders) {
        var itemsToPrint = printerOrders[printerID];
        
        var itemsToPrintOrder = {
            'items' : itemsToPrint
        }
        
        doAutoCoursing(itemsToPrintOrder);
            
        printItemsFromOrder(printerID, serverNickname, order, itemsToPrint);
    }
}

function convertOrderItemStringsToBooleans(tableOrderDataJSON) {
    for(var itemKey in tableOrderDataJSON.items) {
        var theItem = tableOrderDataJSON.items[itemKey];
        
        if(theItem.synced) {
            theItem.synced = (theItem.synced.toString() == "true" ? true : false);   
        }
        
        //make sure the data types are converted correctly
        if(theItem.product.show_price_on_receipt) {
            theItem.product.show_price_on_receipt = (theItem.product.show_price_on_receipt.toString() == "true" ? true : false);   
        }
        
        if(theItem.showServerAddedText) {
            theItem.showServerAddedText = (theItem.showServerAddedText.toString() == "true" ? true : false);   
        }
        
        if(theItem.product.hide_on_printed_receipt) {
            theItem.product.hide_on_printed_receipt = (theItem.product.hide_on_printed_receipt.toString() == "true" ? true : false);   
        }
        
        if(theItem.product.category_id == "null") {
            theItem.product.category_id = null;
        }
        
        if(theItem.is_course) {
            theItem.is_course = (theItem.is_course.toString() == "true" ? true : false);   
        }
        
        if(theItem.show_course_label) {
            theItem.show_course_label = (theItem.show_course_label.toString() == "true" ? true : false);   
        }
        
        if(theItem.is_void) {
            theItem.is_void = (theItem.is_void.toString() == "true" ? true : false);   
        }
        
        //this is only untill we have the new code deployed for a while we can be sure that double_price will be present on newly created orders
        if(typeof(theItem.is_double) != 'undefined') {
            theItem.is_double = (theItem.is_double.toString() == "true" ? true : false);
        } else {
            theItem.is_double = false;
        }
        
        //this is only untill we have the new code deployed for a while we can be sure that half_price will be present on newly created orders
        if(typeof(theItem.is_half) != 'undefined') {
            theItem.is_half = (theItem.is_half.toString() == "true" ? true : false);
        } else {
            theItem.is_half = false;
        }
    }
}

function doReceiveClearTableOrder(recvdTerminalID, tableID, orderNum, tableLabel, terminalEmployeeID, terminalEmployee) {
    //save the current users table order to reload it after sync
    var savedTableID = selectedTable;
    var savedServiceCharge = serviceCharge;
    var savedCashback = cashback;
    
    for (var i = 0; i < employees.length; i++){
        nextUserIDToSyncWith = employees[i].id;
        
        //skip if terminal and user same
        //        if(recvdTerminalID == terminalID && terminalEmployeeID == nextUserIDToSyncWith) {
        //            continue;
        //        }
        
        if(!userHasUniqueTableOrder(nextUserIDToSyncWith, tableID)) {
            continue;
        }
        
        doClearTableOrder(recvdTerminalID, tableID, tableLabel, terminalEmployee, nextUserIDToSyncWith);
    }
    
    //clear the master orders array if its not table 0
    if(tableID != 0) {
        doClearTableOrder(recvdTerminalID, tableID, tableLabel, terminalEmployee, masterOrdersUserId);
    }
    
    //remove the table from the active table ids array
    removeActiveTable(tableID);
    renderActiveTables();
    
    if(current_user_id) {
        //now load back up the current users order
        getTableOrderFromStorage(current_user_id, savedTableID);
        doSelectTable(savedTableID);
    }
    
    //restore vars
    serviceCharge = savedServiceCharge;
    cashback = savedCashback;
}

function doClearTableOrder(recvdTerminalID, tableID, tableLabel, terminalEmployee, nextUserIDToSyncWith) {
    //save the current users table order to reload it after sync
    savedTableID = selectedTable;
    
    //only clear the order on this users receipt if they have no unsynced items
    getTableOrderFromStorage(nextUserIDToSyncWith, tableID);
    
    tableOrders[tableID] = buildInitialOrder();
        
    clearTableOrderInStorage(nextUserIDToSyncWith, tableID);
        
    if(tableID == selectedTable && nextUserIDToSyncWith == current_user_id) {
        loadReceipt(tableOrders[tableID], true);
    }
        
    $('#table_label_' + tableID).html(tables[tableID].label);
}

function applyExistingDiscountToOrderItem(order, itemNumber) {
    applyDiscountToOrderItem(order, itemNumber, -1);
}

function modifyOrderItem(order, itemNumber, newQuantity, newPricePerUnit, newCourseNum, is_void) {
    targetOrderItem = order.items[itemNumber-1];

    targetOrderItem.amount = newQuantity;
    targetOrderItem.product_price = newPricePerUnit;
    targetOrderItem.product.course_num = newCourseNum;
    
    if(typeof(is_void) == 'undefined') {
        is_void = false;
    }
    
    targetOrderItem.is_void = is_void;
    
    //add the employee who voided the item
    if(targetOrderItem.is_void) {
        targetOrderItem.void_employee_id = current_user_id;
    }
    
    if(targetOrderItem.pre_discount_price) {
        targetOrderItem.pre_discount_price = newPricePerUnit * newQuantity;
    } else {
        targetOrderItem.total_price = newPricePerUnit * newQuantity;
    }

    //add the new total modifier price
    if(targetOrderItem.modifier) {
        if(targetOrderItem.pre_discount_price) {
            targetOrderItem.pre_discount_price += targetOrderItem.modifier.price * newQuantity;
        } else {
            targetOrderItem.total_price += targetOrderItem.modifier.price * newQuantity;
        }
    }

    //add the new total oia prices
    if(targetOrderItem.oia_items) {
        for(i=0; i<targetOrderItem.oia_items.length; i++) {
            if(targetOrderItem.pre_discount_price) {
                if(targetOrderItem.oia_items[i].is_add) {
                    targetOrderItem.pre_discount_price += targetOrderItem.oia_items[i].abs_charge * newQuantity;
                    console.log("pdp: " + (targetOrderItem.oia_items[i].abs_charge));
                } else {
                    targetOrderItem.pre_discount_price -= targetOrderItem.oia_items[i].abs_charge * newQuantity;
                }
            } else {
                if(targetOrderItem.oia_items[i].is_add) {
                    targetOrderItem.total_price += targetOrderItem.oia_items[i].abs_charge * newQuantity;
                    console.log("pdp: " + (targetOrderItem.oia_items[i].abs_charge));
                } else {
                    targetOrderItem.total_price -= targetOrderItem.oia_items[i].abs_charge * newQuantity;
                }
            }
        }
    }
    
    //get rid of rounding errors
    targetOrderItem.total_price = roundNumber(parseFloat(targetOrderItem.total_price), 2);
    
    applyExistingDiscountToOrderItem(order, itemNumber);
    calculateOrderTotal(order);

    return order;
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

    //get rid of rounding errors
    orderItem['total_price'] = roundNumber(orderItem['total_price'], 2);

    calculateOrderTotal(order);
}

function calculateOrderTotal(order) {
    if(!order) return;
    
    var orderTotal = 0;

    for(var i=0; i<order.items.length; i++) {
        item = order.items[i];
        
        if(!item.is_void) {
            orderTotal += parseFloat(item['total_price']);
        }
    }

    order['total'] = roundNumber(orderTotal, 2);

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
    $('.large_interface #delivery_till_roll').touchScroll(receiptScrollerOpts);
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
    
    var productPrice = product.price;
    var isDouble = false;
    var isHalf = false;
    
    if(menuItemDoubleMode) {
        productPrice = product.double_price;
        isDouble = true;
        setMenuItemDoubleMode(false);
    } else if(menuItemHalfMode) {
        productPrice = product.half_price;
        isHalf = true;
        setMenuItemHalfMode(false);
    } else if(menuItemStandardPriceOverrideMode) {
        productPrice = product.price;
        setMenuItemStandardPriceOverrideMode(false);
    } else if(globalPriceLevel == 2 && product.price_2 != 0) {
        productPrice = product.price_2;
    } else if(globalPriceLevel == 3 && product.price_3 != 0) {
        productPrice = product.price_3;
    } else if(globalPriceLevel == 4 && product.price_4 != 0) {
        productPrice = product.price_4;
    }
    
    var totalProductPrice = roundNumber(productPrice*amount, 2);
    
    orderItem = {
        'amount':amount,
        'product':product,
        'tax_rate':taxRate,
        'product_price':productPrice,
        'is_double':isDouble,
        'is_half':isHalf,
        'total_price':totalProductPrice,
        'is_void':false
    }
    
    //fill in the category id of the product
    if(orderItem.product.category_id != null) {
        orderItem.product.category = orderItem.product.category_id;
    } else {
        orderItem.product.category = "None";
    }
    
    //fill in the department of the product
    if(categories[orderItem.product.category_id] != null && categories[orderItem.product.category_id].parent_category_id != null) {
        orderItem.product.department = categories[orderItem.product.category_id].parent_category_id;
    } else {
        orderItem.product.department = "None";
    }

    //store the terminal id 
    orderItem['terminal_id'] = terminalID;
    
    //either way we want to store the user id
    orderItem['serving_employee_id'] = current_user_id;
    orderItem['time_added'] = clueyTimestamp();

    currentOrderItem = orderItem;
}

function setModifierGridIdForProduct(product) {
    if(product.modifier_grid_id) {
        currentModifierGridIdForProduct = product.modifier_grid_id;
    } else if(categories[product.category_id] && categories[product.category_id].modifier_grid_id) {
        currentModifierGridIdForProduct = categories[product.category_id].modifier_grid_id;
    } else {
        currentModifierGridIdForProduct = null;
    }
}

function addItemToOrderAndSave(orderItem) {
    //mark the item as synced as we are not on a table receipt
    orderItem.synced = true;

    //lazy init currentOrder
    if(currentOrder == null) {
        currentOrder = buildInitialOrder();
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
}

//load the current bar receipt order into memory
function loadCurrentOrder() {
    currentOrder = getOrderFromStorage(current_user_id);
    
    if(currentOrder) {
        
        //load the cashback
        if(typeof currentOrder.cashback == "undefined") {
            currentOrder.cashback = 0;
        }
    
        cashback = parseFloat(currentOrder.cashback);
    
        //load the service charge
        if(typeof currentOrder.service_charge == "undefined") {
            currentOrder.service_charge = 0;
        }
   
        serviceCharge = parseFloat(currentOrder.service_charge);
    }
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

function updateRecpt(targetPrefix) {
    if(isTouchDevice()) {
        $('#' + targetPrefix + 'till_roll').touchScroll('update');
    }
}

function doSelectTable(tableNum) {
    selectedTable = tableNum;
    
    //write to storage that this user was last looking at this receipt
    storeLastReceipt(current_user_id, tableNum);
    
    if(tableNum == 0) {
        currentSelectedRoom = 0;
        
        loadCurrentOrder();
        
        defaultServiceChargePercent = globalDefaultServiceChargePercent;
        
        if(currentOrder && currentOrder.service_charge) {
            serviceCharge = parseFloat(currentOrder.service_charge);
        }
        
        //total the order first
        calculateOrderTotal(currentOrder);
        
        loadReceipt(currentOrder, true);
        return;
    }
    
    var promptForClientName;
    
    if(tableNum == -1) {
        currentSelectedRoom = -1;
        defaultServiceChargePercent = globalDefaultServiceChargePercent;
        promptForClientName = false;
    } else {
        currentSelectedRoom = tables[tableNum].room_id;
        //set the defautl service charge for this room
        defaultServiceChargePercent = rooms[currentSelectedRoom].defaultServiceChargePercent;
        promptForClientName = rooms[currentSelectedRoom].prompt_for_client_name;
    }
    
    storeLastRoom(current_user_id, currentSelectedRoom);

    //fetch this tables order from storage
    //this will fill the tableOrders[tableNum] variable
    getTableOrderFromStorage(current_user_id, selectedTable);

    //display the receipt for this table
    loadReceipt(tableOrders[tableNum], true);
    
    if(promptForClientName && tableOrders[tableNum].client_name == "") {
        promptAddNameToTable();
    }
    
    postDoSelectTable();
}

function orderReceiptItems(order) {
    if(!order) return;
    
    for(var i=0;i<order.items.length;i++) {
        order.items[i].itemNumber = i + 1;
    }
}

function removeSelectedOrderItem() {
    //fetch the item number
    var itemNumber = currentSelectedReceiptItemEl.data("item_number");

    order = getCurrentOrder();
    var item = order.items[itemNumber - 1];

    if(item.is_void) {
        niceAlert("You cannot remove an item that is void.");
        return;
    }
    
    if(item.synced && selectedTable != 0 && !inTransferOrderItemMode) {
        niceAlert("You cannot remove an item that has already been ordered. You can only void this item.");
        return;
    }

    if(selectedTable != 0) {
        doRemoveOrderItem(order, itemNumber);
        storeTableOrderInStorage(current_user_id, selectedTable, order);
    } else {
        doRemoveOrderItem(order, itemNumber);
        storeOrderInStorage(current_user_id, order);
    }
    
    currentSelectedReceiptItemEl.hide();
    loadReceipt(order, true);
    
    closeEditOrderItem();
    closeDiscountPopup();
}

function doRemoveOrderItem(order, itemNumber) {
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
    return !order || !order.items || order.items.length == 0;
}

function orderStartTime(order) {
    if(orderEmpty(order)) {
        return "";
    }
    
    return order.items[0].time_added;
}

function doTransferTable(tableFrom, tableTo) {
    var activeTableIDS = getActiveTableIDS();
    //alert(activeTableIDS + " " + $.inArray(tableId.toString(), activeTableIDS));
        
    if(tableTo.toString() == tableFrom) {
        niceAlert("You cannot transfer to the same table, please choose another.");
        return;
    }
        
    if($.inArray(tableTo.toString(), activeTableIDS) != -1) {
        getTableOrderFromStorage(current_user_id, tableTo);
        
        //copy the array (http://www.xenoveritas.org/blog/xeno/the-correct-way-to-clone-javascript-arrays)
        tableOrderItemsToMerge = tableOrders[tableTo].items.slice(0);
    }
        
    transferOrderInProgress = true;
        
    //this bit of code is only for the large interface, but can still be 
    //included here as it is non breaking for medium interface
    $('#nav_back_link').unbind();
    $('#nav_back_link').click(function() {
        niceAlert("Transfer table order in progress, please wait.");
        return;
    });
       
    showLoadingDiv("Transfer in progress, Please wait...");
        
    $.ajax({
        type: 'POST',
        url: '/transfer_order',
        data: {
            table_from_id : tableFrom,
            table_from_order_num : getCurrentOrder().order_num,
            table_to_id : tableTo
        }
    });
}

var savedTableTo;

function doTransferOrderItem(tableFrom, tableTo) {
    if(tableTo.toString() == tableFrom) {
        niceAlert("You cannot transfer to the same table, please choose another.");
        return;
    }
        
    transferOrderItemInProgress = true;
    savedTableTo = tableTo;
    
    //this bit of code is only for the large interface, but can still be 
    //included here as it is non breaking for medium interface
    $('#nav_back_link').unbind();
    $('#nav_back_link').click(function() {
        niceAlert("Transfer table order item in progress, please wait.");
        return;
    });
     
    var itemNumber = currentSelectedReceiptItemEl.data("item_number");
      
    var orderFrom;

    if(selectedTable != 0) {
        orderFrom = tableOrders[selectedTable];
    } else {
        orderFrom = currentOrder;
    }
  
    //copy the item
    var theItem = orderFrom.items[itemNumber-1];
      
    var copiedOrderItem = {};
    var itemToTransfer = $.extend(true, copiedOrderItem, theItem);
    
    //delete it from the current order
    doSelectTable(tableFrom);
    removeSelectedOrderItem();
      
    //place the item in the new table
    doSelectTable(tableTo);
    addItemToTableOrderAndSave(itemToTransfer);
     
    //make sure the item is marked as synced so it doesn't get ordered twice
    itemToTransfer['synced'] = true;
    storeTableOrderInStorage(current_user_id, selectedTable, tableOrders[selectedTable]);
    
    showLoadingDiv("Transfer in progress, Please wait...");
    
    //select the original table for the sync
    doSelectTable(tableFrom);
      
    if(tableFrom == 0 || currentOrderEmpty()) {
        finishTransferOrderItem();
    } else {
        doSyncTableOrder();
    }
}

function doAutoCoursing(order) {
    //now sort them by their course number and apply item numbers
    order.items.sort(function(a, b) {
        var sortVal = parseInt(a.product.course_num) - parseInt(b.product.course_num);
        
        if(sortVal == 0) {
            sortVal = parseFloat(a.time_added) - parseFloat(b.time_added);
        }
        
        return sortVal;
    });
    
    var nextCourse = false;
    var nextCourseNum;
    
    order.courses = new Array();
    
    for(var i=0; i<order.items.length; i++) {
        
        nextCourseNum = parseInt(order.items[i].product.course_num);
            
        order.items[i].itemNumber = i + 1;
        order.items[i].is_course = false;
        
        nextCourse = (i != order.items.length - 1) && (parseInt(order.items[i+1].product.course_num) != nextCourseNum);
        
        if(nextCourse) {
            order.items[i].is_course = true;
            order.courses.push(i + 1);
            
            nextCourse = false;
        }
    }
}

function finishTransferOrderItem() {
    $('#tables_screen_status_message').hide();
    transferOrderItemInProgress = false;
    inTransferOrderItemMode = false;
    tableScreenSelectTable(savedTableTo);
    doAutoLoginAfterSync = true;
    doSyncTableOrder();
    hideNiceAlert();
    setStatusMessage("Order Item Transfered.");
}

function testForMandatoryModifier(product) {
    if(orderItem.product.modifier_grid_id && orderItem.product.modifier_grid_id_mandatory) {
        switchToModifyOrderItemSubscreen();
        orderItemAdditionTabSelected(orderItem.product.modifier_grid_id);
    } else if(categories[product.category_id] && categories[product.category_id].modifier_grid_id && 
        categories[product.category_id].modifier_grid_id_mandatory) {
        switchToModifyOrderItemSubscreen();
        orderItemAdditionTabSelected(categories[product.category_id].modifier_grid_id);
    }
}

function orderItemAdditionClicked(el) {
    currentSelectedReceiptItemEl = getSelectedOrLastReceiptItem();
    
    if(!currentSelectedReceiptItemEl) {
        return;
    }
    
    var order = getCurrentOrder();
    
    var itemNumber = currentSelectedReceiptItemEl.data("item_number");
    
    var orderItem = order.items[itemNumber-1];
    
    el = $(el);
    
    //is this available
    var available = el.data("available");
    
    if(!available) {
        return;
    }
    
    //get the oia data
    var desc = el.data("description");
    
    var absCharge = 0;
    
    var plusCharge = el.data("add_charge");
    var minusCharge = el.data("minus_charge");
    
    //oia here is always true
    //for now assume it is being added, we wont know until we iterate through the modifiers
    if(oiaIsAdd) {
        absCharge = plusCharge;
    } else {
        absCharge = minusCharge;
    }
    
    var hideOnReceipt = el.data("hide_on_receipt");
    var isAddable = el.data("is_addable");
    
    var productId = el.data("product_id");
    var followOnGridId = el.data("follow_on_grid_id");
    
    addOIAToOrderItem(order, orderItem, desc, absCharge, plusCharge, minusCharge, oiaIsAdd, false, hideOnReceipt, isAddable, productId, followOnGridId);
}

function addOIAToOrderItem(order, orderItem, desc, absCharge, plusCharge, minusCharge, oiaIsAdd, isNote, hideOnReceipt, isAddable, productId, followOnGridId) {
    if(typeof(orderItem.oia_items) == 'undefined') {
        orderItem.oia_items = new Array();
    }
    
    //make sure all values in calc are floats
    absCharge = parseFloat(absCharge);
    
    if(orderItem.pre_discount_price) {
        orderItem.pre_discount_price = parseFloat(orderItem.pre_discount_price);
    } else {
        orderItem.total_price = parseFloat(orderItem.total_price);
    }
    
    var oiaEdited = false;
    
    //check if the last item is the same as this one
    if(orderItem.oia_items.length>0) {
        var oiaFound = false;
        
        var nextOIA;
        var existingOIA;
        var existingOIAIndex;
        
        //search through the existing modifiers 
        for(i=0; i<orderItem.oia_items.length; i++) {
            nextOIA = orderItem.oia_items[i];
            
            if(nextOIA.description == desc) {
                oiaFound = true;
                existingOIA = nextOIA;
                existingOIAIndex = i;
                break;
            }
        }
        
        if(oiaFound) {
            oiaEdited = true;
           
            if(existingOIA.is_addable) {
                if(existingOIA.is_add) {
                    existingOIA.is_add = false;
                
                    //save the new abs_charge to be the minus charge
                    existingOIA.abs_charge = minusCharge;
            
                    //take away the charge that was added before
                    if(plusCharge > 0) {
                        if(orderItem.pre_discount_price) {
                            orderItem.pre_discount_price -= (orderItem.amount * plusCharge);
                        } else {
                            orderItem.total_price -= (orderItem.amount * plusCharge);
                        }
                    }
                
                    console.log("taking away minus charge: " + minusCharge);
                    //take away the minus charge now
                    if(minusCharge > 0) {
                        if(orderItem.pre_discount_price) {
                            orderItem.pre_discount_price -= (orderItem.amount * minusCharge);
                        } else {
                            orderItem.total_price -= (orderItem.amount * minusCharge);
                        }
                    }
                } else {
                    //add back on any minus charge that was present
                    if(minusCharge > 0) {
                        if(orderItem.pre_discount_price) {
                            orderItem.pre_discount_price += (orderItem.amount * minusCharge);
                        } else {
                            orderItem.total_price += (orderItem.amount * minusCharge);
                        }
                    }
                
                    orderItem.oia_items.splice(existingOIAIndex, 1);
                
                    //nullify the oia_items if it is empty
                    if(orderItem.oia_items.length == 0) {
                        delete orderItem['oia_items'];
                    }
                }
            } else {
                //take away the charge that was added before
                if(plusCharge > 0) {
                    if(orderItem.pre_discount_price) {
                        orderItem.pre_discount_price -= (orderItem.amount * plusCharge);
                    } else {
                        orderItem.total_price -= (orderItem.amount * plusCharge);
                    }
                }
                    
                orderItem.oia_items.splice(existingOIAIndex, 1);
                
                //nullify the oia_items if it is empty
                if(orderItem.oia_items.length == 0) {
                    delete orderItem['oia_items'];
                }
            }
        }
    }

    //it is a new one
    if(!oiaEdited) {
        oia_item = {
            'description' : desc,
            'abs_charge' : absCharge,
            'is_add' : oiaIsAdd, 
            'is_note' : isNote,
            'hide_on_receipt' : hideOnReceipt,
            'is_addable' : isAddable,
            'product_id' : productId
        }
        
        //update the total with new oia total
        if(absCharge > 0) {
            if(oiaIsAdd) {
                if(orderItem.pre_discount_price) {
                    orderItem.pre_discount_price += (orderItem.amount * absCharge);
                } else {
                    orderItem.total_price += (orderItem.amount * absCharge);
                }
            } else {
                if(orderItem.pre_discount_price) {
                    orderItem.pre_discount_price -= (orderItem.amount * absCharge);
                } else {
                    orderItem.total_price -= (orderItem.amount * absCharge);
                }
            }
        }
    
        orderItem.oia_items.push(oia_item);
    }

    applyExistingDiscountToOrderItem(order, orderItem.itemNumber);

    //store the modified order
    if(selectedTable != 0) {
        storeTableOrderInStorage(current_user_id, selectedTable, order);
    }else {
        storeOrderInStorage(current_user_id, order);
    }
        
    //redraw the receipt
    calculateOrderTotal(order);
    loadReceipt(order, false);
    
    //only scroll the receipt if the last item is the selected one
    if(currentSelectedReceiptItemEl.data("item_number") == getLastReceiptItem().data("item_number")) {
        setTimeout(menuRecptScroll, 20);
    } else {
        //maintain the blue selected border on the last selected item?   
        currentSelectedReceiptItemEl.addClass("selected");
    }
    
    setOrderItemAdditionsGridState();
    
    if(followOnGridId != -1) {
        orderItemAdditionTabSelected(followOnGridId);
    }
}

function setOrderItemAdditionsGridState() {
    //clear the grid
    $('.oia_container:visible .grid_item .grid_graphic').hide();
    
    currentSelectedReceiptItemEl = getSelectedOrLastReceiptItem();
    
    if(!currentSelectedReceiptItemEl) {
        return;
    }
    
    var order = getCurrentOrder();
    
    var itemNumber = currentSelectedReceiptItemEl.data("item_number");
    
    var orderItem = order.items[itemNumber-1];
    var nextOIA;
    
    if(orderItem.oia_items && orderItem.oia_items.length > 0) {
        
        for(i=0; i<orderItem.oia_items.length; i++) {
            nextOIA = orderItem.oia_items[i];
            
            $('.oia_container:visible .grid_item').each(function() {
                var gi = $(this);
                
                if(nextOIA.description == gi.data("description")) {
                    if(nextOIA.is_add) {
                        gi.find(".add").show();
                    } else {
                        gi.find(".remove").show();
                    }
                }
            });
        }
    }
}