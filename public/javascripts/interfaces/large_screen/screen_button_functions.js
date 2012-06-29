function prepareXTotal() {
    doCashTotalReport("X", false);
}

function prepareZTotal() {
    var doIt = checkAllOrdersClosedForCashTotal();
    
    if(doIt || bypassOpenOrdersForCashTotal) {
        doCashTotalReport("Z", false);
    }
}

function checkAllOrdersClosedForCashTotal() {
    var allOrdersClosed = (!currentOrder || currentOrder.items.length == 0) && getActiveTableIDS().length == 0;
    
    if(!allOrdersClosed) {
        setStatusMessage("All Orders Must Be Closed!", true, true);
        return false;
    }
    
    return true;
}

function printCurrentReceipt() {
    if(currentOrderEmpty()) {
        setStatusMessage("No order present to print!");
        return;
    }
    
    content = fetchOrderReceiptHTML(getCurrentOrder());
    
    printReceipt(content, false);
}

function printLastReceipt() {
    doPrintLastReceipt(false);
}

function printLastReceiptWithVat() {
    doPrintLastReceipt(true);
}

function doPrintLastReceipt(withVat) {
    if(lastSaleObj != null) {
        totalOrder = lastSaleObj;
        
        var includeBusinessInfo = true;
        var includeServerAddedText = false;
        
        var content = fetchFinalReceiptHTML(includeBusinessInfo, includeServerAddedText, withVat);
        
        printReceipt(content, true);
    } else {
        niceAlert("No Last Sale Found.");
    }  
}

function promptForServiceCharge() {
    if(currentOrderEmpty()) {
        setStatusMessage("No order present!", true, true);
        return;
    }
    
    popupHTML = $("#service_charge_popup_markup").html();
        
    if(currentScreenIsMenu()) {
        popupEl = showMenuScreenDefaultPopup(popupHTML);
    } else if (currentScreenIsTotals()) {
        popupEl = showTotalsScreenDefaultPopup(popupHTML);
    }
        
    popupId = popupEl.GetBubblePopupID();
    
    keypadPosition = $('#' + popupId).find('.service_charge_popup_keypad_container');
    
    clickFunction = function(val) {
        if(serviceCharge == 0) serviceCharge = "";
            
        serviceCharge = serviceCharge.toString() + val;
            
        $('#' + popupId).find('.service_charge_popup_amount').html(serviceCharge);
    };
    
    cancelFunction = function() {
        oldVal = $('#' + popupId).find('.service_charge_popup_amount').html();
        newVal = oldVal.substring(0, oldVal.length - 1);
        $('#' + popupId).find('.service_charge_popup_amount').html(newVal);
        
        if(newVal == "") newVal = 0;
        
        serviceCharge = parseFloat(newVal);
    };
    
    var popupEl = $('#' + popupId);
    
    setDefaultServiceChargeButtonSelected(popupEl, defaultServiceChargePercent);
    
    serviceCharge = number_to_currency(serviceCharge);
    
    popupEl.find('.service_charge_popup_amount').html(serviceCharge);
    
    setUtilKeypad(keypadPosition, clickFunction, cancelFunction);
}

function saveServiceCharge(performTotal) {
    serviceCharge = parseFloat(serviceCharge);
    
    if(isNaN(serviceCharge)) {
        serviceCharge = 0;
    }
    
    //save the cashback in the order
    order = getCurrentOrder();
    order.service_charge = serviceCharge;
    
    //store the modified order
    if(selectedTable != 0) {
        storeTableOrderInStorage(current_user_id, selectedTable, order);
    }else {
        storeOrderInStorage(current_user_id, order);
    }
    
    hideServiceChargePopup();
    
    if(performTotal) {
        doTotal(false);
    }
}

