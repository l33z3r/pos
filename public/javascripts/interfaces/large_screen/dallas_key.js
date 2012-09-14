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
        doLogout();
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