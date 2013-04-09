var currentDeliveryItemQuantity = "";
var currentDelivery = null;

var currentDeliveryStorageKey = "current_delivery";

var deliveryItemReturnMode = false;

var receiveDeliveryInProcess = false;

var currentSelectedDeliveryItemEl = null;
var editDeliveryItemPopupAnchor = null;

var sendDeliveryToServerTimeoutSeconds = 120;

function initDeliveryScreen() {
    currentDelivery = retrieveStorageJSONValue(currentDeliveryStorageKey);
    
    if(!currentDelivery) {
        currentDelivery = {
            'items': new Array(),
            'total': 0,
            'received_date': utilFormatDate(new Date(clueyTimestamp()))
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
    
    //are we allowing the change cost price button
    if(typeof(display_button_passcode_permissions[changeCostPriceButtonID]) != 'undefined') {
        $('#delivery_screen_change_cost_price_button').show();
    } else {
        $('#delivery_screen_change_cost_price_button').hide();
    }
}

function resetDeliveryProductSelect() {
    setShortcutDropdownDefaultText();
    resetKeyboard();
    showMenuScreen();
}

function initDeliveryProductSearchKeyboard() {
    toggleKeyboardEnable = false;
    
    var keyboardPlaceHolderEl = $('#delivery_screen_select_product_container #product_search_results_keyboard_container')
    
    var pos = keyboardPlaceHolderEl.offset();
    
    //show the menu directly over the placeholder
    $("#util_keyboard_container").css({
        "position" : "absolute",
        "width" : "688px",
        "left": (pos.left) + "px", 
        "top":pos.top + "px"
    });
    
    hideUtilKeyboardCloseButton();

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
            if(currentDeliveryItemQuantity.length - currentDeliveryItemQuantity.indexOf(".") > 2) {
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
    $('#product_search_category_id').val(-1);
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
    selectedProductSearchLetter = null;
    updateDeliveryProductsSearchResults();
    updateCustomerSearchResults();
    $('#selection_letters .letter').removeClass("selected");
}

function deliveryProductsUPCBoxFocused() {
    $('#product_search_input').val("");
    $('#product_search_category_id').val(-1);
    selectedProductSearchLetter = null;
    updateDeliveryProductsSearchResults();
    $('#selection_letters .letter').removeClass("selected");
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
        'is_return' : isReturn,
        'note' : ""
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
    
    if(currentDelivery.reference_number && currentDelivery.reference_number.length > 0) {
        deliveryTillRollHTML += "<div class='reference_number'>REF#: " + currentDelivery.reference_number + "</div>" + clearHTML;
    }
    
    deliveryTillRollHTML += "<div class='nickname'>" + current_user_nickname + "</div>";
    
    var timestamp = currentDelivery.received_date;
    
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

    var deliveryItemNumber;

    for(var i=0; i<currentDelivery.items.length; i++) {
        var item = currentDelivery.items[i];
        
        deliveryItemNumber = i + 1;
        
        allDeliveryItemsReceiptHTML += getDeliveryItemReceiptHTML(item, deliveryItemNumber);
    }
    
    return allDeliveryItemsReceiptHTML;
}
    
//TODO: replace with jquery template => http://api.jquery.com/jQuery.template/
function getDeliveryItemReceiptHTML(deliveryItem, deliveryItemNumber) {
    var returnItemClass = "";
    var returnItemHTML = "";
    
    if(deliveryItem.is_return) {
        returnItemClass = "return";
        returnItemHTML = "<div class='return_word'>Return</div>" + clearHTML;
    }
    
    deliveryItemHTML = "<div class='delivery_line " + returnItemClass + "' data-delivery_item_number='" + deliveryItemNumber + "' onclick='deliveryReceiptItemSelected(this)'>" + returnItemHTML;
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
    
    deliveryItemHTML += "<div class='cost_price'>" + costPrice + "</div>" + clearHTML;
    deliveryItemHTML += "</div>" + clearHTML;
    
    if(deliveryItem.note.length > 0) {
        deliveryItemHTML += "<div class='note'>" + deliveryItem.note + "</div>" + clearHTML;
    }
    
    return deliveryItemHTML;
}

function storeDelivery() {
    storeKeyJSONValue(currentDeliveryStorageKey, currentDelivery);
}

function showFinishDeliverySubScreen() {
    if(currentDelivery.items.length == 0) {
        niceAlert("No Delivery Items Present!");
        return;
    }
    
    $('#delivery_screen_select_product_container').hide();
    $('#finish_delivery_subscreen').show();
    
    $('#delivery_date_cal').datetimepicker({
        dateFormat: 'dd-mm-yy',
        defaultDate: '01/01/01',
        timeFormat: 'hh:mm',
        addSliderAccess: true,
        maxDate: 0,
        sliderAccessArgs: {
            touchonly: false
        }
    });
    
    //force default to now
    $('#delivery_date_cal').datetimepicker("setDate", new Date());
    
    $('#delivery_reference_number_input').focus();
}

function cancelFinishDeliverySubScreen() {
    $('#delivery_reference_number_input').val("");
    $('#delivery_date_cal').val("");
    
    $('#delivery_screen_select_product_container').show();
    $('#finish_delivery_subscreen').hide();
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
    if(receiveDeliveryInProcess) {
        niceAlert("Processing, please wait!");
        return;
    }
    
    receiveDeliveryInProcess = true;
    showLoadingDiv("Processing...");        
    
    var timeoutMillis = sendDeliveryToServerTimeoutSeconds * 1000;
    
    currentDelivery.employee_id = current_user_id;
    currentDelivery.reference_number = $('#delivery_reference_number_input').val();
    currentDelivery.received_date = $('#delivery_date_cal').val();
    storeDelivery();
    
    //send to server
    $.ajax({
        type: 'POST',
        url: '/delivery',
        timeout: timeoutMillis,
        error: function(x, t, m) {
            hideLoadingDiv();
            
            if(t==="timeout") {
                niceAlert("Processing the delivery has timed out. Please check in Reports if the delivery was recorded before retrying.");
            } else {
                niceAlert("Error finishing delivery!");
            }
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
    var deliveryReceiptContent = getDeliveryTillRollHTML(true, true);
    
    if(printLocalDeliveryReceipts) {
        printLocalReceipt(deliveryReceiptContent, false);
    } else {
        printReceipt(deliveryReceiptContent, false);
    }
    
    $('#delivery_reference_number_input').val("");
    $('#delivery_date_cal').val("");
    $('#delivery_screen_select_product_container').show();
    $('#finish_delivery_subscreen').hide();
    
    //finish up
    currentDelivery = null;
    storeDelivery();
    $('#delivery_till_roll').html("");
    
    resetDeliveryProductSelect();
    niceAlert("Delivery Complete!");
    
    receiveDeliveryInProcess = false;
    
    requestReload();
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

var changeDeliveryItemCostPricePopupEl;
var changeDeliveryItemCostPricePopupAnchor;

function promptChangeDeliveryItemCostPrice() {
    if(currentDelivery.items.length == 0) {
        niceAlert("No Delivery Items Present!");
        return;
    }
    
    var popupHTML = $("#delivery_cost_price_popup_markup").html();
        
    changeDeliveryItemCostPricePopupAnchor = $('#delivery_receipt');
    
    if(changeDeliveryItemCostPricePopupAnchor.HasBubblePopup()) {
        changeDeliveryItemCostPricePopupAnchor.RemoveBubblePopup();
    }
    
    changeDeliveryItemCostPricePopupAnchor.CreateBubblePopup();
    
    changeDeliveryItemCostPricePopupAnchor.ShowBubblePopup({
        position: 'right',  
        align: 'top',
        tail	 : {
            align: 'middle'
        },
        innerHtml: popupHTML,
														   
        innerHtmlStyle:{ 
            'text-align':'left'
        },
        
        themeName: 	'all-grey',
        themePath: 	'/images/jquerybubblepopup-theme',
        alwaysVisible: false        
    }, false);
    
    changeDeliveryItemCostPricePopupAnchor.FreezeBubblePopup();
         
    var popupId = changeDeliveryItemCostPricePopupAnchor.GetBubblePopupID();
    
    changeDeliveryItemCostPricePopupEl = $('#' + popupId);
    
    var lastItem = currentDelivery.items[currentDelivery.items.length - 1];
    
    var product = lastItem.product;
    var costPrice = product.cost_price;
    
    changeDeliveryItemCostPricePopupEl.find('input').val(costPrice);
    changeDeliveryItemCostPricePopupEl.find('input').focus().select();
    
    keypadPosition = $('#' + popupId).find('.delivery_cost_price_popup_keypad_container');
    
    clickFunction = function(val) {
        var input = changeDeliveryItemCostPricePopupEl.find('input');
        doKeyboardInput(input, val);
    };
    
    cancelFunction = function() {
        var input = changeDeliveryItemCostPricePopupEl.find('input');
        doKeyboardInputCancel(input);
    };
    
    setUtilKeypad(keypadPosition, clickFunction, cancelFunction);

    //register the click handler to hide the popup when outside clicked
    registerPopupClickHandler($('#' + popupId), closePromptChangeDeliveryItemCostPrice);
}

function closePromptChangeDeliveryItemCostPrice() {
    if(changeDeliveryItemCostPricePopupEl) {
        hideBubblePopup(changeDeliveryItemCostPricePopupAnchor);
    }
}

function saveChangeDeliveryItemCostPrice() {
    closePromptChangeDeliveryItemCostPrice();
    
    var newCostPrice = changeDeliveryItemCostPricePopupEl.find("input").val();
    
    //make sure its an integer
    newCostPrice = parseFloat(newCostPrice);
    
    if(isNaN(newCostPrice) || newCostPrice < 0) {
        newCostPrice = 0;
    }
    
    var lastItem = currentDelivery.items[currentDelivery.items.length - 1];
    
    lastItem.product.cost_price = newCostPrice;
    products[lastItem.product.id].cost_price = newCostPrice;
    
    for(var i=0; i<currentDelivery.items.length; i++) {
        item = currentDelivery.items[i];
        
        if(item.product.id == lastItem.product.id) {
            item.product.cost_price = newCostPrice;
        }
    }
    
    //must send an ajax update to server for new cost price
    $.ajax({
        url: '/update_cost_price',
        type: "POST",
        data: {
            product_id : lastItem.product.id,
            new_cost_price : newCostPrice
        }
    });
    
    calculateDeliveryTotal();
    storeDelivery();
    redrawDeliveryReceipt();
}

var addDeliveryItemNotePopupEl;
var addDeliveryItemNotePopupAnchor;

function promptAddDeliveryItemNote() {
    if(currentDelivery.items.length == 0) {
        niceAlert("No Delivery Items Present!");
        return;
    }
    
    var popupHTML = $("#delivery_note_popup_markup").html();
        
    addDeliveryItemNotePopupAnchor = $('#delivery_receipt');
    
    if(addDeliveryItemNotePopupAnchor.HasBubblePopup()) {
        addDeliveryItemNotePopupAnchor.RemoveBubblePopup();
    }
    
    addDeliveryItemNotePopupAnchor.CreateBubblePopup();
    
    addDeliveryItemNotePopupAnchor.ShowBubblePopup({
        position: 'right',  
        align: 'top',
        tail	 : {
            align: 'middle'
        },
        innerHtml: popupHTML,
														   
        innerHtmlStyle:{ 
            'text-align':'left'
        },
        
        themeName: 	'all-grey',
        themePath: 	'/images/jquerybubblepopup-theme',
        alwaysVisible: false        
    }, false);
    
    addDeliveryItemNotePopupAnchor.FreezeBubblePopup();
         
    var popupId = addDeliveryItemNotePopupAnchor.GetBubblePopupID();
    
    addDeliveryItemNotePopupEl = $('#' + popupId);
    
    var lastItem = currentDelivery.items[currentDelivery.items.length - 1];
    
    var itemNote = lastItem.note;
    
    addDeliveryItemNotePopupEl.find('textarea').val(itemNote);
    addDeliveryItemNotePopupEl.find('textarea').focus().select();
    
    //register the click handler to hide the popup when outside clicked
    registerPopupClickHandler($('#' + popupId).add('#util_keyboard_container'), closePromptAddDeliveryItemNote);
}

function closePromptAddDeliveryItemNote() {
    if(addDeliveryItemNotePopupEl) {
        hideBubblePopup(addDeliveryItemNotePopupAnchor);
    }
}

function saveAddDeliveryItemNote() {
    closePromptAddDeliveryItemNote();
    
    var newNote = addDeliveryItemNotePopupEl.find("textarea").val();
    
    var lastItem = currentDelivery.items[currentDelivery.items.length - 1];
    
    lastItem.note = newNote;
    storeDelivery();
    redrawDeliveryReceipt();
}

function deliveryReceiptItemSelected(deliveryItemEl) {
    closeEditDeliveryItem();
    
    currentSelectedDeliveryItemEl = $(deliveryItemEl);
    
    currentSelectedDeliveryItemEl.addClass("selected");
    
    editDeliveryItemPopupAnchor = $('#delivery_receipt');
    
    if(editDeliveryItemPopupAnchor.HasBubblePopup()) {
        editDeliveryItemPopupAnchor.RemoveBubblePopup();
    }
    
    editDeliveryItemPopupAnchor.CreateBubblePopup();
    
    var popupHTML = $("#edit_delivery_item_popup_markup").html();
    
    editDeliveryItemPopupAnchor.ShowBubblePopup({
        position: 'right',  
        align: 'top',
        tail	 : {
            align: 'middle'
        },
        innerHtml: popupHTML,
														   
        innerHtmlStyle:{ 
            'text-align':'left'
        },
        
        themeName: 	'all-grey',
        themePath: 	'/images/jquerybubblepopup-theme',
        alwaysVisible: false        
    }, false);
    
    editDeliveryItemPopupAnchor.FreezeBubblePopup();
         
    //set the current price and quantity
    var popupId = editDeliveryItemPopupAnchor.GetBubblePopupID();
    
    var currentQuantity = currentSelectedDeliveryItemEl.children('.amount').html();
    $('#' + popupId).find('.quantity').val(currentQuantity);
    
    $('#' + popupId).find('.quantity').focus().select();
    
    var keypadPosition = $('#' + popupId).find('.edit_delivery_item_popup_keypad_container');
    
    var clickFunction = function(val) {
        doKeyboardInput(lastActiveElement, val);
    };
    
    var cancelFunction = function() {
        doKeyboardInputCancel(lastActiveElement);
    };
    
    setUtilKeypad(keypadPosition, clickFunction, cancelFunction);

    //register the click handler to hide the popup when outside clicked
    registerPopupClickHandler($('#' + popupId), closeEditDeliveryItem);
    
    return $('#' + popupId);
}

function saveEditDeliveryItem() {
    var popupId = editDeliveryItemPopupAnchor.GetBubblePopupID();
    
    //fetch the order from the order array and modify it
    //then modify the html in the receipt
    var targetInputQuantityEl = $('#' + popupId).find('.quantity');
    var newQuantity = parseFloat(targetInputQuantityEl.val());
    
    if(isNaN(newQuantity) || newQuantity == 0) {
        newQuantity = 1;
    }
    
    //fetch the item number
    var deliveryItemNumber = currentSelectedDeliveryItemEl.data("delivery_item_number");
    
    var deliveryItem = currentDelivery.items[deliveryItemNumber - 1];
    
    deliveryItem.amount = newQuantity;
    
    calculateDeliveryTotal();
    storeDelivery();
    redrawDeliveryReceipt();    
    closeEditDeliveryItem();
}

function closeEditDeliveryItem() {
    if(currentSelectedDeliveryItemEl) {
        hideBubblePopup(editDeliveryItemPopupAnchor);
        currentSelectedDeliveryItemEl.removeClass("selected");
        currentSelectedDeliveryItemEl = null;
    }
}

function removeSelectedDeliveryItem() {
    if(!currentSelectedDeliveryItemEl) {
        return;
    }
    //fetch the item number
    var deliveryItemNumber = currentSelectedDeliveryItemEl.data("delivery_item_number");

    currentDelivery.items.splice(deliveryItemNumber-1, 1);
    
    storeDelivery();
    
    currentSelectedDeliveryItemEl.hide();
    redrawDeliveryReceipt();    
    closeEditDeliveryItem();
}