function setServiceCharge() {
    popupEl = $('#totals_screen_default_popup_anchor');
    popupId = popupEl.GetBubblePopupID();
    var popupEl = $('#' + popupId);
    
    serviceCharge = parseFloat(popupEl.find('.service_charge_popup_amount').html());
    
    if(isNaN(serviceCharge)) {
        serviceCharge = 0;
    }
    
    saveServiceCharge(true);
}

function cancelServiceCharge() {
    //reset the sercice charge
    if(selectedTable == 0 || typeof tableOrders[selectedTable].service_charge == "undefined") {
        serviceCharge = 0;
    } else {
        serviceCharge = tableOrders[selectedTable].service_charge;
    }
    
    hideServiceChargePopup();
}

function hideServiceChargePopup() {
    hideTotalsScreenDefaultPopup();
}

function presetServiceChargePercentageClicked(percentage) {
    defaultServiceChargePercent = percentage;
    
    if(currentOrderEmpty()) {
        serviceCharge = 0;
    } else {
        serviceCharge = currency((percentage * parseFloat(getCurrentOrder().total))/100, false);
    }
    
    popupEl = $('#totals_screen_default_popup_anchor');
    popupId = popupEl.GetBubblePopupID();
    var popupEl = $('#' + popupId);
    
    popupEl.find('.service_charge_popup_amount').html(serviceCharge);
    
    setDefaultServiceChargeButtonSelected(popupEl, percentage);
}

function setDefaultServiceChargeButtonSelected(popupEl, percentage) {
    popupEl.find('.service_charge_button_percent').removeClass("selected");
    
    percentage = parseFloat(percentage);
    var percentage_without_decimal = percentage.toString().replace(".", "");
    
    popupEl.find('#service_charge_button_percent_' + percentage_without_decimal).addClass("selected");
}

function promptForCashback() {
    if(currentOrderEmpty()) {
        setStatusMessage("No order present!", true, true);
        return;
    }
    
    popupHTML = $("#cashback_popup_markup").html();
        
    popupEl = showTotalsScreenDefaultPopup(popupHTML);
       
    popupId = popupEl.GetBubblePopupID();
    
    keypadPosition = $('#' + popupId).find('.cashback_popup_keypad_container');
    
    clickFunction = function(val) {
        if(cashback == 0) cashback = "";
        
        cashback = cashback.toString() + val;
        
        $('#' + popupId).find('.cashback_popup_amount').html(cashback);
    };
    
    cancelFunction = function() {
        oldVal = $('#' + popupId).find('.cashback_popup_amount').html();
        newVal = oldVal.substring(0, oldVal.length - 1);
        $('#' + popupId).find('.cashback_popup_amount').html(newVal);
        
        if(newVal == "") newVal = 0;
        
        cashback = parseFloat(newVal);
    };
    
    $('#' + popupId).find('.cashback_popup_amount').html(cashback);
    
    setUtilKeypad(keypadPosition, clickFunction, cancelFunction);
}

function saveCashback() {    
    cashback = parseFloat(cashback);
    
    if(isNaN(cashback)) {
        cashback = 0;
    }
    
    //save the cashback in the order
    order = getCurrentOrder();
    order.cashback = cashback;
    
    //store the modified order
    if(selectedTable != 0) {
        storeTableOrderInStorage(current_user_id, selectedTable, order);
    }else {
        storeOrderInStorage(current_user_id, order);
    }
    
    hideCashbackPopup();
    
    if (currentScreenIsTotals()) {
        doTotal(false);
    }
}

function cancelCashback() {
    //reset the cashback
    if(selectedTable == 0 || typeof tableOrders[selectedTable].cashback == "undefined") {
        cashback = 0;
    } else {
        cashback = tableOrders[selectedTable].cashback;
    }
    
    hideServiceChargePopup();
}

function hideCashbackPopup() {
    hideTotalsScreenDefaultPopup();
}

function presetCashbackAmountClicked(amount) {
    cashback = amount;
    
    popupEl = $('#totals_screen_default_popup_anchor');
        
    popupId = popupEl.GetBubblePopupID();
    
    $('#' + popupId).find('.cashback_popup_amount').html(cashback);
}

