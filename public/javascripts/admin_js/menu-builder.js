var currentBuilderMenuPage = 1;

$(function() {
    $('#products_tree').menuTree({
        animation: true,
        handler: 'slideToggle',
        anchor: 'a[href="#"]',
        callback: initBuilderScrollPane
    });

    $('.select_product').draggable({
        revert: true
    });
    
    initDisplayBuilderDragDrop();
    
    initBuilderScrollPane();
});

function initBuilderScrollPane() {
    var bindFunction = function(event, scrollPositionY, isAtTop, isAtBottom) {
        $('#menu_pages_container').css("top", scrollPositionY);
    };
            
    setTimeout(function() {
        $('#builder').bind('jsp-scroll-y',bindFunction).jScrollPane({
            showArrows: true
        });
    }, 500);
}

function doBuilderMenuPageSelect(pageNum, pageId) {
    //set this pages class to make it look selected
    $('#pages .page').removeClass('selected');
    $('#menu_page_' + pageId).addClass('selected');

    $('.builder_menu_items').hide();
    $('#builder_menu_items_' + pageNum).show();

    currentBuilderMenuPage = pageNum;
}

function initDisplayBuilderDragDrop() {
    $('#builder_menu_items_container .item').droppable({
        drop: function( event, ui ) {
            product_id_string = ui.draggable.attr("id");
            menu_item_id_string = $(this).attr("id");
            doAjaxProductGridPlacement(product_id_string, menu_item_id_string);
        },
        tolerance: 'touch'
    });
}

function doAjaxProductGridPlacement(product_id_string, menu_item_id_string) {
    var product_id = product_id_string.split("_")[2];

    var loadingMessageHTML = "<div class='loading_message'>Loading...</div>";

    if(menu_item_id_string == "new_menu_item") {
        menu_item_id = -1;
        $('.new_item').html(loadingMessageHTML);
    } else {
        menu_item_id = menu_item_id_string.split("_")[2];
        $('#menu_item_' + menu_item_id).html(loadingMessageHTML);
    }
    
    //send ajax menu update
    $.ajax({
        type: 'POST',
        url: 'place_product',
        data: {
            product_id : product_id,
            menu_item_id : menu_item_id,
            menu_page_num : currentBuilderMenuPage
        }
    });
}

function doDeleteMenuItem(itemId) {
    doIt = confirm("Are you sure you want to delete this item?");

    if(!doIt) return;
    
    $('#menu_item_' + itemId).remove();

    $.ajax({
        type: 'POST',
        url: 'delete_menu_item',
        data: {
            menu_item_id : itemId
        }
    });
}

function openEditNameTextBox(pageId) {
    $('#page_name_' + pageId).hide();
    $('#edit_page_name_' + pageId).show();

    $('#edit_page_name_' + pageId).select();

    $('#edit_page_name_' + pageId).keypress(function(e){
        if(e.which == 13){
            $('#page_name_' + pageId).html($('#edit_page_name_' + pageId).val());
            $('#edit_page_name_' + pageId).hide();
            $('#page_name_' + pageId).show();
        
            $.ajax({
                type: 'POST',
                url: 'rename_menu_page',
                data: {
                    menu_page_id : pageId,
                    new_name : $('#edit_page_name_' + pageId).val()
                }
            });
        }
    });
}

function openEditMenuItemNameTextBox(menuItemId, productId, element) {
    //we have to get a pointer to the element as the menu items are loaded 
    //dynamically with ajax and it is hard to get the proper ids
    
    itemNameEl = $(element);
    itemNameEl.hide();
    
    editBox = $(element).next('input');
    editBox.show();

    editBox.select();

    editBox.keypress(function(e){
        if(e.which == 13){
            itemNameEl.html(editBox.val());
            editBox.hide();
            itemNameEl.show();
        
            //change the name of the product in the left nav
            $('#left_nav_product_name_' + productId).html(editBox.val());
            
            $.ajax({
                type: 'POST',
                url: 'rename_menu_item',
                data: {
                    menu_item_id : menuItemId,
                    new_name : editBox.val()
                }
            });
        }
    });
}

function showRenameDisplay() {
    nameEl = $('#display_name');
    editNameEl = $('#display_name_input');
    
    nameEl.hide();
    editNameEl.show();
    $('#rename_link').hide();
    
    editNameEl.select();

    editNameEl.keypress(function(e){
        if(e.which == 13){
            nameEl.html(editNameEl.val());
            editNameEl.hide();
            nameEl.show();
            $('#rename_link').show();
            
            $.ajax({
                type: 'POST',
                url: 'rename_display',
                data: {
                    name : editNameEl.val()
                }
            });
        }
    });
}