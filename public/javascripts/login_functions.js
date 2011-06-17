function doQuickLogin(user_id) {
    if(bypassPin) {
        for (var i = 0; i < employees.length; i++){
            id = employees[i].id;
            if(id == user_id) {
                login_code = employees[i].passcode;
            }
        }
        $('#num').val(login_code);
        doLogin();
    } else {
        setStatusMessage("You must enter your pin!");
    }
}

function doLogin() {
    entered_code = $('#num').val();
    
    if(current_user_id != null) {
        //already logged in
        displayError("You are already logged in. Please log out.");
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
                displayError("User " + nickname + " is not clocked in.");
                $('#clockincode_show').html("");
                $('#num').val("");
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
    
    $('#num').val("");
    $('#clockincode_show').html("");

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
            //mark the user as clocked in
            employees[i]['clocked_in'] = true;
            
            clockinSuccess(id);
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
            //mark the user as clocked out
            employees[i]['clocked_in'] = false;
            
            clockoutSuccess(id);
            return;
        }
    }

    clockoutFailure();
}

function clockinSuccess(id) {
    $('#num').val("");
    $('#clockincode_show').html("");
    
    //send ajax logout
    $.ajax({
        type: 'POST',
        url: '/clockin',
        data: {
            id : id
        }
    });
}

function clockoutSuccess(id) {
    $('#num').val("");
    $('#clockincode_show').html("");
    
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
    
    setStatusMessage("Welcome " + nickname + "!");
    
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
    
    $('#clockincode_show').html("");
    $('#num').val("");
}

function clockinFailure() {
    //set an error message in the flash area
    displayError("Wrong clock in code, please try again.");

    $('#num').val("");
    $('#clockincode_show').html("");
}

function loginFailure() {
    //set an error message in the flash area
    displayError("Wrong pass code, please try again.");

    $('#num').val("");
    $('#clockincode_show').html("");
}

function clockoutFailure() {
    //set an error message in the flash area
    displayError("You are either not clocked in, or entered the wrong code!");

    $('#num').val("");
    $('#clockincode_show').html("");
}