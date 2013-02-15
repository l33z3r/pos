//this is used to fetch the login screen receipt, not the printed one
function fetchOrderReceiptHTML(order) {
    totalOrder = currentOrder = order;
    
    orderReceiptHTML = fetchFinalReceiptHeaderHTML();
    
    allOrderItemsRecptHTML = getAllOrderItemsReceiptHTML(currentOrder, false, false, true, false);
    
    orderReceiptHTML += clearHTML + allOrderItemsRecptHTML;
    
    var subTotal = currentOrder.total;
    
    if(currentOrder.discount_percent) {
        //calculate the amount of discount
        preDiscountAmount = currentOrder.pre_discount_price;
        
        orderReceiptHTML += clearHTML + "<div class='whole_order_discount'>";
        orderReceiptHTML += "Discounted " + currentOrder.discount_percent + "% from " + currency(preDiscountAmount) + "</div>";
    } 
    
    orderReceiptHTML += "<div class='data_table'>";
    
    subTotal = currentOrder.total;
    orderReceiptHTML += "<div class='label'>Sub-Total:</div><div class='data'>" + currency(subTotal) + "</div>" + clearHTML;
    
    orderReceiptHTML += "</div>" + clearHTML;
    
    return orderReceiptHTML;
}

//this fetches the html for the order receipt that gets printed
function printItemsFromOrder(printerID, serverNickname, order, items) {
    var allOrderItemsReceiptHTML = "<div class='order_receipt'>";
    allOrderItemsReceiptHTML += getPrintedOrderReceiptHeader(serverNickname, order);

    for(var i=0; i<items.length; i++) {
        var item = items[i];
        allOrderItemsReceiptHTML += getLineItemHTMLForPrintedOrderReceipt(item);
    }
    
    allOrderItemsReceiptHTML += "</div>";
    
    printReceipt(allOrderItemsReceiptHTML, false, printerID);
}

function getLineItemHTMLForPrintedOrderReceipt(orderItem) {
    var courseLineClass = orderItem.is_course ? "course" : "";
    
    var lineItemHTMLForOrder = "<div class='order_line " + courseLineClass + "'>";
    
    if(!orderItem.product.hide_on_printed_receipt) {
        lineItemHTMLForOrder += "<div class='amount'>" + orderItem.amount + "</div>";
    }
    
    lineItemHTMLForOrder += "<div class='name'>";
        
    if(orderItem.is_double) {
        lineItemHTMLForOrder += "Double ";
    } else if(orderItem.is_half) {
        lineItemHTMLForOrder += halfMeasureLabel + " ";
    }
        
    lineItemHTMLForOrder += orderItem.product.name + "</div>";
    
    //we don't show the total for the order receipt
    lineItemHTMLForOrder += "<div class='total'>&nbsp;</div>";
    
    if(orderItem.show_course_label) {
        lineItemHTMLForOrder += "<div class='clear'>&nbsp;</div>";
        lineItemHTMLForOrder += "<div class='course_label'>Serve As: " + courseLabels[parseInt(orderItem.product.course_num)] + "</div>";
    }
    
    if(orderItem.modifier) {
        lineItemHTMLForOrder += "<div class='clear'>&nbsp;</div>";
        lineItemHTMLForOrder += "<div class='modifier_name'>" + orderItem.modifier.name + "</div>" + clearHTML;
    }
    
    if(orderItem.oia_items) {
        for(var j=0; j<orderItem.oia_items.length; j++) {
            oia_is_add = orderItem.oia_items[j].is_add;
            
            lineItemHTMLForOrder += "<div class='oia_name " + (orderItem.oia_items[j].is_note ? "note" : "") + "'>";
            
            if(!orderItem.oia_items[j].is_note) {
                if(orderItem.oia_items[j].is_addable) {
                    lineItemHTMLForOrder += oia_is_add ? "Add " : "No ";
                }
            }
            
            lineItemHTMLForOrder += orderItem.oia_items[j].description + "</div>" + clearHTML;
        }
    }
    
    lineItemHTMLForOrder += "</div>" + clearHTML;
    
    return lineItemHTMLForOrder;
}

function getPrintedOrderReceiptHeader(serverNickname, order) {
    var headerHTML = "<div id='order_receipt_header'>";
    
    var orderNum = order.order_num;
    
    var tableLabel = order.table;
    
    if(tableLabel == 0) {
        tableLabel = "Cash Sale";        
    }
    
    if(typeof(orderNum) != 'undefined') {
        headerHTML += "<div class='order_num'>Table: " + tableLabel + "</div>" + clearHTML;
    }
    
    headerHTML += "<div class='data_table'>";
    
    headerHTML += "<div class='label'>ORDER NO:</div><div class='data'>" + orderNum + "</div>" + clearHTML;
    
    headerHTML += "<div class='label'>Order By:</div><div class='data'>" + serverNickname + "</div>" + clearHTML;
    
    headerHTML += "</div>" + clearHTML;
    
    var timestamp = utilFormatDate(new Date(clueyTimestamp()));
    headerHTML += "<div class='time data'>" + timestamp + "</div>";
    
    headerHTML += "<div class='terminal'>" + terminalID + "</div>" + clearHTML;
    
    headerHTML += "</div>" + clear10BottomBorderHTML + clear10HTML;
    
    return headerHTML;
}