var floatTotal = 0;

function initFloatScreen() {
    setNavTitle("Add Float");
    showNavBackLinkMenuScreen();
    
    coinCounterPosition = $('#float_coin_counter_widget_container');
    
    totalFunction = function(total) {
        floatTotal = total;
    };
    
    setUtilCoinCounter(coinCounterPosition, totalFunction);
    
    doCoinCounterTotal();
    
    $('#float_till_roll').html("Loading...");
    
    showFloatScreen();
    
    //show the last float and z total
    $.ajax({
        type: 'GET',
        url: '/float_history.js'
    }); 
}

function markFreeLastOrderItem() {
    order = getCurrentOrder();
    
    currentSelectedReceiptItemEl = getSelectedOrLastReceiptItem();
    
    if(currentSelectedReceiptItemEl) {
        itemNumber = currentSelectedReceiptItemEl.data("item_number");
        applyDiscountToOrderItem(order, itemNumber, 100);
    
        //store the modified order
        if(selectedTable != 0) {
            storeTableOrderInStorage(current_user_id, selectedTable, order);
        }else {
            storeOrderInStorage(current_user_id, order);
        }
    
        //redraw the receipt
        loadReceipt(order, true);
    }
    
    currentSelectedReceiptItemEl = null;
}

function changePriceLastOrderItem() {
    order = getCurrentOrder();
    
    currentSelectedReceiptItemEl = getSelectedOrLastReceiptItem();
    
    if(currentSelectedReceiptItemEl) {
        //must set a timeout here so that if we are on the more 
        //options screen, the widths have time to calculate correctly
        var popup = doSelectReceiptItem(currentSelectedReceiptItemEl);
        popup.find('.price').focus();
    }
}

function showAddNoteToOrderItemScreen() {
    order = getCurrentOrder();
    
    currentSelectedReceiptItemEl = getSelectedOrLastReceiptItem();
    
    if(currentSelectedReceiptItemEl) {
        if(currentScreenIsMenu()) {
            if(currentMenuSubscreenIsModifyOrderItem()) {
                if(doSaveNote()) {
                    $('.button[id=sales_button_' + addNoteButtonID + ']').removeClass("selected");
                    resetKeyboard();
                    switchToMenuItemsSubscreen();
                }
            } else {
                hideAllMenuSubScreens();
                $('#order_item_additions').show();
                doOpenOIANoteScreen();
            }
        }
        
    }
}

function showGlobalSettingsPage() {
    goTo('/admin/global_settings');
}

var usingPrintService = true;

