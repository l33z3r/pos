var selectPrintersDialogAnchor = null;

function showSelectPrintersDialog() {
    selectPrintersDialogAnchor = $('#select_printers_button');
    
    if(selectPrintersDialogAnchor.HasBubblePopup()) {
        selectPrintersDialogAnchor.RemoveBubblePopup();
    }
    
    selectPrintersDialogAnchor.CreateBubblePopup();
    
    popupHTML = $('#select_printers_markup').html();
    
    selectPrintersDialogAnchor.ShowBubblePopup({
        position: 'bottom',  
        align: 'middle',
        tail	 : {
            align: 'middle'
        },
        innerHtml: popupHTML,
														   
        innerHtmlStyle:{ 
            'text-align':'left'
        },
        
        themeName: 	'all-grey',
        themePath: 	'/images/jquerybubblepopup-theme',
        alwaysVisible: false        
    }, false);
    
    selectPrintersDialogAnchor.FreezeBubblePopup();
    
    //initialize the iphone sliders
    var popupId = selectPrintersDialogAnchor.GetBubblePopupID();
    
    $('#' + popupId).find(':checkbox').each(function() {
        var terminalName = $(this).data("terminal_name")
        var origChecked = $('#choose_printer_checkbox_' + terminalName).attr("checked");
        $(this).attr("checked", origChecked);
    });
    
    $('#' + popupId).find(':checkbox').iphoneStyle({
        resizeContainer: false, 
        resizeHandle : false, 
        checkedLabel: 'Yes', 
        uncheckedLabel: 'No'
    });
}

function hideSelectPrintersDialog() {
    if(selectPrintersDialogAnchor.HasBubblePopup()) {
        selectPrintersDialogAnchor.HideBubblePopup();
        selectPrintersDialogAnchor.FreezeBubblePopup();
    }
}

function printerSwitchToggle(switchEl) {
    switchEl = $(switchEl);
   
    var is_selected = switchEl.attr("checked");
    var terminalName = switchEl.data("terminal_name");
   
    $('#choose_printer_checkbox_' + terminalName).attr("checked", is_selected);
}

var selectBlockedPrintersDialogAnchor = null;

function showSelectBlockedPrintersDialog() {
    selectBlockedPrintersDialogAnchor = $('#select_blocked_printers_button');
    
    if(selectBlockedPrintersDialogAnchor.HasBubblePopup()) {
        selectBlockedPrintersDialogAnchor.RemoveBubblePopup();
    }
    
    selectBlockedPrintersDialogAnchor.CreateBubblePopup();
    
    popupHTML = $('#select_blocked_printers_markup').html();
    
    selectBlockedPrintersDialogAnchor.ShowBubblePopup({
        position: 'bottom',  
        align: 'middle',
        tail	 : {
            align: 'middle'
        },
        innerHtml: popupHTML,
														   
        innerHtmlStyle:{ 
            'text-align':'left'
        },
        
        themeName: 	'all-grey',
        themePath: 	'/images/jquerybubblepopup-theme',
        alwaysVisible: false        
    }, false);
    
    selectBlockedPrintersDialogAnchor.FreezeBubblePopup();
    
    //initialize the iphone sliders
    var popupId = selectBlockedPrintersDialogAnchor.GetBubblePopupID();
    
    $('#' + popupId).find(':checkbox').each(function() {
        var terminalName = $(this).data("terminal_name")
        var origChecked = $('#choose_blocked_printer_checkbox_' + terminalName).attr("checked");
        $(this).attr("checked", origChecked);
    });
    
    $('#' + popupId).find(':checkbox').iphoneStyle({
        resizeContainer: false, 
        resizeHandle : false, 
        checkedLabel: 'Yes', 
        uncheckedLabel: 'No'
    });
}

function hideSelectBlockedPrintersDialog() {
    if(selectBlockedPrintersDialogAnchor.HasBubblePopup()) {
        selectBlockedPrintersDialogAnchor.HideBubblePopup();
        selectBlockedPrintersDialogAnchor.FreezeBubblePopup();
    }
}

function blockedPrinterSwitchToggle(switchEl) {
    switchEl = $(switchEl);
   
    var is_selected = switchEl.attr("checked");
    var terminalName = switchEl.data("terminal_name");
   
    $('#choose_blocked_printer_checkbox_' + terminalName).attr("checked", is_selected);
}

var selectKitchenScreensDialogAnchor = null;

function showSelectKitchenScreensDialog() {
    selectKitchenScreensDialogAnchor = $('#select_kitchen_screens_button');
    
    if(selectKitchenScreensDialogAnchor.HasBubblePopup()) {
        selectKitchenScreensDialogAnchor.RemoveBubblePopup();
    }
    
    selectKitchenScreensDialogAnchor.CreateBubblePopup();
    
    popupHTML = $('#select_kitchen_screens_markup').html();
    
    selectKitchenScreensDialogAnchor.ShowBubblePopup({
        position: 'bottom',  
        align: 'middle',
        tail	 : {
            align: 'middle'
        },
        innerHtml: popupHTML,
														   
        innerHtmlStyle:{ 
            'text-align':'left'
        },
        
        themeName: 	'all-grey',
        themePath: 	'/images/jquerybubblepopup-theme',
        alwaysVisible: false        
    }, false);
    
    selectKitchenScreensDialogAnchor.FreezeBubblePopup();
    
    //initialize the iphone sliders
    var popupId = selectKitchenScreensDialogAnchor.GetBubblePopupID();
    
    $('#' + popupId).find(':checkbox').each(function() {
        var terminalName = $(this).data("terminal_name")
        var origChecked = $('#choose_kitchen_screen_checkbox_' + terminalName).attr("checked");
        $(this).attr("checked", origChecked);
    });
    
    $('#' + popupId).find(':checkbox').iphoneStyle({
        resizeContainer: false, 
        resizeHandle : false, 
        checkedLabel: 'Yes', 
        uncheckedLabel: 'No'
    });
}

function hideSelectKitchenScreensDialog() {
    if(selectKitchenScreensDialogAnchor.HasBubblePopup()) {
        selectKitchenScreensDialogAnchor.HideBubblePopup();
        selectKitchenScreensDialogAnchor.FreezeBubblePopup();
    }
}

function kitchenScreenSwitchToggle(switchEl) {
    switchEl = $(switchEl);
   
    var is_selected = switchEl.attr("checked");
    var terminalName = switchEl.data("terminal_name");
   
    $('#choose_kitchen_screen_checkbox_' + terminalName).attr("checked", is_selected);
}