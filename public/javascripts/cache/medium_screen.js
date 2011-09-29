/**
 * Unobtrusive scripting adapter for jQuery
 *
 * Requires jQuery 1.4.3 or later.
 * https://github.com/rails/jquery-ujs
 */

(function($) {
	// Make sure that every Ajax request sends the CSRF token
	function CSRFProtection(xhr) {
		var token = $('meta[name="csrf-token"]').attr('content');
		if (token) xhr.setRequestHeader('X-CSRF-Token', token);
	}
	if ('ajaxPrefilter' in $) $.ajaxPrefilter(function(options, originalOptions, xhr){ CSRFProtection(xhr) });
	else $(document).ajaxSend(function(e, xhr){ CSRFProtection(xhr) });

	// Triggers an event on an element and returns the event result
	function fire(obj, name, data) {
		var event = $.Event(name);
		obj.trigger(event, data);
		return event.result !== false;
	}

	// Submits "remote" forms and links with ajax
	function handleRemote(element) {
		var method, url, data,
			dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

	if (fire(element, 'ajax:before')) {
		if (element.is('form')) {
			method = element.attr('method');
			url = element.attr('action');
			data = element.serializeArray();
			// memoized value from clicked submit button
			var button = element.data('ujs:submit-button');
			if (button) {
				data.push(button);
				element.data('ujs:submit-button', null);
			}
		} else {
			method = element.data('method');
			url = element.attr('href');
			data = null;
		}
			$.ajax({
				url: url, type: method || 'GET', data: data, dataType: dataType,
				// stopping the "ajax:beforeSend" event will cancel the ajax request
				beforeSend: function(xhr, settings) {
					if (settings.dataType === undefined) {
						xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
					}
					return fire(element, 'ajax:beforeSend', [xhr, settings]);
				},
				success: function(data, status, xhr) {
					element.trigger('ajax:success', [data, status, xhr]);
				},
				complete: function(xhr, status) {
					element.trigger('ajax:complete', [xhr, status]);
				},
				error: function(xhr, status, error) {
					element.trigger('ajax:error', [xhr, status, error]);
				}
			});
		}
	}

	// Handles "data-method" on links such as:
	// <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
	function handleMethod(link) {
		var href = link.attr('href'),
			method = link.data('method'),
			csrf_token = $('meta[name=csrf-token]').attr('content'),
			csrf_param = $('meta[name=csrf-param]').attr('content'),
			form = $('<form method="post" action="' + href + '"></form>'),
			metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

		if (csrf_param !== undefined && csrf_token !== undefined) {
			metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
		}

		form.hide().append(metadata_input).appendTo('body');
		form.submit();
	}

	function disableFormElements(form) {
		form.find('input[data-disable-with], button[data-disable-with]').each(function() {
			var element = $(this), method = element.is('button') ? 'html' : 'val';
			element.data('ujs:enable-with', element[method]());
			element[method](element.data('disable-with'));
			element.attr('disabled', 'disabled');
		});
	}

	function enableFormElements(form) {
		form.find('input[data-disable-with]:disabled, button[data-disable-with]:disabled').each(function() {
			var element = $(this), method = element.is('button') ? 'html' : 'val';
			if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
			element.removeAttr('disabled');
		});
	}

	function allowAction(element) {
		var message = element.data('confirm');
		return !message || (fire(element, 'confirm') && confirm(message));
	}

	function requiredValuesMissing(form) {
		var missing = false;
		form.find('input[name][required]').each(function() {
			if (!$(this).val()) missing = true;
		});
		return missing;
	}

	$('a[data-confirm], a[data-method], a[data-remote]').live('click.rails', function(e) {
		var link = $(this);
		if (!allowAction(link)) return false;

		if (link.data('remote') != undefined) {
			handleRemote(link);
			return false;
		} else if (link.data('method')) {
			handleMethod(link);
			return false;
		}
	});

	$('form').live('submit.rails', function(e) {
		var form = $(this), remote = form.data('remote') != undefined;
		if (!allowAction(form)) return false;

		// skip other logic when required values are missing
		if (requiredValuesMissing(form)) return !remote;

		if (remote) {
			handleRemote(form);
			return false;
		} else {
			// slight timeout so that the submit button gets properly serialized
			setTimeout(function(){ disableFormElements(form) }, 13);
		}
	});

	$('form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])').live('click.rails', function() {
		var button = $(this);
		if (!allowAction(button)) return false;
		// register the pressed submit button
		var name = button.attr('name'), data = name ? {name:name, value:button.val()} : null;
		button.closest('form').data('ujs:submit-button', data);
	});

	$('form').live('ajax:beforeSend.rails', function(event) {
		if (this == event.target) disableFormElements($(this));
	});

	$('form').live('ajax:complete.rails', function(event) {
		if (this == event.target) enableFormElements($(this));
	});
})( jQuery );


