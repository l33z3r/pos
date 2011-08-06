var clearHTML = "<div class='clear'>&nbsp;</div>";
var clear10HTML = "<div class='clear_top_margin_10'>&nbsp;</div>";

function isTouchDevice() {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
}

function goTo(place) {
    window.location = place;
    return false;
}

function currency(number, showUnit) {
    if(typeof showUnit == "undefined") {
        showUnit = true;
    }
    
    return number_to_currency(number, {
        precision : 2, 
        showunit : showUnit
    });
}

function number_to_currency(number, options) {
    try {
        var options   = options || {};
        var precision = options["precision"] || 2;
        var unit      = options["unit"] || dynamicCurrencySymbol;
        var separator = precision > 0 ? options["separator"] || "." : "";
        var delimiter = options["delimiter"] || ",";
  
        var parts = parseFloat(number).toFixed(precision).split('.');
  
        showUnit = options["showunit"] || false
        
        return (showUnit ? unit : "") + number_with_delimiter(parts[0], delimiter) + separator + parts[1].toString();
    } catch(e) {
        alert("error on number: " + number + " " + e.toString());
        return number
    }
}

function number_with_delimiter(number, delimiter, separator) {
    try {
        var delimiter = delimiter || ",";
        var separator = separator || ".";
    
        var parts = number.toString().split('.');
        parts[0] = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + delimiter);
        return parts.join(separator);
    } catch(e) {
        return number
    }
}

function roundNumber(num, dec) {
    var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
    return result;
}

function roundNumberUp(num, dec) {
    var result = Math.ceil(num*Math.pow(10,dec))/Math.pow(10,dec);
    return result;
}

function roundNumberDown(num, dec) {
    var result = Math.floor(num*Math.pow(10,dec))/Math.pow(10,dec);
    return result;
}

