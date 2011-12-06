var current_table_label = null;

var menuKeypadShowing = false;

var roomSelectMenu = null;
var menuSelectMenu = null;

function initMenu() {
    //click the 1st menu page
    $('#menu_pages_container .page').first().click();
    
    currentMenuPage = 1;
    currentOrder = new Array();

    $('#table_num_holder').html("Select Table");
    showTablesSubscreen();
    
    initModifierGrid();
}

//we don't use this function in the medium interface but it needs to be coded
function doDisplayButtonPasscodePrompt(button_id, forwardFunction) {
    forwardFunction.call();
}

function checkMenuScreenForFunction() {
    swipeToMenu();
    return true;
}

function renderActiveTables() {
    activeTableIDS = getActiveTableIDS();
    
//TODO: something with the active table ids
}

function menuScreenKeypadClick(val) {
    if(this.innerHTML == '0') {
        if(currentMenuItemQuantity.length > 0)
            currentMenuItemQuantity += val
    } else {
        //make sure you cannot enter a 2nd decimal place number
        if(currentMenuItemQuantity.indexOf(".") != -1) {
            if(currentMenuItemQuantity.length - currentMenuItemQuantity.indexOf(".") > 1) {
                return false;
            }
        }
    
        currentMenuItemQuantity += val;
    }
    
    return false;
}

function menuScreenKeypadClickDecimal() {
    if(currentMenuItemQuantity.indexOf(".") == -1) {
        currentMenuItemQuantity += ".";
    }
    
    return false;
}

function menuScreenKeypadClickCancel() {
    currentMenuItemQuantity = "";
    hideMenuKeypad();
    
    return false;
}

function doMenuPageSelect(pageNum, pageId) {
    //set this pages class to make it look selected
    $('#menu_pages_container .page').removeClass('selected');
    $('#menu_page_' + pageId).addClass('selected');

    $('#menu_items_container .items').hide();
    $('#menu_items_' + pageNum).show();
    
    //wake up the scrollers
    if(isTouchDevice()) {
        kickMenuScrollers();
    }
    
    currentMenuPage = pageNum;
    currentMenuPageId = pageId;
}

function doSelectMenuItem(productId, element) {
    if(!ensureLoggedIn()) {
        return;
    }
    
    if(currentMenuItemQuantity == "")
        currentMenuItemQuantity = "1";
    
    if(currentMenuItemQuantity.indexOf(".") != -1) {
        if(currentMenuItemQuantity.length - currentMenuItemQuantity.indexOf(".") == 1) {
            currentMenuItemQuantity = "1";
        }
    }
            
    currentSelectedMenuItemElement = element;

    //fetch this product from the products js array
    product = products[productId];
    amount = currentMenuItemQuantity;
    
    //reset the quantity
    currentMenuItemQuantity = "";

    buildOrderItem(product, amount);

    finishDoSelectMenuItem();
}

function finishDoSelectMenuItem() {
    var orderItem = currentOrderItem;
    
    //if this is a tables order deal with it in another function
    if(selectedTable != 0) {
        tableSelectMenuItem(orderItem);
        return;
    }
    
    addItemToOrderAndSave(orderItem);

    //add a line to the receipt
    writeOrderItemToReceipt(orderItem);
    writeTotalToReceipt(currentOrder, currentOrder['total']);

    menuRecptScroll();
}

function tableSelectMenuItem(orderItem) {
    addItemToTableOrderAndSave(orderItem);
    menuRecptScroll();
}

function closeEditOrderItem() {
    console.log("CloseEditOrderItem in medium interface called!");
    
    if(currentSelectedReceiptItemEl) {
        currentSelectedReceiptItemEl.removeClass("selected");
    
        currentSelectedReceiptItemEl = null;
    }
}

function doSelectReceiptItem(orderItemEl) {
    orderItemEl = $(orderItemEl);
    
    //close any open popup
    closeEditOrderItem();
    
    //save the currently opened dialog
    currentSelectedReceiptItemEl = orderItemEl;
    
    //keep the border
    orderItemEl.addClass("selected");
}

function writeOrderItemToReceipt(orderItem) {
    setReceiptsHTML(getCurrentRecptHTML() + getOrderItemReceiptHTML(orderItem));
}

function getAllOrderItemsReceiptHTML(order, includeNonSyncedStyling, includeOnClick, includeServerAddedText) {
    allOrderItemsReceiptHTML = "";

    for(var i=0; i<order.items.length; i++) {
        item = order.items[i];
        allOrderItemsReceiptHTML += getOrderItemReceiptHTML(order.items[i], includeNonSyncedStyling, includeOnClick, includeServerAddedText);
    }
    
    return allOrderItemsReceiptHTML;
}