function openCashDrawer() {
    console.log("open cash drawer");
    
    if(usingPrintService) {
        if(using_wss_cash_drawer) {
            if ("WebSocket" in window) {
                console.log("Sending cash drawer message");
        
                // Let us open a web socket
                var ws = new WebSocket("ws://" + cashDrawerServiceIP + ":8080/ClueyWebSocketServices/cash_drawer_controller_ws");
        
                ws.onopen = function() {
                    //Web Socket is connected, send data using send()
                    ws.send("open cash drawer!");
                    console.log("Cash Drawer message sent");
                    ws.close();
                };
        
                ws.onmessage = function (evt) { 
                    var received_msg = evt.data;
                    console.log("Message received: " + received_msg);
                };
            
                ws.onclose = function() { 
                    // websocket is closed.
                    console.log("Connection closed!"); 
                };
            } else {
                // The browser doesn't support WebSocket
                alert("WebSocket NOT supported by your browser, Please disable web sockets!");
            }
        } else {
            var cash_drawer_service_url = 'http://' + cashDrawerServiceIP + ':8080/ClueyWebSocketServices/cash_drawer_controller';
    
            $.ajax({
                type: 'POST',
                url: '/forward_cash_drawer_request',
                error: function() {
                    setStatusMessage("Cash drawer service cannot be reached.", false, false);
                },
                data: {
                    cash_drawer_service_url : cash_drawer_service_url,
                    message : "open cash drawer"
                }
            });
        }
    } else {
        //Printing Directly only works on firefox/windows
       
        //search for "signed.applets.codebase_principal_support" 
        //in this list and toggle its value to "true"
        try {
            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        } catch (e) {
            niceAlert("You must allow certain privileges ");
            return;
        }
    
        var prefs = Components.classes["@mozilla.org/preferences-service;1"]
        .getService(Components.interfaces.nsIPrefBranch);
        prefs.setBoolPref("signed.applets.codebase_principal_support", true);
    
        var dirService = Components.classes["@mozilla.org/file/directory_service;1"].
        getService(Components.interfaces.nsIProperties); 
    
        var homeDirFile = dirService.get("Home", Components.interfaces.nsIFile); // returns an nsIFile object
        var homeDir = homeDirFile.path;

        console.log("Users home dir: " + homeDir);

        //create cash drawer code file
        var cdcFilePath = homeDir + "/cdc.txt";
    
        var cdcFile = Components.classes["@mozilla.org/file/local;1"]
        .createInstance(Components.interfaces.nsILocalFile);
        cdcFile.initWithPath(cdcFilePath);
    
        if (!cdcFile.exists()) {
            console.log("Creating CDC file...");
        
            cdcFile.create(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 0777);
        
            var cdcOutputStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
            .createInstance(Components.interfaces.nsIFileOutputStream );

            cdcOutputStream.init(cdcFile, 0x04 | 0x08 | 0x20, 402, 0777);
            var cdcOutput = ' p0 ';
            var cdcOutputResult = cdcOutputStream.write(cdcOutput, cdcOutput.length);
        
            console.log(cdcOutputResult);
            cdcOutputStream.close();
        }
    
        //create the script
        var ocdScriptFilePath = homeDir + "/ocd.sh";
    
        var ocdScriptFile = Components.classes["@mozilla.org/file/local;1"]
        .createInstance(Components.interfaces.nsILocalFile);
        ocdScriptFile.initWithPath(ocdScriptFilePath);
    
        if (!ocdScriptFile.exists()) {
            console.log("Creating OCD Script...");
        
            ocdScriptFile.create(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 0777);
        
            var ocdScriptOutputStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
            .createInstance(Components.interfaces.nsIFileOutputStream );

            ocdScriptOutputStream.init(ocdScriptFile, 0x04 | 0x08 | 0x20, 0777, 0);
            var ocdScriptOutput = '#!/bin/sh \ncat ' + cdcFilePath + ' > /dev/usb/lp0';
            var ocdScriptOutputResult = ocdScriptOutputStream.write(ocdScriptOutput, ocdScriptOutput.length);
        
            console.log(ocdScriptOutputResult);
            ocdScriptOutputStream.close();
        }

        // create an nsIProcess
        var process = Components.classes["@mozilla.org/process/util;1"]
        .createInstance(Components.interfaces.nsIProcess);
        process.init(ocdScriptFile);

        // Run the process.
        // If first param is true, calling thread will be blocked until
        // called process terminates.
        // Second and third params are used to pass command-line arguments
        // to the process.
        var args = [];
        process.run(false, args, args.length);
    }
}

var addTableNamePopupEl;
var addTableNamePopupAnchor;