function doClearAndReload() {
    doIt = confirm("Are you sure you want to clear your cookies and local web storage?");
    
    if(doIt) {
        //clear the local and session web storage
        localStorage.clear();
        
        //now clear cookies
        var c = document.cookie.split(";");
        
        for(var i=0;i<c.length;i++){
            var e = c[i].indexOf("=");
            var n= e>-1 ? c[i].substr(0,e) : c[i];
            document.cookie = n + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        
        location = location + "?reset_session=true";
    }
}

function storeOrderInStorage(current_user_id, order_to_store) {
    key = "user_" + current_user_id + "_current_order";
    value = JSON.stringify(order_to_store);
    return storeKeyValue(key, value);
}

function getOrderFromStorage(current_user_id) {
    key = "user_" + current_user_id + "_current_order";
    storageData = retrieveStorageValue(key);
    
    if(storageData != null) {
        return JSON.parse(storageData);
    } else {
        return null;
    }
}

function clearOrderInStorage(current_user_id) {
    deleteStorageValue("user_" + current_user_id + "_current_order");
}

function storeTableOrderInStorage(current_user_id, table_num, order_to_store) {
    key = "user_" + current_user_id + "_table_" + table_num + "_current_order";
    value = JSON.stringify(order_to_store);
    return storeKeyValue(key, value);
}

function getTableOrderFromStorage(current_user_id, selectedTable) {
    key = "user_" + current_user_id + "_table_" + selectedTable + "_current_order";
    storageData = retrieveStorageValue(key);
    
    if(storageData != null) {
        tableOrderDataJSON = JSON.parse(storageData);
        tableNum = selectedTable;
        parseAndFillTableOrderJSON(tableOrderDataJSON);
    }
}

function clearTableOrderInStorage(current_user_id, selectedTable) {
    return deleteStorageValue("user_" + current_user_id + "_table_" + selectedTable + "_current_order");
}

function parseAndFillTableOrderJSON(currentTableOrderJSON) {
    //init an in memory version of this order
    tableOrders[tableNum] = {
        'items': new Array(),
        'total':0
    };
    
    //fill in the table order array
    if(currentTableOrderJSON != null) {
        for(i=0; i<currentTableOrderJSON.items.length; i++) {
            //alert("in: " + currentTableOrderJSON.items[i].itemNumber);
            tableOrderItem = currentTableOrderJSON.items[i];
            
            //we want to mark the item as synced if we are loading in a previous order
            if(tableNum == -1) {
                tableOrderItem.synced = true;
            }
            
            tableOrders[tableNum].items.push(tableOrderItem);
        }

        tableOrders[tableNum].order_num = currentTableOrderJSON.order_num;
        tableOrders[tableNum].table = currentTableOrderJSON.table;
        tableOrders[tableNum].total = currentTableOrderJSON.total;
        
        if(currentTableOrderJSON.discount_percent) {
            tableOrders[tableNum].discount_percent = currentTableOrderJSON.discount_percent;
            tableOrders[tableNum].pre_discount_price = currentTableOrderJSON.pre_discount_price;
        }
        
        tableOrders[tableNum].order_taxes = currentTableOrderJSON.order_taxes;
    
        if(tableNum == -1) {
            //we have a previous table order and must copy over the table number and payment method and service charge and cashback
            tableOrders[tableNum].table_info_label = currentTableOrderJSON.table_info_label;
            tableOrders[tableNum].tableInfoId = currentTableOrderJSON.tableInfoId;
            tableOrders[tableNum].payment_method = currentTableOrderJSON.payment_method;
            serviceCharge = tableOrders[tableNum].service_charge = currentTableOrderJSON.service_charge;
            cashback = tableOrders[tableNum].cashback = currentTableOrderJSON.cashback;
            tableOrders[tableNum].void_order_id = currentTableOrderJSON.void_order_id;
            
            //clear the previous order number
            tableOrders[tableNum].order_num = "";
        }
    }
        
    //total the order first
    calculateOrderTotal(tableOrders[tableNum]);
}

function havePreviousOrder(current_user_id) {
    var key = "user_" + current_user_id + "_table_-1_current_order";
    var data = retrieveStorageValue(key);
    return data;
}

function storeKeyValue(key, value) {
    return localStorage.setItem(key, value);
}

function retrieveStorageValue(key) {
    return localStorage.getItem(key);
}

function storeKeyJSONValue(key, value) {
    JSONValue = JSON.stringify(value);
    return localStorage.setItem(key, JSONValue);
}

function retrieveStorageJSONValue(key) {
    storageData = retrieveStorageValue(key);
    if(storageData != null) {
        return JSON.parse(storageData);
    } else {
        return null;
    }
}

function deleteStorageValue(key) {
    return localStorage.removeItem(key);
}

function getActiveTableIDS() {
    activeTableIDSString = retrieveStorageValue("active_table_ids");
    
    //alert("got active table ids " + activeTableIDSString);
    
    if(activeTableIDSString) {
        return activeTableIDSString.split(",");
    } else {
        return new Array();
    }
}

function storeActiveTableIDS(activeTableIDS) {
    activeTableIDSString = activeTableIDS.join(",");
    //alert("Storing active table ids " + activeTableIDSString);
    storeKeyValue("active_table_ids", activeTableIDSString);
}

function addActiveTable(tableID) {
    activeTableIDS = getActiveTableIDS();
    
    newlyAdded = ($.inArray(tableID.toString(), activeTableIDS) == -1);
    
    if(newlyAdded) {
        activeTableIDS.push(tableID);
        storeActiveTableIDS(activeTableIDS);
    }
    
    return newlyAdded;
}

function removeActiveTable(tableID) {
    activeTableIDS = getActiveTableIDS();
    
    newlyRemoved = ($.inArray(tableID.toString(), activeTableIDS) != -1);
    
    activeTableIDS = $.grep(activeTableIDS, function(val) {
        return val.toString() != tableID.toString();
    });

    storeActiveTableIDS(activeTableIDS);
    
    return newlyRemoved;
}

//mark tables in the list as active with some asterisk etc
//need to also mark the tables in the tables screen somehow
function renderActiveTables() {
    activeTableIDS = getActiveTableIDS();
    
    //alert("render active tables " + activeTableIDS);
    
    //got this code from http://stackoverflow.com/questions/1227684/how-to-iterate-through-multiple-select-options-with-jquery
    $("#table_select").children('optgroup').children('option').each( 
        function(id, element) {
            //alert("ID: " + $(element).val().toString() + " El " + $(element).html() + " in:" + $.inArray($(element).val().toString(), activeTableIDS));
            
            nextTableID = $(element).val().toString();
            
            if($.inArray(nextTableID, activeTableIDS) != -1) {
            
                $(element).show();
            
                //mark the tables screen also
                $('#table_label_' + nextTableID).addClass("active");
            } else {
            
                $(element).hide();
                $('#table_label_' + nextTableID).removeClass("active");
            }
        }
        );
}

function setRawCookie(c_name, value, exdays) {
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value;
}

function getRawCookie(c_name) {
    var i,x,y,ARRcookies=document.cookie.split(";");
    for (i=0;i<ARRcookies.length;i++)
    {
        x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
        y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
        x=x.replace(/^\s+|\s+$/g,"");
        if (x==c_name)
        {
            return unescape(y);
        }
    }

    return null;
}

String.prototype.startsWith = function(str){
    return (this.indexOf(str) === 0);
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
    
    hide = false;
  
    if (typeof shake == "undefined") {
        shake = false;
    }
    
    if(currentScreenIsLogin()) {
        statusEl = $('#login_screen_status_message')
    } else if(currentScreenIsMenu()) {
        statusEl = $('#menu_screen_status_message');
    } else {
        statusEl = $('#menu_screen_status_message')
    }
    
    afterFunction = null;
    
    if(hide) {
        afterFunction = function() {
            setTimeout(function(){
                statusEl.fadeOut();
            }, 5000);
        };
    }
    
    statusEl.fadeIn('fast', afterFunction);
    
    if(shake) {
        shakeFunction = function() {
            statusEl.effect("shake", {
                times:3,
                distance: 3
            }, 80);
        };
            
        setTimeout(shakeFunction, 500);
    }
    
    statusEl.html(message);
}

function hideStatusMessage() {
    if(currentScreenIsLogin()) {
        statusEl = $('#login_screen_status_message')
    } else if(currentScreenIsMenu()) {
        statusEl = $('#menu_screen_status_message');
    } else {
        statusEl = $('#menu_screen_status_message')
    }
    
    statusEl.fadeOut();
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

function toggleUtilKeyboard() {
    if($('#util_keyboard_container').is(":visible")) {
        $('#util_keyboard_container').slideUp(200);
    } else {
        $('#util_keyboard_container').slideDown(200);
    }
}

function doWriteToLastActiveInput(val) {
    lastActiveElement.val(lastActiveElement.val() + val);
}

function doTabLastActiveInput() {
    lastActiveElement.focusNextInputField();
}

function doDeleteCharLastActiveInput() {
    oldVal = lastActiveElement.val();
    newVal = oldVal.substring(0, oldVal.length - 1);
    
    lastActiveElement.val(newVal);
}

function utilFormatDate(date) {
    return formatDate(date, defaultJSDateFormat);
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

function inMobileContext() {
    return $('body.mobile').length > 0;
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
    popupEl.HideBubblePopup();
    popupEl.FreezeBubblePopup();
    $("body").unbind('click');
    activePopupElSet = null;
}

function inDevMode() {
    return railsEnvironment == 'development';
}

function inProdMode() {
    return railsEnvironment == 'production';
}

function pauseScript(ms) {
    ms += new Date().getTime();
    while (new Date() < ms){}
}