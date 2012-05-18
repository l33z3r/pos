var currentTotalFinal = 0;
var currentOrderJSON;

var tableSelectMenu = null;
var menuScreenShortcutSelectMenu = null;

var defaultShortcutDropdownText = "Menu";

var editItemPopupAnchor;

var doAutoLoginAfterSync = false;

var inSplitBillMode = false;

var splitBillOrderFrom;
var splitBillOrderTo;
var splitBillTableNumber;

var lastTableZeroOrder;

//this function is called from application.js on page load
function initMenu() {
    initMenuScreenType();
    
    loadFirstMenuPage();
    
    currentMenuPage = 1;
    currentMenuSubPageId = null;
    currentOrder = new Array();

    loadCurrentOrder();
    displayLastReceipt();
    initOptionButtons();
    
    //set price level
    var storedGlobalPriceLevel = retrieveStorageValue(globalPriceLevelKey);
    
    if(storedGlobalPriceLevel == null) {
        storedGlobalPriceLevel = 1;
    } else {
        storedGlobalPriceLevel = parseInt(storedGlobalPriceLevel);
    }
    
    setGlobalPriceLevel(storedGlobalPriceLevel);
    
    //hack to scroll the recpt a little after page has loaded as there 
    //were problems on touch interface with recpt getting stuck
    setTimeout("menuRecptScroll()", 1000);
    
    setTimeout(callForwardButtonFunction, 500);
}

function callForwardButtonFunction() {
    //now if there is a forward function call from the admin function shortcut screen
    var forwardFunctionButtonId = getRawCookie(salesInterfaceForwardFunctionCookieName);
    
    if(forwardFunctionButtonId != null) {
        //alert("Clicking button " + forwardFunctionButtonId);
        
        //call the function
        doClickAButton($('#admin_screen_button_' + forwardFunctionButtonId));
    
        //delete the cookie
        setRawCookie(salesInterfaceForwardFunctionCookieName, "", -365);
    }
}

//this is to make sure that when all the images are loaded, that the ipad dislays them correctly
$(window).load(function(){
    tryDocumentLoadedLoadFirstMenuPage();
});

function initMenuScreenType() {
    if(menuScreenType == RESTAURANT_MENU_SCREEN) {
    //nothing needed here    
    } else if(menuScreenType == RETAIL_MENU_SCREEN) {
        //hide the table select box
        $('#table_screen_button, #table_select_container').hide();
        
        $('#upc_code_lookup_container').show();
        
        $('#scan_upc').keyup(function(e) {
            if(e.keyCode == 13) {
                productScanned();
            }
        });
    
        setTimeout(function(){
            $('#scan_upc').focus();
            scanFocusPoll();
        }, 1000);
    } else if(menuScreenType == CUSTOMER_MENU_SCREEN) {
        //execute a bunch of css mods to change the menu interface
        performCustomerScreenCSSMods();
    }
}

function setGlobalPriceLevel(priceLevel) {
    if(globalPriceLevel != null) {
        var oldSelectedPriceLeveLiEl = $('#menu_screen_shortcut_dropdown li[rel=2-' + globalPriceLevel + ']');
        oldSelectedPriceLeveLiEl.html(oldSelectedPriceLeveLiEl.html().substring(2));
    }
    
    var selectedPriceLevelLiEl = $('#menu_screen_shortcut_dropdown li[rel=2-' + priceLevel + ']');
    selectedPriceLevelLiEl.html("* " + selectedPriceLevelLiEl.html());
        
    globalPriceLevel = parseInt(priceLevel);
        
    //store it in global storage
    storeKeyValue(globalPriceLevelKey, globalPriceLevel);
}

function scanFocusPoll() {
    if(lastActiveElement.attr("id") == "scan_upc") {
        $('#scan_upc').focus();
        setTimeout(scanFocusPoll, 1000);
        return;
    }
}
    
function scanFocusLoginPoll() {
    if (lastActiveElement.attr("id") == "num") {
        $('#num').select();
        sendCursorToEnd($('#num').val())
        $('#num').focus();
        setTimeout(scanFocusLoginPoll, 1000);
        return;
    }
}

function sendCursorToEnd(obj) {
    var value = obj
    var message = "";
    if (value != "") {
        message = value + "\n";
    }
    ;
    $(obj).focus().val(message);
}

function initPreviousOrder() {
    if(havePreviousOrder(current_user_id)) {
        selectedTable = previousOrderTableNum;
        $('#previous_order_select_item').show();
        
        tableSelectMenu.setValue(previousOrderTableNum);
        doSelectTable(previousOrderTableNum);
        
        getTableOrderFromStorage(current_user_id, previousOrderTableNum)
        
        previousTableOrder = tableOrders[previousOrderTableNum];
        
        //carry over service charge
        serviceCharge = parseFloat(previousTableOrder.service_charge);
        
        //carry over payment method
        paymentMethod = previousTableOrder.payment_method;
        
        cashback = parseFloat(previousTableOrder.cashback);
        
        //carry over the table number
        tables[previousOrderTableNum] = {
            id : '-1', 
            label : previousTableOrder.table_info_label
        };
    }
}

function initSplitBillOrder() {
    if(haveSplitBillOrder(current_user_id)) {
        $('#split_bill_select_item').show();
    }
}

function menuScreenKeypadClick(val) {
    if(showingDisplayButtonPasscodePromptPopup) {
        $('#display_button_passcode').val($('#display_button_passcode').val() + val);
        $('#display_button_passcode_show').html($('#display_button_passcode_show').html() + "*");
    } else if(inStockTakeMode) {
        $('#stock_take_new_amount_input').val($('#stock_take_new_amount_input').val() + val);
    } else if(inPriceChangeMode) {
        $('#price_change_new_price_input').val($('#price_change_new_price_input').val() + val);
    } else if(menuScreenType == RETAIL_MENU_SCREEN) {
        $('#scan_upc').val($('#scan_upc').val() + val);
    } else {
        closePreviousModifierDialog();
        
        if(this.innerHTML == '0') {
            if(currentMenuItemQuantity.length > 0)
                currentMenuItemQuantity += val
        } else {
            //make sure you cannot enter a 2nd decimal place number
            if(currentMenuItemQuantity.indexOf(".") != -1) {
                if(currentMenuItemQuantity.length - currentMenuItemQuantity.indexOf(".") > 1) {
                    return;
                }
            }
    
            currentMenuItemQuantity += val;
        }
    }
    
    $('#menu_screen_input_show').html(currentMenuItemQuantity);
}

function menuScreenKeypadClickCancel() {
    if(inStockTakeMode) {
        $('#stock_take_new_amount_input').val("");
    } else if(inPriceChangeMode) {
        $('#price_change_new_price_input').val("");
    } else if(menuScreenType == RETAIL_MENU_SCREEN) {
        $('#scan_upc').val("");
    } else {
        if(menuItemDoubleMode) {
            setMenuItemDoubleMode(false);
        }
        
        if(menuItemStandardPriceOverrideMode) {
            setMenuItemStandardPriceOverrideMode(false);
        }
        
        currentMenuItemQuantity = "";
    }
    
    $('#menu_screen_input_show').html(currentMenuItemQuantity);
}

function menuScreenKeypadClickDecimal() {
    if(inStockTakeMode) {
        $('#stock_take_new_amount_input').val($('#stock_take_new_amount_input').val() + ".");
    } else if(inPriceChangeMode) {
        $('#price_change_new_price_input').val($('#price_change_new_price_input').val() + ".");
    } else {
        if(currentMenuItemQuantity.indexOf(".") == -1) {
            currentMenuItemQuantity += ".";
        }
    }
    
    $('#menu_screen_input_show').html(currentMenuItemQuantity);
}

function tryDocumentLoadedLoadFirstMenuPage() {
    if(inMenuContext()) {
        doMenuPageSelect(currentMenuPage, currentMenuPageId);
    }
}

function loadFirstMenuPage() {
    //set the inital menu page selected to be the first
    eval($('#pages .page:first').data('onpress'));
}

function doMenuPageSelect(pageNum, pageId) {
    //make sure the modifier popups are closed
    if(currentSelectedMenuItemElement) {
        $(currentSelectedMenuItemElement).HideBubblePopup();
        $(currentSelectedMenuItemElement).FreezeBubblePopup();
    }
    
    //set this pages class to make it look selected
    $('#pages .page').removeClass('selected');
    $('#menu_page_' + pageId).addClass('selected');

    newHTML = $('#menu_items_' + pageNum).html();
    $('#menu_items_container').html(newHTML);

    currentMenuPage = pageNum;
    currentMenuPageId = pageId;
    currentMenuSubPageId = null;
    
    //load the first sub menu page if sub menu present
    eval($('.embedded_pages_' + pageNum + ' div:first').data('onpress'));
    
    if(inStockTakeMode) {
        loadStockDivs(pageNum, currentMenuSubPageId);
    } else if(inPriceChangeMode) {
        loadPriceDivs(pageNum, currentMenuSubPageId);
    }
}

function doSubMenuPageSelect(parentPageNum, pageId) {
    //make sure the modifier popups are closed
    if(currentSelectedMenuItemElement) {
        $(currentSelectedMenuItemElement).HideBubblePopup();
        $(currentSelectedMenuItemElement).FreezeBubblePopup();
    }
    
    //set this pages class to make it look selected
    $('#pages .subpage').removeClass('selected');
    $('div[id=sub_menu_page_' + pageId + "]").addClass('selected');

    newHTML = $('#sub_menu_items_' + pageId).html();
    
    $('div[id=sub_menu_items_' + parentPageNum + '_container]').html(newHTML);

    currentMenuPage = parentPageNum;
    currentMenuPageId = pageId;
    currentMenuSubPageId = pageId;
    
    if(inStockTakeMode) {
        loadStockDivs(parentPageNum, pageId);
    } else if(inPriceChangeMode) {
        loadPriceDivs(parentPageNum, pageId);
    }
}

