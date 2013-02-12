//dallas key login/logout listeners
var dallasKeyCode = "";
var dallasKeyLoginPrefix = 'a"';
var dallasKeyLogoutPrefix = 'u"';
        
//listener for the dallas key login
var dallasKeyLoginListener = function() {
    //reset the code
    dallasKeyCode = "";
    $('#num').val("");
    $(window).bind('keypress', dallasKeyLoginCodeReader);
};
 
//listener for the dallas key logout
var dallasKeyLogoutListener = function() {
    if (inMenuContext()) {
        console.log("Dallas Logout");
        doDallasLogout();
    }
};
        
var dallasKeyLoginCodeReader = function(event) {
    if(getEventKeyCode(event) == 13) {
        $(window).unbind('keypress', dallasKeyLoginCodeReader);
                
        dallasKeyCode = dallasKeyCode.substring(0, 12);
                
        console.log("Dallas Key Login for code: " + dallasKeyCode);
                
        $('#num').val(dallasKeyCode);
        doDallasLogin();
                
        dallasKeyCode = "";
    }
            
    dallasKeyCode += String.fromCharCode(getEventKeyCode(event));
};
        
function initDallasKeyListeners() {
    $(window).keySequenceDetector(dallasKeyLoginPrefix, dallasKeyLoginListener);
    $(window).keySequenceDetector(dallasKeyLogoutPrefix, dallasKeyLogoutListener);
}

var performDallasLogoutAfterOrder = false;

function doDallasLogout() {
    //make sure an order is not being processed
    if(orderInProcess) {
        performDallasLogoutAfterOrder = true;
        return;
    }
    
    //make sure all items in this order have already been ordered
    var orderSynced = true;
    
    var order = getCurrentOrder();
    
    //order will be null if no items ordered for table 0
    if(order) {    
        for(var i=0; i<order.items.length; i++) {
            if(!order.items[i].synced) {
                orderSynced = false;
                break;
            }
        }
    }
    
    //if there are unordered items, we automatically order them
    if(!orderSynced && selectedTable != 0 && selectedTable != previousOrderTableNum && selectedTable != tempSplitBillTableNum) {
        performDallasLogoutAfterOrder = true;
        
        //display a verbose message (cant use niceAlert)
        hideNiceAlert();
    
        var message = "Items have been automatically ordered";
    
        ModalPopups.Alert('niceAlertContainer',
            "Notice", "<div id='nice_alert' class='nice_alert'>" + message + "</div>",
            {
                width: 360,
                height: 310,
                okButtonText: 'Ok',
                onOk: "hideNiceAlert()"
            });
        
        hideNiceAlertListener = function(event) {
            if(getEventKeyCode(event) == 13) {
                hideNiceAlert();
            }
        };
    
        doSyncTableOrder();
    } else {
        doLogout();
    }
}