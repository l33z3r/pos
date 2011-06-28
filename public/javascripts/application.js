var current_user_id;
var current_user_nickname;
var current_user_is_admin;
var current_user_passcode;

var lastActiveElement;

var showingDisplayButtonPasscodePromptPopup;

//this array stores wether or not to call for a 
//passcode prompt when a screen button is pressed
var display_button_passcode_permissions;

var clearHTML = "<div class='clear'>&nbsp;</div>";

$(function(){
    doGlobalInit();
});
   
function doGlobalInit() {
    //allow scroll for dev
    $('body').css("overflow", "scroll");
    
    
    setFingerPrintCookie();
    
    initMenu();
    
    initTouch();

    //the following code initializes all the flexigrid tables
    initFlexigridTables();
    
    //init the display button passcode request popup
    $('#menu_buttons_popup_anchor').CreateBubblePopup();
    $('#menu_buttons_popup_anchor').FreezeBubblePopup();
    
    lastSaleInfo = getLastSaleInfo();

    if(lastSaleInfo) {
        setLoginReceipt(lastSaleInfo.title, lastSaleInfo.contentHTML)
    }
        
    if(current_user_id == null) {
        showLoginScreen();

        $('#clockincode_show').html("");
        $('#num').val("");
    } else {
        showMenuScreen();
        
        //show the red x 
        $('#nav_save_button').show();
        
        if(current_user_nickname != null) $('#e_name').html(current_user_nickname);
    }
    
    showScreenFromHashParams();
    
    $('#flash_container').delay(500).fadeIn(500, function() {
        $(this).delay(3000).fadeOut(500);
    });
    
    //any input that gains focus will call this function
    $("input").live("focus", function() { lastActiveElement = $(this); });
    
    //start calling home
    //callHomePoll();
}

var callHomePollInitSequenceComplete = false;

function callHomePoll() {
    callHomeURL = "/call_home.js"
    
    $.ajax({
        url: callHomeURL,
        dataType: 'script',
        success: callHomePollComplete,
        error: function() {
            setTimeout(callHomePoll, 5000);
        },
        data : {
            lastInterfaceReloadTime : lastInterfaceReloadTime,
            lastSyncTableOrderTime : lastSyncTableOrderTime
        }
    });
}

var immediateCallHome = false;

function callHomePollComplete() {
    if(immediateCallHome) {
        callHomePoll();
    } else {
        callHomePollInitSequenceComplete = true;
        setTimeout(callHomePoll, pollingAmount);
    }
}

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
    closePreviousModifierDialog();
        
    if(display_button_passcode_permissions[button_id]) {
        checkMenuScreenForFunction();
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
        setStatusMessage("Passcode Incorrect, try again!");
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
												   
        themeName: 	'all-grey',
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
    if(!currentScreenIsMenu()) {
        showMenuScreen();
    }
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

function initFlexigridTables() {
    $('table').flexigrid({
        height:'auto'
    });
}