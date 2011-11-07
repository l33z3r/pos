//this is used for paging
var numPages = 3;

var receiptPageNum = 1;
var menuPageNum = 2;
var functionsPageNum = 3;

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
    
    if(isTouchDevice()) {
        initTouch();
        initTouchRecpts();
    }
    
    initUIElements();
    
    initPressedCSS();
    
    initMenu();
    
    //set the first page in the swipes to be the menu
    setFirstPage();
    
    //start calling home
    callHomePoll();
}