function productScanned() {
    //fetch the upc
    var upc = $('#scan_upc').val();
    
    if(upc.length == 0) {
        setStatusMessage("Please enter product code, or use barcode scanner");
        return;
    }
        
    var scannedProduct = products_by_upc[upc];
    
    if(typeof(scannedProduct) != 'undefined') {
        //alert(scannedProduct.name);
        doSelectMenuItem(scannedProduct.id, null, null)
        $('#scan_upc').val("");
    } else {
        niceAlert("Product not found... UPC:" + upc);
    }
}

function doSelectMenuItem(productId, menuItemId, element) {
    if(!ensureLoggedIn()) {
        return;
    }
    
    currentOrder = getCurrentOrder();

    //fetch this product from the products js array and COPY It into the order
    var productToCopy = products[productId];
    
    var copiedProduct = {};
    
    var product = $.extend(true, copiedProduct, productToCopy);
    
    //if double and no price set
    if(menuItemDoubleMode && (product.double_price == 0)) {
        niceAlert("Price has not been set for a double of this item.");
        setMenuItemDoubleMode(false);
        return;
    }
    
    if(inStockTakeMode) {
        loadStockTakeReceiptArea(productId, menuItemId);
        return;
    } else if(inPriceChangeMode) {
        loadPriceChangeReceiptArea(productId, menuItemId);
        return;
    } else if (productInfoPopupMode) {
        popupProductInfo(productId);
        return;
    }
    
    if(currentMenuItemQuantity == "" || currentMenuItemQuantity == "0")
        currentMenuItemQuantity = "1";

    if(currentMenuItemQuantity.indexOf(".") != -1) {
        if(currentMenuItemQuantity.length - currentMenuItemQuantity.indexOf(".") == 1) {
            currentMenuItemQuantity = "1";
        }
    }
            
    closePreviousModifierDialog();
    
    currentSelectedMenuItemElement = element;

    closeEditOrderItem();
    
    amount = currentMenuItemQuantity;
    
    //reset the quantity
    clearMenuScreenInput();

    buildOrderItem(product, amount);
    setModifierGridIdForProduct(product);
    
    //does this product have a modifier
    modifierCategoryId = product['modifier_category_id'];

    if(modifierCategoryId) {
        showModifierDialog(modifierCategoryId);
        return;
    }

    finishDoSelectMenuItem();
}

function showModifierDialog(modifierCategoryId) {
    boxEl = $(currentSelectedMenuItemElement);
    
    if(!boxEl.HasBubblePopup()) {
        boxEl.CreateBubblePopup();
    }
         
    popupHTML = $("#modifier_category_popup_" + modifierCategoryId).html();
         
    boxEl.ShowBubblePopup({
        align: 'center',
        innerHtml: popupHTML,
														   
        innerHtmlStyle:{ 
            'text-align':'left'
        },
												   
        themeName: 	'all-grey',
        themePath: 	'/images/jquerybubblepopup-theme'

    }, false);
    
    boxEl.FreezeBubblePopup();
    
    popupId = boxEl.GetBubblePopupID();
    
    //register the click handler to hide the popup when outside clicked
    registerPopupClickHandler($('#' + popupId), function(){
        boxEl.HideBubblePopup()
    });
}

function closePreviousModifierDialog() {
    //close the dialog of the popup for previous modifier if it not closed
    if(currentSelectedMenuItemElement) {
        hideBubblePopup($(currentSelectedMenuItemElement));
    }
}

function noModifierSelected() {
    //close the dialog
    $(currentSelectedMenuItemElement).HideBubblePopup();
    $(currentSelectedMenuItemElement).FreezeBubblePopup();
    finishDoSelectMenuItem();
}

function modifierSelected(modifierId, modifierName, modifierPrice) {
    currentOrderItem['modifier'] = {
        'id':modifierId,
        'name':modifierName,
        'price':modifierPrice
    }
    
    //if we have a discount for this order item, then add the modifier total to the pre_discount_total
    if(currentOrderItem.pre_discount_price) {
        currentOrderItem.pre_discount_price = currentOrderItem.pre_discount_price + (currentOrderItem['amount'] * modifierPrice);
    } else {
        currentOrderItem['total_price'] = currentOrderItem['total_price'] + (currentOrderItem['amount'] * modifierPrice);
    }
    
    //close the dialog
    $(currentSelectedMenuItemElement).HideBubblePopup();
    $(currentSelectedMenuItemElement).FreezeBubblePopup();
    
    finishDoSelectMenuItem();
}

function finishDoSelectMenuItem() {
    var orderItem = currentOrderItem;

    //if this is a tables order deal with it in another function
    if(selectedTable != 0) {
        tableSelectMenuItem(orderItem);
        return;
    }
    
    addItemToOrderAndSave(orderItem);
    
    //do coursing and load receipt
    loadReceipt(currentOrder, false);
    
    currentSelectedReceiptItemEl = $('#till_roll div[data-item_number=' + currentOrderItem.itemNumber + ']');
    currentSelectedReceiptItemEl.addClass("selected");
    
    testForPricePrompt(orderItem);

    setTimeout(menuRecptScroll, 20);
        
    //do the mandatory modifier grids
    testForMandatoryModifier(orderItem.product);
    
}

function tableSelectMenuItem(orderItem) {
    addItemToTableOrderAndSave(orderItem);
    
    loadReceipt(currentOrder, false);
    
    currentSelectedReceiptItemEl = $('#till_roll div[data-item_number=' + currentOrderItem.itemNumber + ']');
    currentSelectedReceiptItemEl.addClass("selected");
    
    testForPricePrompt(orderItem);
    
    setTimeout(menuRecptScroll, 20);
    
    testForMandatoryModifier(orderItem.product);
}

function testForPricePrompt(orderItem) {
    //do we need to prompt for a price
    if(orderItem.product.prompt_price) {
        var popupEl = doSelectReceiptItem(getSelectedOrLastReceiptItem());
        popupEl.find('#discount_button').hide();
        popupEl.find('#delete_button').hide();
        popupEl.find('#oia_button').hide();
        popupEl.find('#transfer_button').hide();
        popupEl.find('#quantity_editor').hide();
        popupEl.find('#course_button').hide();
        popupEl.find('#void_order_item_button').hide();
        popupEl.find('#header').html("Enter A Price");
        popupEl.find('#current_selected_receipt_item_price').focus();
        popupEl.find('#current_selected_receipt_item_price').val("");
    }
}

function getAllOrderItemsReceiptHTML(order, includeNonSyncedStyling, includeOnClick, includeServerAddedText) {
    allOrderItemsReceiptHTML = "";

    for(var i=0; i<order.items.length; i++) {
        item = order.items[i];
        allOrderItemsReceiptHTML += getOrderItemReceiptHTML(order.items[i], includeNonSyncedStyling, includeOnClick, includeServerAddedText);
    }
    
    return allOrderItemsReceiptHTML;
}
    
