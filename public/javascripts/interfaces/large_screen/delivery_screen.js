var currentDeliveryItemQuantity = "";

function initDeliveryScreen() {
    showDeliveryScreen();
    currentDeliveryItemQuantity = "";
    
    initDeliveryProductSearchKeyboard();
    clearDeliveryProductsSearchInput();
    $('#product_search_input').focus();
    updateDeliveryProductsSearchResults();
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
        for(productId in products) {
            nextProduct = products[productId];
            
            if(nextProduct.name.toLowerCase().startsWith(selectedProductSearchLetter)) {
                results.push(nextProduct);
            }
        }
    } else {
        for(productId in products) {
            nextProduct = products[productId];
            
            if(nextProduct.name.toLowerCase().contains(searchString)) {
                results.push(nextProduct);
            }
        }
    }
    
    $('#product_search_results_scroller').html("");
    
    var resultHTML = "<div id='product_list'>";
    
    if(results.length > 0) {
        for(var i=0; i<results.length; i++) {
            var p = results[i];
            
            var startIndex = p.name.toLowerCase().indexOf(searchString);
            var endIndex = startIndex + searchString.length + 3;
            
            var productName = p.name;
            
            if(searchString.length > 0) {
                productName = productName.toLowerCase().splice(startIndex, 0, "<b>");
                productName = productName.toLowerCase().splice(endIndex, 0, "</b>");
            }
            
            resultHTML += "<div onclick='addProductToDelivery(" + p.id + ")' class='product'>" + productName + "</div>";
        }
    } else {
        resultHTML += "<div id='no_results'>No Products Found!</div>";
    }
    
    resultHTML += "</div>" + clearHTML;
    
    $('#product_search_results_scroller').html(resultHTML);
}
