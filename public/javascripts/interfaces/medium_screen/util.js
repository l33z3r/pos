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
    
    //menu select dropdown, first init then get reference
    $("#menu_select_input").mcDropdown("#menu_select");
    menuSelectMenu = $("#menu_select_input").mcDropdown();
}

function hideAllMenuSubScreens() {
    $('#menu_container').hide();
    
    $('.button[id=sales_button_' + tablesButtonID + ']').removeClass("selected");
    $('#table_screen').hide();
    
    $('.button[id=sales_button_' + modifyOrderItemButtonID + ']').removeClass("selected");
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

function getSelectedOrLastReceiptItem() {
    if(!currentSelectedReceiptItemEl) {
        currentSelectedReceiptItemEl = $('#menu_screen_till_roll > div.order_line:last');
    
        if(currentSelectedReceiptItemEl.length == 0) {
            setStatusMessage("There are no receipt items!");
            return null;
        }
    }
    
    return currentSelectedReceiptItemEl;
}

function getLastReceiptItem() {
    currentSelectedReceiptItemEl = $('#menu_screen_till_roll > div.order_line:last');
    
    if(currentSelectedReceiptItemEl.length == 0) {
        setStatusMessage("There are no receipt items!");
        return null;
    }
    
    return currentSelectedReceiptItemEl;
}

function setConnectionStatus(connected) {
    var color = "#E0E0E0";
    
    if(!connected) {
        color = "#FF0000";
    }
    
    //we must be offline, so set the connection status light
    $('body').css("background-color", color);
}

function kickMenuScrollers() {
    //menu items
    $('#menu_items_scroller').touchScroll('update');
            
    currentHeight = $('#menu_items_scroller').height();
    scrollHeight = $('#menu_items_scroller').attr('scrollHeight');
    newHeight = scrollHeight - currentHeight;
        
    $('#menu_items_scroller').touchScroll('setPosition', 0);
    
    //menu pages
    $('#menu_pages_scroller').touchScroll('update');
            
    currentHeight = $('#menu_pages_scroller').height();
    scrollHeight = $('#menu_pages_scroller').attr('scrollHeight');
    newHeight = scrollHeight - currentHeight;
        
    $('#menu_pages_scroller').touchScroll('setPosition', 0);
}