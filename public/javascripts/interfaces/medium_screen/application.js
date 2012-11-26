//this is used for paging
var numPages = 4;

var receiptPageNum = 1;
var menuPageNum = 2;
var functionsPageNum = 3;
var settingsPageNum = 4;

var currentScreenIsMenu = false;
var currentScreenIsReceipt = false;
var currentScreenIsFunctions = false;
var currentScreenIsSettings = false;
    
var screenSlideSpeed = 300;
var screenSlideDelayAmount = screenSlideSpeed + 80;
var pageWidth = 480;

var scrollSpeed = 600;

$(function(){
    doGlobalInit();
});
    
function doGlobalInit() {
    //auto login for now until we sort out a pin screen
    if(!current_user_id) {
        current_user_id = employees[0].id;
        current_user_nickname = employees[0].nickname;
        current_user_is_admin = employees[0].is_admin;
        current_user_passcode = employees[0].passcode;
    
        storeActiveUserID(current_user_id);
    
        //send ajax login
        $.ajax({
            type: 'POST',
            url: '/login',
            data: {
                employee_id : current_user_id
            }
        });
    }
    
    //allow scroll for dev
    if(inDevMode()) {
        $('body').css("overflow", "scroll");
    }
    
    if(showPrintFrame) {
        $('#wrapper').height(1770);
        $('#body').height(1770);
        $('#printFrame').width(600).height(1800);
        $('#printFrame').css("overflow", "scroll");
    }
    
    //need to set the scroll content holder width
    $('#content-holder').width(pageWidth * numPages);
    
    setFingerPrintCookie();
    
    if(isTouchDevice()) {
        initTouch();
        initTouchRecpts();
        
        var menuScrollerOpts = {
            elastic: false,
            momentum: false
        };
        
        //init touch menu pages and items
        $('#menu_items_scroller').touchScroll(menuScrollerOpts);
        $('#menu_pages_scroller').touchScroll(menuScrollerOpts);
        
        setTimeout(kickMenuScrollers, 2000);
    }
    
    initUIElements();
    
    initPressedCSS();
    
    renderActiveTables();
    
    initMenu();
    
    //set the first page in the swipes to be the menu
    setFirstPage();
    
    //hide the exit app button if we are not in the android wrapper
    if(!inAndroidWrapper()) {
        $('#exit_app_button').hide();
    }
    
    //set the menu select dropdown initial value
    menuSelectMenu.setValue(selectedDisplayId);
    
    //start calling home
    callHomePoll();
    
    clueyScheduler();
}

//this gets called from the polling when a terminal is not yet set
function showTerminalSelectDialog() {
    niceAlert("Please select from the following list of terminals:");
}

function doSubmitSettings() {
    showSpinner();
    $('#settings_form').submit();
}

function doScheduledTasks() {
    //this is called on at regular intervals
    pingHome();
}

function cacheDownloadReset() {
    $('body').removeClass("cache_update");
    $('#cache_status').text("");
    $('#cache_status').hide();
}

function cacheDownloadStarted() {
    $('body').addClass("cache_update");
    $('#cache_status').show();
    $('#cache_status').text("Cache DL: 0%");
}