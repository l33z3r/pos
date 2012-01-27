var current_table_label = null;

var menuKeypadShowing = false;

var roomSelectMenu = null;
var menuSelectMenu = null;

function initMenu() {
    //click the 1st menu page
    $('#menu_pages_container .page').first().click();

    currentMenuPage = 1;
    currentMenuSubPageId = null;
    currentOrder = new Array();

    $('#table_num_holder').html("Select Table");
    showTablesSubscreen();

    initModifierGrid();
}

//we don't use this function in the medium interface but it needs to be coded
function doDisplayButtonPasscodePrompt(button_id, forwardFunction) {

    forwardFunction.call();
}

function checkMenuScreenForFunction() {
    swipeToMenu();
    return true;
}



function renderActiveTables() {
    activeTableIDS = getActiveTableIDS();

//TODO: something with the active table ids
}

function menuScreenKeypadClick(val) {
    if(this.innerHTML == '0') {
        if(currentMenuItemQuantity.length > 0)
            currentMenuItemQuantity += val
    } else {
        //make sure you cannot enter a 2nd decimal place number
        if(currentMenuItemQuantity.indexOf(".") != -1) {
            if(currentMenuItemQuantity.length - currentMenuItemQuantity.indexOf(".") > 1) {
                return false;
            }
        }

        currentMenuItemQuantity += val;
    }

    return false;
}

function menuScreenKeypadClickDecimal() {
    if(currentMenuItemQuantity.indexOf(".") == -1) {
        currentMenuItemQuantity += ".";
    }

    return false;
}

function menuScreenKeypadClickCancel() {
    currentMenuItemQuantity = "";
    hideMenuKeypad();

    return false;
}

function doMenuPageSelect(pageNum, pageId) {
    //set this pages class to make it look selected
    $('#menu_pages_container .page').removeClass('selected');
    $('#menu_pages_container .page[data-page_num=' + pageNum + ']').addClass('selected');

    $('#menu_items_container .items').hide();
    $('#menu_items_' + pageNum).show();

    //wake up the scrollers
    if(isTouchDevice()) {
        kickMenuScrollers();
    }

    //show the subpages if there are any
    $('#menu_items_' + pageNum + ' div.subpages div.subpage').show();
    $('.embedded_pages_' + pageNum + ' .subitems').hide();

    currentMenuPage = pageNum;
    currentMenuPageId = pageId;
}

function doSubMenuPageSelect(parentPageNum, pageId) {
    //hide the subpage headers
    $('#menu_items_' + parentPageNum + ' div.subpages div.subpage').hide();

    //show the subpages
    $('#sub_menu_items_' + pageId).show();

    currentMenuPage = parentPageNum;
    currentMenuPageId = pageId;
    currentMenuSubPageId = pageId;
}

function doSelectMenuItem(productId, element) {
    if(!ensureLoggedIn()) {
        return;
    }

    //fetch this product from the products js array
    product = products[productId];

    //if double and no price set
    if(menuItemDoubleMode && (product.double_price == 0)) {
        niceAlert("Price has not been set for a double of this item.");
        setMenuItemDoubleMode(false);
        return;
    }

    if(currentMenuItemQuantity == "")
        currentMenuItemQuantity = "1";

    if(currentMenuItemQuantity.indexOf(".") != -1) {
        if(currentMenuItemQuantity.length - currentMenuItemQuantity.indexOf(".") == 1) {
            currentMenuItemQuantity = "1";
        }
    }

    currentSelectedMenuItemElement = element;

    closeEditOrderItem();

    amount = currentMenuItemQuantity;

    //reset the quantity
    currentMenuItemQuantity = "";
    
    buildOrderItem(product, amount);
    setModifierGridIdForProduct(product);

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

    //add a line to the receipt
    writeOrderItemToReceipt(orderItem);
    writeTotalToReceipt(currentOrder, currentOrder['total']);

    menuRecptScroll();

    testForMandatoryModifier(orderItem.product);
    currentSelectedReceiptItemEl = getLastReceiptItem();
}

function tableSelectMenuItem(orderItem) {
    addItemToTableOrderAndSave(orderItem);
    menuRecptScroll();

    testForMandatoryModifier(orderItem.product);
    currentSelectedReceiptItemEl = getLastReceiptItem();
}

function closeEditOrderItem() {
    console.log("CloseEditOrderItem in medium interface called!");

    if(currentSelectedReceiptItemEl) {
        currentSelectedReceiptItemEl.removeClass("selected");

        currentSelectedReceiptItemEl = null;
    }
}

