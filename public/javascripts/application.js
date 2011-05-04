var current_user_id;
var current_user_nickname;
var current_user_is_admin;

$(function(){
    initMenu();

    //the following code initializes all the flexigrid tables
    $('table#employee_list').flexigrid({
        height:'auto'
    });
    $('table#role_list').flexigrid({
        height:'auto'
    });
    $('table#product_list').flexigrid({
        height:'auto'
    });
    $('table#category_list').flexigrid({
        height:'auto'
    });
    $('table#display_list').flexigrid({
        height:'auto'
    });
    $('table#display_button_list').flexigrid({
        height:'auto'
    });
    $('table#modifier_categories_list').flexigrid({
        height:'auto'
    });
    $('table#modifier_list').flexigrid({
        height:'auto'
    });
});

$(function(){
    $('#menu_screen').hide();
    $('#total_screen').hide();

    if(current_user_id == null) {
        $('#landing').show();

        //load last sale
        lastSaleHTMLOBJ = $.getJSONCookie("last_sale");

        if(lastSaleHTMLOBJ == null) {
            lastSaleHTML = "";
        } else {
            lastSaleHTML = lastSaleHTMLOBJ.html;
        }

        if(lastSaleHTML) {
            $('#login_till_roll').html(lastSaleHTML);
        }
    } else {
        $('#menu_screen').show();
        if(current_user_nickname != null) $('#e_name').html(current_user_nickname);
    }
});

//init login screen keypad
$(function(){
    for(i=0; i<10; i++) {
        $('#num_' + i).click(function() {
            $('#passcode_show').html($('#passcode_show').html() + this.innerHTML);
            $('#num').val($('#num').val() + this.innerHTML);
        });
    }
});

$(function() {
    $('#flash_container').delay(500).slideDown(500, function() {
        $(this).delay(3000).slideUp(500);
    });
});

function doLogin(entered_code) {
    if(current_user_id != null) {
        //already logged in
        displayError("You are already logged in. Please log out.")
        return;
    }

    if(employees.length==0) {
        alert("Please try again in, system initializing...");
        return;
    }

    for (var i = 0; i < employees.length; i++){
        id = employees[i].id
        nickname = employees[i].nickname
        
        passcode = employees[i].passcode;

        is_admin = employees[i].is_admin;

        if(entered_code == passcode) {
            loginSuccess(id, nickname, is_admin);
            return;
        }
    }

    loginFailure();
}

function doLoginWithoutPin(e_id) {
    //simply fetch this users pin and do the normal login to reuse the code
    for (var i = 0; i < employees.length; i++) {
        if(employees[i].id == e_id) {
            thePasscode = employees[i].passcode;
            break;
        }
    }
    
    doLogin(thePasscode);
}

function doLogout() {
    if(current_user_id == null) {
        //not logged in
        displayError("You are not logged in.")
        return;
    }

    current_user_id = null;

    //show login overlay
    $('#landing').show();
    $('#menu_screen').hide();
    $('#num').val("");
    $('#passcode_show').html("");

    $('#e_name').hide();

    //send ajax logout
    $.ajax({
        type: 'POST',
        url: '/logout'
    });
}

function doClockout() {
    if(current_user_id == null) {
        //not logged in
        displayError("You are not logged in.")
        return;
    }

    current_user_id = null;

    //show login overlay
    $('#landing').show();
    $('#menu_screen').hide();
    $('#num').val("");
    $('#passcode_show').html("");

    $('#active_employees').hide();

    $('#e_name').hide();

    copyReceiptToLoginScreen();

    //send ajax clockout
    $.ajax({
        type: 'POST',
        url: '/clockout'
    });
}

function loginSuccess(id, nickname, is_admin) {
    current_user_id = id;
    current_user_nickname = nickname;
    current_user_is_admin = is_admin;
    
    //set the username in the menu
    $('#e_name').html(nickname);
    
    //hide login overlay
    $('#landing').hide();

    //initialise the options buttons
    initOptionButtons();
    
    $('#menu_screen').show();

    $('#e_name').show();

    loadCurrentOrder();
    displayLastReceipt();
    
    //send ajax login
    $.ajax({
        type: 'POST',
        url: '/login',
        data: {
            id : id
        }
    });

    trySendOutstandingOrdersToServer();
}

function loginFailure() {
    //set an error message in the flash area
    displayError("Wrong passcode, please try again.");

    $('#num').val("");
    $('#passcode_show').html("");
}

function doCancelLoginKeypad() {
    $('#num').val("");
    $('#passcode_show').html("");
}

function displayError(message) {
    alert("Error: " + message);
}

function displayNotice(message) {
    alert("Notice: " + message);
}

function copyReceiptToLoginScreen() {
    if(totalOrder != null) {
        total = totalOrder.total;
    } else {
        total = 0;
    }
    
    totalTendered = $('#totals_tendered_value').html();
    change = $('#totals_change_value').html();

    newHTML = "<div id='login_till_roll_user_nickname'>Served By: " + current_user_nickname + "</div>";
    newHTML += "<div id='login_till_roll_served_time'>@ " + $('#clock').html() + "</div>";
    newHTML += $('#till_roll').html();
    newHTML += "<div class='spacer'>&nbsp;</div>";

    if(total>0)
        newHTML += "<div id='login_till_roll_total_label'>Total:</div><div id='login_till_roll_total_value'>€" + total + "</div>";

    //tendered includes the euro sign, so if it is bigger
    //than one, it has been set on totals screen and we should show it
    if(totalTendered.length>1)
        newHTML += "<div id='login_till_roll_tendered_label'>Tendered:</div><div id='login_till_roll_tendered_value'>" + totalTendered + "</div>";

    if(change.length>0)
        newHTML += "<div id='login_till_roll_change_label'>Change:</div><div id='login_till_roll_change_value'>" + change + "</div>";

    $('#login_till_roll').html(newHTML);

    newHTMLOBJ = {
        'html':newHTML
    };
    
    //save the last sale in a cookie to load it into the screen on a reload
    $.JSONCookie("last_sale", newHTMLOBJ, {
        path: '/'
    });
}

//jquery touch ui plugin init
$.extend($.support, {
    touch: "ontouchend" in document
});

// Hook up touch events
$.fn.addTouch = function() {
    if ($.support.touch) {
        this.each(function(i,el){
            el.addEventListener("touchstart", iPadTouchHandler, false);
            el.addEventListener("touchmove", iPadTouchHandler, false);
            el.addEventListener("touchend", iPadTouchHandler, false);
            el.addEventListener("touchcancel", iPadTouchHandler, false);
        });
    }
};

var lastTap = null;

//admin for display buttons

function displayButtonRoleAdminScreenSelect(dbr_id, checked) {
    $.ajax({
        type: 'POST',
        url: '/admin/display_buttons/update_admin_screen_button_role',
        data: {
            id : dbr_id,
            checked : checked
        }
    });
}

function displayButtonRoleSalesScreenSelect(dbr_id, checked) {
    $.ajax({
        type: 'POST',
        url: '/admin/display_buttons/update_sales_screen_button_role',
        data: {
            id : dbr_id,
            checked : checked
        }
    });
}