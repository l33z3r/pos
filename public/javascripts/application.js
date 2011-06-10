var current_user_id;
var current_user_nickname;
var current_user_is_admin;
var current_user_passcode;

var showingDisplayButtonPasscodePromptPopup;

//this array stores wether or not to call for a 
//passcode prompt when a screen button is pressed
var display_button_passcode_permissions;

$(function(){
    
    //allow scroll for dev
//    $('body').css("overflow", "scroll");
    
    
    setFingerPrintCookie();
    
    initMenu();

    //the following code initializes all the flexigrid tables
    initFlexigridTables();
    
    //init the display button passcode request popup
    $('#menu_buttons_popup_anchor').CreateBubblePopup({
        themeName: 	'black',
        themePath: 	'/images/jquerybubblepopup-theme'
    });
            
    $('#menu_buttons_popup_anchor').FreezeBubblePopup();
    
    setTimeout(callHomePoll, 5000);
});

function callHomePoll() {
    callHomeURL = "/call_home.js"
    
    $.ajax({
        url: callHomeURL,
        dataType: 'script',
        success: callHomePollComplete,
        data : {
            lastInterfaceReloadTime : lastInterfaceReloadTime,
            lastSyncTableOrderTime : lastSyncTableOrderTime
        }
    });
}

function callHomePollComplete() {
    setTimeout(callHomePoll, 5000);
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
        
        $('#clockincode_show').html("");
        $('#num').val("");
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
            newVal = $('#num').val().toString() + this.innerHTML;
            $('#clockincode_show').html(newVal);
            $('#num').val(newVal);
        });
    }
});

function doCancelLoginKeypad() {
    oldVal = $('#num').val().toString()
    newVal = oldVal.substring(0, oldVal.length - 1);
    $('#clockincode_show').html(newVal);
    $('#num').val(newVal);
}

//TODO: want to move this flash message to a better place
$(function() {
    $('#flash_container').delay(500).slideDown(500, function() {
        $(this).delay(3000).slideUp(500);
    });
});

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
    showingPassCodeDialog = false;
    
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

function displayError(message) {
    alert("Error: " + message);
}

function displayNotice(message) {
    alert("Notice: " + message);
}

function copyReceiptToLoginScreen() {
    //TODO: set the text order/sale???
    
    clearHTML = "<div class='clear'>&nbsp;</div>";
    
    if(totalOrder != null) {
        total = totalOrder.total;
    } else {
        total = 0;
    }
    
    totalTendered = $('#totals_tendered_value').html();
    change = $('#totals_change_value').html();

    newHTML = "<div id='login_till_roll_user_nickname'>Server: " + current_user_nickname + "</div>";
    
    //TODO: format the time
    newHTML += "<div id='login_till_roll_served_time'>Time: " + $('#clock').html() + "</div>";
    
    //TODO: pick up table and display it if table order
    newHTML += "<div id='login_till_roll_table'>Table: X</div>" + clearHTML;
    
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
    
    //we dont display the receipt message on the screen
//    receiptMessageHTML = "<div id='receipt_message'>" + receiptMessage + "</div>";
//    newHTML += clearHTML + receiptMessageHTML;
    
    $('#login_till_roll').html(newHTML);

    newHTMLOBJ = {
        'html':newHTML
    };
    
//need to send this to server and store in session variable as it makes cookie too large
//save the last sale in a cookie to load it into the screen on a reload
//    $.JSONCookie("last_sale", newHTMLOBJ, {
//        path: '/'
//    });
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

function setStatusMessage(message, hide) {
    if (typeof hide == "undefined") {
        hide = true;
    }
  
    $('#global_status_message').html(message);
    
    afterFunction = null;
    
    if(hide) {
        afterFunction = hideStatusMessage;
    }
    
    $('#global_status_message').fadeIn('slow', afterFunction);
}

function hideStatusMessage() {
    setTimeout(function(){
        $('#global_status_message').fadeOut()
    }, 5000);
}