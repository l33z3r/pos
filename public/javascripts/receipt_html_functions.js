function fetchOrderReceiptHTML() {
    totalOrder = currentOrder = getCurrentOrder();
    
    orderReceiptHTML = fetchFinalReceiptHeaderHTML();
    
    allOrderItemsRecptHTML = getAllOrderItemsReceiptHTML(currentOrder, false, false);
    
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
    cashScreenReceiptHTML += getAllOrderItemsReceiptHTML(totalOrder, false, false) + clearHTML;
    //cashScreenReceiptHTML += fetchCashScreenReceiptTotalsDataTable();
    
    return cashScreenReceiptHTML;
}

function fetchFinalReceiptHTML(includeBusinessInfo) {
    if(typeof(includeBusinessInfo) == 'undefined') {
        includeBusinessInfo = false;
    }
    
    finalReceiptHTML = "";
    
    if(includeBusinessInfo) {
        finalReceiptHTML += fetchBusinessInfoHeaderHTML();
    }
    
    finalReceiptHTML += fetchFinalReceiptHeaderHTML();
    
    allOrderItemsRecptHTML = getAllOrderItemsReceiptHTML(totalOrder, false, false);
    
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
        finalReceiptHTML += "<div class='label'>Cash:</div><div class='data'>" + currency(cashTendered) + "</div>" + clearHTML;
    }
    
    change = totalOrder.change;

    if(change > 0) {
        finalReceiptHTML += "<div class='label'>Change:</div><div class='data'>" + currency(change) + "</div>" + clearHTML;
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
    
    headerHTML += "<div class='label'>Time:</div><div class='data'>" + timestamp + "</div>" + clearHTML;
    
    if(totalOrder.table) {
        headerHTML += "<div class='label'>Table:</div><div class='data'>" + totalOrder.table + "</div>" + clearHTML;
    }
    
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
    
    timestamp = utilFormatDate(new Date(orderStartTime(totalOrder)));
    headerHTML += "<div class='label'>Time Started:</div><div class='data'>" + timestamp + "</div>" + clearHTML;
    
    if(selectedTable!=0) {
        selectedTableLabel = tables[selectedTable].label;
        headerHTML += "<div class='label'>Table:</div><div class='data'>" + selectedTableLabel + "</div>" + clearHTML;
    }
    
    orderNum = totalOrder.order_num;
    
    headerHTML += "<div class='label'>Order Number:</div><div class='data'>" + orderNum + "</div>" + clearHTML;
    
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

function printReceipt(content, printRecptMessage) {
    setStatusMessage("Printing Receipt!");
    
    if(printRecptMessage) {
        receiptMessageHTML = "<div id='receipt_message'>" + receiptMessage + "</div>";
        content += clearHTML + receiptMessageHTML;
    }
    
    print(content);
}

function print(content) {
    $('#printFrame').contents().find('#till_roll').html(content);
    
    printFrame.focus();
    printFrame.print();
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
    //retrieve the users last receipt from storage
    lastReceiptIDOBJ = retrieveStorageJSONValue("user_" + current_user_id + "_last_receipt");
 
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
    //$('#table_select').val(lastReceiptID);
    tableSelectMenu.setValue(lastReceiptID);
    doSelectTable(lastReceiptID); 
}

function storeLastReceipt(user_id, table_num) {
    storeKeyJSONValue("user_" + user_id + "_last_receipt", {
        'table_num':table_num
    });
}

function getCurrentRecptHTML() {
    return fetchOrderReceiptHTML();
}