function swipeRightHandler() {
    hideMenuKeypad();
    
    //don't do anything if we are on the tables screen
    if(currentMenuSubscreenIsTableScreen()) {
        return;
    }
    
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
        } else if(currentScreenIsSettings) {
            currentScreenIsSettings = false;
            currentScreenIsFunctions = true;
        }
    
        //some bug makes the receipt get stuck, so this call prevents it
        setTimeout(menuRecptScroll, scrollSpeed + 100);
    }
}

function swipeUpHandler() {
    if(currentMenuSubscreenIsMenu() && !menuKeypadShowing) {
        showMenuKeypad();
    }
}

function swipeLeftHandler() {
    hideMenuKeypad();
    
    //don't do anything if we are on the tables screen
    if(currentMenuSubscreenIsTableScreen()) {
        return;
    }
    
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
        } else if(currentScreenIsFunctions) {
            currentScreenIsFunctions = false;
            currentScreenIsSettings = true;
        }
        
        //some bug makes the receipt get stuck, so this call prevents it
        setTimeout(menuRecptScroll, scrollSpeed + 100);
    }
}

function swipeDownHandler() {
    if(currentMenuSubscreenIsMenu() && menuKeypadShowing) {
        hideMenuKeypad();
    }
}

function showMenuKeypad() {
    menuKeypadShowing = true;
    $('#menu_keypad').slideDown(300);
}

function hideMenuKeypad() {
    menuKeypadShowing = false;
    $('#menu_keypad').slideUp(300);
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

function swipeToReceipt() {
    if(currentScreenIsReceipt) return;
    clearAllPageFlags();
    doScroll((receiptPageNum - 1) * pageWidth);
    currentScreenIsReceipt = true;
}

function swipeToMenu() {
    if(currentScreenIsMenu) return;
    clearAllPageFlags();
    doScroll((menuPageNum - 1) * pageWidth);
    currentScreenIsMenu = true;
}

function swipeToFunctions() {
    if(currentScreenIsFunctions) return;
    clearAllPageFlags();
    doScroll((functionsPageNum - 1) * pageWidth);
    currentScreenIsFunctions = true;
}

function swipeToSettings() {
    if(currentScreenIsSettings) return;
    clearAllPageFlags();
    doScroll((settingsPageNum - 1) * pageWidth);
    currentScreenIsSettings = true;
}

function clearAllPageFlags() {
    currentScreenIsFunctions = currentScreenIsMenu = currentScreenIsReceipt = false;
}

function setFirstPage() {
    pageNum = functionsPageNum;
    $("#content-scroll").scrollLeft((pageNum - 1) * pageWidth);
    currentScreenIsFunctions = true;
}