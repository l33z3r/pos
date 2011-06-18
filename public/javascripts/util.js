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

function currency(number) {
    return number_to_currency(number, {
        precision : 2, 
        showunit : true
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
        sessionStorage.clear();
        localStorage.clear();
        
        //now clear cookies
        var c = document.cookie.split(";");
        
        for(var i=0;i<c.length;i++){
            var e = c[i].indexOf("=");
            var n= e>-1 ? c[i].substr(0,e) : c[i];
            document.cookie = n + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        
        location.reload();
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
    return JSON.parse(storageData);
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
    tableOrderDataJSON = JSON.parse(storageData);
    tableNum = selectedTable;
    parseAndFillTableOrderJSON(tableOrderDataJSON);
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
            tableOrderItem = currentTableOrderJSON.items[i];
            tableOrders[tableNum].items.push(tableOrderItem);
        }

        tableOrders[tableNum].total = currentTableOrderJSON.total;
        
        if(currentTableOrderJSON.discount_percent) {
            tableOrders[tableNum].discount_percent = currentTableOrderJSON.discount_percent;
            tableOrders[tableNum].pre_discount_price = currentTableOrderJSON.pre_discount_price;
        }
        
        tableOrders[tableNum].order_taxes = currentTableOrderJSON.order_taxes;
    }
        
    //total the order first
    calculateOrderTotal(tableOrders[tableNum]);
}

function storeKeyValue(key, value) {
    return sessionStorage.setItem(key, value);
}

function retrieveStorageValue(key) {
    return sessionStorage.getItem(key);
}

function storeKeyJSONValue(key, value) {
    JSONValue = JSON.stringify(value);
    return sessionStorage.setItem(key, JSONValue);
}

function retrieveStorageJSONValue(key) {
    storageData = retrieveStorageValue(key);
    return JSON.parse(storageData);
}

function deleteStorageValue(key) {
    return sessionStorage.removeItem(key);
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
                if(!$(element).html().toString().startsWith("*")) {
                    newLabelHTML = "*" + $(element).html();
                    $(element).html(newLabelHTML);
                    
                    //mark the tables screen also
                    $('#table_label_' + nextTableID).html(newLabelHTML);
                }
            } else {
                if($(element).html().toString().startsWith("*")) {
                    newLabelHTML = $(element).html().toString().substring(1);
                    $(element).html(newLabelHTML);
                    
                    //mark the tables screen also
                    $('#table_label_' + nextTableID).html(newLabelHTML);
                }
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