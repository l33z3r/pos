var currentMenuPage;
var currentOrder = null;
var currentTableOrder = null;
var totalOrder = null;
var currentOrderItem;
var currentTotalFinal = 0;
var currentOrderJSON;
var currentMenuItemQuantity = "";

var tableSelectMenu = null;
var selectedTable = 0;
var tableOrders = new Array();

var paymentMethod = null;
var serviceCharge = 0;
var cashback = 0;

//this function is called from application.js on page load
function initMenu() {
    loadFirstMenuPage();
    renderActiveTables();
    
    currentMenuPage = 1;
    currentOrder = new Array();

    loadCurrentOrder();
    displayLastReceipt();
    initOptionButtons();
    
    initModifierGrid();
    
    //hack to scroll the recpt a little after page has loaded as there 
    //were problems on touch interface with recpt getting stuck
    setTimeout("menuRecptScroll()", 1000);
}

function initPreviousOrder() {
    if(havePreviousOrder(current_user_id)) {
        selectedTable = -1;
        $('#previous_order_select_item').show();
        //$('#table_select').val(-1);
        tableSelectMenu.setValue(-1);
        doSelectTable(-1);
        
        getTableOrderFromStorage(current_user_id, -1)
        
        previousTableOrder = tableOrders[-1];
        
        //carry over service charge
        serviceCharge = previousTableOrder.service_charge;
        
        //carry over payment method
        paymentMethod = previousTableOrder.payment_method;
        
        cashback = previousTableOrder.cashback;
        
        //carry over the table number
        tables[-1] = {
            id : '-1', 
            label : previousTableOrder.table_info_label
        };
    }
}

function menuScreenKeypadClick(val) {
    if(showingDisplayButtonPasscodePromptPopup) {
        $('#display_button_passcode').val($('#display_button_passcode').val() + val);
        $('#display_button_passcode_show').html($('#display_button_passcode_show').html() + val);
    } else {
        closePreviousModifierDialog();
        
        if(this.innerHTML == '0') {
            if(currentMenuItemQuantity.length > 0)
                currentMenuItemQuantity += val
        } else {
            //make sure you cannot enter a 2nd decimal place number
            if(currentMenuItemQuantity.indexOf(".") != -1) {
                if(currentMenuItemQuantity.length - currentMenuItemQuantity.indexOf(".") > 1) {
                    return;
                }
            }
    
            currentMenuItemQuantity += val;
        }
    }
}

function menuScreenKeypadClickCancel() {
    currentMenuItemQuantity = "";
}

function menuScreenKeypadClickDecimal() {
    if(currentMenuItemQuantity.indexOf(".") == -1) {
        currentMenuItemQuantity += ".";
    }
}

function loadFirstMenuPage() {
    //set the inital menu page selected to be the first
    $('#menu_items_container').html($('#menu_items_1').html());
    $('#pages .page').removeClass("selected");
    $('#pages .page').first().addClass("selected");
}

//load the current bar receipt order into memory
function loadCurrentOrder() {
    //retrieve the users current order from cookie
    currentOrder = getOrderFromStorage(current_user_id);
}

function doMenuPageSelect(pageNum, pageId) {
    //make sure the modifier popups are closed
    if(currentSelectedMenuItemElement) {
        $(currentSelectedMenuItemElement).HideBubblePopup();
        $(currentSelectedMenuItemElement).FreezeBubblePopup();
    }
    
    //set this pages class to make it look selected
    $('#pages .page').removeClass('selected');
    $('#menu_page_' + pageId).addClass('selected');

    newHTML = $('#menu_items_' + pageNum).html();
    $('#menu_items_container').html(newHTML);
    currentMenuPage = pageNum;
}

var currentSelectedMenuItemElement;

function doSelectMenuItem(productId, element) {
    if(currentMenuItemQuantity == "")
        currentMenuItemQuantity = "1";

    if(currentMenuItemQuantity.indexOf(".") != -1) {
        if(currentMenuItemQuantity.length - currentMenuItemQuantity.indexOf(".") == 1) {
            currentMenuItemQuantity = "1";
        }
    }
            
    closePreviousModifierDialog();
    
    currentSelectedMenuItemElement = element;

    //fetch this product from the products js array
    product = products[productId]
    amount = currentMenuItemQuantity;
    
    //reset the quantity
    currentMenuItemQuantity = "";

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

    currentOrderItem = orderItem;

    //does this product have a modifier
    modifierCategoryId = product['modifier_category_id'];

    if(modifierCategoryId) {
        showModifierDialog(modifierCategoryId);
        return;
    }

    finishDoSelectMenuItem();
}