//TODO: replace with jquery template => http://api.jquery.com/jQuery.template/
function getOrderItemReceiptHTML(orderItem, includeNonSyncedStyling, includeOnClick, includeServerAddedText) {
    //default the args to true
    if (typeof includeNonSyncedStyling == "undefined") {
        includeNonSyncedStyling = true;
    }
    
    if (typeof includeOnClick == "undefined") {
        includeOnClick = true;
    }
    
    if (typeof includeServerAddedText == "undefined") {
        includeServerAddedText = true;
    }
    
    haveDiscount = orderItem.discount_percent && orderItem.discount_percent > 0;
    
    itemPriceWithoutDiscountOrModifier = orderItem.amount * orderItem.product_price;
    
    if(haveDiscount) {
        itemPriceWithoutModifier = itemPriceWithoutDiscountOrModifier - ((itemPriceWithoutDiscountOrModifier * orderItem.discount_percent)/100);
    } else {
        itemPriceWithoutModifier = itemPriceWithoutDiscountOrModifier;
    }
    
    notSyncedClass = (includeNonSyncedStyling && !orderItem.synced) ? "not_synced" : "";
    notSyncedMarker = (includeNonSyncedStyling && !orderItem.synced) ? "*" : "";
    
    onclickMarkup = includeOnClick ? "onclick='doSelectReceiptItem(this)'" : "";
    
    var courseLineClass = orderItem.is_course ? "course" : "";
    
    var hideOnPrintedReceiptClass = orderItem.product.hide_on_printed_receipt ? "hide_on_printed_receipt" : "";
    
    var voidClass = orderItem.is_void ? "void" : "";
    
    orderHTML = "<div class='order_line " + notSyncedClass + " " + voidClass + " " + hideOnPrintedReceiptClass + " " + courseLineClass + "' data-item_number='" + orderItem.itemNumber + "' " + onclickMarkup + ">";
    
    if(includeServerAddedText && orderItem.showServerAddedText) {
        var nickname = serverNickname(orderItem.serving_employee_id);
        var timeAdded = utilFormatTime(new Date(parseInt(orderItem.time_added)));
        
        //show a line above the last ordered, if this is not the first item in the order
        var showAddedLine = (orderItem.itemNumber != 1);
        
        orderHTML += "<div class='server " + (showAddedLine ? "added_line" : "") + "'>At " + timeAdded + " " + nickname + " added:</div>";
    }
    
    orderHTML += "<div class='amount'>" + orderItem.amount + "</div>";
    
    orderHTML += "<div class='name' data-course_num='" + orderItem.product.course_num + "'>" + notSyncedMarker + " ";

    if(orderItem.is_double) {
        orderHTML += "Double ";
    }
        
    orderHTML += orderItem.product.name + "</div>";

    orderItemTotalPriceText = number_to_currency(itemPriceWithoutModifier, {
        precision : 2
    });
    orderHTML += "<div class='total' data-per_unit_price='" + orderItem.product_price + "'>" + (orderItem.product.show_price_on_receipt ? orderItemTotalPriceText : "") + "</div>";
    
    if(orderItem.show_course_label) {
        orderHTML += "<div class='clear'>&nbsp;</div>";
        orderHTML += "<div class='course_label'>Serve As " + courseLabels[parseInt(orderItem.product.course_num)] + "</div>";
    }
    
    if(orderItem.modifier) {
        orderHTML += "<div class='clear'>&nbsp;</div>";
        orderHTML += "<div class='modifier_name'>" + orderItem.modifier.name + "</div>";
        
        modifierPriceWithoutDiscount = orderItem.modifier.price * orderItem.amount;
        
        if(haveDiscount) {
            modifierPrice = modifierPriceWithoutDiscount - ((modifierPriceWithoutDiscount * orderItem.discount_percent)/100);
        } else {
            modifierPrice = modifierPriceWithoutDiscount;
        }
    
        //only show modifier price if not zero
        if(orderItem.modifier.price > 0) {
            modifierPriceText = number_to_currency(modifierPrice, {
                precision : 2
            });
            orderHTML += "<div class='modifier_price'>" + modifierPriceText + "</div>";
        }
        
        orderHTML += clearHTML;
    }
    
    if(orderItem.oia_items) {
        for(var j=0; j<orderItem.oia_items.length; j++) {
            
            oia_is_add = orderItem.oia_items[j].is_add;
            
            orderHTML += clearHTML + "<div class='oia " + (orderItem.oia_items[j].hide_on_receipt ? "hide_on_receipt" : "") + "'>";
            
            orderHTML += "<div class='oia_name " + (orderItem.oia_items[j].is_note ? "note" : "") + "'>";
            
            if(!orderItem.oia_items[j].is_note) {
                if(orderItem.oia_items[j].is_addable) {
                    orderHTML += oia_is_add ? "Add " : "No ";
                }
            }
            
            orderHTML += orderItem.oia_items[j].description + "</div>";
            
            if(orderItem.oia_items[j].abs_charge != 0) {
                
                oiaPriceWithoutDiscount = orderItem.oia_items[j].abs_charge * orderItem.amount;
        
                if(haveDiscount && oia_is_add) {
                    oiaPrice = oiaPriceWithoutDiscount - ((oiaPriceWithoutDiscount * orderItem.discount_percent)/100);
                } else {
                    oiaPrice = oiaPriceWithoutDiscount;
                }
        
                orderHTML += "<div class='oia_price'>" + (!oia_is_add ? "-" : "") + currency(oiaPrice, false) + "</div>";
            }
            
            orderHTML += "</div>" + clearHTML;
        }
    }

    var preDiscountPrice = (orderItem.product_price * orderItem.amount);

    //add the modifiers price to the preDiscountPrice
    if(orderItem.modifier) {
        preDiscountPrice += orderItem.modifier.price * orderItem.amount;
    }
    
    //add the oias price to the preDiscountPrice
    if(orderItem.oia_items) {
        var oiaPriceTotal = 0;
        
        for(var j=0; j<orderItem.oia_items.length; j++) {
            var nextOia = orderItem.oia_items[j];
            
            if(nextOia.is_add) {
                oiaPriceTotal += orderItem.oia_items[j].abs_charge;
            } else {
                oiaPriceTotal -= orderItem.oia_items[j].abs_charge;
            }
        }
        
        preDiscountPrice += oiaPriceTotal * orderItem.amount;
    }
    
    if(haveDiscount) {
        formattedPreDiscountedPrice = number_to_currency(preDiscountPrice, {
            precision : 2
        });
            
        orderHTML += clearHTML;
        
        if(orderItem.discount_percent == 100) {
            orderHTML += "<div class='discount_complimentary'>Complimentary (was " + formattedPreDiscountedPrice + ")</div>";
        } else {
            orderHTML += "<div class='discount'>" + clearHTML;
            orderHTML += "<div class='header'>Discounted</div>";
            orderHTML += "<div class='discount_amount'>" + orderItem.discount_percent + "% from </div>";
            orderHTML += "<div class='new_price'>" + formattedPreDiscountedPrice + "</div>" + clearHTML;
            orderHTML += "</div>";
        }
    }
    
    orderHTML += clearHTML + "</div>" + clearHTML;
    
    return orderHTML;
}