function getOrderItemReceiptHTML(orderItem, includeNonSyncedStyling, includeOnClick, includeServerAddedText) {
    //default the args to true
    if (typeof includeNonSyncedStyling == "undefined") {
        includeNonSyncedStyling = true;
    }
    
    if (typeof includeOnClick == "undefined") {
        includeOnClick = true;
    }
    
    if (typeof includeServerAddedText == "undefined") {
        includeServerAddedText = true;
    }
    
    haveDiscount = orderItem.discount_percent && orderItem.discount_percent > 0;
    
    itemPriceWithoutDiscountOrModifier = orderItem.amount * orderItem.product_price;
    
    if(haveDiscount) {
        itemPriceWithoutModifier = itemPriceWithoutDiscountOrModifier - ((itemPriceWithoutDiscountOrModifier * orderItem.discount_percent)/100);
    } else {
        itemPriceWithoutModifier = itemPriceWithoutDiscountOrModifier;
    }
    
    notSyncedClass = (includeNonSyncedStyling && !orderItem.synced) ? "not_synced" : "";
    notSyncedMarker = (includeNonSyncedStyling && !orderItem.synced) ? "*" : "";
    
    onclickMarkup = includeOnClick ? "onclick='doSelectReceiptItem(this)'" : "";
    
    var courseLineClass = orderItem.is_course ? "course" : "";
    
    orderHTML = "<div class='order_line " + notSyncedClass + " " + courseLineClass + "' data-item_number='" + orderItem.itemNumber + "' " + onclickMarkup + ">";
    
    if(includeServerAddedText && orderItem.showServerAddedText) {
        var nickname = serverNickname(orderItem.serving_employee_id);
        var timeAdded = utilFormatTime(new Date(parseInt(orderItem.time_added)));
        orderHTML += "<div class='server'>At " + timeAdded + " " + nickname + " added:</div>";
    }
    
    orderHTML += "<div class='amount'>" + orderItem.amount + "</div>";
    orderHTML += "<div class='name'>" + notSyncedMarker + " " + orderItem.product.name + "</div>";
    
    orderItemTotalPriceText = number_to_currency(itemPriceWithoutModifier, {
        precision : 2
    });
    orderHTML += "<div class='total' data-per_unit_price='" + orderItem.product_price + "'>" + (orderItem.product.show_price_on_receipt ? orderItemTotalPriceText : "") + "</div>";
    
    if(orderItem.modifier) {
        orderHTML += "<div class='clear'>&nbsp;</div>";
        orderHTML += "<div class='modifier_name'>" + orderItem.modifier.name + "</div>";
        
        modifierPriceWithoutDiscount = orderItem.modifier.price * orderItem.amount;
        
        if(haveDiscount) {
            modifierPrice = modifierPriceWithoutDiscount - ((modifierPriceWithoutDiscount * orderItem.discount_percent)/100);
        } else {
            modifierPrice = modifierPriceWithoutDiscount;
        }
    
        //only show modifier price if not zero
        if(orderItem.modifier.price > 0) {
            modifierPriceText = number_to_currency(modifierPrice, {
                precision : 2
            });
            orderHTML += "<div class='modifier_price'>" + modifierPriceText + "</div>";
        }
        
        orderHTML += clearHTML;
    }
    
    if(orderItem.oia_items) {
        for(var j=0; j<orderItem.oia_items.length; j++) {
            oia_is_add = orderItem.oia_items[j].is_add;
            
            orderHTML += clearHTML + "<div class='oia " + (orderItem.oia_items[j].hide_on_receipt ? "hide_on_receipt" : "") + "'>";
            
            if(!orderItem.oia_items[j].is_note) {
                orderHTML += "<div class='oia_add'>";
                
                if(orderItem.oia_items[j].is_addable) {
                    orderHTML += oia_is_add ? "Add" : "No";
                } else {
                    orderHTML += "&nbsp;";
                }
                
                orderHTML += "</div>";
            }
            
            orderHTML += "<div class='oia_name " + (orderItem.oia_items[j].is_note ? "note" : "") + "'>" + orderItem.oia_items[j].description + "</div>";
            
            if(orderItem.oia_items[j].abs_charge != 0) {
                
                oiaPriceWithoutDiscount = orderItem.oia_items[j].abs_charge * orderItem.amount;
        
                if(haveDiscount && oia_is_add) {
                    oiaPrice = oiaPriceWithoutDiscount - ((oiaPriceWithoutDiscount * orderItem.discount_percent)/100);
                } else {
                    oiaPrice = oiaPriceWithoutDiscount;
                }
        
                orderHTML += "<div class='oia_price'>" + (!oia_is_add ? "-" : "") + currency(oiaPrice, false) + "</div>";
            }
            
            orderHTML += "</div>" + clearHTML;
        }
    }

    var preDiscountPrice = (orderItem.product_price * orderItem.amount);

    //add the modifiers price to the preDiscountPrice
    if(orderItem.modifier) {
        preDiscountPrice += orderItem.modifier.price * orderItem.amount;
    }
    
    //add the oias price to the preDiscountPrice
    if(orderItem.oia_items) {
        var oiaPriceTotal = 0;
        
        for(var j=0; j<orderItem.oia_items.length; j++) {
            var nextOia = orderItem.oia_items[j];
            
            if(nextOia.is_add) {
                oiaPriceTotal += orderItem.oia_items[j].abs_charge;
            } else {
                oiaPriceTotal -= orderItem.oia_items[j].abs_charge;
            }
        }
        
        preDiscountPrice += oiaPriceTotal * orderItem.amount;
    }
    
    if(haveDiscount) {
        formattedPreDiscountedPrice = number_to_currency(preDiscountPrice, {
            precision : 2
        });
            
        orderHTML += clearHTML;
        
        if(orderItem.discount_percent == 100) {
            orderHTML += "<div class='discount_complimentary'>Complimentary (was " + formattedPreDiscountedPrice + ")</div>";
        } else {
            orderHTML += "<div class='discount'><div class='header'>Discounted</div>";
            orderHTML += "<div class='discount_amount'>" + orderItem.discount_percent + "% from </div>";
            orderHTML += "<div class='new_price'>" + formattedPreDiscountedPrice + "</div></div>";
        }
    }
    
    orderHTML += clearHTML + "</div>" + clearHTML;
    
    return orderHTML;
}

