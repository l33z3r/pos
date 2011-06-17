function fetchOrderReceiptHTML() {
    orderReceiptHTML = fetchReceiptHeaderHTML();
    
    orderReceiptHTML += clearHTML + $('#till_roll').html();
    
    currentOrder = getCurrentOrder();
    subTotal = currentOrder.total;
    
    if(currentOrder.discount_percent) {
        //calculate the amount of discount
        preDiscountAmount = currentOrder.pre_discount_price;
        orderReceiptHTML += "Discounted " + currentOrder.discount_percent + "% from " + currency(preDiscountAmount) + clearHTML;
    } 
    
    subTotal = currentOrder.total;
    orderReceiptHTML += "Sub-Total " + currency(subTotal) + clearHTML;
    
    return orderReceiptHTML;
}

function fetchCashScreenReceiptHTML() {
    cashScreenReceiptHTML = clearHTML + $('#till_roll').html();
    
    if(totalOrder.discount_percent) {
        subTotal = totalOrder.pre_discount_price;
        cashScreenReceiptHTML += "Sub-Total " + currency(subTotal) + clearHTML;
        
        discountAmount = (totalOrder.pre_discount_price * totalOrder.discount_percent)/100;
        cashScreenReceiptHTML += "Discount " + totalOrder.discount_percent + "% " + currency(discountAmount) + clearHTML;
    } else {
        subTotal = totalOrder.total;
        cashScreenReceiptHTML += "Sub-Total " + currency(subTotal) + clearHTML;
        
        discountAmount = 0;
    } 
    
    cashScreenReceiptHTML += taxChargable ? fetchTotalsHTMLWithTaxChargable() : fetchTotalsWithoutTaxChargableHTML();
    cashScreenReceiptHTML += clearHTML;
    
    return cashScreenReceiptHTML;
}

function fetchFinalReceiptHTML() {
    finalReceiptHTML = fetchReceiptHeaderHTML();
    
    finalReceiptHTML += clearHTML + $('#till_roll').html();
    
    finalReceiptHTML += "<div class='spacer'>&nbsp;</div>";

    if(totalOrder.discount_percent) {
        subTotal = totalOrder.pre_discount_price;
        finalReceiptHTML += "Sub-Total " + currency(subTotal) + clearHTML;
        
        //calculate the amount of discount
        discountAmount = (totalOrder.pre_discount_price * totalOrder.discount_percent)/100;
        finalReceiptHTML += "Discount " + totalOrder.discount_percent + "% " + currency(discountAmount) + clearHTML;
    } else {
        subTotal = totalOrder.total;
        finalReceiptHTML += "Sub-Total " + currency(subTotal) + clearHTML;
        discountAmount = 0;
    } 
    
    finalReceiptHTML += taxChargable ? fetchTotalsHTMLWithTaxChargable() : fetchTotalsWithoutTaxChargableHTML();
    
    totalTendered = $('#totals_tendered_value').html();
    
    if(totalTendered.length>0) {
        finalReceiptHTML += "<div id='login_till_roll_tendered_label'>Cash:</div><div id='login_till_roll_tendered_value'>" + currency(totalTendered) + "</div>";
    }
    
    change = $('#totals_change_value').html();

    if(change.length>0) {
        finalReceiptHTML += "<div id='login_till_roll_change_label'>Change:</div><div id='login_till_roll_change_value'>" + currency(change) + "</div>";
    }
    
    return finalReceiptHTML;
}

// you must set dicountAmount and subTotal before this funciton is called
function fetchTotalsHTMLWithTaxChargable() {
    //write the tax total
    taxAmount = ((subTotal - discountAmount) * globalTaxRate)/100;
    totalsHTML = "Sales Tax " + globalTaxRate + "% " + currency(taxAmount) + clearHTML;
        
    totalsHTML += fetchServiceChargeHTML();
    
    //finally add up the total from the generated values above to avoid rounding errors
    total = (subTotal - discountAmount) + serviceCharge + taxAmount;
    currentTotalFinal = total;
    
    totalsHTML += "<div id='login_till_roll_total_label'>Total:</div><div id='login_till_roll_total_value'>" + currency(total) + "</div>";
    
    return totalsHTML;
}

// you must set dicountAmount and subTotal before this funciton is called
function fetchTotalsWithoutTaxChargableHTML() {
    totalsHTML = fetchServiceChargeHTML();
    
    //finally add up the total from the generated values above to avoid rounding errors
    total = (subTotal - discountAmount) + serviceCharge;
    
    currentTotalFinal = total;
    
    totalsHTML += "<div id='login_till_roll_total_label'>Total:</div><div id='login_till_roll_total_value'>" + currency(total) + "</div>";
    
    return totalsHTML;
}

function fetchServiceChargeHTML() {
    serviceChargeHTML = "";
    
    //is there a service charge set?
    if(serviceCharge>0) {
        serviceChargeHTML += "<div id='login_till_roll_service_charge_label'>" + serviceChargeLabel 
        + "</div><div id='login_till_roll_service_charge_value'>" + currency(serviceCharge) + "</div>" + clearHTML;
    }
    
    return serviceChargeHTML;
}

function fetchReceiptHeaderHTML() {
    headerHTML = "<div id='login_till_roll_user_nickname'>Server: " + current_user_nickname + "</div>";
    
    timestamp = $('#clock').html();
    headerHTML += "<div id='login_till_roll_served_time'>Time: " + timestamp + "</div>";
    
    if(selectedTable!=0) {
        headerHTML += "<div id='login_till_roll_table'>Table: '" + tables[selectedTable].label + "'</div>";
    }
    
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