function doSelectReceiptItem(orderItemEl) {

    orderItemEl = $(orderItemEl);

    //close any open popup
//    closeEditOrderItem();

    //make sure the modifier grids are closed
    switchToMenuItemsSubscreen();

    //save the currently opened dialog
    currentSelectedReceiptItemEl = orderItemEl;

    //fetch the selected product and set its default oia grid
    var selectedProduct = products[getCurrentOrder().items[parseInt(orderItemEl.data("item_number"))-1].product.id];
    setModifierGridIdForProduct(selectedProduct);

    //keep the border
    orderItemEl.addClass("selected");



    newMenuPagePopup(getCurrentOrder().items[parseInt(orderItemEl.data("item_number"))-1].product.name);

    currentPrice = orderItemEl.children('.total').data("per_unit_price");
    currentPrice = currency(currentPrice, false);
    $('.price').val(currentPrice);

    currentQuantity = orderItemEl.children('.amount').html();
    $('.quantity').val(currentQuantity);

    $('.quantity').focus();

//    getCurrentOrder().items[parseInt(orderItemEl.data("item_number"))-1] = null;

    setOrderItemAdditionsGridState();

}

function editOrderItemIncreaseQuantity() {
//    popupId = editItemPopupAnchor.GetBubblePopupID();

    targetInputEl = $('.quantity');

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

    targetInputEl = $('.quantity');

    currentVal = parseFloat(targetInputEl.val());

    var newQuantity = currentVal;

    if(isNaN(currentVal)) {
        newQuantity = 1;
    } else if(currentVal > 1) {
        newQuantity = currentVal - 1;
    }

    targetInputEl.val(newQuantity);
}

function setDiscountVal(val) {
    targetInputPer = $('#discount_percent_input');
    targetInputPer.val(val);
}

function saveEditOrderItem() {
    //fetch the item number
    itemNumber = currentSelectedReceiptItemEl.data("item_number");

//    popupId = editItemPopupAnchor.GetBubblePopupID();



    //fetch the order from the order array and modify it
    //then modify the html in the receipt
    targetInputQuantityEl = $('.quantity');
    newQuantity = parseFloat(targetInputQuantityEl.val());

    if(isNaN(newQuantity) || newQuantity == 0) {
        newQuantity = 1;
    }
    targetInputPricePerUnitEl = $('.price');
    newPricePerUnit = parseFloat(targetInputPricePerUnitEl.val());

    if(isNaN(newPricePerUnit)) {
        newPricePerUnit = 0;
    }

    if(selectedTable != 0) {
        order = tableOrders[selectedTable];
        order = modifyOrderItem(order, itemNumber, newQuantity, newPricePerUnit);

        storeTableOrderInStorage(current_user_id, selectedTable, order);
    } else {
        order = currentOrder;
        order = modifyOrderItem(order, itemNumber, newQuantity, newPricePerUnit);

        storeOrderInStorage(current_user_id, order);
    }

    targetInputEl = $('.quantity');

    currentVal = parseFloat(targetInputEl.val());

    var newQuantity = currentVal;

    if(isNaN(currentVal)) {
        newQuantity = 1;
    } else {
        newQuantity = currentVal + 1;
    }

    targetInputEl.val(newQuantity);

    //redraw the receipt
    loadReceipt(order, true);
    ModalPopups.Close('niceAlertContainer');
}

function newMenuPagePopup(pName) {
    var popupContent = $('#receipt_function_popup_content').html();
     $('#niceAlertContainer_okButton').hide();
    ModalPopups.Alert('niceAlertContainer',
        'Receipt Functions - ' + pName, popupContent,
        {
            okButtonText: 'Ok',
            onOk: 'saveEditOrderItem()',
            noButtonText: 'Cancel',
            onNo: 'hideNiceAlert()',
            width: 300,
            height: 450
        } );
}

function writeOrderItemToReceipt(orderItem) {
    setReceiptsHTML(getCurrentRecptHTML() + getOrderItemReceiptHTML(orderItem));
}

