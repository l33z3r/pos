function initAdminScreen() {
    //hide the red x 
    $('#nav_save_button').hide();
}

$(function(){
    $(initAdminScreen())
});

function addModifierFields(link, content) {
    var new_id = new Date().getTime();
    var regexp = new RegExp("new_modifier", "g")
    $(link).parent().before(content.replace(regexp, new_id));
}

function deleteModifier(link) {
    $(link).prev("input[type=hidden]").val(1);
    $(link).parent().parent(".modifier_fields").hide();
}

function doSetDefaultDisplay(displayId) {
    //send an update to display controller
    $.ajax({
        type: 'POST',
        url: '/admin/displays/' + displayId + '/default'
    });
}

function updateProductPrice(product_id, currentPrice) {
    newPrice = prompt("Enter a new price:", currentPrice);
    
    //send an update to display controller
    $.ajax({
        type: 'POST',
        url: '/admin/products/' + product_id + '/update_price',
        success : function() {
            $('#product_price_' + product_id).html(number_to_currency(newPrice, {
                precision : 2, 
                showunit : true
            }));
            $('#product_price_' + product_id).parent().effect("highlight", {}, 3000);
        },
        data: {
            id : product_id,
            price : newPrice
        }
    });
}

function newButtonGroup() {
    name = prompt("Button Group Name:");
    
    $.ajax({
        type: 'POST',
        url: 'create_button_group',
        success : function() {
            location.reload();
        },
        data: {
            name : name
        }
    });
}

function toggleButtonGroup(bg_id) {
    targetEl = $('#display_button_list_container_' + bg_id);
    
    $('.display_button_list_container').each(function(index, el) {
        el = $(el);
        
        if(el!=targetEl && el.is(":visible")){
            el.slideToggle();
        }
    });
    
    targetEl.slideToggle()
}