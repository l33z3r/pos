var clueyStorage;

if(inAndroidWrapper()) {
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

var kitchenScreenInitialized = false;

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
        }
        
        //show the receipts now that they are all rendered
        if(inKitchenContext() && !kitchenScreenInitialized) {
            kitchenScreenInitialized = true;
            finishedLoadingKitchenScreen();
            setTimeout(callHomePoll, pollingAmount);
        } else if(inLargeInterface()) {
            //we do manual polling now unless there is a kitchen screen
            if(enablePollingForKitchenScreen) {
                setTimeout(callHomePoll, pollingAmount);
            }
        } else if(inMediumInterface()) {
            swipeToMenu();
            
            //we do manual polling now unless there is a kitchen screen
            if(enablePollingForKitchenScreen) {
                setTimeout(callHomePoll, pollingAmount);
            }
        }                
    }
}

//this is called when the first load of orders are loaded
function callHomePollInitSequenceCompleteHook() {
    //are we on the previous sales screen?
    checkUpdateOpenOrdersScreen();
    
    //hide the spinner at the top nav
    $('#loading_orders_spinner').hide();
        
    if(inLargeInterface()) {
        $('#table_select_container_loading_message').hide();
        $('#table_select_container').show();
        $('#table_screen_button').show();            
    }
}

//this gets called from the polling when a terminal is not yet set
function showTerminalSelectDialog() {    
    //must wait on js resources to load
    if(typeof(outletTerminals) == "undefined") {
        return;
    }
    
    //dont process terminal select in manager interface
    if(inMobileContext()) {
        return;
    }
    
    if(showingTerminalSelectDialog) {
        return;
    }
    
    if(availableOutletTerminals.length == 0) {
        hideNiceAlert();
        
        showingTerminalSelectDialog = true;
    
        var title = "Subscription Reached";
        var message = "You have only paid for " + outletTerminals.length + " terminal(s), which have all been assigned. You can create more terminals in the accounts section. Click OK to be redirected";
        
        ModalPopups.Alert('niceAlertContainer',
            title, "<div id='nice_alert' class='nice_alert'>" + message + "</div>",
            {
                width: 360,
                height: 310,
                okButtonText: 'Ok',
                onOk: "showingTerminalSelectDialog=false;goTo(outletTerminalsURL);"
            });
        
        return;
    }
     
    var dropdownMarkup = "<select id='terminal_select_dropdown'>";
    
    for(i=0; i<availableOutletTerminals.length; i++) {
        dropdownMarkup += "<option value='" + availableOutletTerminals[i].name + "'>" + availableOutletTerminals[i].name + "</option>";
    }
    
    dropdownMarkup += "</select>";
    
    title = "Please select a terminal:";
        
    var terminalSelectMarkup = "<div id='nice_alert' class='nice_alert'>" + dropdownMarkup + "</div>";
    
    hideNiceAlert();
    
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
    showLoadingDiv("Linking terminal to " + outletTerminalName);
    
    $.ajax({
        url: "/link_terminal",
        type : "POST",
        error: function() {
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
        complete: function() {
            showingTerminalSelectDialog = false;
        },
        data : {
            outletTerminalName : outletTerminalName
        }
    });
}

function unlinkTerminal() {
    var answer = confirm("Are you sure?");
    
    if (!answer) {
        return;
    }
    
    showLoadingDiv("Unlinking terminal");
    
    $.ajax({
        url: "/unlink_terminal",
        type : "POST",
        error: function() {
            niceAlert("Error Unlinking Terminal");
        },
        complete: function() {
            hideNiceAlert();
            regenerateTerminalFingerprintCookie();
        }
    });
}