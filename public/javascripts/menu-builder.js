var currentBuilderMenuPage = 1;

$(function() {
    $('#products_tree').menuTree({
        animation: true,
        handler: 'slideToggle',
        anchor: 'a[href="#"]'
    });

    $('.select_product').draggable({
        revert: true
    });
    
    $('#builder_menu_items_container').html($('#builder_menu_items_1').html());

    doInitTouchUIDragDrop();

    setTimeout("refreshDragDrop()", 300);
});

function doBuilderMenuPageSelect(pageNum, pageId) {
    //set this pages class to make it look selected
    $('#pages .page').removeClass('selected');
    $('#menu_page_' + pageId).addClass('selected');

    //destroy the droppable objects for the old page of menu items
    for(i=0; i<item_droppable_ids.length; i++) {
        webkit_drop.remove(item_droppable_ids[i]);
    }

    item_droppable_ids = new Array();

    //copy back the new html to its container
    $('#builder_menu_items_' + currentBuilderMenuPage).html($('#builder_menu_items_container').html());
    
    newHTML = $('#builder_menu_items_' + pageNum).html();
    $('#builder_menu_items_container').html(newHTML);

    currentBuilderMenuPage = pageNum;

    setTimeout("refreshDragDrop()", 300);
}

function refreshDragDrop() {
    //wipe the previous ids
    $('.item').each(function(index) {
        $(this).attr("id", "");
    });

    $('#builder_menu_items_container .item').each(function(index) {
        //TODO: replace with $(this).data("theid") and test it
        theid = $(this).attr("data-theid");
        $(this).attr("id", theid);

        item_droppable_ids.push(theid);
        
        webkit_drop.add(theid, {
            onDrop : function(draggable, event, droppable) {
                //alert("Product " + $(draggable).attr("id") + " dropped on menu item " + $(droppable.r).attr("id"));
                
                product_id_string = $(draggable).attr("id");
                menu_item_id_string = $(droppable.r).attr("id");
                doAjaxProductGridPlacement(product_id_string, menu_item_id_string);
            }
        });
    });

    $('.item').droppable({
        drop: function( event, ui ) {
            //alert("Product " + ui.draggable.attr("id") + " dropped on menu item " + $(this).attr("id"));

            product_id_string = ui.draggable.attr("id");
            menu_item_id_string = $(this).attr("id");
            doAjaxProductGridPlacement(product_id_string, menu_item_id_string);
        }
    });
}

function doAjaxProductGridPlacement(product_id_string, menu_item_id_string) {
    product_id = product_id_string.split("_")[2];

    if(menu_item_id_string == "new_menu_item") {
        menu_item_id = -1;
    } else {
        menu_item_id = menu_item_id_string.split("_")[2];
    }

    //alert("doAjax for product: " + product_id + " menu_item: " + menu_item_id);

    $('#menu_item_' + menu_item_id).html("<div class='loading_message'>Loading...</div>");
    
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
    doIt = confirm("Are You Sure?");

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