var room_id = null;
var maxGridSize = 70;
var minGridSize = 30;
var currentGridSize;

//init drag drop
function initDragDrop() {
    //init drag drop
    $('.select_room_object').draggable({
        revert:true
    });
    
    $('.grid_square').droppable({
        drop: function( event, ui ) {
            //alert("Product " + ui.draggable.attr("id") + " dropped on menu item " + $(this).attr("id"));
            room_object_permid_string = ui.draggable.attr("id");
            grid_square_id_string = $(this).attr("id");
            doAjaxRoomObjectPlacement(room_object_permid_string, grid_square_id_string);
        }
    });
}

function resolutionSliderChanged(event, ui) {
    console.log("Slider changed to " + ui.value);
    setGridSize(ui.value);
    setGridGraphicDimensions()
}

function setGridSize(size) {
    currentGridSize = size;
    
    //calculate pixels from size
    newSize = (maxGridSize - size) + minGridSize;
    
    //change the grid css
    $('.grid_square').width(newSize);
    $('.grid_square').height(newSize);
    
    //send ajax menu update
    $.ajax({
        type: 'POST',
        url: 'update_grid_resolution.js',
        data: {
            id : room_id,
            grid_resolution : size
        }
    });
}

function doAjaxRoomObjectPlacement(room_object_permid_string, grid_square_id_string) {
    //alert("Object " + room_object_permid_string + " placed on square " + grid_square_id_string);
    
    $('#' + grid_square_id_string).html("<div class='loading_message'>Loading...</div>");
    
    //send ajax object placement update
    $.ajax({
        type: 'POST',
        url: 'place_object.js',
        data: {
            id : room_id,
            room_object_permid : room_object_permid_string,
            grid_square_id : grid_square_id_string
        }
    });
}

function doXDimensionChange(newX) {
    $.ajax({
        type: 'POST',
        url: 'dimension_change.js',
        success: dimensionChangeComplete,
        data: {
            id : room_id,
            new_x : newX
        }
    });
}

function doYDimensionChange(newY) {
    $.ajax({
        type: 'POST',
        url: 'dimension_change.js',
        success: dimensionChangeComplete,
        data: {
            id : room_id,
            new_y : newY
        }
    });
}

function dimensionChangeComplete() {
    setGridSize(currentGridSize);
    initDragDrop();
    setGridGraphicDimensions()
}

function showRenameRoom() {
    $('#room_name').hide();
    $('#room_name_input').show();
    $('#rename_link').hide();
    
    $('#room_name_input').select();

    $('#room_name_input').keypress(function(e){
        if(e.which == 13){
            $('#room_name').html($('#room_name_input').val());
            $('#room_name_input').hide();
            $('#room_name').show();
            $('#rename_link').show();
            
            $.ajax({
                type: 'POST',
                url: 'rename_room',
                data: {
                    id : room_id,
                    name : $('#room_name_input').val()
                }
            });
        }
    });
}


function setGridGraphicDimensions() {
    $('.grid_graphic').each(function() {
        x_size = $(this).data("x_size");
        y_size = $(this).data("y_size");
        
        //calculate pixels from size
        scale = (maxGridSize - currentGridSize) + minGridSize;
    
        width = x_size * scale;
        height = y_size * scale;
        
        //alert("Setting: " + width + " " + height);
        
        $(this).height(height);
        $(this).width(width);
        
        $(this).children("img").height(height);
        $(this).children("img").width(width);
    });
}