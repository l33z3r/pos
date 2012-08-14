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
    $('#oia_subscreen').hide();
}

function currentMenuSubscreenIsMenu() {
    return $('#menu_container').is(":visible");
}

function currentMenuSubscreenIsModifyOrderItem() {
    return $('#oia_subscreen').is(":visible");
}

function currentMenuSubscreenIsTableScreen() {
    return $('#table_screen').is(":visible");
}

var utliKeypadClickFunction;
var utilKeypadCancelFunction;

function setUtilKeypad(position, clickFunction, cancelFunction) {
    $(position).html($('#util_keypad_container').html());
    utliKeypadClickFunction = clickFunction;
    utilKeypadCancelFunction = cancelFunction;
}

function utilKeypadClick(val) {
    utliKeypadClickFunction(val);
}

function doCancelUtilKeypad() {
    utilKeypadCancelFunction();
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
    lastReceiptItemEl = $('#menu_screen_till_roll > div.order_line:last');
    
    if(lastReceiptItemEl.length == 0) {
        setStatusMessage("There are no receipt items!");
        return null;
    }
    
    return lastReceiptItemEl;
}

function postSetConnectionStatus(connected) {
    var color = "#E0E0E0";
    
    if(!connected) {
        color = "#FF0000";
    }
    
    //we must be offline, so set the connection status light
    $('body').css("background-color", color);
}

function kickMenuScrollers() {
    //menu items
    if($('#menu_items_scroller:visible').length > 0 && $('#menu_pages_scroller:visible').length > 0) {
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
    
    //oia tabs
    if($('#oia_tabs:visible').length > 0) {
        $('#oia_tabs').touchScroll('update');
            
        currentHeight = $('#oia_tabs').height();
        scrollHeight = $('#oia_tabs').attr('scrollHeight');
        newHeight = scrollHeight - currentHeight;
        
        $('#oia_tabs').touchScroll('setPosition', 0);
    }
}

function showTablesScreen() {
    if(currentMenuSubscreenIsTableScreen()) {
        hideAllMenuSubScreens();
        showMenuItemsSubscreen();
    } else {
        //delegate to subscreen shower
        showTablesSubscreen();
    }
}

function showMoreOptionsScreen() {
    alert("functions button pressed!");
}

function goToMainMenu() {
    showSpinner();
    goTo('/mbl#menu');
}

function showGlobalSettingsPage() {
    swipeToSettings();
}

function initModifierGrid() {
    //set the width of each grid item
    var rowWidth = $('div#order_item_additions').css("width");
    
    var newWidth = roundNumberDown(parseFloat(rowWidth)/modifierGridXSize, 0) - 5;
    
    $('div#order_item_additions .grid_row .grid_item').css("width", newWidth + "px");
    
    var panelHeight = $('div#oia_subscreen').css("height");
    
    var newHeight = roundNumberDown(parseFloat(panelHeight)/modifierGridYSize, 0) - 6;
    
    $('div#order_item_additions .grid_row .grid_item').css("height", newHeight + "px");
}