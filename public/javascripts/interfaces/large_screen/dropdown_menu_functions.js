var inPriceChangeMode = false;
var inStockTakeMode = false;

function menuScreenDropdownItemSelected(index, name) {
    //make sure we have stopped the last dropdown action
    if(inPriceChangeMode) {
        finishPriceChangeMode();
    } else if(inStockTakeMode) {
        finishStockTakeMode();
    }
    
    if(index == 1) {
        startPriceChangeMode();
        return;
    } else if(index == 2) {
        startStockTakeMode();
        return;
    } else if(index == 3) {
        goToSpecials();
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
    
    $('#receipt').hide();
    $('#price_change_receipt').show();
        
    loadPriceDivs(currentMenuPage);   
    
    if(currentStockTakeProductId) {
        loadStockTakeReceiptArea(currentStockTakeProductId, currentStockMenuItemId);
    }
}

function finishPriceChangeMode() {
    //reload the products
    $.getScript('/javascripts/products.js');
    
    //change the screen to stocktake mode
    inPriceChangeMode = false;
        
    $('#table_screen_button').add('#table_select_container').show();
    $('#price_change_header').hide();
    
    $('#receipt').show();
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
    
    $('#receipt').hide();
    $('#stock_take_receipt').show();
        
    loadStockDivs(currentMenuPage);   
    
    if(currentStockTakeProductId) {
        loadStockTakeReceiptArea(currentStockTakeProductId, currentStockMenuItemId);
    }
}

function finishStockTakeMode() {
    //change the screen to stocktake mode
    inStockTakeMode = false;
        
    $('#table_screen_button').add('#table_select_container').show();
    $('#stock_take_header').hide();
    
    $('#receipt').show();
    $('#stock_take_receipt').hide();
        
    //hide stock take divs
    $('#menu_items_container .stock_count').hide();
    
    setShortcutDropdownDefaultText();
}

function loadPriceDivs(pageNum) {
    //load the stock divs
    //send ajax request with page number
    $.ajax({
        url: '/load_price_for_menu_page',
        data: {
            page_num : pageNum
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

function loadStockDivs(pageNum) {
    //load the stock divs
    //send ajax request with page number
    $.ajax({
        url: '/load_stock_for_menu_page',
        data: {
            page_num : pageNum
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