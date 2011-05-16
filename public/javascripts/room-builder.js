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
            existing_room_object_id = ui.draggable.data("room_object_id");
            grid_square_id_string = $(this).attr("id");
            doAjaxRoomObjectPlacement(room_object_permid_string, existing_room_object_id, grid_square_id_string);
        }
    });
    
    initGridDragDrop();
    initGridTablePopupDialogs();
    initGridWallPopupDialogs();
}

function initGridDragDrop() {
    scale = (maxGridSize - currentGridSize) + minGridSize;
    
    //take into account the 1px border;
    scale++;
    
    $('.grid_graphic').draggable({
        grid: [scale, scale]
    });
}

function initGridTablePopupDialogs() {
    hideAllGridTablePopups();
    
    //create popups for elements that have none already
    $('.grid_graphic .table').each(function() {
        if(!$(this).HasBubblePopup()) {
            $(this).CreateBubblePopup({
                themeName: 	'black',
                themePath: 	'/images/jquerybubblepopup-theme'
            });
            
            $(this).FreezeBubblePopup();
        }
    });
    
    $('.grid_graphic .table').click(function(){
        table_perm_id = $(this).data("perm_id");
        table_id = $(this).data("table_id");
        room_object_id = $(this).data("room_object_id");
        
        $(this).ShowBubblePopup({
            align: 'center',
            innerHtml: "<div class='table_info_popup'>" + 
            "<div id='table_name_" + room_object_id + "' class='info'>" + table_perm_id + "</div>" +
            "<div class='rename' onclick='renameTable(" + room_object_id + ");'>(rename)</div>" + 
            "<div class='clear'>&nbsp;</div>" +
            "<div class='delete' onclick='deleteTable(" + table_id + ", " + room_object_id + ");'>Delete Table</div>" + 
            "<div class='cancel' onclick='cancelShowTableInfo(" + table_id + ");return false;'>Close</div></div>",
														   
            innerHtmlStyle:{ 
                'text-align':'left'
            },
												   
            themeName: 	'black',
            themePath: 	'/images/jquerybubblepopup-theme'

        }, false);//save_options = false; it will use new options only on click event, it does not overwrite old options.
    
        $(this).FreezeBubblePopup(); 
    });
}

function initGridWallPopupDialogs() {
    hideAllGridWallPopups();
    
    //create popups for elements that have none already
    $('.grid_graphic .wall').each(function() {
        if(!$(this).HasBubblePopup()) {
            $(this).CreateBubblePopup({
                themeName: 	'black',
                themePath: 	'/images/jquerybubblepopup-theme'
            });
            
            $(this).FreezeBubblePopup();
        }
    });
    
    $('.grid_graphic .wall').click(function(){
        wall_id = $(this).data("wall_id");
        room_object_id = $(this).data("room_object_id");
        
        $(this).ShowBubblePopup({
            align: 'center',
            innerHtml: "<div class='wall_info_popup'>" + 
            "<div class='delete' onclick='deleteWall(" + wall_id + ", " + room_object_id + ");'>Delete Wall</div>" + 
            "<div class='cancel' onclick='cancelShowWallInfo(" + wall_id + ");return false;'>Close</div></div>",
														   
            innerHtmlStyle:{ 
                'text-align':'left'
            },
												   
            themeName: 	'black',
            themePath: 	'/images/jquerybubblepopup-theme'

        }, false);//save_options = false; it will use new options only on click event, it does not overwrite old options.
    
        $(this).FreezeBubblePopup(); 
    });
}

function cancelShowTableInfo(table_id) {
    $('#table_grid_div_' + table_id).HideBubblePopup();
    $('#table_grid_div_' + table_id).FreezeBubblePopup();
}

function cancelShowWallInfo(wall_id) {
    $('#wall_grid_div_' + wall_id).HideBubblePopup();
    $('#wall_grid_div_' + wall_id).FreezeBubblePopup();
}

function hideAllGridTablePopups() {
    $('.grid_graphic .table').each(function() {
        if($(this).HasBubblePopup()) {
            $(this).HideBubblePopup();
            $(this).FreezeBubblePopup();
        }
    });
}

function hideAllGridWallPopups() {
    $('.grid_graphic .wall').each(function() {
        if($(this).HasBubblePopup()) {
            $(this).HideBubblePopup();
            $(this).FreezeBubblePopup();
        }
    });
}

function resolutionSliderChanged(event, ui) {
    console.log("Slider changed to " + ui.value);
    setGridSize(ui.value);
    setGridGraphicDimensions();
    initGridDragDrop();
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

function doAjaxRoomObjectPlacement(room_object_permid_string, existing_room_object_id, grid_square_id_string) {
    //alert("Object " + room_object_permid_string + " placed on square " + grid_square_id_string);
    
    $('#loading_message').slideDown();
    
    //send ajax object placement update
    $.ajax({
        type: 'POST',
        url: 'place_object.js',
        data: {
            id : room_id,
            room_object_permid : room_object_permid_string,
            room_object_id : existing_room_object_id,
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
        
        targetImage = $(this).children("div:first").children("img");
        
        targetImage.height(height);
        targetImage.width(width);
    });
}

function deleteTable(table_id, room_object_id) {
    var doDelete = confirm("Are you sure you want to delete this table?");
    
    if(doDelete) {
        $('#table_grid_div_' + table_id).HideBubblePopup();
        $('#room_object_' + room_object_id).remove();
    
        $.ajax({
            type: 'POST',
            url: 'remove_table',
            data: {
                room_object_id : room_object_id
            }
        });
    }
}

function renameTable(room_object_id) {
    currentName = $('#table_name_' + room_object_id).html();
    
    var newName = prompt("Enter a new table Name:", currentName);
    
    $('#table_name_' + room_object_id).html(newName);
    
    $.ajax({
        type: 'POST',
        url: 'label_table',
        data: {
            room_object_id : room_object_id,
            new_name : newName
        }
    });
}

function deleteWall(wall_id) {
    var doDelete = confirm("Are you sure you want to delete this wall?");
    
    if(doDelete) {
        $('#wall_grid_div_' + wall_id).HideBubblePopup();
        $('#room_object_' + wall_id).remove();
    
        $.ajax({
            type: 'POST',
            url: 'remove_wall',
            data: {
                wall_id : wall_id
            }
        });
    }
}