function fetchCashScreenReceiptTotalsDataTable() {
    var cashScreenReceiptTotalsDataTableHTML = "<div class='data_table'>";
    
    if(totalOrder.discount_percent) {
        subTotal = parseFloat(totalOrder.pre_discount_price);
        cashScreenReceiptTotalsDataTableHTML += "<div class='label'>Sub-Total:</div><div class='data'>" + currency(subTotal) + "</div>" + clearHTML;
        
        discountAmount = (totalOrder.pre_discount_price * totalOrder.discount_percent)/100;
        cashScreenReceiptTotalsDataTableHTML += "<div class='label'>Discount " + totalOrder.discount_percent + "%:</div><div class='data'>" + currency(discountAmount) + "</div>" + clearHTML;
    } else {
        subTotal = parseFloat(totalOrder.total);
        cashScreenReceiptTotalsDataTableHTML += "<div class='label'>Sub-Total:</div><div class='data'>" + currency(subTotal) + "</div>" + clearHTML;
        
        discountAmount = 0;
    } 
    
    cashScreenReceiptTotalsDataTableHTML += taxChargable ? fetchTotalsHTMLWithTaxChargable() : fetchTotalsWithoutTaxChargableHTML();
    cashScreenReceiptTotalsDataTableHTML += clearHTML;
    
    cashScreenReceiptTotalsDataTableHTML += "</div>" + clearHTML; 
    
    return cashScreenReceiptTotalsDataTableHTML;
}

function fetchCashScreenReceiptHTML() {
    var cashScreenReceiptHTML = fetchCashScreenReceiptHeaderHTML() + clearHTML;
    cashScreenReceiptHTML += getAllOrderItemsReceiptHTML(totalOrder, false, false, true, false) + clearHTML;
    
    return cashScreenReceiptHTML;
}

function fetchCashScreenReceiptHeaderHTML() {
    var headerHTML = "<div class='data_table'>";
    headerHTML += "<div class='label'>Server:</div><div class='data'>" + current_user_nickname + "</div>" + clearHTML;
    
    timestamp = utilFormatDate(new Date(parseInt(orderStartTime(totalOrder))));
    headerHTML += "<div class='time label'>Time Started:</div><div class='time data'>" + timestamp + "</div>" + clearHTML;
    
    if(selectedTable!=0) {
        selectedTableLabel = tables[selectedTable].label;
        headerHTML += "<div class='label'>Table:</div><div class='data'>" + selectedTableLabel + "</div>" + clearHTML;
    }
    
    var orderNum = totalOrder.order_num;
    
    if(typeof(orderNum) != 'undefined') {
        headerHTML += "<div class='label'>Order Number:</div><div class='data'>" + orderNum + "</div>" + clearHTML;
    }
    
    headerHTML += "</div>";
    
    return headerHTML;
}

function getTillRollServiceChargeHTML(order) {
    if(order.service_charge && parseFloat(order.service_charge) > 0) {
        serviceChargeAmountFormatted = currency(parseFloat(order.service_charge));
        tillRollServiceChargeHTML = clearHTML + "<div class='data_table'><div class='label'>Service Charge</div>";
        tillRollServiceChargeHTML += "<div class='data'>" + serviceChargeAmountFormatted + "</div>" + clearHTML + "</div>";
    } else {    
        tillRollServiceChargeHTML = "";
    }
    
    return tillRollServiceChargeHTML;
}

function getTillRollDiscountHTML(order) {
    if(order.discount_percent && parseFloat(order.discount_percent) > 0) {
        preDiscountPrice = order.pre_discount_price;
        
        preDiscountFormatted = currency(preDiscountPrice);
        
        discountAmountFormatted = currency(order.pre_discount_price - order.total);
        
        tillRollDiscountHTML = clearHTML + "<div class='data_table'><div class='label'>Pre-Discount Price</div>";
        tillRollDiscountHTML += "<div class='data'>" + preDiscountFormatted + "</div>";
        tillRollDiscountHTML += "<div class='label'>Discount - " + order.discount_percent + "%</div>";
        tillRollDiscountHTML += "<div class='data'>" + discountAmountFormatted + "</div>" + clearHTML + "</div>";
    } else {    
        tillRollDiscountHTML = "";
    }
    
    return tillRollDiscountHTML;
}

function clearReceipt() {
    $('#till_roll').html('');
    $('#total_value').html(currency(0));
    $('#till_roll_service_charge').html('');
    $('#till_roll_discount').html('');
}

function setLoginReceipt(title, contentHTML) {
    //set the login receipt html
    $('#login_receipt_header').html(title);
    $('#login_till_roll').html(contentHTML);
    
    receiptData = JSON.stringify({
        'title':title, 
        'contentHTML':contentHTML
    });
    
    storeKeyValue("last_sale", receiptData);
}

function clearLoginReceipt() {
    $('#login_receipt_header').html("Receipt");
    $('#login_till_roll').html("");
}

function getLastSaleInfo() {
    saleData = retrieveStorageValue("last_sale");
    
    if(saleData != null) {
        return JSON.parse(saleData);
    } else {
        return null;
    }
}

//this loads up the last receipt that a user was looking at before logging out
function displayLastReceipt() {
    var lastReceiptID = fetchLastReceiptID(current_user_id);

    //make sure this table exists
    if(!tables[lastReceiptID]) {
        lastReceiptID = 0;
    }

    //set the select item
    tableSelectMenu.setValue(lastReceiptID);
    doSelectTable(lastReceiptID); 
}

function getCurrentRecptHTML() {
    return fetchOrderReceiptHTML(getCurrentOrder());
}