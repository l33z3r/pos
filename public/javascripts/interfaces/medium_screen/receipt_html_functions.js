function getCurrentRecptHTML() {
    return "NYI";
}

//this loads up the last receipt that a user was looking at before logging out
function displayLastReceipt() {
    var lastReceiptID = fetchLastReceiptID();
    
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

function getCurrentReceiptHTML() {
    return $('#menu_screen_till_roll').html();
}