function menuRecptScroll() {
    recptScroll("menu_screen_");
    recptScroll("large_menu_screen_");
}

function loadReceipt(order) {
    clearReceipt();
    
    if(order == null){
        return;
    }

    orderTotal = order.total;
    orderItems = order.items;

    allOrderItemsRecptHTML = getAllOrderItemsReceiptHTML(order);
    
    setReceiptsHTML(getCurrentRecptHTML() + allOrderItemsRecptHTML)

    if(orderTotal != null) {
        writeTotalToReceipt(order, orderTotal);
    }
    
    menuRecptScroll();
}

function clearReceipt() {
    setReceiptsHTML("");
}

function postDoSyncTableOrder() {
    //redraw the receipt if we dont leave this screen
    //so that the highlighted items are no longer highlighted
    doSelectTable(selectedTable);
    
    //clean up after transfer order mode
    if(inTransferOrderMode) {
        niceAlert("Order Transfered.");
        inTransferOrderMode = false;
        $('#table_num').val(tables[selectedTable].label);
        doSubmitTableNumber();
        return;
    }
    
    setStatusMessage("Order Sent");
    
    //vibrate!
    vibrate();
    
    showTablesSubscreen();
}

function showModifyOrderItemScreen() {
    switchToModifyOrderItemSubscreen();
}

function switchToMenuItemsSubscreen() {
    if(currentScreenIsMenu) {
        showMenuItemsSubscreen();
    }
}

function showMenuItemsSubscreen() {
    hideAllMenuSubScreens();
    $('#menu_screen #buttons_container').show();
    $('#menu_screen #cluey_logo').hide();
    $('#menu_container').show();
    
    //reselect the current menu page as there is a bug in the scrollers
    setTimeout(function(){
        doMenuPageSelect(currentMenuPage, currentMenuPageId);
    }, 500);
}

function switchToModifyOrderItemSubscreen() {
    if(currentScreenIsMenu) {
        hideAllMenuSubScreens();
        $('.button[id=sales_button_' + modifyOrderItemButtonID + ']').addClass("selected");
        $('#order_item_additions').show();
    }
}

function showTablesSubscreen() {
    hideAllMenuSubScreens();
    
    //blank the function buttons
    $('#menu_screen #buttons_container').hide();
    $('#menu_screen #cluey_logo').show();
    
    $('.button[id=sales_button_' + tablesButtonID + ']').addClass("selected");
    $('#table_screen').show();
}

function tableNumberSelectKeypadClick(val) {
    var newVal = $('#table_num').val().toString() + val;
    $('#table_number_show').html(newVal);
    $('#table_num').val(newVal);
}

