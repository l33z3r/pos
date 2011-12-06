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