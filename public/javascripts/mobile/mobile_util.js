function setMobileStatusMessage(message, hide) {
    if (typeof hide == "undefined") {
        hide = true;
    }
    
    hide = false;
  
    if(currentScreenIsMobileLogin()) {
        statusEl = $('#login_screen_status_message')
    } else if(currentScreenIsMobileMenu()) {
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
    
    statusEl.html(message);
}

function hideMobileStatusMessage() {
    if(currentScreenIsMobileLogin()) {
        statusEl = $('#login_screen_status_message')
    } else if(currentScreenIsMobileMenu()) {
        statusEl = $('#menu_screen_status_message');
    } else {
        statusEl = $('#menu_screen_status_message')
    }
    
    statusEl.fadeOut();
}

function displayMobileError(message) {
    setMobileStatusMessage("Error: " + message);
}

function displayMobileNotice(message) {
    setMobileStatusMessage("Notice: " + message);
}

function showMobileLoginScreen() {
    jQT.goTo('#login', 'slideup');
}

function showMobileMenuScreen() {
    jQT.goTo('#menu', 'slideup');
}

function currentScreenIsMobileMenu() {
    return $('#menu').is(":visible");
}

function currentScreenIsMobileLogin() {
    return $('#login').is(":visible");
}

function clearTerminalRecpt() {
    $('#mobile_terminal_till_roll').html("");
}

function clearServerRecpt() {
    $('#mobile_server_till_roll').html("");
}

function clearTableRecpt() {
    $('#mobile_table_till_roll').html("");
}

function renderMobileActiveTableList() {
    var tableIDS = getActiveTableIDS();
    
    //hide all 
    $('ul li.table_list_item').each(function() {$(this).hide();});
    
    for(var i = 0; i < tableIDS.length; i++) {
        console.log("Open order in table " + tableIDS[i]);
        $('#table_' + tableIDS[i] + '_list_item').show();
    }
}