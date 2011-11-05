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
    
    //start calling home
    callHomePoll();
}