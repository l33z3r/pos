function mobileLoginScreenKeypadClick(val) {
    newVal = $('#num').val().toString() + val;
    $('#clockincode_show').html(newVal);
    $('#num').val(newVal);
}

function doCancelMobileLoginKeypad() {
    oldVal = $('#num').val().toString();
    newVal = oldVal.substring(0, oldVal.length - 1);
    $('#clockincode_show').html(newVal);
    $('#num').val(newVal);
}

function doMobileLogin() {
    entered_code = $('#num').val();
    
    if(current_user_id != null) {
        //already logged in
        displayMobileError("You are already logged in. Please log out!");
        return;
    }

    for (var i = 0; i < employees.length; i++) {
        passcode = employees[i].passcode;
        
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
    //send ajax login
    $.ajax({
        type: 'POST',
        url: '/login',
        data: {
            id : id
        }
    });

    current_user_id = id;
    current_user_nickname = nickname;
    current_user_is_admin = is_admin;
    current_user_passcode = passcode;
    
    //set the username in the menu
    $('#e_name').html(nickname);
    $('#e_name').show();

    hideMobileStatusMessage();
    
    showMobileMenuScreen();
    
    clearMobileLoginCode();
}

function mobileLoginFailure() {
    //set an error message in the flash area
    setMobileStatusMessage("Wrong Pin Code!");

    clearMobileLoginCode();
}

function clearMobileLoginCode() {
    $('#num').val("");
    $('#clockincode_show').html("");
}

function doMobileLogout() {
    if(current_user_id == null) {
        //not logged in
        return;
    }

    current_user_id = null;

    setMobileStatusMessage("Logged Out!");

    showMobileLoginScreen();
    
    clearMobileLoginCode();

    //send ajax logout
    $.ajax({
        type: 'POST',
        url: '/logout'
    });
}