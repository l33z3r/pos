/**
 *  Functions for Previous Cash Totals Page
 *
 ***/

$(function() {
    setDatePickers();
});

var selectedFromDate;
var selectedToDate;
var reportType;
var terminalId;
var reportBy;

function setDatePickers() {
    $('#search_previous_cash_totals_container').find('#date_from').datepicker({
        dateFormat: 'dd-mm-yy',
        defaultDate: selectedFromDate,
        onSelect: function(dateText, inst) {
            $('#search_previous_cash_totals_container').find('#date_to').datepicker("option", "minDate", dateText);
            $('#search_created_at_gte').val(dateText);
        }
    });

    $('#search_previous_cash_totals_container').find('#date_to').datepicker({
        dateFormat: 'dd-mm-yy',
        defaultDate: selectedToDate,
        onSelect: function(dateText, inst) {
            $('#order_list_container').find('#date_from').datepicker("option", "maxDate", dateText);
            $('#search_created_at_lte').val(dateText);
        }
    });
    
    //default to today
    goButtonClicked();
}

function goButtonClicked() {
    selectedFromDate = $('#date_from').val();
    selectedToDate = $('#date_to').val();
    runCashTotalSearch();
}

function yesterdayButtonClicked() {
    var constructedDate = new Date();
    constructedDate.setDate(new Date().getDate() - 1);
    var yesterdayDate = constructedDate;
    selectedFromDate = formatDate(yesterdayDate, "dd-MM-yyyy");
    selectedToDate = formatDate(yesterdayDate, "dd-MM-yyyy");
    
    $('#date_from').val(selectedFromDate);
    $('#date_to').val(selectedToDate);
    
    runCashTotalSearch();
}

function last7daysButtonClicked() {
    var fromDate = new Date();
    fromDate.setDate(new Date().getDate() - 7);
    selectedFromDate = formatDate(fromDate, "dd-MM-yyyy");
    var toDate = new Date();
    toDate.setDate(new Date().getDate());
    selectedToDate = formatDate(toDate, "dd-MM-yyyy");
    
    $('#date_from').val(selectedFromDate);
    $('#date_to').val(selectedToDate);
    
    runCashTotalSearch();        
}

function runCashTotalSearch(){
    $("#results_table").html("Loading...");
    $("#cash_total_data_table_container").html("");
    $.ajax({
        type: 'GET',
        url: '/admin/previous_cash_totals/cash_total_search',
        data: {
            "search[created_at_gte]" : selectedFromDate,
            "search[created_at_lte]" : selectedToDate,
            "search[total_type_equals]" : reportType,
            "search[terminal_id_equals]" : terminalId,
            "search[employee_id_equals]" : reportBy,
            "order" : order
        }
    });
}

function showCashTotal(cash_id){
    switchColorRow(cash_id);
    $("#cash_total_data_table_container").html("Loading...");

    $.ajax({
        type: 'GET',
        url: '/admin/previous_cash_totals/previous_cash_total',
        data: {
            "search[id_equals]" : cash_id
        }
    });
}

function addReportTypeFilter(type) {
    reportType = type;
    runCashTotalSearch();
}

function addTerminalFilter(terminal_id) {
    terminalId = terminal_id;
    runCashTotalSearch();
}

function addReportByFilter(employee_id) {
    reportBy = employee_id;
    runCashTotalSearch();
}

var order;

function orderResults(){
    order = (order == "DESC") ? "ASC" : "DESC";
    runCashTotalSearch();
}

function printCashTotal(){
    if ($('#cash_totals_data_table').length == 0){
        setStatusMessage("No cash total present");
        return;
    } else {
        printCash($('#reports_center_receipt').html(),true);
    }
}

function printCash(content, printRecptMessage) {
    setStatusMessage("Printing Cash Total");

    if(printRecptMessage) {
        receiptMessageHTML = "<div id='receipt_message'>" + receiptMessage + "</div>";
        content += clearHTML + receiptMessageHTML;
    }

    //add space and a dot so we print a bottom margin
    content += clear30HTML + "<div class='the_dots'>.  .  .</div>";

    printContent(content);
}

function switchColorRow(id) {
    $('.table_row').css('background-color', '#FFFFFF');
    $('#row_'+id).css('background-color', '#659EC7');
}