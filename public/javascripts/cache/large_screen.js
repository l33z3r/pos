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


var showingDisplayButtonPasscodePromptPopup;

//this array stores wether or not to call for a 
//passcode prompt when a screen button is pressed
var display_button_passcode_permissions;

$(function(){
    doGlobalInit();
});
   
function doGlobalInit() {
    //allow scroll for dev
    if(inDevMode()) {
        $('body').css("overflow", "scroll");
    }
    
    initUIElements();
    
    initAdminTables();
    
    setFingerPrintCookie();
    
    if(isTouchDevice()) {
        initTouch();
    }
    
    initTouchRecpts();
    
    //check if we have loaded a previous order from the admin interface
    //this will also load it into tableOrders[-1]
    initPreviousOrder();
    
    //custom button widths
    renderMenuItemButtonDimensions();
    
    if(inMenuContext()) {
        initMenu();
    }
    
    //start the clock in the nav bar
    $("div#clock").clock({
        "calendar":"false",
        "format": clockFormat
    });
    
    //init the display button passcode request popup
    $('#menu_buttons_popup_anchor').CreateBubblePopup();
    $('#menu_buttons_popup_anchor').FreezeBubblePopup();
    
    lastSaleInfo = getLastSaleInfo();

    if(lastSaleInfo) {
        setLoginReceipt(lastSaleInfo.title, lastSaleInfo.contentHTML)
    }
    
    showInitialScreen();
    
    showScreenFromHashParams();
    
    $('#flash_container').delay(500).fadeIn(500, function() {
        $(this).delay(3000).fadeOut(500);
    });
    
    //any input that gains focus will call this function
    $("input,textarea").live("focus", function(event) {
        //unhighlight last active
        if(typeof lastActiveElement != "undefined") {
            lastActiveElement.removeClass("focus");
        }
        
        lastActiveElement = $(this);
        
        //unhighlight last active
        lastActiveElement.addClass("focus");
        
        event = event || window.event
 
        //the following was an attempt to hide the ipad keyboard but didnt work
        if (event.preventDefault) {  // W3C variant
            event.preventDefault()
        } else { // IE<9 variant:
            event.returnValue = false
        }
        
    });
    
    if(doBeep) {
        initBeep();
    }
    
    //start calling home
    callHomePoll();
}

function showInitialScreen() {
    if(current_user_id == null) {
        showLoginScreen();

        $('#clockincode_show').html("");
        $('#num').val("");
    } else {
        showMenuScreen();
        
        //show the red x 
        $('#nav_save_button').show();
        
        if(current_user_nickname != null) $('#e_name').html(current_user_nickname);
    }
    
}

var displayButtonForwardFunction;

function doDisplayButtonPasscodePrompt(button_id, forwardFunction) {
    closePreviousModifierDialog();
        
    if(display_button_passcode_permissions[button_id]) {
        checkMenuScreenForFunction();
        displayButtonForwardFunction = forwardFunction;
        
        showDisplayButtonPasscodePromptPopup();
    } else {
        forwardFunction.call();
    }
}

function displayButtonPasscodeEntered() {
    enteredCode = $('#display_button_passcode').val();
    
    if(enteredCode == current_user_passcode) {
        showingDisplayButtonPasscodePromptPopup = false;
        $('#display_button_passcode').val('');
        $('#display_button_passcode_show').html('');
    
        hideBubblePopup($('#menu_buttons_popup_anchor'));
    
        displayButtonForwardFunction.call();
        displayButtonForwardFunction = null;
    } else {
        setStatusMessage("Passcode Incorrect, try again!");
        $('#display_button_passcode').val('');
        $('#display_button_passcode_show').html('');
    }
}

function showDisplayButtonPasscodePromptPopup() {
    $('#display_button_passcode').val('');
    $('#display_button_passcode_show').html('');
            
    showingDisplayButtonPasscodePromptPopup = true;
    
    //show the popup
    $('#menu_buttons_popup_anchor').ShowBubblePopup({
        align: 'center',
        innerHtml: "<div id='display_button_passcode_popup'><div id='header'>Enter Pass Code:</div>" + 
        "<div id='display_button_passcode_show'></div>" + 
        "<div id='display_button_submit_passcode' class='button' onclick='displayButtonPasscodeEntered()'>Submit</div>" + 
        "<div id='cancel_display_button_passcode_prompt' class='button' onclick='cancelDisplayButtonPasscodePromptPopup();return false;'>Cancel</div></div>",
														   
        innerHtmlStyle:{ 
            'text-align':'left'
        },
												   
        themeName: 	'all-grey',
        themePath: 	'/images/jquerybubblepopup-theme'

    }, false);//save_options = false; it will use new options only on click event, it does not overwrite old options.
    
    $('#menu_buttons_popup_anchor').FreezeBubblePopup();
    
    popupId = $('#menu_buttons_popup_anchor').GetBubblePopupID();
    
    //register the click handler to hide the popup when outside clicked
    registerPopupClickHandler($('#' + popupId).add('#till_keypad'), cancelDisplayButtonPasscodePromptPopup);
}

function cancelDisplayButtonPasscodePromptPopup() {
    showingDisplayButtonPasscodePromptPopup = false;
    hideBubblePopup($('#menu_buttons_popup_anchor'));
}

var roomScaleX;
var roomScaleY;

var currentSelectedRoom = -1;

function initTableSelectScreen() {
    //alert(currentSelectedRoom);
    
    if(currentSelectedRoom == 0) {
        currentSelectedRoom = $('.room_graphic').first().data('room_id');
    }
    
    $('#select_room_button_' + currentSelectedRoom).click();
    setSelectedTable();
}

function setSelectedTable() {
    //set selected table for this room
    $('.room_graphic').children('div.label').removeClass("selected_table");
    
    //set a class on the div to make it look selected
    $('#table_' + selectedTable).children('div.label').addClass("selected_table");
}

function loadRoomGraphic(room_id) {
    $('.room_name').removeClass("selected");
    $('#select_room_button_' + room_id).addClass("selected");
    
    currentSelectedRoom = room_id;
    
    $('#room_layout').html($('#room_graphic_' + room_id).html());
    
    room_grid_x_size = $('#room_graphic_' + room_id).data("grid_x_size");
    room_grid_y_size = $('#room_graphic_' + room_id).data("grid_y_size");
    room_grid_resolution = $('#room_graphic_' + room_id).data("room_grid_resolution");
    
    setScale(room_grid_resolution, room_grid_x_size, room_grid_y_size);
    setRoomObjectGridPositions();
    
    //copy the dynamic ids over
    $('#room_layout .room_object').each(function(index) {
        theid = $(this).attr("data-theid");
        $(this).attr("id", theid);
    });
    
    setSelectedTable();
}

var maxGridSize = 70;
var minGridSize = 30;

function setScale(room_grid_resolution, room_grid_x_size, room_grid_y_size) {
    scale = (maxGridSize - room_grid_resolution) + minGridSize;
    
    $('#room_layout').width(room_grid_x_size * scale);
    $('#room_layout').height(room_grid_y_size * scale);
    
    container_div_width = $('#room_layout').width();
    container_div_height = $('#room_layout').height();
   
    roomScaleX = container_div_width / room_grid_x_size;
    roomScaleY = container_div_height / room_grid_y_size;
    
//alert("X: " + roomScaleX + " Y: " + roomScaleY);
}

function setRoomObjectGridPositions() {
    $('.room_object').each(function() {
        ro = $(this);
        ro_image = ro.children('img');
        
        grid_x = ro.data("grid_x");
        grid_y = ro.data("grid_y");
        
        grid_x_size = ro.data("grid_x_size");
        grid_y_size = ro.data("grid_y_size");
        
        //have to subtract 1 from grid_x and grid_y
        grid_x--;
        grid_y--;
        
        ro.css("margin-left", grid_x * roomScaleX);
        ro.css("margin-top", grid_y * roomScaleY);
    
        ro_image.width(grid_x_size * roomScaleX);
        ro_image.height(grid_y_size * roomScaleY);
    });
}

//this checks if we are on menu screen as some buttons will only work on that screen
//this code is in lib/button_mapper.rb
function checkMenuScreenForFunction() {
    if(!currentScreenIsMenu()) {
        showMenuScreen();
    }
}

//used for setting the terminal id using the browsers fingerprint and save it in a cookie
//uses the fingerprint library with md5 hash
function setFingerPrintCookie() {
    c_name = "terminal_fingerprint";
    
    if(getRawCookie(c_name) == null) {
        c_value = pstfgrpnt(true).toString();
        exdays = 365;
    
        setRawCookie(c_name, c_value, exdays);
    }
}

function initAdminTables() {
    $('.admin_table thead tr th:first').addClass('first');
    $('.admin_table thead tr th:last').addClass('last');
    
    $('.admin_table tbody tr').each(function() {
        $(this).find('td:first').addClass('first')
    });
    $('.admin_table tbody tr').each(function() {
        $(this).find('td:last').addClass('last')
    });
    
    $('.admin_table tbody tr:odd').addClass('odd');
}

var currentTotalFinal = 0;
var currentOrderJSON;
var currentMenuItemQuantity = "";

var tableSelectMenu = null;

var paymentMethod = null;
var serviceCharge = 0;
var cashback = 0;

//this function is called from application.js on page load
function initMenu() {
    loadFirstMenuPage();
    renderActiveTables();
    
    currentMenuPage = 1;
    currentOrder = new Array();

    loadCurrentOrder();
    displayLastReceipt();
    initOptionButtons();
    
    initModifierGrid();
    
    //hack to scroll the recpt a little after page has loaded as there 
    //were problems on touch interface with recpt getting stuck
    setTimeout("menuRecptScroll()", 1000);
}

