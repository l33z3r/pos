var currentDeliveryItemQuantity = "";
var currentDelivery = null;

var currentDeliveryStorageKey = "current_delivery";

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
    
    initDeliveryProductSearchKeyboard();
    clearDeliveryProductsSearchInput();
    $('#product_search_input').focus();
    updateDeliveryProductsSearchResults();
    
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
    
    $('#deliver_item_quantity_input_show').html(currentDeliveryItemQuantity);
}

function deliveryScreenKeypadClickDecimal() {
    if(currentDeliveryItemQuantity.indexOf(".") == -1) {
        currentDeliveryItemQuantity += ".";
    }
    
    $('#deliver_item_quantity_input_show').html(currentDeliveryItemQuantity);
}

function deliveryScreenKeypadClickCancel() {
    currentDeliveryItemQuantity = "";
    $('#deliver_item_quantity_input_show').html(currentDeliveryItemQuantity);
}

function clearDeliveryProductsSearchInput() {
    $('#product_search_input').val("");
    selectedProductSearchLetter = null;
    updateDeliveryProductsSearchResults();
}

function resetDeliveryProductsSelect() {
    setUtilKeyboardCallback(null);
    resetKeyboard();
}

var selectedProductSearchLetter = null;

function deliveryProductsSearchBoxFocused() {
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
    console.log("Get products for letter: " + letter);
    clearDeliveryProductsSearchInput();
    $('#delivery_screen_select_product_container #selection_letters .letter').removeClass("selected");
    $('#delivery_screen_select_product_container #selection_letters #cs_button_' + letter).addClass("selected");
    selectedProductSearchLetter = letter;
    updateDeliveryProductsSearchResults();
}

function updateDeliveryProductsSearchResults() {
    var searchString = $('#product_search_input').val().toLowerCase();
    
    var results = new Array();
    
    var nextProduct = null;
    
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
                results.push(nextProduct);
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
    
    var deliveryItemQuantity = parseFloat(currentDeliveryItemQuantity);
    
    var deliveryItem = {
        'product' : product,
        'amount' : deliveryItemQuantity,
        'is_return' : false
    }
    
    currentDeliveryItemQuantity = "";
    
    currentDelivery.items.push(deliveryItem);
    
    calculateDeliveryTotal();
    
    storeDelivery();
    
    redrawDeliveryReceipt();
}

function redrawDeliveryReceipt() {
    $('#delivery_till_roll').html(getAllDeliveryItemsReceiptHTML());
    deliveryRecptScroll();
    
    $('#delivery_screen_sub_total_value').html(currency(currentDelivery.total));
}

function getAllDeliveryItemsReceiptHTML() {
    allDeliveryItemsReceiptHTML = "";

    for(var i=0; i<currentDelivery.items.length; i++) {
        item = currentDelivery.items[i];
        allDeliveryItemsReceiptHTML += getDeliveryItemReceiptHTML(currentDelivery.items[i]);
    }
    
    return allDeliveryItemsReceiptHTML;
}
    
//TODO: replace with jquery template => http://api.jquery.com/jQuery.template/
function getDeliveryItemReceiptHTML(deliveryItem) {
    deliveryItemHTML = "<div class='delivery_line'>"
    deliveryItemHTML += "<div class='amount'>" + deliveryItem.amount + "</div>";
    
    var unitString = "";
            
    if(deliveryItem.product.unit.length > 0) {
        unitString = " (" +  deliveryItem.product.unit + ")";
    }
            
    deliveryItemHTML += "<div class='product_name'>" + deliveryItem.product.name + unitString + "</div>";
    
    var costPrice = "";
    
    if(deliveryItem.product.cost_price > 0) {
        costPrice = currency(deliveryItem.product.cost_price * deliveryItem.amount);
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
        data: {
            delivery : currentDelivery
        }
    });
}

function deliverySentToServerCallback() {
    //print receipt
    var deliveryReceiptContent = getAllDeliveryItemsReceiptHTML();    
    printReceipt(deliveryReceiptContent, false);
    
    //finish up
    currentDelivery = null;
    storeDelivery();
    $('#delivery_till_roll').html("");
    
    resetDeliveryProductSelect();
    niceAlert("Delivery Complete!");
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