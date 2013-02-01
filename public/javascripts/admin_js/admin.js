$(function(){
    initAdminScreen();
});

function initAdminScreen() {
    //hide the red x 
    $('#nav_save_button').hide();
    
    //hide the shortcut dropdown
    $('#menu_screen_shortcut_dropdown_container').hide();
    
    $('#admin_nav_back_link').show();
    
    display_button_passcode_permissions = all_display_button_permissions[current_user_role_id];
    
    //make links in the table bigger
    makeBiggerAdminTableLinks();
    
    //run deleted projects hook
    runDeletedProjectsHook();
    
    //key enter event in product list
    addEnterKeyEvents();
    
    initTinyMCE();
}

function addModifierFields(link, content) {
    var new_id = clueyTimestamp();
    var regexp = new RegExp("new_modifier", "g")
    $(link).parent().before(content.replace(regexp, new_id));
}

function deleteModifier(link) {
    $(link).prev("input[type=hidden]").val(1);
    $(link).parent().parent(".modifier_fields").hide();
}

function doSetDefaultDisplay(displayId) {
    //clear all the other default radio buttons
    $('input[name=set_default_display]').each(function() {
        if($(this).attr("id") != "set_default_display_" + displayId) {
            $(this).attr("checked", false);
        } 
    });
    
    //send an update to display controller
    $.ajax({
        type: 'POST',
        url: '/admin/displays/' + displayId + '/default'
    });
}

function doSetPublicDisplay(displayId) {
    //clear all the other default radio buttons
    $('input[name=set_public_display]').each(function() {
        if($(this).attr("id") != "set_public_display_" + displayId) {
            $(this).attr("checked", false);
        } 
    });
    
    //send an update to display controller
    $.ajax({
        type: 'POST',
        url: '/admin/displays/' + displayId + '/public'
    });
}

function doSetDefaultTaxRate(taxRateId) {
    //send an update to tax rates controller
    $.ajax({
        type: 'POST',
        url: '/admin/tax_rates/' + taxRateId + '/default'
    });
}

function doSetDefaultPaymentMethod(paymentMethodId) {
    //send an update to payment methods controller
    $.ajax({
        type: 'POST',
        url: '/admin/payment_methods/' + paymentMethodId + '/default'
    });
}

function doSetDefaultLoyaltyLevel(loyaltyLevelId) {
    //send an update to loyalty levels controller
    $.ajax({
        type: 'POST',
        url: '/admin/loyalty_levels/' + loyaltyLevelId + '/default'
    });
}

function doSetDefaultDiscount(discountId) {
    //send an update to discounts controller
    $.ajax({
        type: 'POST',
        url: '/admin/discounts/' + discountId + '/default'
    });
}

