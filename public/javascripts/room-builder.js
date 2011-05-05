var room_id = null;

$(function() {
    $('.select_room_object').draggable();
    
    $('.grid_square').droppable({
        drop: function( event, ui ) {
            //alert("Product " + ui.draggable.attr("id") + " dropped on menu item " + $(this).attr("id"));
            room_object_permid_string = ui.draggable.attr("id");
            grid_square_id_string = $(this).attr("id");
            doAjaxRoomObjectPlacement(room_object_permid_string, grid_square_id_string);
        }
    });
});

function doAjaxRoomObjectPlacement(room_object_permid_string, grid_square_id_string) {
    alert("Object " + room_object_permid_string + " placed on square " + grid_square_id_string);
    
    $('#' + grid_square_id_string).html("<div class='loading_message'>Loading...</div>");
    
    //send ajax menu update
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
