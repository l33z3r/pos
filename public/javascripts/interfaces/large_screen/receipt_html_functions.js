//this is used to fetch the login screen receipt, not the printed one
function fetchOrderReceiptHTML(order) {
    totalOrder = currentOrder = order;
    
    orderReceiptHTML = fetchFinalReceiptHeaderHTML();
    
    allOrderItemsRecptHTML = getAllOrderItemsReceiptHTML(currentOrder, false, false, true);
    
    orderReceiptHTML += clearHTML + allOrderItemsRecptHTML;
    
    subTotal = currentOrder.total;
    
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
function printItemsFromOrder(serverNickname, terminalID, orderJSON, items) {
    var allOrderItemsReceiptHTML = getPrintedOrderReceiptHeader(serverNickname, terminalID, orderJSON);

    for(var i=0; i<items.length; i++) {
        var item = items[i];
        allOrderItemsReceiptHTML += getLineItemHTMLForPrintedOrderReceipt(item);
    }
    
    printReceipt(allOrderItemsReceiptHTML, false);
}

function getLineItemHTMLForPrintedOrderReceipt(orderItem) {
    var lineItemHTMLForOrder = "<div class='order_line'>";
    
    //we don't show the amount for the order receipt
    lineItemHTMLForOrder += "<div class='amount'>" + orderItem.amount + "</div>";
    
    lineItemHTMLForOrder += "<div class='name'>" + orderItem.product.name + "</div>";
    
    //we don't show the total for the order receipt
    lineItemHTMLForOrder += "<div class='total'>&nbsp;</div>";
    
    if(orderItem.modifier) {
        lineItemHTMLForOrder += "<div class='clear'>&nbsp;</div>";
        lineItemHTMLForOrder += "<div class='modifier_name'>" + orderItem.modifier.name + "</div>" + clearHTML;
    }
    
    if(orderItem.oia_items) {
        for(var j=0; j<orderItem.oia_items.length; j++) {
            oia_is_add = orderItem.oia_items[j].is_add;
            
            if(!orderItem.oia_items[j].is_note) {
                lineItemHTMLForOrder += "<div class='oia_add'>" + (oia_is_add ? "Add" : "No") + "</div>";
            }
            
            lineItemHTMLForOrder += "<div class='oia_name " + (orderItem.oia_items[j].is_note ? "note" : "") + "'>" + orderItem.oia_items[j].description + "</div>";            
            lineItemHTMLForOrder += clearHTML;
        }
    }
    
    lineItemHTMLForOrder += "</div>" + clearHTML;
    
    return lineItemHTMLForOrder;
}

function getPrintedOrderReceiptHeader(serverNickname, terminalID, orderJSON) {
    headerHTML = "<div id='order_receipt_header'>";
    
    orderNum = orderJSON.order_num;
    
    if(typeof(orderNum) != 'undefined') {
        headerHTML += "<div class='order_num'>ORDER NO: " + orderNum + "</div>" + clearHTML;
    }
    
    headerHTML += "<div class='data_table'>";
    
    tableLabel = orderJSON.table;
    headerHTML += "<div class='label'>Table:</div><div class='data'>" + tableLabel + "</div>" + clearHTML;
    
    headerHTML += "<div class='label'>Order By:</div><div class='data'>" + serverNickname + "</div>" + clearHTML;
    
    headerHTML += "</div>" + clearHTML;
    
    timestamp = utilFormatDate(new Date());
    headerHTML += "<div class='time data'>" + timestamp + "</div>";
    
    headerHTML += "<div class='terminal'>" + terminalID + "</div>" + clearHTML;
    
    headerHTML += "</div>" + clear10BottomBorderHTML + clear10HTML;
    
    return headerHTML;
}

function fetchCashScreenReceiptTotalsDataTable() {
    cashScreenReceiptTotalsDataTableHTML = "<div class='data_table'>";
    
    if(totalOrder.discount_percent) {
        subTotal = totalOrder.pre_discount_price;
        cashScreenReceiptTotalsDataTableHTML += "<div class='label'>Sub-Total:</div><div class='data'>" + currency(subTotal) + "</div>" + clearHTML;
        
        discountAmount = (totalOrder.pre_discount_price * totalOrder.discount_percent)/100;
        cashScreenReceiptTotalsDataTableHTML += "<div class='label'>Discount " + totalOrder.discount_percent + "%:</div><div class='data'>" + currency(discountAmount) + "</div>" + clearHTML;
    } else {
        subTotal = totalOrder.total;
        cashScreenReceiptTotalsDataTableHTML += "<div class='label'>Sub-Total:</div><div class='data'>" + currency(subTotal) + "</div>" + clearHTML;
        
        discountAmount = 0;
    } 
    
    cashScreenReceiptTotalsDataTableHTML += taxChargable ? fetchTotalsHTMLWithTaxChargable("Balance Due") : fetchTotalsWithoutTaxChargableHTML("Balance Due");
    cashScreenReceiptTotalsDataTableHTML += clearHTML;
    
    cashScreenReceiptTotalsDataTableHTML += "</div>" + clearHTML; 
    
    return cashScreenReceiptTotalsDataTableHTML;
}

function fetchCashScreenReceiptHTML() {
    cashScreenReceiptHTML = fetchCashScreenReceiptHeaderHTML() + clearHTML;
    cashScreenReceiptHTML += getAllOrderItemsReceiptHTML(totalOrder, false, false, true) + clearHTML;
    //cashScreenReceiptHTML += fetchCashScreenReceiptTotalsDataTable();
    
    return cashScreenReceiptHTML;
}

function fetchFinalReceiptHTML(includeBusinessInfo, includeServerAddedText) {
    if(typeof(includeBusinessInfo) == 'undefined') {
        includeBusinessInfo = false;
    }
    
    if(typeof(includeServerAddedText) == 'undefined') {
        includeServerAddedText = true;
    }
    
    finalReceiptHTML = "";
    
    if(includeBusinessInfo) {
        finalReceiptHTML += fetchBusinessInfoHeaderHTML();
    }
    
    finalReceiptHTML += fetchFinalReceiptHeaderHTML();
    
    allOrderItemsRecptHTML = getAllOrderItemsReceiptHTML(totalOrder, false, false, includeServerAddedText);
    
    finalReceiptHTML += clearHTML + allOrderItemsRecptHTML;
    
    finalReceiptHTML += "<div class='data_table'>";
    
    if(totalOrder.discount_percent) {
        subTotal = totalOrder.pre_discount_price;
        
        finalReceiptHTML += "<div class='label'>Sub-Total:</div><div class='data'>" + currency(subTotal) + "</div>" + clearHTML;
        
        //calculate the amount of discount
        discountAmount = (totalOrder.pre_discount_price * totalOrder.discount_percent)/100;
        finalReceiptHTML += "<div class='label'>Discount " + totalOrder.discount_percent + "%:</div><div class='data'>" + currency(discountAmount) + "</div>" + clearHTML;
    } else {
        subTotal = totalOrder.total;
        finalReceiptHTML += "<div class='label'>Sub-Total:</div><div class='data'>" + currency(subTotal) + "</div>" + clearHTML;
        discountAmount = 0;
    } 
    
    finalReceiptHTML += taxChargable ? fetchTotalsHTMLWithTaxChargable() : fetchTotalsWithoutTaxChargableHTML();
    
    if(totalOrder.cashback > 0) {
        finalReceiptHTML += "<div class='label'>Cashback:</div><div class='data'>" + currency(totalOrder.cashback) + "</div>" + clearHTML;
    }
    
    cashTendered = totalOrder.cash_tendered;
    
    if(cashTendered > 0) {
        finalReceiptHTML += "<div class='label'>Paid:</div><div class='data'>" + currency(cashTendered) + "</div>" + clearHTML;
    }
    
    change = totalOrder.change;

    //is there any change? we include cashback in the change here
    var changeWithCashback = change + totalOrder.cashback;

    if(changeWithCashback > 0) {
        finalReceiptHTML += "<div class='label'>Change:</div><div class='data'>" + currency(changeWithCashback) + "</div>" + clearHTML;
    }
    
    finalReceiptHTML += "</div>" + clearHTML;
    
    return finalReceiptHTML;
}

// you must set dicountAmount and subTotal before this funciton is called
function fetchTotalsHTMLWithTaxChargable(totalLabelText) {
    if(typeof(totalLabelText) == 'undefined') {
        totalLabelText = "Total";
    }
    
    //write the tax total
    taxAmount = ((subTotal - discountAmount) * globalTaxRate)/100;
    totalsHTML = "<div class='label'>" + taxLabel + " " + globalTaxRate + "%:</div><div class='data'>" + currency(taxAmount) + "</div>" + clearHTML;
        
    totalsHTML += fetchServiceChargeHTML();
    
    //finally add up the total from the generated values above to avoid rounding errors
    total = (subTotal - discountAmount) + serviceCharge + taxAmount;
    currentTotalFinal = total;
    
    //temporarily set the totalFinal
    totalOrder.totalFinal = total;
    
    totalsHTML += "<div class='label bold'>" + totalLabelText + ":</div><div class='data bold total_container'>" + currency(total) + "</div>" + clearHTML;
    
    return totalsHTML;
}

// you must set dicountAmount and subTotal before this funciton is called
function fetchTotalsWithoutTaxChargableHTML(totalLabelText) {
    if(typeof(totalLabelText) == 'undefined') {
        totalLabelText = "Total";
    }
    
    totalsHTML = fetchServiceChargeHTML();
    
    //finally add up the total from the generated values above to avoid rounding errors
    total = (subTotal - discountAmount) + serviceCharge;
    
    currentTotalFinal = total;
    
    //temporarily set the totalFinal
    totalOrder.totalFinal = total;
    
    totalsHTML += "<div class='label bold'>" + totalLabelText + ":</div><div class='data bold total_container'>" + currency(total) + "</div>" + clearHTML;
    
    return totalsHTML;
}

function fetchServiceChargeHTML() {
    serviceChargeHTML = "";
    
    //is there a service charge set?
    if(serviceCharge>0) {
        serviceChargeHTML += "<div class='label'>" + serviceChargeLabel + ":</div><div class='data'>" + currency(serviceCharge) + "</div>" + clearHTML;
    }
    
    return serviceChargeHTML;
}

function fetchBusinessInfoHeaderHTML() {
    businessInfoHeaderHTML = "<div class='business_info'>";
    businessInfoHeaderHTML += "<div class='business_name'>" + business_name + "</div>";
    businessInfoHeaderHTML += "<div class='business_address'>" + business_address + "</div>";
    businessInfoHeaderHTML += "<div class='business_telephone'>" + business_telephone + "</div>";
    businessInfoHeaderHTML += "<div class='business_email_address'>" + business_email_address + "</div>";
    businessInfoHeaderHTML += "</div>";
  
    return businessInfoHeaderHTML;
}

function fetchFinalReceiptHeaderHTML() {
    headerHTML = "<div class='data_table'>";
    
    server = firstServerNickname(totalOrder);
    
    if(server) {
        headerHTML += "<div class='label'>Server:</div><div class='data'>" + server + "</div>" + clearHTML;
    }
    
    //alert("Time: " + totalOrder.time);
    
    //lazy init the order time of totalling
    if(typeof(totalOrder.time) == 'undefined') {
        totalOrder.time = new Date().getTime();
    }
    
    timestamp = utilFormatDate(new Date(totalOrder.time));
    
    headerHTML += "<div class='time label'>Time:</div><div class='time data'>" + timestamp + "</div>" + clearHTML;
    
    if(totalOrder.table) {
        headerHTML += "<div class='label'>Table:</div><div class='data'>" + totalOrder.table + "</div>" + clearHTML;
    }
    
    headerHTML += "<div class='label'>Terminal:</div><div class='data'>" + terminalID + "</div>" + clearHTML;
    
    if(typeof(totalOrder.payment_method) != 'undefined') {
        headerHTML += "<div class='label'>Payment Method:</div><div class='data'>" + totalOrder.payment_method + "</div>" + clearHTML;
    }
    
    orderNum = totalOrder.order_num;
        
    if(typeof(orderNum) != 'undefined') {
        headerHTML += "<div class='label'>Order Number:</div><div class='data'>" + orderNum + "</div>" + clearHTML;
    }
    
    headerHTML += "</div>";
    
    return headerHTML;
}

function fetchCashScreenReceiptHeaderHTML() {
    headerHTML = "<div class='data_table'>";
    headerHTML += "<div class='label'>Server:</div><div class='data'>" + current_user_nickname + "</div>" + clearHTML;
    
    timestamp = utilFormatDate(new Date(parseInt(orderStartTime(totalOrder))));
    headerHTML += "<div class='time label'>Time Started:</div><div class='time data'>" + timestamp + "</div>" + clearHTML;
    
    if(selectedTable!=0) {
        selectedTableLabel = tables[selectedTable].label;
        headerHTML += "<div class='label'>Table:</div><div class='data'>" + selectedTableLabel + "</div>" + clearHTML;
    }
    
    orderNum = totalOrder.order_num;
    
    if(typeof(orderNum) != 'undefined') {
        headerHTML += "<div class='label'>Order Number:</div><div class='data'>" + orderNum + "</div>" + clearHTML;
    }
    
    headerHTML += "</div>";
    
    return headerHTML;
}

function getTillRollDiscountHTML(order) {
    if(order.discount_percent && parseFloat(order.discount_percent) > 0) {
        preDiscountPrice = order.pre_discount_price;
        
        preDiscountFormatted = currency(preDiscountPrice);
        
        discountAmountFormatted = currency(order.pre_discount_price - order.total);
        
        tillRollDiscountHTML = clearHTML + "<div class='data_table'><div class='label'>Sub-Total</div>";
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
    var lastReceiptID = fetchLastReceiptID();

    //set the select item
    tableSelectMenu.setValue(lastReceiptID);
    doSelectTable(lastReceiptID); 
}

function getCurrentRecptHTML() {
    return fetchOrderReceiptHTML(getCurrentOrder());
}