function doSetDefaultOrderItemAdditionGrid(gridId) {
    //clear all the other default radio buttons
    $('input[name=set_default_order_item_addition_grid]').each(function() {
        if($(this).attr("id") != "set_default_order_item_addition_grid_" + gridId) {
            $(this).attr("checked", false);
        } 
    });
    
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

function loadCurrentImages(letter){
    $("#container_images").hide()
    $("#container_spinner").show()
    jQuery.get('/admin/products/product_image_dialog?letter=' + letter, function(data) {})
}

function newButtonGroup() {
    name = prompt("Button Group Name:");
    
    if(name != null) {
        showLoadingDiv();
    
        $.ajax({
            type: 'POST',
            url: 'button_group_create',
            success : function() {
                window.location.reload();
            },
            data: {
                name : name
            }
        });
    }
}

function deleteButtonGroup(dbg_id) {
    showLoadingDiv();
    
    $.ajax({
        type: 'POST',
        url: 'button_group_delete',
        success : function() {
            window.location.reload();
        },
        data: {
            dbg_id : dbg_id
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
function toggleRolePinRequired(role_id, checked) {
    $.ajax({
        type: 'POST',
        url: '/admin/roles/pin_required_for_role',
        data: {
            id : role_id,
            checked : checked
        }
    });
}

function toggleRoleLoginAllowed(role_id, checked) {
    $.ajax({
        type: 'POST',
        url: '/admin/roles/login_allowed_for_role',
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
    //make sure the keyboard is hidden
    toggleKeyboardEnable = true;
    hideUtilKeyboard();
    
    $('#admin_content_screen').hide();
    $('#shortcut_more_options').show();
}

function checkForUniqueTerminalName() {
    var enteredVal = $('#terminal_name_field').val();
    
    $.ajax({
        url: '/admin/terminals/check_for_unique',
        data: {
            entered_terminal_id : enteredVal
        }
    });
}

function makeBiggerAdminTableLinks() {
    console.log("NYI for firefox: makeBiggerAdminTableLinks()");
    return;
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    $('table.admin_table td a').each(function() {
        var aEl = $(this);
        var tdEl = aEl.parent();
        
        tdEl.css("cursor", "pointer");
        
        if(aEl.data("method")) {
            tdEl.click(function(){
                var doIt = confirm("Are You Sure?");
                
                if(doIt) {
                    $.post($(this).find(":first-child").attr("href"), "_method=delete", function(data) {});
                    doReload(false);
                    event.stopPropagation();
                    return false;
                } else {
                    event.stopPropagation();
                    return false;
                }
            });
        } else {
            tdEl.click(function(){
                var theHref= $(this).find(":first-child").attr("href");
                
                if(theHref != "" && theHref != "#") {
                    goTo(theHref);
                }
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
    changeStyleButton(character);
    $("#current_letter").val(character);
    runSearch();
}

function loadProductsForNextLetter(){
    if($("#current_letter").val() === barLetters[barLetters.length-1]){
        changeStyleButton("hash");
        loadProductsForNumber();
    }
    else{
        var nextLetter = nextOnAlphabet($("#current_letter").val());
        changeStyleButton(nextLetter);
        $("#current_letter").val(nextLetter);
        runSearch();
    }
}

function loadProductsForPreviousLetter(){
    if($("#current_letter").val()!=="all"){
        if($("#current_letter").val() !== barLetters[0]){
            var previousLetter = previousOnAlphabet($("#current_letter").val());
            changeStyleButton(previousLetter);
            $("#current_letter").val(previousLetter);
        }
        else{
            changeStyleButton("all");
            $("#current_letter").val("all");
        }
        runSearch();
    }
}

function loadProductsForNumber(){
    changeStyleButton("hash");
    $("#current_letter").val("hash");
    runSearch();
}

function loadProductsForAllLetters(){
    changeStyleButton("all");
    $("#current_letter").val("all");
    runSearch();
}

//array of letters to show in the bar
var barLetters = new Array();

function nextOnAlphabet(letter){
    var i = barLetters.indexOf(letter);
    return barLetters[i+1]
}

function previousOnAlphabet(letter){
    if(letter!="hash"){
        var i = barLetters.indexOf(letter);
        return barLetters[i-1];
    }
    else{
        return barLetters[barLetters.length-1];
    }
}

function changeStyleButton(newLetter){
    currentLetter = ($('#current_letter').val()=="") ? "all" : $('#current_letter').val() ;
    $('#button_'+currentLetter).removeClass('letter_link_clicked');
    newLetter = (newLetter=="") ? "all" : newLetter;
    $('#button_'+newLetter).addClass('letter_link_clicked');
}

function runSearch() {
    $("#products_ajax").html("Loading...");
    
    var numbers = ($("#current_letter").val()==="hash") ? ['0','1','2','3','4','5','6','7','8','9'] : "";
    var letter = ($("#current_letter").val()!=="all" && $("#current_letter").val()!=="hash") ? $('#current_letter').val() : "";
    var is_special = ($("#is_special_equals").is(":checked")) ? "true" : "";
    var is_deleted = ($("#is_deleted_equals").is(":checked")) ? "true" : "false";
    
    if($("#all_fields").val().length>0){
        $.ajax({
            type: 'GET',
            url: '/admin/products/search',
            data: {
                "search1[code_num_or_upc_equals]" : $("#code_num_equals").val(),
                "search1[name_contains]" : $("#name_contains").val(),
                "search1[is_special_equals]" : is_special,
                "search1[category_id_equals]" : $("#category_id_equals").val(),
                "search1[name_starts_with]" : letter,
                "search1[name_starts_with_any]" : numbers,
                "search1[is_deleted_equals]" : is_deleted,
                "search2" : $("#all_fields").val(),
                "search3[description_or_name_or_brand_or_kitchen_note_or_button_text_line_1_or_button_text_line_2_or_button_text_line_3_contains]" : $("#all_fields").val(),
                "search3[is_deleted_equals]" : is_deleted
            }
        });
    }
    else{
        $.ajax({
            type: 'GET',
            url: '/admin/products/search',
            data: {
                "search1[code_num_or_upc_equals]" : $("#code_num_equals").val(),
                "search1[name_contains]" : $("#name_contains").val(),
                "search1[is_special_equals]" : is_special,
                "search1[category_id_equals]" : $("#category_id_equals").val(),
                "search1[name_starts_with]" : letter,
                "search1[name_starts_with_any]" : numbers,
                "search1[is_deleted_equals]" : is_deleted
            }
        });
    }
}

function runDeletedProjectsHook() {
    $('#is_deleted_equals').change(function(){
        if($("#is_deleted_equals").is(":checked"))
            disableSearchFields();
        else
            enableSearchFields();
    });
    $('input.filterCheck').click(function(){
        runSearch();
    });
}

function markProductAsDeleted(product_id) {
    var answer = confirm("Are you sure?");
    
    if (answer) {
        $.ajax({
            type: 'POST',
            url: '/admin/products/'+ product_id +'/mark_as_deleted',
            success: function() {
                $("#product_id_"+product_id).slideUp(1000);
            },
            error: function() {
                niceAlert("Error deleting product");
            },
            data: {
                id : product_id
            }
        });
    }
}

function disableSearchFields(){
    $("#code_num_equals").attr('disabled', 'disabled');
    $("#name_contains").attr('disabled', 'disabled');
    $("#category_id_equals").attr('disabled', 'disabled');
    $("#all_fields").attr('disabled', 'disabled');
    $("#is_special_equals").attr('disabled', 'disabled');     
}

function enableSearchFields(){
    $("#code_num_equals").removeAttr('disabled');
    $("#name_contains").removeAttr('disabled');
    $("#category_id_equals").removeAttr('disabled');
    $("#all_fields").removeAttr('disabled');
    $("#is_special_equals").removeAttr('disabled');
}

function settingStateFields(){
    if($("#is_deleted_equals").is(":checked")){
        disableSearchFields();
    }
    changeStyleButton($("#current_letter").val());
}

function addEnterKeyEvents(){
    $('#all_fields').keyup(function(e) {
        if(e.keyCode == 13) {
            runSearch();
        }
    });
    $('#code_num_equals').keyup(function(e) {
        if(e.keyCode == 13) {
            runSearch();
        }
    });
    $('#name_contains').keyup(function(e) {
        if(e.keyCode == 13) {
            runSearch();
        }
    });
}

function initTinyMCE() {
    tinyMCE.init({
        mode : "specific_textareas",
        editor_selector : "mceEditor",
        theme : "advanced",
        theme_advanced_resizing_max_width : 120,
        theme_advanced_buttons1 : "|,fontsizeselect,|,bold,italic,underline,strikethrough,|",
        theme_advanced_buttons2 : "|,justifyleft,justifycenter,justifyright,justifyfull,|,bullist,numlist,|,outdent,indent,blockquote,|sub,sup,|,charmap,|",
        theme_advanced_buttons3 : "",
        plugins : "maxlength",
        maxlength: 220
    });
}

function initLocalReceiptPrinterListDropdown(selectedPriner) {
    var isSelectedText;
    
    //list off local printers 
    for(i=0; i<localPrinters.length; i++) {
        var nextLocalPrinterName = localPrinters[i].toLowerCase();
        
        isSelectedText = nextLocalPrinterName == selectedPriner ? "selected" : "";
        
        $("#local_printer_select").append("<option value='" + nextLocalPrinterName + "' " + isSelectedText + ">" + nextLocalPrinterName + "</option>");
    }
}

function initUnaddedLocalPrinterListDropdown() {
    //list off local printers that are not already in the system
    for(i=0; i<newLocalPrinters.length; i++) {
        var nextLocalPrinterName = newLocalPrinters[i].toLowerCase();
        
        $(".local_unadded_printers_select").append("<option value='" + nextLocalPrinterName + "'>" + nextLocalPrinterName + "</option>");
    }
}

function initAllLocalPrinterListDropdown() {
    //list off all local printers
    for(i=0; i<localPrinters.length; i++) {
        var nextLocalPrinterName = newLocalPrinters[i].toLowerCase();
        
        $(".all_local_printers_select").append("<option value='" + nextLocalPrinterName + "'>" + nextLocalPrinterName + "</option>");
    }
}

function editPrinter(printerNum) {
    $("#printer_" + printerNum + "_local_printer_input").hide();
    $("#printer_" + printerNum + "_local_printer_select").show();
    $("#printer_" + printerNum + "_owner_fingerprint_input").removeAttr('disabled');
    
    $("#printer_" + printerNum + "_network_share_name_input").removeAttr('disabled');
    
    var myHostName; 
    
    try {
        myHostName = cluey_ff_ext.myHostName();
        $("#printer_" + printerNum + "_network_share_name_input").val("\\\\" + myHostName + "\\");
    } catch(ex) {
        console.log("Error getting local hostname");
    }
}

function unlockComPortEditor() {
    try {
        cluey_ff_ext.clearCashDrawerSettings();
    } catch(ex) {
        setStatusMessage("Error clearing cash drawer port settings");
    }
    
    $('#com_port_settings_editor').attr("disabled", false);
    $('#com_port_editor').attr("disabled", false);
}

function initCashDrawerOptions(triggerViaPrinter) {
    setVisibleCashDrawerOptions(triggerViaPrinter);
}

function setVisibleCashDrawerOptions(triggerViaPrinter) {
    if(triggerViaPrinter) {
        $('.via_printer_cash_drawer_option').show();
        $('.direct_cash_drawer_option').hide();
    } else {
        $('.via_printer_cash_drawer_option').hide();
        $('.direct_cash_drawer_option').show();
    }
}

function triggerCashDrawerPrinterOptionChanged() {
    triggerViaPrinter = $('#trigger_via_printer option:selected').val() == "true";
    setVisibleCashDrawerOptions(triggerViaPrinter);
}

function unlockMappedPrinterPortEditor() {
    try {
        cluey_ff_ext.clearCashDrawerViaPrinterSettings();
    } catch(ex) {
        setStatusMessage("Error clearing cash drawer printer settings");
    }
    
    $('#mapped_printer_port_settings_editor').attr("disabled", false);
    $('#cash_drawer_local_printer_share_name_editor').attr("disabled", false);
}