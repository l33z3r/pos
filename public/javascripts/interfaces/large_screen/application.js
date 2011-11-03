var showingDisplayButtonPasscodePromptPopup;

//global button permissions map that contains permissions hashed on role id
var all_display_button_permissions;

//this array stores wether or not to call for a 
//passcode prompt when a screen button is pressed
var display_button_passcode_permissions;

$(function(){
    doGlobalInit();
});
   
function doGlobalInit() {
    if(inKioskMode()) {
        //to run chrome in kiosk mode, use this command in linux (google-chrome --kiosk http://localhost:3000)
        registerDisallowRightClick();
    } else {
        $('body').css("overflow", "scroll");
    }
    
    initUIElements();
    
    initAdminTables();
    
    setFingerPrintCookie();
    
    if(isTouchDevice()) {
        initTouch();
        initTouchRecpts();
    }
    
    //check if we have loaded a previous order from the admin interface
    //this will also load it into tableOrders[-1]
    initPreviousOrder();
    
    //custom button widths
    renderMenuItemButtonDimensions();
    
    if(inMenuContext()) {
        initMenu();
    }
    
    //start the clock in the nav bar
    $("div#clock").clock({
        "calendar":"false",
        "format": clockFormat
    });
    
    //init the display button passcode request popup
    $('#menu_buttons_popup_anchor').CreateBubblePopup();
    $('#menu_buttons_popup_anchor').FreezeBubblePopup();
    
    lastSaleInfo = getLastSaleInfo();

    if(lastSaleInfo) {
        setLoginReceipt(lastSaleInfo.title, lastSaleInfo.contentHTML)
    }
    
    showInitialScreen();
    
    showScreenFromHashParams();
    
    //    $('#flash_container').delay(500).fadeIn(500, function() {
    //        $(this).delay(3000).fadeOut(500);
    //    });
    
    //any input that gains focus will call this function
    $("input,textarea").live("focus", function(event) {
        //unhighlight last active
        if(typeof lastActiveElement != "undefined") {
            lastActiveElement.removeClass("focus");
        }
        
        lastActiveElement = $(this);
        
        //unhighlight last active
        lastActiveElement.addClass("focus");
        
        event = event || window.event
 
        //the following was an attempt to hide the ipad keyboard but didnt work
        if (event.preventDefault) {  // W3C variant
            event.preventDefault()
        } else { // IE<9 variant:
            event.returnValue = false
        }
        
    });
    
    if(doBeep) {
        initBeep();
    }
    
    //start calling home
    callHomePoll();
    
    if(inProdMode()) {
        //start checking for cache updates
        cacheUpdateCheckPoll();
    }
}

function showInitialScreen() {
    if(current_user_id == null) {
        showLoginScreen();

        $('#clockincode_show').html("");
        $('#num').val("");
    } else {
        showMenuScreen();
        
        //show the red x 
        $('#nav_save_button').show();
        
        //show the shortcut dropdown
        $('#menu_screen_shortcut_dropdown_container').show();
        
        if(current_user_nickname != null) $('#e_name').html(current_user_nickname);
    }
    
}

var displayButtonForwardFunction;

function doDisplayButtonPasscodePrompt(button_id, forwardFunction) {
    closePreviousModifierDialog();
        
    if(display_button_passcode_permissions[button_id]) {
        displayButtonForwardFunction = forwardFunction;
        
        if(inAdminContext()) {
            if(!currentScreenIsMenu()) {
                setStatusMessage("Must be on menu screen for this function!");
                return;
            }
            showAdminDisplayButtonPasscodePromptPopup(button_id, forwardFunction);
        } else {
            checkMenuScreenForFunction();
            showDisplayButtonPasscodePromptPopup();
        }
    } else {
        forwardFunction.call();
    }
}

function showAdminDisplayButtonPasscodePromptPopup(button_id, forwardFunction) {
    $('#display_button_passcode').val('');
    
    toggleUtilKeyboard();
    
    showingDisplayButtonPasscodePromptPopup = true;
    
    //show the popup
    $('#menu_buttons_popup_anchor').ShowBubblePopup({
        align: 'center',
        innerHtml: "<div id='display_button_passcode_popup'><div id='header'>Enter Pass Code:</div>" + 
        "<input type='text' id='display_button_passcode'/>" + clearHTML +
        "<div id='display_button_submit_passcode' class='button' onclick='displayButtonPasscodeEntered()'>Submit</div>" + 
        "<div id='cancel_display_button_passcode_prompt' class='button' onclick='cancelDisplayButtonPasscodePromptPopup();return false;'>Cancel</div></div>",
														   
        innerHtmlStyle:{ 
            'text-align':'left'
        },
												   
        themeName: 	'all-grey',
        themePath: 	'/images/jquerybubblepopup-theme'

    }, false);
    
    $('#menu_buttons_popup_anchor').FreezeBubblePopup();
    
    popupId = $('#menu_buttons_popup_anchor').GetBubblePopupID();
    
    $('#' + popupId).find('#display_button_passcode').focus();
}

function displayButtonPasscodeEntered() {
    enteredCode = $('#display_button_passcode').val();
    
    if(enteredCode == current_user_passcode) {
        showingDisplayButtonPasscodePromptPopup = false;
        $('#display_button_passcode').val('');
        $('#display_button_passcode_show').html('');
    
        hideBubblePopup($('#menu_buttons_popup_anchor'));
    
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
        "<div id='display_button_submit_passcode' class='button' onclick='displayButtonPasscodeEntered()'>Submit</div>" + 
        "<div id='cancel_display_button_passcode_prompt' class='button' onclick='cancelDisplayButtonPasscodePromptPopup();return false;'>Cancel</div></div>",
														   
        innerHtmlStyle:{ 
            'text-align':'left'
        },
												   
        themeName: 	'all-grey',
        themePath: 	'/images/jquerybubblepopup-theme'

    }, false);//save_options = false; it will use new options only on click event, it does not overwrite old options.
    
    $('#menu_buttons_popup_anchor').FreezeBubblePopup();
    
    popupId = $('#menu_buttons_popup_anchor').GetBubblePopupID();
    
    //register the click handler to hide the popup when outside clicked
    registerPopupClickHandler($('#' + popupId).add('#till_keypad'), cancelDisplayButtonPasscodePromptPopup);
}

function cancelDisplayButtonPasscodePromptPopup() {
    showingDisplayButtonPasscodePromptPopup = false;
    hideBubblePopup($('#menu_buttons_popup_anchor'));
}

var roomScaleX;
var roomScaleY;

var currentSelectedRoom = -1;

function initTableSelectScreen() {
    //alert(currentSelectedRoom);
    
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

function initAdminTables() {
    $('.admin_table thead tr th:first').addClass('first');
    $('.admin_table thead tr th:last').addClass('last');
    
    $('.admin_table tbody tr').each(function() {
        $(this).find('td:first').addClass('first')
    });
    $('.admin_table tbody tr').each(function() {
        $(this).find('td:last').addClass('last')
    });
    
    $('.admin_table tbody tr:odd').addClass('odd');
}