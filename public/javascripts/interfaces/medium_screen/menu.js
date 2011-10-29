var current_table_label = null;

function initMenu() {
    //click the 1st menu page
    $('#menu_pages_container .page').first().click();
    
    renderActiveTables();
    
    currentMenuPage = 1;
    currentOrder = new Array();

    loadCurrentOrder();
    
    displayLastReceipt();
    
    initModifierGrid();
}

//we don't use this function in the medium interface but it needs to be coded
function doDisplayButtonPasscodePrompt(button_id, forwardFunction) {
    forwardFunction.call();
}

function checkMenuScreenForFunction() {
    //return true for now...
    return true;
}

function renderActiveTables() {
    activeTableIDS = getActiveTableIDS();
    
//TODO: something with the active table ids
}

function doMenuPageSelect(pageNum, pageId) {
    //set this pages class to make it look selected
    $('#menu_pages_container .page').removeClass('selected');
    $('#menu_page_' + pageId).addClass('selected');

    $('#menu_items_container .items').hide();
    $('#menu_items_' + pageNum).show();
    
    currentMenuPage = pageNum;
}

function doSelectMenuItem(productId, element) {
    //    if(currentMenuItemQuantity == "")
    //        currentMenuItemQuantity = "1";
    //
    //    if(currentMenuItemQuantity.indexOf(".") != -1) {
    //        if(currentMenuItemQuantity.length - currentMenuItemQuantity.indexOf(".") == 1) {
    //            currentMenuItemQuantity = "1";
    //        }
    //    }
            
    currentSelectedMenuItemElement = element;

    //fetch this product from the products js array
    product = products[productId]
    
    //todo: pick this up dynamically
    amount = 1;
    
    //reset the quantity
    //currentMenuItemQuantity = "";

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
    //writeTotalToReceipt(currentOrder, currentOrder['total']);

    menuRecptScroll();
}

function tableSelectMenuItem(orderItem) {
    addItemToTableOrderAndSave(orderItem);
    menuRecptScroll();
}

function writeOrderItemToReceipt(orderItem) {
    setReceiptsHTML(getCurrentReceiptHTML() + getOrderItemReceiptHTML(orderItem));
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
    
    orderHTML = "<div class='order_line " + notSyncedClass + "' data-item_number='" + orderItem.itemNumber + "' " + onclickMarkup + ">";
    
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
    orderHTML += "<div class='total' data-per_unit_price='" + orderItem.product_price + "'>&nbsp;</div>";
    
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
            orderHTML += "<div class='modifier_price'>&nbsp;</div>";
        }
        
        orderHTML += clearHTML;
    }
    //alert(orderItem.oia_items);
    if(orderItem.oia_items) {
        for(var j=0; j<orderItem.oia_items.length; j++) {
            oia_is_add = orderItem.oia_items[j].is_add;
            
            if(!orderItem.oia_items[j].is_note) {
                orderHTML += "<div class='oia_add'>" + (oia_is_add ? "Add" : "No") + "</div>";
            }
            
            orderHTML += "<div class='oia_name " + (orderItem.oia_items[j].is_note ? "note" : "") + "'>" + orderItem.oia_items[j].description + "</div>";
            
            if(orderItem.oia_items[j].abs_charge != 0) {
                
                oiaPriceWithoutDiscount = orderItem.oia_items[j].abs_charge * orderItem.amount;
        
                if(haveDiscount && oia_is_add) {
                    oiaPrice = oiaPriceWithoutDiscount - ((oiaPriceWithoutDiscount * orderItem.discount_percent)/100);
                } else {
                    oiaPrice = oiaPriceWithoutDiscount;
                }
        
                //orderHTML += "<div class='oia_price'>" + (!oia_is_add ? "-" : "") + currency(oiaPrice, false) + "</div>";
                orderHTML += "<div class='oia_price'>&nbsp;</div>";
            }
            
            orderHTML += clearHTML;
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
    
    setReceiptsHTML(getCurrentReceiptHTML() + allOrderItemsRecptHTML)

    //    if(orderTotal != null) {
    //        writeTotalToReceipt(order, orderTotal);
    //    }
    
    menuRecptScroll();
}

function clearReceipt() {
    setReceiptsHTML("");
}

function postDoSyncTableOrder() {
    //redraw the receipt if we dont leave this screen
    //so that the highlighted items are no longer highlighted
    doSelectTable(selectedTable);
    
    setStatusMessage("Order Sent!");
    
    //vibrate!
    demoJSInterface.vibrate();
}

function showModifyOrderItemScreen() {
    switchToModifyOrderItemSubscreen();
}

function switchToMenuItemsSubscreen() {
    if(currentScreenIsMenu()) {
        showMenuItemsSubscreen();
    }
}

function showMenuItemsSubscreen() {
    hideAllMenuSubScreens();
    $('#menu_container').show();
}

function switchToModifyOrderItemSubscreen() {
    if(currentScreenIsMenu()) {
        hideAllMenuSubScreens();
        $('#sales_button_' + modifyOrderItemButtonID).addClass("selected");
        $('#order_item_additions').show();
    }
}

function showTablesSubscreen() {
    hideAllMenuSubScreens();
    $('#sales_button_' + tablesButtonID).addClass("selected");
    $('#table_screen').show();
}

function tableNumberSelectKeypadClick(val) {
    newVal = $('#table_num').val().toString() + val;
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
    table_label = $('#table_num').val().toString();
    
    //check table exists
    table_info = getTableForLabel(table_label);
    
    clearTableNumberEntered();
    
    if(!table_info) {
        $('#table_number_show').html("No Such Table!");
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
    $('#sales_button_' + tablesButtonID + ' .button_name').html(theLabel);
    $('#receipt_screen #header').html(theLabel);
}

function orderItemAdditionClicked(el) {
    currentSelectedReceiptItemEl = getLastReceiptItem();
    
    if(!currentSelectedReceiptItemEl) {
        setStatusMessage("There are no receipt items!");
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
    
    if(oiaIsAdd) {
        absCharge = el.data("add_charge");
    } else {
        absCharge = el.data("minus_charge");
    }
    
    addOIAToOrderItem(order, orderItem, desc, absCharge, oiaIsAdd, false);
}

function addOIAToOrderItem(order, orderItem, desc, absCharge, oiaIsAdd, isNote) {
    if(typeof(orderItem.oia_items) == 'undefined') {
        orderItem.oia_items = new Array();
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
            } else {
                orderItem.oia_items.splice(orderItem.oia_items.length-1, orderItem.oia_items.length);
            }
        }
    }

    if(!oiaEdited) {
        oia_item = {
            'description' : desc,
            'abs_charge' : absCharge,
            'is_add' : oiaIsAdd, 
            'is_note' : isNote
        }
    
        //update the total
        if(oiaIsAdd) {
            orderItem.total_price = orderItem.total_price + (orderItem.amount * absCharge);
        } else {
            orderItem.total_price = orderItem.total_price - (orderItem.amount * absCharge);
        }
    
        orderItem.oia_items.push(oia_item);
    }

    //store the modified order
    if(selectedTable != 0) {
        storeTableOrderInStorage(current_user_id, selectedTable, order);
    }else {
        storeOrderInStorage(current_user_id, order);
    }
        
    //redraw the receipt
    calculateOrderTotal(order);
    loadReceipt(order);
    
    currentSelectedReceiptItemEl = null;
}