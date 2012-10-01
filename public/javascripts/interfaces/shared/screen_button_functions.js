var lastSyncedOrder = null;
var orderInProcess = false;

var isTableZeroOrder = false;

function orderButtonPressed() {
    var order = getCurrentOrder();

    var autoCovers = false;

    if (globalAutoPromptForCovers) {
        autoCovers = true;
    } else {
        //iterate through all the categories of this order to check for auto covers set
        for (var j = 0; j < order.items.length; j++) {
            var item = order.items[j];

            if (order.items[j].synced && selectedTable != 0) {
                continue;
            }

            var categoryId = item.product.category_id;

            if (categoryId != null) {
                if (categories[categoryId].prompt_for_covers) {
                    autoCovers = true;
                    break;
                }
            }
        }
    }

    if (autoCovers && parseInt(order.covers) == -1) {
        order.covers = 0;
        manualCoversPrompt = false;
        doAutoCovers();
    } else {
        doSyncTableOrder();
    }
}

function doSyncTableOrder() {
    if (!appOnline) {
        niceAlert("Cannot contact server, ordering is disabled until connection re-established!");
        return;
    }

    var order = null;

    if (!isTableZeroOrder && !ensureLoggedIn()) {
        return;
    }

    if (!callHomePollInitSequenceComplete) {
        niceAlert("Downloading data from server, please wait.");
        return;
    }

    if (orderInProcess) {
        niceAlert("There is an order being processed, please wait.");
        return;
    }

    if (selectedTable == previousOrderTableNum) {
        setStatusMessage("Not valid for reopened orders!");
        return;
    } else if (selectedTable == tempSplitBillTableNum) {
        setStatusMessage("Not valid for split orders!");
        return;
    } else if (selectedTable == 0) {
        if (!isTableZeroOrder) {
            setStatusMessage("You must move this order to a table");
            startTransferOrderMode();
            return;
        } else {
            //when a sale on table 0 happens, this line executes
            //dont need to check if empty as this will only ever be called after a sale
            lastOrderSaleText = "Last Sale";
            order = lastTableZeroOrder;

            //mark all the items as unsynced for table 0 so they get printed
            for (var i = 0; i < order.items.length; i++) {
                order.items[i].synced = false;
            }
        }
    } else {
        lastOrderSaleText = "Last Order";

        order = tableOrders[selectedTable];
        if (order.items.length == 0) {
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

    //mark the item that we need to show the server added text for
    for (var i = 0; i < order.items.length; i++) {
        if (checkForShowServerAddedText && !order.items[i].synced && !order.items[i].is_void) {
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

    var userId = current_user_id;

    if (isTableZeroOrder) {
        userId = last_user_id;
    }

    $.ajax({
        type: 'POST',
        url: '/sync_table_order',
        error: syncTableOrderFail,
        data: {
            tableOrderData : tableOrderData,
            employee_id : userId,
            lastSyncTableOrderTime : lastSyncTableOrderTime
        }
    });
}

function finishSyncTableOrder() {
    lastOrderSentTime = clueyTimestamp();

    var order = lastSyncedOrder;

    //mark all items in this order as synced
    for (var i = 0; i < order.items.length; i++) {
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

function retryTableOrder() {
    orderInProcess = false;
    niceAlert("An order for this table was sent at the same time, PLEASE SEND ORDER AGAIN.");
}

function removeLastOrderItem() {
    currentSelectedReceiptItemEl = getSelectedOrLastReceiptItem();

    if (currentSelectedReceiptItemEl) {
        removeSelectedOrderItem();
    }

    currentSelectedReceiptItemEl = null;
}

function quickSale() {
    unorderedItemsPopup('doQuickSale()', true);
}

function doQuickSale() {
    if (currentOrderEmpty()) {
        setStatusMessage("No order present to total!", true, true);
        return;
    }

    if (!ensureLoggedIn()) {
        return;
    }

    applyDefaultServiceChargePercent();

    cashTendered = 0;
    splitPayments = {};

    paymentMethod = cashPaymentMethodName;

    doTotalFinal();
}

function totalPressed() {
    unorderedItemsPopup('doTotal(true);', true);
}

function printBillPressed() {
    //make sure all items in this order have already been ordered
    var orderSynced = true;
    
    var order = getCurrentOrder();
    
    for(var i=0; i<order.items.length; i++) {
        if(!order.items[i].synced) {
            orderSynced = false;
            break;
        }
    }
    
    if(!orderSynced) {
        niceAlert("You cannot print a bill until you order all items on the receipt. You can also delete unordered items!");
        return;
    }
    
    printBill();
}

function printBill() {
    applyDefaultServiceChargePercent();

    totalOrder = getCurrentOrder();

    if (orderEmpty(totalOrder)) {
        setStatusMessage("No order present");
        return;
    }

    //don't print vat on this receipt
    var printVat = false;

    printReceipt(fetchFinalReceiptHTML(true, false, printVat), true);
}

function applyDefaultServiceChargePercent() {
    serviceCharge = (defaultServiceChargePercent * parseFloat(getCurrentOrder().total)) / 100;
    saveServiceCharge(false);
}

function startTransferOrderMode() {
    if (!appOnline) {
        niceAlert("Cannot contact server, transfering orders is disabled until connection re-established!");
        return;
    }

    if (!callHomePollInitSequenceComplete) {
        niceAlert("Downloading data from server, please wait.");
        return;
    }

    var order = getCurrentOrder();

    if (order == null || order.items.length == 0) {
        setStatusMessage("No items present in current table order.");
        return;
    }

    //make sure all items in this order have already been ordered
    var orderSynced = true;

    for (var i = 0; i < order.items.length; i++) {
        if (!order.items[i].synced) {
            orderSynced = false;
            break;
        }
    }

    if (!orderSynced && selectedTable != 0) {
        niceAlert("All items in the order must be ordered before you can transfer. You can also delete un-ordered items.");
        return;
    }

    inTransferOrderMode = true;

    showTablesScreen();
    setStatusMessage("Please choose a free table to transfer this order to.", false, false);
}

function startTransferOrderItemMode() {
    if (!appOnline) {
        niceAlert("Cannot contact server, transfering order items is disabled until connection re-established!");
        return;
    }

    if (!callHomePollInitSequenceComplete) {
        niceAlert("Downloading data from server, please wait.");
        return;
    }

    if (selectedTable == previousOrderTableNum) {
        niceAlert("Not valid for reopened orders! You must transfer the whole order to a table.");
        return;
    } else if (selectedTable == tempSplitBillTableNum) {
        niceAlert("Not valid for split orders! You must transfer the whole order to a table.");
        return;
    }

    //only allow transfer if the item has already been orderd
    var itemNumber = currentSelectedReceiptItemEl.data("item_number");

    var order = getCurrentOrder();

    if (!order.items[itemNumber - 1]['synced']) {
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
    if (turnOn) {
        //ensure half mode is not enabled
        setMenuItemHalfMode(false);

        menuItemDoubleMode = true;
        $('.button[id=sales_button_' + toggleMenuItemDoubleModeButtonID + ']').addClass("selected");
    } else {
        menuItemDoubleMode = false;
        $('.button[id=sales_button_' + toggleMenuItemDoubleModeButtonID + ']').removeClass("selected");
    }
}

function toggleMenuItemHalfMode() {
    setMenuItemHalfMode(!menuItemHalfMode);
}

function setMenuItemHalfMode(turnOn) {
    if (turnOn) {
        //ensure double mode is not enabled
        setMenuItemDoubleMode(false);

        menuItemHalfMode = true;
        $('.button[id=sales_button_' + toggleMenuItemHalfModeButtonID + ']').addClass("selected");
    } else {
        menuItemHalfMode = false;
        $('.button[id=sales_button_' + toggleMenuItemHalfModeButtonID + ']').removeClass("selected");
    }
}

function toggleMenuItemRefundMode() {
    setMenuItemRefundMode(!menuItemRefundMode);
}

function setMenuItemRefundMode(turnOn) {
    if (turnOn) {
        //ensure half mode and double modes are not enabled
        setMenuItemHalfMode(false);
        setMenuItemDoubleMode(false);

        menuItemRefundMode = true;
        $('.button[id=sales_button_' + toggleMenuItemRefundModeButtonID + ']').addClass("selected");
    } else {
        menuItemRefundMode = false;
        $('.button[id=sales_button_' + toggleMenuItemRefundModeButtonID + ']').removeClass("selected");
    }
}

function toggleMenuItemStandardPriceOverrideMode() {
    setMenuItemStandardPriceOverrideMode(!menuItemStandardPriceOverrideMode);
}

function setMenuItemStandardPriceOverrideMode(turnOn) {
    if (turnOn) {
        menuItemStandardPriceOverrideMode = true;
        $('.button[id=sales_button_' + toggleMenuItemStandardPriceOverrideModeButtonID + ']').addClass("selected");
    } else {
        menuItemStandardPriceOverrideMode = false;
        $('.button[id=sales_button_' + toggleMenuItemStandardPriceOverrideModeButtonID + ']').removeClass("selected");
    }
}

function deleteCurrentOrder() {
    if (!appOnline) {
        niceAlert("Cannot contact server, deleting an order across the system is disabled until connection re-established!");
        return;
    }

    if (selectedTable == previousOrderTableNum) {
        setStatusMessage("Not valid for reopened orders!");
        return;
    } else if (selectedTable == tempSplitBillTableNum) {
        setStatusMessage("Not valid for split orders!");
        return;
    } else if (selectedTable == 0) {
        setStatusMessage("Only valid for table orders!");
        return;
    }

    var doIt = confirm("Are you sure you want to delete this order from the system?");

    if (doIt) {
        var order_num = getCurrentOrder().order_num;

        clearOrder(selectedTable);

        $.ajax({
            type: 'POST',
            url: '/delete_table_order',
            complete: function() {
                niceAlert("Order has been deleted from the system.");
            },
            data: {
                table_id : selectedTable,
                order_num : order_num
            }
        });
    }
}

function chargeCardShortcut() {
    if (currentOrderEmpty()) {
        setStatusMessage("No order present!", true, true);
        return;
    }

    doTotal();
    chargeCreditCard();
}

function toggleProductInfoPopup() {
    setProductInfoPopup(!productInfoPopupMode);
}

function setProductInfoPopup(turnOn) {
    if (turnOn) {
        productInfoPopupMode = true;
        $('.button[id=sales_button_' + toggleProductInfoButtonID + ']').addClass("selected");
    } else {
        productInfoPopupMode = false;
        $('.button[id=sales_button_' + toggleProductInfoButtonID + ']').removeClass("selected");
    }
}