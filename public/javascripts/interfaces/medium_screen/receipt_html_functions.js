function getCurrentRecptHTML() {
    return "NYI";
}

//this loads up the last receipt that a user was looking at before logging out
function displayLastReceipt() {
    var lastReceiptID = fetchLastReceiptID();
    console.log("Last recpt " + lastReceiptID);
    //set the select item
    doSelectTable(lastReceiptID); 
}