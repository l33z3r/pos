var inPriceChangeMode = false;
var inStockTakeMode = false;

function menuScreenDropdownItemSelected(index, name) {
    //make sure we have stopped the last dropdown action
    if(inPriceChangeMode) {
        finishPriceChangeMode();
    } else if(inStockTakeMode) {
        finishStockTakeMode();
    }
    
    if(index.startsWith("1")) {
        var displayID = index.substring(2);
        
        showLoadingDiv("Loading Menu...");
        
        //do ajax request and then reload   
        $.ajax({
            type: 'POST',
            url: '/admin/terminals/link_display',
            success: function() {
                window.location.reload();
            },
            data: {
                terminal_id : terminalID,
                display_id : displayID
            }
        });
        return;
    } else if(index.startsWith("2")) {
        var priceLevel = index.substring(2);
        
        setGlobalPriceLevel(priceLevel);
        
        setShortcutDropdownDefaultText();
        return;
    } else if(index == 3) {
        startPriceChangeMode();
        return;
    } else if(index == 4) {
        startStockTakeMode();
        return;
    } else if(index == 5) {
        goToSpecials();
        return;
    } else if(index == 6) {
        goToAddProduct();
        return;
    } else if(index == 7) {
        goToCurrentOrders();
        return;
    }
    
    setShortcutDropdownDefaultText();
}

function setShortcutDropdownDefaultText() {
    $('#menu_screen_shortcut_dropdown_container .mcdropdown>div:first').html(defaultShortcutDropdownText);
}

function startPriceChangeMode() {
    //change the screen to stocktake mode
    inPriceChangeMode = true;
        
    $('#table_screen_button').add('#table_select_container').hide();
    $('#price_change_header').show();
    
    $('#receipt_container').hide();
    $('#price_change_receipt').show();
        
    loadPriceDivs(currentMenuPage, currentMenuSubPageId);   
    
    if(currentStockTakeProductId) {
        loadStockTakeReceiptArea(currentStockTakeProductId, currentStockMenuItemId);
    }
}

function finishPriceChangeMode() {
    showLoadingDiv("Loading Prices...");
    
    //reload the products
    $.getScript('/javascripts/products.js', priceChangeModeComplete);
}

function priceChangeModeComplete() {   
    hideLoadingDiv();
    
    //change the screen to stocktake mode
    inPriceChangeMode = false;
        
    $('#table_screen_button').add('#table_select_container').show();
    $('#price_change_header').hide();
    
    $('#receipt_container').show();
    $('#price_change_receipt').hide();
        
    //hide stock take divs
    $('#menu_items_container .price_change').hide();
    
    setShortcutDropdownDefaultText();
}

var currentPriceChangeProductId = null;
var currentPriceMenuItemId = null;
var oldPriceValue = null;

function loadPriceChangeReceiptArea(productId, menuItemId) {
    currentPriceMenuItemId = menuItemId;
    
    $('#price_change_new_price_input').attr("disabled", false);
    
    currentPriceChangeProductId = productId;
    
    $('#price_change_receipt #receipt_area').html("Loading...");
    
    $.ajax({
        url: '/load_price_receipt_for_product',
        data: {
            product_id : productId
        }
    });
}

function startStockTakeMode() {
    //change the screen to stocktake mode
    inStockTakeMode = true;
        
    $('#table_screen_button').add('#table_select_container').hide();
    $('#stock_take_header').show();
    
    $('#receipt_container').hide();
    $('#stock_take_receipt').show();
        
    loadStockDivs(currentMenuPage, currentMenuSubPageId);   
    
    if(currentStockTakeProductId) {
        loadStockTakeReceiptArea(currentStockTakeProductId, currentStockMenuItemId);
    }
}

function finishStockTakeMode() {
    //change the screen to stocktake mode
    inStockTakeMode = false;
        
    $('#table_screen_button').add('#table_select_container').show();
    $('#stock_take_header').hide();
    
    $('#receipt_container').show();
    $('#stock_take_receipt').hide();
        
    //hide stock take divs
    $('#menu_items_container .stock_count').hide();
    
    setShortcutDropdownDefaultText();
}

function loadPriceDivs(pageNum, subPageId) {
    //load the stock divs
    //send ajax request with page number
    $.ajax({
        url: '/load_price_for_menu_page',
        data: {
            page_num : pageNum, 
            sub_page_id : subPageId
        }
    });
}

function updatePrice() {
    if(currentPriceChangeProductId == null) {
        setStatusMessage("Please select a product!", true, true);
        return;
    }
    
    new_price_string = $('#price_change_new_price_input').val();
    
    if(isNaN(new_price_string)) {
        setStatusMessage("Please enter a number!", true, true);
        return;
    }

    new_price = parseFloat(new_price_string);
    
    if(oldPriceValue == new_price) {
        setStatusMessage("Please enter a new amount!", true, true);
        return;
    } else {
        $.ajax({
            url: '/update_price',
            type: "POST",
            data: {
                menu_item_id : currentPriceMenuItemId,
                product_id : currentPriceChangeProductId,
                new_price : new_price
            }
        });
    }
}

var currentStockTakeProductId = null;
var currentStockMenuItemId = null;
var oldStockValue = null;

function loadStockTakeReceiptArea(productId, menuItemId) {
    //if this is not a stock item, then ignore
    if(!products[productId].is_stock_item) {
        setStatusMessage("This is not a stock item.");
        return;
    }
    
    currentStockMenuItemId = menuItemId;
    
    $('#stock_take_new_amount_input').attr("disabled", false);
    
    currentStockTakeProductId = productId;
    
    $('#stock_take_receipt #receipt_area').html("Loading...");
    
    $.ajax({
        url: '/load_stock_receipt_for_product',
        data: {
            product_id : productId
        }
    });
}

function loadStockDivs(pageNum, subPageId) {
    //load the stock divs
    //send ajax request with page number
    $.ajax({
        url: '/load_stock_for_menu_page',
        data: {
            page_num : pageNum, 
            sub_page_id : subPageId
        }
    });
}

function updateStock(type) {
    if(currentStockTakeProductId == null) {
        setStatusMessage("Please select a product!", true, true);
        return;
    }
    
    new_amount_string = $('#stock_take_new_amount_input').val();
    
    if(isNaN(new_amount_string)) {
        setStatusMessage("Please enter a number!", true, true);
        return;
    }

    new_amount = parseFloat(new_amount_string);
    
    if(oldStockValue == new_amount) {
        setStatusMessage("Please enter a new amount!", true, true);
        return;
    } else {
        $.ajax({
            url: '/update_stock',
            type: "POST",
            data: {
                menu_item_id : currentStockMenuItemId,
                product_id : currentStockTakeProductId,
                t_type : type,
                new_amount : new_amount
            }
        });
    }
}

function goToSpecials() {
    goTo("/admin/products?show_specials_only=true");
}

function goToAddProduct() {
    goTo("/admin/products/new");
}

function goToCurrentOrders() {
    goTo("/admin/orders?section=open_orders");
}