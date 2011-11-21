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