function getAllOrderItemsReceiptHTML(order, includeNonSyncedStyling, includeOnClick, includeServerAddedText) {
    allOrderItemsReceiptHTML = "";

    for(var i=0; i<order.items.length; i++) {
        item = order.items[i];
        allOrderItemsReceiptHTML += getOrderItemReceiptHTML(order.items[i], includeNonSyncedStyling, includeOnClick, includeServerAddedText);
    }

    return allOrderItemsReceiptHTML;
}

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

    orderHTML = "<div class='order_line " + notSyncedClass + " " + hideOnPrintedReceiptClass + " " + courseLineClass + "' data-item_number='" + orderItem.itemNumber + "' " + onclickMarkup + ">";

    if(includeServerAddedText && orderItem.showServerAddedText) {
        var nickname = serverNickname(orderItem.serving_employee_id);
        var timeAdded = utilFormatTime(new Date(parseInt(orderItem.time_added)));
        orderHTML += "<div class='server'>At " + timeAdded + " " + nickname + " added:</div>";
    }

    orderHTML += "<div class='amount'>" + orderItem.amount + "</div>";

    orderHTML += "<div class='name'>" + notSyncedMarker + " ";

    if(orderItem.is_double) {
        orderHTML += "Double ";
    }

    orderHTML += orderItem.product.name + "</div>";

    orderItemTotalPriceText = number_to_currency(itemPriceWithoutModifier, {
        precision : 2
    });
    orderHTML += "<div class='total' data-per_unit_price='" + orderItem.product_price + "'>" + (orderItem.product.show_price_on_receipt ? orderItemTotalPriceText : "") + "</div>";
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

            if(!orderItem.oia_items[j].is_note) {
                orderHTML += "<div class='oia_add'>";

                if(orderItem.oia_items[j].is_addable) {
                    orderHTML += oia_is_add ? "Add" : "No";
                } else {
                    orderHTML += "&nbsp;";
                }

                orderHTML += "</div>";
            }

            orderHTML += "<div class='oia_name " + (orderItem.oia_items[j].is_note ? "note" : "") + "'>" + orderItem.oia_items[j].description + "</div>";

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
            orderHTML += "<div class='discount'><div class='header'>Discounted</div>";
            orderHTML += "<div class='discount_amount'>" + orderItem.discount_percent + "% from </div>";
            orderHTML += "<div class='new_price'>" + formattedPreDiscountedPrice + "</div></div>";
        }
    }

    orderHTML += clearHTML + "</div>" + clearHTML;

    $('#cash_screen_sub_total_value').html(currency(orderTotal));

    if($('#menu_screen').is(":visible")){
          $('.oia_price').hide();

    }

    return orderHTML;
}

function menuRecptScroll() {
    recptScroll("menu_screen_");
    recptScroll("large_menu_screen_");
}



function loadReceipt(order, doScroll) {
    clearReceipt();

    if(order == null){
        return;
    }

    orderTotal = order.total;
    orderItems = order.items;

    allOrderItemsRecptHTML = getAllOrderItemsReceiptHTML(order);

    setReceiptsHTML(getCurrentRecptHTML() + allOrderItemsRecptHTML)

    if(orderTotal != null) {
        writeTotalToReceipt(order, orderTotal);
    }

    if(doScroll) {
        menuRecptScroll();
    }

    //we need to copy over the selected item as there is new markup
    if(currentSelectedReceiptItemEl) {
        var selectedReceiptItemNumber = currentSelectedReceiptItemEl.data("item_number");
        currentSelectedReceiptItemEl = $('#menu_screen_till_roll div[data-item_number=' + selectedReceiptItemNumber + ']');
    }
}

function clearReceipt() {
    setReceiptsHTML("");
}

function postDoSyncTableOrder() {
    //redraw the receipt if we dont leave this screen
    //so that the highlighted items are no longer highlighted
    doSelectTable(selectedTable);

    //clean up after transfer order mode
    if(inTransferOrderMode) {
        niceAlert("Order Transfered.");
        inTransferOrderMode = false;
        $('#table_num').val(tables[selectedTable].label);
        doSubmitTableNumber();
        return;
    }

    setStatusMessage("Order Sent");

    //vibrate!
    vibrate();

    showTablesSubscreen();
}

function showModifyOrderItemScreen() {
    switchToModifyOrderItemSubscreen();
}

function switchToMenuItemsSubscreen() {
    if(currentScreenIsMenu) {
        showMenuItemsSubscreen();
    }
}

function showMenuItemsSubscreen() {
    hideAllMenuSubScreens();
    $('#menu_screen #buttons_container').show();
    $('#menu_screen #cluey_logo').hide();
    $('#menu_container').show();

    //reselect the current menu page as there is a bug in the scrollers
    setTimeout(function() {
        doMenuPageSelect(currentMenuPage, currentMenuPageId);
    }, 500);
}

