var clueyStorage;

if(typeof clueyAndroidJSInterface != "undefined") {
    clueyStorage = new AndroidInterfacedStorage();        
} else {
    clueyStorage = localStorage;
}

var current_user_id;
var last_user_id;

var current_user_nickname;
var current_user_is_admin;
var current_user_passcode;
var current_user_role_id;

var lastActiveElement;

var callHomePollInitSequenceComplete = false;
var callHome = true;
var currentPollObj = null;
var pollInProgress = false;

var lastSyncTableOrderTime = null;
var lastSyncKey = "last_sync_table_order_time";

var lastInterfaceReloadTime = null;
var lastPrintCheckTime = null;
    
var scheduledTasksIntervalSeconds = 10;
    
var showingTerminalSelectDialog = false;

//the following hack is to get over eventX eventY being deprecated in new builds of chrome
$.event.props = $.event.props.join('|').replace('layerX|layerY|', '').split('|');

//function testLocalStorageLimit(num) {
//    var oneK = "################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################################";
//    
//    var oneM = "";
//    
//    for (var i = 0; i < 1000; i++) {
//        oneM += oneK;
//    }
//    
//    try {
//        for (var i = 0; i < 5; i++) {
//            console.log("stored " + num + "v" + i);
//            clueyStorage.setItem(num + "v" + i, oneM);
//        }
//    } catch (e) {
//        var result = "storage length: " + clueyStorage.length * 1024 + " bytes<br>" + e.toString() + "<br><br>";
//        for (var key in e) {
//            if (e.hasOwnProperty(key)) {
//                result += key + ": " + e[key] + "<br>";
//            }
//        }
//
//        alert("RES: " + result);
//    }
//    
//    //alert("Successfully stored " + i + "kb");
//}

$(function() {
    initJSGlobalSettings();
    initSalesResources();

    current_user_id = fetchActiveUserID();
    
    //init some user vars
    if(current_user_id) { 
        for (var i = 0; i < employees.length; i++) {
            var nextId = employees[i].id;
        
            if(nextId.toString() == current_user_id) {
                last_user_id = current_user_id;
                current_user_nickname = employees[i].nickname;
                current_user_is_admin = employees[i].is_admin;
                current_user_passcode = employees[i].passcode;
                current_user_role_id = employees[i].role_id;
            }
        }
    }
    
    //disable image drag
    $('img').live("mousedown", preventImageDrag);
    
    //make sure all links only work when app online.
    $('a').live("click", preventOfflineHref);

    //enable this for html5 cache flushing
    if(!inDevMode()) {
        //start checking for cache updates
        startCacheUpdateCheckPoll();
    }
    
    if(systemWideUpdatePromptRequired != SYSTEM_WIDE_UPDATE_TYPE_NONE) {
        var reloadPromptPopup = function() {
            hideNiceAlert();
        
            ModalPopups.Confirm('niceAlertContainer',
                "System Reload Required", "<div id='nice_alert'>You have changed some data on your system, do you want to isue a reload to the other terminals?</div>",
                {
                    yesButtonText: 'Yes',
                    noButtonText: 'No',
                    onYes: "requestReload(systemWideUpdatePromptRequired);hideNiceAlert();",
                    onNo: "hideNiceAlert();",
                    width: 400,
                    height: 250
                });
        };
        
        indicateActionRequired(reloadPromptPopup);
    }
});
    
