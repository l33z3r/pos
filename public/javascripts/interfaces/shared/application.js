var current_user_id;
var current_user_nickname;
var current_user_is_admin;
var current_user_passcode;
var current_user_role_id;

var lastActiveElement;

var callHomePollInitSequenceComplete = false;
var callHome = true;

function callHomePoll() {
    
    if(!callHome) return;
    
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
            setTimeout(callHomePoll, 5000);
        },
        data : {
            lastInterfaceReloadTime : lastInterfaceReloadTime,
            lastSyncTableOrderTime : lastSyncTableOrderTime,
            currentTerminalUser : current_user_id,
            currentTerminalRecptHTML : currentTerminalRecptHTML,
            currentTerminalRecptTableLabel : currentTableLabel
        }
    });
}

var immediateCallHome = false;

function callHomePollComplete() {
    if(immediateCallHome) {
        callHomePoll();
    } else {
        callHomePollInitSequenceComplete = true;
        setTimeout(callHomePoll, pollingAmount);
    }
}

function cacheUpdateCheckPoll() {
    alert("Checking for cache update");
    window.applicationCache.update();
    setTimeout(cacheUpdateCheckPoll, 5000);
}