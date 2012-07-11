function toggleModifyOrderItemScreen() {
    if(currentMenuSubscreenIsModifyOrderItem()) {
        hideAllMenuSubScreens();
        switchToMenuItemsSubscreen();
    } else {
        showModifyOrderItemScreen();
    }
}

function saveServiceCharge(performTotal) {    
    serviceCharge = parseFloat(serviceCharge);
    
    if(isNaN(serviceCharge)) {
        serviceCharge = 0;
    }
    
    //save the cashback in the order
    order = getCurrentOrder();
    order.service_charge = serviceCharge;
    
    //store the modified order
    if(selectedTable != 0) {
        storeTableOrderInStorage(current_user_id, selectedTable, order);
    }else {
        storeOrderInStorage(current_user_id, order);
    }
}

function promptAddNameToTable() {
    alert("Implement Me!");
}

function changeCourseNum() {
    var receiptItem = getSelectedOrLastReceiptItem();
 
    if(receiptItem) {
        var itemNumber = receiptItem.data("item_number");
        
        var currentOrder = getCurrentOrder();
        
        var orderItem = currentOrder.items[itemNumber-1];
        
        alert("popup for change course num");
    }
}

function tablesButtonPressed() {
    showTablesScreen();
}

function voidOrderItem() {
    alert("Implement Me!");
}

function voidAllOrderItems() {
    alert("Implement Me!");
}

function promptAddCovers() {
    checkForCovers();
    showCoversSubscreen();
}

function saveAddCovers() {
    //do nothing if not table order
    if($('#table_num').val().toString() != ''){
        doSubmitTableNumber()
    }
    if(selectedTable == -1) {
        showTablesSubscreen();
        return;
    }
    var covers = $("#covers_num").val();
    if (covers != ''){
    var tableOrder = getCurrentOrder();

    if (parseInt(tableOrder.covers) == 0){
    covers = parseInt(covers);
    if(isNaN(covers) || covers < 0) {
        covers = 0;
    }
    tableOrder.covers = covers;
    if(selectedTable == 0) {
        showTablesSubscreen();
        return;
    }
    if(!currentOrderEmpty()) {
        if(manualCoversPrompt) {
            doAutoLoginAfterSync = true;
        }
        manualCoversPrompt = true;
        doSyncTableOrder();
        $("#covers_num").val('');

    }
    tableScreenBack();
    }else{
        tableOrder.covers = covers;
        manualCoversPrompt = true;
        storeTableOrderInStorage(current_user_id, selectedTable, tableOrder);
        doSyncTableOrder();
        $("#covers_num").val('');
        tableScreenBack();
    }
    }else{
       tableScreenBack();
       $("#covers_num").val('');
    }

}

function checkForCovers(){
    var tableOrder = getCurrentOrder();
    if (parseInt(tableOrder.covers) != 0 || parseInt(tableOrder.covers) != -1){
       $("#covers_num").val(tableOrder.covers);
       $("#covers_num").addClass('highlighted');
    }
    if (parseInt(tableOrder.covers) == -1 || parseInt(tableOrder.covers) == 0 || parseInt(tableOrder.covers) == '0'){
      $("#covers_num").val('');
      $("#covers_num").removeClass('highlighted');
    }
    if(selectedTable == 0){
      $("#covers_num").removeClass('highlighted');
    }

//    $("#covers_num").select();
    highlightedCover = true;

}

function toggleTrainingMode() {
    
}