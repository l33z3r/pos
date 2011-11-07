var screenSlideSpeed = 300;
var screenSlideDelayAmount = screenSlideSpeed + 80;
var pageWidth = 480;

var currentScreenIsMenu = false;
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
        } else if(currentScreenIsReceipt) {
            currentScreenIsReceipt = false;
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
            currentScreenIsReceipt = true;
        } else if(currentScreenIsFunctions) {
            currentScreenIsFunctions = false;
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

function swipeToFunctions() {
    if(currentScreenIsFunctions) return;
    clearAllPageFlags();
    doScroll((functionsPageNum - 1) * pageWidth);
    currentScreenIsFunctions = true;
}

function swipeToMenu() {
    if(currentScreenIsMenu) return;
    clearAllPageFlags();
    doScroll((menuPageNum - 1) * pageWidth);
    currentScreenIsMenu = true;
}

function swipeToReceipt() {
    if(currentScreenIsReceipt) return;
    clearAllPageFlags();
    doScroll((receiptPageNum - 1) * pageWidth);
    currentScreenIsReceipt = true;
}

function clearAllPageFlags() {
    currentScreenIsFunctions = currentScreenIsMenu = currentScreenIsReceipt = false;
}

function setFirstPage() {
    pageNum = menuPageNum;
    $("#content-scroll").scrollLeft((pageNum - 1) * pageWidth);
}