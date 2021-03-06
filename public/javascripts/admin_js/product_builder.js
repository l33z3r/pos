$(function() {
    extraOptionsGeneralSelected();
    
    var keyboardPlaceHolderEl = $('#product_builder #keyboard')
    placeUtilKeyboard(keyboardPlaceHolderEl);
    
    $('#product_name').focus();
});

function productBuilderShowMoreOptionsShortcut() {
    toggleKeyboardEnable = true;
    toggleUtilKeyboard();
    adminShowMoreOptions();
}

function productBuilderOkClicked() {
    showSpinner();
    $('#product_builder_form').submit();
}

function productBuilderCancelClicked() {
    goTo("/admin/products");
}

function extraOptionsGeneralSelected() {
    setExtraOptionsSelectedTab("extra_options_tab_general", "general_tab_content");
}

function extraOptionsOptionsSelected() {
    setExtraOptionsSelectedTab("extra_options_tab_options", "options_tab_content");
}

function extraOptionsAppearanceSelected() {
    setExtraOptionsSelectedTab("extra_options_tab_appearance", "appearance_tab_content");
}

function extraOptionsStockSelected() {
    setExtraOptionsSelectedTab("extra_options_tab_stock", "stock_tab_content");
}

function extraOptionsIngredientsSelected() {
    setExtraOptionsSelectedTab("extra_options_tab_ingredients", "ingredients_tab_content");
}

function setExtraOptionsSelectedTab(tab_el_name, tab_content_el_name) {
    $('#product_builder .text_only_tabs .text_only_tab').each(function(){
        $(this).removeClass("selected")
        });
    $('#' + tab_el_name).addClass("selected");
    
    $('#product_builder .tab_content').each(function(){
        $(this).hide()
        });
    $('#' + tab_content_el_name).show();
}

function updateStockCalculation(index) {
    var numerator = parseFloat($('#quantity_numerator_' + index).val());
    var denominator = parseFloat($('#quantity_denominator_' + index).val());
    
    if(isNaN(numerator) || numerator <=0) {
        numerator = 1;
    }
    
    if(isNaN(denominator) || denominator <=0) {
        denominator = 1;
    }
    
    $('#stock_calculation_' + index).html(" = " + roundNumber((parseFloat(numerator)/parseFloat(denominator)), 3));
}

var bgColorPickerAnchor = null;

function productBuidlerShowBgColorPicker() {
    bgColorPickerAnchor = $('#button_bg_color_input');
    
    if(bgColorPickerAnchor.HasBubblePopup()) {
        bgColorPickerAnchor.RemoveBubblePopup();
    }
    
    bgColorPickerAnchor.CreateBubblePopup();
    
    popupHTML = "<div style='width: 500px; height: 280px;' id='bg_color_picker'></div>";
    
    bgColorPickerAnchor.ShowBubblePopup({
        position: 'bottom',  
        align: 'right',
        tail	 : {
            align: 'right'
        },
        innerHtml: popupHTML,
														   
        innerHtmlStyle:{ 
            'text-align':'left'
        },
        
        themeName: 	'all-grey',
        themePath: 	'/images/jquerybubblepopup-theme',
        alwaysVisible: false        
    }, false);
    
    bgColorPickerAnchor.FreezeBubblePopup();
    
    //init color picker for font color property
    var bgColorPicker = new ColourPicker(
        document.getElementById('bg_color_picker'),
        '/images/jquery_colour_picker/');
        
    bgColorPicker.addChangeListener(bgColorPickerChanged);
}

function bgColorPickerChanged(newColour, colourPickerObj) {
    newColorCSSVal = newColour.getCSSHexadecimalRGB();
    $('#button_bg_color_input').val(newColorCSSVal);
}

function productBuidlerHideBgColorPicker() {
    if(bgColorPickerAnchor.HasBubblePopup()) {
        bgColorPickerAnchor.HideBubblePopup();
        bgColorPickerAnchor.FreezeBubblePopup();
    }
}

