//this sends a print job to the designated terminal for printing from mobiles
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

function getCurrentRecptHTML() {
    return $('#menu_screen_till_roll').html();
}

//this loads up the last receipt that a user was looking at before logging out
function displayLastReceipt() {
    var lastReceiptID = fetchLastReceiptID(current_user_id);
    
    if(lastReceiptID == 0) {
        $('#table_num_holder').html("Select Table");
        showTablesSubscreen();
        return;
    }
    
    current_table_label = tables[lastReceiptID].label;
    
    //set the select item
    doSelectTable(lastReceiptID); 
}

function setReceiptsHTML(thehtml) {
    $('#menu_screen_till_roll').html(thehtml);
    $('#large_menu_screen_till_roll').html(thehtml);
}