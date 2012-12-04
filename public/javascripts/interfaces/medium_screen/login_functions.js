function pinKeypadClick(val) {
    var newVal = $('#pin_number_show').html().toString() + val;
    $('#pin_number_show').html(newVal);
}

function doCancelPinNumberSelectKeypad() {
    clearMobileLoginCode();
}

function doSubmitPinNumber() {
    if(!callHomePollInitSequenceComplete) {
        niceAlert("Downloading Orders. Please Wait.");
        return;
    }
    
    var entered_code = $('#pin_number_show').html();
    
    for (var i = 0; i < employees.length; i++) {
        var passcode = employees[i].passcode;
        
        if(entered_code == passcode) {
            nickname = employees[i].nickname;
            id = employees[i].id
            is_admin = employees[i].is_admin;
            
            mobileLoginSuccess(id, nickname, is_admin, passcode);
            return;
        }
    }

    mobileLoginFailure();
}

function mobileLoginSuccess(id, nickname, is_admin, passcode) {
    current_user_id = id;
    current_user_nickname = nickname;
    current_user_is_admin = is_admin;
    current_user_passcode = passcode;
    
    storeActiveUserID(current_user_id);
    
    //send ajax login
    $.ajax({
        type: 'POST',
        url: '/login',
        data: {
            employee_id : id
        }
    });
    
    $('#logged_in_user_nickname').html(current_user_nickname);

    showTablesSubscreen();
    clearMobileLoginCode();
}

function mobileLoginFailure() {
    niceAlert("Wrong Pin Code");
    clearMobileLoginCode();
}

function clearMobileLoginCode() {
    $('#pin_number_show').html("");
}

function mobileLogout() {
    swipeToMenu();
    showPinSubscreen();
    
    var id_for_logout = current_user_id;

    current_user_id = null;

    storeActiveUserID(null);

    clearMobileLoginCode();

    //send ajax logout
    $.ajax({
        type: 'POST',
        url: '/logout',
        data: {
            employee_id : id_for_logout
        }
    });
}