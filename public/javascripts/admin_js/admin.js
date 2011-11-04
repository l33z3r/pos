function initAdminScreen() {
    //hide the red x 
    $('#nav_save_button').hide();
    
    //hide the shortcut dropdown
    $('#menu_screen_shortcut_dropdown_container').hide();
    
    $('#admin_nav_back_link').show();
    
    //allow the page to scroll in the admin pages
    $('body').css("overflow", "scroll");
    
    display_button_passcode_permissions = all_display_button_permissions[current_user_role_id];
    
    //make links in the table bigger
    makeBiggerAdminTableLinks();
}

$(function(){
    initAdminScreen();
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

function doSetDefaultTaxRate(taxRateId) {
    //send an update to display controller
    $.ajax({
        type: 'POST',
        url: '/admin/tax_rates/' + taxRateId + '/default'
    });
}

function doSetDefaultPaymentMethod(paymentMethodId) {
    //send an update to display controller
    $.ajax({
        type: 'POST',
        url: '/admin/payment_methods/' + paymentMethodId + '/default'
    });
}

function doSetDefaultDiscount(discountId) {
    //send an update to display controller
    $.ajax({
        type: 'POST',
        url: '/admin/discounts/' + discountId + '/default'
    });
}

function doSetDefaultOrderItemAdditionGrid(gridId) {
    //send an update to display controller
    $.ajax({
        type: 'POST',
        url: '/admin/order_item_addition_grids/' + gridId + '/default'
    });
}

function updateProductPrice(product_id, currentPrice) {
    newPrice = prompt("Enter a new price:", currentPrice);
    
    if(newPrice) {
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
    
    //this hack is to allow the empty category to toggle
    if(typeof bg_id  == "undefined") {
        bg_id = '';
    }
    
    targetEl = $('#display_button_list_container_' + bg_id);
    
    $('.display_button_list_container').each(function(index, el) {
        el = $(el);
        
        if(el.attr('id') != targetEl.attr('id') && el.is(":visible")){
            el.slideToggle();
        }
    });
    
    targetEl.slideToggle()
}

function cashTotalOptionSelect(role, total_type, report_section, checked) {
    $.ajax({
        type: 'POST',
        url: '/admin/toggle_cash_total_option',
        data: {
            total_type : total_type,
            role : role, 
            report_section : report_section,
            checked : checked
        }
    });
}

//admin for display buttons

function displayButtonRoleAdminScreenSelect(dbr_id, checked) {
    $.ajax({
        type: 'POST',
        url: '/admin/display_buttons/update_admin_screen_button_role',
        data: {
            id : dbr_id,
            checked : checked
        }
    });
}

function displayButtonRoleAdminScreenSelectPasscode(dbr_id, checked) {
    $.ajax({
        type: 'POST',
        url: '/admin/display_buttons/update_admin_screen_button_role',
        data: {
            id : dbr_id,
            passcode_required : checked
        }
    });
}

function displayButtonRoleSalesScreenSelect(dbr_id, checked) {
    $.ajax({
        type: 'POST',
        url: '/admin/display_buttons/update_sales_screen_button_role',
        data: {
            id : dbr_id,
            checked : checked
        }
    });
}

//admin for roles

function togglePinRequired(role_id, checked) {
    $.ajax({
        type: 'POST',
        url: '/admin/roles/pin_required_for_role',
        data: {
            id : role_id,
            checked : checked
        }
    });
}

var adminOkClickedHandler = null;
var adminCancelClickedHandler = null;

function adminOkClicked() {
    if(adminOkClickedHandler) {
        adminOkClickedHandler;
    } else {
        goTo('/home#screen=more_options');
    }
}

function adminCancelClicked() {
    if(adminCancelClickedHandler) {
        adminCancelClickedHandler;
    } else {
        goTo('/home#screen=more_options');
    }
}

function linkTerminalDisplay(terminal_id, display_id) {
    //alert("link " + terminal_id + " to " + display_id);
    
    $.ajax({
        type: 'POST',
        url: '/admin/terminals/link_display',
        data: {
            terminal_id : terminal_id,
            display_id : display_id
        }
    });
}

//following is for the more options screen shortcut

function adminShowMoreOptions() {
    //try to load the div first
    $('#admin_content_screen').hide();
    $('#shortcut_more_options').show();
}

function checkForUniqueTerminalName() {
    var enteredVal = $('#terminal_name_field').val();
    
    console.log("Checking val: " + enteredVal);
    
    $.ajax({
        url: '/admin/terminals/check_for_unique',
        data: {
            entered_terminal_id : enteredVal
        }
    });
}

function makeBiggerAdminTableLinks() {
    $('table.admin_table td a').each(function() {
        var aEl = $(this);
        var tdEl = aEl.parent();
        
        tdEl.css("cursor", "pointer");
        
        if(aEl.data("method")) {
            tdEl.click(function(){
                var doIt = confirm("Are You Sure?");
                
                if(doIt) {
                    $.post($(this).find(":first-child").attr("href"), "_method=delete", function(data) {});
                    location.reload();
                } else {
                    event.stopPropagation();
                    return false;
                }
            });
        } else {
            tdEl.click(function(){
                location = $(this).find(":first-child").attr("href");
            });
        }
    });
    
    //copy the clicks and double clicks up to the td level
    $('table.admin_table td div').each(function() {
        var divEl = $(this);
        var tdEl = divEl.parent();
        
        //copy up the click event
        var clickH = divEl.attr("onclick");
        
        if(clickH) {
            tdEl.css("cursor", "pointer");
            tdEl.click(clickH);
        }
        
        //kill the event on the child
        divEl.attr("onclick", "");
        divEl.click(function(){});
    
        //copy up the dblclick event
        var dblClickH = divEl.attr("ondblclick");

        if(dblClickH) {
            tdEl.css("cursor", "pointer");
            tdEl.dblclick(dblClickH);
        }
        
        //kill the event on the child
        divEl.attr("ondblclick", "");
        divEl.dblclick(function(){});
    
    });
}


function loadProductsForLetter(character){
    document.getElementById("current_letter").value = character;
    $.ajax({
        type: 'GET',
        url: '/admin/products/load_by_letter',
        data: {
            letter : character
        }
    });
}

function loadProductsForNextLetter(){
    if(document.getElementById("current_letter").value == barLetters[barLetters.length-1])
        loadProductsForNumber();
    else{
        var nextLetter = nextOnAlphabet(document.getElementById("current_letter").value);
        document.getElementById("current_letter").value = nextLetter;
        $.ajax({
            type: 'GET',
            url: '/admin/products/load_by_letter',
            data: {
                letter : nextLetter
            }
        });
    }
}

function loadProductsForPreviousLetter(){
    if(document.getElementById("current_letter").value !=  barLetters[0]){
        var previousLetter = previousOnAlphabet(document.getElementById("current_letter").value);
        document.getElementById("current_letter").value = previousLetter;
        $.ajax({
            type: 'GET',
            url: '/admin/products/load_by_letter',
            data: {
                letter : previousLetter
            }
        });
    }
}

function loadProductsForNumber(){
    document.getElementById("current_letter").value = "#";
    $.ajax({
        type: 'GET',
        url: '/admin/products/load_by_letter'
    });
}

//array of letters to show in the bar
var barLetters = new Array();

function nextOnAlphabet(letter){
   var i = barLetters.indexOf(letter);
   return barLetters[i+1]
}

function previousOnAlphabet(letter){
   if(letter!="#"){
       var i = barLetters.indexOf(letter);
       return barLetters[i-1];
   }
   else{
       return barLetters[barLetters.length-1];
   }
}
