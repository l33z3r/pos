var grid_x;
var grid_y;
var grid_id;

var current_grid_x = null;
var current_grid_y = null;

$(function() {
    setGridScrollerWidth(grid_x);
    cellSelected(1, 1);

    var keyboardPlaceHolderEl = $('#modifier_grid_builder #keyboard')
    
    placeUtilKeyboard(keyboardPlaceHolderEl);
});

function cellSelected(x, y) {
    updateSelectedGridItem();
    
    current_grid_x = x;
    current_grid_y = y;
    
    $('div[id^="cell_"]').removeClass("selected");
    $('#cell_' + x + "_" + y).addClass("selected");
    
    var gridEL = $('#grid_' + x + '_' + y + '_data');
    
    if(gridEL.length == 0) {
        clearCellInputs();
    } else {
        initCellInputs(gridEL);
    }
    
    $('#description_input').focus();
}

function initCellInputs(gridEL) {
    var description = gridEL.data("description");
    var addCharge = parseInt(gridEL.data("add_charge"));
    var minusCharge = parseInt(gridEL.data("minus_charge"));
    var available = gridEL.data("available");
    var bgColor = gridEL.data("bg_color");
    var bgColor2 = gridEL.data("bg_color_2");
    var textColor = gridEL.data("text_color");
    var textSize = gridEL.data("text_size");
    var hideOnReceipt = gridEL.data("hide_on_receipt");
    var isAddable = gridEL.data("is_addable");
    var productId = gridEL.data("product_id");
    var followOnGridId = gridEL.data("follow_on_grid_id");
    
    $('#description_input').val(description);
    
    $('#add_charge_input').val(addCharge);
    $('#minus_charge_input').val(minusCharge);
    
    resetAvailableInput();
   
    $('#available_input').attr('checked', available);
    
    $('#available_input').iphoneStyle({
        resizeContainer: false, 
        resizeHandle : false, 
        checkedLabel: 'Yes', 
        uncheckedLabel: 'No'
    });
    
    $('#bg_color_input').val(bgColor);
    $('#bg_color_2_input').val(bgColor2);
    $('#text_color_input').val(textColor);
    $('#text_size_input').val(textSize);
    
    resetHideOnReceiptInput();
    
    $('#hide_on_receipt_input').attr('checked', hideOnReceipt);
    
    $('#hide_on_receipt_input').iphoneStyle({
        resizeContainer: false, 
        resizeHandle : false, 
        checkedLabel: 'Yes', 
        uncheckedLabel: 'No'
    });
    
    resetIsAddableInput();
    
    $('#is_addable_input').attr('checked', isAddable);
    
    $('#is_addable_input').iphoneStyle({
        resizeContainer: false, 
        resizeHandle : false, 
        checkedLabel: 'Yes', 
        uncheckedLabel: 'No'
    });
    
    $('#product_id_input').val(productId);
    $('#follow_grid_id_input').val(followOnGridId);
}

function clearCellInputs() {
    $('#description_input').val("");
    
    $('#add_charge_input').val(0);
    $('#minus_charge_input').val(0);
    
    resetAvailableInput();
    
    $('#available_input').attr('checked', true);
    
    $('#available_input').iphoneStyle({
        resizeContainer: false, 
        resizeHandle : false, 
        checkedLabel: 'Yes', 
        uncheckedLabel: 'No'
    });
    
    $('#bg_color_input').val("");
    $('#bg_color_2_input').val("");
    $('#text_color_input').val("");
    $('#text_size_input').val(20);
    
    resetHideOnReceiptInput();
    
    $('#hide_on_receipt_input').attr('checked', false);
    
    $('#hide_on_receipt_input').iphoneStyle({
        resizeContainer: false, 
        resizeHandle : false, 
        checkedLabel: 'Yes', 
        uncheckedLabel: 'No'
    });
    
    resetIsAddableInput();
    
    $('#is_addable_input').attr('checked', true);
    
    $('#is_addable_input').iphoneStyle({
        resizeContainer: false, 
        resizeHandle : false, 
        checkedLabel: 'Yes', 
        uncheckedLabel: 'No'
    });
    
    $('#product_id_input').val(-1);
    $('#follow_grid_id_input').val(-1);
}

function setGridScrollerWidth(grid_x) {
    var itemWidth = $('.oia:first').css("width");
    
    var newWidth = (parseInt(itemWidth) * grid_x) + 50;
    
    $('.grid_row').css("width", newWidth + "px");
}

function updateGridSize() {
    var newWidth = $('#grid_width_input').val();
    var newHeight = $('#grid_height_input').val();
    
    if(isNaN(newWidth) || isNaN(newHeight)) {
        setStatusMessage("Please enter a number for width/height");
    }
    
    $.ajax({
        type: 'POST',
        url: '/admin/order_item_addition_grids/' + grid_id + '/resize' ,
        data: {
            width : newWidth,
            height : newHeight
        }
    });
}