function callHomePoll() {
    if(!callHome) {
        setTimeout(callHomePoll, 5000);
        return;
    }
    
    if(pollInProgress) {
        return;
    }
    
    //load/store the timestamp for table sync
    if(lastSyncTableOrderTime == null) {
        //read it from web db
        var syncVal = retrieveStorageValue(lastSyncKey);
        
        if(syncVal != null) {
            lastSyncTableOrderTime = parseFloat(syncVal);
        } else {
            lastSyncTableOrderTime = 0;
        }
    } else {
        //write it to web db
        storeKeyValue(lastSyncKey, lastSyncTableOrderTime);
    }
    
    //load/store the timestamp for reloads
    if(lastInterfaceReloadTime == null) {
        //read it from cookie
        var lastReloadTime = getRawCookie(lastReloadCookieName);
        
        if(lastReloadTime != null) {
            lastInterfaceReloadTime = parseFloat(lastReloadTime);
        } else {
            lastInterfaceReloadTime = clueyTimestamp();
        }
    } else {
        writeLastReloadTimeCookie();
    }
    
    //load/store the timestamp for print checks
    //also copy this timestamp into a variable that says when we last checked an order for printed items
    //this is to stop orders from re-printing once we reload the terminal
    if(lastPrintCheckTime == null) {
        //read it from cookie
        var lastCheckTime = getRawCookie(lastPrintCheckCookieName);
        
        if(lastCheckTime != null) {
            lastPrintCheckTime = parseFloat(lastCheckTime);
        } else {
            lastPrintCheckTime = clueyTimestamp();
        }
    } else {
        //write it to cookie        
        //100 year expiry, but will really end up in year 2038 due to limitations in browser
        var printCookieExpDays = 365 * 100;
        setRawCookie(lastPrintCheckCookieName, lastPrintCheckTime, printCookieExpDays);
    }
    
    callHomeURL = "/call_home.js"
    
    currentTerminalRecptHTML = "";
    
    if(getCurrentOrder()) {
        currentTerminalRecptHTML = getCurrentRecptHTML();
    }
    
    startClock();
    
    currentTableLabel = "";
    
    if(selectedTable != previousOrderTableNum && selectedTable != tempSplitBillTableNum && selectedTable != 0) {
        currentTableLabel = tableInfoLabel = tables[selectedTable].label;
    }
    
    pollInProgress = true;
    
    currentPollObj = $.ajax({
        url: callHomeURL,
        type : "POST",
        dataType: 'script',
        success: function() {
            //this cant go in a complete handler as it gets called too late
            pollInProgress = false;
            callHomePollComplete();
        },
        error: function() {
            //this cant go in a complete handler as it gets called too late
            pollInProgress = false;
            setTimeout(callHomePoll, 20000);
        },
        data : {
            lastInterfaceReloadTime : lastInterfaceReloadTime,
            lastSyncTableOrderTime : lastSyncTableOrderTime,
            currentTerminalUser : current_user_id,
            currentTerminalRecptHTML : currentTerminalRecptHTML,
            currentTerminalRecptTableLabel : currentTableLabel,
            lastOrderReadyNotificationTime : lastOrderReadyNotificationTime
        }
    });
}

function manualCallHomePoll() {
    if(!pollInProgress) {
        callHomePoll();   
    }    
}

var immediateCallHome = false;
var performHardReloadAtCallHomePollInitSequenceComplete = false;

function callHomePollComplete() {
    if(immediateCallHome) {
        callHomePoll();
    } else {
        if(!callHomePollInitSequenceComplete) {
            callHomePollInitSequenceComplete = true;
            callHomePollInitSequenceCompleteHook();
            
            //do we need to do a hard reload after the init sequence?
            //we don't do this to mobile as that does it itself at startup
            if(performHardReloadAtCallHomePollInitSequenceComplete && !inMediumInterface()) {
                alertHardReloadRequest();
            }
        } else {
            if(enablePollingForKitchenScreen) {
                setTimeout(callHomePoll, pollingAmount);
            }
        }
    
        //are we on the previous sales screen?
        //update the open orders tab
        checkUpdateOpenOrdersScreen();
    }
}

//this is called when the first load of orders are loaded
function callHomePollInitSequenceCompleteHook() {
    if(inKitchenContext()) {
        $('#loading_orders_spinner').hide();
        //show the receipts now that they are all rendered
        finishedLoadingKitchenScreen();
    } else {
        //this function is implemented for both large and medium interfaces
        performCallHomePollInitSequenceComplete();
    }
    
    //once the init sequence has completed we want to do a home poll 
    //to make sure that the user selects from the list of terminals they have paid for
    callHomePoll();
}

