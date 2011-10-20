var screenSlideSpeed = 300;
var screenSlideDelayAmount = screenSlideSpeed + 80;

function swipeLeftHandler() {
    //are we on the menu screen, if so, go to the receipt screen
    if(currentScreenIsMenu()) {
        $('#menu_screen').slideLeftHide();
        $('#receipt_screen').delay(screenSlideDelayAmount).slideRightShow();
    } else if(currentScreenIsFunctions()) {
        $('#functions_screen').slideLeftHide();
        $('#menu_screen').delay(screenSlideDelayAmount).slideRightShow();
    }
}

function swipeRightHandler() {
    //are we on the menu screen, if so, go to the receipt screen
    if(currentScreenIsMenu()) {
        $('#menu_screen').slideRightHide();
        $('#functions_screen').delay(screenSlideDelayAmount).slideLeftShow();
    } else if(currentScreenIsReceipt()) {
        $('#receipt_screen').slideRightHide();
        $('#menu_screen').delay(screenSlideDelayAmount).slideLeftShow();
    }
}