function showModifierDialog(modifierCategoryId) {
    boxEl = $(currentSelectedMenuItemElement);
    
    if(!boxEl.HasBubblePopup()) {
        boxEl.CreateBubblePopup();
    }
         
    popupHTML = $("#modifier_category_popup_" + modifierCategoryId).html();
         
    boxEl.ShowBubblePopup({
        align: 'center',
        innerHtml: popupHTML,
														   
        innerHtmlStyle:{ 
            'text-align':'left'
        },
												   
        themeName: 	'all-grey',
        themePath: 	'/images/jquerybubblepopup-theme'

    }, false);
    
    boxEl.FreezeBubblePopup();
    
    popupId = boxEl.GetBubblePopupID();
    
    //register the click handler to hide the popup when outside clicked
    registerPopupClickHandler($('#' + popupId), function(){
        boxEl.HideBubblePopup()
    });
}

function closePreviousModifierDialog() {
    //close the dialog of the popup for previous modifier if it not closed
    if(currentSelectedMenuItemElement) {
        hideBubblePopup($(currentSelectedMenuItemElement));
    }
}

function noModifierSelected() {
    //close the dialog
    $(currentSelectedMenuItemElement).HideBubblePopup();
    $(currentSelectedMenuItemElement).FreezeBubblePopup();
    finishDoSelectMenuItem();
}

function modifierSelected(modifierId, modifierName, modifierPrice) {
    currentOrderItem['modifier'] = {
        'id':modifierId,
        'name':modifierName,
        'price':modifierPrice
    }
    currentOrderItem['total_price'] = currentOrderItem['total_price'] + (currentOrderItem['amount'] * modifierPrice);

    //close the dialog
    $(currentSelectedMenuItemElement).HideBubblePopup();
    $(currentSelectedMenuItemElement).FreezeBubblePopup();
    
    finishDoSelectMenuItem();
}

function finishDoSelectMenuItem() {
    orderItem = currentOrderItem;

    //either way we want to store the user id
    orderItem['serving_employee_id'] = current_user_id;
    orderItem['time_added'] = new Date().getTime();
    
    //if this is a tables order deal with it in another function
    if(selectedTable != 0) {
        tableSelectMenuItem(orderItem);
        return;
    }
    
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

    //add a line to the receipt
    writeOrderItemToReceipt(orderItem);
    writeTotalToReceipt(currentOrder, currentOrder['total']);

    menuRecptScroll();
}

function tableSelectMenuItem(orderItem) {
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
    writeTotalToReceipt(currentTableOrder, currentTableOrder['total']);
    
    menuRecptScroll();
}
    
function writeOrderItemToReceipt(orderItem) {
    $('#till_roll').html($('#till_roll').html() + getOrderItemReceiptHTML(orderItem));
}

function getAllOrderItemsReceiptHTML(order, includeNonSyncedStyling, includeOnClick, includeServerAddedText) {
    allOrderItemsReceiptHTML = "";

    for(i=0; i<order.items.length; i++) {
        item = order.items[i];
        allOrderItemsReceiptHTML += getOrderItemReceiptHTML(order.items[i], includeNonSyncedStyling, includeOnClick, includeServerAddedText);
    }
    
    return allOrderItemsReceiptHTML;
}
    
