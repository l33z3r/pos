var current_user_id;
var current_user_nickname;
var current_user_is_admin;
var current_user_passcode;
var current_user_role_id;

var kitchenScreenInitialized = false;

var lastActiveElement;

var callHomePollInitSequenceComplete = false;
var callHome = true;

$(function(){   
    //disable image drag
    $('img').live("mousedown", preventImageDrag);
});
    
function callHomePoll() {
    if(!callHome) {
        setTimeout(callHomePoll, 5000);
        return;
    }
    
    callHomeURL = "/call_home.js"
    
    currentTerminalRecptHTML = "";
    
    if(getCurrentOrder()) {
        currentTerminalRecptHTML = getCurrentRecptHTML();
    }
    
    currentTableLabel = "";
    
    if(selectedTable != -1 && selectedTable != 0) {
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

function preventImageDrag(event) {
    if (event.preventDefault) {
        event.preventDefault();
    }
}