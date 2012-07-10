var currentDeliveryItemQuantity = "";
var currentDelivery = null;

var currentDeliveryStorageKey = "current_delivery";

var deliveryItemReturnMode = false;

var receiveDeliveryInProcess = false;

function initDeliveryScreen() {
    currentDelivery = retrieveStorageJSONValue(currentDeliveryStorageKey);
    
    if(!currentDelivery) {
        currentDelivery = {
            'items': new Array(),
            'total': 0
        };
    }
    
    showDeliveryScreen();
    currentDeliveryItemQuantity = "";
    $('#delivery_screen_input_show').html("");
    
    initDeliveryProductSearchKeyboard();
    clearDeliveryProductsSearchInput();
    $('#product_search_input').focus();
    updateDeliveryProductsSearchResults();
    
    setReturnDeliveryItem(false);
    
    redrawDeliveryReceipt();
}

function resetDeliveryProductSelect() {
    resetKeyboard();
    showMenuScreen();
}

function initDeliveryProductSearchKeyboard() {
    toggleKeyboardEnable = false;
    
    var keyboardPlaceHolderEl = $('#delivery_screen_select_product_container #product_search_results_keyboard_container')
    
    var pos = keyboardPlaceHolderEl.offset();
    
    //show the menu directly over the placeholder
    $("#util_keyboard_container").css( {
        "position" : "absolute",
        "width" : "688px",
        "left": (pos.left) + "px", 
        "top":pos.top + "px"
    } );
    
    $('#close_keyboard_link').hide();

    $("#util_keyboard_container").show();
    
    //we need to force the search function to rerun on input, but the util keyboard will not fire an event to cause it to happen
    //so we tie a function to the callback when a key is pressed
    setUtilKeyboardCallback(function(){
        selectedProductSearchLetter = null;
        updateDeliveryProductsSearchResults();
    });
}

function deliveryScreenKeypadClick(val) {
    if(val == '0') {
        if(currentDeliveryItemQuantity.length > 0)
            currentDeliveryItemQuantity += val
    } else {
        //make sure you cannot enter a 2nd decimal place number
        if(currentDeliveryItemQuantity.indexOf(".") != -1) {
            if(currentDeliveryItemQuantity.length - currentDeliveryItemQuantity.indexOf(".") > 1) {
                return;
            }
        }
    
        currentDeliveryItemQuantity += val;
    }
    
    $('#delivery_screen_input_show').html(currentDeliveryItemQuantity);
}

function deliveryScreenKeypadClickDecimal() {
    if(currentDeliveryItemQuantity.indexOf(".") == -1) {
        currentDeliveryItemQuantity += ".";
    }
    
    $('#delivery_screen_input_show').html(currentDeliveryItemQuantity);
}

function deliveryScreenKeypadClickCancel() {
    currentDeliveryItemQuantity = "";
    $('#delivery_screen_input_show').html(currentDeliveryItemQuantity);
}

function clearDeliveryProductsSearchInput() {
    $('#product_search_input').val("");
    $('#product_search_input_upc').val("");
    $('#product_search_category_id').val(-1)
    selectedProductSearchLetter = null;
    updateDeliveryProductsSearchResults();
}

function resetDeliveryProductsSelect() {
    setUtilKeyboardCallback(null);
    resetKeyboard();
}

function searchCategorySelected() {
    $('#product_search_input_upc').val("");
    updateDeliveryProductsSearchResults();
}

var selectedProductSearchLetter = null;

function deliveryProductsSearchBoxFocused() {
    $('#product_search_input_upc').val("");
    selectedCustomerSearchLetter = null;
    $('#selection_letters .letter').removeClass("selected");
    updateCustomerSearchResults();
}

function deliveryProductsUPCBoxFocused() {
    $('#product_search_input').val("");
    selectedCustomerSearchLetter = null;
    $('#selection_letters .letter').removeClass("selected");
    updateCustomerSearchResults();
}

function loadAllDeliveryProducts() {
    selectedProductSearchLetter = null;
    $('#delivery_screen_select_product_container #selection_letters .letter').removeClass("selected");
    $('#delivery_screen_select_product_container #selection_letters #cs_button_all').addClass("selected");
    clearDeliveryProductsSearchInput();
}

function loadSearchProductsForLetter(letter) {
    clearDeliveryProductsSearchInput();
    $('#delivery_screen_select_product_container #selection_letters .letter').removeClass("selected");
    $('#delivery_screen_select_product_container #selection_letters #cs_button_' + letter).addClass("selected");
    selectedProductSearchLetter = letter;
    updateDeliveryProductsSearchResults();
}