$(function(){
    doGlobalInit();
});
   
function doGlobalInit() {
    //allow scroll for dev
    if(inDevMode()) {
        $('body').css("overflow", "scroll");
    }
    
    if(isTouchDevice()) {
        initTouch();
    }
    
    initTouchRecpts();
    
    initMenu();
    
    //start calling home
    callHomePoll();
}

function initMenu() {
    //click the 1st menu page
    $('#menu_pages_container .page').first().click();
    
    renderActiveTables();
    
    currentMenuPage = 1;
    currentOrder = new Array();

    loadCurrentOrder();
    
    //temporarily store that we were looking at table 38
    current_user_id = 5;    
    storeLastReceipt(current_user_id, 38);
    
    displayLastReceipt();
}

//we don't use this function in the medium interface but it needs to be coded
function doDisplayButtonPasscodePrompt(button_id, forwardFunction) {
    forwardFunction.call();
}

function renderActiveTables() {
    activeTableIDS = getActiveTableIDS();
    
    //TODO: something with the active table ids
}

function doMenuPageSelect(pageNum, pageId) {
    //set this pages class to make it look selected
    $('#menu_pages_container .page').removeClass('selected');
    $('#menu_page_' + pageId).addClass('selected');

    $('#menu_items_container .items').hide();
    $('#menu_items_' + pageNum).show();
    
    currentMenuPage = pageNum;
}

function doSelectMenuItem(productId, element) {
//    if(currentMenuItemQuantity == "")
//        currentMenuItemQuantity = "1";
//
//    if(currentMenuItemQuantity.indexOf(".") != -1) {
//        if(currentMenuItemQuantity.length - currentMenuItemQuantity.indexOf(".") == 1) {
//            currentMenuItemQuantity = "1";
//        }
//    }
            
    currentSelectedMenuItemElement = element;

    //fetch this product from the products js array
    product = products[productId]
    
    //todo: pick this up dynamically
    amount = 1;
    
    //reset the quantity
    //currentMenuItemQuantity = "";

    buildOrderItem(product, amount);

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
    //writeTotalToReceipt(currentOrder, currentOrder['total']);

    menuRecptScroll();
}

function tableSelectMenuItem(orderItem) {
    addItemToTableOrderAndSave(orderItem);
    menuRecptScroll();
}

function writeOrderItemToReceipt(orderItem) {
    $('#menu_screen_till_roll').html($('#menu_screen_till_roll').html() + getOrderItemReceiptHTML(orderItem));
}

