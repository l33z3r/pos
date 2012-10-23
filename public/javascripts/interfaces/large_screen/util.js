function havePreviousOrder(current_user_id) {
    var key = "user_" + current_user_id + "_table_" + previousOrderTableNum + "_current_order";
    var data = retrieveStorageValue(key);
    return data != null;
}

function haveSplitBillOrder(current_user_id) {
    var key = "user_" + current_user_id + "_table_" + tempSplitBillTableNum + "_current_order";
    var data = retrieveStorageValue(key);
    return data != null;
}

function showScreenFromHashParams() {
    hashParams = getURLHashParams();
    
    if(hashParams) {
        if(hashParams.screen) {
            //show login screen if no user logged in
            if(hashParams.screen == 'login' || current_user_id == null) {
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
    } else if(currentScreenIsTables()) {
        statusEl = $('#tables_screen_status_message');
    } else if(currentScreenIsDelivery()) {
        statusEl = $('#delivery_screen_status_message');
    } else if(currentScreenIsTotals()) {
        statusEl = $('#totals_screen_status_message');
    } else if(inKitchenContext()) {
        statusEl = $('#kitchen_screen_status_message');
    } else {
        niceAlert(message);
        return;
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
    } else if(currentScreenIsTables()) {
        statusEl = $('#tables_screen_status_message');
    } else if(currentScreenIsDelivery()) {
        statusEl = $('#delivery_screen_status_message');
    } else if(currentScreenIsTotals()) {
        statusEl = $('#totals_screen_status_message');
    } else if(inKitchenContext()) {
        statusEl = $('#kitchen_screen_status_message');
    } else {
        hideNiceAlert();
        return;
    }
    
    if(statusEl) {
        statusEl.fadeOut();
    }
}

function showLoginScreen() {
    clearNavTitle();
    hideAllScreens();
    $('#landing').show();
    
    //if a user has items on their table 0 receipt show it on their logo
    var userIDS = getClockedInUsersIDS();

    for (var i = 0; i < userIDS.length; i++) {
        var nextUserID = userIDS[i];
        
        var nextTable0Order = getOrderFromStorage(nextUserID);
        
        if(nextTable0Order && nextTable0Order.items && nextTable0Order.items.length > 0) {
            $('#employee_box_' + nextUserID).addClass("has_active_t0_items");
        } else {
            $('#employee_box_' + nextUserID).removeClass("has_active_t0_items");
        }
    }
    
    loginRecptScroll();
}

function showMenuScreen() {
    clearNavTitle();
    hideNavBackLinkMenuScreen();
    hideAllScreens();
    
    //show the menu screen as default subscreen
    showMenuItemsSubscreen();
    
    $('#menu_screen').show();
    
    if(menuScreenType == RESTAURANT_MENU_SCREEN) {
        //show the shortcut dropdown
        initMenuScreenNavItems();
    } else if(menuScreenType == RETAIL_MENU_SCREEN) {
        //show the shortcut dropdown
        $('#menu_screen_shortcut_dropdown_container').show();   
        $('#scan_upc').focus();
    }
    
    hideStatusMessage();
}

function showTablesScreen() {
    setNavTitle("Table Selection");
    
    $('#nav_back_link').unbind();
    
    showNavBackLinkMenuScreen();
    
    $('#nav_back_link').click(function() {
        inTransferOrderMode = false;
        inTransferOrderItemMode = false;
        $('#tables_screen_status_message').hide();
    });
    
    hideAllScreens();
    
    //hide the dropdown menu
    $('#menu_screen_shortcut_dropdown_container').hide();
        
    $('#table_select_screen').show();
    initTableSelectScreen();
}

function showUtilPaymentScreen() {
    setNavTitle("Make Payment");
    
    $('#nav_back_link').unbind();
    
    showNavBackLinkMenuScreen();
    
    $('#nav_back_link').click(function() {
        cancelUtilPayment();
    });
    
    hideAllScreens();
    
    //hide the dropdown menu
    $('#menu_screen_shortcut_dropdown_container').hide();
        
    $('#util_payment_screen').show();
}

function showSplitBillScreen() {
    setNavTitle("Split Bill");
    
    $('#nav_back_link').unbind();
    
    showNavBackLinkMenuScreen();
    
    $('#nav_back_link').click(function() {
        inSplitBillMode = true;
        cancelSplitBillMode();
    });
    
    hideAllScreens();
    
    //hide the dropdown menu
    $('#menu_screen_shortcut_dropdown_container').hide();
        
    $('#split_bill_screen').show();
}

function showTotalsScreen() {
    setNavTitle("Sub Total");
    hideAllScreens();
    $('#total_screen').show();
}

function showDeliveryScreen() {
    setNavTitle("Receive Delivery");
    hideAllScreens();
    $('#delivery_screen').show();
}

function showMoreOptionsScreen() {
    hideAllScreens();
    hideUtilKeyboard();
    $('#more_options').show();
    
    //hide the shortcut dropdown
    $('#menu_screen_shortcut_dropdown_container').hide();
        
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
    //make sure the keyboard from the add note screen is hidden
    resetKeyboard();
    
    //make sure dropdowns get closed
    menuScreenShortcutSelectMenu.closeMenu();
    tableSelectMenu.closeMenu();
    
    $('#landing').hide();
    $('#menu_screen').hide();
    $('#table_select_screen').hide();
    $('#total_screen').hide();
    $('#delivery_screen').hide();
    $('#util_payment_screen').hide();
    $('#more_options').hide();
    $('#cash_reports_screen').hide();
    $('#float_screen').hide();
    $('#mobile_screen').hide();
    $('#previous_cash_reports_screen').hide();
    $('#split_bill_screen').hide();
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

function currentScreenIsDelivery() {
    return $('#delivery_screen').is(":visible");
}

function currentScreenIsUtilPayment() {
    return $('#util_payment_screen').is(":visible");
}

function currentScreenIsCashReports() {
    return $('#cash_reports_screen').is(":visible");
}

function currentScreenIsFloat() {
    return $('#float_screen').is(":visible");
}

function currentScreenIsTables() {
    return $('#table_select_screen').is(":visible");
}

function currentScreenIsSplitBill() {
    return $('#split_bill_screen').is(":visible");
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
    
    for(var i=0; i<valArray.length; i++) {
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

var toggleKeyboardEnable = true;

function toggleUtilKeyboard() {
    if(!toggleKeyboardEnable) {
        setStatusMessage("Toggling Keyboard disabled for this screen!");
        return;
    }
    
    if($('#util_keyboard_container').is(":visible")) {
        hideUtilKeyboard();
    } else {
        showUtilKeyboard();
    }
}

function hideUtilKeyboard() {
    $('#util_keyboard_container').slideUp(300);
}

function showUtilKeyboard() {
    $('#util_keyboard_container').slideDown(300);
}

var lastActiveElementInputCallback = null;

function setUtilKeyboardCallback(callbackFunction) {
    lastActiveElementInputCallback = callbackFunction;
}

function doWriteToLastActiveInput(val) {
    if(lastActiveElement) {
        doKeyboardInput(lastActiveElement, val);
        
        if(lastActiveElementInputCallback) {
            lastActiveElementInputCallback.call();
        }
    }
}

function doTabLastActiveInput() {
    if(lastActiveElement) {
        lastActiveElement.focusNextInputField();
    }
}

function doDeleteCharLastActiveInput() {
    if(lastActiveElement) {
        doKeyboardInputCancel(lastActiveElement);
        
        if(lastActiveElementInputCallback) {
            lastActiveElementInputCallback.call();
        }
    }
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

function initMcDropDowns() {
    //table select dropdown, first init then get reference
    $("#table_select_input").mcDropdown("#table_select", {
        maxRows: 15,
        minRows: 15
    });
    tableSelectMenu = $("#table_select_input").mcDropdown();
    
    //menu screen shortcut dropdown, first init then get reference
    $("#menu_screen_shortcut_dropdown_input").mcDropdown("#menu_screen_shortcut_dropdown", {
        maxRows: 15,
        minRows: 15, 
        select: menuScreenDropdownItemSelected
    });
    menuScreenShortcutSelectMenu = $("#menu_screen_shortcut_dropdown_input").mcDropdown();
    
    //make sure the text in the dropdown is set to default
    setShortcutDropdownDefaultText();
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
    lastReceiptItemEl = $('#till_roll > div.order_line:last');
    
    if(lastReceiptItemEl.length == 0) {
        setStatusMessage("There are no receipt items!");
        return null;
    }
    
    return lastReceiptItemEl;
}

function hideAllMenuSubScreens() {
    $('#menu_container').hide();
    
    $('.button[id=sales_button_' + modifyOrderItemButtonID + '], .button[id=admin_screen_button_' + modifyOrderItemButtonID + ']').removeClass("selected");
    $('#order_item_additions').hide();
    
    $('#cash_out_subscreen').hide();
}

function currentMenuSubscreenIsMenu() {
    return $('#menu_container').is(":visible");
}

function currentMenuSubscreenIsModifyOrderItem() {
    return $('#order_item_additions').is(":visible");
}

function currentMenuSubscreenIsCashOutSubscreen() {
    return $('#cash_out_subscreen').is(":visible");
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
    
    hideUtilKeyboardCloseButton();

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
    
    showUtilKeyboardCloseButton();
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
    
    hideUtilKeyboardCloseButton();

    $("#util_keyboard_container").show();
}

//this code is all for dissalowing a right click
//var message="Sorry, No Right Click Allowed!!!";

function clickIE6(){
    if (event.button==2){
        //alert(message);
        return false;
    }
}

function clickNS4(e){
    if (document.layers||document.getElementById&&!document.all){
        if (e.which==2||e.which==3){
            //alert(message);
            return false;
        }
    }
}

function registerDisallowRightClick() {
    if (document.layers){
        document.captureEvents(Event.MOUSEDOWN);
        document.onmousedown=clickNS4;
    } else if (document.all&&!document.getElementById) {
        document.onmousedown=clickIE6;
    }

    document.oncontextmenu=new Function("return false");
}

function postSetConnectionStatus(connected) {
    var color = "#00FF33";
    
    if(!connected) {
        color = "#FF0000";
        
        //if we are offline and the init sequence has not completed then we are operating in offline mode
        if(!callHomePollInitSequenceComplete) {
            callHomePollInitSequenceComplete = true;
            
            //hide the spinner at the top nav
            $('#loading_orders_spinner').hide();
            $('#table_select_container_loading_message').hide();
            $('#table_select_container').show();
            $('#table_screen_button').show();                
        }
    }
    
    //we must be offline, so set the connection status light
    $('#connection_status').css("background-color", color);                    
}

function initModifierGrid() {
    //set the width of each grid item
    var rowWidth = $('div#order_item_additions .grid_row:first').css("width");
    
    var newWidth = roundNumberDown(parseFloat(rowWidth)/modifierGridXSize, 0) - 5;
    
    $('div#order_item_additions .grid_row .grid_item').css("width", newWidth + "px");
    
    var panelHeight = $('div#order_item_additions').css("height");
    
    //take away the height of the tabs
    panelHeight = parseFloat(panelHeight) - parseFloat($('#oia_tabs .tab').css("height"));
    
    var newHeight = roundNumberDown(parseFloat(panelHeight)/modifierGridYSize, 0) - 6;
    
    $('div#order_item_additions .grid_row .grid_item').css("height", newHeight + "px");
}

function rollDate() {
    var dateFormat = "dd MMM";
    var formattedDate = formatDate(new Date(clueyTimestamp()), dateFormat);
    $('#date').html(formattedDate);
}

var licenceExpiredScreenShownLastTime = 0;
var fifteenMinsMillis = 15 * 60 * 1000;

function testShowLicenceExpiredScreen() {
    if(showLicenceExpiredScreen) {
        var now = clueyTimestamp();
        
        if((now - licenceExpiredScreenShownLastTime) >= fifteenMinsMillis) {
            licenceExpiredScreenShownLastTime = now;
            doShowLicenceExpiredScreen();
        }
    }
}

function doShowLicenceExpiredScreen() {
    hideLicenceExpiredScreen();
    
    var title = "Licence Expired!";
    
    var headerMessage = "Your system licence has expired or is not active. Please contact Cluey Systems as below to activate:";
    
    var numbersMessage = "<div id='numbers_message'><div>Cluey UK Tel:</br> +4420 8588 0600</div><div>Cluey Ireland Tel:</br> +353 1 489 3600</div></div>" + clearHTML;
    
    var ceaseMessage = "Your system will cease to function unless you contact us!";
    
    ModalPopups.Alert('licenceExpiredMessageContainer',
        title, "<div id='nice_alert' class='licence_expired_header'>" + headerMessage + "</div>" + 
        "<div id='numbers'>" + numbersMessage + "</div>" +
        "<div id='cease_message'>" + ceaseMessage + "</div>",
        {
            width: 760,
            height: 560,
            okButtonText: 'Ok',
            onOk: "hideLicenceExpiredScreen()"
        });
}

function hideLicenceExpiredScreen() {
    try {
        ModalPopups.Close('licenceExpiredMessageContainer');
    } catch (e) {
        
    }
}

function initTrainingModeFromCookie() {
    if(getRawCookie(inTrainingModeCookieName) == null) {
        var exdays = 365 * 100;
        setRawCookie(inTrainingModeCookieName, false, exdays);
    }
    
    var turnOn = getRawCookie(inTrainingModeCookieName) === "true";
    setTrainingMode(turnOn);
}

function hideUtilKeyboardCloseButton() {
    $('#close_keyboard_link').hide();
    $('#util_keyboard_inner_container').height("230px");
}

function showUtilKeyboardCloseButton() {
    $('#close_keyboard_link').show();
    $('#util_keyboard_inner_container').height("260px");    
}

function checkForFirefox() {
    var ua = $.browser;
    
    if (typeof(ua.mozilla) == 'undefined') {
        niceAlert("You must use the firefox web browser in order to print receipts and operate cash drawers within the Cluey software!");
        return false;
    }
    
    return true;
}

function checkForClueyPlugin() {
    if(!checkForFirefox()) {
        return false;
    }
    
    if(typeof(cluey_ff_ext) == 'undefined') {
        var title = "Cluey Addon Not Found";
        
        hideNiceAlert();
        
        ModalPopups.Alert('niceAlertContainer',
            title, "<div id='nice_alert' class='licence_expired_header'>Cluey Firefox Extension Not Found. You can download it by clicking OK. You must then install it via firefox.</div>",
            {
                width: 360,
                height: 310,
                okButtonText: 'Download',
                onOk: "goToNewWindow(\"/firefox_extensions/cluey_ff_extension.xpi\");hideNiceAlert();"
            });
        
        return false;
    } else {
        console.log("Setting cluey prefs in plugin");
        cluey_ff_ext.setClueyPrefs();
        
        return true;
    }
}

function checkForJSPrintSetupPlugin() {
    //TODO: remove this
    //You should be using firefox!
    //return false;
    
    //using the jsprint library
    //http://jsprintsetup.mozdev.org/reference.html
    if(typeof(jsPrintSetup) == 'undefined') {
        var title = "jsPrintSetup Firefox Addon Not Found";
        
        hideNiceAlert();
        
        ModalPopups.Alert('niceAlertContainer',
            title, "<div id='nice_alert' class='licence_expired_header'>jsPrintSetup Firefox Addon Not Found. You can download it by clicking OK. You must then install it via firefox.</div>",
            {
                width: 360,
                height: 310,
                okButtonText: 'Download',
                onOk: "goToNewWindow(\"/firefox_extensions/jsprintsetup-0.9.2.xpi\");hideNiceAlert();"
            });
        
        return false;
    } else {
        return true;
    }
}

var localPrinters;
var newLocalPrinters = new Array();
var notFoundPrinterIDs = new Array();

function checkForUninstalledPrinters() {
    
    var printersString = jsPrintSetup.getPrintersList();
    
    if(printersString != null) {
        localPrinters = printersString.split(",");
    } else {
        //maybe the plugin permissions have not been given yet
        localPrinters = new Array();
    }
    
    console.log("Found " + localPrinters.length + " local printers");
    
    for(i=0; i<localPrinters.length; i++) {
        var nextLocalPrinterNetworkPath = localPrinters[i].toLowerCase();
        localPrinters[i] = nextLocalPrinterNetworkPath;
        
        console.log("Local Printer " + (i+1) + ": " + nextLocalPrinterNetworkPath);
        
        if($.inArray(nextLocalPrinterNetworkPath, printerNetworkPaths) == -1) {
            newLocalPrinters.push(nextLocalPrinterNetworkPath);
        }
    }
    
    console.log("Got " + printers.length + " system printers");
    
    for(i=0; i<printers.length; i++) {
        //make sure to compare with the unescaped network path
        var nextSystemPrinterNetworkPath = printers[i].network_path.toLowerCase();
        
        console.log("System Printer " + (i+1) + ": " + printers[i].network_path.toLowerCase());
        
        for(j=0; j<localPrinters.length; j++) {
            console.log("LP " + (j+1) + ": " + localPrinters[j]);
        }
    
        if($.inArray(nextSystemPrinterNetworkPath, localPrinters) == -1) {
            notFoundPrinterIDs.push(printers[i].id);
        }
    }
    
    console.log("There are " + newLocalPrinters.length + " new local printers on your system");
    
    for(i=0; i<newLocalPrinters.length; i++) {
        var nextNewLocalPrinterNetworkPath = newLocalPrinters[i].toLowerCase();        
        console.log("New Local Printer " + (i+1) + ": " + nextNewLocalPrinterNetworkPath);
    }
    
    console.log("There are " + notFoundPrinterIDs.length + " printers not found on your system");
    
    var notFoundPrintersNetworkPaths = new Array();
    
    for(i=0; i<notFoundPrinterIDs.length; i++) {
        var nextNotFoudnPrinter = printersByID[notFoundPrinterIDs[i]];
        var nextNotFoudnPrinterNetworkPath = nextNotFoudnPrinter.network_path.toLowerCase();        
        console.log("Not Found Printer " + (i+1) + ": " + nextNotFoudnPrinterNetworkPath);
        notFoundPrintersNetworkPaths.push(nextNotFoudnPrinterNetworkPath);
    }
    
    var localPrinter = printersByID[localPrinterID];
    
    if(localPrinter) {
        if($.inArray(localPrinter.network_path.toLowerCase(), localPrinters) == -1) {
            notFoundPrinterIDs.push(localPrinter.id);
        }
    }
    
    if(notFoundPrintersNetworkPaths.length > 0) {
        var title = "Printers Not Installed";
        niceAlert("Warning... The following printers are not installed on this terminal: " + notFoundPrintersNetworkPaths.join(","), title);
        return false;
    } else {
        return true;
    }
}

function generateBrowserSessionId() {
    generatedBrowserSessionId = Math.uuid();
    storeKeyValue(browserSessionIdStorageKey, generatedBrowserSessionId);
    
    console.log("Set browser session id to: " + generatedBrowserSessionId);
}

function checkForDuplicateBrowserSession() {
    
    var storedBrowserSessionId = retrieveStorageValue(browserSessionIdStorageKey);
    
    if(generatedBrowserSessionId != storedBrowserSessionId) {
        niceAlert("Another browser tab is open for the cluey app. This tab will now close.");
        window.close();
    }
}

function indicateSalesResourcesReloadRequired(reloadTerminalId) {
    $('.sales_resources_reload_indicator').data("terminal_id", reloadTerminalId);
    $('.sales_resources_reload_indicator').show();
}

function reloadSalesResourcesClicked(el) {
    var reloadTerminalId = $(el).data("terminal_id");
    $('.sales_resources_reload_indicator').hide();
    promptReloadSalesResources(reloadTerminalId);
}