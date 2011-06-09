var currentMenuPage;
var currentOrder = null;
var currentTableOrder = null;
var totalOrder = null;
var currentOrderItem;
var currentTotal;
var currentOrderJSON;
var currentMenuItemQuantity = "";
var selectedTable = 0;
var tableOrders = new Array();

//this function is called from application.js on page load
function initMenu() {
    loadFirstMenuPage();
    
    currentMenuPage = 1;
    currentOrder = new Array();
    currentMenuItemQuantity = "";
    
    //init menu screen keypad
    for(i=0; i<10; i++) {
        $('#keypad_num_' + i).click(function() {
            if(showingDisplayButtonPasscodePromptPopup) {
                $('#display_button_passcode').val($('#display_button_passcode').val() + this.innerHTML);
                $('#display_button_passcode_show').html($('#display_button_passcode_show').html() + this.innerHTML);
            } else {
                if(this.innerHTML == '0') {
                    if(currentMenuItemQuantity.length > 0)
                        currentMenuItemQuantity += this.innerHTML
                } else {
                    currentMenuItemQuantity += this.innerHTML;
                }
            }
        });
    }
    
    //init sales screen decimal key
    $('#decimal_key').click(function() {
        currentMenuItemQuantity = "";
    });

    //init totals screen keypad
    for(i=0; i<10; i++) {
        $('#totals_keypad_num_' + i).click(function() {
            $('#totals_tendered_value').html($('#totals_tendered_value').html() + this.innerHTML);
        });
    }

    //init sales screen decimal key
    $('#totals_decimal_key').click(function() {
        $('#totals_tendered_value').html($('#totals_tendered_value').html() + ".");
    });

    $('#till_roll').touchScroll();

    loadCurrentOrder();
    displayLastReceipt();
    initOptionButtons();

    //start the clock in the nav bar
    $("div#clock").clock({
        "calendar":"false",
        "format": clockFormat
    });
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
    currentOrder = $.getJSONCookie("user_" + current_user_id + "_current_order");
}

//this loads up the last receipt that a user was looking at before logging out
function displayLastReceipt() {
    //retrieve the users last receipt from cookie
    lastReceiptIDOBJ = $.getJSONCookie("user_" + current_user_id + "_last_receipt");

    if(lastReceiptIDOBJ == null) {
        lastReceiptID = 0;
    } else {
        lastReceiptID = lastReceiptIDOBJ.table_num
    }

    //last receipt is a number of a table or 0 for the current order
    if(lastReceiptID == 0) {
        order = currentOrder;
    } else {
        order = tableOrders[lastReceiptID]
    }

    //set the select item
    $('#table_select').val(lastReceiptID);
    doSelectTable(lastReceiptID);
}

function clearReceipt() {
    $('#till_roll').html('');
    writeTotalToReceipt(null, 0);
}

function doMenuPageSelect(pageNum, pageId) {
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

    //close the dialog of the popup for previous modifier if it not closed
    if(currentSelectedMenuItemElement) {
        $(currentSelectedMenuItemElement).HideBubblePopup();
        $(currentSelectedMenuItemElement).FreezeBubblePopup();
    }
    
    currentSelectedMenuItemElement = element;

    //fetch this product from the products js array
    product = products[productId]
    amount = currentMenuItemQuantity;
    
    //reset the quantity
    currentMenuItemQuantity = "";

    orderItem = {
        'amount':amount,
        'product':product,
        'product_price':product.price,
        'total_price':(product.price*amount)
    }

    //store the terminal id 
    orderItem['terminal_id'] = terminalID;

    //and the time that it was added
    orderItem['time_added'] = Date.now();

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
        boxEl.CreateBubblePopup({
            themeName: 	'black',
            themePath: 	'/images/jquerybubblepopup-theme'
        });
    }
         
    popupHTML = $("#modifier_category_popup_" + modifierCategoryId).html();
         
    boxEl.ShowBubblePopup({
        align: 'center',
        innerHtml: popupHTML,
														   
        innerHtmlStyle:{ 
            'text-align':'left'
        },
												   
        themeName: 	'black',
        themePath: 	'/images/jquerybubblepopup-theme'

    }, false);
    
    boxEl.FreezeBubblePopup();
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

    //if this is a tables order deal with it in another function
    if(selectedTable != 0) {
        tableSelectMenuItem(orderItem);
        return;
    }

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

    storeOrderInCookie(current_user_id, currentOrder);

    //add a line to the receipt
    writeOrderItemToReceipt(orderItem);
    writeTotalToReceipt(currentOrder, currentOrder['total']);

    recptScroll();
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

    storeTableOrderInCookie(selectedTable, currentTableOrder);

    //add a line to the receipt
    writeOrderItemToReceipt(orderItem);
    writeTotalToReceipt(currentTableOrder, currentTableOrder['total']);
    
    recptScroll();
}

