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