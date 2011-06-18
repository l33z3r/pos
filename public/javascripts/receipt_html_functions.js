function fetchOrderReceiptHTML() {
    orderReceiptHTML = fetchReceiptHeaderHTML();
    
    currentOrder = getCurrentOrder();
    
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

function fetchCashScreenReceiptHTML() {
    allOrderItemsRecptHTML = getAllOrderItemsReceiptHTML(totalOrder, false, false);
    
    cashScreenReceiptHTML = clearHTML + allOrderItemsRecptHTML;
    
    cashScreenReceiptHTML += "<div class='data_table'>";
    
    if(totalOrder.discount_percent) {
        subTotal = totalOrder.pre_discount_price;
        cashScreenReceiptHTML += "<div class='label'>Sub-Total:</div><div class='data'>" + currency(subTotal) + "</div>" + clearHTML;
        
        discountAmount = (totalOrder.pre_discount_price * totalOrder.discount_percent)/100;
        cashScreenReceiptHTML += "<div class='label'>Discount " + totalOrder.discount_percent + "%:</div><div class='data'>" + currency(discountAmount) + "</div>" + clearHTML;
    } else {
        subTotal = totalOrder.total;
        cashScreenReceiptHTML += "<div class='label'>Sub-Total:</div><div class='data'>" + currency(subTotal) + "</div>" + clearHTML;
        
        discountAmount = 0;
    } 
    
    cashScreenReceiptHTML += taxChargable ? fetchTotalsHTMLWithTaxChargable() : fetchTotalsWithoutTaxChargableHTML();
    cashScreenReceiptHTML += clearHTML;
    
    cashScreenReceiptHTML += "</div>" + clearHTML;
    
    return cashScreenReceiptHTML;
}

function fetchFinalReceiptHTML() {
    finalReceiptHTML = fetchReceiptHeaderHTML();
    
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
    
    totalTendered = $('#totals_tendered_value').html();
    
    if(totalTendered.length>0) {
        finalReceiptHTML += "<div class='label'>Cash:</div><div class='data'>" + currency(totalTendered) + "</div>" + clearHTML;
    }
    
    change = $('#totals_change_value').html();

    if(change.length>0) {
        finalReceiptHTML += "<div class='label'>Change:</div><div class='data'>" + currency(change) + "</div>" + clearHTML;
    }
    
    finalReceiptHTML += "</div>" + clearHTML;
    
    return finalReceiptHTML;
}

// you must set dicountAmount and subTotal before this funciton is called
function fetchTotalsHTMLWithTaxChargable() {
    //write the tax total
    taxAmount = ((subTotal - discountAmount) * globalTaxRate)/100;
    totalsHTML = "<div class='label'>Sales Tax " + globalTaxRate + "%:</div><div class='data'>" + currency(taxAmount) + "</div>" + clearHTML;
        
    totalsHTML += fetchServiceChargeHTML();
    
    //finally add up the total from the generated values above to avoid rounding errors
    total = (subTotal - discountAmount) + serviceCharge + taxAmount;
    currentTotalFinal = total;
    
    totalsHTML += "<div class='label'>Total:</div><div class='data'>" + currency(total) + "</div>" + clearHTML;
    
    return totalsHTML;
}

// you must set dicountAmount and subTotal before this funciton is called
function fetchTotalsWithoutTaxChargableHTML() {
    totalsHTML = fetchServiceChargeHTML();
    
    //finally add up the total from the generated values above to avoid rounding errors
    total = (subTotal - discountAmount) + serviceCharge;
    
    currentTotalFinal = total;
    
    totalsHTML += "<div class='label'>Total:</div><div class='data'>" + currency(total) + "</div>" + clearHTML;
    
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

function fetchReceiptHeaderHTML() {
    headerHTML = "<div class='data_table'>";
    headerHTML += "<div class='label'>Server:</div><div class='data'>" + current_user_nickname + "</div>" + clearHTML;
    
    timestamp = $('#clock').html();
    headerHTML += "<div class='label'>Time:</div><div class='data'>" + timestamp + "</div>" + clearHTML;
    
    if(selectedTable!=0) {
        selectedTableLabel = tables[selectedTable].label;
        headerHTML += "<div class='label'>Table:</div><div class='data'>" + selectedTableLabel + "</div>" + clearHTML;
    }
    
    headerHTML += "</div>";
    
    return headerHTML;
}

function printReceipt(content) {
    setStatusMessage("Printing Receipt!");
    
    receiptMessageHTML = "<div id='receipt_message'>" + receiptMessage + "</div>";
    content += clearHTML + receiptMessageHTML;
    
    return;
    print(content);
}

function print(content) {
    var pwin=window.open('','print_content','width=500,height=1');

    pwin.document.open();
    pwin.document.write('<html><body onload="window.print()">'+content+'</body></html>');
    pwin.document.close();
 
    setTimeout(function(){
        pwin.close();
    },10000);
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

function getLastSaleInfo() {
    saleData = retrieveStorageValue("last_sale");
    
    if(saleData) {
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
    $('#table_select').val(lastReceiptID);
    doSelectTable(lastReceiptID);
}