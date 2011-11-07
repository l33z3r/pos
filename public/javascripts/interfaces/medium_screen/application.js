$(function(){
    doGlobalInit();
});
    
function doGlobalInit() {
    //allow scroll for dev
    if(inDevMode()) {
        $('body').css("overflow", "scroll");
    }
    
    if(isTouchDevice()) {
        initTouch();
        initTouchRecpts();
    }
    
    initUIElements();
    
    initPressedCSS();
    
    initMenu();
    
    //set the first page in the swipes to be the menu
    var menuPageNum = 1;
    $('#content-scroll').attr('scrollLeft', menuPageNum * pageWidth);
    
    //start calling home
    callHomePoll();
}