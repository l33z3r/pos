function doQuickLogin(user_id) {

    //load the users index in the array
    for (var i = 0; i < employees.length; i++) {
        id = employees[i].id;
        if (id == user_id) {
            user_index = i;
            break;
        }
    }

    //check the global setting first to see if the user can log in without a pin
    //if this setting is set to false, then it overrides all granular settings
    //if it is true, then check the role of the user

    var allowedQuickLogin = null;

    if (bypassPin) {
        //check the users role
        rolePinRequired = employees[user_index].pin_required;

        allowedQuickLogin = !rolePinRequired;
    } else {
        allowedQuickLogin = false;
    }

    if (allowedQuickLogin) {
        login_code = employees[user_index].passcode;
        $('#num').val(login_code);
        doLogin();
    } else {
        setStatusMessage("Enter PIN!", false, true);
    }
    $('#num').focus();
}

function loginScreenKeypadClick(val) {
    var newVal = $('#num').val().toString() + val;
    $('#clockincode_show').html($('#clockincode_show').html() + "*");
    $('#num').val(newVal);
}

function doCancelLoginKeypad() {
    $('#clockincode_show').html("");
    $('#num').val("");
}

function forceLogin(user_id) {
    for (var i = 0; i < employees.length; i++) {
        id = employees[i].id;
        if (id == user_id) {
            user_index = i;
            break;
        }
    }

    var nickname = employees[user_index].nickname;
    var is_admin = employees[user_index].is_admin;
    var passcode = employees[user_index].passcode;

    loginSuccess(user_id, nickname, is_admin, passcode);
}

function doDallasLogin() {
    entered_code = $('#num').val();

    if (current_user_id != null) {
        //already logged in
        displayError("You are already logged in. Please log out!");
        return;
    }

    for (var i = 0; i < employees.length; i++) {
        passcode = employees[i].dallas_code;

        if (entered_code == passcode) {
            nickname = employees[i].nickname;

            if (employees[i]['clocked_in']) {
                id = employees[i].id
                is_admin = employees[i].is_admin;
                loginSuccess(id, nickname, is_admin, passcode);
                return;
            } else {
                setStatusMessage("User " + nickname + " is not clocked in!", true, true);
                clearClockinCode();
                return;
            }
        }
    }

    loginFailure();
}

function doLogin() {
    entered_code = $('#num').val();

    if (current_user_id != null) {
        //already logged in
        displayError("You are already logged in. Please log out!");
        return;
    }

    for (var i = 0; i < employees.length; i++) {
        passcode = employees[i].passcode;

        if (entered_code == passcode) {
            nickname = employees[i].nickname;

            if (employees[i]['clocked_in']) {
                //only allow dallas code login if it is set
                if (employees[i].dallas_code == ""){
                    id = employees[i].id
                    is_admin = employees[i].is_admin;
                    loginSuccess(id, nickname, is_admin, passcode);
                }else {
                    setStatusMessage("Not Allowed! Please use iButton", true, true);
                    clearClockinCode();
                }
                return;
            } else {
                setStatusMessage("User " + nickname + " is not clocked in!", true, true);
                clearClockinCode();
                return;
            }
        }
    }

    loginFailure();
}

function doLogout() {
    if (current_user_id == null) {
        //not logged in
        return;
    }

    current_user_id = null;

    showLoginScreen();

    clearClockinCode();
    clearMenuScreenInput();

    //hide the red x 
    $('#nav_save_button').hide();

    //hide the shortcut dropdown
    $('#menu_screen_shortcut_dropdown_container').hide();

    $('#e_name').hide();

    //send ajax logout
    $.ajax({
        type: 'POST',
        url: '/logout'
    });
}

function doClockin() {
    entered_code = $('#num').val();

    if (employees.length == 0) {
        setStatusMessage("Please try again... system initializing...");
        return;
    }

    for (var i = 0; i < employees.length; i++) {
        id = employees[i].id
        nickname = employees[i].nickname

        clockinCode = employees[i].clockin_code;

        is_admin = employees[i].is_admin;

        if (entered_code == clockinCode) {
            if (employees[i]['clocked_in']) {
                setStatusMessage(nickname + " is already clocked in!");
                clearClockinCode();
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

    for (var i = 0; i < employees.length; i++) {
        id = employees[i].id
        nickname = employees[i].nickname

        clockinCode = employees[i].clockin_code;

        is_admin = employees[i].is_admin;

        if (entered_code == clockinCode) {
            if (employees[i]['clocked_in'] == false) {
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
    clearClockinCode();

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
    clearClockinCode();

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
    last_user_id = current_user_id;
    current_user_nickname = nickname;
    current_user_is_admin = is_admin;
    current_user_passcode = passcode;

    //set the username in the menu
    $('#e_name').html(nickname);

    hideStatusMessage();

    showMenuScreen();

    //show the red x 
    $('#nav_save_button').show();

    //show the shortcut dropdown
    $('#menu_screen_shortcut_dropdown_container').show();

    $('#e_name').show();

    loadCurrentOrder();

    //load the users personal receipt on login
    tableSelectMenu.setValue(0);
    doSelectTable(0);

    loadFirstMenuPage();

    //initialise the options buttons
    initOptionButtons();

    //finally, if the default screen to show 
    //after login is the tables screen then show it!
    if (defaultPostLoginScreen == TABLES_SCREEN) {
        showTablesScreen();
    }

    clearClockinCode();

    //dont show the previous order dropdown if there is none in memory
    if (havePreviousOrder(current_user_id)) {
        $('#previous_order_select_item').show();
    } else {
        $('#previous_order_select_item').hide();
    }

    //dont show the split bill order dropdown if there is none in memory
    if (haveSplitBillOrder(current_user_id)) {
        $('#split_bill_select_item').show();
    } else {
        $('#split_bill_select_item').hide();
    }
}

function clockinFailure() {
    //set an error message in the flash area
    setStatusMessage("Wrong clock in code!", true, true);

    clearClockinCode();
}

function clockoutFailure() {
    //set an error message in the flash area
    setStatusMessage("You are either not clocked in, or entered the wrong code!", true, true);

    clearClockinCode();
}

function loginFailure() {
    //set an error message in the flash area
    setStatusMessage("Wrong pass code!", true, true);

    clearClockinCode();
}

function clearClockinCode() {
    $('#num').val("");
    $('#clockincode_show').html("");
}