var bgColor2PickerAnchor = null;

function productBuidlerShowBgColor2Picker() {
    bgColor2PickerAnchor = $('#button_bg_color_2_input');
    
    if(bgColor2PickerAnchor.HasBubblePopup()) {
        bgColor2PickerAnchor.RemoveBubblePopup();
    }
    
    bgColor2PickerAnchor.CreateBubblePopup();
    
    popupHTML = "<div style='width: 500px; height: 280px;' id='bg_color_2_picker'></div>";
    
    bgColor2PickerAnchor.ShowBubblePopup({
        position: 'bottom',  
        align: 'right',
        tail	 : {
            align: 'right'
        },
        innerHtml: popupHTML,
														   
        innerHtmlStyle:{ 
            'text-align':'left'
        },
        
        themeName: 	'all-grey',
        themePath: 	'/images/jquerybubblepopup-theme',
        alwaysVisible: false        
    }, false);
    
    bgColor2PickerAnchor.FreezeBubblePopup();
    
    //init color picker for font color property
    var bgColor2Picker = new ColourPicker(
        document.getElementById('bg_color_2_picker'),
        '/images/jquery_colour_picker/');
        
    bgColor2Picker.addChangeListener(bgColor2PickerChanged);
}

function bgColor2PickerChanged(newColour, colourPickerObj) {
    newColorCSSVal = newColour.getCSSHexadecimalRGB();
    $('#button_bg_color_2_input').val(newColorCSSVal);
}

function productBuidlerHideBgColor2Picker() {
    if(bgColor2PickerAnchor.HasBubblePopup()) {
        bgColor2PickerAnchor.HideBubblePopup();
        bgColor2PickerAnchor.FreezeBubblePopup();
    }
}

var textColorPickerAnchor = null;

function productBuidlerShowTextColorPicker() {
    textColorPickerAnchor = $('#button_text_color_input');
    
    if(textColorPickerAnchor.HasBubblePopup()) {
        textColorPickerAnchor.RemoveBubblePopup();
    }
    
    textColorPickerAnchor.CreateBubblePopup();
    
    popupHTML = "<div style='width: 500px; height: 280px;' id='font_color_picker'></div>";
    
    textColorPickerAnchor.ShowBubblePopup({
        position: 'bottom',  
        align: 'right',
        tail	 : {
            align: 'right'
        },
        innerHtml: popupHTML,
														   
        innerHtmlStyle:{ 
            'text-align':'left'
        },
        
        themeName: 	'all-grey',
        themePath: 	'/images/jquerybubblepopup-theme',
        alwaysVisible: false        
    }, false);
    
    textColorPickerAnchor.FreezeBubblePopup();
    
    //init color picker for font color property
    var textColorPicker = new ColourPicker(
        document.getElementById('font_color_picker'),
        '/images/jquery_colour_picker/');
        
    textColorPicker.addChangeListener(textColorPickerChanged);
}

function textColorPickerChanged(newColour, colourPickerObj) {
    newColorCSSVal = newColour.getCSSHexadecimalRGB();
    $('#button_text_color_input').val(newColorCSSVal);
}

function productBuidlerHideTextColorPicker() {
    if(textColorPickerAnchor.HasBubblePopup()) {
        textColorPickerAnchor.HideBubblePopup();
        textColorPickerAnchor.FreezeBubblePopup();
    }
}

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

var chooseProductImageDialogPopupEl;

function openChooseProductImageDialog() {
    niceAlert("Loading images, please wait...");
    $.ajax({url: '/admin/products/product_image_dialog'});
}

function productImageSelected(el, image_name) {
    $(".image").removeClass("selected");
    $(el).addClass("selected");
    
    //switch out the preview image
    $('.product_image_preview img').attr("src", "/images/product_images/" + image_name);
    
    $('#display_image').val(image_name);
    hideNiceAlert();
}