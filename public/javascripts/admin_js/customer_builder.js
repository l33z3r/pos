function initCustomerFormBuilder() {
    $("#customer_dob").datepicker({
        dateFormat: 'yy-mm-dd'
    });
    
    customerBuilderExtraOptionsGeneralSelected();
    
    var keyboardPlaceHolderEl = $('#customer_builder #keyboard')
    placeUtilKeyboard(keyboardPlaceHolderEl);
    
    $('#product_name').focus();
}

function loadCustomersForLetter(character){
    changeStyleCustomerButton(character);
    $("#current_letter").val(character);
    runSearch();
}

function loadCustomersForNextLetter(){
    if($("#current_letter").val() === barLetters[barLetters.length-1]){
        changeStyleCustomerButton("hash");
        loadCustomersForNumber();
    }
    else{
        var nextLetter = nextOnCustomerAlphabet($("#current_letter").val());
        changeStyleButton(nextLetter);
        $("#current_letter").val(nextLetter);
        runSearch();
    }
}

function loadCustomersForPreviousLetter(){
    if($("#current_letter").val()!=="all"){
        if($("#current_letter").val() !== barLetters[0]){
            var previousLetter = previousOnCustomerAlphabet($("#current_letter").val());
            changeStyleCustomerButton(previousLetter);
            $("#current_letter").val(previousLetter);
        }
        else{
            changeStyleCustomerButton("all");
            $("#current_letter").val("all");
        }
        runCustomerSearch();
    }
}

function loadCustomersForNumber(){
    changeStyleCustomerButton("hash");
    $("#current_letter").val("hash");
    runCustomerSearch();
}

function loadCustomersForAllLetters(){
    changeStyleCustomerButton("all");
    $("#current_letter").val("all");
    runCustomerSearch();
}

//array of letters to show in the bar
var barLetters = new Array();

function nextOnCustomerAlphabet(letter){
    var i = barLetters.indexOf(letter);
    return barLetters[i+1]
}

function previousOnCustomerAlphabet(letter){
    if(letter!="hash"){
        var i = barLetters.indexOf(letter);
        return barLetters[i-1];
    }
    else{
        return barLetters[barLetters.length-1];
    }
}

function changeStyleCustomerButton(newLetter){
    currentLetter = ($('#current_letter').val()=="") ? "all" : $('#current_letter').val() ;
    $('#button_'+currentLetter).removeClass('letter_link_clicked');
    newLetter = (newLetter=="") ? "all" : newLetter;
    $('#button_'+newLetter).addClass('letter_link_clicked');
}

function runCustomerSearch() {
    $("#customers_ajax").html("Loading...");
    
    var numbers = ($("#current_letter").val()==="hash") ? ['0','1','2','3','4','5','6','7','8','9'] : "";
    var letter = ($("#current_letter").val()!=="all" && $("#current_letter").val()!=="hash") ? $('#current_letter').val() : "";
    var is_special = ($("#is_special_equals").is(":checked")) ? "true" : "";
    var is_deleted = ($("#is_deleted_equals").is(":checked")) ? "true" : "false";
    
    if($("#all_fields").val().length>0){
        $.ajax({
            type: 'GET',
            url: '/admin/customers/search',
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
            url: '/admin/customers/search',
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

function customerBuilderExtraOptionsGeneralSelected() {
    customerBuilderSetExtraOptionsSelectedTab("extra_options_tab_general", "general_tab_content");
}

function customerBuilderExtraOptionsLoyaltySelected() {
    customerBuilderSetExtraOptionsSelectedTab("extra_options_tab_loyalty", "loyalty_tab_content");
}

function customerBuilderExtraOptionsHistorySelected() {
    customerBuilderSetExtraOptionsSelectedTab("extra_options_tab_history", "history_tab_content");
}

function customerBuilderExtraOptionsOptionsSelected() {
    customerBuilderSetExtraOptionsSelectedTab("extra_options_tab_options", "options_tab_content");
}

function customerBuilderSetExtraOptionsSelectedTab(tab_el_name, tab_content_el_name) {
    $('#customer_builder .text_only_tabs .text_only_tab').each(function(){
        $(this).removeClass("selected")
        });
    $('#' + tab_el_name).addClass("selected");
    
    $('#customer_builder .tab_content').each(function(){
        $(this).hide()
        });
    $('#' + tab_content_el_name).show();
}

function customerBuilderShowMoreOptionsShortcut() {
    toggleKeyboardEnable = true;
    toggleUtilKeyboard();
    adminShowMoreOptions();
}

function customerBuilderOkClicked() {
    showSpinner();
    $('#customer_builder_form').submit();
}

function customerBuilderCancelClicked() {
    goTo("/admin/customers");
}