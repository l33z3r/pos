function showSpinner() {
    if(inAndroidWrapper()) {
        clueyAndroidJSInterface.showSpinner();
    } else {    
        showLoadingDiv();
    }
}

function hideSpinner() {
    if(inAndroidWrapper()) {
        clueyAndroidJSInterface.hideSpinner();
    } else {    
        hideLoadingDiv();
    }
}

function stopVibrate() {
    if(inAndroidWrapper()) {
        clueyAndroidJSInterface.cancelVibrate();
    }
}

function vibrate() {
    if(inAndroidWrapper()) {
        clueyAndroidJSInterface.vibrate();
    }
}

function vibrateConstant() {
    if(inAndroidWrapper()) {
        clueyAndroidJSInterface.vibrateConstant();
    }
}

function exitAndroidApp() {
    var doIt = confirm("Are you sure you want to exit?");
    
    if(doIt && inAndroidWrapper()) {
        clueyAndroidJSInterface.exitApp();
    }
}

function showAndroidKeyboard() {
    if(inAndroidWrapper()) {
        clueyAndroidJSInterface.showKeyboard();
    }
}

function hideAndroidKeyboard() {
    if(inAndroidWrapper()) {
        clueyAndroidJSInterface.hideKeyboard();
    }
}

function getAndroidFingerPrint() {
    if(inAndroidWrapper()) {
        return clueyAndroidJSInterface.getAndroidDeviceId();
    }
    
    return "noid";
}

function updateApp() {
    if(inAndroidWrapper()) {        
        clueyAndroidJSInterface.updateApp()
    }
}