var clearHTML = "<div class='clear'>&nbsp;</div>";
    
//TODO: replace with jquery template => http://api.jquery.com/jQuery.template/
function writeOrderItemToReceipt(orderItem) {
    orderHTML = "<div class='order_line' data-item_number='" + orderItem.itemNumber + "' onclick='doSelectReceiptItem(this)'>";
    orderHTML += "<div class='amount'>" + orderItem.amount + "</div>";
    orderHTML += "<div class='name'>" + orderItem.product.name + "</div>";
    orderItemTotalPriceText = number_to_currency((orderItem.product_price * orderItem.amount), {
        precision : 2
    });
    orderHTML += "<div class='total' data-per_unit_price='" + orderItem.product_price + "'>" + orderItemTotalPriceText + "</div>";
    
    if(orderItem.modifier) {
        orderHTML += "<div class='clear'>&nbsp;</div>";
        orderHTML += "<div class='modifier_name'>- " + orderItem.modifier.name + "</div>";
        
        //only show modifier price if not zero
        if(orderItem.modifier.price > 0) {
            modifierPriceText = number_to_currency((orderItem.modifier.price * orderItem.amount), {
                precision : 2
            });
            orderHTML += "<div class='modifier_price'>" + modifierPriceText + "</div>";
        }
        
        orderHTML += clearHTML;
    }

    if(orderItem.discount_percent && orderItem.discount_percent > 0) {
        newPrice = number_to_currency(orderItem.total_price, {
            precision : 2
        });
            
        orderHTML += clearHTML;
        orderHTML += "<div class='discount'><div class='header'>Discount</div>";
        orderHTML += "<div class='discount_amount'>@ " + orderItem.discount_percent + "%</div>";
        orderHTML += "<div class='new_price'>" + newPrice + "</div></div>";
    }
    
    orderHTML += clearHTML + "</div>" + clearHTML;
    
    $('#till_roll').html($('#till_roll').html() + orderHTML);
}

var currentSelectedReceiptItemEl;

function doSelectReceiptItem(orderItemEl) {
    orderItemEl = $(orderItemEl);
    
    //close any open popup
    closeEditOrderItem();
    
    //save the currently opened dialog
    currentSelectedReceiptItemEl = orderItemEl;
    
    //keep the border
    orderItemEl.addClass("selected");
    
    if(!orderItemEl.HasBubblePopup()) {
        orderItemEl.CreateBubblePopup({
            themeName: 	'black',
            themePath: 	'/images/jquerybubblepopup-theme'
        });
    }
    
    popupHTML = $("#edit_receipt_item_popup_markup").html();
    
    orderItemEl.ShowBubblePopup({
        align: 'center',
        innerHtml: popupHTML,
														   
        innerHtmlStyle:{ 
            'text-align':'left'
        },
												   
        themeName: 	'black',
        themePath: 	'/images/jquerybubblepopup-theme'

    }, false);
    
    orderItemEl.FreezeBubblePopup();
         
    //set the current price and quantity
    popupId = orderItemEl.GetBubblePopupID();
    currentPrice = orderItemEl.children('.total').data("per_unit_price");
    currentPrice = number_to_currency(currentPrice, {
        precision : 2
    })
    $('#' + popupId).find('.price').val(currentPrice);
    
    currentQuantity = orderItemEl.children('.amount').html();
    $('#' + popupId).find('.quantity').val(currentQuantity);
}

function editOrderItemIncreaseQuantity(el) {
    targetInputEl = $(el).parent().parent().find('.quantity');
    currentVal = parseInt(targetInputEl.val());
    targetInputEl.val(currentVal + 1);
}