function doSelectReceiptItem(orderItemEl) {
    //do nothing if we are in the customer interface
    if(menuScreenType == CUSTOMER_MENU_SCREEN) {
        return null;
    }
    
    orderItemEl = $(orderItemEl);
    
    //close any open popup
    closeEditOrderItem();
    
    //make sure the modifier grids are closed
    switchToMenuItemsSubscreen();
    
    //are we allowed to view the discount button
    //we are if the button id is present in this array
    if(typeof(display_button_passcode_permissions[parseInt(discountButtonID)]) != 'undefined') {
        $('#discount_button').show();
    } else {
        $('#discount_button').hide();
    }
    
    //are we allowed to view the change price controls
    //we are if the button id is present in this array
    if(typeof(display_button_passcode_permissions[parseInt(changePriceButtonID)]) != 'undefined') {
        $('#price_editor').show();
    } else {
        $('#price_editor').hide();
    }
    
    //are we allowed to delete an item
    //we are if the button id is present in this array
    if(typeof(display_button_passcode_permissions[parseInt(removeItemButtonID)]) != 'undefined') {
        $('#delete_button').show();
    } else {
        $('#delete_button').hide();
    }
    
    //are we allowed to oia an item
    //we are if the button id is present in this array
    if(typeof(display_button_passcode_permissions[parseInt(oiaButtonID)]) != 'undefined') {
        $('#oia_button').show();
    } else {
        $('#oia_button').hide();
    }
    
    //are we allowed to view the course num controls
    //we are if the button id is present in this array
    if(typeof(display_button_passcode_permissions[parseInt(courseNumButtonID)]) != 'undefined') {
        $('#course_button').show();
    } else {
        $('#course_button').hide();
    }
    
    //are we allowed to view the void item controls
    //we are if the button id is present in this array
    if(typeof(display_button_passcode_permissions[parseInt(voidOrderItemButtonID)]) != 'undefined') {
        $('#void_order_item_button').show();
    } else {
        $('#void_order_item_button').hide();
    }
    
    //save the currently opened dialog
    currentSelectedReceiptItemEl = orderItemEl;
    
    
    
    
    
    //we are having a problem with the items in a receipt not being ordered correctly sometimes
    //it has to do with itemNumber not being set correctly. Cant figure out what is causing it, but
    //this here will solve the problem for now, by reordering the receipt each time it is loaded
    //this function is also in other places so if you are removing it make sure all calls to it are removed
    try {
        //fetch the selected product and set its default oia grid
        var selectedProduct = products[getCurrentOrder().items[parseInt(orderItemEl.data("item_number"))-1].product.id];    
        setModifierGridIdForProduct(selectedProduct);
    } catch(e) {
        console.log("Receipt Item selection problem automatically resolved");
        
        var messyOrder = getCurrentOrder();
        
        orderReceiptItems(messyOrder);
        
        if(selectedTable != 0) {
            storeTableOrderInStorage(current_user_id, selectedTable, messyOrder);
        }else {
            storeOrderInStorage(current_user_id, messyOrder);
        }
        
        loadReceipt(messyOrder);
        
        return null;
    }
    
    
    
    
    
    //keep the border
    orderItemEl.addClass("selected");
    
    editItemPopupAnchor = $('#receipt');
    
    if(editItemPopupAnchor.HasBubblePopup()) {
        editItemPopupAnchor.RemoveBubblePopup();
    }
    
    editItemPopupAnchor.CreateBubblePopup();
    
    popupHTML = $("#edit_receipt_item_popup_markup").html();
    
    editItemPopupAnchor.ShowBubblePopup({
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
    
    editItemPopupAnchor.FreezeBubblePopup();
         
    //set the current price and quantity
    popupId = editItemPopupAnchor.GetBubblePopupID();
    
    currentPrice = orderItemEl.children('.total').data("per_unit_price");
    currentPrice = currency(currentPrice, false);
    $('#' + popupId).find('.price').val(currentPrice);
    
    currentQuantity = orderItemEl.children('.amount').html();
    $('#' + popupId).find('.quantity').val(currentQuantity);
    
    $('#' + popupId).find('.quantity').focus();
    
    keypadPosition = $('#' + popupId).find('.edit_order_item_popup_keypad_container');
    
    clickFunction = function(val) {
        currentVal = lastActiveElement.val();
        newVal = currentVal.toString() + val;
        lastActiveElement.val(newVal);
    };
    
    cancelFunction = function() {
        oldVal = lastActiveElement.val();
        newVal = oldVal.substring(0, oldVal.length - 1);
        lastActiveElement.val(newVal);
    };
    
    setUtilKeypad(keypadPosition, clickFunction, cancelFunction);

    //register the click handler to hide the popup when outside clicked
    registerPopupClickHandler($('#' + popupId), closeEditOrderItem);
    
    return $('#' + popupId);
}

function editOrderItemIncreaseQuantity() {
    popupId = editItemPopupAnchor.GetBubblePopupID();
    
    targetInputEl = $('#' + popupId).find('.quantity');
    
    currentVal = parseFloat(targetInputEl.val());
    
    var newQuantity = currentVal;
    
    if(isNaN(currentVal)) {
        newQuantity = 1;
    } else {
        newQuantity = currentVal + 1;
    }
    
    targetInputEl.val(newQuantity);
}

function editOrderItemDecreaseQuantity() {
    popupId = editItemPopupAnchor.GetBubblePopupID();
    
    targetInputEl = $('#' + popupId).find('.quantity');
    
    currentVal = parseFloat(targetInputEl.val());
    
    var newQuantity = currentVal;
    
    if(isNaN(currentVal)) {
        newQuantity = 1;
    } else if(currentVal > 1) {
        newQuantity = currentVal - 1;
    }
    
    targetInputEl.val(newQuantity);
}

function closeEditOrderItem() {
    if(currentSelectedReceiptItemEl) {
        hideBubblePopup(editItemPopupAnchor);
        currentSelectedReceiptItemEl.removeClass("selected");
    
        currentSelectedReceiptItemEl = null;
    }
    
    $('#scan_upc').focus();
}

function saveEditOrderItem() {
    //fetch the item number
    var itemNumber = currentSelectedReceiptItemEl.data("item_number");
    
    popupId = editItemPopupAnchor.GetBubblePopupID();
    
    closeEditOrderItem();
    
    //fetch the order from the order array and modify it
    //then modify the html in the receipt
    targetInputQuantityEl = $('#' + popupId).find('.quantity');
    newQuantity = parseFloat(targetInputQuantityEl.val());
    
    if(isNaN(newQuantity) || newQuantity == 0) {
        newQuantity = 1;
    }
    
    targetInputPricePerUnitEl = $('#' + popupId).find('.price');
    newPricePerUnit = parseFloat(targetInputPricePerUnitEl.val());
    
    if(isNaN(newPricePerUnit)) {
        newPricePerUnit = 0;
    }
    
    order = getCurrentOrder();
    
    var courseNum = order.items[itemNumber - 1].product.course_num;
    var is_void = order.items[itemNumber - 1].is_void;
    
    if(selectedTable != 0) {
        modifyOrderItem(order, itemNumber, newQuantity, newPricePerUnit, courseNum, is_void);
        storeTableOrderInStorage(current_user_id, selectedTable, order);
    } else {
        modifyOrderItem(order, itemNumber, newQuantity, newPricePerUnit, courseNum, is_void);
        
        storeOrderInStorage(current_user_id, order);
    }
    
    order = getCurrentOrder();
    
    //redraw the receipt
    loadReceipt(order, true);
}

function editOrderItemOIAClicked() {
    hideBubblePopup(editItemPopupAnchor);
    showModifyOrderItemScreen();
}

function writeTotalToReceipt(order, orderTotal) {
    if(!order) return;
    
    tillRollDiscountHTML = getTillRollDiscountHTML(order);
    
    $('#till_roll_discount').html(tillRollDiscountHTML);
    
    $('#total_value').html(currency(orderTotal));
}

function tableScreenSelectTable(tableId) {
    if(inTransferOrderMode) {
        if(tableId == 0) {
            niceAlert("Cannot move order to table 0");
            return;
        }
        
        if(transferOrderInProgress) {
            niceAlert("Transfer table order in progress, please wait.");
            return;
        }
        
        doTransferTable(selectedTable, tableId);
        
        return;
    } else if(inTransferOrderItemMode) {
        if(tableId == 0) {
            niceAlert("Cannot move order item to table 0");
            return;
        }
        
        if(transferOrderItemInProgress) {
            niceAlert("Transfer table order item in progress, please wait.");
            return;
        }
        
        doTransferOrderItem(selectedTable, tableId);
        
        return;
    }
    
    //back to menu screen
    showMenuScreen();
    
    tableSelectMenu.setValue(tableId);
    doSelectTable(tableId);
}

function loadReceipt(order, doScroll) {
    clearReceipt();
    
    if(order == null){
        return;
    }

    var orderTotal = order.total;
    orderItems = order.items;

    allOrderItemsRecptHTML = getAllOrderItemsReceiptHTML(order);
    $('#till_roll').html($('#till_roll').html() + allOrderItemsRecptHTML);

    if(orderTotal != null) {
        writeTotalToReceipt(order, orderTotal);
    }
    
    if(doScroll) {
        menuRecptScroll();
    }
    
    //we need to copy over the selected item as there is new markup
    if(currentSelectedReceiptItemEl) {
        var selectedReceiptItemNumber = currentSelectedReceiptItemEl.data("item_number");
        currentSelectedReceiptItemEl = $('#till_roll div[data-item_number=' + selectedReceiptItemNumber + ']');
    }
}

function storeDallasKeyVal(e) {
    if (e.keyCode == 13){
        var newVal = $('#user_passcode').val().substring(3,15);
        $('#user_passcode').val(newVal);
    }
    if (e.keyCode == 117){
        $('#user_passcode').val("u");
    }
    if (e.keyCode == 97){
        $('#user_passcode').val("a");
    }
}

function nullOnEnter(event){
    if(event.keyCode==13){
        event.keyCode = null;
        return;
    }
}

function loginRecptScroll() {
    recptScroll("login_");
}

function loginRecptUpdate() {
    updateRecpt("login_");
}

function menuRecptScroll() {
    recptScroll("");
}

function totalsRecptScroll() {
    recptScroll("totals_");
}

function reportsRecptScroll() {
    recptScroll("reports_center_");
}

function reportsRecptUpdate() {
    updateRecpt("reports_center_");
}

function reportsLeftRecptScroll() {
    recptScroll("reports_left_");
}

function floatRecptScroll() {
    recptScroll("float_");
}

function adminOrderListRecptScroll() {
    recptScroll("admin_order_list_");
}

function mobileTerminalRecptScroll() {
    recptScroll("mobile_terminal_");
}

function mobileServerRecptScroll() {
    recptScroll("mobile_server_");
}

function mobileTableRecptScroll() {
    recptScroll("mobile_table_");
}

function clearOrder(selectedTable) {
    //delete the cookie
    //clear the in memory order
    if(selectedTable == 0) {
        clearOrderInStorage(current_user_id);
        currentOrder = null;
    } else {
        clearTableOrderInStorage(current_user_id, selectedTable);
    //dont need to worry about clearing memory as it is read in from cookie which now no longer exists
    }
    
    clearReceipt();
}

function doTotal(applyDefaultServiceCharge) {
    if(currentOrderEmpty()) {
        setStatusMessage("No order present to sub-total!", true, true);
        return;
    }
    
    if(!ensureLoggedIn()) {
        return;
    }
    
    if(applyDefaultServiceCharge) {
        applyDefaultServiceChargePercent();
    }
    
    totalOrder = getCurrentOrder();
    
    //get the receipt items and the taxes/discounts
    cashScreenReceiptHTML = fetchCashScreenReceiptHTML()
    $('#totals_till_roll').html(cashScreenReceiptHTML);
    
    //set the data in the cash popout
    $('#totals_data_table').html(fetchCashScreenReceiptTotalsDataTable());
    
    cashTendered = 0;
    cashTenderedKeypadString = "";
    
    //set the discount in the cash out till roll
    cashScreenReceiptDiscountHTML = getTillRollDiscountHTML(totalOrder);
    $('#totals_till_roll_discount').html(cashScreenReceiptDiscountHTML);
    
    var orderTotal = totalOrder.total;
    
    $('#cash_screen_sub_total_value').html(currency(orderTotal));
    
    if(!paymentMethod) {
        paymentMethod = defaultPaymentMethod;
    }
    
    //reset some vars
    splitPayments = {};
    paymentIntegrationId = 0;
    
    var paymentMethodId = getPaymentMethodId(paymentMethod);
    
    paymentMethodSelected(paymentMethodId);
    
    //hide the dropdown menu
    $('#menu_screen_shortcut_dropdown_container').hide();
    
    showNavBackLinkMenuScreen();
    showTotalsScreen();
    totalsRecptScroll();
    
    $('#totals_tendered_value').html(currency(0, false));
    updateTotalTendered();
    
    $('#totals_tendered_box').addClass("selected");
    
    resetLoyaltyCustomer();
}

var cashSaleInProcess = false;

function doTotalFinal() {
    //as we now send orders when a cash out is done for table 0, 
    //we must halt here if there is an order in progress, otherwise we would lose this order
    if(cashSaleInProcess || orderInProcess) {
        niceAlert("There is an order being processed, please wait.");
        return;
    }
    
    //check that we have not just made an order, if so, we must wait before cashing out as it causes problems
    //but we allow table 0 orders to be cashed out regardless
    var now = clueyTimestamp();
    
    //if we are on table 0 and we are not processing table 0 orders, then we can skip this check
    if((selectedTable != 0 || isProcessingTable0Orders) && lastOrderSentTime != null && ((now - lastOrderSentTime) < (pollingAmount + 2000))) {
        showLoadingDiv("Waiting on previous sale to finish processing...");
        setTimeout(doTotalFinal, 1000);
        return;
    }
    
    hideLoadingDiv();
    
    cashSaleInProcess = true;
    
    if(currentOrderEmpty()) {
        setStatusMessage("No order present to total!", true, true);
        return;
    }
    
    if(!ensureLoggedIn()) {
        return;
    }
    
    var isSplitBill = false;
    
    numPersons = 0

    isTableZeroOrder = false;

    if(selectedTable == 0) {
        totalOrder = currentOrder;
        tableInfoId = null;
        tableInfoLabel = "None";
        isTableOrder = false;
        
        if(isProcessingTable0Orders) {
            isTableZeroOrder = true;
        }
            
        //copy the order to distribute through system after processing
        var copiedLastTableZeroOrder = {};
        lastTableZeroOrder = $.extend(true, copiedLastTableZeroOrder, totalOrder);        
    } else {
        //get total for table
        totalOrder = tableOrders[selectedTable];

        if(selectedTable == previousOrderTableNum) {
            //pick up the previous table
            tableInfoLabel = tables[previousOrderTableNum].label;
            isTableOrder = (tableInfoLabel != 'None');
            tableInfoId = totalOrder.tableInfoId;
        } else if(selectedTable == tempSplitBillTableNum) {
            
            isSplitBill = true;
            
            //pick up the table
            totalOrder.tableInfoId = totalOrder.split_bill_table_num;
            tableInfoLabel = tables[totalOrder.tableInfoId].label + " Split";
            isTableOrder = true;
            tableInfoId = totalOrder.tableInfoId;
        } else {
            isTableOrder = true;
            tableInfoId = selectedTable;
            tableInfoLabel = tables[tableInfoId].label;
        }

        //TODO: pick up num persons
        numPersons = totalOrder.covers;
    }

    if(!paymentMethod) {
        paymentMethod = defaultPaymentMethod;
    }
    
    totalOrder.time = clueyTimestamp();
    totalOrder.payment_method = paymentMethod;
    
    //set the service charge again in case it was changed on the totals screen
    totalOrder.service_charge = serviceCharge;
    totalOrder.cashback = cashback;
    
    discountPercent = totalOrder.discount_percent;
    preDiscountPrice = totalOrder.pre_discount_price;
    
    var orderTotal = totalOrder.total;
    
    if(parseFloat(cashTendered) == 0.0) {
        cashTendered = orderTotal + serviceCharge;
        totalOrder.cash_tendered = orderTotal + serviceCharge;
    } else {
        totalOrder.cash_tendered = cashTendered;
    }
    
    totalOrder.change = $('#totals_change_value').html();
    
    //need to set the split_payments on the order for the receipt
    totalOrder.split_payments = splitPayments;
    
    //open cash drawer explicitly if it is set to do 
    //so on a payment method basis
    //as the printer will not trigger it here
    //this loop will also purge 0 amounts from the splitPayments array
    var doOpenCashDrawer = false;
    
    if($.isEmptyObject(splitPayments)) {
        splitPayments[paymentMethod] = totalOrder.cash_tendered;
        
        doOpenCashDrawer = paymentMethods[getPaymentMethodId(paymentMethod)].open_cash_drawer;
    } else {
        for(var pm in splitPayments) {
            //make sure there is an amount in this payment type
            if(parseFloat(splitPayments[pm]) <= 0) {
                delete splitPayments[pm];
                continue;
            }
        
            var pmId = getPaymentMethodId(pm);
        
            if(paymentMethods[pmId].open_cash_drawer){
                doOpenCashDrawer = true;
            }
        }
    }
    
    console.log("opening cash drawer: " + doOpenCashDrawer);
    
    if(doOpenCashDrawer) {
        openCashDrawer();
    }
    
    //do up the subtotal and total and retrieve the receipt html for both the login screen and for print
    receiptHTML = fetchFinalReceiptHTML(false, true, false);
    printReceiptHTML = fetchFinalReceiptHTML(true, false, printVatReceipt);
        
    setLoginReceipt("Last Sale", receiptHTML);
    
    if(taxChargable) {
        orderSalesTaxRate = globalTaxRate;
        
        taxAmount = (totalOrder.total * globalTaxRate)/100;
        orderTotal = totalOrder.total + taxAmount;
    } else {
        orderSalesTaxRate = -1;
        orderTotal = totalOrder.total;
    }
    
    //make sure 2 decimal places
    orderTotal = parseFloat(orderTotal).toFixed(2);
    
    order_num = totalOrder.order_num
    
    orderData = {
        'order_num' : order_num,
        'employee_id' : current_user_id,
        'total' : orderTotal,
        'tax_chargable' : taxChargable,
        'global_sales_tax_rate' : orderSalesTaxRate,
        'service_charge' : serviceCharge,
        'cashback' : cashback,
        'payment_type' : paymentMethod,
        'amount_tendered' : cashTendered,
        'num_persons' : numPersons,
        'client_name' : totalOrder.client_name,
        'is_table_order' : isTableOrder,
        'table_info_id' : tableInfoId,
        'table_info_label' : tableInfoLabel,
        'discount_percent' : discountPercent,
        'pre_discount_price' : preDiscountPrice,
        'order_details' : totalOrder,
        'terminal_id' : terminalID,
        'void_order_id' : totalOrder.void_order_id,
        'is_split_bill' : isSplitBill,
        'split_payments' : splitPayments
    }
    
    sendOrderToServer(orderData);
    
    //clear the order
    clearOrder(selectedTable);

    //clear the receipt
    $('#till_roll').html('');
    $('#till_roll_discount').html('');
    $('#sales_tax_total').html('');
    
    //set the last sale obj so that we can print receipts from the login screen
    var copiedLastOrder = {};
    lastSaleObj = $.extend(true, copiedLastOrder, totalOrder);

    //pick up the default home screen and load it
    loadAfterSaleScreen();

    //reset for next sale
    resetTendered();
    $('#totals_change_value').html("");
    serviceCharge = 0;
    cashback = 0;
    paymentMethod = null;
    currentCardChargeAmount = 0;
    
    //do we need to clear the previous order from the receipt dropdown selection?
    if(selectedTable == previousOrderTableNum) {
        $('#previous_order_select_item').hide();
    }
    
    //do we need to clear the previous order from the receipt dropdown selection?
    if(selectedTable == tempSplitBillTableNum) {
        $('#split_bill_select_item').hide();
    }
    
    //set the select item to the personal receipt
    tableSelectMenu.setValue(0);
    doSelectTable(0);
    
    totalOrder = null;
    currentTotalFinal = 0;

    //now print the receipt
    if(paymentIntegrationId == zalionPaymentIntegrationId && selectedRoomNumber != null && selectedFolioName != null) {
        //always print
        mandatoryFooterMessageHTML = clearHTML + "<div id='zalion_receipt_info'>";
        
        mandatoryFooterMessageHTML += "<div class='label'>Room Number:</div><div class='data'>" + selectedRoomNumber + "</div>" + clearHTML;
        mandatoryFooterMessageHTML += "<div class='label'>Client Name:</div><div class='data'>" + selectedFolioName + "</div>" + clearHTML;
        
        mandatoryFooterMessageHTML += clear30HTML + "<div class='line'>Signature:</div>" + clearHTML;
        mandatoryFooterMessageHTML += "<div class='line'>___________________________________________</div>" + clearHTML;
            
        mandatoryFooterMessageHTML += "</div>" + clear30HTML;
        
        printReceipt(printReceiptHTML, true);
    } else if(autoPrintReceipt) {
        printReceipt(printReceiptHTML, true);
    }
    
    customFooterId = null;
}

function orderSentToServerCallback(orderData, errorOccured) {
    if(!errorOccured) {
        //was this charged to a room?
        if(paymentIntegrationId == zalionPaymentIntegrationId && selectedRoomNumber != null && selectedFolioNumber != null) {
            orderData['charged_room'] = {
                selected_room_number : selectedRoomNumber,
                selected_folio_number : selectedFolioNumber,
                selected_folio_name : selectedFolioName,
                payment_integration_type_id : paymentIntegrationId
            }
        
            doChargeRoom(orderData);
        }
        
        //first see if its table 0 and send into system orders
        //a null test is to see if table 0
        if(isTableZeroOrder) {
            doSyncTableOrder();
        }
        
        //reload the customers as their points/credit may need updating
        $.getScript('/javascripts/customers.js');
    } else {
        niceAlert("There was an error cashing out the last order, the server could not process it. It will automatically resend itself, please do not cash out on another terminal!");
    }
    
    cashSaleInProcess = false;
}

function loadAfterSaleScreen() {
    hideAllScreens();
    
    if(defaultHomeScreen == LOGIN_SCREEN) {
        //back to login screen
        doLogout();
    } else if(defaultHomeScreen == MENU_SCREEN) {
        showMenuScreen();
    } else if(defaultHomeScreen == TABLES_SCREEN) {
        showTablesScreen();
    } else {
        //back to login screen
        doLogout();
    }
}

function sendOrderToServer(orderData) {
    $.ajax({
        type: 'POST',
        url: '/order',
        error: function() {
            storeOrderForLaterSend(orderData);
            orderSentToServerCallback(orderData, true);
        },
        success: function() {
            orderSentToServerCallback(orderData, false);
        },
        data: {
            order : orderData
        }
    });
}

function storeOrderForLaterSend(orderData) {
    ordersForLaterSend = retrieveOrdersForLaterSend();
    
    //lazy init
    if(ordersForLaterSend == null) {
        ordersForLaterSend = new Array();
    }
    
    ordersForLaterSend.push(orderData);

    saveOrdersForLaterSend(ordersForLaterSend);
}

var sendingOutstandingOrders = false;

function trySendOutstandingOrdersToServer() {
    if(sendingOutstandingOrders) {
        return;
    }
    
    ordersForLaterSend = retrieveOrdersForLaterSend();
    
    if(ordersForLaterSend.length>0) {
        sendOutstandingOrdersToServer(ordersForLaterSend);
    }
}

function sendOutstandingOrdersToServer(outstandingOrdersData) {
    sendingOutstandingOrders = true;
    
    $.ajax({
        type: 'POST',
        url: '/outstanding_orders',
        success: clearOutstandingOrders,
        complete: function() {
            sendingOutstandingOrders = false;
        },
        data: {
            orders : outstandingOrdersData
        }
    });
}

function clearOutstandingOrders() {
    ordersForLaterSend = retrieveOrdersForLaterSend();
    ordersForLaterSend = new Array();
    saveOrdersForLaterSend(ordersForLaterSend);
}

function retrieveOrdersForLaterSend() {
    ordersForLaterSendOBJ = retrieveStorageJSONValue("orders_for_later_send");

    if(ordersForLaterSendOBJ && ordersForLaterSendOBJ.ordersForLaterSend) {
        return ordersForLaterSendOBJ.ordersForLaterSend;
    }

    return new Array();
}

function saveOrdersForLaterSend(ordersForLaterSend) {
    ordersForLaterSendOBJ = {
        'ordersForLaterSend':ordersForLaterSend
    };
    
    storeKeyJSONValue("orders_for_later_send", ordersForLaterSendOBJ);
}

function initOptionButtons() {
    //hide all
    $('#menu_buttons_panel .buttons').hide();
    $('#options_screen_menu_buttons .buttons').hide();
    
    var role_id = serverRoleID(current_user_id);
    $('#menu_screen_buttons_html_for_role_' + role_id).show();
    $('#options_screen_buttons_html_for_role_' + role_id).show();
    
    //assign the permissions array
    display_button_passcode_permissions = all_display_button_permissions[role_id];
}

var currentTargetPopupAnchor = null;
var individualItemDiscount = false;

function showDiscountPopup(receiptItem) {
    currentSelectedReceiptItemEl = receiptItem;
    
    if(currentOrderEmpty()) {
        setStatusMessage("No order present to discount!");
        return;
    }
    
    //make sure both discount popups are closed
    closeDiscountPopup();
    
    //was the discount button hit on the menu panel, or via the edit item popup?
    if(receiptItem) {
        $(receiptItem).addClass("selected");
        $("#apply_discount_to").hide();
        individualItemDiscount = true;
    } else {
        $("#apply_discount_to").show();
        
        //need to set the height to be a bit bigger
        $("#discounts_popup_markup_container").addClass("higher");
        
        individualItemDiscount = false;
    }
    
    currentTargetPopupAnchor = $('#receipt');
    
    if(currentTargetPopupAnchor.HasBubblePopup()) {
        currentTargetPopupAnchor.RemoveBubblePopup();
    }
    
    currentTargetPopupAnchor.CreateBubblePopup();
    
    discountsPopupHTML = $("#discounts_popup_markup").html();
    
    currentTargetPopupAnchor.ShowBubblePopup({
        position: 'right',
        align: 'top',
        tail	 : {
            align: 'middle'
        },
        innerHtml: discountsPopupHTML,
														   
        innerHtmlStyle:{ 
            'text-align':'left'
        },
        
        themeName: 	'all-grey',
        themePath: 	'/images/jquerybubblepopup-theme',
        alwaysVisible: false

    }, false);
    
    currentTargetPopupAnchor.FreezeBubblePopup();
    
    popupId = currentTargetPopupAnchor.GetBubblePopupID();
    
    //fill in the input with either existing or default discount percent
    if(receiptItem) {
        var itemNumber = receiptItem.data("item_number");
        existingDiscountPercent = getExistingDiscountPercentForCurrentOrderItem(itemNumber);
        
        if(existingDiscountPercent) {
            $('#' + popupId).find('#discount_percent_input').val(existingDiscountPercent);
        } else {
            $('#' + popupId).find('#discount_percent_input').val(defaultDiscountPercent);
        }
    } else {
        //fill in the input with default discount percent
        $('#' + popupId).find('#discount_percent_input').val(defaultDiscountPercent);
    }
    
    //focus on the input box
    $('#' + popupId).find('#discount_percent_input').focus();
    
    keypadPosition = $('#' + popupId).find('.discount_popup_keypad_container');
    
    clickFunction = function(val) {
        currentVal = $('#' + popupId).find('#discount_percent_input').val();
        if(currentVal == 0) currentVal = "";
        newVal = currentVal.toString() + val;
        $('#' + popupId).find('#discount_percent_input').val(newVal);
    };
    
    cancelFunction = function() {
        oldVal = $('#' + popupId).find('#discount_percent_input').val();
        newVal = oldVal.substring(0, oldVal.length - 1);
        $('#' + popupId).find('#discount_percent_input').val(newVal);
    };
    
    setUtilKeypad(keypadPosition, clickFunction, cancelFunction);
    
    //register the click handler to hide the popup when outside clicked
    registerPopupClickHandler($('#' + popupId), closeDiscountPopup);
}

function showDiscountPopupFromEditDialog() {
    receiptItem = currentSelectedReceiptItemEl;
    closeEditOrderItem();
    showDiscountPopup(receiptItem);
}

function closeDiscountPopup() {
    if(currentTargetPopupAnchor) {
        hideBubblePopup(currentTargetPopupAnchor);
    }
}

function setDiscountVal(val) {
    popupId = currentTargetPopupAnchor.GetBubblePopupID();
    $('#' + popupId).find('#discount_percent_input').val(val);
}

function saveDiscount() {
    popupId = currentTargetPopupAnchor.GetBubblePopupID();
    selectedValue = $('#' + popupId).find('#discount_percent_input').val();
    
    selectedValue = parseFloat(selectedValue);
    
    if(isNaN(selectedValue)) {
        selectedValue = 0;
    }
    
    if(selectedValue<0 || selectedValue>100) {
        setStatusMessage("You must enter a number between 0 and 100", true, true);
        return;
    }
    
    order = getCurrentOrder();
    
    wholeOrderDiscount = ($("input[name='discount_type']:checked").val() == 'whole_order');
    
    //discount on whole order or individual item?
    if(individualItemDiscount) {
        //fetch the item number
        var itemNumber = currentSelectedReceiptItemEl.data("item_number");
        applyDiscountToOrderItem(order, itemNumber, selectedValue);
    } else if(wholeOrderDiscount) {
        addDiscountToOrder(order, selectedValue);
    } else {
        //last item
        applyDiscountToOrderItem(order, -1, selectedValue);
    }
    
    //store the modified order
    if(selectedTable != 0) {
        storeTableOrderInStorage(current_user_id, selectedTable, order);
    }else {
        storeOrderInStorage(current_user_id, order);
    }
    
    closeDiscountPopup();
    
    //redraw the receipt
    loadReceipt(order, true);
    setTimeout(menuRecptScroll, 20);
}

var currentCoursePopupAnchor = null;

function showCoursePopupFromEditDialog() {
    receiptItem = currentSelectedReceiptItemEl;
    
    currentCoursePopupAnchor = $('#receipt');
    
    if(currentCoursePopupAnchor.HasBubblePopup()) {
        currentCoursePopupAnchor.RemoveBubblePopup();
    }
    
    currentCoursePopupAnchor.CreateBubblePopup();
    
    coursePopupHTML = $("#course_popup_markup").html();
    
    currentCoursePopupAnchor.ShowBubblePopup({
        position: 'right',
        align: 'top',
        tail	 : {
            align: 'middle'
        },
        innerHtml: coursePopupHTML,
														   
        innerHtmlStyle:{ 
            'text-align':'left'
        },
        
        themeName: 	'all-grey',
        themePath: 	'/images/jquerybubblepopup-theme',
        alwaysVisible: false

    }, false);
    
    currentCoursePopupAnchor.FreezeBubblePopup();
    
    var coursePopupId = currentCoursePopupAnchor.GetBubblePopupID();
    
    var current_course_num = receiptItem.find(".name").data("course_num");
   
    //show the selected course
    var selectedCourseEl = $('#' + coursePopupId).find('.course_label_' + current_course_num);
        
    selectedCourseEl.html(selectedCourseEl.html() + " *");
   
    registerPopupClickHandler($('#' + coursePopupId), closeCoursePopup);
}

function closeCoursePopup() {
    if(currentCoursePopupAnchor) {
        hideBubblePopup(currentCoursePopupAnchor);
    }
}

function applyCourseFromPopup(courseVal) {
    closeCoursePopup();
    
    var itemNumber = currentSelectedReceiptItemEl.data("item_number");
    order = getCurrentOrder();
    
    var item = order.items[itemNumber - 1];
    
    newCourseNum = courseVal
    
    //mark that we should show the course label for this item
    item.show_course_label = true;
    
    if(selectedTable != 0) {
        modifyOrderItem(order, itemNumber, item.amount, item.product_price, newCourseNum, item.is_void);
        storeTableOrderInStorage(current_user_id, selectedTable, order);
    } else {
        modifyOrderItem(order, itemNumber, item.amount, item.product_price, newCourseNum, item.is_void);
        storeOrderInStorage(current_user_id, order);
    }
    
    order = getCurrentOrder();
    
    //redraw the receipt
    loadReceipt(order, true);
}

function voidOrderItemFromEditDialog() {
    if(selectedTable == 0) {
        niceAlert("You cannot void items that are not on a table");
        return;
    }
    
    var itemNumber = currentSelectedReceiptItemEl.data("item_number");
    order = getCurrentOrder();
    
    var item = order.items[itemNumber - 1];
    
    if(!item.synced) {
        niceAlert("You can only void ordered items, you can delete this item");
        return;
    }
    
    var makeVoid = false;
    
    if(!item.is_void) {
        makeVoid = true;
    }
    
    //unsync the item so it gets sent to other terminals
    item.synced = false;
    
    modifyOrderItem(order, itemNumber, item.amount, item.product_price, item.product.course_num, makeVoid);
    storeTableOrderInStorage(current_user_id, selectedTable, order);
    
    order = getCurrentOrder();
    
    //redraw the receipt
    loadReceipt(order, true);
    closeEditOrderItem();
}

function voidAllOrderItems() {
    if(selectedTable == 0) {
        niceAlert("You cannot void items that are not on a table");
        return;
    }
    
    order = getCurrentOrder();
    
    for(var i=0; i<order.items.length; i++) {
        var item = order.items[i];
        item.is_void = true;
        modifyOrderItem(order, i+1, item.amount, item.product_price, item.product.course_num, item.is_void);
    }
    
    storeTableOrderInStorage(current_user_id, selectedTable, order);
    
    order = getCurrentOrder();
    
    //redraw the receipt
    loadReceipt(order, true);
    
    quickSale();
}

function addDiscountToOrder(order, amount) {
    order['discount_percent'] = amount;
    
    calculateOrderTotal(order);
}

function getExistingDiscountPercentForCurrentOrderItem(itemNumber) {
    order = getCurrentOrder();
    
    orderItem = order.items[itemNumber-1];
    
    existingDiscount = orderItem['discount_percent'];
    
    return existingDiscount;
}

function orderItemAdditionTabSelected(oiagId) {
    if(!oiagId) {
        oiagId = $('#oia_tabs .oia_tab').first().data("oiag_id");
    }
    
    clearSelectedOIATabs();
    $('#add_note').hide();
    resetKeyboard();
    
    $('#oia_tab_' + oiagId).addClass("selected");
    $('.oia_container').hide();
    
    modifierGridXSize = $('#oiag_' + oiagId).data("grid_x_size");
    modifierGridYSize = $('#oiag_' + oiagId).data("grid_y_size");
    
    initModifierGrid();
    
    $('#oiag_' + oiagId).show();
    
    setOrderItemAdditionsGridState();
}

function clearSelectedOIATabs() {
    $('#oia_tabs .tab').removeClass("selected");
}

function doOpenOIANoteScreen() {
    clearSelectedOIATabs();
    $('.oia_container').hide();
    
    $('#oia_tab_note').addClass("selected");
    
    $('.button[id=sales_button_' + addNoteButtonID + ']').addClass("selected");
    
    $('#oia_container').hide();
    $('#add_note').show();
    $('#note_input').focus();
    noteChargeIsPlus = true;
    
    clearNoteInputs();
    initNoteScreenKeyboard();
}

function doSaveNote() {
    var charge = $('#charge_input').val();
    
    if(isNaN(charge)) {
        setStatusMessage("Please enter a number for charge!");
        return false;
    }
    
    var noteInput = $('#note_input').val();
    
    noteInput = $.trim(noteInput);
    
    //exit if no charge and no note entered
    if(noteInput.length == 0 && charge ==0) {
        doCancelNote();
        return true;
    }
    
    if(noteInput.length == 0) {
        setStatusMessage("Please enter some text for this note!");
        return false;
    }
    
    currentSelectedReceiptItemEl = getSelectedOrLastReceiptItem();
    
    if(!currentSelectedReceiptItemEl) {
        setStatusMessage("There are no receipt items!");
        return false;
    }
    
    var order = getCurrentOrder();
    
    var itemNumber = currentSelectedReceiptItemEl.data("item_number");
    
    var orderItem = order.items[itemNumber-1];
    
    //get the oia data
    var desc = noteInput;
    var absCharge = charge;
    
    addOIAToOrderItem(order, orderItem, desc, absCharge, 0, 0, noteChargeIsPlus, true, false, false, -1, -1);
    
    clearNoteInputs();
    
    return true;
}

function doCancelNote() {
    clearNoteInputs();
    toggleModifyOrderItemScreen();
}

function clearNoteInputs() {
    $('#charge_input').val("0");
    $('#note_input').val("");
}

var noteChargeIsPlus = true;

function toggelNoteChargePlusMins() {
    noteChargeIsPlus = !noteChargeIsPlus;
    $('#plus_minus_text_container').html((noteChargeIsPlus ? "+" : "-"));
    
}

function renderMenuItemButtonDimensions() {
    var button_border = 1;
    var button_margin = 1;
    var original_width = 88;
    
    $('#items .item').each(function() {
        var item = $(this);
        var width_factor = item.data("button_width");
        
        item.width((original_width * width_factor) 
            + (button_margin * 2 * (width_factor - 1)) 
            + (button_border * 2 * (width_factor - 1)));
    });
    
    $('#items .menu_item_spacer').each(function() {
        var item = $(this);
        var width_factor = 1;
        
        item.width((original_width * width_factor) 
            + (button_margin * 2 * (width_factor - 1)) 
            + (button_border * 2 * (width_factor - 1)));
    });
}

//mark tables in the list as active
function renderActiveTables() {
    var activeTableIDS = getActiveTableIDS();
    
    $("#table_select").children('li').children('ul').children('li').each( 
        function(id, element) {
            if(typeof($(element).attr('rel')) != 'undefined') {
                nextTableID = $(element).attr('rel').toString();
                
                if($.inArray(nextTableID, activeTableIDS) != -1) {
            
                    $(element).addClass("active");
            
                    //mark the tables screen also
                    $('#table_label_' + nextTableID).addClass("active");
                } else {
            
                    $(element).removeClass("active");
                    $('#table_label_' + nextTableID).removeClass("active");
                }
            }
        });  
}

var afterSplitBillSyncCallback;

function postDoSyncTableOrder() {
    if(isTableZeroOrder) {
        //reset this var
        isTableZeroOrder = false;
        return;
    }
    
    clearLoginReceipt();

    //redraw the receipt if we dont leave this screen
    //so that the highlighted items are no longer highlighted
    doSelectTable(selectedTable);
    
    //clean up after transfer order mode
    if(inTransferOrderMode) {
        hideNiceAlert();
        setStatusMessage("Order Transfered.");
        $('#tables_screen_status_message').hide();
        inTransferOrderMode = false;
        tableScreenSelectTable(selectedTable);
        showMenuScreen();
        return;
    } else if(inTransferOrderItemMode) {
        finishTransferOrderItem();
        return;
    } else if(inSplitBillMode) {
        inSplitBillMode = false;
        showMenuScreen();
        $('#split_bill_select_item').show();
        tableSelectMenu.setValue(tempSplitBillTableNum);
        doSelectTable(tempSplitBillTableNum);
        
        if(afterSplitBillSyncCallback) {
            afterSplitBillSyncCallback();
        }
        
        return;
    }
    
    if(!doAutoLoginAfterSync) {
        //pick up the default home screen and load it
        loadAfterSaleScreen();
    }
    
    doAutoLoginAfterSync = false;
        
    setStatusMessage("Order Sent");

    setLoginReceipt("Last Order", "Loading Order...");
    finishDoSyncTableOrder();
}

function finishDoSyncTableOrder() {
    orderReceiptHTML = fetchOrderReceiptHTML(lastSyncedOrder);
    setLoginReceipt("Last Order", orderReceiptHTML);
    loginRecptUpdate();
}

function toggleModifyOrderItemScreen() {
    if(currentMenuSubscreenIsMenu()) {
        $('.button[id=sales_button_' + modifyOrderItemButtonID + ']').addClass("selected");
        showModifyOrderItemScreen();
    } else {
        resetKeyboard();
        $('.button[id=sales_button_' + addNoteButtonID + ']').removeClass("selected");
        $('.button[id=sales_button_' + modifyOrderItemButtonID + ']').removeClass("selected");
        switchToMenuItemsSubscreen();
    }
}

function showModifyOrderItemScreen() {
    switchToModifyOrderItemSubscreen();
}

function switchToMenuItemsSubscreen() {
    if(currentScreenIsMenu()) {
        showMenuItemsSubscreen();
    }
}

function showMenuItemsSubscreen() {
    toggleKeyboardEnable = true;
    hideAllMenuSubScreens();
    $('#menu_container').show();
}

function switchToModifyOrderItemSubscreen() {
    if(currentScreenIsMenu()) {
        $('#add_note').hide();
        resetKeyboard();
        hideAllMenuSubScreens();
        
        $('.button[id=sales_button_' + modifyOrderItemButtonID + ']').addClass("selected");
        $('#order_item_additions').show();
        $('#order_item_additions #add_note').hide();
        
        orderItemAdditionTabSelected(currentModifierGridIdForProduct);
    }
}

function postDoSelectTable() {
//does nothing for now, but the medium interface needed this callback
}

function doReceiveOrderReady(employee_id, terminal_id, table_id, order_num, table_label) {
    if(inKitchenContext()) {
        return;
    }
    
    hidePreviousOrderReadyPopup();
    
    if(terminal_id == terminalID) {
        //        ModalPopups.Confirm('niceAlertContainer',
        //            'Order Ready!', "<div id='nice_alert'>Order for table " + table_label + " is ready</div>",
        //            {
        //                yesButtonText: 'OK',
        //                noButtonText: 'Cancel',
        //                onYes: 'orderReadyOKClicked()',
        //                onNo: 'orderReadyCancelClicked()',
        //                width: 400,
        //                height: 250
        //            } );

        var orderReadyText;

        if(table_id.toString() == "0") {
            orderReadyText = "Order #" + order_num;
        } else {
            orderReadyText = "Order #" + order_num + " for table " + table_label;
        }

        ModalPopups.Alert('niceAlertContainer',
            'Order Ready!', "<div id='nice_alert'>" + orderReadyText + " is ready</div>",
            {
                okButtonText: 'OK',
                onOk: 'orderReadyOKClicked()',
                width: 400,
                height: 250
            } );
    }
}

function orderReadyOKClicked() {
    hideOrderReadyPopup();
    
    //ajax to say accepted
    console.log("Order accepted!!");
}

function orderReadyCancelClicked() {
    hideOrderReadyPopup();
    
    //ajax to say rejected
    console.log("Order rejected!!");
}

function hidePreviousOrderReadyPopup() {
    hideOrderReadyPopup();
}

function hideOrderReadyPopup() {
    try {
        ModalPopups.Close('niceAlertContainer');
    } catch (e) {
        
    }
}

var currentSplitBillItemQuantity = "";
    
function splitBillScreenKeypadClick(val) {
    if(val == '0') {
        if(currentSplitBillItemQuantity.length > 0)
            currentSplitBillItemQuantity += val
    } else {
        //make sure you cannot enter a 2nd decimal place number
        if(currentSplitBillItemQuantity.indexOf(".") != -1) {
            if(currentSplitBillItemQuantity.length - currentSplitBillItemQuantity.indexOf(".") > 1) {
                return;
            }
        }
    
        currentSplitBillItemQuantity += val;
    }
    
    $('#split_bill_input_show').html(currentSplitBillItemQuantity);
}

function splitBillScreenKeypadClickDecimal() {
    if(currentSplitBillItemQuantity.indexOf(".") == -1) {
        currentSplitBillItemQuantity += ".";
    }
    
    $('#split_bill_input_show').html(currentSplitBillItemQuantity);
}

function splitBillScreenKeypadClickCancel() {
    currentSplitBillItemQuantity = "";
    $('#split_bill_input_show').html(currentSplitBillItemQuantity);
}

function loadSplitBillReceipts() {
    //ORDER FROM
    var orderFromReceiptHTML = getAllOrderItemsReceiptHTML(splitBillOrderFrom, false, false, true);
    $('#split_bill_from_till_roll').html(orderFromReceiptHTML);
    
    $('#split_bill_from_till_roll .order_line').each(function() {
        var orderLine = $(this);
        
        orderLine.click(function() {
            doSplitOrderItem($(this), false); 
        });
    });
    
    var tillRollDiscountHTML = getTillRollDiscountHTML(splitBillOrderFrom);
    $('#split_bill_from_till_roll_discount').html(tillRollDiscountHTML);
    
    calculateOrderTotal(splitBillOrderFrom);
    $('#split_bill_from_total_value').html(currency(splitBillOrderFrom.total));
    
    //ORDER TO
    var orderToReceiptHTML = getAllOrderItemsReceiptHTML(splitBillOrderTo, false, false, true);
    $('#split_bill_to_till_roll').html(orderToReceiptHTML);
    
    $('#split_bill_to_till_roll .order_line').each(function() {
        var orderLine = $(this);
        
        orderLine.click(function() {
            doSplitOrderItem($(this), true); 
        });
    });
    
    calculateOrderTotal(splitBillOrderTo);
    $('#split_bill_to_total_value').html(currency(splitBillOrderTo.total));
}

function doSplitOrderItem(orderLine, reverse) {
    var orderFrom = splitBillOrderFrom;
    var orderTo = splitBillOrderTo;
    
    if(reverse) {
        orderFrom = splitBillOrderTo;
        orderTo = splitBillOrderFrom;
    }
    
    var itemNumber = parseInt(orderLine.data("item_number"));
    
    var theItem = orderFrom.items[itemNumber - 1];
    
    if(currentSplitBillItemQuantity == "") {
        currentSplitBillItemQuantity = "1";
    }

    if(currentSplitBillItemQuantity.indexOf(".") != -1) {
        if(currentSplitBillItemQuantity.length - currentSplitBillItemQuantity.indexOf(".") == 1) {
            currentSplitBillItemQuantity = "1";
        }
    }
    
    //take it from the order
    if(theItem.amount - currentSplitBillItemQuantity > 0) {
        modifyOrderItem(orderFrom, itemNumber, theItem.amount - currentSplitBillItemQuantity, theItem.product_price, theItem.product.course_num, theItem.is_void);
    } else {
        //we are removing an item, so make sure that it is not the last one on the original order
        if(!reverse && orderFrom.items.length == 1) {
            niceAlert("You cannot remove the last item from the original order!");
            return;
        }
        
        currentSplitBillItemQuantity = theItem.amount;
        doRemoveOrderItem(orderFrom, itemNumber);
    }
    
    var copiedOrderItem = {};
    
    var theCopiedOrderItem = $.extend(true, copiedOrderItem, theItem);
    
    theCopiedOrderItem.itemNumber = orderTo.items.length + 1;
    
    //add this item to the order array
    orderTo.items.push(theCopiedOrderItem);
    
    modifyOrderItem(orderTo, theCopiedOrderItem.itemNumber, currentSplitBillItemQuantity, theCopiedOrderItem.product_price, theCopiedOrderItem.product.course_num, theCopiedOrderItem.is_void);
    
    loadSplitBillReceipts();
    
    currentSplitBillItemQuantity = "";
    $('#split_bill_input_show').html("");
}

function cancelSplitBillMode() {
    splitBillOrderTo = null;
    inSplitBillMode = false;
    showMenuScreen();
}

function splitBillShortcutPrintBill() {
    if(!splitBillEmptyItems()) {
        finishSplitBillMode();
        afterSplitBillSyncCallback = printBill;
    }
}

function splitBillShortcutPayNow() {
    if(!splitBillEmptyItems()) {
        finishSplitBillMode();
        afterSplitBillSyncCallback = doTotal;
    }
}

function splitBillShortcutTransfer() {
    if(!splitBillEmptyItems()) {
        finishSplitBillMode();
        afterSplitBillSyncCallback = startTransferOrderMode;
    }
}

function splitBillEmptyItems() {
    if(splitBillOrderTo.items.length == 0) {
        niceAlert("Please transfer over some items first.");
        return true;
    }
    
    return false;
}

function finishSplitBillMode() {
    //store it and then populate tableOrders
    //then we can access it at tableOrders[tempSplitBillTableNum]
    storeTableOrderInStorage(current_user_id, tempSplitBillTableNum, splitBillOrderTo);    
    getTableOrderFromStorage(current_user_id, tempSplitBillTableNum);
    
    //save the orderFrom
    storeTableOrderInStorage(current_user_id, splitBillTableNumber, splitBillOrderFrom);
    
    doAutoLoginAfterSync = true;
    doSelectTable(splitBillTableNumber);
    doSyncTableOrder();    
}

var productInfoPopupEl;
var productInfoPopupAnchor;
var currentProductInfoPopupProductId;

function popupProductInfo(productId) {
    currentProductInfoPopupProductId = productId;
    
    var popupHTML = $("#product_info_popup_markup").html();
        
    productInfoPopupAnchor = $('#receipt');
    
    if(productInfoPopupAnchor.HasBubblePopup()) {
        productInfoPopupAnchor.RemoveBubblePopup();
    }
    
    productInfoPopupAnchor.CreateBubblePopup();
    
    productInfoPopupAnchor.ShowBubblePopup({
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
    
    productInfoPopupAnchor.FreezeBubblePopup();
         
    var popupId = productInfoPopupAnchor.GetBubblePopupID();
    
    productInfoPopupEl = $('#' + popupId);
    
    var product = products[productId];
    
    //product image
    var productImageURL = product.img_url;
    
    //must prepend the image with the images directory path if it is not a paperclip image
    if(!productImageURL.startsWith("/system/")) {
        productImageURL = "/images/" + productImageURL;
    }
    
    productInfoPopupEl.find('#product_image').html("<img src=\"" + productImageURL + "\"/>");
    
    //product name
    var productName = product.name;
    productInfoPopupEl.find('#product_name').html(productName);
    
    //product price
    var productPrice = product.price;    
    productInfoPopupEl.find('#product_price').html(currency(productPrice));
    
    //product description
    var productDescription = product.description;    
    productInfoPopupEl.find('#description').html(productDescription);
}

function closeProductInfoPopup() {
    if(productInfoPopupEl) {
        hideBubblePopup(productInfoPopupAnchor);
    }
}

function productInfoAddItemToOrder() {
    setProductInfoPopup(false);
    doSelectMenuItem(currentProductInfoPopupProductId, null, null);
    setProductInfoPopup(true);
    closeProductInfoPopup();
}

function clearMenuScreenInput() {
    currentMenuItemQuantity = "";
    $('#menu_screen_input_show').html("");
}

function performCustomerScreenCSSMods() {
    //resize menu items
        $('#items .item').height(133);
        $('#items .item').width(176);
        $('#items .item').css("margin", "3px");
        $('#items .item .item_pic').height(116);
        $('#items .item .item_pic img').height(90);
        $('#items .item .item_pic img').css("max-height", "90px");
        $('#items .item .item_pic img').css("max-width", "172px");
        $('#items .item .item_pic img').css("margin-top", "5px");
        
        $('#items .menu_item_spacer').height(135);
        $('#items .menu_item_spacer').width(178);
        $('#items .menu_item_spacer').css("margin", "3px");
        
        $('#items .item .item_name').css("width", "172px");
        $('#items .item .item_name').css("font-size", "16px");
        $('#items .item .item_name').css("bottom", "7px");
        
        $('div#menu_screen div#menu_pages_container div#menu_container').height(631);
        $('div#menu_screen div#menu_items_container').height(563);
        $('div#menu_screen div#order_item_additions').height(631);
        $('div#menu_screen div#order_item_additions div.oia_container').height(558);
        $('div#menu_screen div#menu_buttons').height(79);
        
        //hide the table select box
        $('#table_screen_button, #table_select_container').hide();
        
        $('#box_label_container').show();
        
        //hide the shortcut dropdown
        $('#menu_screen_shortcut_dropdown_container').hide();
}