function updateSelectedGridItem() {
    
    if(current_grid_x == null) {
        return;
    }
    
    var description = $('#description_input').val();
    
    //only do the update if a description is entered
    if(description.length == 0) {
        return;
    }
    
    var addCharge = $('#add_charge_input').val();
    
    var minusCharge = $('#minus_charge_input').val();
    
    if(isNaN(addCharge) || isNaN(minusCharge)) {
        setStatusMessage("Please enter numbers for both add charge and minus charge!");
        return;
    }
    
    var available = $('#available_input').attr("checked");
    
    var bgColor = $('#bg_color_input').val();
    var bgColor2 = $('#bg_color_2_input').val();
    var textColor = $('#text_color_input').val();
    var textSize = $('#text_size_input').val();
    
    var hideOnReceipt = $('#hide_on_receipt_input').attr("checked");
    var isAddable = $('#is_addable_input').attr("checked");
    
    var oiaData = {
        x : current_grid_x,
        y : current_grid_y,
        description : description,
        addCharge : addCharge,
        minusCharge : minusCharge, 
        available : available,
        bgColor : bgColor,
        bgColor2 : bgColor2,
        textColor : textColor,
        textSize : textSize,
        hideOnReceipt : hideOnReceipt,
        isAddable : isAddable
    };
        
    var productId = $('#product_id_input').val();
    var followOnGridId = $('#follow_grid_id_input').val();
    
    if(productId != -1) {
        oiaData.productId = productId;
    }
    
    if(followOnGridId != -1) {
        oiaData.followOnGridId = followOnGridId;
    }
    
    $.ajax({
        type: 'POST',
        url: '/admin/order_item_addition_grids/' + grid_id + '/update_item' ,
        data: oiaData
    });
}

var bgColorPickerAnchor = null;

function showBGColorPicker() {
    bgColorPickerAnchor = $('#bg_color_input');
    
    if(bgColorPickerAnchor.HasBubblePopup()) {
        bgColorPickerAnchor.RemoveBubblePopup();
    }
    
    bgColorPickerAnchor.CreateBubblePopup();
    
    popupHTML = "<div style='width: 500px; height: 280px; padding: 10px;' id='bg_color_picker'></div>";
    
    bgColorPickerAnchor.ShowBubblePopup({
        position: 'top',  
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
    $('#bg_color_input').val(newColorCSSVal);
    
//doCloseBGColorPickerPopup();
}

function doCloseBGColorPickerPopup() {
    if(bgColorPickerAnchor.HasBubblePopup()) {
        bgColorPickerAnchor.HideBubblePopup();
        bgColorPickerAnchor.FreezeBubblePopup();
    }
}

var bgColor2PickerAnchor = null;

function showBGColor2Picker() {
    bgColor2PickerAnchor = $('#bg_color_2_input');
    
    if(bgColor2PickerAnchor.HasBubblePopup()) {
        bgColor2PickerAnchor.RemoveBubblePopup();
    }
    
    bgColor2PickerAnchor.CreateBubblePopup();
    
    popupHTML = "<div style='width: 500px; height: 280px; padding: 10px;' id='bg_color_2_picker'></div>";
    
    bgColor2PickerAnchor.ShowBubblePopup({
        position: 'top',  
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
    $('#bg_color_2_input').val(newColorCSSVal);
    
//doCloseBGColorPickerPopup();
}

function doCloseBGColor2PickerPopup() {
    if(bgColor2PickerAnchor.HasBubblePopup()) {
        bgColor2PickerAnchor.HideBubblePopup();
        bgColor2PickerAnchor.FreezeBubblePopup();
    }
}

var fontColorPickerAnchor = null;

function showFontColorPicker() {
    fontColorPickerAnchor = $('#text_color_input');
    
    if(fontColorPickerAnchor.HasBubblePopup()) {
        fontColorPickerAnchor.RemoveBubblePopup();
    }
    
    fontColorPickerAnchor.CreateBubblePopup();
    
    popupHTML = "<div style='width: 500px; height: 280px;' id='font_color_picker'></div>";
    
    fontColorPickerAnchor.ShowBubblePopup({
        position: 'top',  
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
    
    fontColorPickerAnchor.FreezeBubblePopup();
    
    //init color picker for font color property
    var bgColorPicker = new ColourPicker(
        document.getElementById('font_color_picker'),
        '/images/jquery_colour_picker/');
        
    bgColorPicker.addChangeListener(fontColorPickerChanged);
}

function fontColorPickerChanged(newColour, colourPickerObj) {
    newColorCSSVal = newColour.getCSSHexadecimalRGB();
    $('#text_color_input').val(newColorCSSVal);
}

function doCloseFontColorPickerPopup() {
    if(fontColorPickerAnchor.HasBubblePopup()) {
        fontColorPickerAnchor.HideBubblePopup();
        fontColorPickerAnchor.FreezeBubblePopup();
    }
}

function resetAvailableInput() {
    $('div#available .input_box').html("<input id='available_input' type='checkbox' onchange='updateSelectedGridItem()'>");
}

function resetHideOnReceiptInput() {
    $('div#hide_on_receipt .input_box').html("<input id='hide_on_receipt_input' type='checkbox' onchange='updateSelectedGridItem()'>");
}

function resetIsAddableInput() {
    $('div#is_addable .input_box').html("<input id='is_addable_input' type='checkbox' onchange='updateSelectedGridItem()'>");
}