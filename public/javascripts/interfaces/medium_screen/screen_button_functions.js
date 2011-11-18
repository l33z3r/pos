function toggleModifyOrderItemScreen() {
    if(currentMenuSubscreenIsModifyOrderItem()) {
        hideAllMenuSubScreens();
        switchToMenuItemsSubscreen();
    } else {
        showModifyOrderItemScreen();
    }
}

function showTablesScreen() {
    if(currentMenuSubscreenIsTableScreen()) {
        hideAllMenuSubScreens();
        showMenuItemsSubscreen();
    } else {
        //delegate to subscreen shower
        showTablesSubscreen();
    }
}

function showMoreOptionsScreen() {
    alert("more options button pressed!");
}

function goToMainMenu() {
    showSpinner();
    goTo('/mbl#menu');
}

function showGlobalSettingsPage() {
    swipeToSettings();
}