function initPreviousOrder() {
    if(havePreviousOrder(current_user_id)) {
        selectedTable = -1;
        $('#previous_order_select_item').show();
        //$('#table_select').val(-1);
        tableSelectMenu.setValue(-1);
        doSelectTable(-1);
        
        getTableOrderFromStorage(current_user_id, -1)
        
        previousTableOrder = tableOrders[-1];
        
        //carry over service charge
        serviceCharge = previousTableOrder.service_charge;
        
        //carry over payment method
        paymentMethod = previousTableOrder.payment_method;
        
        cashback = previousTableOrder.cashback;
        
        //carry over the table number
        tables[-1] = {
            id : '-1', 
            label : previousTableOrder.table_info_label
        };
    }
}

function menuScreenKeypadClick(val) {
    if(showingDisplayButtonPasscodePromptPopup) {
        $('#display_button_passcode').val($('#display_button_passcode').val() + val);
        $('#display_button_passcode_show').html($('#display_button_passcode_show').html() + val);
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
}

function menuScreenKeypadClickCancel() {
    currentMenuItemQuantity = "";
}

function menuScreenKeypadClickDecimal() {
    if(currentMenuItemQuantity.indexOf(".") == -1) {
        currentMenuItemQuantity += ".";
    }
}

function loadFirstMenuPage() {
    //set the inital menu page selected to be the first
    $('#menu_items_container').html($('#menu_items_1').html());
    $('#pages .page').removeClass("selected");
    $('#pages .page').first().addClass("selected");
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
}

function doSelectMenuItem(productId, element) {
    if(currentMenuItemQuantity == "")
        currentMenuItemQuantity = "1";

    if(currentMenuItemQuantity.indexOf(".") != -1) {
        if(currentMenuItemQuantity.length - currentMenuItemQuantity.indexOf(".") == 1) {
            currentMenuItemQuantity = "1";
        }
    }
            
    closePreviousModifierDialog();
    
    currentSelectedMenuItemElement = element;

    //fetch this product from the products js array
    product = products[productId]
    amount = currentMenuItemQuantity;
    
    //reset the quantity
    currentMenuItemQuantity = "";

    buildOrderItem(product, amount);
    
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
    currentOrderItem['total_price'] = currentOrderItem['total_price'] + (currentOrderItem['amount'] * modifierPrice);

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

    //add a line to the receipt
    writeOrderItemToReceipt(orderItem);
    writeTotalToReceipt(currentOrder, currentOrder['total']);

    menuRecptScroll();
}

function tableSelectMenuItem(orderItem) {
    addItemToTableOrderAndSave(orderItem);
    writeTotalToReceipt(currentTableOrder, currentTableOrder['total']);
    menuRecptScroll();
}
    
function writeOrderItemToReceipt(orderItem) {
    $('#till_roll').html($('#till_roll').html() + getOrderItemReceiptHTML(orderItem));
}

function getAllOrderItemsReceiptHTML(order, includeNonSyncedStyling, includeOnClick, includeServerAddedText) {
    allOrderItemsReceiptHTML = "";

    for(i=0; i<order.items.length; i++) {
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
    orderHTML += "<div class='total' data-per_unit_price='" + orderItem.product_price + "'>" + orderItemTotalPriceText + "</div>";
    
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
        
                orderHTML += "<div class='oia_price'>" + (!oia_is_add ? "-" : "") + currency(oiaPrice, false) + "</div>";
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

var currentSelectedReceiptItemEl;
var editItemPopupAnchor;

function doSelectReceiptItem(orderItemEl) {
    orderItemEl = $(orderItemEl);
    
    //close any open popup
    closeEditOrderItem();
    
    //save the currently opened dialog
    currentSelectedReceiptItemEl = orderItemEl;
    
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
        if(currentVal == 0) currentVal = "";
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
}

function editOrderItemIncreaseQuantity() {
    popupId = editItemPopupAnchor.GetBubblePopupID();
    
    targetInputEl = $('#' + popupId).find('.quantity');
    
    currentVal = parseFloat(targetInputEl.val());
    targetInputEl.val(currentVal + 1);
}

function editOrderItemDecreaseQuantity() {
    popupId = editItemPopupAnchor.GetBubblePopupID();
    
    targetInputEl = $('#' + popupId).find('.quantity');
    
    currentVal = parseFloat(targetInputEl.val());
    
    if(currentVal != 1) {
        targetInputEl.val(currentVal - 1);
    }
}

function closeEditOrderItem() {
    if(currentSelectedReceiptItemEl) {
        hideBubblePopup(editItemPopupAnchor);
        currentSelectedReceiptItemEl.removeClass("selected");
    
        currentSelectedReceiptItemEl = null;
    }
}

function saveEditOrderItem() {
    //fetch the item number
    itemNumber = currentSelectedReceiptItemEl.data("item_number");
    
    popupId = editItemPopupAnchor.GetBubblePopupID();
    
    closeEditOrderItem();
    
    //fetch the order from the order array and modify it
    //then modify the html in the receipt
    targetInputQuantityEl = $('#' + popupId).find('.quantity');
    newQuantity = parseFloat(targetInputQuantityEl.val());
    
    targetInputPricePerUnitEl = $('#' + popupId).find('.price');
    newPricePerUnit = parseFloat(targetInputPricePerUnitEl.val());
    
    if(selectedTable != 0) {
        order = tableOrders[selectedTable];
        order = modifyOrderItem(order, itemNumber, newQuantity, newPricePerUnit);
    
        storeTableOrderInStorage(current_user_id, selectedTable, order);
    }else {
        order = currentOrder;
        order = modifyOrderItem(order, itemNumber, newQuantity, newPricePerUnit);
        
        storeOrderInStorage(current_user_id, order);
    }
    
    //redraw the receipt
    loadReceipt(order);
}

function modifyOrderItem(order, itemNumber, newQuantity, newPricePerUnit) {
    targetOrderItem = order.items[itemNumber-1];
    
    targetOrderItem.amount = newQuantity;
    targetOrderItem.product_price = newPricePerUnit;
    targetOrderItem.total_price = newPricePerUnit * newQuantity;
        
    //add the new modifier price to the total
    if(targetOrderItem.modifier) {
        targetOrderItem.total_price += targetOrderItem.modifier.price * newQuantity;
    }
    
    applyExistingDiscountToOrderItem(order, itemNumber);
    calculateOrderTotal(order);
        
    return order;
}

function removeSelectedOrderItem() {
    //fetch the item number
    itemNumber = currentSelectedReceiptItemEl.data("item_number");
    
    if(selectedTable != 0) {
        order = tableOrders[selectedTable];
        order = doRemoveOrderItem(order, itemNumber);
    
        storeTableOrderInStorage(current_user_id, selectedTable, order);
    }else {
        order = currentOrder;
        order = doRemoveOrderItem(order, itemNumber);
        
        storeOrderInStorage(current_user_id, order);
    }
    
    currentSelectedReceiptItemEl.slideUp('slow', function() {
        loadReceipt(order);
    });
    
    closeEditOrderItem();
}

function doRemoveOrderItem(order, itemNumber) {
    order.items.splice(itemNumber-1, 1);
    
    //update the order items of following items
    for(i=itemNumber-1; i<order.items.length; i++) {
        order.items[i].itemNumber--;
    }
    
    //have to retotal the order
    calculateOrderTotal(order);
        
    return order;
}

function writeTotalToReceipt(order, orderTotal) {
    if(!order) return;
    
    //write the total order discount to the end of the order items
    tillRollDiscountHTML = getTillRollDiscountHTML(order);
    
    $('#till_roll_discount').html(tillRollDiscountHTML);
    
    $('#total_value').html(currency(orderTotal));
}

function tableScreenSelectTable(tableId) {
    //back to menu screen
    showMenuScreen();
    //$('#table_select').val(tableId);
    tableSelectMenu.setValue(tableId);
    doSelectTable(tableId);
}

function loadReceipt(order) {
    clearReceipt();
    
    if(order == null){
        return;
    }

    orderTotal = order.total;
    orderItems = order.items;

    allOrderItemsRecptHTML = getAllOrderItemsReceiptHTML(order);
    $('#till_roll').html($('#till_roll').html() + allOrderItemsRecptHTML);

    if(orderTotal != null) {
        writeTotalToReceipt(order, orderTotal);
    }
    
    menuRecptScroll();
}

function loginRecptScroll() {
    recptScroll("login_");
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

function doTotal() {
    if(currentOrderEmpty()) {
        setStatusMessage("No order present to sub-total!", true, true);
        return;
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
    
    $('#cash_screen_sub_total_value').html(currency(totalOrder.total));
    
    if(!paymentMethod) {
        paymentMethod = defaultPaymentMethod;
    }
    
    paymentMethodSelected(paymentMethod);
    
    showNavBackLinkMenuScreen();
    showTotalsScreen();
    totalsRecptScroll();
    
    $('#cashback_amount_holder').html(currency(cashback));
    
    $('#totals_tendered_value').html(currency(0, false));
    takeTendered();
}

function doTotalFinal() {
    if(currentOrderEmpty()) {
        setStatusMessage("No order present to total!", true, true);
        return;
    }
    
    numPersons = 0

    if(selectedTable == 0) {
        totalOrder = currentOrder;
        tableInfoId = null;
        tableInfoLabel = "None";
        isTableOrder = false;
    } else {
        //get total for table
        totalOrder = tableOrders[selectedTable];

        if(selectedTable == -1) {
            //we dump the id of the table when it is stored in db (to deal with tables no longer existing)
            //so we cant carry it over here, so we test for the "none" word to test for a table order
            
            //pick up the previous table
            tableInfoLabel = tables[-1].label;
            isTableOrder = (tableInfoLabel != 'None');
            tableInfoId = totalOrder.tableInfoId;
        } else {
            isTableOrder = true;
            tableInfoId = selectedTable;
            tableInfoLabel = tables[tableInfoId].label;
        }

        //TODO: pick up num persons
        numPersons = 4;
    }

    cashTendered = getTendered();

    totalOrder.cash_tendered = cashTendered;
    totalOrder.change = $('#totals_change_value').html();
    
    if(!paymentMethod) {
        paymentMethod = defaultPaymentMethod;
    }
    
    totalOrder.time = new Date().getTime();
    totalOrder.payment_method = paymentMethod;
    
    //set the service charge again in case it was changed on the totals screen
    totalOrder.service_charge = serviceCharge;
    
    totalOrder.cashback = cashback;
    
    discountPercent = totalOrder.discount_percent;
    preDiscountPrice = totalOrder.pre_discount_price;

    //do up the subtotal and total and retrieve the receipt html for both the login screen and for print
    receiptHTML = fetchFinalReceiptHTML(false, true);
    printReceiptHTML = fetchFinalReceiptHTML(true, false);
    
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
        'order_num': order_num,
        'employee_id':current_user_id,
        'total':orderTotal,
        'tax_chargable':taxChargable,
        'global_sales_tax_rate':orderSalesTaxRate,
        'service_charge':serviceCharge,
        'cashback':cashback,
        'payment_type':paymentMethod,
        'amount_tendered':cashTendered,
        'num_persons':numPersons,
        'is_table_order':isTableOrder,
        'table_info_id':tableInfoId,
        'table_info_label':tableInfoLabel,
        'discount_percent':discountPercent,
        'pre_discount_price':preDiscountPrice,
        'order_details':totalOrder,
        'terminal_id':terminalID,
        'void_order_id': totalOrder.void_order_id
    }

    sendOrderToServer(orderData);

    //clear the order
    clearOrder(selectedTable);

    //clear the receipt
    $('#till_roll').html('');
    $('#till_roll_discount').html('');
    $('#sales_tax_total').html('');
    
    //pick up the default home screen and load it
    loadAfterSaleScreen();

    //reset for next sale
    resetTendered();
    $('#totals_change_value').html("");
    serviceCharge = 0;
    cashback = 0;
    paymentMethod = null;
    
    //set the select item to the personal receipt
    //$('#table_select').val(0);
    tableSelectMenu.setValue(0);
    doSelectTable(0);
    
    totalOrder = null;
    currentTotalFinal = 0;

    //now print the receipt
    if(autoPrintReceipt) {
        printReceipt(printReceiptHTML, true);
    }

    //do we need to clear the previous order from the receipt dropdown selection?
    if(selectedTable == -1) {
        $('#previous_order_select_item').hide();
    }
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
            storeOrderForLaterSend(orderData)
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

function trySendOutstandingOrdersToServer() {
    ordersForLaterSend = retrieveOrdersForLaterSend();
    
    if(ordersForLaterSend.length>0) {
        sendOutstandingOrdersToServer(ordersForLaterSend);
    }
}

function sendOutstandingOrdersToServer(outstandingOrdersData) {
    $.ajax({
        type: 'POST',
        url: '/outstanding_orders',
        success: clearOutstandingOrders,
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
    $('#menu_buttons_panel').hide();
    $('#menu_buttons_loading_message').show();

    //show admin button?
    if(current_user_is_admin) {
        $('#admin_button').show();
    } else {
        $('#admin_button').hide();
    }

    if(current_user_id != null) {
        //user is logged in so set the sales screen buttons visibility
        $.ajax({
            type: 'GET',
            url: '/init_sales_screen_buttons.js',
            data: {
                current_user_id : current_user_id
            }
        });
    }
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
        itemNumber = receiptItem.data("item_number");
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
    
    //highlight the input box
    $('#' + popupId).find('#discount_percent_input').select();
    
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
    
//TODO: manually init the radio button iphone style
    
    
    
    
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
    
    if(selectedValue<0 || selectedValue>100) {
        setStatusMessage("You must enter a number between 0 and 100", true, true);
        return;
    }
    
    order = getCurrentOrder();
    
    wholeOrderDiscount = ($("input[name='discount_type']:checked").val() == 'whole_order');
    
    //discount on whole order or individual item?
    if(individualItemDiscount) {
        //fetch the item number
        itemNumber = currentSelectedReceiptItemEl.data("item_number");
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
    loadReceipt(order);
}

function addDiscountToOrder(order, amount) {
    order['discount_percent'] = amount;
    
    calculateOrderTotal(order);
}

function applyExistingDiscountToOrderItem(order, itemNumber) {
    // -1 itemNumber signifies to apply the existing discount
    if(itemNumber != -1) {
        //we must first clear the last pre_discount_price
        order.items[itemNumber-1]['pre_discount_price'] = null;
    }
    
    applyDiscountToOrderItem(order, itemNumber, -1);
}

function applyDiscountToOrderItem(order, itemNumber, amount) {
    //should already be a float, but just to be sure
    amount = parseFloat(amount);
    
    if(itemNumber == -1) {
        orderItem = order.items[order.items.length-1];
    } else {
        orderItem = order.items[itemNumber-1];
    }
    
    //overwrite the discount amount, or just apply the existing one?
    if(amount == -1) {
        //return if no existing discount
        if(!orderItem['discount_percent']) {
            return;
        }
        
        amount = orderItem['discount_percent']
    } else {
        orderItem['discount_percent'] = amount;
    }
    
    oldPrice = orderItem['total_price'];
    
    if(!orderItem['pre_discount_price']) {
        orderItem['pre_discount_price'] = oldPrice;
    }
    
    preDiscountPrice = orderItem['pre_discount_price'];

    //alert("PreDiscountPrice: " + preDiscountPrice + " NewDiscount: " + ((preDiscountPrice * amount)/100));
    
    newPrice = preDiscountPrice - ((preDiscountPrice * amount) / 100);
    orderItem['total_price'] = newPrice;

    if(selectedTable == 0) {
        //mark the item as synced as we are not on a table receipt
        orderItem.synced = true;
    } else {
        //mark this item as unsynced
        orderItem['synced'] = false;
    }
    
    calculateOrderTotal(order);
}

function getExistingDiscountPercentForCurrentOrderItem(itemNumber) {
    order = getCurrentOrder();
    
    orderItem = order.items[itemNumber-1];
    
    existingDiscount = orderItem['discount_percent'];
    
    return existingDiscount;
}

function currentOrderEmpty(){
    fetchedCurrentOrder = getCurrentOrder();
    return orderEmpty(fetchedCurrentOrder);
}

function orderEmpty(order) {
    return !order || order.items.length == 0;
}

function orderStartTime(order) {
    if(orderEmpty(order)) {
        return "";
    }
    
    return order.items[0].time_added;
}

var oiaIsAdd = true;

function orderItemAdditionClicked(el) {
    currentSelectedReceiptItemEl = getLastReceiptItem();
    
    if(!currentSelectedReceiptItemEl) {
        setStatusMessage("There are no receipt items!");
        return;
    }
    
    var order = getCurrentOrder();
    
    var itemNumber = currentSelectedReceiptItemEl.data("item_number");
    
    var orderItem = order.items[itemNumber-1];
    
    el = $(el);
    
    //is this available
    var available = el.data("available");
    
    if(!available) {
        return;
    }
    
    //get the oia data
    var desc = el.data("description");
    
    var absCharge = 0;
    
    if(oiaIsAdd) {
        absCharge = el.data("add_charge");
    } else {
        absCharge = el.data("minus_charge");
    }
    
    addOIAToOrderItem(order, orderItem, desc, absCharge, oiaIsAdd, false);
}

function addOIAToOrderItem(order, orderItem, desc, absCharge, oiaIsAdd, isNote) {
    oia_item = {
        'description' : desc,
        'abs_charge' : absCharge,
        'is_add' : oiaIsAdd, 
        'is_note' : isNote
    }
    
    if(typeof(orderItem.oia_items) == 'undefined') {
        orderItem.oia_items = new Array();
    }
    
    //update the total
    if(oiaIsAdd) {
        orderItem.total_price = orderItem.total_price + (orderItem.amount * absCharge);
    } else {
        orderItem.total_price = orderItem.total_price - (orderItem.amount * absCharge);
    }
    
    orderItem.oia_items.push(oia_item);
   
    //store the modified order
    if(selectedTable != 0) {
        storeTableOrderInStorage(current_user_id, selectedTable, order);
    }else {
        storeOrderInStorage(current_user_id, order);
    }
        
    //redraw the receipt
    calculateOrderTotal(order);
    loadReceipt(order);
    
    currentSelectedReceiptItemEl = null;
}

function orderItemAdditionAddSelected() {
    $('#add_note').hide();
    resetKeyboard();
    $('#oia_container').show();
    
    clearSelectedOIATabs();
    $('#oia_tab_add').addClass("selected");
    oiaIsAdd = true;
    
    $('#order_item_additions .grid_item:not(.empty)').each(function() {
        addCharge = $(this).data("add_charge");
        if(addCharge != 0) {
            $(this).find(".charge").html(currency(addCharge));
        }else {
            $(this).find(".charge").html("");
        }
    });
}

function orderItemAdditionNoSelected() {
    $('#add_note').hide();
    resetKeyboard();
    $('#oia_container').show();
    
    clearSelectedOIATabs();
    $('#oia_tab_no').addClass("selected");
    oiaIsAdd = false;
    
    $('#order_item_additions .grid_item:not(.empty)').each(function() {
        noCharge = $(this).data("minus_charge");
        if(noCharge != 0) {
            $(this).find(".charge").html(currency(noCharge));
        } else {
            $(this).find(".charge").html("");
        }
    });
}

function clearSelectedOIATabs() {
    $('#oia_tabs .tab').removeClass("selected");
}

function doOpenOIANoteScreen() {
    clearSelectedOIATabs();
    $('#oia_tab_note').addClass("selected");
    
    $('#sales_button_' + addNoteButtonID).addClass("selected");
    
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
    
    noteInput = noteInput.replace(/ /g,'')
    
    if(noteInput.length == 0) {
        setStatusMessage("Please enter some text for this note!");
        return false;
    }
    
    currentSelectedReceiptItemEl = getLastReceiptItem();
    
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
    
    addOIAToOrderItem(order, orderItem, desc, absCharge, noteChargeIsPlus, true);
    
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
}

//mark tables in the list as active with some asterisk etc
function renderActiveTables() {
    activeTableIDS = getActiveTableIDS();
    
    //alert("render active tables " + activeTableIDS);
    
    $("#table_select").children('li').children('ul').children('li').each( 
        function(id, element) {
            //alert("ID: " + $(element).val().toString() + " El " + $(element).html() + " in:" + $.inArray($(element).val().toString(), activeTableIDS));
            
            if(typeof($(element).attr('rel')) != 'undefined') {
                nextTableID = $(element).attr('rel').toString();
                
                //alert(nextTableID);
                
                if($.inArray(nextTableID, activeTableIDS) != -1) {
            
                    $(element).addClass("active");
            
                    //mark the tables screen also
                    $('#table_label_' + nextTableID).addClass("active");
                } else {
            
                    $(element).removeClass("active");
                    $('#table_label_' + nextTableID).removeClass("active");
                }
            }
        }
        );  
}

function postDoSyncTableOrder() {

    clearLoginReceipt();

    //redraw the receipt if we dont leave this screen
    //so that the highlighted items are no longer highlighted
    doSelectTable(selectedTable);
    
    //pick up the default home screen and load it
    loadAfterSaleScreen();

    if(!order.order_num) {
        setLoginReceipt("Last Order", "Loading...");
        setTimeout(finishDoSyncTableOrder, 2000);
    } else {
        finishDoSyncTableOrder();
    }
}

function havePreviousOrder(current_user_id) {
    var key = "user_" + current_user_id + "_table_-1_current_order";
    var data = retrieveStorageValue(key);
    return data;
}

function showScreenFromHashParams() {
    hashParams = getURLHashParams();
    
    if(hashParams) {
        if(hashParams.screen) {
            //alert("Setting screen to " + hashParams.screen);
            
            if(hashParams.screen == 'login') {
                showLoginScreen();
            } else if(hashParams.screen == 'menu') {
                showMenuScreen();
            } else if(hashParams.screen == 'totals') {
            //cannot go to this screen
            } else if(hashParams.screen == 'tables') {
                showTablesScreen();
            } else if(hashParams.screen == 'more_options') {
                showMoreOptionsScreen();
            }
            
            window.location.hash = "";
        }
    }
    
}

function getURLHashParams() {
    var hashParams = {};
    
    var e,
    a = /\+/g,  // Regex for replacing addition symbol with a space
    r = /([^&;=]+)=?([^&;]*)/g,
    d = function (s) {
        return decodeURIComponent(s.replace(a, " "));
    },
    q = window.location.hash.substring(1);

    while (e = r.exec(q)) {
        hashParams[d(e[1])] = d(e[2]);
    }

    return hashParams;
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

var utilCounterTotalFunction;
var utilCounterParent;
    
function setUtilCoinCounter(position, totalFunction) {
    utilCounterParent = $(position);
    $(position).html($('#coin_counter_widget_container').html());
    utilCounterParent.find('.total_amount_input').focus();
    utilCounterTotalFunction = totalFunction;
}

function utilCounterTotalCalculated(total) {
    utilCounterTotalFunction(total);
}

function showMenuScreenDefaultPopup(popupHTML) {
    popupAnchor = $('#menu_screen_default_popup_anchor');    
    return showDefaultPopup(popupAnchor, popupHTML);
}

function showTotalsScreenDefaultPopup(popupHTML) {
    popupAnchor = $('#totals_screen_default_popup_anchor');    
    return showDefaultPopup(popupAnchor, popupHTML);
}

function showDefaultPopup(popupAnchor, popupHTML) {
    if(popupAnchor.HasBubblePopup()) {
        popupAnchor.RemoveBubblePopup();
    }
    
    popupAnchor.CreateBubblePopup();
         
    popupAnchor.ShowBubblePopup({
        align: 'center',
        innerHtml: popupHTML,
														   
        innerHtmlStyle:{ 
            'text-align':'left'
        },
												   
        themeName: 	'all-grey',
        themePath: 	'/images/jquerybubblepopup-theme'

    }, false);
    
    popupAnchor.FreezeBubblePopup();
    
    return popupAnchor;
}

function hideMenuScreenDefaultPopup() {
    popupAnchor = $('#menu_screen_default_popup_anchor');
    hideScreenDefaultPopup(popupAnchor);
}

function hideTotalsScreenDefaultPopup() {
    popupAnchor = $('#totals_screen_default_popup_anchor');
    hideScreenDefaultPopup(popupAnchor);
}

function hideScreenDefaultPopup(popupAnchor) {
    if(popupAnchor.HasBubblePopup()) {
        popupAnchor.RemoveBubblePopup();
        popupAnchor.HideBubblePopup();
        popupAnchor.FreezeBubblePopup();
    }
}

function displayError(message) {
    setStatusMessage("Error: " + message);
}

function displayNotice(message) {
    setStatusMessage("Notice: " + message);
}

function setStatusMessage(message, hide, shake) {
    if (typeof hide == "undefined") {
        hide = true;
    }
  
    if (typeof shake == "undefined") {
        shake = false;
    }
    
    statusEl = null;
    
    if(currentScreenIsLogin()) {
        statusEl = $('#login_screen_status_message')
    } else if(currentScreenIsMenu()) {
        statusEl = $('#menu_screen_status_message');
    } else {
        niceAlert(message);
    }
    
    afterFunction = null;
    
    if(hide) {
        afterFunction = function() {
            setTimeout(function(){
                hideStatusMessage();
            }, 3000);
        };
    }
    
    if(statusEl && shake) {
        shakeFunction = function() {
            statusEl.effect("shake", {
                times:3,
                distance: 3
            }, 80);
        };
            
        setTimeout(shakeFunction, 500);
    }
    
    if(statusEl) {
        statusEl.fadeIn('fast', afterFunction);
        statusEl.html(message);
    } else {
        afterFunction();
    }
}

function hideStatusMessage() {
    if(currentScreenIsLogin()) {
        statusEl = $('#login_screen_status_message')
    } else if(currentScreenIsMenu()) {
        statusEl = $('#menu_screen_status_message');
    } else {
        hideNiceAlert();
        return;
    }
    
    if(statusEl) {
        statusEl.fadeOut();
    }
}

function niceAlert(message, title) {
    if (typeof title == "undefined") {
        title = "Alert!";
    }
    
    ModalPopups.Alert('niceAlertContainer',
        title, "<div id='nice_alert'>" + message + "</div>",
        {
            okButtonText: 'OK',
            onOk: "hideNiceAlert()"
        });
}

function hideNiceAlert() {
    ModalPopups.Close('niceAlertContainer');
}

function showLoginScreen() {
    clearNavTitle();
    hideAllScreens();
    $('#landing').show();
    loginRecptScroll();
}

function showMenuScreen() {
    clearNavTitle();
    hideNavBackLinkMenuScreen();
    hideAllScreens();
    
    //show the menu screen as default subscreen
    showMenuItemsSubscreen();
    
    $('#menu_screen').show();
}

function showTablesScreen() {
    setNavTitle("Table Selection");
    showNavBackLinkMenuScreen();
    hideAllScreens();
    $('#table_select_screen').show();
    initTableSelectScreen();
}

function showTotalsScreen() {
    setNavTitle("Sub Total");
    hideAllScreens();
    $('#total_screen').show();
}

function showMoreOptionsScreen() {
    hideAllScreens();
    $('#more_options').show();
    
    //add a hash so that the history buttons work in admin
    window.location.hash = "#screen=more_options";
}

function showCashReportsScreen() {
    hideAllScreens();
    $('#cash_reports_screen').show();
}

function showFloatScreen() {
    hideAllScreens();
    $('#float_screen').show();
}

function showMobileScreen() {
    hideAllScreens();
    $('#mobile_screen').show();
}

function hideAllScreens() {
    $('#landing').hide();
    $('#menu_screen').hide();
    $('#table_select_screen').hide();
    $('#total_screen').hide();
    $('#more_options').hide();
    $('#cash_reports_screen').hide();
    $('#float_screen').hide();
    $('#mobile_screen').hide();
}

function currentScreenIsMenu() {
    return $('#menu_screen').is(":visible");
}

function currentScreenIsLogin() {
    return $('#landing').is(":visible");
}

function currentScreenIsTotals() {
    return $('#total_screen').is(":visible");
}

function currentScreenIsCashReports() {
    return $('#cash_reports_screen').is(":visible");
}

function currentScreenIsCashReports() {
    return $('#float_screen').is(":visible");
}

function showNavBackLinkMenuScreen() {
    $('#nav_back_link').show();
    $('#nav_back_link').click(function() {
        showMenuScreen(); 
    });
}

function hideNavBackLinkMenuScreen() {
    $('#nav_back_link').hide();
}

function doCoinCounterTotal() {
    totalAmountInputAmount = utilCounterParent.find('.total_amount_input').val();
    
    if(totalAmountInputAmount > 0) {
        utilCounterTotalCalculated(totalAmountInputAmount);
        return;
    }
    
    valArray = new Array('10000', '5000', '2000', '1000', '500', '200', '100', '50', '20', '10', '5');
    
    var sum = 0;
    
    for(i=0; i<valArray.length; i++) {
        amount = utilCounterParent.find('.coin_quantity_' + valArray[i]).val();
        
        if(amount == "" || isNaN(amount)) {
            amount = 0;
        }
        
        //set the amount for this row on the widget
        utilCounterParent.find('#coin_amount_' + valArray[i]).html(currency((parseFloat(amount) * parseFloat(valArray[i]))/100));
        
        sum += ((parseFloat(amount) * parseFloat(valArray[i]))/100);
    }
    
    utilCounterParent.find('#coin_counter_total_amount').html(currency(sum));
    utilCounterTotalCalculated(sum);
}

var toggleKeyboardEnable= true;

function toggleUtilKeyboard() {
    
    if(!toggleKeyboardEnable) {
        setStatusMessage("Toggling Keyboard disabled for this screen!");
        return;
    }
    
    if($('#util_keyboard_container').is(":visible")) {
        $('#util_keyboard_container').slideUp(200);
    } else {
        $('#util_keyboard_container').slideDown(200);
    }
}

function doWriteToLastActiveInput(val) {
    if(lastActiveElement) {
        lastActiveElement.val(lastActiveElement.val() + val);
    }
}

function doTabLastActiveInput() {
    if(lastActiveElement) {
        lastActiveElement.focusNextInputField();
    }
}

function doDeleteCharLastActiveInput() {
    oldVal = lastActiveElement.val();
    newVal = oldVal.substring(0, oldVal.length - 1);
    
    lastActiveElement.val(newVal);
}

$.fn.focusNextInputField = function() {
    return this.each(function() {
        var fields = $(this).parents('form:eq(0),body').find('button,input,textarea,select');
        var index = fields.index( this );
        if ( index > -1 && ( index + 1 ) < fields.length ) {
            fields.eq( index + 1 ).focus();
        }
        return false;
    });
};

function initNavTitle(navTitle) {
    if(navTitle.length>0) {
        setNavTitle(navTitle);
    } else {
        clearNavTitle();
    }
}

function setNavTitle(navTitle) {
    $('#nav_title').html(navTitle);
    $('#nav_title').show();
}

function clearNavTitle() {
    $('#nav_title').html("");
    $('#nav_title').hide();
}

function initBeep() {
    $("#js_player").jPlayer( {
        ready: function () {
            $(this).jPlayer("setMedia", {
                mp3: "/sounds/beep.mp3"
            });
        },
        swfPath: "/swf"
    });

    $('.button').live("click", function() {
        playButtonClickSound();
    });
    
    $(".li").each(function() {
        $(this).click(function() {
            playButtonClickSound();
        });
    });
    
    $('.item').live("click", function() {
        playButtonClickSound();
    });
    
    $('.key').live("click", function() {
        playButtonClickSound();
    });
}

function playButtonClickSound() { 
    $("#js_player").jPlayer("play");
}

jQuery.parseQuery = function(qs,options) {
    var q = (typeof qs === 'string'?qs:window.location.search), o = {
        'f':function(v){
            return unescape(v).replace(/\+/g,' ');
        }
    }, options = (typeof qs === 'object' && typeof options === 'undefined')?qs:options, o = jQuery.extend({}, o, options), params = {};
    jQuery.each(q.match(/^\??(.*)$/)[1].split('&'),function(i,p){
        p = p.split('=');
        p[1] = o.f(p[1]);
        params[p[0]] = params[p[0]]?((params[p[0]] instanceof Array)?(params[p[0]].push(p[1]),params[p[0]]):[params[p[0]],p[1]]):p[1];
    });
    return params;
}

function inAdminContext() {
    return $('body div.admin').length > 0;
}

function inMenuContext() {
    return $('body div.menu').length > 0;
}

var activePopupElSet = null;

function registerPopupClickHandler(popupEl, outsideClickHandler) {
    activePopupElSet = $(popupEl);
    
    //must have a slight delay so that the click that showed the popup doesn't close it
    setTimeout(function(){
        $("body").click(function(eventObj) {
            if(activePopupElSet && (activePopupElSet.has(eventObj.target).length == 0)) {
                outsideClickHandler();
            }
        });
    }, 500);
}

function hideBubblePopup(popupEl) {
    if(typeof(popupEl) != 'undefined') {
        popupEl.HideBubblePopup();
        popupEl.FreezeBubblePopup();
        $("body").unbind('click');
        activePopupElSet = null;
    }
}

function initUIElements() {
    //initialize the tabs
    $(".vtabs").jVertTabs({
        select: function(index){
            initScrollPanes();
            initCheckboxes();
        }
    });
    
    //initialize scroll panes
    initScrollPanes();
        
    //initialize checkboxes
    initCheckboxes();
    
    //init radio buttons
    initRadioButtons();
    
    //initialize drop downs
    
    //table select dropdown, first init then get reference
    $("#table_select_input").mcDropdown("#table_select", {
        maxRows: 6
    });
    tableSelectMenu = $("#table_select_input").mcDropdown();
}

function initScrollPanes() {
    //init all the scroll panes
    setTimeout(function() {
        $('.jscrollpane, .admin #content_container section:not(.no_scroll_pane)').jScrollPane({
            showArrows: true
        });
    }, 500);
}

function initCheckboxes() {
    $(':checkbox:not(.no_iphone_style)').iphoneStyle({
        resizeContainer: false, 
        resizeHandle : false, 
        checkedLabel: 'Yes', 
        uncheckedLabel: 'No'
    });
}

function initRadioButtons() {
    $(':radio:not(.no_iphone_style)').iButton({
        labelOn: "On", 
        labelOff: "Off"
    });
}

function getSelectedOrLastReceiptItem() {
    if(!currentSelectedReceiptItemEl) {
        currentSelectedReceiptItemEl = $('#till_roll > div.order_line:last');
    
        if(currentSelectedReceiptItemEl.length == 0) {
            setStatusMessage("There are no receipt items!");
            return null;
        }
    }
    
    return currentSelectedReceiptItemEl;
}

function getLastReceiptItem() {
    currentSelectedReceiptItemEl = $('#till_roll > div.order_line:last');
    
    if(currentSelectedReceiptItemEl.length == 0) {
        setStatusMessage("There are no receipt items!");
        return null;
    }
    
    return currentSelectedReceiptItemEl;
}

function hideAllMenuSubScreens() {
    $('#menu_container').hide();
    
    $('#sales_button_' + modifyOrderItemButtonID).removeClass("selected");
    $('#order_item_additions').hide();
}

function currentMenuSubscreenIsMenu() {
    return $('#menu_container').is(":visible");
}

function currentMenuSubscreenIsModifyOrderItem() {
    return $('#order_item_additions').is(":visible");
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
        $('#sales_button_' + modifyOrderItemButtonID).addClass("selected");
        $('#oia_tab_add').click();
        $('#order_item_additions').show();
        $('#order_item_additions #add_note').hide();
        $('#order_item_additions #oia_container').show();
    }
}

function initModifierGrid() {
    //set the width of each grid item
    var rowWidth = $('div#order_item_additions .grid_row:first').css("width");
    
    var newWidth = roundNumberDown(parseFloat(rowWidth)/modifierGridXSize, 0) - 4;
    
    $('div#order_item_additions .grid_row .grid_item').css("width", newWidth + "px");
    
    var panelHeight = $('div#order_item_additions').css("height");
    
    //take away the height of the tabs
    panelHeight = parseFloat(panelHeight) - parseFloat($('#oia_tabs .tab').css("height"));
    
    var newHeight = roundNumberDown(panelHeight/modifierGridYSize, 0) - 4;
    
    $('div#order_item_additions .grid_row .grid_item').css("height", newHeight + "px");
}

function initNoteScreenKeyboard() {
    toggleKeyboardEnable = false;
    
    var keyboardPlaceHolderEl = $('#add_note #keyboard')
    
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
}

function resetKeyboard() {
    toggleKeyboardEnable = true;
    
    $("#util_keyboard_container").css( {
        "position" : "fixed",
        "width" : "100%",
        "top" : "inherit",
        "bottom" : "0px",
        "left" : "0px"
    } );
    
    $('#close_keyboard_link').show();
    $("#util_keyboard_container").hide();
}

function placeUtilKeyboard(keyboardPlaceHolderEl) {
    toggleKeyboardEnable = false;
    
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
}

//this is used to fetch the login screen receipt, not the printed one
function fetchOrderReceiptHTML() {
    totalOrder = currentOrder = getCurrentOrder();
    
    orderReceiptHTML = fetchFinalReceiptHeaderHTML();
    
    allOrderItemsRecptHTML = getAllOrderItemsReceiptHTML(currentOrder, false, false, true);
    
    orderReceiptHTML += clearHTML + allOrderItemsRecptHTML;
    
    subTotal = currentOrder.total;
    
    if(currentOrder.discount_percent) {
        //calculate the amount of discount
        preDiscountAmount = currentOrder.pre_discount_price;
        
        orderReceiptHTML += clearHTML + "<div class='whole_order_discount'>";
        orderReceiptHTML += "Discounted " + currentOrder.discount_percent + "% from " + currency(preDiscountAmount) + "</div>";
    } 
    
    orderReceiptHTML += "<div class='data_table'>";
    
    subTotal = currentOrder.total;
    orderReceiptHTML += "<div class='label'>Sub-Total:</div><div class='data'>" + currency(subTotal) + "</div>" + clearHTML;
    
    orderReceiptHTML += "</div>" + clearHTML;
    
    return orderReceiptHTML;
}

//this fetches the html for the order receipt that gets printed
function printItemsFromOrder(serverNickname, terminalID, orderJSON, items) {
    var allOrderItemsReceiptHTML = getPrintedOrderReceiptHeader(serverNickname, terminalID, orderJSON);

    for(i=0; i<items.length; i++) {
        var item = items[i];
        allOrderItemsReceiptHTML += getLineItemHTMLForPrintedOrderReceipt(item);
    }
    
    printReceipt(allOrderItemsReceiptHTML, false);
}

function getLineItemHTMLForPrintedOrderReceipt(orderItem) {
    var lineItemHTMLForOrder = "<div class='order_line'>";
    
    //we don't show the amount for the order receipt
    lineItemHTMLForOrder += "<div class='amount'>" + orderItem.amount + "</div>";
    
    lineItemHTMLForOrder += "<div class='name'>" + orderItem.product.name + "</div>";
    
    //we don't show the total for the order receipt
    lineItemHTMLForOrder += "<div class='total'>&nbsp;</div>";
    
    if(orderItem.modifier) {
        lineItemHTMLForOrder += "<div class='clear'>&nbsp;</div>";
        lineItemHTMLForOrder += "<div class='modifier_name'>" + orderItem.modifier.name + "</div>" + clearHTML;
    }
    
    if(orderItem.oia_items) {
        for(j=0; j<orderItem.oia_items.length; j++) {
            oia_is_add = orderItem.oia_items[j].is_add;
            
            if(!orderItem.oia_items[j].is_note) {
                lineItemHTMLForOrder += "<div class='oia_add'>" + (oia_is_add ? "Add" : "No") + "</div>";
            }
            
            lineItemHTMLForOrder += "<div class='oia_name " + (orderItem.oia_items[j].is_note ? "note" : "") + "'>" + orderItem.oia_items[j].description + "</div>";            
            lineItemHTMLForOrder += clearHTML;
        }
    }
    
    lineItemHTMLForOrder += "</div>" + clearHTML;
    
    return lineItemHTMLForOrder;
}

function getPrintedOrderReceiptHeader(serverNickname, terminalID, orderJSON) {
    headerHTML = "<div id='order_receipt_header'>";
    
    orderNum = orderJSON.order_num;
    
    if(typeof(orderNum) != 'undefined') {
        headerHTML += "<div class='order_num'>ORDER NO: " + orderNum + "</div>" + clearHTML;
    }
    
    headerHTML += "<div class='data_table'>";
    
    tableLabel = orderJSON.table;
    headerHTML += "<div class='label'>Table:</div><div class='data'>" + tableLabel + "</div>" + clearHTML;
    
    headerHTML += "<div class='label'>Order By:</div><div class='data'>" + serverNickname + "</div>" + clearHTML;
    
    headerHTML += "</div>" + clearHTML;
    
    timestamp = utilFormatDate(new Date());
    headerHTML += "<div class='time data'>" + timestamp + "</div>";
    
    headerHTML += "<div class='terminal'>" + terminalID + "</div>" + clearHTML;
    
    headerHTML += "</div>" + clear10BottomBorderHTML + clear10HTML;
    
    return headerHTML;
}

function fetchCashScreenReceiptTotalsDataTable() {
    cashScreenReceiptTotalsDataTableHTML = "<div class='data_table'>";
    
    if(totalOrder.discount_percent) {
        subTotal = totalOrder.pre_discount_price;
        cashScreenReceiptTotalsDataTableHTML += "<div class='label'>Sub-Total:</div><div class='data'>" + currency(subTotal) + "</div>" + clearHTML;
        
        discountAmount = (totalOrder.pre_discount_price * totalOrder.discount_percent)/100;
        cashScreenReceiptTotalsDataTableHTML += "<div class='label'>Discount " + totalOrder.discount_percent + "%:</div><div class='data'>" + currency(discountAmount) + "</div>" + clearHTML;
    } else {
        subTotal = totalOrder.total;
        cashScreenReceiptTotalsDataTableHTML += "<div class='label'>Sub-Total:</div><div class='data'>" + currency(subTotal) + "</div>" + clearHTML;
        
        discountAmount = 0;
    } 
    
    cashScreenReceiptTotalsDataTableHTML += taxChargable ? fetchTotalsHTMLWithTaxChargable("Balance Due") : fetchTotalsWithoutTaxChargableHTML("Balance Due");
    cashScreenReceiptTotalsDataTableHTML += clearHTML;
    
    cashScreenReceiptTotalsDataTableHTML += "</div>" + clearHTML; 
    
    return cashScreenReceiptTotalsDataTableHTML;
}

function fetchCashScreenReceiptHTML() {
    cashScreenReceiptHTML = fetchCashScreenReceiptHeaderHTML() + clearHTML;
    cashScreenReceiptHTML += getAllOrderItemsReceiptHTML(totalOrder, false, false, true) + clearHTML;
    //cashScreenReceiptHTML += fetchCashScreenReceiptTotalsDataTable();
    
    return cashScreenReceiptHTML;
}

function fetchFinalReceiptHTML(includeBusinessInfo, includeServerAddedText) {
    if(typeof(includeBusinessInfo) == 'undefined') {
        includeBusinessInfo = false;
    }
    
    if(typeof(includeServerAddedText) == 'undefined') {
        includeServerAddedText = true;
    }
    
    finalReceiptHTML = "";
    
    if(includeBusinessInfo) {
        finalReceiptHTML += fetchBusinessInfoHeaderHTML();
    }
    
    finalReceiptHTML += fetchFinalReceiptHeaderHTML();
    
    allOrderItemsRecptHTML = getAllOrderItemsReceiptHTML(totalOrder, false, false, includeServerAddedText);
    
    finalReceiptHTML += clearHTML + allOrderItemsRecptHTML;
    
    finalReceiptHTML += "<div class='data_table'>";
    
    if(totalOrder.discount_percent) {
        subTotal = totalOrder.pre_discount_price;
        
        finalReceiptHTML += "<div class='label'>Sub-Total:</div><div class='data'>" + currency(subTotal) + "</div>" + clearHTML;
        
        //calculate the amount of discount
        discountAmount = (totalOrder.pre_discount_price * totalOrder.discount_percent)/100;
        finalReceiptHTML += "<div class='label'>Discount " + totalOrder.discount_percent + "%:</div><div class='data'>" + currency(discountAmount) + "</div>" + clearHTML;
    } else {
        subTotal = totalOrder.total;
        finalReceiptHTML += "<div class='label'>Sub-Total:</div><div class='data'>" + currency(subTotal) + "</div>" + clearHTML;
        discountAmount = 0;
    } 
    
    finalReceiptHTML += taxChargable ? fetchTotalsHTMLWithTaxChargable() : fetchTotalsWithoutTaxChargableHTML();
    
    if(totalOrder.cashback > 0) {
        finalReceiptHTML += "<div class='label'>Cashback:</div><div class='data'>" + currency(totalOrder.cashback) + "</div>" + clearHTML;
    }
    
    cashTendered = totalOrder.cash_tendered;
    
    if(cashTendered > 0) {
        finalReceiptHTML += "<div class='label'>Cash:</div><div class='data'>" + currency(cashTendered) + "</div>" + clearHTML;
    }
    
    change = totalOrder.change;

    if(change > 0) {
        finalReceiptHTML += "<div class='label'>Change:</div><div class='data'>" + currency(change) + "</div>" + clearHTML;
    }
    
    finalReceiptHTML += "</div>" + clearHTML;
    
    return finalReceiptHTML;
}

// you must set dicountAmount and subTotal before this funciton is called
function fetchTotalsHTMLWithTaxChargable(totalLabelText) {
    if(typeof(totalLabelText) == 'undefined') {
        totalLabelText = "Total";
    }
    
    //write the tax total
    taxAmount = ((subTotal - discountAmount) * globalTaxRate)/100;
    totalsHTML = "<div class='label'>" + taxLabel + " " + globalTaxRate + "%:</div><div class='data'>" + currency(taxAmount) + "</div>" + clearHTML;
        
    totalsHTML += fetchServiceChargeHTML();
    
    //finally add up the total from the generated values above to avoid rounding errors
    total = (subTotal - discountAmount) + serviceCharge + taxAmount;
    currentTotalFinal = total;
    
    //temporarily set the totalFinal
    totalOrder.totalFinal = total;
    
    totalsHTML += "<div class='label bold'>" + totalLabelText + ":</div><div class='data bold total_container'>" + currency(total) + "</div>" + clearHTML;
    
    return totalsHTML;
}

// you must set dicountAmount and subTotal before this funciton is called
function fetchTotalsWithoutTaxChargableHTML(totalLabelText) {
    if(typeof(totalLabelText) == 'undefined') {
        totalLabelText = "Total";
    }
    
    totalsHTML = fetchServiceChargeHTML();
    
    //finally add up the total from the generated values above to avoid rounding errors
    total = (subTotal - discountAmount) + serviceCharge;
    
    currentTotalFinal = total;
    
    //temporarily set the totalFinal
    totalOrder.totalFinal = total;
    
    totalsHTML += "<div class='label bold'>" + totalLabelText + ":</div><div class='data bold total_container'>" + currency(total) + "</div>" + clearHTML;
    
    return totalsHTML;
}

function fetchServiceChargeHTML() {
    serviceChargeHTML = "";
    
    //is there a service charge set?
    if(serviceCharge>0) {
        serviceChargeHTML += "<div class='label'>" + serviceChargeLabel + ":</div><div class='data'>" + currency(serviceCharge) + "</div>" + clearHTML;
    }
    
    return serviceChargeHTML;
}

function fetchBusinessInfoHeaderHTML() {
    businessInfoHeaderHTML = "<div class='business_info'>";
    businessInfoHeaderHTML += "<div class='business_name'>" + business_name + "</div>";
    businessInfoHeaderHTML += "<div class='business_address'>" + business_address + "</div>";
    businessInfoHeaderHTML += "<div class='business_telephone'>" + business_telephone + "</div>";
    businessInfoHeaderHTML += "<div class='business_email_address'>" + business_email_address + "</div>";
    businessInfoHeaderHTML += "</div>";
  
    return businessInfoHeaderHTML;
}

function fetchFinalReceiptHeaderHTML() {
    headerHTML = "<div class='data_table'>";
    
    server = firstServerNickname(totalOrder);
    
    if(server) {
        headerHTML += "<div class='label'>Server:</div><div class='data'>" + server + "</div>" + clearHTML;
    }
    
    //alert("Time: " + totalOrder.time);
    
    //lazy init the order time of totalling
    if(typeof(totalOrder.time) == 'undefined') {
        totalOrder.time = new Date().getTime();
    }
    
    timestamp = utilFormatDate(new Date(totalOrder.time));
    
    headerHTML += "<div class='time label'>Time:</div><div class='time data'>" + timestamp + "</div>" + clearHTML;
    
    if(totalOrder.table) {
        headerHTML += "<div class='label'>Table:</div><div class='data'>" + totalOrder.table + "</div>" + clearHTML;
    }
    
    if(typeof(totalOrder.payment_method) != 'undefined') {
        headerHTML += "<div class='label'>Payment Method:</div><div class='data'>" + totalOrder.payment_method + "</div>" + clearHTML;
    }
    
    orderNum = totalOrder.order_num;
        
    if(typeof(orderNum) != 'undefined') {
        headerHTML += "<div class='label'>Order Number:</div><div class='data'>" + orderNum + "</div>" + clearHTML;
    }
    
    headerHTML += "</div>";
    
    return headerHTML;
}

function fetchCashScreenReceiptHeaderHTML() {
    headerHTML = "<div class='data_table'>";
    headerHTML += "<div class='label'>Server:</div><div class='data'>" + current_user_nickname + "</div>" + clearHTML;
    
    timestamp = utilFormatDate(new Date(parseInt(orderStartTime(totalOrder))));
    headerHTML += "<div class='time label'>Time Started:</div><div class='time data'>" + timestamp + "</div>" + clearHTML;
    
    if(selectedTable!=0) {
        selectedTableLabel = tables[selectedTable].label;
        headerHTML += "<div class='label'>Table:</div><div class='data'>" + selectedTableLabel + "</div>" + clearHTML;
    }
    
    orderNum = totalOrder.order_num;
    
    if(typeof(orderNum) != 'undefined') {
        headerHTML += "<div class='label'>Order Number:</div><div class='data'>" + orderNum + "</div>" + clearHTML;
    }
    
    headerHTML += "</div>";
    
    return headerHTML;
}

function getTillRollDiscountHTML(order) {
    if(order.discount_percent && parseFloat(order.discount_percent) > 0) {
        preDiscountPrice = order.pre_discount_price;
        
        preDiscountFormatted = currency(preDiscountPrice);
        
        discountAmountFormatted = currency(order.pre_discount_price - order.total);
        
        tillRollDiscountHTML = clearHTML + "<div class='data_table'><div class='label'>Sub-Total</div>";
        tillRollDiscountHTML += "<div class='data'>" + preDiscountFormatted + "</div>";
        tillRollDiscountHTML += "<div class='label'>Discount - " + order.discount_percent + "%</div>";
        tillRollDiscountHTML += "<div class='data'>" + discountAmountFormatted + "</div>" + clearHTML + "</div>";
    } else {
        tillRollDiscountHTML = "";
    }
    
    return tillRollDiscountHTML;
}

function printReceipt(content, printRecptMessage) {
    setStatusMessage("Printing Receipt!");
    
    if(printRecptMessage) {
        receiptMessageHTML = "<div id='receipt_message'>" + receiptMessage + "</div>";
        content += clearHTML + receiptMessageHTML;
    }
    
    //add space and a dot so we print a bottom margin
    content += clear30HTML + "<div class='the_dots'>.  .  .</div>";
    
    print(content);
}

function print(content) {
    $('#printFrame').contents().find('#till_roll').html(content);
    
    printFrame.focus();
    printFrame.print();
}

function clearReceipt() {
    $('#till_roll').html('');
    $('#total_value').html(currency(0));
    $('#till_roll_discount').html('');
}

function setLoginReceipt(title, contentHTML) {
    //set the login receipt html
    $('#login_receipt_header').html(title);
    $('#login_till_roll').html(contentHTML);
    
    receiptData = JSON.stringify({
        'title':title, 
        'contentHTML':contentHTML
    });
    
    storeKeyValue("last_sale", receiptData);
}

function clearLoginReceipt() {
    $('#login_receipt_header').html("Receipt");
    $('#login_till_roll').html("");
}

function getLastSaleInfo() {
    saleData = retrieveStorageValue("last_sale");
    
    if(saleData != null) {
        return JSON.parse(saleData);
    } else {
        return null;
    }
}

//this loads up the last receipt that a user was looking at before logging out
function displayLastReceipt() {
    var lastReceiptID = fetchLastReceiptID();

    //set the select item
    tableSelectMenu.setValue(lastReceiptID);
    doSelectTable(lastReceiptID); 
}

function getCurrentRecptHTML() {
    return fetchOrderReceiptHTML();
}

function doQuickLogin(user_id) {
    //load the users index in the array
    for (var i = 0; i < employees.length; i++){
        id = employees[i].id;
        if(id == user_id) {
            user_index = i;
            break;
        }
    }
        
    //check the global setting first to see if the user can log in without a pin
    //if this setting is set to false, then it overrides all granular settings
    //if it is true, then check the role of the user
    
    var allowedQuickLogin = null;
    
    if(bypassPin) {
        //check the users role
        rolePinRequired = employees[user_index].pin_required;
        
        allowedQuickLogin = !rolePinRequired;
    } else {
        allowedQuickLogin = false;
    }
    
    if(allowedQuickLogin) {
        login_code = employees[user_index].passcode;
        $('#num').val(login_code);
        doLogin();
    } else {
        setStatusMessage("Enter PIN!", false, true);
    }
}

function loginScreenKeypadClick(val) {
    newVal = $('#num').val().toString() + val;
    $('#clockincode_show').html(newVal);
    $('#num').val(newVal);
}

function doCancelLoginKeypad() {
    oldVal = $('#num').val().toString();
    newVal = oldVal.substring(0, oldVal.length - 1);
    $('#clockincode_show').html(newVal);
    $('#num').val(newVal);
}

function doLogin() {
    entered_code = $('#num').val();
    
    if(current_user_id != null) {
        //already logged in
        displayError("You are already logged in. Please log out!");
        return;
    }

    for (var i = 0; i < employees.length; i++) {
        passcode = employees[i].passcode;
        
        if(entered_code == passcode) {
            nickname = employees[i].nickname;
                
            if(employees[i]['clocked_in']) {
                id = employees[i].id
                is_admin = employees[i].is_admin;
                loginSuccess(id, nickname, is_admin, passcode);
                return;
            } else {
                setStatusMessage("User " + nickname + " is not clocked in!", true, true);
                clearCode();
                return;
            }
        }
    }

    loginFailure();
}

function doLogout() {
    if(current_user_id == null) {
        //not logged in
        return;
    }

    current_user_id = null;

    showLoginScreen();
    
    clearCode();

    //hide the red x 
    $('#nav_save_button').hide();

    $('#e_name').hide();

    //send ajax logout
    $.ajax({
        type: 'POST',
        url: '/logout'
    });
}

function doClockin() {
    entered_code = $('#num').val();
    
    if(employees.length==0) {
        setStatusMessage("Please try again... system initializing...");
        return;
    }

    for (var i = 0; i < employees.length; i++){
        id = employees[i].id
        nickname = employees[i].nickname
        
        clockinCode = employees[i].clockin_code;

        is_admin = employees[i].is_admin;

        if(entered_code == clockinCode) {
            if(employees[i]['clocked_in']) {
                setStatusMessage(nickname + " is already clocked in!");
                clearCode();
                return;
            }
            
            //mark the user as clocked in
            employees[i]['clocked_in'] = true;
            
            clockinSuccess(id, nickname);
            return;
        }
    }

    clockinFailure();
}

function doClockout() {
    entered_code = $('#num').val();
    
    for (var i = 0; i < employees.length; i++){
        id = employees[i].id
        nickname = employees[i].nickname
        
        clockinCode = employees[i].clockin_code;

        is_admin = employees[i].is_admin;

        if(entered_code == clockinCode) {
            if(employees[i]['clocked_in'] == false) {
                clockoutFailure();
                return;
            }
            
            //mark the user as clocked out
            employees[i]['clocked_in'] = false;
            
            clockoutSuccess(id, nickname);
            return;
        }
    }

    clockoutFailure();
}

function clockinSuccess(id, nickname) {
    clearCode();
    
    setStatusMessage(nickname + " clocked in successfully!");
    
    //send ajax logout
    $.ajax({
        type: 'POST',
        url: '/clockin',
        data: {
            id : id
        }
    });
}

function clockoutSuccess(id, nickname) {
    clearCode();
    
    setStatusMessage(nickname + " clocked out successfully!");
    
    //send ajax clockout
    $.ajax({
        type: 'POST',
        url: '/clockout',
        data: {
            id : id
        }
    });
}

function loginSuccess(id, nickname, is_admin, passcode) {
    //send ajax login
    $.ajax({
        type: 'POST',
        url: '/login',
        data: {
            id : id
        }
    });

    showingPassCodeDialog = false;
    
    current_user_id = id;
    current_user_nickname = nickname;
    current_user_is_admin = is_admin;
    current_user_passcode = passcode;
    
    //set the username in the menu
    $('#e_name').html(nickname);
    
    hideStatusMessage();
    
    showMenuScreen();
    
    //show the red x 
    $('#nav_save_button').show();
    
    $('#e_name').show();

    loadCurrentOrder();
    
    //load the users personal receipt on login
    tableSelectMenu.setValue(0);
    doSelectTable(0);
    
    loadFirstMenuPage();
    
    //initialise the options buttons
    initOptionButtons();
    
    trySendOutstandingOrdersToServer();
    
    //finally, if the default screen to show 
    //after login is the tables screen then show it!
    if(defaultPostLoginScreen == TABLES_SCREEN) {
        showTablesScreen();
    }
    
    clearCode();
    
    //dont show the previous order dropdown if there is none in memory
    if(havePreviousOrder(current_user_id)) {
        $('#previous_order_select_item').show();
    } else {
        $('#previous_order_select_item').hide();
    }
}

function clockinFailure() {
    //set an error message in the flash area
    setStatusMessage("Wrong clock in code!", true, true);

    clearCode();
}

function clockoutFailure() {
    //set an error message in the flash area
    setStatusMessage("You are either not clocked in, or entered the wrong code!", true, true);

    clearCode();
}

function loginFailure() {
    //set an error message in the flash area
    setStatusMessage("Wrong pass code!", true, true);

    clearCode();
}

function clearCode() {
    $('#num').val("");
    $('#clockincode_show').html("");
}

function getCashTotalDataTable(cash_total_data, show_currency) {
    if(typeof(show_currency) == "undefined") {
        show_currency = true
    }
    
    cash_total_data_html = "<div class='data_table'>";
    
    for(i=0; i<cash_total_data.length; i++) {
        cash_total_data_html += "<div class='label'>" + cash_total_data[i][0] + "</div>";
        cash_total_data_html += "<div class='data'>" + (show_currency && (!isNaN( parseFloat(cash_total_data[i][1]))) ? currency(cash_total_data[i][1]) : cash_total_data[i][1]) + "</div>" + clearHTML;
    }
    
    cash_total_data_html += "</div>";
    
    return cash_total_data_html;
}

function getCashTotalTaxesDataTable(taxes_data) {
    cash_total_data_html = "<div class='taxes_data_table'>";
    
    cash_total_data_html += "<div class='taxes_data_table_label_header'>Rate</div>";
    cash_total_data_html += "<div class='taxes_data_table_header'>Net</div>";
    cash_total_data_html += "<div class='taxes_data_table_header'>" + taxLabel + "</div>";
    cash_total_data_html += "<div class='taxes_data_table_header'>Gross</div>" + clear10HTML;
        
    for(i=0; i<taxes_data.length; i++) {
        cash_total_data_html += "<div class='taxes_label'>" + taxes_data[i][0] + "%</div>";
        cash_total_data_html += "<div class='taxes_data'>" + currency(taxes_data[i][1]) + "</div>";
        cash_total_data_html += "<div class='taxes_data'>" + currency(taxes_data[i][2]) + "</div>";
        cash_total_data_html += "<div class='taxes_data'>" + currency(taxes_data[i][3]) + "</div>" + clearHTML;
    }
    
    cash_total_data_html += "</div>";
    
    return cash_total_data_html;
}

function getCashTotalDataTableTotals(label, data) {
    totals_html = "<div class='totals_data_table'>";
    totals_html += "<div class='totals_label'>" + label + "</div>";
    
    total = 0;
    
    for(i=0; i<data.length; i++) {
        total += parseFloat(data[i][1]);
    }
    
    totals_html += "<div class='totals_data'>" + currency(total) + "</div></div>" + clearHTML;
    
    return totals_html;
}

function getCashTotalTaxesDataTableTotals(label, data) {
    taxes_totals_html = "<div class='taxes_totals_data_table'>";
    taxes_totals_html += "<div class='taxes_totals_label'>" + label + "</div>";
    
    netTotal = 0;
    taxTotal = 0;
    grossTotal = 0;
    
    for(i=0; i<data.length; i++) {
        netTotal += parseFloat(data[i][1]);
        taxTotal += parseFloat(data[i][2]);
        grossTotal += parseFloat(data[i][3]);
    }
    
    taxes_totals_html += "<div class='taxes_totals_data'>" + currency(netTotal) + "</div>";
    taxes_totals_html += "<div class='taxes_totals_data'>" + currency(taxTotal) + "</div>";
    taxes_totals_html += "<div class='taxes_totals_data'>" + currency(grossTotal) + "</div>";
        
    taxes_totals_html += "</div>" + clearHTML;
    
    return taxes_totals_html;
}

var reportsCashCount = 0;
var currentTotalType = null;

function doCashTotalReport(total_type, commit) {
    setNavTitle(total_type + " Total");
    showNavBackLinkMenuScreen();
    
    $('#reports_left_till_roll').html("Loading...");
    $('#cash_total_data_table_container').html("Loading...");
    
    currentTotalType = total_type;
    
    if(typeof(commit) == "undefined") {
        show_currency = false
    }
    
    coinCounterPosition = $('#reports_coin_counter_widget_container');
    
    totalFunction = function(total) {
        reportsCashCount = total;
    };
    
    setUtilCoinCounter(coinCounterPosition, totalFunction);
    
    showCashReportsScreen();
    
    //initialize the zeros in the cash counter?
    if(reportsCashCount == 0) {
        doCoinCounterTotal();
    }
    
    $.ajax({
        type: 'POST',
        url: '/cash_total.js',
        data: {
            total_type : total_type,
            cash_count : reportsCashCount,
            commit : commit
        }
    });
    
    $.ajax({
        type: 'GET',
        url: '/cash_total_history.js'
    });
}

function saveCashReportCoinCount() {
    doCoinCounterTotal();
    doCashTotalReport(currentTotalType, false);
}

function cancelCashReportCoinCount() {
    reportsCashCount = 0;
    currentTotalType = null;
    showMenuScreen();
}

function cashReportsScreenKeypadClick(val) {
    lastActiveElement.val(lastActiveElement.val() + val);
}

function cashReportsScreenKeypadClickCancel() {
    oldVal = lastActiveElement.val();
    newVal = oldVal.substring(0, oldVal.length - 1);
    
    lastActiveElement.val(newVal);
}

function cashReportsScreenKeypadClickTab() {
    lastActiveElement.focusNextInputField();
}

function finishCashTotal() {
    $('#cash_totals_header_section').show();
    
    content = $('#reports_center_receipt').html() + clear10HTML;
    
    doCashTotalReport(currentTotalType, true);
    
    showMenuScreen();
    
    printReceipt(content, false);
    
    cash_totals_data_html_header_info = null;
    reportsCashCount = 0;
    currentTotalType = null;    
}

function saveFloatCoinCount() {
    doCoinCounterTotal();
    
    if(floatTotal > 0) {
        $.ajax({
            type: 'POST',
            url: '/add_float.js',
            data: {
                float_total : floatTotal
            }
        }); 
    }
    
    floatTotal = 0;
    showMenuScreen();
    setStatusMessage("Float Added!");
}

function cancelFloatCoinCount() {
    floatTotal = 0;
    showMenuScreen();
}

function floatScreenKeypadClick(val) {
    lastActiveElement.val(lastActiveElement.val() + val);
}

function floatScreenKeypadClickCancel() {
    oldVal = lastActiveElement.val();
    newVal = oldVal.substring(0, oldVal.length - 1);
    
    lastActiveElement.val(newVal);
}

function floatScreenKeypadClickTab() {
    lastActiveElement.focusNextInputField();
}

function getOpenOrdersTotal() {
    //save the current users table order to reload it after sync
    var savedTableID = selectedTable;
    
    var tableIDS = getActiveTableIDS();
    var total = 0;
    
    for(i = 0; i < tableIDS.length; i++) {
        getTableOrderFromStorage(current_user_id, tableIDS[i]);
    }
    
    for(i = 0; i < tableIDS.length; i++) {
        var orderTotal = tableOrders[parseInt(tableIDS[i])].total;
        total += orderTotal;
    }
    
    //now load back up the current users order it its not his personal receipt
    if(savedTableID != -1) {
        getTableOrderFromStorage(current_user_id, savedTableID);
    }
    
    return total;
}

function takeTendered() {
    cashTendered = getTendered();

    totalAmountInclCashback = currentTotalFinal + cashback;

    //calculate change and show the finish sale button
    change = cashTendered - totalAmountInclCashback;
    
    //as we calculate change dynamically, it could be negative while
    //it is being entered, so we must stop that
    if(change < 0) {
        change = 0;
    }
    
    $('#totals_change_value').html(currency(change, false));
}

var cashTendered;

function getTendered() {
    var val = cashTendered;    
    
    if(val > 0) {
        if(isNaN(parseFloat(val))) {
            val = 0;
        }
        
        var formattedVal = currency(val, false);
        $('#totals_tendered_value').html(formattedVal);
    }
    
    return val;
}

function finishSale() {
    cashTendered = getTendered();

    totalAmountInclCashback = roundNumber(currentTotalFinal + cashback, 2);

    if(cashTendered < totalAmountInclCashback) {
        setStatusMessage("Must enter a higher value than current total: " + currency(totalAmountInclCashback), true, true);
        resetTendered();
        return;
    }
    
    doTotalFinal();
}

function resetTendered() {
    cashTendered = 0;
    cashTenderedKeypadString = "";
    $('#totals_tendered_value').html("")
    $('#totals_change_value').html("");
}

function cashOutCancel() {
    resetTendered();
    showMenuScreen();
}

function paymentMethodSelected(method) {
    paymentMethod = method;
    $('#selected_payment_method_holder').html(paymentMethod);
    
    //highlight the button
    $('.payment_method_button').each(function() {
        $(this).removeClass('selected');
    });
    
    $('#' + method.replace(/ /g,"_") + '_payment_method_button').addClass('selected');
}

var cashTenderedKeypadString = "";

function totalsScreenKeypadClick(val) {
    //make sure you cannot enter a 3rd decimal place number
    if(cashTenderedKeypadString.indexOf(".") != -1) {
        if(cashTenderedKeypadString.length - cashTenderedKeypadString.indexOf(".") > 3) {
            return;
        }
    }
    
    cashTenderedKeypadString += val;
    cashTendered = parseFloat(cashTenderedKeypadString);
    takeTendered();
}

function totalsScreenKeypadClickDecimal() {
    if(cashTenderedKeypadString.indexOf(".") == -1) {
        cashTenderedKeypadString += ".";
    }
}

function totalsScreenKeypadClickCancel() {
    oldVal = $('#totals_tendered_value').html();
    newVal = oldVal.substring(0, oldVal.length - 1);
    
    if(newVal.length == 0) {
        newVal = "0";
    }
    
    cashTenderedKeypadString = newVal;
    cashTendered = parseFloat(cashTenderedKeypadString);
    takeTendered();
    
    $('#totals_tendered_value').html(newVal);
}

function moneySelected(amount) {
    $('#totals_change_value').html(currency(0, false));
    
    if(amount == -1) {
        totalAmountInclCashback = currentTotalFinal + cashback;
        newAmount = totalAmountInclCashback;
    } else {
        //add to amount tendered
        currentAmount = cashTendered;
    
        if(currentAmount.length == 0) {
            currentAmount = 0;
        }
        
        currentAmount = parseFloat(currentAmount);
    
        newAmount = parseInt(amount) + currentAmount;
    }
    
    newAmount = roundNumber(newAmount, 2);
    
    cashTenderedKeypadString = "" + newAmount;
    cashTendered = newAmount;
    takeTendered();
}

function togglePrintReceipt() {
    $.ajax({
        type: 'POST',
        url: '/admin/toggle_print_receipt.js'
    });
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