function updateDeliveryProductsSearchResults() {
    var searchStringUPC = $('#product_search_input_upc').val();
    var searchString = $('#product_search_input').val().toLowerCase();
    var productSearchCategoryId = parseInt($('#product_search_category_id').val());
    
    var results = new Array();
    
    var nextProduct = null;
    
    //UPC overrides all search
    if(searchStringUPC.length > 0) {
        for(productId in stock_products) {
            nextProduct = stock_products[productId];
            
            if(nextProduct.upc.toLowerCase().contains(searchStringUPC)) {
                results.push(nextProduct);
            }
        }
    } else {
        if(selectedProductSearchLetter != null) {
            for(productId in stock_products) {
                nextProduct = stock_products[productId];
            
                if(nextProduct.name.toLowerCase().startsWith(selectedProductSearchLetter)) {
                    results.push(nextProduct);
                }
            }
        } else {
            for(productId in stock_products) {
                nextProduct = stock_products[productId];
            
                if(nextProduct.name.toLowerCase().contains(searchString)) {
                    if(productSearchCategoryId != -1 && (nextProduct.category_id != productSearchCategoryId)) {
                        continue;
                    }
                
                    results.push(nextProduct);
                }
            }
        }
    }
    
    $('#product_search_results_scroller').html("");
    
    var resultHTML = "<div id='product_list'>";
    
    if(results.length > 0) {
        var alphaSort = function(a, b) {
            return a.name.localeCompare(b.name);
        };
        
        results = results.sort(alphaSort);
        
        for(var i=0; i<results.length; i++) {
            var p = results[i];
            
            var startIndex = p.name.toLowerCase().indexOf(searchString);
            var endIndex = startIndex + searchString.length + 3;
            
            var productName = p.name;
            
            if(searchString.length > 0) {
                productName = productName.toLowerCase().splice(startIndex, 0, "<b>");
                productName = productName.toLowerCase().splice(endIndex, 0, "</b>");
            }
            
            var unitString = "";
            
            if(p.unit.length > 0) {
                unitString = " (" +  p.unit + ")";
            }
            
            resultHTML += "<div onclick='addProductToDelivery(" + p.id + ")' class='product'>" + productName + unitString +  "</div>";
        }
    } else {
        resultHTML += "<div id='no_results'>No Products Found!</div>";
    }
    
    resultHTML += "</div>" + clearHTML;
    
    $('#product_search_results_scroller').html(resultHTML);
}

function addProductToDelivery(productId) {
    //fetch this product from the products js array and COPY It into the deliver
    var productToCopy = products[productId];
    
    var copiedProduct = {};
    
    var product = $.extend(true, copiedProduct, productToCopy);
    
    if(currentDeliveryItemQuantity == "" || currentDeliveryItemQuantity == "0")
        currentDeliveryItemQuantity = "1";

    if(currentDeliveryItemQuantity.indexOf(".") != -1) {
        if(currentDeliveryItemQuantity.length - currentDeliveryItemQuantity.indexOf(".") == 1) {
            currentDeliveryItemQuantity = "1";
        }
    }
    var isReturn = false;
    
    var deliveryItemQuantity = parseFloat(currentDeliveryItemQuantity);
    
    if(deliveryItemReturnMode) {
        deliveryItemQuantity *= -1;
        isReturn = true;
        setReturnDeliveryItem(false);
    }
    
    var deliveryItem = {
        'product' : product,
        'amount' : deliveryItemQuantity,
        'is_return' : isReturn
    }
    
    currentDeliveryItemQuantity = "";
    $('#delivery_screen_input_show').html("");
    
    currentDelivery.items.push(deliveryItem);
    
    calculateDeliveryTotal();
    
    storeDelivery();
    
    redrawDeliveryReceipt();
}

function redrawDeliveryReceipt() {
    var deliveryTillRollHTML = getDeliveryTillRollHTML(false);
    $('#delivery_till_roll').html(deliveryTillRollHTML);
    deliveryRecptScroll();
    
    $('#delivery_screen_sub_total_value').html(currency(currentDelivery.total));
}

function getDeliveryTillRollHTML(includeHeading, includeTotal) {
    if(typeof includeHeading == "undefined") {
        includeHeading = false;
    }
    
    if(typeof includeTotal == "undefined") {
        includeTotal = false;
    }
    
    var deliveryTillRollHTML = "<div class='delivery_till_roll'>";
    
    if(includeHeading) {
        deliveryTillRollHTML += fetchBusinessInfoHeaderHTML() + clearHTML; 
        deliveryTillRollHTML += "<div class='delivery_till_roll_heading'>Delivery Received</div>" + clearHTML;
    }
    
    deliveryTillRollHTML += "<div class='delivery_till_roll_header'>";
    
    deliveryTillRollHTML += "<div class='nickname'>" + current_user_nickname + "</div>";
    
    var timestamp = utilFormatDate(new Date(clueyTimestamp()));
    
    deliveryTillRollHTML += "<div class='timestamp'>" + timestamp + "</div>" + clearHTML;
    
    deliveryTillRollHTML += "<div class='amount_header'>Qty</div>";
    deliveryTillRollHTML += "<div class='product_header'>Product</div>";
    deliveryTillRollHTML += "<div class='cost_header'>Cost</div>";
    
    deliveryTillRollHTML += "</div>" + clearHTML;
    
    deliveryTillRollHTML += getAllDeliveryItemsReceiptHTML();
    
    if(includeTotal) {
        deliveryTillRollHTML += "<div class='total_label'>Total</div><div class='total_value'>" + currency(currentDelivery.total) + "</div>" + clearHTML;
    }
    
    deliveryTillRollHTML += "</div>" + clearHTML;
    
    return deliveryTillRollHTML;
}

