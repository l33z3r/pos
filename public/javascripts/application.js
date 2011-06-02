var current_user_id;
var current_user_nickname;
var current_user_is_admin;
var current_user_passcode;

var showingDisplayButtonPasscodePromptPopup;

//this array stores wether or not to call for a 
//passcode prompt when a screen button is pressed
var display_button_passcode_permissions;

//this is so we can use the keypad for both clock in and log in
var showingPassCodeDialog = false;

$(function(){
    setFingerPrintCookie();
    
    initMenu();

    //the following code initializes all the flexigrid tables
    initFlexigridTables();
    
    resetLoginBubblePopups();
    
    //init the display button passcode request popup
    $('#menu_buttons_popup_anchor').CreateBubblePopup({
        themeName: 	'black',
        themePath: 	'/images/jquerybubblepopup-theme'
    });
            
    $('#menu_buttons_popup_anchor').FreezeBubblePopup();
    
    setTimeout(callHomePoll, 10000);
});

function callHomePoll() {
    callHomeURL = "/call_home.js"
    
    $.ajax({
        url: callHomeURL,
        dataType: 'script',
        success: callHomePollComplete,
        data : {
            lastUpdateTime : lastUpdateTime
        }
    });
}

function callHomePollComplete() {
    setTimeout(callHomePoll, 5000);
}

function resetLoginBubblePopups() {
    for (var i = 0; i < employees.length; i++) {
        boxEl = $('#employee_box_' + employees[i].id);
        
        if(boxEl.length>0) {
            if(!boxEl.HasBubblePopup()) {
                boxEl.CreateBubblePopup({
                    themeName: 	'black',
                    themePath: 	'/images/jquerybubblepopup-theme'
                });
            
                boxEl.FreezeBubblePopup();
            }
        }
    }
}

function hideAllLoginBubblePopups() {
    for (var i = 0; i < employees.length; i++) {
        boxEl = $('#employee_box_' + employees[i].id);
        
        if(boxEl.length>0) {
            if(boxEl.HasBubblePopup()) {
                boxEl.HideBubblePopup();
                boxEl.FreezeBubblePopup();
            }
        }
    }
}

$(function(){
    $('#menu_screen').hide();
    $('#total_screen').hide();
    $('#table_select_screen').hide();

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
        
        //show the red x 
        $('#nav_save_button').show();
        
        if(current_user_nickname != null) $('#e_name').html(current_user_nickname);
    }
});

//init login screen keypad
$(function(){
    for(i=0; i<10; i++) {
        $('#num_' + i).click(function() {
            if(showingPassCodeDialog) {
                $('.passcode_show').html($('.passcode_show').html() + this.innerHTML);
                $('#passcode').val($('#passcode').val() + this.innerHTML);
            } else {
                $('#clockincode_show').html($('#clockincode_show').html() + this.innerHTML);
                $('#num').val($('#num').val() + this.innerHTML);
            }
        });
    }
});

$(function() {
    $('#flash_container').delay(500).slideDown(500, function() {
        $(this).delay(3000).slideUp(500);
    });
});

function showLoginDialog(id) {
    if(bypassPin) {
        //load the user credentials and call login success function
        for (var i = 0; i < employees.length; i++) {
            if(id == employees[i].id) {
                nickname = employees[i].nickname;
                is_admin = employees[i].is_admin;
                passcode = employees[i].passcode;
                loginSuccess(id, nickname, is_admin, passcode);
                return;
            }
        }
    }
    
    hideAllLoginBubblePopups();
    $('#passcode').val("");
    $('.passcode_show').html("");
    
    showingPassCodeDialog = true;
    
    boxEl = $('#employee_box_' + id);
    
    boxEl.ShowBubblePopup({
        align: 'center',
        innerHtml: "<div id='login_popup'><div id='header'>Enter Pass Code:</div>" + 
        "<div class='passcode_show'></div>" + 
        "<div id='submit_passcode' onclick='doLogin(" + id + ");'>Log In</div>" + 
        "<div id='cancel_show_login' onclick='cancelShowLoginDialog(" + id + ");return false;'>Cancel</div></div>",
														   
        innerHtmlStyle:{ 
            'text-align':'left'
        },
												   
        themeName: 	'black',
        themePath: 	'/images/jquerybubblepopup-theme'

    }, false);//save_options = false; it will use new options only on click event, it does not overwrite old options.
    
    boxEl.FreezeBubblePopup();
}

function cancelShowLoginDialog(id) {
    showingPassCodeDialog = false;
    $('#employee_box_' + id).HideBubblePopup();
    $('#employee_box_' + id).FreezeBubblePopup();
}

