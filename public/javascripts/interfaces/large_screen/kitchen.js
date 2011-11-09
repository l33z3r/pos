function initKitchen() {
    //hide the red x 
    $('#nav_save_button').hide();
        
    //hide the shortcut dropdown
    $('#menu_screen_shortcut_dropdown_container').hide();
}

function renderReceipt(tableID) {
    console.log("Rendering receipt for table " + tableID);
    
    $('#loading_table').html(tableID);
    
    $('#kitchen_receipt_container_' + tableID).show();
    
    var nextKitchenOrder = tableOrders[tableID];
    
    clearKitchenTableReceipt(tableID);
    
    //console.log("items: " + nextKitchenOrder.items);
     
    var allOrderItemsRecptHTML = getAllOrderItemsReceiptHTML(nextKitchenOrder);
     
    $('#kitchen_table_' + tableID + '_till_roll').html($('#kitchen_table_' + tableID + '_till_roll').html() + allOrderItemsRecptHTML);

    kitchenTableRecptScroll(tableID);
}

function finishedLoadingKitchenScreen() {
    $('#kitchen_screen #loading_message').hide();
    $('#kitchen_screen #receipts_container').show();
    
    initScrollPanes();
    
    setTimeout(kitchenTableRecptScrollAll, 20);
}

function clearKitchenTableReceipt(tableID) {
    $('#kitchen_table_' + tableID + '_till_roll').html("");
}

function kitchenTableRecptScrollAll() {
    $('#kitchen_screen .kitchen_receipt_container').each(function() {
        var nextTableID = $(this).data("table_id");
        kitchenTableRecptScroll(nextTableID)
    });
}

function kitchenTableRecptScroll(tableID) {
    recptScroll("kitchen_table_" + tableID + "_");
}