//this gets called from the polling when a terminal is not yet set
function showTerminalSelectDialog() {
    //dont process terminal select in manager interface
    if(inMobileContext()) {
        return;
    }
    
    //just to be sure, make sure we need to show the dialog
    if(showingTerminalSelectDialog) {
        return;
    }
    
    //there are 3 types now, so do a different thing for each
    var availableOutletTerminalsForType;
    var allOutletTerminalsForType;
    var terminalTypeLabel;
        
    if(inKitchenContext()) {
        availableOutletTerminalsForType = getAvailableOutletTerminals(TERMINAL_TYPE_KITCHEN);
        allOutletTerminalsForType = getAllOutletTerminals(TERMINAL_TYPE_KITCHEN);
        terminalTypeLabel = "kitchen screen";
    } else if(inLargeInterface()) {
        availableOutletTerminalsForType = getAvailableOutletTerminals(TERMINAL_TYPE_NORMAL);
        allOutletTerminalsForType = getAllOutletTerminals(TERMINAL_TYPE_NORMAL);
        terminalTypeLabel = "terminal";
    } else if(inMediumInterface()) {
        availableOutletTerminalsForType = getAvailableOutletTerminals(TERMINAL_TYPE_MOBILE);
        allOutletTerminalsForType = getAllOutletTerminals(TERMINAL_TYPE_MOBILE);
        terminalTypeLabel = "mobile";
    } else {
        niceAlert("Invalid terminal type");
        return;
    }

    hideNiceAlert();
        
    showingTerminalSelectDialog = true;
    
    if(availableOutletTerminalsForType.length == 0) {
        var title = "Subscription Reached";
        var message = "You have only paid for " + allOutletTerminalsForType.length + " " + terminalTypeLabel + "(s), which have all been assigned. You can create more " + terminalTypeLabel + "s in the accounts section. Click OK to be redirected";
        
        ModalPopups.Alert('niceAlertContainer',
            title, "<div id='nice_alert' class='nice_alert'>" + message + "</div>",
            {
                width: 400,
                height: 380,
                okButtonText: 'Ok',
                onOk: "showingTerminalSelectDialog=false;goTo(outletTerminalsURL);"
            });
        
        return;
    }
     
    var dropdownMarkup = "<select id='terminal_select_dropdown'>";
    
    for(i=0; i<availableOutletTerminalsForType.length; i++) {
        dropdownMarkup += "<option value='" + availableOutletTerminalsForType[i].name + "'>" + availableOutletTerminalsForType[i].name + "</option>";
    }
    
    dropdownMarkup += "</select>";
    
    title = "Please name this terminal:";
        
    var terminalSelectMarkup = "<div id='nice_alert' class='nice_alert'>" + dropdownMarkup + "</div>";
    
    ModalPopups.Alert('niceAlertContainer',
        title, terminalSelectMarkup,
        {
            width: 360,
            height: 200,
            okButtonText: 'Ok',
            onOk: "terminalSelected()"
        });
}

function terminalSelected() {
    var selectedTerminal = $('select#terminal_select_dropdown option:selected').val();
    linkTerminal(selectedTerminal);
}

function clueyScheduler() {
    doScheduledTasks();
    
    setTimeout(clueyScheduler, scheduledTasksIntervalSeconds * 1000);
}

function preventImageDrag(event) {
    if (event.preventDefault) {
        event.preventDefault();
    }
}

function preventOfflineHref() {
    if(!appOnline) {
        appOfflinePopup();
        return false;
    }
    
    if(cacheDownloading) {
        cacheDownloadingPopup();
        return false;
    }
        
    return true;
}

var pingTimeoutSeconds = 20;
var pingTimeoutMillis = pingTimeoutSeconds * 1000;
var pingHomeInProgress= false;

function pingHome() {
    if(pingHomeInProgress) {
        return;
    }
    
    pingHomeInProgress = true;
    
    $.ajax({
        url: "/ping?t=" + new Date().getTime(),
        type : "GET",
        timeout: pingTimeoutMillis,
        complete: function() {
            pingHomeInProgress = false;  
        },
        success: function() {
            setConnectionStatus(true);
        },
        error: function() {
            setConnectionStatus(false);
        }
    });
}

function linkTerminal(outletTerminalName) {
    //
    //
    //
    //
    //
    //manually hide and load a new message so we dont interfere with showingTerminalSelectDialog Variable
    ModalPopups.Close('niceAlertContainer');
    
    ModalPopups.Indicator("niceAlertContainer",
        "Loading...",
        "<div id='nice_alert' class='nice_alert'>Linking terminal to " + outletTerminalName + "</div>",
        { 
            width: 360,
            height: 280
        } );
    
    
    $.ajax({
        url: "/link_terminal",
        type : "POST",
        error: function() {
            showingTerminalSelectDialog = false;
            hideNiceAlert();
        
            var message = "Error Linking Terminal";
        
            ModalPopups.Alert('niceAlertContainer',
                title, "<div id='nice_alert' class='nice_alert'>" + message + "</div>",
                {
                    width: 360,
                    height: 310,
                    okButtonText: 'Ok',
                    onOk: "doReload(false)"
                });
        },
        data : {
            outletTerminalName : outletTerminalName
        }
    });
}

function testTerminalTypeValid() {
    var assignedTerminalType = getTerminalTypeForName(terminalID);
    
    if(inKitchenContext() && assignedTerminalType != TERMINAL_TYPE_KITCHEN) {
        niceAlert("You cannot access the kitchen screen without a valid terminal type");
    } else if(inLargeInterface() && assignedTerminalType != TERMINAL_TYPE_NORMAL) {
        niceAlert("You cannot access the sales screen without a valid terminal type");
    } else if(inMediumInterface() && assignedTerminalType != TERMINAL_TYPE_MOBILE) {
        niceAlert("You cannot access the mobile without a valid terminal type");
    }
}