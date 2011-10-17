function setStatusMessage(message, hide, shake) {
    niceAlert(message);
    console.log("Status message set " + message);
}

function initMcDropDowns() {
    //table select dropdown, first init then get reference
    $("#room_select_input").mcDropdown("#room_select", {
        maxRows: 6
    });
    roomSelectMenu = $("#room_select_input").mcDropdown();
}

function hideAllMenuSubScreens() {
    $('#menu_container').hide();
    
    $('#sales_button_' + tablesButtonID).removeClass("selected");
    $('#table_screen').hide();
    
    $('#sales_button_' + modifyOrderItemButtonID).removeClass("selected");
    $('#order_item_additions').hide();
}

function currentMenuSubscreenIsMenu() {
    return $('#menu_container').is(":visible");
}

function currentMenuSubscreenIsModifyOrderItem() {
    return $('#order_item_additions').is(":visible");
}

function currentMenuSubscreenIsTableScreen() {
    return $('#table_screen').is(":visible");
}

function currentScreenIsMenu() {
    return $('#menu_screen').is(":visible");
}

function getLastReceiptItem() {
    currentSelectedReceiptItemEl = $('#menu_screen_till_roll > div.order_line:last');
    
    if(currentSelectedReceiptItemEl.length == 0) {
        setStatusMessage("There are no receipt items!");
        return null;
    }
    
    return currentSelectedReceiptItemEl;
}