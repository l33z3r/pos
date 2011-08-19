var grid_x;
var grid_y;
var grid_id;

var current_grid_x = null;
var current_grid_y = null;

$(function() {
    setGridScrollerWidth(grid_x);
//toggleUtilKeyboard();
});

function cellSelected(x, y) {
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
    var available = gridEL.data("available") == "true";
    var bgColor = gridEL.data("bg_color");
    var textColor = gridEL.data("text_color");
    var textSize = gridEL.data("text_size");
    
    $('#description_input').val(description);
    
    $('#add_charge_input').val(addCharge);
    $('#minus_charge_input').val(minusCharge);
    
    $('div#available div.iPhoneCheckContainer').click();
    
    $('#bg_color_input').val(bgColor);
    $('#text_color_input').val(textColor);
    $('#text_size_input').val(textSize);
    
}

function clearCellInputs() {
    $('#description_input').val("");
    
    $('#add_charge_input').val(0);
    $('#minus_charge_input').val(0);
    
    $('div#available div.iPhoneCheckContainer').click();
    
    $('#bg_color_input').val("");
    $('#text_color_input').val("");
    $('#text_size_input').val("");
    
}

function setGridScrollerWidth(grid_x) {
    var itemWidth = $('.oia:first').css("width");
    
    var newWidth = (parseInt(itemWidth) * grid_x) + 50;
    
    $('.grid_row').css("width", newWidth + "px");
    
    initScrollPanes();
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
    
    var available = true;
    
    var bgColor = $('#bg_color_input').val();
    var textColor = $('#text_color_input').val();
    var textSize = $('#text_size_input').val();
    
    $.ajax({
        type: 'POST',
        url: '/admin/order_item_addition_grids/' + grid_id + '/update_item' ,
        data: {
            x : current_grid_x,
            y : current_grid_y,
            description : description,
            addCharge : addCharge,
            minusCharge : minusCharge, 
            available : available,
            bgColor : bgColor,
            textColor : textColor,
            textSize : textSize
        }
    });
}