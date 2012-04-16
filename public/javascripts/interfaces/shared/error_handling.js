//global error handler that sends log to server
window.onerror = function(error, url, lineNumber) {
    console.log("Sending error in javascript to server EROR: " + error + " URL: " + url + " LINE NUMBER: " + lineNumber + " TERMINAL: " + terminalID);
        
    var errorData = {};
        
    if(typeof(error) == 'undefined') {
        errorMessage = "NONE SPECIFIED";
    } else if(typeof(error) == 'object') {
        errorMessage = "";
        
        for (var key in error) {
            if (error.hasOwnProperty(key)) {
                errorMessage += (key + "=" + error[key] + "------");
            }
        }
    } else {
        errorMessage =  error;
    }
        
    errorMessage = escape(errorMessage);
        
    var commonData = {
        error_message : errorMessage,
        file : ((typeof(url) == 'undefined') ? "NONE SPECIFIED" : url),
        line_number :  ((typeof(lineNumber) == 'undefined') ? "NONE SPECIFIED" : lineNumber),
        terminal_id : terminalID,
        current_user_id : current_user_id,
        current_user_nickname : current_user_nickname,
        is_touch_device : ((typeof(isTouchDevice) == 'undefined') ? false : isTouchDevice()),
        in_mobile_context : ((typeof(inMobileContext) == 'undefined') ? false : inMobileContext()),
        page_title : $('#nav_title').html()
    }
    
    if(inLargeInterface()) {
        var largeScreenInterfaceData = {
            is_kitchen_screen : ((typeof(inKitchenContext) == 'undefined') ? false : inKitchenContext()),
            current_screen_is_menu : ((typeof(currentScreenIsMenu) == 'undefined') ? false : currentScreenIsMenu()),
            current_screen_is_login : ((typeof(currentScreenIsLogin) == 'undefined') ? false : currentScreenIsLogin()),
            current_screen_is_totals : ((typeof(currentScreenIsTotals) == 'undefined') ? false : currentScreenIsTotals()),
            current_screen_is_cash_reports : ((typeof(currentScreenIsCashReports) == 'undefined') ? false : currentScreenIsCashReports()),
            in_admin_context : ((typeof(inAdminContext == 'undefined')) ? false : inAdminContext())
        }
            
        errorData = $.extend(commonData, largeScreenInterfaceData);
    } else if(inMediumInterface()) {
        var mediumScreenInterfaceData = {
            current_screen_is_menu : ((typeof(currentScreenIsMenu) == 'undefined') ? false : currentScreenIsMenu),
            current_screen_is_receipt : ((typeof(currentScreenIsReceipt) == 'undefined') ? false : currentScreenIsReceipt),
            current_screen_is_functions : ((typeof(currentScreenIsFunctions) == 'undefined') ? false : currentScreenIsFunctions),
            current_screen_is_settings : ((typeof(currentScreenIsSettings) == 'undefined') ? false : currentScreenIsSettings)
        }
            
        errorData = $.extend(commonData, mediumScreenInterfaceData);
    }
    
    $.ajax({
        url: "/js_error_log.js",
        type : "POST",
        data : errorData
    });
    
    hideSpinner();
}