function promptAddNameToTable() {
    if(!callHomePollInitSequenceComplete) {
        niceAlert("Downloading data from server, please wait.");
        return;
    }    
    
    if(selectedTable == 0 || selectedTable == -1) {
        setStatusMessage("Only valid for table orders!");
        return;
    }
    
    var popupHTML = $("#name_table_popup_markup").html();
        
    addTableNamePopupAnchor = $('#receipt');
    
    if(addTableNamePopupAnchor.HasBubblePopup()) {
        addTableNamePopupAnchor.RemoveBubblePopup();
    }
    
    addTableNamePopupAnchor.CreateBubblePopup();
    
    addTableNamePopupAnchor.ShowBubblePopup({
        position: 'right',  
        align: 'top',
        tail	 : {
            align: 'middle'
        },
        innerHtml: popupHTML,
														   
        innerHtmlStyle:{ 
            'text-align':'left'
        },
        
        themeName: 	'all-grey',
        themePath: 	'/images/jquerybubblepopup-theme',
        alwaysVisible: false        
    }, false);
    
    addTableNamePopupAnchor.FreezeBubblePopup();
         
    var popupId = addTableNamePopupAnchor.GetBubblePopupID();
    
    addTableNamePopupEl = $('#' + popupId);
    
    var tableOrder = getCurrentOrder();
    
    if(tableOrder.client_name) {
        addTableNamePopupEl.find('input').val(tableOrder.client_name);
    }
    
    addTableNamePopupEl.find('input').focus();
    
    //show the keyboard
    $('#util_keyboard_container').slideDown(300);
}

function closePromptAddNameToTable() {
    if(addTableNamePopupEl) {
        hideBubblePopup(addTableNamePopupAnchor);
    }
    
    //hide the keyboard
    $('#util_keyboard_container').slideUp(300);
}

function saveAddNameToTable() {
    //do nothing if not table order
    if(selectedTable == 0 || selectedTable == -1) {
        closePromptAddNameToTable();
        return;
    }
    
    var tableOrder = getCurrentOrder();
    
    tableOrder.client_name = addTableNamePopupEl.find("#table_name_input").val().toUpperCase();
    
    closePromptAddNameToTable();
    
    storeTableOrderInStorage(current_user_id, selectedTable, tableOrder);
    
    if(!currentOrderEmpty()) {
        doAutoLoginAfterSync = true;
        doSyncTableOrder();
    } else {
        //must manually set the label
        if(tableOrder.client_name.length > 0) {
            $('#table_label_' + selectedTable).html(tables[selectedTable].label + " (" + tableOrder.client_name + ")");
        }
    }
    
    setStatusMessage("Name added to table");
}

function startSplitBillMode() {
    if(haveSplitBillOrder(current_user_id)) {
        niceAlert("You must deal with the split order that is currently open. Please select it from the menu and either transfer it to a table or cash it out.");
        tableSelectMenu.setValue(tempSplitBillTableNum);
        doSelectTable(tempSplitBillTableNum);
        return;
    }
    
    if(selectedTable == 0 || selectedTable == previousOrderTableNum) {
        setStatusMessage("Only valid for table orders!");
        return;
    }
    
    afterSplitBillSyncCallback = null;
    
    var order = getCurrentOrder();
    
    var orderSynced = true;
    
    //make sure all items are synced
    for(var i=0; i<order.items.length; i++) {
        if(!order.items[i].synced) {
            orderSynced = false;
            break;
        }
    }
    
    if(!orderSynced) {
        niceAlert("All items in the order must be ordered before you can split bill. You can also delete un-ordered items.");
        return;
    }
    
    inSplitBillMode = true;
    
    splitBillTableNumber = selectedTable;
    
    //copy over the order
    var copiedOrder = {};
    
    var theCopiedOrder = $.extend(true, copiedOrder, order);
    
    splitBillOrderFrom = theCopiedOrder;
    
    splitBillOrderTo = buildInitialOrder();
    
    //record the split bill table number
    splitBillOrderTo.split_bill_table_num = splitBillTableNumber;
    
    showSplitBillScreen();
    
    $('#split_bill_from_receipt_header').html("Table " + selectedTable);
    
    loadSplitBillReceipts();
}   

function changeCourseNum() {
    var receiptItem = getSelectedOrLastReceiptItem();
 
    if(receiptItem) {
        showCoursePopupFromEditDialog();
    }
}