function doLogin(user_id) {
    entered_code = $('#passcode').val();
    
    if(current_user_id != null) {
        //already logged in
        displayError("You are already logged in. Please log out.")
        return;
    }

    for (var i = 0; i < employees.length; i++) {
        passcode = employees[i].passcode;
        id = employees[i].id
        
        if(entered_code == passcode && user_id == id) {
            nickname = employees[i].nickname;
            is_admin = employees[i].is_admin;
            loginSuccess(id, nickname, is_admin, passcode);
            return;
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

    //show login overlay
    $('#menu_screen').hide();
    $('#table_select_screen').hide();
    $('#total_screen').hide();
    $('#landing').show();
    
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

function doClockin(entered_code) {
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
            clockinSuccess(id);
            return;
        }
    }

    clockinFailure();
}

function doClockout(entered_code) {
    for (var i = 0; i < employees.length; i++){
        id = employees[i].id
        nickname = employees[i].nickname
        
        clockinCode = employees[i].clockin_code;

        is_admin = employees[i].is_admin;

        if(entered_code == clockinCode) {
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
    showingPassCodeDialog = false;
    hideAllLoginBubblePopups();
    
    current_user_id = id;
    current_user_nickname = nickname;
    current_user_is_admin = is_admin;
    current_user_passcode = passcode;
    
    //set the username in the menu
    $('#e_name').html(nickname);
    
    //hide login overlay
    $('#landing').hide();

    //initialise the options buttons
    initOptionButtons();
    
    $('#menu_screen').show();

    //show the red x 
    $('#nav_save_button').show();
    
    $('#e_name').show();

    loadCurrentOrder();
    displayLastReceipt();
    loadFirstMenuPage();
    
    //send ajax login
    $.ajax({
        type: 'POST',
        url: '/login',
        data: {
            id : id
        }
    });

    trySendOutstandingOrdersToServer();
    
    //finally, if the default screen to show 
    //after login is the tables screen then show it!
    if(defaultPostLoginScreen == TABLES_SCREEN) {
        showTablesScreen();
    }
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

    $('#passcode').val("");
    $('.passcode_show').html("");
}

function clockoutFailure() {
    //set an error message in the flash area
    displayError("You are either not clocked in, or entered the wrong code!");

    $('#num').val("");
    $('#clockincode_show').html("");
}

function doCancelLoginKeypad() {
    if(showingPassCodeDialog) {
        $('#passcode').val("");
        $('.passcode_show').html("");
    } else {
        $('#num').val("");
        $('#clockincode_show').html("");
    }
}

function displayError(message) {
    alert("Error: " + message);
}

function displayNotice(message) {
    alert("Notice: " + message);
}

function copyReceiptToLoginScreen() {
    clearHTML = "<div class='clear'>&nbsp;</div>";
    
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

    newHTML += $('#till_roll_discount').html() + clearHTML;
    newHTML += $('#sales_tax_total').html() + clearHTML;
    
    if(total>0) {
        totalText = number_to_currency(total, {
            precision : 2, 
            showunit : true
        })
        newHTML += "<div id='login_till_roll_total_label'>Total:</div><div id='login_till_roll_total_value'>" + totalText + "</div>";
    }
    
    //tendered includes the euro sign, so if it is bigger
    //than one, it has been set on totals screen and we should show it
    if(totalTendered.length>0) {
        totalTenderedText = number_to_currency(totalTendered, {
            precision : 2, 
            showunit : true
        })
        newHTML += "<div id='login_till_roll_tendered_label'>Tendered:</div><div id='login_till_roll_tendered_value'>" + totalTenderedText + "</div>";
    }
    
    //change includes the euro sign, so if it is bigger
    //than one, it has been set on totals screen and we should show it
    if(change.length>0) {
        changeText = number_to_currency(change, {
            precision : 2, 
            showunit : true
        })
        newHTML += "<div id='login_till_roll_change_label'>Change:</div><div id='login_till_roll_change_value'>" + changeText + "</div>";
    }
    
    receiptMessageHTML = "<div id='receipt_message'>" + receiptMessage + "</div>";
    newHTML += clearHTML + receiptMessageHTML;
    
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

function displayButtonRoleAdminScreenSelectPasscode(dbr_id, checked) {
    $.ajax({
        type: 'POST',
        url: '/admin/display_buttons/update_admin_screen_button_role',
        data: {
            id : dbr_id,
            passcode_required : checked
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

var displayButtonForwardFunction;

function doDisplayButtonPasscodePrompt(button_id, forwardFunction) {
    if(display_button_passcode_permissions[button_id]) {
        displayButtonForwardFunction = forwardFunction;
        
        showDisplayButtonPasscodePromptPopup();
    } else {
        forwardFunction.call();
    }
}

function displayButtonPasscodeEntered() {
    enteredCode = $('#display_button_passcode').val();
    
    if(enteredCode == current_user_passcode) {
        showingDisplayButtonPasscodePromptPopup = false;
        $('#display_button_passcode').val('');
        $('#display_button_passcode_show').html('');
    
        $('#menu_buttons_popup_anchor').HideBubblePopup();
        $('#menu_buttons_popup_anchor').FreezeBubblePopup();
    
        displayButtonForwardFunction.call();
        displayButtonForwardFunction = null;
    } else {
        alert("Passcode Incorrect, try again!");
        $('#display_button_passcode').val('');
        $('#display_button_passcode_show').html('');
    }
}

function showDisplayButtonPasscodePromptPopup() {
    $('#display_button_passcode').val('');
    $('#display_button_passcode_show').html('');
            
    showingDisplayButtonPasscodePromptPopup = true;
    
    //show the popup
    $('#menu_buttons_popup_anchor').ShowBubblePopup({
        align: 'center',
        innerHtml: "<div id='display_button_passcode_popup'><div id='header'>Enter Pass Code:</div>" + 
        "<div id='display_button_passcode_show'></div>" + 
        "<div id='display_button_submit_passcode' onclick='displayButtonPasscodeEntered()'>Submit</div>" + 
        "<div id='cancel_display_button_passcode_prompt' onclick='cancelDisplayButtonPasscodePromptPopup();return false;'>Cancel</div></div>",
														   
        innerHtmlStyle:{ 
            'text-align':'left'
        },
												   
        themeName: 	'black',
        themePath: 	'/images/jquerybubblepopup-theme'

    }, false);//save_options = false; it will use new options only on click event, it does not overwrite old options.
    
    $('#menu_buttons_popup_anchor').FreezeBubblePopup();
}

function cancelDisplayButtonPasscodePromptPopup() {
    showingDisplayButtonPasscodePromptPopup = false;
    $('#menu_buttons_popup_anchor').HideBubblePopup();
    $('#menu_buttons_popup_anchor').FreezeBubblePopup();
}

var roomScaleX;
var roomScaleY;

var currentSelectedRoom = -1;

function initTableSelectScreen() {
    if(currentSelectedRoom == 0) {
        currentSelectedRoom = $('.room_graphic').first().data('room_id');
    }
    
    $('#select_room_button_' + currentSelectedRoom).click();
    setSelectedTable();
}

function setSelectedTable() {
    //set selected table for this room
    $('.room_graphic').children('div.label').removeClass("selected_table");
    
    //set a class on the div to make it look selected
    $('#table_' + selectedTable).children('div.label').addClass("selected_table");
}

function loadRoomGraphic(room_id) {
    $('.room_name').removeClass("selected");
    $('#select_room_button_' + room_id).addClass("selected");
    
    currentSelectedRoom = room_id;
    
    $('#room_layout').html($('#room_graphic_' + room_id).html());
    
    room_grid_x_size = $('#room_graphic_' + room_id).data("grid_x_size");
    room_grid_y_size = $('#room_graphic_' + room_id).data("grid_y_size");
    room_grid_resolution = $('#room_graphic_' + room_id).data("room_grid_resolution");
    
    setScale(room_grid_resolution, room_grid_x_size, room_grid_y_size);
    setRoomObjectGridPositions();
    
    //copy the dynamic ids over
    $('#room_layout .room_object').each(function(index) {
        theid = $(this).attr("data-theid");
        $(this).attr("id", theid);
    });
    
    setSelectedTable();
}

var maxGridSize = 70;
var minGridSize = 30;

function setScale(room_grid_resolution, room_grid_x_size, room_grid_y_size) {
    scale = (maxGridSize - room_grid_resolution) + minGridSize;
    
    $('#room_layout').width(room_grid_x_size * scale);
    $('#room_layout').height(room_grid_y_size * scale);
    
    container_div_width = $('#room_layout').width();
    container_div_height = $('#room_layout').height();
   
    roomScaleX = container_div_width / room_grid_x_size;
    roomScaleY = container_div_height / room_grid_y_size;
    
//alert("X: " + roomScaleX + " Y: " + roomScaleY);
}

function setRoomObjectGridPositions() {
    $('.room_object').each(function() {
        ro = $(this);
        ro_image = ro.children('img');
        
        grid_x = ro.data("grid_x");
        grid_y = ro.data("grid_y");
        
        grid_x_size = ro.data("grid_x_size");
        grid_y_size = ro.data("grid_y_size");
        
        //have to subtract 1 from grid_x and grid_y
        grid_x--;
        grid_y--;
        
        ro.css("margin-left", grid_x * roomScaleX);
        ro.css("margin-top", grid_y * roomScaleY);
    
        ro_image.width(grid_x_size * roomScaleX);
        ro_image.height(grid_y_size * roomScaleY);
    });
}

//this checks if we are on menu screen as some buttons will only work on that screen
//this code is in lib/button_mapper.rb
function checkMenuScreenForFunction() {
    if(!$('#menu_screen').is(":visible")) {
        alert("Functionality Only Available On Menu Screen!");
        return false;
    }
    
    return true;
}

//used for setting the terminal id using the browsers fingerprint and save it in a cookie
//uses the fingerprint library with md5 hash
function setFingerPrintCookie() {
    c_name = "terminal_fingerprint";
    
    if(getRawCookie(c_name) == null) {
        c_value = pstfgrpnt(true).toString();
        exdays = 365;
    
        setRawCookie(c_name, c_value, exdays);
    }
}

function setRawCookie(c_name, value, exdays) {
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value;
}

function getRawCookie(c_name) {
    var i,x,y,ARRcookies=document.cookie.split(";");
    for (i=0;i<ARRcookies.length;i++)
    {
        x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
        y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
        x=x.replace(/^\s+|\s+$/g,"");
        if (x==c_name)
        {
            return unescape(y);
        }
    }

    return null;
}

function initFlexigridTables() {
    $('table').flexigrid({
        height:'auto'
    });
}