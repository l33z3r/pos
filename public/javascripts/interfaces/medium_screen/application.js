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
    //allow scroll for dev
    if(inDevMode()) {
        $('body').css("overflow", "scroll");
    }
    
    //need to set the scroll content holder width
    $('#content-holder').width(pageWidth * numPages);
    
    setFingerPrintCookie();
    
    if(isTouchDevice()) {
        initTouch();
        initTouchRecpts();
    }
    
    initUIElements();
    
    initPressedCSS();
    
    initMenu();
    
    //set the first page in the swipes to be the menu
    setFirstPage();
    
    //hide the exit app button if we are not in the android wrapper
    if(!inAndroidWrapper()) {
        $('#exit_app_button').hide();
    }
    
    //start calling home
    callHomePoll();
}

function doSubmitSettings() {
    showSpinner();
    $('#settings_form').submit();
}