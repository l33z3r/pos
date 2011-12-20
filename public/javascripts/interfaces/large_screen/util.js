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
    loginRecptScroll();
}

function showMenuScreen() {
    clearNavTitle();
    hideNavBackLinkMenuScreen();
    hideAllScreens();
    
    //show the menu screen as default subscreen
    showMenuItemsSubscreen();
    
    //show the shortcut dropdown
    $('#menu_screen_shortcut_dropdown_container').show();
    
    $('#menu_screen').show();
}

function showTablesScreen() {
    setNavTitle("Table Selection");
    
    $('#nav_back_link').unbind();
    
    showNavBackLinkMenuScreen();
    
    $('#nav_back_link').click(function() {
        inTransferOrderMode = false;
        $('#tables_screen_status_message').hide();
    });
    
    hideAllScreens();
    
    //hide the dropdown menu
    $('#menu_screen_shortcut_dropdown_container').hide();
        
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
    $('#landing').hide();
    $('#menu_screen').hide();
    $('#table_select_screen').hide();
    $('#total_screen').hide();
    $('#more_options').hide();
    $('#cash_reports_screen').hide();
    $('#float_screen').hide();
    $('#mobile_screen').hide();
    $('#previous_cash_reports_screen').hide();

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

function currentScreenIsFloat() {
    return $('#float_screen').is(":visible");
}

function currentScreenIsTables() {
    return $('#table_select_screen').is(":visible");
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

var toggleKeyboardEnable= true;

function toggleUtilKeyboard() {
    
    if(!toggleKeyboardEnable) {
        setStatusMessage("Toggling Keyboard disabled for this screen!");
        return;
    }
    
    if($('#util_keyboard_container').is(":visible")) {
        $('#util_keyboard_container').slideUp(300);
    } else {
        $('#util_keyboard_container').slideDown(300);
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
    currentSelectedReceiptItemEl = $('#till_roll > div.order_line:last');
    
    if(currentSelectedReceiptItemEl.length == 0) {
        setStatusMessage("There are no receipt items!");
        return null;
    }
    
    return currentSelectedReceiptItemEl;
}

function hideAllMenuSubScreens() {
    $('#menu_container').hide();
    
    $('.button[id=sales_button_' + modifyOrderItemButtonID + ']').removeClass("selected");
    $('#order_item_additions').hide();
}

function currentMenuSubscreenIsMenu() {
    return $('#menu_container').is(":visible");
}

function currentMenuSubscreenIsModifyOrderItem() {
    return $('#order_item_additions').is(":visible");
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
    }
    
    //we must be offline, so set the connection status light
    $('#connection_status').css("background-color", color);
}