function showSpinner() {
    if(inAndroidWrapper()) {
        demoJSInterface.showSpinner();
    }
}

function hideSpinner() {
    if(inAndroidWrapper()) {
        demoJSInterface.hideSpinner();
    }
}

function stopVibrate() {
    if(inAndroidWrapper()) {
        demoJSInterface.cancelVibrate();
    }
}

function vibrate() {
    if(inAndroidWrapper()) {
        demoJSInterface.vibrate();
    }
}

function vibrateConstant() {
    if(inAndroidWrapper()) {
        demoJSInterface.vibrateConstant();
    }
}