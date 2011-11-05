var screenSlideSpeed = 300;
var screenSlideDelayAmount = screenSlideSpeed + 80;
var pageWidth = 480;
var numPages = 3;

var currentScreenIsMenu = true;
var currentScreenIsReceipt = false;
var currentScreenIsFunctions = false;
    
var scrollSpeed = 600;
    
function swipeLeftHandler() {
    
    var currentLeftScroll = $('#content-scroll').attr('scrollLeft');
    
    var nextPageScroll = currentLeftScroll + pageWidth;
    
    if(doScroll(nextPageScroll)) {
        //are we on the menu screen, if so, go to the receipt screen
        if(currentScreenIsMenu) {
            currentScreenIsMenu = false;
            currentScreenIsFunctions = true;
        } else if(currentScreenIsFunctions) {
            currentScreenIsFunctions = false;
            currentScreenIsMenu = true;
        }
        
        //some bug makes the receipt get stuck, so this call prevents it
        setTimeout(menuRecptScroll, scrollSpeed + 100);
    }
}

function swipeRightHandler() {
    
    var currentLeftScroll = $('#content-scroll').attr('scrollLeft');
    
    var previousPageScroll = currentLeftScroll - pageWidth;
    
    if(doScroll(previousPageScroll)) {    
        //are we on the menu screen, if so, go to the receipt screen
        if(currentScreenIsMenu) {
            currentScreenIsMenu = false;
            currentScreenIsFunctions = true;
        } else if(currentScreenIsReceipt) {
            currentScreenIsReceipt = false;
            currentScreenIsMenu = true;
        }
    
        //some bug makes the receipt get stuck, so this call prevents it
        setTimeout(menuRecptScroll, scrollSpeed + 100);
    }
}

function doScroll(scrollLeftValue) {
    
    if(scrollLeftValue < 0 || scrollLeftValue > (pageWidth * numPages - 1)) {
        return false;
    }
    
    $("#content-scroll").animate({
        scrollLeft: scrollLeftValue
    }, scrollSpeed);
    
    return true;
}