function exitApp() {
    var doIt = confirm("Are you sure?");
    
    if(doIt) {
        window.open('','_self','');
        window.close();
    }
}

function tablesButtonPressed() {
    unorderedItemsPopup('doTablesButtonPressed();', true);
}

function doTablesButtonPressed() {
    if(currentMenuItemQuantity.length > 0) {
        //switch to table shortcut
        var tableLabelToSwitchTo = parseInt(Math.round(currentMenuItemQuantity));
        
        var tableID;
        
        if(tableLabelToSwitchTo == 0) {
            tableID = 0;
        } else {
            var table = getTableForLabel(tableLabelToSwitchTo);
            
            if(table == null) {
                setStatusMessage("Table " + tableLabelToSwitchTo + " does not exist.");
                //reset the quantity
                currentMenuItemQuantity = "";
                $('#menu_screen_input_show').html("");
                return;
            }
            
            tableID = table.id;
        }
        
        tableSelectMenu.setValue(tableID);
        doSelectTable(tableID);
        
        //reset the quantity
        currentMenuItemQuantity = "";
        $('#menu_screen_input_show').html("");
    } else {
        showTablesScreen();
    }
}

function saveButton() {
    unorderedItemsPopup('doLogout();', false);
}

function unorderedItemsPopup(evalCode, doAutoLogin) {
    if(currentOrderEmpty()) {
        eval(evalCode);
        return;
    }
    
    //make sure all items in this order have already been ordered
    var orderSynced = true;
    
    var order = getCurrentOrder();
    
    for(var i=0; i<order.items.length; i++) {
        if(!order.items[i].synced) {
            orderSynced = false;
            break;
        }
    }
    
    //if there are unordered items, we want to popup saying so, and ask the user
    //if they would like to order these items
    if(!orderSynced && selectedTable != 0 && selectedTable != previousOrderTableNum && selectedTable != tempSplitBillTableNum) {
        var yesCode = "hideNiceAlert();doSyncTableOrder();";
            
        if(doAutoLogin) {
            yesCode += "doAutoLoginAfterSync = true;";
        }
            
        var noCode = "hideNiceAlert();" + evalCode;
            
        ModalPopups.Confirm('niceAlertContainer',
            'Items Not Ordered!', "<div id='nice_alert'>These items are not ordered. Would you like to order them?</div>",
            {
                yesButtonText: 'Yes',
                noButtonText: 'No',
                onYes: yesCode,
                onNo: noCode,
                width: 400,
                height: 250
            });
    } else {
        eval(evalCode);  
    }
}

function voidOrderItem() {
    var receiptItem = getSelectedOrLastReceiptItem();
 
    if(receiptItem) {
        voidOrderItemFromEditDialog();
    }
}

function promptVoidAllOrderItems() {
    if(selectedTable == 0) {
        niceAlert("You cannot void items that are not on a table");
        return;
    }
    
    if(currentOrderEmpty()) {
        setStatusMessage("No order present!", true, true);
        return;
    }
    
    ModalPopups.Confirm('niceAlertContainer',
        'Void All?', "<div id='nice_alert'>Are you sure you want to void all items and cash this order out?</div>",
        {
            yesButtonText: 'Yes',
            noButtonText: 'No',
            onYes: "voidAllOrderItems()",
            onNo: "hideNiceAlert();",
            width: 400,
            height: 250
        } );
}

var addCoversPopupEl;
var addCoversPopupAnchor;