function switchToModifyOrderItemSubscreen() {
    if(currentScreenIsMenu) {
        hideAllMenuSubScreens();
        $('.button[id=sales_button_' + modifyOrderItemButtonID + ']').addClass("selected");
        $('#oia_subscreen').show();
        orderItemAdditionTabSelected(currentModifierGridIdForProduct);

        //must init the scroller only when screen becomes active
        var oiaScrollerOpts = {
            elastic: false,
            momentum: false
        };

        $('#oia_tabs').touchScroll(oiaScrollerOpts);
    }
}

function showTablesSubscreen() {
    hideAllMenuSubScreens();

    //blank the function buttons
    $('#menu_screen #buttons_container').hide();
    $('#menu_screen #cluey_logo').show();

    $('.button[id=sales_button_' + tablesButtonID + ']').addClass("selected");
    $('#table_screen').show();
}

function tableNumberSelectKeypadClick(val) {
    var newVal = $('#table_num').val().toString() + val;
    $('#table_number_show').html(newVal);
    $('#table_num').val(newVal);
}

function doCanceltableNumberSelectKeypad() {
    oldVal = $('#table_num').val().toString();
    newVal = oldVal.substring(0, oldVal.length - 1);
    $('#table_number_show').html(newVal);
    $('#table_num').val(newVal);
}

function doSubmitTableNumber() {
    if(!ensureLoggedIn()) {
        return;
    }

    var table_label = $('#table_num').val().toString();

    //check table exists
    table_info = getTableForLabel(table_label);

    clearTableNumberEntered();

    if(!table_info) {
        $('#table_number_show').html("No Such Table!");
        return;
    }

    if(inTransferOrderMode) {
        if(transferOrderInProgress) {
            niceAlert("Transfer table order in progress, please wait.");
            return;
        }

        doTransferTable(selectedTable, table_info.id);

        return;
    }

    current_table_label = table_label;

    doSelectTable(table_info.id);

    clearTableNumberEntered();
    showMenuItemsSubscreen();
}

function clearTableNumberEntered() {
    $('#table_num').val("");
    $('#table_number_show').html("");
}

function postDoSelectTable() {
    var theLabel = "Table " + current_table_label;
    $('.button[id=sales_button_' + tablesButtonID + '] .button_name').html(theLabel);
    $('#receipt_screen #header #table_name').html(theLabel);
}

function orderItemAdditionTabSelected(oiagId) {
    if(!oiagId) {
        oiagId = $('#oia_tabs .oia_tab').first().data("oiag_id");
    }

    clearSelectedOIATabs();

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

function writeTotalToReceipt(order, orderTotal) {
    if(!order) return;

    console.log("Write total to receipt NYI!");
}

function tableScreenBack() {
    if(selectedTable == 0) {
        $('#table_number_show').html("Enter a Table!");
        return;
    }
    showMenuItemsSubscreen();
}

function doReceiveOrderReady(employee_id, terminal_id, table_id, table_label) {
    hidePreviousOrderReadyPopup();

    if(employee_id == current_user_id || allDevicesOrderNotification) {
        vibrateConstant();

        //        ModalPopups.Confirm('niceAlertContainer',
        //            'Order Ready!', "<div id='nice_alert'>Order for table <b>" + table_label + "</b> is ready</div>",
        //            {
        //                yesButtonText: 'OK',
        //                noButtonText: 'Cancel',
        //                onYes: 'orderReadyOKClicked()',
        //                onNo: 'orderReadyCancelClicked()',
        //                width: 400,
        //                height: 250
        //            } );

        ModalPopups.Alert('niceAlertContainer',
            'Order Ready!', "<div id='nice_alert'>Order for table <b>" + table_label + "</b> is ready</div>",
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
    stopVibrate();

    //ajax to say accepted
    console.log("Order accepted!!");
}

function orderReadyCancelClicked() {
    hideOrderReadyPopup();
    stopVibrate();

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

function displayDropdownSelected(selectedDisplayId) {
    showSpinner();

    //do ajax request and then reload
    $.ajax({
        type: 'POST',
        url: '/admin/terminals/link_display',
        success: function() {
            window.location.reload();
        },
        data: {
            terminal_id : terminalID,
            display_id : selectedDisplayId
        }
    });

}

