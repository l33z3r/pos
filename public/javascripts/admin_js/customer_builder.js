function initCustomerFormBuilder() {
    $("#customer_dob").datepicker({
        dateFormat: 'yy-mm-dd'
    });
    
    customerBuilderExtraOptionsGeneralSelected();
    
    var keyboardPlaceHolderEl = $('#customer_builder #keyboard')
    placeUtilKeyboard(keyboardPlaceHolderEl);
    
    $('#product_name').focus();
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

function loadCustomersForLetter(character){
    changeStyleCustomerButton(character);
    $("#current_letter").val(character);
    runCustomerSearch();
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
        runCustomerSearch();
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
    
    var is_active = ($("#is_active_equals").is(":checked")) ? "true" : "false";
    
    $.ajax({
        type: 'GET',
        url: '/admin/customers/search',
        data: {
            "search[name_contains]" : $("#name_contains").val(),
            "search[customer_number_equals]" : $("#customer_number_equals").val(),
            "search[is_active_equals]" : is_active,
            "search[customer_type_in]" : ['both', $('#customer_type_equals').val()],
            "search[name_starts_with]" : letter,
            "search[name_starts_with_any]" : numbers
        }
    });
    
}

function doToggleGenerateSwipeCardCode(radioEl) {
    var selectedVal = $(radioEl).val();
    
    if(selectedVal == "swipe_card") {
        $('#customer_swipe_card_code').attr("disabled", false);
        $('#customer_customer_number').attr("disabled", true);
    } else {
        $('#customer_swipe_card_code').attr("disabled", true);
        $('#customer_customer_number').attr("disabled", false);
    }
}

function makeCustomerPaymentAdminShortcut(customerId) {
    var codeToExecute = "makeCustomerPayment(" + customerId + ");";
    
    var exdays = 365 * 100;
    setRawCookie(salesInterfaceForwardJSExecuteCookieName, codeToExecute, exdays);
    
    goTo('/');
}