function promptAddCovers() {
    if(!callHomePollInitSequenceComplete) {
        niceAlert("Downloading data from server, please wait.");
        return;
    }    
    
    if(selectedTable == -1) {
        setStatusMessage("Only valid for table orders!");
        return;
    }
    
    var popupHTML = $("#add_covers_popup_markup").html();
        
    addCoversPopupAnchor = $('#receipt');
    
    if(addCoversPopupAnchor.HasBubblePopup()) {
        addCoversPopupAnchor.RemoveBubblePopup();
    }
    
    addCoversPopupAnchor.CreateBubblePopup();
    
    addCoversPopupAnchor.ShowBubblePopup({
        position: 'right',  
        align: 'top',
        tail	 : {
            align: 'middle'
        },
        innerHtml: popupHTML,
														   
        innerHtmlStyle:{ 
            'text-align':'left'
        },
        
        themeName: 	'all-grey',
        themePath: 	'/images/jquerybubblepopup-theme',
        alwaysVisible: false        
    }, false);
    
    addCoversPopupAnchor.FreezeBubblePopup();
         
    var popupId = addCoversPopupAnchor.GetBubblePopupID();
    
    addCoversPopupEl = $('#' + popupId);
    
    var tableOrder = getCurrentOrder();
    
    var covers = parseInt(tableOrder.covers);
    
    if(covers == 0) {
        addCoversPopupEl.find('input').val("");
    } else {
        addCoversPopupEl.find('input').val(tableOrder.covers);   
    }    
    
    addCoversPopupEl.find('input').focus().select();
    
    keypadPosition = $('#' + popupId).find('.add_covers_popup_keypad_container');
    
    clickFunction = function(val) {
        var input = addCoversPopupEl.find('input');
        
        var caretStart = input.caret().start;
        var caretEnd = input.caret().end;
        
        var newStartVal = input.val().substring(0, caretStart);
        var newEndVal = input.val().substring(caretEnd);
        
        input.val(newStartVal + val + newEndVal);
        input.caret({
            start : caretStart + 1, 
            end : caretStart + 1
        });
    };
    
    cancelFunction = function() {
        var input = addCoversPopupEl.find('input');
        
        var caretStart = input.caret().start;
        var caretEnd = input.caret().end;
        
        var newStartVal;
        var newEndVal;
        
        if(caretEnd > caretStart) {
            newStartVal = input.val().substring(0, caretStart);
            newEndVal = input.val().substring(caretEnd);
            input.val(newStartVal + newEndVal);
            input.caret({
                start : caretStart, 
                end : caretStart
            });
        } else {
            newStartVal = input.val().substring(0, caretStart - 1);
            newEndVal = input.val().substring(caretEnd);
            input.val(newStartVal + newEndVal);
            input.caret({
                start : caretStart - 1, 
                end : caretStart - 1
            });
        }
    };
    
    setUtilKeypad(keypadPosition, clickFunction, cancelFunction);

    //register the click handler to hide the popup when outside clicked
    registerPopupClickHandler($('#' + popupId), closePromptAddCovers);
}

function closePromptAddCovers() {
    if(addCoversPopupEl) {
        hideBubblePopup(addCoversPopupAnchor);
    }
}

function saveAddCovers() {
    //do nothing if not table order
    if(selectedTable == -1) {
        closePromptAddCovers();
        return;
    }
    
    var tableOrder = getCurrentOrder();
    
    var covers = addCoversPopupEl.find("#add_covers_input").val();
    
    //make sure its an integer
    covers = parseInt(covers);
    
    if(isNaN(covers)) {
        covers = 0;
    }
    
    tableOrder.covers = covers;
    
    closePromptAddCovers();
    
    if(selectedTable == 0) {
        storeTableOrderInStorage(current_user_id, selectedTable, tableOrder);
    }
    
    if(!currentOrderEmpty()) {
        if(autoCoversPrompt) {
            doAutoLoginAfterSync = true;
            autoCoversPrompt = false;
        }
        
        doSyncTableOrder();
    }
}

function pmShortcut(shortcutNum) {
    var shortcutPaymentMethod = paymentMethods[pmShortcutMap[shortcutNum]];
    
    applyDefaultServiceChargePercent();
    
    cashTendered = 0;
    splitPayments = {};
    
    paymentMethod = shortcutPaymentMethod.name;
    
    doTotalFinal();
}