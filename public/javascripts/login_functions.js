function doQuickLogin(user_id) {
    //load the users index in the array
    for (var i = 0; i < employees.length; i++){
        id = employees[i].id;
        if(id == user_id) {
            user_index = i;
            break;
        }
    }
        
    //check the global setting first to see if the user can log in without a pin
    //if this setting is set to false, then it overrides all granular settings
    //if it is true, then check the role of the user
    
    var allowedQuickLogin = null;
    
    if(bypassPin) {
        //check the users role
        rolePinRequired = employees[user_index].pin_required;
        
        allowedQuickLogin = !rolePinRequired;
    } else {
        allowedQuickLogin = false;
    }
    
    if(allowedQuickLogin) {
        login_code = employees[user_index].passcode;
        $('#num').val(login_code);
        doLogin();
    } else {
        setStatusMessage("Enter PIN!", false, true);
    }
}

function loginScreenKeypadClick(val) {
    newVal = $('#num').val().toString() + val;
    $('#clockincode_show').html(newVal);
    $('#num').val(newVal);
}

function doCancelLoginKeypad() {
    oldVal = $('#num').val().toString();
    newVal = oldVal.substring(0, oldVal.length - 1);
    $('#clockincode_show').html(newVal);
    $('#num').val(newVal);
}

function doLogin() {
    entered_code = $('#num').val();
    
    if(current_user_id != null) {
        //already logged in
        displayError("You are already logged in. Please log out!");
        return;
    }

    for (var i = 0; i < employees.length; i++) {
        passcode = employees[i].passcode;
        
        if(entered_code == passcode) {
            nickname = employees[i].nickname;
                
            if(employees[i]['clocked_in']) {
                id = employees[i].id
                is_admin = employees[i].is_admin;
                loginSuccess(id, nickname, is_admin, passcode);
                return;
            } else {
                setStatusMessage("User " + nickname + " is not clocked in!", true, true);
                clearCode();
                return;
            }
        }
    }

    loginFailure();
}

function doLogout() {
    if(current_user_id == null) {
        //not logged in
        return;
    }

    current_user_id = null;

    showLoginScreen();
    
    clearCode();

    //hide the red x 
    $('#nav_save_button').hide();

    $('#e_name').hide();

    //send ajax logout
    $.ajax({
        type: 'POST',
        url: '/logout'
    });
}

function doClockin() {
    entered_code = $('#num').val();
    
    if(employees.length==0) {
        alert("Please try again... system initializing...");
        return;
    }

    for (var i = 0; i < employees.length; i++){
        id = employees[i].id
        nickname = employees[i].nickname
        
        clockinCode = employees[i].clockin_code;

        is_admin = employees[i].is_admin;

        if(entered_code == clockinCode) {
            if(employees[i]['clocked_in']) {
                setStatusMessage(nickname + " is already clocked in!");
                clearCode();
                return;
            }
            
            //mark the user as clocked in
            employees[i]['clocked_in'] = true;
            
            clockinSuccess(id, nickname);
            return;
        }
    }

    clockinFailure();
}

function doClockout() {
    entered_code = $('#num').val();
    
    for (var i = 0; i < employees.length; i++){
        id = employees[i].id
        nickname = employees[i].nickname
        
        clockinCode = employees[i].clockin_code;

        is_admin = employees[i].is_admin;

        if(entered_code == clockinCode) {
            if(employees[i]['clocked_in'] == false) {
                clockoutFailure();
                return;
            }
            
            //mark the user as clocked out
            employees[i]['clocked_in'] = false;
            
            clockoutSuccess(id, nickname);
            return;
        }
    }

    clockoutFailure();
}

function clockinSuccess(id, nickname) {
    clearCode();
    
    setStatusMessage(nickname + " clocked in successfully!");
    
    //send ajax logout
    $.ajax({
        type: 'POST',
        url: '/clockin',
        data: {
            id : id
        }
    });
}

function clockoutSuccess(id, nickname) {
    clearCode();
    
    setStatusMessage(nickname + " clocked out successfully!");
    
    //send ajax clockout
    $.ajax({
        type: 'POST',
        url: '/clockout',
        data: {
            id : id
        }
    });
}

function loginSuccess(id, nickname, is_admin, passcode) {
    //send ajax login
    $.ajax({
        type: 'POST',
        url: '/login',
        data: {
            id : id
        }
    });

    showingPassCodeDialog = false;
    
    current_user_id = id;
    current_user_nickname = nickname;
    current_user_is_admin = is_admin;
    current_user_passcode = passcode;
    
    //set the username in the menu
    $('#e_name').html(nickname);
    
    hideStatusMessage();
    
    showMenuScreen();
    
    //show the red x 
    $('#nav_save_button').show();
    
    $('#e_name').show();

    loadCurrentOrder();
    
    //load the users personal receipt on login
    $('#table_select').val(0);
    doSelectTable(0);
    
    loadFirstMenuPage();
    
    //initialise the options buttons
    initOptionButtons();
    
    trySendOutstandingOrdersToServer();
    
    //finally, if the default screen to show 
    //after login is the tables screen then show it!
    if(defaultPostLoginScreen == TABLES_SCREEN) {
        showTablesScreen();
    }
    
    clearCode();
}

function clockinFailure() {
    //set an error message in the flash area
    setStatusMessage("Wrong clock in code!", true, true);

    clearCode();
}

function clockoutFailure() {
    //set an error message in the flash area
    setStatusMessage("You are either not clocked in, or entered the wrong code!", true, true);

    clearCode();
}

function loginFailure() {
    //set an error message in the flash area
    setStatusMessage("Wrong pass code!", true, true);

    clearCode();
}

function clearCode() {
    $('#num').val("");
    $('#clockincode_show').html("");
}