function doCanceltableNumberSelectKeypad() {
    oldVal = $('#table_num').val().toString();
    newVal = oldVal.substring(0, oldVal.length - 1);
    $('#table_number_show').html(newVal);
    $('#table_num').val(newVal);
}

function doSubmitTableNumber() {
    if(!ensureLoggedIn()) {
        return;
    }
    
    var table_label = $('#table_num').val().toString();
    
    //check table exists
    table_info = getTableForLabel(table_label);
    
    clearTableNumberEntered();
    
    if(!table_info) {
        $('#table_number_show').html("No Such Table!");
        return;
    }
    
    if(inTransferOrderMode) {
        if(transferOrderInProgress) {
            niceAlert("Transfer table order in progress, please wait.");
            return;
        }
        
        doTransferTable(selectedTable, table_info.id);
        
        return;
    }
    
    current_table_label = table_label;
    
    doSelectTable(table_info.id);
    
    clearTableNumberEntered();
    showMenuItemsSubscreen();
}

function clearTableNumberEntered() {
    $('#table_num').val("");
    $('#table_number_show').html("");
}

function postDoSelectTable() {
    var theLabel = "Table " + current_table_label;
    $('.button[id=sales_button_' + tablesButtonID + '] .button_name').html(theLabel);
    $('#receipt_screen #header #table_name').html(theLabel);
}

function orderItemAdditionClicked(el) {
    currentSelectedReceiptItemEl = getLastReceiptItem();
    
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
    
    addOIAToOrderItem(order, orderItem, desc, absCharge, plusCharge, minusCharge, oiaIsAdd, false, hideOnReceipt, isAddable);
}

function addOIAToOrderItem(order, orderItem, desc, absCharge, plusCharge, minusCharge, oiaIsAdd, isNote, hideOnReceipt, isAddable) {
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
        var lastOIA = orderItem.oia_items[orderItem.oia_items.length-1];
        var lastOIADesc = lastOIA.description;
        
        if(lastOIADesc == desc) {
            oiaEdited = true;
            
            if(lastOIA.is_add) {
                lastOIA.is_add = false;
                
                //save the new abs_charge to be the minus charge
                lastOIA.abs_charge = minusCharge;
            
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
                
                orderItem.oia_items.splice(orderItem.oia_items.length-1, orderItem.oia_items.length);
                
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
            'is_addable' : isAddable
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
    loadReceipt(order);
    setTimeout(menuRecptScroll, 20);
    
    currentSelectedReceiptItemEl = null;
}

function writeTotalToReceipt(order, orderTotal) {
    if(!order) return;
    
    console.log("Write total to receipt NYI!");
}

function tableScreenBack() {
    if(selectedTable == 0) {
        $('#table_number_show').html("Enter a Table!");
        return;
    }
    showMenuItemsSubscreen();
}

function doReceiveOrderReady(employee_id, terminal_id, table_id, table_label) {
    hidePreviousOrderReadyPopup();
    
    if(employee_id == current_user_id || allDevicesOrderNotification) {
        vibrateConstant();        
     
        //        ModalPopups.Confirm('niceAlertContainer',
        //            'Order Ready!', "<div id='nice_alert'>Order for table <b>" + table_label + "</b> is ready</div>",
        //            {
        //                yesButtonText: 'OK',
        //                noButtonText: 'Cancel',
        //                onYes: 'orderReadyOKClicked()',
        //                onNo: 'orderReadyCancelClicked()',
        //                width: 400,
        //                height: 250
        //            } );

        ModalPopups.Alert('niceAlertContainer',
            'Order Ready!', "<div id='nice_alert'>Order for table <b>" + table_label + "</b> is ready</div>",
            {
                okButtonText: 'OK',
                onOk: 'orderReadyOKClicked()',
                width: 400,
                height: 250
            } );
    }
}

function orderReadyOKClicked() {
    hideOrderReadyPopup();
    stopVibrate();
    
    //ajax to say accepted
    console.log("Order accepted!!");
}

function orderReadyCancelClicked() {
    hideOrderReadyPopup();
    stopVibrate();
    
    //ajax to say rejected
    console.log("Order rejected!!");
}

function hidePreviousOrderReadyPopup() {
    hideOrderReadyPopup();
}

function hideOrderReadyPopup() {
    try {
        ModalPopups.Close('niceAlertContainer');
    } catch (e) {
        
    }
}

function displayDropdownSelected(selectedDisplayId) {
    showSpinner();
    
    //do ajax request and then reload   
    $.ajax({
        type: 'POST',
        url: '/admin/terminals/link_display',
        success: function() {
            window.location.reload();
        },
        data: {
            terminal_id : terminalID,
            display_id : selectedDisplayId
        }
    });

}