function getAllOrderItemsReceiptHTML(order, includeNonSyncedStyling, includeOnClick, includeServerAddedText) {
    allOrderItemsReceiptHTML = "";

    for(i=0; i<order.items.length; i++) {
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
    
    orderHTML = "<div class='order_line " + notSyncedClass + "' data-item_number='" + orderItem.itemNumber + "' " + onclickMarkup + ">";
    
    if(includeServerAddedText && orderItem.showServerAddedText) {
        var nickname = serverNickname(orderItem.serving_employee_id);
        var timeAdded = utilFormatTime(new Date(parseInt(orderItem.time_added)));
        orderHTML += "<div class='server'>At " + timeAdded + " " + nickname + " added:</div>";
    }
    
    orderHTML += "<div class='amount'>" + orderItem.amount + "</div>";
    orderHTML += "<div class='name'>" + notSyncedMarker + " " + orderItem.product.name + "</div>";
    
    orderItemTotalPriceText = number_to_currency(itemPriceWithoutModifier, {
        precision : 2
    });
    orderHTML += "<div class='total' data-per_unit_price='" + orderItem.product_price + "'>&nbsp;</div>";
    
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
            orderHTML += "<div class='modifier_price'>&nbsp;</div>";
        }
        
        orderHTML += clearHTML;
    }
    //alert(orderItem.oia_items);
    if(orderItem.oia_items) {
        for(j=0; j<orderItem.oia_items.length; j++) {
            oia_is_add = orderItem.oia_items[j].is_add;
            
            if(!orderItem.oia_items[j].is_note) {
                orderHTML += "<div class='oia_add'>" + (oia_is_add ? "Add" : "No") + "</div>";
            }
            
            orderHTML += "<div class='oia_name " + (orderItem.oia_items[j].is_note ? "note" : "") + "'>" + orderItem.oia_items[j].description + "</div>";
            
            if(orderItem.oia_items[j].abs_charge != 0) {
                
                oiaPriceWithoutDiscount = orderItem.oia_items[j].abs_charge * orderItem.amount;
        
                if(haveDiscount && oia_is_add) {
                    oiaPrice = oiaPriceWithoutDiscount - ((oiaPriceWithoutDiscount * orderItem.discount_percent)/100);
                } else {
                    oiaPrice = oiaPriceWithoutDiscount;
                }
        
                //orderHTML += "<div class='oia_price'>" + (!oia_is_add ? "-" : "") + currency(oiaPrice, false) + "</div>";
                orderHTML += "<div class='oia_price'>&nbsp;</div>";
            }
            
            orderHTML += clearHTML;
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
        
        for(j=0; j<orderItem.oia_items.length; j++) {
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
    
    return orderHTML;
}

function menuRecptScroll() {
    recptScroll("menu_screen_");
}

function loadReceipt(order) {
    clearReceipt();
    
    if(order == null){
        return;
    }

    orderTotal = order.total;
    orderItems = order.items;

    allOrderItemsRecptHTML = getAllOrderItemsReceiptHTML(order);
    $('#menu_screen_till_roll').html($('#menu_screen_till_roll').html() + allOrderItemsRecptHTML);

//    if(orderTotal != null) {
//        writeTotalToReceipt(order, orderTotal);
//    }
    
    menuRecptScroll();
}

function clearReceipt() {
    $('#menu_screen_till_roll').html('');
//    $('#total_value').html(currency(0));
//    $('#till_roll_discount').html('');
}

function postDoSyncTableOrder() {
    //redraw the receipt if we dont leave this screen
    //so that the highlighted items are no longer highlighted
    doSelectTable(selectedTable);
}

function setStatusMessage(message, hide, shake) {
    console.log("Status message set " + message);
}

var lastTap = null;

function initTouch() {
    //replace all click events with touch events
    if(!inMobileContext()) {
        new NoClickDelay(document.body);
    }
    
    //jquery touch ui plugin init

    $.extend($.support, {
        touch: "ontouchend" in document
    });

    // Hook up touch events
    $.fn.addTouch = function() {
        if ($.support.touch) {
            this.each(function(i,el){
                el.addEventListener("touchstart", iPadTouchHandler, false);
                el.addEventListener("touchmove", iPadTouchHandler, false);
                el.addEventListener("touchend", iPadTouchHandler, false);
                el.addEventListener("touchcancel", iPadTouchHandler, false);
            });
        }
    };
}

function NoClickDelay(el) {
    this.element = typeof el == 'object' ? el : document.getElementById(el);
    if( window.Touch ) this.element.addEventListener('touchstart', this, false);
}

NoClickDelay.prototype = {
    handleEvent: function(e) {
        switch(e.type) {
            case 'touchstart':
                this.onTouchStart(e);
                break;
            case 'touchmove':
                this.onTouchMove(e);
                break;
            case 'touchend':
                this.onTouchEnd(e);
                break;
        }
    },

    onTouchStart: function(e) {
        e.preventDefault();
        this.moved = false;

        this.theTarget = document.elementFromPoint(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
        if(this.theTarget.nodeType == 3) this.theTarget = theTarget.parentNode;
        this.theTarget.className+= ' pressed';

        this.element.addEventListener('touchmove', this, false);
        this.element.addEventListener('touchend', this, false);
    },

    onTouchMove: function(e) {
        this.moved = true;
        this.theTarget.className = this.theTarget.className.replace(/ ?pressed/gi, '');
    },

    onTouchEnd: function(e) {
        this.element.removeEventListener('touchmove', this, false);
        this.element.removeEventListener('touchend', this, false);

        if( !this.moved && this.theTarget ) {
            this.theTarget.className = this.theTarget.className.replace(/ ?pressed/gi, '');
            var theEvent = document.createEvent('MouseEvents');
            theEvent.initEvent('click', true, true);
            this.theTarget.dispatchEvent(theEvent);
        }

        this.theTarget = undefined;
    }
};

function prepareXTotal() {
    var doIt = true;//checkAllOrdersClosedForCashTotal();
    
    if(doIt) {
        doCashTotalReport("X");
    }
}

function prepareZTotal() {
    var doIt = checkAllOrdersClosedForCashTotal();
    
    if(doIt) {
        doCashTotalReport("Z");
    }
}

function checkAllOrdersClosedForCashTotal() {
    var allOrdersClosed = (!currentOrder || currentOrder.items.length == 0) && getActiveTableIDS().length == 0;
    
    if(!allOrdersClosed) {
        setStatusMessage("All Orders Must Be Closed!", true, true);
        return false;
    }
    
    return true;
}

function doSyncTableOrder() {
    if(selectedTable == 0 || selectedTable == -1) {
        setStatusMessage("Only valid for table orders!");
        return;
    } else {
        lastOrderSaleText = "Last Order";
        
        order = tableOrders[selectedTable];
        if(order.items.length == 0) {
            setStatusMessage("No items present in current table order!");
            return;
        }
    }
    
    order.table = tables[selectedTable].label;
    
    var copiedOrder = {};
    
    var copiedOrderForSend = $.extend(true, copiedOrder, order);

    tableOrderData = {
        tableID : selectedTable,
        orderData : copiedOrderForSend
    }
    
    var checkForShowServerAddedText = true;
    
    //mark all items in this order as synced
    for(i=0; i<order.items.length; i++) {
        if(checkForShowServerAddedText && !order.items[i].synced) {
            order.items[i].showServerAddedText = true;
            checkForShowServerAddedText = false;
        }
        
        order.items[i]['synced'] = true;
    }
    
    //store the order in the cookie
    storeTableOrderInStorage(current_user_id, selectedTable, order);
    
    $.ajax({
        type: 'POST',
        url: '/sync_table_order',
        data: {
            tableOrderData : tableOrderData,
            employee_id : current_user_id
        }
    });
    
    setStatusMessage("Order Sent");
    
    postDoSyncTableOrder();
}

function finishDoSyncTableOrder() {
    orderReceiptHTML = fetchOrderReceiptHTML();
    setLoginReceipt("Last Order", orderReceiptHTML);
}

function printCurrentReceipt() {
    if(currentOrderEmpty()) {
        setStatusMessage("No order present to print!");
        return;
    }
    
    content = fetchOrderReceiptHTML();
    
    printReceipt(content, false);
}

function printLastReceipt() {
    lastSaleInfo = getLastSaleInfo();
    content = lastSaleInfo.contentHTML;
    
    printReceipt(content, true);
}

function promptForServiceCharge() {
    popupHTML = $("#service_charge_popup_markup").html();
        
    if(currentScreenIsMenu()) {
        popupEl = showMenuScreenDefaultPopup(popupHTML);
    } else if (currentScreenIsTotals()) {
        popupEl = showTotalsScreenDefaultPopup(popupHTML);
    }
        
    popupId = popupEl.GetBubblePopupID();
    
    keypadPosition = $('#' + popupId).find('.service_charge_popup_keypad_container');
    
    clickFunction = function(val) {
        if(serviceCharge == 0) serviceCharge = "";
        
        serviceCharge = serviceCharge.toString() + val;
        
        $('#' + popupId).find('.service_charge_popup_amount').html(serviceCharge);
    };
    
    cancelFunction = function() {
        oldVal = $('#' + popupId).find('.service_charge_popup_amount').html();
        newVal = oldVal.substring(0, oldVal.length - 1);
        $('#' + popupId).find('.service_charge_popup_amount').html(newVal);
        
        if(newVal == "") newVal = 0;
        
        serviceCharge = parseFloat(newVal);
    };
    
    $('#' + popupId).find('.service_charge_popup_amount').html(serviceCharge);
    
    setUtilKeypad(keypadPosition, clickFunction, cancelFunction);
}

function saveServiceCharge() {
    serviceCharge = parseFloat(serviceCharge);
    
    if(isNaN(serviceCharge)) {
        serviceCharge = 0;
    }
    
    hideServiceChargePopup();
    
    if (currentScreenIsTotals()) {
        doTotal();
    }
}

function cancelServiceCharge() {
    serviceCharge = 0;
    hideServiceChargePopup();
}

function hideServiceChargePopup() {
    if(currentScreenIsMenu()) {
        hideMenuScreenDefaultPopup();
    } else if (currentScreenIsTotals()) {
        hideTotalsScreenDefaultPopup();
    }
}

function presetServiceChargePercentageClicked(percentage) {
    if(currentOrderEmpty()) {
        serviceCharge = 0;
    } else {
        serviceCharge = currency((percentage * parseFloat(getCurrentOrder().total))/100, false);
    }
    
    if(currentScreenIsMenu()) {
        popupEl = $('#menu_screen_default_popup_anchor');
    } else if (currentScreenIsTotals()) {
        popupEl = $('#totals_screen_default_popup_anchor');
    }
        
    popupId = popupEl.GetBubblePopupID();
    
    $('#' + popupId).find('.service_charge_popup_amount').html(serviceCharge);
}

function promptForCashback() {
    popupHTML = $("#cashback_popup_markup").html();
        
    popupEl = showTotalsScreenDefaultPopup(popupHTML);
       
    popupId = popupEl.GetBubblePopupID();
    
    keypadPosition = $('#' + popupId).find('.cashback_popup_keypad_container');
    
    clickFunction = function(val) {
        if(cashback == 0) cashback = "";
        
        cashback = cashback.toString() + val;
        
        $('#' + popupId).find('.cashback_popup_amount').html(cashback);
    };
    
    cancelFunction = function() {
        oldVal = $('#' + popupId).find('.cashback_popup_amount').html();
        newVal = oldVal.substring(0, oldVal.length - 1);
        $('#' + popupId).find('.cashback_popup_amount').html(newVal);
        
        if(newVal == "") newVal = 0;
        
        cashback = parseFloat(newVal);
    };
    
    $('#' + popupId).find('.cashback_popup_amount').html(cashback);
    
    setUtilKeypad(keypadPosition, clickFunction, cancelFunction);
}

function saveCashback() {
    cashback = parseFloat(cashback);
    
    if(isNaN(cashback)) {
        cashback = 0;
    }
    
    hideCashbackPopup();
    
    if (currentScreenIsTotals()) {
        doTotal();
    }
}

function cancelCashback() {
    cashback = 0;
    hideServiceChargePopup();
}

function hideCashbackPopup() {
    hideTotalsScreenDefaultPopup();
}

function presetCashbackAmountClicked(amount) {
    cashback = amount;
    
    popupEl = $('#totals_screen_default_popup_anchor');
        
    popupId = popupEl.GetBubblePopupID();
    
    $('#' + popupId).find('.cashback_popup_amount').html(cashback);
}

var floatTotal = 0;

function initFloatScreen() {
    setNavTitle("Add Float");
    showNavBackLinkMenuScreen();
    
    coinCounterPosition = $('#float_coin_counter_widget_container');
    
    totalFunction = function(total) {
        floatTotal = total;
    };
    
    setUtilCoinCounter(coinCounterPosition, totalFunction);
    
    doCoinCounterTotal();
    
    $('#float_till_roll').html("Loading...");
    
    showFloatScreen();
    
    //show the last float and z total
    $.ajax({
        type: 'GET',
        url: '/float_history.js'
    }); 
}

function removeLastOrderItem() {
    currentSelectedReceiptItemEl = getSelectedOrLastReceiptItem();
    
    if(currentSelectedReceiptItemEl) {
        removeSelectedOrderItem();
    }
    
    currentSelectedReceiptItemEl = null;
}

function markFreeLastOrderItem() {
    order = getCurrentOrder();
    
    currentSelectedReceiptItemEl = getSelectedOrLastReceiptItem();
    
    if(currentSelectedReceiptItemEl) {
        itemNumber = currentSelectedReceiptItemEl.data("item_number");
        applyDiscountToOrderItem(order, itemNumber, 100);
    
        //store the modified order
        if(selectedTable != 0) {
            storeTableOrderInStorage(current_user_id, selectedTable, order);
        }else {
            storeOrderInStorage(current_user_id, order);
        }
    
        //redraw the receipt
        loadReceipt(order);
    }
    
    currentSelectedReceiptItemEl = null;
}

function toggleModifyOrderItemScreen() {
    if(currentMenuSubscreenIsMenu()) {
        showModifyOrderItemScreen();
    } else {
        resetKeyboard();
        $('#sales_button_' + addNoteButtonID).removeClass("selected");
        switchToMenuItemsSubscreen();
    }
}

function showModifyOrderItemScreen() {
    switchToModifyOrderItemSubscreen();
}

function showAddNoteToOrderItemScreen() {
    order = getCurrentOrder();
    
    currentSelectedReceiptItemEl = getSelectedOrLastReceiptItem();
    
    if(currentSelectedReceiptItemEl) {
        if(currentScreenIsMenu()) {
            if(currentMenuSubscreenIsModifyOrderItem()) {
                if(doSaveNote()) {
                    $('#sales_button_' + addNoteButtonID).removeClass("selected");
                    resetKeyboard();
                    switchToMenuItemsSubscreen();
                }
            } else {
                hideAllMenuSubScreens();
                $('#order_item_additions').show();
                doOpenOIANoteScreen();
            }
        }
        
    }
}

function openCashDrawer() {
    //search for "signed.applets.codebase_principal_support" 
    //in this list and toggle its value to "true"
    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");

    // create an nsILocalFile for the executable
    var file = Components.classes["@mozilla.org/file/local;1"]
    .createInstance(Components.interfaces.nsILocalFile);
    file.initWithPath("c:\\open_cash_drawer.bat");

    // create an nsIProcess
    var process = Components.classes["@mozilla.org/process/util;1"]
    .createInstance(Components.interfaces.nsIProcess);
    process.init(file);

    // Run the process.
    // If first param is true, calling thread will be blocked until
    // called process terminates.
    // Second and third params are used to pass command-line arguments
    // to the process.
    var args = [];
    process.run(false, args, args.length);
}

function getCurrentRecptHTML() {
    return "NYI";
}

//this loads up the last receipt that a user was looking at before logging out
function displayLastReceipt() {
    var lastReceiptID = fetchLastReceiptID();
    console.log("Last recpt " + lastReceiptID);
    //set the select item
    doSelectTable(lastReceiptID); 
}