function getAllDeliveryItemsReceiptHTML() {
    var allDeliveryItemsReceiptHTML = "";

    for(var i=0; i<currentDelivery.items.length; i++) {
        item = currentDelivery.items[i];
        allDeliveryItemsReceiptHTML += getDeliveryItemReceiptHTML(currentDelivery.items[i]);
    }
    
    return allDeliveryItemsReceiptHTML;
}
    
//TODO: replace with jquery template => http://api.jquery.com/jQuery.template/
function getDeliveryItemReceiptHTML(deliveryItem) {
    var returnItemClass = "";
    var returnItemHTML = "";
    
    if(deliveryItem.is_return) {
        returnItemClass = "return";
        returnItemHTML = "<div class='return_word'>Return</div>" + clearHTML;
    }
    
    deliveryItemHTML = "<div class='delivery_line " + returnItemClass + "'>" + returnItemHTML;
    deliveryItemHTML += "<div class='amount'>" + deliveryItem.amount + "</div>";
    
    var unitString = "";
            
    if(deliveryItem.product.unit.length > 0) {
        unitString = " (" +  deliveryItem.product.unit + ")";
    }
            
    deliveryItemHTML += "<div class='product_name'>" + deliveryItem.product.name + unitString + "</div>";
    
    var costPrice = "";
    
    if(deliveryItem.product.cost_price > 0) {
        costPrice = currency(deliveryItem.product.cost_price * deliveryItem.amount, false);
    }
    
    deliveryItemHTML += "<div class='cost_price'>" + costPrice + "</div>";
    deliveryItemHTML += "</div>" + clearHTML;
    
    return deliveryItemHTML;
}

function storeDelivery() {
    storeKeyJSONValue(currentDeliveryStorageKey, currentDelivery);
}

function promptFinishDelivery() {
    ModalPopups.Confirm('niceAlertContainer',
        'Cancel Delivery', "<div id='nice_alert'>Are you sure you want to finish this delivery?</div>",
        {
            yesButtonText: 'Yes',
            noButtonText: 'No',
            onYes: "doFinishDelivery()",
            onNo: "hideNiceAlert();",
            width: 400,
            height: 250
        } );
}

function doFinishDelivery() {
    if(currentDelivery.items.length == 0) {
        doCancelDelivery();
        return;
    }
    
    if(receiveDeliveryInProcess) {
        niceAlert("Processing, please wait!");
        return;
    }
    
    receiveDeliveryInProcess = true;
    showLoadingDiv("Processing...");
    
    var timeoutMillis = sendOrderToServerTimeoutSeconds * 1000;
    
    currentDelivery.employee_id = current_user_id;
    storeDelivery();
    
    //send to server
    $.ajax({
        type: 'POST',
        url: '/delivery',
        timeout: timeoutMillis,
        error: function() {
            niceAlert("Error finishing delivery!");
        },
        success: function() {
            deliverySentToServerCallback();
        },
        complete: function() {
            hideLoadingDiv();
        },
        data: {
            delivery : currentDelivery
        }
    });
}

function deliverySentToServerCallback() {
    //print receipt
    var deliveryReceiptContent = getDeliveryTillRollHTML(true, true);
    printReceipt(deliveryReceiptContent, false);
    
    //finish up
    currentDelivery = null;
    storeDelivery();
    $('#delivery_till_roll').html("");
    
    resetDeliveryProductSelect();
    niceAlert("Delivery Complete!");
    
    receiveDeliveryInProcess = false;
}

function promptCancelDelivery() {
    ModalPopups.Confirm('niceAlertContainer',
        'Cancel Delivery', "<div id='nice_alert'>Are you sure you want to cancel and clear this delivery?</div>",
        {
            yesButtonText: 'Yes',
            noButtonText: 'No',
            onYes: "doCancelDelivery()",
            onNo: "hideNiceAlert();",
            width: 400,
            height: 250
        } );
}

function doCancelDelivery() {
    currentDelivery = null;
    storeDelivery();
    resetDeliveryProductSelect();
    niceAlert("Delivery Canceled!");
}

function deleteLastDeliveryItem() {
    if(currentDelivery.items.length == 0) {
        niceAlert("No Delivery Items Present!");
        return;
    }
    
    currentDelivery.items.pop();
    calculateDeliveryTotal()
    
    storeDelivery();
    redrawDeliveryReceipt();
}

function calculateDeliveryTotal() {
    var total = 0;
    
    for(var i=0; i<currentDelivery.items.length; i++) {
        item = currentDelivery.items[i];
        total += (item.product.cost_price * item.amount);
    }
    
    currentDelivery.total = total;
}

function toggleReturnDeliveryItem() {
    setReturnDeliveryItem(!deliveryItemReturnMode);
}

function setReturnDeliveryItem(turnOn) {
    if(turnOn) {
        deliveryItemReturnMode = true;
        $('.button[id=return_delivery_item_toggle_button]').addClass("selected");
    } else {
        deliveryItemReturnMode = false;
        $('.button[id=return_delivery_item_toggle_button]').removeClass("selected");
    }
}