//TODO: replace with jquery template => http://api.jquery.com/jQuery.template/
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
    orderHTML += "<div class='total' data-per_unit_price='" + orderItem.product_price + "'>" + orderItemTotalPriceText + "</div>";
    
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
    //alert(orderItem.oia_items);
    if(orderItem.oia_items) {
        for(j=0; j<orderItem.oia_items.length; j++) {
            oia_is_add = orderItem.oia_items[j].is_add;
            
            orderHTML += "<div class='oia_add'>" + (oia_is_add ? "Add" : "No") + "</div>";
            orderHTML += "<div class='oia_name'>" + orderItem.oia_items[j].description + "</div>";
            
            if(orderItem.oia_items[j].abs_charge != 0) {
                
                oiaPriceWithoutDiscount = orderItem.oia_items[j].abs_charge * orderItem.amount;
        
                if(haveDiscount && oia_is_add) {
                    oiaPrice = oiaPriceWithoutDiscount - ((oiaPriceWithoutDiscount * orderItem.discount_percent)/100);
                } else {
                    oiaPrice = oiaPriceWithoutDiscount;
                }
        
                orderHTML += "<div class='oia_price'>" + (!oia_is_add ? "-" : "") + currency(oiaPrice, false) + "</div>";
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
        
        for(j=0; j<orderItem.oia_items.length; j++) {
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

var currentSelectedReceiptItemEl;
var editItemPopupAnchor;

function doSelectReceiptItem(orderItemEl) {
    orderItemEl = $(orderItemEl);
    
    //close any open popup
    closeEditOrderItem();
    
    //save the currently opened dialog
    currentSelectedReceiptItemEl = orderItemEl;
    
    //keep the border
    orderItemEl.addClass("selected");
    
    editItemPopupAnchor = $('#receipt');
    
    if(editItemPopupAnchor.HasBubblePopup()) {
        editItemPopupAnchor.RemoveBubblePopup();
    }
    
    editItemPopupAnchor.CreateBubblePopup();
    
    popupHTML = $("#edit_receipt_item_popup_markup").html();
    
    editItemPopupAnchor.ShowBubblePopup({
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
    
    editItemPopupAnchor.FreezeBubblePopup();
         
    //set the current price and quantity
    popupId = editItemPopupAnchor.GetBubblePopupID();
    
    currentPrice = orderItemEl.children('.total').data("per_unit_price");
    currentPrice = currency(currentPrice, false);
    $('#' + popupId).find('.price').val(currentPrice);
    
    currentQuantity = orderItemEl.children('.amount').html();
    $('#' + popupId).find('.quantity').val(currentQuantity);
    
    $('#' + popupId).find('.quantity').focus();
    
    keypadPosition = $('#' + popupId).find('.edit_order_item_popup_keypad_container');
    
    clickFunction = function(val) {
        currentVal = lastActiveElement.val();
        if(currentVal == 0) currentVal = "";
        newVal = currentVal.toString() + val;
        lastActiveElement.val(newVal);
    };
    
    cancelFunction = function() {
        oldVal = lastActiveElement.val();
        newVal = oldVal.substring(0, oldVal.length - 1);
        lastActiveElement.val(newVal);
    };
    
    setUtilKeypad(keypadPosition, clickFunction, cancelFunction);

    //register the click handler to hide the popup when outside clicked
    registerPopupClickHandler($('#' + popupId), closeEditOrderItem);
}

function editOrderItemIncreaseQuantity() {
    popupId = editItemPopupAnchor.GetBubblePopupID();
    
    targetInputEl = $('#' + popupId).find('.quantity');
    
    currentVal = parseFloat(targetInputEl.val());
    targetInputEl.val(currentVal + 1);
}

function editOrderItemDecreaseQuantity() {
    popupId = editItemPopupAnchor.GetBubblePopupID();
    
    targetInputEl = $('#' + popupId).find('.quantity');
    
    currentVal = parseFloat(targetInputEl.val());
    
    if(currentVal != 1) {
        targetInputEl.val(currentVal - 1);
    }
}

function closeEditOrderItem() {
    if(currentSelectedReceiptItemEl) {
        hideBubblePopup(editItemPopupAnchor);
        currentSelectedReceiptItemEl.removeClass("selected");
    
        currentSelectedReceiptItemEl = null;
    }
}

function saveEditOrderItem() {
    //fetch the item number
    itemNumber = currentSelectedReceiptItemEl.data("item_number");
    
    popupId = editItemPopupAnchor.GetBubblePopupID();
    
    closeEditOrderItem();
    
    //fetch the order from the order array and modify it
    //then modify the html in the receipt
    targetInputQuantityEl = $('#' + popupId).find('.quantity');
    newQuantity = parseFloat(targetInputQuantityEl.val());
    
    targetInputPricePerUnitEl = $('#' + popupId).find('.price');
    newPricePerUnit = parseFloat(targetInputPricePerUnitEl.val());
    
    if(selectedTable != 0) {
        order = tableOrders[selectedTable];
        order = modifyOrderItem(order, itemNumber, newQuantity, newPricePerUnit);
    
        storeTableOrderInStorage(current_user_id, selectedTable, order);
    }else {
        order = currentOrder;
        order = modifyOrderItem(order, itemNumber, newQuantity, newPricePerUnit);
        
        storeOrderInStorage(current_user_id, order);
    }
    
    //redraw the receipt
    loadReceipt(order);
}

function modifyOrderItem(order, itemNumber, newQuantity, newPricePerUnit) {
    targetOrderItem = order.items[itemNumber-1];
    
    targetOrderItem.amount = newQuantity;
    targetOrderItem.product_price = newPricePerUnit;
    targetOrderItem.total_price = newPricePerUnit * newQuantity;
        
    //add the new modifier price to the total
    if(targetOrderItem.modifier) {
        targetOrderItem.total_price += targetOrderItem.modifier.price * newQuantity;
    }
    
    applyExistingDiscountToOrderItem(order, itemNumber);
    calculateOrderTotal(order);
        
    return order;
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
    
    currentSelectedReceiptItemEl.slideUp('slow', function() {
        loadReceipt(order);
    });
    
    closeEditOrderItem();
}

function doRemoveOrderItem(order, itemNumber) {
    order.items.splice(itemNumber-1, 1);
    
    //update the order items of following items
    for(i=itemNumber-1; i<order.items.length; i++) {
        order.items[i].itemNumber--;
    }
    
    //have to retotal the order
    calculateOrderTotal(order);
        
    return order;
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

function writeTotalToReceipt(order, orderTotal) {
    if(!order) return;
    
    //write the total order discount to the end of the order items
    tillRollDiscountHTML = getTillRollDiscountHTML(order);
    
    $('#till_roll_discount').html(tillRollDiscountHTML);
    
    $('#total_value').html(currency(orderTotal));
}

function doSelectTable(tableNum) {
    if(current_user_id == null) {
        return;
    }
    
    selectedTable = tableNum;
    
    //alert("Selected table:  " + tableNum);
    
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
}

function tableScreenSelectTable(tableId) {
    //back to menu screen
    showMenuScreen();
    //$('#table_select').val(tableId);
    tableSelectMenu.setValue(tableId);
    doSelectTable(tableId);
}

function loadReceipt(order) {
    clearReceipt();
    
    if(order == null){
        return;
    }

    orderTotal = order.total;
    orderItems = order.items;

    allOrderItemsRecptHTML = getAllOrderItemsReceiptHTML(order);
    $('#till_roll').html($('#till_roll').html() + allOrderItemsRecptHTML);

    if(orderTotal != null) {
        writeTotalToReceipt(order, orderTotal);
    }
    
    menuRecptScroll();
}

function initTouchRecpts() {
    $('#till_roll').touchScroll();
    $('#login_till_roll').touchScroll();
    $('#totals_till_roll').touchScroll();
    $('#reports_center_till_roll').touchScroll();
    $('#reports_left_till_roll').touchScroll();
    $('#float_till_roll').touchScroll();
    $('#admin_order_list_till_roll').touchScroll();
    $('#mobile_terminal_till_roll').touchScroll();
    $('#mobile_server_till_roll').touchScroll();
    $('#mobile_table_till_roll').touchScroll();
}

function loginRecptScroll() {
    recptScroll("login_");
}

function menuRecptScroll() {
    recptScroll("");
}

function totalsRecptScroll() {
    recptScroll("totals_");
}

function reportsRecptScroll() {
    recptScroll("reports_center_");
}

function reportsLeftRecptScroll() {
    recptScroll("reports_left_");
}

function floatRecptScroll() {
    recptScroll("float_");
}

function adminOrderListRecptScroll() {
    recptScroll("admin_order_list_");
}

function mobileTerminalRecptScroll() {
    recptScroll("mobile_terminal_");
}

function mobileServerRecptScroll() {
    recptScroll("mobile_server_");
}

function mobileTableRecptScroll() {
    recptScroll("mobile_table_");
}

function recptScroll(targetPrefix) {
    $('#' + targetPrefix + 'till_roll').touchScroll('update');

    currentHeight = $('#' + targetPrefix + 'till_roll').height();
    scrollHeight = $('#' + targetPrefix + 'till_roll').attr('scrollHeight');
    newHeight = scrollHeight - currentHeight;

    //need an offset
    if(newHeight != 0) {
        newHeight -= 20;
    }

    if(!isTouchDevice()) {
        //this code is for pc based browsers
        $('#' + targetPrefix + 'receipt').scrollTop(currentHeight);
    } else {
        $('#' + targetPrefix + 'till_roll').touchScroll('setPosition', newHeight);
    }
}

function clearOrder(selectedTable) {
    //delete the cookie
    //clear the in memory order
    if(selectedTable == 0) {
        clearOrderInStorage(current_user_id);
        currentOrder = null;
    } else {
        clearTableOrderInStorage(current_user_id, selectedTable);
    //dont need to worry about clearing memory as it is read in from cookie which now no longer exists
    }
    
    clearReceipt();
}

function doTotal() {
    if(currentOrderEmpty()) {
        setStatusMessage("No order present to sub-total!", true, true);
        return;
    }
    
    totalOrder = getCurrentOrder();
    
    //get the receipt items and the taxes/discounts
    cashScreenReceiptHTML = fetchCashScreenReceiptHTML()
    $('#totals_till_roll').html(cashScreenReceiptHTML);
    
    //set the data in the cash popout
    $('#totals_data_table').html(fetchCashScreenReceiptTotalsDataTable());
    
    cashTendered = 0;
    cashTenderedKeypadString = "";
    
    //set the discount in the cash out till roll
    cashScreenReceiptDiscountHTML = getTillRollDiscountHTML(totalOrder);
    $('#totals_till_roll_discount').html(cashScreenReceiptDiscountHTML);
    
    $('#cash_screen_sub_total_value').html(currency(totalOrder.total));
    
    if(!paymentMethod) {
        paymentMethod = defaultPaymentMethod;
    }
    
    paymentMethodSelected(paymentMethod);
    
    showNavBackLinkMenuScreen();
    showTotalsScreen();
    totalsRecptScroll();
    
    $('#cashback_amount_holder').html(currency(cashback));
    
    $('#totals_tendered_value').html(currency(0, false));
    takeTendered();
}

function doTotalFinal() {
    if(currentOrderEmpty()) {
        setStatusMessage("No order present to total!", true, true);
        return;
    }
    
    numPersons = 0

    if(selectedTable == 0) {
        totalOrder = currentOrder;
        tableInfoId = null;
        tableInfoLabel = "None";
        isTableOrder = false;
    } else {
        //get total for table
        totalOrder = tableOrders[selectedTable];

        if(selectedTable == -1) {
            //we dump the id of the table when it is stored in db (to deal with tables no longer existing)
            //so we cant carry it over here, so we test for the "none" word to test for a table order
            
            //pick up the previous table
            tableInfoLabel = tables[-1].label;
            isTableOrder = (tableInfoLabel != 'None');
            tableInfoId = totalOrder.tableInfoId;
        } else {
            isTableOrder = true;
            tableInfoId = selectedTable;
            tableInfoLabel = tables[tableInfoId].label;
        }

        //TODO: pick up num persons
        numPersons = 4;
    }

    cashTendered = getTendered();

    totalOrder.cash_tendered = cashTendered;
    totalOrder.change = $('#totals_change_value').html();
    
    if(!paymentMethod) {
        paymentMethod = defaultPaymentMethod;
    }
    
    totalOrder.time = new Date().getTime();
    totalOrder.payment_method = paymentMethod;
    
    //set the service charge again in case it was changed on the totals screen
    totalOrder.service_charge = serviceCharge;
    
    totalOrder.cashback = cashback;
    
    discountPercent = totalOrder.discount_percent;
    preDiscountPrice = totalOrder.pre_discount_price;

    //do up the subtotal and total and retrieve the receipt html for both the login screen and for print
    receiptHTML = fetchFinalReceiptHTML(false, true);
    printReceiptHTML = fetchFinalReceiptHTML(true, false);
    
    setLoginReceipt("Last Sale", receiptHTML);
    
    if(taxChargable) {
        orderSalesTaxRate = globalTaxRate;
        
        taxAmount = (totalOrder.total * globalTaxRate)/100;
        orderTotal = totalOrder.total + taxAmount;
    } else {
        orderSalesTaxRate = -1;
        orderTotal = totalOrder.total;
    }
    
    //make sure 2 decimal places
    orderTotal = parseFloat(orderTotal).toFixed(2);
    
    order_num = totalOrder.order_num
    
    orderData = {
        'order_num': order_num,
        'employee_id':current_user_id,
        'total':orderTotal,
        'tax_chargable':taxChargable,
        'global_sales_tax_rate':orderSalesTaxRate,
        'service_charge':serviceCharge,
        'cashback':cashback,
        'payment_type':paymentMethod,
        'amount_tendered':cashTendered,
        'num_persons':numPersons,
        'is_table_order':isTableOrder,
        'table_info_id':tableInfoId,
        'table_info_label':tableInfoLabel,
        'discount_percent':discountPercent,
        'pre_discount_price':preDiscountPrice,
        'order_details':totalOrder,
        'terminal_id':terminalID,
        'void_order_id': totalOrder.void_order_id
    }

    sendOrderToServer(orderData);

    //clear the order
    clearOrder(selectedTable);

    //clear the receipt
    $('#till_roll').html('');
    $('#till_roll_discount').html('');
    $('#sales_tax_total').html('');
    
    //pick up the default home screen and load it
    loadAfterSaleScreen();

    //reset for next sale
    resetTendered();
    $('#totals_change_value').html("");
    serviceCharge = 0;
    cashback = 0;
    paymentMethod = null;
    
    //set the select item to the personal receipt
    //$('#table_select').val(0);
    tableSelectMenu.setValue(0);
    doSelectTable(0);
    
    totalOrder = null;
    currentTotalFinal = 0;

    //now print the receipt
    if(autoPrintReceipt) {
        printReceipt(printReceiptHTML, true);
    }

    //do we need to clear the previous order from the receipt dropdown selection?
    if(selectedTable == -1) {
        $('#previous_order_select_item').hide();
    }
}

function loadAfterSaleScreen() {
    hideAllScreens();
    
    if(defaultHomeScreen == LOGIN_SCREEN) {
        //back to login screen
        doLogout();
    } else if(defaultHomeScreen == MENU_SCREEN) {
        showMenuScreen();
    } else if(defaultHomeScreen == TABLES_SCREEN) {
        showTablesScreen();
    } else {
        //back to login screen
        doLogout();
    }
}

function sendOrderToServer(orderData) {
    $.ajax({
        type: 'POST',
        url: '/order',
        error: function() {
            storeOrderForLaterSend(orderData)
        },
        data: {
            order : orderData
        }
    });
}

function storeOrderForLaterSend(orderData) {
    ordersForLaterSend = retrieveOrdersForLaterSend();
    
    //lazy init
    if(ordersForLaterSend == null) {
        ordersForLaterSend = new Array();
    }
    
    ordersForLaterSend.push(orderData);

    saveOrdersForLaterSend(ordersForLaterSend);
}

function trySendOutstandingOrdersToServer() {
    ordersForLaterSend = retrieveOrdersForLaterSend();
    
    if(ordersForLaterSend.length>0) {
        sendOutstandingOrdersToServer(ordersForLaterSend);
    }
}

function sendOutstandingOrdersToServer(outstandingOrdersData) {
    $.ajax({
        type: 'POST',
        url: '/outstanding_orders',
        success: clearOutstandingOrders,
        data: {
            orders : outstandingOrdersData
        }
    });
}

function clearOutstandingOrders() {
    ordersForLaterSend = retrieveOrdersForLaterSend();
    ordersForLaterSend = new Array();
    saveOrdersForLaterSend(ordersForLaterSend);
}

function retrieveOrdersForLaterSend() {
    ordersForLaterSendOBJ = retrieveStorageJSONValue("orders_for_later_send");

    if(ordersForLaterSendOBJ && ordersForLaterSendOBJ.ordersForLaterSend) {
        return ordersForLaterSendOBJ.ordersForLaterSend;
    }

    return new Array();
}

function saveOrdersForLaterSend(ordersForLaterSend) {
    ordersForLaterSendOBJ = {
        'ordersForLaterSend':ordersForLaterSend
    };
    
    storeKeyJSONValue("orders_for_later_send", ordersForLaterSendOBJ);
}

function initOptionButtons() {
    $('#menu_buttons_panel').hide();
    $('#menu_buttons_loading_message').show();

    //show admin button?
    if(current_user_is_admin) {
        $('#admin_button').show();
    } else {
        $('#admin_button').hide();
    }

    if(current_user_id != null) {
        //user is logged in so set the sales screen buttons visibility
        $.ajax({
            type: 'GET',
            url: '/init_sales_screen_buttons.js',
            data: {
                current_user_id : current_user_id
            }
        });
    }
}

var currentTargetPopupAnchor = null;
var individualItemDiscount = false;

function showDiscountPopup(receiptItem) {
    currentSelectedReceiptItemEl = receiptItem;
    
    if(currentOrderEmpty()) {
        setStatusMessage("No order present to discount!");
        return;
    }
    
    //make sure both discount popups are closed
    closeDiscountPopup();
    
    //was the discount button hit on the menu panel, or via the edit item popup?
    if(receiptItem) {
        $("#apply_discount_to").hide();
        individualItemDiscount = true;
    } else {
        $("#apply_discount_to").show();
        
        //need to set the height to be a bit bigger
        $("#discounts_popup_markup_container").addClass("higher");
        
        individualItemDiscount = false;
    }
    
    currentTargetPopupAnchor = $('#receipt');
    
    if(currentTargetPopupAnchor.HasBubblePopup()) {
        currentTargetPopupAnchor.RemoveBubblePopup();
    }
    
    currentTargetPopupAnchor.CreateBubblePopup();
    
    discountsPopupHTML = $("#discounts_popup_markup").html();
    
    currentTargetPopupAnchor.ShowBubblePopup({
        position: 'right',  
        align: 'top',
        tail	 : {
            align: 'middle'
        },
        innerHtml: discountsPopupHTML,
														   
        innerHtmlStyle:{ 
            'text-align':'left'
        },
        
        themeName: 	'all-grey',
        themePath: 	'/images/jquerybubblepopup-theme',
        alwaysVisible: false

    }, false);
    
    currentTargetPopupAnchor.FreezeBubblePopup();
    
    popupId = currentTargetPopupAnchor.GetBubblePopupID();
    
    //fill in the input with either existing or default discount percent
    if(receiptItem) {
        itemNumber = receiptItem.data("item_number");
        existingDiscountPercent = getExistingDiscountPercentForCurrentOrderItem(itemNumber);
        
        if(existingDiscountPercent) {
            $('#' + popupId).find('#discount_percent_input').val(existingDiscountPercent);
        } else {
            $('#' + popupId).find('#discount_percent_input').val(defaultDiscountPercent);
        }
    } else {
        //fill in the input with default discount percent
        $('#' + popupId).find('#discount_percent_input').val(defaultDiscountPercent);
    }
    
    //highlight the input box
    $('#' + popupId).find('#discount_percent_input').select();
    
    keypadPosition = $('#' + popupId).find('.discount_popup_keypad_container');
    
    clickFunction = function(val) {
        currentVal = $('#' + popupId).find('#discount_percent_input').val();
        if(currentVal == 0) currentVal = "";
        newVal = currentVal.toString() + val;
        $('#' + popupId).find('#discount_percent_input').val(newVal);
    };
    
    cancelFunction = function() {
        oldVal = $('#' + popupId).find('#discount_percent_input').val();
        newVal = oldVal.substring(0, oldVal.length - 1);
        $('#' + popupId).find('#discount_percent_input').val(newVal);
    };
    
    setUtilKeypad(keypadPosition, clickFunction, cancelFunction);
    
    //register the click handler to hide the popup when outside clicked
    registerPopupClickHandler($('#' + popupId), closeDiscountPopup);
}

function showDiscountPopupFromEditDialog() {
    receiptItem = currentSelectedReceiptItemEl;
    closeEditOrderItem();
    showDiscountPopup(receiptItem);
}

function closeDiscountPopup() {
    if(currentTargetPopupAnchor) {
        hideBubblePopup(currentTargetPopupAnchor);
    }
}

function setDiscountVal(val) {
    popupId = currentTargetPopupAnchor.GetBubblePopupID();
    $('#' + popupId).find('#discount_percent_input').val(val);
}

function saveDiscount() {
    popupId = currentTargetPopupAnchor.GetBubblePopupID();
    selectedValue = $('#' + popupId).find('#discount_percent_input').val();
    
    selectedValue = parseFloat(selectedValue);
    
    if(selectedValue<0 || selectedValue>100) {
        setStatusMessage("You must enter a number between 0 and 100", true, true);
        return;
    }
    
    order = getCurrentOrder();
    
    wholeOrderDiscount = ($("input[name='discount_type']:checked").val() == 'whole_order');
    
    //discount on whole order or individual item?
    if(individualItemDiscount) {
        //fetch the item number
        itemNumber = currentSelectedReceiptItemEl.data("item_number");
        applyDiscountToOrderItem(order, itemNumber, selectedValue);
    } else if(wholeOrderDiscount) {
        addDiscountToOrder(order, selectedValue);
    } else {
        //last item
        applyDiscountToOrderItem(order, -1, selectedValue);
    }
    
    //store the modified order
    if(selectedTable != 0) {
        storeTableOrderInStorage(current_user_id, selectedTable, order);
    }else {
        storeOrderInStorage(current_user_id, order);
    }
    
    closeDiscountPopup();
    
    //redraw the receipt
    loadReceipt(order);
}

function addDiscountToOrder(order, amount) {
    order['discount_percent'] = amount;
    
    calculateOrderTotal(order);
}

function applyExistingDiscountToOrderItem(order, itemNumber) {
    // -1 itemNumber signifies to apply the existing discount
    if(itemNumber != -1) {
        //we must first clear the last pre_discount_price
        order.items[itemNumber-1]['pre_discount_price'] = null;
    }
    
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
    
    oldPrice = orderItem['total_price'];
    
    if(!orderItem['pre_discount_price']) {
        orderItem['pre_discount_price'] = oldPrice;
    }
    
    preDiscountPrice = orderItem['pre_discount_price'];

    //alert("PreDiscountPrice: " + preDiscountPrice + " NewDiscount: " + ((preDiscountPrice * amount)/100));
    
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

function getExistingDiscountPercentForCurrentOrderItem(itemNumber) {
    order = getCurrentOrder();
    
    orderItem = order.items[itemNumber-1];
    
    existingDiscount = orderItem['discount_percent'];
    
    return existingDiscount;
}

function getCurrentOrder() {
    if(selectedTable == 0) {
        return currentOrder;
    } else {
        return tableOrders[selectedTable];
    }
    
    return null;
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

function doReceiveTableOrderSync(recvdTerminalID, tableID, tableLabel, terminalEmployeeID, terminalEmployee, tableOrderDataJSON) {
    //save the current users table order to reload it after sync
    savedTableID = selectedTable;
    
    for (var i = 0; i < employees.length; i++) {
        nextUserIDToSyncWith = employees[i].id;
        
        //skip if terminal and user same
        //        alert("Skip? user id: " + terminalEmployeeID + " - " + nextUserIDToSyncWith + " : terminal id: " + recvdTerminalID + " - " + terminalID);
        //        if(recvdTerminalID == terminalID && terminalEmployeeID == nextUserIDToSyncWith) {
        //            alert("Skipping for user id: " + nextUserIDToSyncWith);
        //            continue;
        //        }
        
        doTableOrderSync(recvdTerminalID, tableID, tableLabel, terminalEmployee, tableOrderDataJSON, nextUserIDToSyncWith);
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
        syncOrderItems.push(tableOrderDataJSON.items[itemKey]);
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
    
    //alert("Got sync order, complete? : " + callHomePollInitSequenceComplete);
    
    //we don't want to show the initial messages as there may be a few of them
    if(callHomePollInitSequenceComplete && recvdTerminalID != terminalID) {
        setStatusMessage("<b>" + terminalEmployee + "</b> modified the order for table <b>" + tableLabel + "</b> from terminal <b>" + recvdTerminalID + "</b>");
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
    
        //we don't want to show the initial messages as there may be a few of them
        if(callHomePollInitSequenceComplete && recvdTerminalID != terminalID) {
            setStatusMessage("<b>" + terminalEmployee + "</b> totaled the order for table <b>" + tableLabel + "</b> from terminal <b>" + recvdTerminalID + "</b>");
        }
    }
}

var oiaIsAdd = true;

function orderItemAdditionClicked(el) {
    currentSelectedReceiptItemEl = getLastReceiptItem();
    
    if(!currentSelectedReceiptItemEl) {
        setStatusMessage("There are no receipt items!");
        return;
    }
    
    //alert(oiaIsAdd);
    var order = getCurrentOrder();
    
    var itemNumber = currentSelectedReceiptItemEl.data("item_number");
    
    var orderItem = order.items[itemNumber-1];
    
    el = $(el);
    
    //get the oia data
    var desc = el.data("description");
    //alert(desc);
    
    var absCharge = 0;
    
    if(oiaIsAdd) {
        absCharge = el.data("add_charge");
    } else {
        absCharge = el.data("minus_charge");
    }
    
    oia_item = {
        'description' : desc,
        'abs_charge' : absCharge,
        'is_add' : oiaIsAdd
    }
    
    if(typeof(orderItem.oia_items) == 'undefined') {
        orderItem.oia_items = new Array();
    }
    
    //update the total
    if(oiaIsAdd) {
        orderItem.total_price = orderItem.total_price + (orderItem.amount * absCharge);
    } else {
        orderItem.total_price = orderItem.total_price - (orderItem.amount * absCharge);
    }
    
    orderItem.oia_items.push(oia_item);
   
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

function orderItemAdditionAddSelected() {
    clearSelectedOIATabs();
    $('#oia_tab_add').addClass("selected");
    oiaIsAdd = true;
    
    $('#order_item_additions .grid_item:not(.empty)').each(function() {
        addCharge = $(this).data("add_charge");
        if(addCharge != 0) {
            $(this).find(".charge").html(currency(addCharge));
        }else {
            $(this).find(".charge").html("");
        }
    });
}

function orderItemAdditionNoSelected() {
    clearSelectedOIATabs();
    $('#oia_tab_no').addClass("selected");
    oiaIsAdd = false;
    
    $('#order_item_additions .grid_item:not(.empty)').each(function() {
        noCharge = $(this).data("minus_charge");
        if(noCharge != 0) {
            $(this).find(".charge").html(currency(noCharge));
        } else {
            $(this).find(".charge").html("");
        }
    });
}

function clearSelectedOIATabs() {
    $('#oia_tabs .tab').removeClass("selected");
}

function doOpenOIANoteScreen() {
    clearSelectedOIATabs();
    $('#oia_tab_note').addClass("selected");
}