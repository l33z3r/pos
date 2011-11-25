function storeLastReceipt(user_id, table_num) {
    storeKeyJSONValue("user_" + user_id + "_last_receipt", {
        'table_num':table_num
    });
}

function fetchLastReceiptID() {
    //retrieve the users last receipt from storage
    var lastReceiptIDOBJ = retrieveStorageJSONValue("user_" + current_user_id + "_last_receipt");
 
    var lastReceiptID = null;
 
    if(lastReceiptIDOBJ == null) {
        lastReceiptID = 0;
    } else {
        lastReceiptID = lastReceiptIDOBJ.table_num;
    }

    //last receipt is a number of a table or 0 for the current order
//    if(lastReceiptID == 0) {
//        order = currentOrder;
//    } else {
//        order = tableOrders[lastReceiptID];
//    }
    
    return lastReceiptID;
}

function printReceipt(content, printRecptMessage) {
    setStatusMessage("Printing Receipt");
    
    if(printRecptMessage) {
        receiptMessageHTML = "<div id='receipt_message'>" + receiptMessage + "</div>";
        content += clearHTML + receiptMessageHTML;
    }
    
    //add space and a dot so we print a bottom margin
    content += clear30HTML + "<div class='the_dots'>.  .  .</div>";
    
    print(content);
}

function print(content) {
    $('#printFrame').contents().find('#till_roll').html(content);
    
    var content_with_css = "<!DOCTYPE html [<!ENTITY nbsp \"&#160;\"><!ENTITY amp \"&#38;\">]>\n<html>" 
    + $('#printFrame').contents().find('html').html() + "</html>";
      
    var print_service_url = 'http://' + webSocketServiceIP + ':8080/ClueyWebSocketServices/receipt_printer';
    
    $.ajax({
        type: 'POST',
        url: '/forward_print_service_request',
        error: function() {
            setStatusMessage("Error Sending Data To Print Service. URL: " + print_service_url, false, false);
        },
        data: {
            print_service_url : print_service_url,
            html_data : content_with_css
        }
    });
    
    return;
     
    
    //TODO: display an error if the service is not running...
    
    
    
    
    
    
    
    
    
    
    console.log("Websocket support? " + ("WebSocket" in window));
    
    if ("WebSocket" in window) {
        //console.log("Sending receipt content over websocket: " + content_with_css);
        
        // Let us open a web socket
        var ws = new WebSocket("ws://" + webSocketServiceIP + ":8080/ClueyWebSocketServices/receipt_printer");
        
        ws.onopen = function()
        {
            //there is a maximum limit on the size of the message we can send, 
            //so we split it into groups of 3072 chars (3kb of data)
            var charsPerGroup = 3072;
            
            console.log("Breaking data up into " + Math.ceil(content_with_css.length/charsPerGroup) + " groups to send to print service");
            for(var i = 0; i < content_with_css.length; i+=charsPerGroup) {
                var nextGroup = content_with_css.substring(i, i + charsPerGroup);
                console.log("Sending group " + ((i/charsPerGroup) + 1));
                ws.send(nextGroup);
            }
            
            //ws.send(content_with_css);
            
            ws.close();
        };
        
        ws.onmessage = function (evt) 
        { 
            var received_msg = evt.data;
            console.log("Message received: " + received_msg);
        };
        ws.onclose = function()
        { 
            // websocket is closed.
            console.log("Connection closed!"); 
        };
    } else {
        // The browser doesn't support WebSocket
        alert("WebSocket NOT supported by your Browser!");
    
    //DO IT THE OLD FASHIONED WAY
    //    $('#printFrame').contents().find('#till_roll').html(content);
    //    
    //    printFrame.focus();
    //    printFrame.print();
    }
    
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
        totalOrder.time = clueyTimestamp();
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