function editOrderItemDecreaseQuantity(el) {
    targetInputEl = $(el).parent().parent().find('.quantity');
    currentVal = parseInt(targetInputEl.val());
    
    if(currentVal != 1) {
        targetInputEl.val(currentVal - 1);
    }
}

function closeEditOrderItem() {
    if(currentSelectedReceiptItemEl) {
        currentSelectedReceiptItemEl.HideBubblePopup();
        currentSelectedReceiptItemEl.FreezeBubblePopup();
        currentSelectedReceiptItemEl.removeClass("selected");
    
        currentSelectedReceiptItemEl = null;
    }
}

function saveEditOrderItem(el) {
    //fetch the item number
    itemNumber = currentSelectedReceiptItemEl.data("item_number");
    
    closeEditOrderItem();
    
    //fetch the order from the order array and modify it
    //then modify the html in the receipt
    targetInputQuantityEl = $(el).parent().find('.quantity');
    newQuantity = parseInt(targetInputQuantityEl.val());
    
    targetInputPricePerUnitEl = $(el).parent().find('.price');
    newPricePerUnit = parseFloat(targetInputPricePerUnitEl.val());
    
    if(selectedTable != 0) {
        order = tableOrders[selectedTable];
        order = modifyOrderItem(order, itemNumber, newQuantity, newPricePerUnit);
    
        storeTableOrderInCookie(selectedTable, order);
    }else {
        order = currentOrder;
        order = modifyOrderItem(order, itemNumber, newQuantity, newPricePerUnit);
        
        storeOrderInCookie(current_user_id, order);
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

function removeOrderItem(el) {
    //fetch the item number
    itemNumber = currentSelectedReceiptItemEl.data("item_number");
    
    if(selectedTable != 0) {
        order = tableOrders[selectedTable];
        order = doRemoveOrderItem(order, itemNumber);
    
        storeTableOrderInCookie(selectedTable, order);
    }else {
        order = currentOrder;
        order = doRemoveOrderItem(order, itemNumber);
        
        storeOrderInCookie(current_user_id, order);
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
        orderTotal += parseInt(item['total_price']);
    }

    order['total'] = orderTotal;

    //apply the discount if there is one
    discountAmount = order['discount_percent'];

    if(discountAmount) {
        //store the pre discount price 
        order['pre_discount_price'] = orderTotal;
        
        oldPrice = order['total'];
        order['pre_discount_price'] = oldPrice;
    
        newPrice = oldPrice - ((oldPrice * discountAmount) / 100);
        order['total'] = newPrice;
    }
    
    //calculate order taxes
    calculateOrderTaxes(order);
}

function calculateOrderTaxes(order) {
    orderTaxes = new Array();
    
    for(i=0; i<order.items.length; i++) {
        item = order.items[i];
        
        taxRate = item.product.tax_rate.toString();
        
        if(!orderTaxes[taxRate]) {
            orderTaxes[taxRate] = 0;
        }
        
        orderTaxes[taxRate] = parseFloat(orderTaxes[taxRate]) + parseFloat(item.total_price);
    }
    
    order['order_taxes'] = orderTaxes;
}

function writeTotalToReceipt(order, orderTotal) {
    if(order) {
        //write the tax total
        totalTaxAmount = 0;
    
        for(var key in order.order_taxes) {
            
            taxRate = parseFloat(key);
            taxableAmount = parseFloat(order.order_taxes[key]);
        
            taxAmount = (taxRate * taxableAmount)/100;
     
            totalTaxAmount +=  parseFloat(taxAmount);
        }

        //apply the whole order discount
        if(order['discount_percent']) {
            totalTaxAmount -= (parseFloat(order['discount_percent']) * totalTaxAmount)/100;
        }
            
        if(taxChargable) {
            totalTaxHTML = clearHTML + "<div class='tax'><div class='header'>Total Tax:</div>";
            totalTaxHTML += "<div class='amount'>";
            totalTaxHTML += number_to_currency(totalTaxAmount, {
                precision : 2, 
                showunit : true
            });
            totalTaxHTML += "</div></div>" + clearHTML;
    
            $('#sales_tax_total').html(totalTaxHTML);
        }
    }
    
    //write the total order discount to the end of the order items
    if(order && order['discount_percent']) {
        
        preDiscountFormatted = number_to_currency(order.pre_discount_price, {
            precision : 2, 
            showunit : true
        })
        
        tillRollDiscountHTML = clearHTML;
        tillRollDiscountHTML += "<div class='discount'><div class='header'>Pre Discount Sub-Total:</div>";
        tillRollDiscountHTML += "<div class='pre_discount_total'>" + preDiscountFormatted + "</div>";
        tillRollDiscountHTML += clearHTML + "<div class='header'>Total Order Discount</div>";
        tillRollDiscountHTML += "<div class='discount_amount'>@ " + order.discount_percent + "%</div></div>";
    } else {
        tillRollDiscountHTML = "";
    }
    
    $('#till_roll_discount').html(tillRollDiscountHTML);
    
    $('#total_value').html(number_to_currency(orderTotal, {
        precision : 2, 
        showunit : true
    }));
    currentTotal = orderTotal;
}

function doSelectTable(tableNum) {
    if(current_user_id == null) {
        return
    }
    
    selectedTable = tableNum;
    currentSelectedRoom = $('#table_select :selected').data("room_id");
    
    //write to cookie that this user was last looking at this receipt
    $.JSONCookie("user_" + current_user_id + "_last_receipt", {
        'table_num':tableNum
    }, {
        path: '/'
    });

    if(tableNum == 0) {
        loadCurrentOrder();
        
        //total the order first
        calculateOrderTotal(currentOrder);
        
        loadReceipt(currentOrder);
        return;
    }

    //init an in memory version of this order
    tableOrders[tableNum] = {
        'items': new Array(),
        'total':0
    };
    
    //fetch this tables order from cookie
    currentTableOrderJSON = $.getJSONCookie("table_" + selectedTable + "_current_order");

    //fill in the table order array
    if(currentTableOrderJSON != null) {
        for(i=0; i<currentTableOrderJSON.items.length; i++) {
            tableOrderItem = currentTableOrderJSON.items[i];
            tableOrders[tableNum].items.push(tableOrderItem);
        }

        tableOrders[tableNum].total = currentTableOrderJSON.total;
        
        if(currentTableOrderJSON.discount_percent) {
            tableOrders[tableNum].discount_percent = currentTableOrderJSON.discount_percent;
            tableOrders[tableNum].pre_discount_price = currentTableOrderJSON.pre_discount_price;
        }
        
        tableOrders[tableNum].order_taxes = currentTableOrderJSON.order_taxes;
    }
        
    //total the order first
    calculateOrderTotal(tableOrders[tableNum]);
        
    //display the receipt for this table
    loadReceipt(tableOrders[tableNum]);
}

function tableScreenSelectTable(tableId) {
    $('#table_select').val(tableId);
    doSelectTable(tableId);
    
    //back to menu screen
    $('#table_select_screen').hide();
    $('#menu_screen').show();
}

function loadReceipt(order) {
    clearReceipt();

    if(order == null){
        return;
    }

    orderTotal = order.total;
    orderItems = order.items;

    for(i=0; i<orderItems.length; i++) {
        item = orderItems[i];
        writeOrderItemToReceipt(item);
    }

    if(orderTotal != null) {
        writeTotalToReceipt(order, orderTotal);
    }

    recptScroll();
}

function recptScroll() {
    $('#till_roll').touchScroll('update');

    currentHeight = $('#till_roll').height();
    scrollHeight = $('#till_roll').attr('scrollHeight');
    newHeight = scrollHeight - currentHeight;

    //need an offset
    if(newHeight != 0) {
        newHeight -= 20;
    }

    if(!isTouchDevice()) {
        //this code is for pc based browsers
        $('#receipt').scrollTop(currentHeight);
    } else {
        $('#till_roll').touchScroll('setPosition', newHeight);
    }
}

function clearOrder(selectedTable) {
    //delete the cookie
    //clear the in memory order
    if(selectedTable == 0) {
        $.removeJSONCookie("user_" + current_user_id + "_current_order");
        currentOrder = null;
    } else {
        $.removeJSONCookie("table_" + selectedTable + "_current_order");
    //dont need to worry about clearing memory as it is read in from cookie which now no longer exists
    }
    
    clearReceipt();
}

function doTotal() {
    targetCurrentOrder = getCurrentOrder();
    
    if(!targetCurrentOrder || targetCurrentOrder.items.length == 0) {
        alert("No order present to sub-total!");
        return;
    }
    
    $('#menu_screen').hide();
    $('#total_screen').show();

    $('#totals_total_value').html(number_to_currency(currentTotal, {
        precision : 2, 
        showunit : true
    }));
}

function takeTendered() {
    cashTendered = getTendered();

    if(cashTendered < currentTotal) {
        alert("Must enter a higher value than total (" + dynamicCurrencySymbol + currentTotal + ")");
        resetTendered();
        return;
    }

    //calculate change and show the finish sale button
    change = cashTendered - currentTotal;
    $('#totals_change_value').html(number_to_currency(change, {
        precision : 2
    }));

    $('#tendered_button').hide();
    $('#finish_sale_button').show();
}

function doTotalFinal() {
    if(getCurrentOrder().items.length == 0) {
        alert("No order present to total!");
        return;
    }
    
    numPersons = 0

    if(selectedTable == 0) {
        totalOrder = currentOrder;
        tableInfoId = null;
        isTableOrder = false;
    } else {
        //get total for table
        totalOrder = tableOrders[selectedTable];

        //TODO: pick up num persons
        isTableOrder = true;
        tableInfoId = selectedTable;
        numPersons = 4
    }

    cashTendered = getTendered();

    paymentMethod = $("input[name='payment_method']:checked").val();

    discountPercent = totalOrder.discount_percent;
    preDiscountPrice = totalOrder.pre_discount_price;

    orderData = {
        'employee_id':current_user_id,
        'total':totalOrder.total,
        'payment_type':paymentMethod,
        'amount_tendered':cashTendered,
        'num_persons':numPersons,
        'is_table_order':isTableOrder,
        'table_info_id':tableInfoId,
        'discount_percent':discountPercent,
        'pre_discount_price':preDiscountPrice,
        'order_details':totalOrder,
        'terminal_id':terminalID
    }

    copyReceiptToLoginScreen();

    sendOrderToServer(orderData);

    //clear the order
    clearOrder(selectedTable);

    //clear the receipt
    $('#till_roll').html('');
    $('#till_roll_discount').html('');
    $('#sales_tax_total').html('');
    
    //print receipt


    //pick up the default home screen and load it
    loadAfterSaleScreen();

    //reset for next sale
    $('#total_screen').hide();
    $('#tendered_button').show();
    $('#finish_sale_button').hide();
    resetTendered();
    $('#totals_change_value').html("");
    totalOrder = null;
}

function loadAfterSaleScreen() {
    //hide all screens first
    $('#total_screen').hide();
    $('#landing').hide();
    $('#menu_screen').hide();
    $('#table_select_screen').hide();
    
    if(defaultHomeScreen == LOGIN_SCREEN) {
        //back to login screen
        doLogout();
    } else if(defaultHomeScreen == MENU_SCREEN) {
        $('#menu_screen').show();
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
    ordersForLaterSendOBJ = $.getJSONCookie("orders_for_later_send");

    if(ordersForLaterSendOBJ && ordersForLaterSendOBJ.ordersForLaterSend) {
        return ordersForLaterSendOBJ.ordersForLaterSend;
    }

    return new Array();
}

function saveOrdersForLaterSend(ordersForLaterSend) {
    ordersForLaterSendOBJ = {
        'ordersForLaterSend':ordersForLaterSend
    };
    
    //store this item in the current order cookie
    $.JSONCookie("orders_for_later_send", ordersForLaterSendOBJ, {
        path: '/'
    });
}

function getTendered() {
    return $('#totals_tendered_value').html();
}

function resetTendered() {
    $('#totals_tendered_value').html("");
}

function doCancelTillKeypad() {
    currentMenuItemQuantity = "";
}

function doCancelTotalsKeypad() {
    $('#totals_tendered_value').html("");
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

function storeOrderInCookie(current_user_id, order_to_store) {
    $.JSONCookie("user_" + current_user_id + "_current_order", order_to_store, {
        path: '/'
    });
}

function storeTableOrderInCookie(table_num, order_to_store) {
    $.JSONCookie("table_" + table_num + "_current_order", order_to_store, {
        path: '/'
    });
}

var currentTargetPopupAnchor = null;
var individualItemDiscount = false;

function showDiscountPopup(el) {
    if(getCurrentOrder().items.length == 0) {
        alert("No order present to discount!");
        return;
    }
    
    //make sure both discount popups are closed
    closeDiscountPopup();
    
    //was the discount button hit on the menu panel, or via the edit item popup?
    if(el) {
        currentTargetPopupAnchor = currentSelectedReceiptItemEl;
        $("#apply_discount_to").hide();
        individualItemDiscount = true;
    } else {
        currentTargetPopupAnchor = $('#receipt_item_discount_popup_anchor');
        $("#apply_discount_to").show();
        individualItemDiscount = false;
    }
    
    if(!currentTargetPopupAnchor.HasBubblePopup()) {
        currentTargetPopupAnchor.CreateBubblePopup({
            themeName: 	'black',
            themePath: 	'/images/jquerybubblepopup-theme'
        });
    }
    
    discountsPopupHTML = $("#discounts_popup_markup").html();
    
    currentTargetPopupAnchor.ShowBubblePopup({
        align: 'center',
        innerHtml: discountsPopupHTML,
														   
        innerHtmlStyle:{ 
            'text-align':'left'
        },
												   
        themeName: 	'black',
        themePath: 	'/images/jquerybubblepopup-theme'

    }, false);
    
    currentTargetPopupAnchor.FreezeBubblePopup();
    
    popupId = currentTargetPopupAnchor.GetBubblePopupID();
    
    //fill in the input with either existing or default discount percent
    if(el) {
        itemNumber = currentSelectedReceiptItemEl.data("item_number");
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
}

function closeDiscountPopup() {
    if(currentTargetPopupAnchor) {
        currentTargetPopupAnchor.HideBubblePopup();
        currentTargetPopupAnchor.FreezeBubblePopup();
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
        alert("You must enter a number between 0 and 100");
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
        storeTableOrderInCookie(selectedTable, order);
    }else {
        storeOrderInCookie(current_user_id, order);
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
    
    return nil;
}

function doReceiveTableOrderSync(terminalID, tableID, tableLabel, terminalEmployee, tableOrderDataJSON) {
    //the order is in json form, we need to turn it back into an array
    syncOrderItems = new Array();
    
    for(var itemKey in tableOrderDataJSON.items) {
        //        alert(tableOrderDataJSON.items[itemKey].product.name);
        syncOrderItems.push(tableOrderDataJSON.items[itemKey]);
    }
   
    //    alert("Order for sync has " + syncOrderItems.length + " items. About to sync with existing " + tableOrders[tableID].items.length + " items");
    
    //init the order if this table has no order already
    if(typeof(tableOrders[tableID]) == "undefined") {
        tableOrders[tableID] = {
            'items': new Array(),
            'total':0
        };
    }
    
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
    
    //re number the items
    for(i=0;i<tableOrders[tableID].items.length;i++) {
        tableOrders[tableID].items[i].itemNumber = i + 1;
    }
    
    calculateOrderTotal(tableOrders[tableID]);
    storeTableOrderInCookie(tableID, tableOrders[tableID]);
    
    if(tableID == selectedTable) {
        loadReceipt(tableOrders[tableID]);
        setStatusMessage("<b>" + terminalEmployee + "</b> added items to the order for table <b>" + tableLabel + "</b> from terminal <b>" + terminalID + "</b>");
    }
}

function doClearTableOrder(terminalID, tableID, tableLabel, terminalEmployee) {
    tableOrders[tableID] = {
        'items': new Array(),
        'total':0
    };
    storeTableOrderInCookie(tableID, tableOrders[tableID]);
        
    if(tableID == selectedTable) {
        loadReceipt(tableOrders[tableID]);
        setStatusMessage("<b>" + terminalEmployee + "</b> totaled the order for table <b>" + tableLabel + "</b> from terminal <b>" + terminalID + "</b>");
    }
}