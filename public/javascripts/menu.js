var currentMenuPage;
var currentOrder;
var totalOrder = null;
var currentOrderItem;
var currentTotal;
var currentOrderJSON;
var currentMenuItemQuantity = "";
var selectedTable = 0;
var tableOrders = new Array();

//this function is called from application.js on page load
function initMenu() {
    $('#menu_items_container').html($('#menu_items_1').html());
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
        "calendar":"false"
    });
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
    writeTotalToReceipt(0);
}

function doMenuPageSelect(pageNum, pageId) {
    //set this pages class to make it look selected
    $('#pages .page').removeClass('selected');
    $('#menu_page_' + pageId).addClass('selected');

    newHTML = $('#menu_items_' + pageNum).html();
    $('#menu_items_container').html(newHTML);
    currentMenuPage = pageNum;
}

function doSelectMenuItem(productId) {
    if(currentMenuItemQuantity == "")
        currentMenuItemQuantity = "1";

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

    currentOrderItem = orderItem

    //does this product have a modifier
    modifierCategoryId = product['modifier_category_id'];

    if(modifierCategoryId) {
        showModifierDialog(modifierCategoryId);
        return;
    }

    finishDoSelectMenuItem();
}

function showModifierDialog(modifierCategoryId) {
    $("#modifier_category_popup_link_" + modifierCategoryId).click();
}

function modifierSelected(modifierCategoryId, modifierId, modifierName, modifierPrice) {
    currentOrderItem['modifier'] = {
        'id':modifierId,
        'name':modifierName,
        'price':modifierPrice
    }
    currentOrderItem['total_price'] = currentOrderItem['total_price'] + (currentOrderItem['amount'] * modifierPrice);

    //close the dialog
    $('#modifier_category_popup_close_button_' + modifierCategoryId).click();
    
    finishDoSelectMenuItem();
}

function finishDoSelectMenuItem() {
    orderItem = currentOrderItem;

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

    //add this item to the order array
    currentOrder.items.push(orderItem);
    
    currentOrderTotal = 0;

    for(i=0; i<currentOrder.items.length; i++) {
        item = currentOrder.items[i];
        currentOrderTotal += item['total_price']
    }

    currentOrder['total'] = ((currentOrderTotal == null) ? 0 : currentOrderTotal);

    //store this item in the current order cookie
    $.JSONCookie("user_" + current_user_id + "_current_order", currentOrder, {
        path: '/'
    });

    //add a line to the receipt
    writeOrderItemToReceipt(orderItem);
    writeTotalToReceipt(currentOrder['total']);

    recptScroll();
}

function tableSelectMenuItem(orderItem) {
    orderItem['serving_employee_id'] = current_user_id;

    //add this item to the order array
    currentTableOrder = tableOrders[selectedTable];

    currentTableOrder.items.push(orderItem);

    currentTableOrderTotal = 0;

    for(i=0; i<currentTableOrder.items.length; i++) {
        item = currentTableOrder.items[i];
        currentTableOrderTotal += item['total_price']
    }

    currentTableOrder['total'] = currentTableOrderTotal;

    //store this item in the current order cookie
    $.JSONCookie("table_" + selectedTable + "_current_order", currentTableOrder, {
        path: '/'
    });

    //add a line to the receipt
    writeOrderItemToReceipt(orderItem);
    writeTotalToReceipt(currentTableOrder['total']);
    
    recptScroll();
}

function writeOrderItemToReceipt(orderItem) {
    orderHTML = "<div class='order_line'>";
    orderHTML += "<div class='amount'>" + orderItem.amount + "</div>";
    orderHTML += "<div class='name'>" + orderItem.product.name + "</div>";
    orderItemTotalPriceText = number_to_currency((orderItem.product_price * orderItem.amount), {
        precision : 2
    });
    orderHTML += "<div class='total'>" + orderItemTotalPriceText + "</div>";
    
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
        
        orderHTML += "<div class='clear'>&nbsp;</div>";
    }

    orderHTML += "</div><div class='clear'>&nbsp;</div>";
    
    $('#till_roll').html($('#till_roll').html() + orderHTML);
}

function writeTotalToReceipt(orderTotal) {
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

    //write to cookie that this user was last looking at this receipt
    $.JSONCookie("user_" + current_user_id + "_last_receipt", {
        'table_num':tableNum
    }, {
        path: '/'
    });

    if(tableNum == 0) {
        loadCurrentOrder();
        loadReceipt(currentOrder);
        return;
    }

    //lazy init currentOrder
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
    }

    //display the receipt for this table
    loadReceipt(tableOrders[tableNum]);
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
        writeTotalToReceipt(orderTotal);
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

function clearOrder() {
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
    if(currentTotal == 0) {
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
        alert("Must enter a higher value than total (€" + currentTotal + ")");
        resetTendered();
        return;
    }

    //calculate change and show the finish sale button
    change = cashTendered - currentTotal;
    $('#totals_change_value').html(number_to_currency(change, {
        precision : 2, 
        showunit : true
    }));

    $('#tendered_button').hide();
    $('#finish_sale_button').show();
}

function doTotalFinal() {
    if(currentTotal == 0) {
        alert("No order present to total!");
        return;
    }
    
    numPersons = 0

    if(selectedTable == 0) {
        totalOrder = currentOrder;
        isTableOrder = false;
    } else {
        //get total for table
        totalOrder = tableOrders[selectedTable];

        //TODO: pick up num persons
        isTableOrder = true;
        numPersons = 4
    }

    cashTendered = getTendered();

    //attach the employee id
    orderData = {
        'employee_id':current_user_id,
        'total':totalOrder.total,
        'payment_type':'cash',
        'amount_tendered':cashTendered,
        'num_persons':numPersons,
        'is_table_order':isTableOrder,
        'order_details':totalOrder
    }

    copyReceiptToLoginScreen();

    sendOrderToServer(orderData);

    //clear the order
    clearOrder(selectedTable);

    //print receipt


    //back to login screen
    doLogout();

    //reset for next sale
    $('#total_screen').hide();
    $('#tendered_button').show();
    $('#finish_sale_button').hide();
    resetTendered();
    $('#totals_change_value').html("");
    totalOrder = null;
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
    //peel off euro sign
    return $('#totals_tendered_value').html().substring(1);
}

function resetTendered() {
    $('#totals_tendered_value').html("€");
}

function doCancelTillKeypad() {
    currentMenuItemQuantity = "";
}

function doCancelTotalsKeypad() {
    $('#totals_tendered_value').html("€");
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