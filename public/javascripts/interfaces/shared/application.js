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

var lastSyncTableOrderTime = null;
var lastSyncKey = "last_sync_table_order_time";

$(function() {
    //disable image drag
    $('img').live("mousedown", preventImageDrag);
    
    //make sure all links only work when app online.
    $('a').live("click", preventOfflineHref);
});
    
function callHomePoll() {
    if(!callHome) {
        setTimeout(callHomePoll, 5000);
        return;
    }
    
    //load/store the timestamp
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
    
    callHomeURL = "/call_home.js"
    
    currentTerminalRecptHTML = "";
    
    if(getCurrentOrder()) {
        currentTerminalRecptHTML = getCurrentRecptHTML();
    }
    
    currentTableLabel = "";
    
    if(selectedTable != previousOrderTableNum && selectedTable != tempSplitBillTableNum && selectedTable != 0) {
        currentTableLabel = tableInfoLabel = tables[selectedTable].label;
    }
    
    $.ajax({
        url: callHomeURL,
        type : "POST",
        dataType: 'script',
        success: callHomePollComplete,
        error: function() {
            setConnectionStatus(false);
            setTimeout(callHomePoll, 5000);
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

var immediateCallHome = false;

function callHomePollComplete() {
    setConnectionStatus(true); 
    
    if(immediateCallHome) {
        callHomePoll();
    } else {
        if(!callHomePollInitSequenceComplete) {
            callHomePollInitSequenceComplete = true;
            callHomePollInitSequenceCompleteHook();
        }
        
        //show the receipts now that they are all rendered
        if(inKitchenContext() && !kitchenScreenInitialized) {
            kitchenScreenInitialized = true;
            finishedLoadingKitchenScreen();
        }
        
        setTimeout(callHomePoll, pollingAmount);
    }
}

//this is called when the first load of orders are loaded
function callHomePollInitSequenceCompleteHook() {
    //are we on the previous sales screen?
    checkUpdateOpenOrdersScreen();
    
    //hide the spinner at the top nav
    $('#loading_orders_spinner').hide();
}

function clueyScheduler() {
    rollDate();
    trySendOutstandingOrdersToServer();
    
    var numSeconds = 10;
    setTimeout(clueyScheduler, numSeconds * 1000);
}

function preventImageDrag(event) {
    if (event.preventDefault) {
        event.preventDefault();
    }
}

function preventOfflineHref() {
    if(!appOnline) {
        appOfflinePopup();
        event.preventDefault();
        return false;
    }
        
    return true;
}