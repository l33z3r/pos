function getCashTotalDataTable(cash_total_data, show_currency) {
    if(typeof(show_currency) == "undefined") {
        show_currency = true
    }
    
    cash_total_data_html = "<div class='data_table'>";
    
    for(var i=0; i<cash_total_data.length; i++) {
        cash_total_data_html += "<div class='label'>" + cash_total_data[i][0] + "</div>";
        cash_total_data_html += "<div class='data'>" + (show_currency && (!isNaN( parseFloat(cash_total_data[i][1]))) ? currency(cash_total_data[i][1]) : cash_total_data[i][1]) + "</div>" + clearHTML;
    }
    
    cash_total_data_html += "</div>";
    
    return cash_total_data_html;
}

function getCashTotalSalesByProductDataTable(products_data) {
    cash_total_data_html = "<div class='products_data_table'>";
    
    cash_total_data_html += "<div class='products_data_table_label_header'>Product</div>";
    cash_total_data_html += "<div class='products_data_table_header'>Quantity</div>";
    cash_total_data_html += "<div class='products_data_table_header'>Total</div>" + clear10HTML;
        
    for(var i=0; i<products_data.length; i++) {
        cash_total_data_html += "<div class='products_label'>" + products_data[i][0] + "</div>";
        cash_total_data_html += "<div class='products_data'>" + products_data[i][1] + "</div>";
        cash_total_data_html += "<div class='products_data'>" + currency(products_data[i][2]) + "</div>" + clearHTML;
    }
    
    cash_total_data_html += "</div>";
    
    return cash_total_data_html;
}

function getCashTotalTaxesDataTable(taxes_data) {
    cash_total_data_html = "<div class='taxes_data_table'>";
    
    cash_total_data_html += "<div class='taxes_data_table_label_header'>Rate</div>";
    cash_total_data_html += "<div class='taxes_data_table_header'>Net</div>";
    cash_total_data_html += "<div class='taxes_data_table_header'>" + taxLabel + "</div>";
    cash_total_data_html += "<div class='taxes_data_table_header'>Gross</div>" + clear10HTML;
        
    for(var i=0; i<taxes_data.length; i++) {
        cash_total_data_html += "<div class='taxes_label'>" + taxes_data[i][0] + "%</div>";
        cash_total_data_html += "<div class='taxes_data'>" + currency(taxes_data[i][1]) + "</div>";
        cash_total_data_html += "<div class='taxes_data'>" + currency(taxes_data[i][2]) + "</div>";
        cash_total_data_html += "<div class='taxes_data'>" + currency(taxes_data[i][3]) + "</div>" + clearHTML;
    }
    
    cash_total_data_html += "</div>";
    
    return cash_total_data_html;
}

function getCashTotalDataTableTotals(label, data) {
    totals_html = "<div class='totals_data_table'>";
    totals_html += "<div class='totals_label'>" + label + "</div>";
    
    total = 0;
    
    for(var i=0; i<data.length; i++) {
        total += parseFloat(data[i][1]);
    }
    
    totals_html += "<div class='totals_data'>" + currency(total) + "</div></div>" + clearHTML;
    
    return totals_html;
}

function getCashTotalTaxesDataTableTotals(label, data) {
    taxes_totals_html = "<div class='taxes_totals_data_table'>";
    taxes_totals_html += "<div class='taxes_totals_label'>" + label + "</div>";
    
    netTotal = 0;
    taxTotal = 0;
    grossTotal = 0;
    
    for(var i=0; i<data.length; i++) {
        netTotal += parseFloat(data[i][1]);
        taxTotal += parseFloat(data[i][2]);
        grossTotal += parseFloat(data[i][3]);
    }
    
    taxes_totals_html += "<div class='taxes_totals_data'>" + currency(netTotal) + "</div>";
    taxes_totals_html += "<div class='taxes_totals_data'>" + currency(taxTotal) + "</div>";
    taxes_totals_html += "<div class='taxes_totals_data'>" + currency(grossTotal) + "</div>";
        
    taxes_totals_html += "</div>" + clearHTML;
    
    return taxes_totals_html;
}

var reportsCashCount = 0;
var currentTotalType = null;

function doCashTotalReport(total_type, commit) {
    setNavTitle(total_type + " Total");
    showNavBackLinkMenuScreen();
    
    $('#reports_left_till_roll').html("Loading...");
    $('#cash_total_data_table_container').html("Loading...");
    
    currentTotalType = total_type;
    
    if(!commit) {
        show_currency = false;
    }
    
    coinCounterPosition = $('#reports_coin_counter_widget_container');
    
    totalFunction = function(total) {
        reportsCashCount = total;
    };
    
    setUtilCoinCounter(coinCounterPosition, totalFunction);
    
    //hide the dropdown menu
    $('#menu_screen_shortcut_dropdown_container').hide();
    
    showCashReportsScreen();
    
    //initialize the zeros in the cash counter?
    if(reportsCashCount == 0) {
        doCoinCounterTotal();
    }
    
    $.ajax({
        type: 'POST',
        url: '/cash_total.js',
        data: {
            total_type : total_type,
            cash_count : reportsCashCount,
            commit : commit
        }
    });
    
    $.ajax({
        type: 'GET',
        url: '/cash_total_history.js'
    });
}

function saveCashReportCoinCount() {
    doCoinCounterTotal();
    doCashTotalReport(currentTotalType, false);
}

function cancelCashReportCoinCount() {
    reportsCashCount = 0;
    currentTotalType = null;
    showMenuScreen();
}

function cashReportsScreenKeypadClick(val) {
    lastActiveElement.val(lastActiveElement.val() + val);
}

function cashReportsScreenKeypadClickCancel() {
    oldVal = lastActiveElement.val();
    newVal = oldVal.substring(0, oldVal.length - 1);
    
    lastActiveElement.val(newVal);
}

function cashReportsScreenKeypadClickTab() {
    lastActiveElement.focusNextInputField();
}

var cashTotalInOperation = false;

function finishCashTotal() {
    if(cashTotalInOperation) {
        niceAlert("Cash Total is in operation, please wait!");
        return;
    }
    
    cashTotalInOperation = true;
        
    $('#cash_totals_header_section').show();
    
    content = $('#reports_center_till_roll').html() + clear10HTML;
    
    doCashTotalReport(currentTotalType, true);
    
    showMenuScreen();
    
    printReceipt(content, false);
    
    cash_totals_data_html_header_info = null;
    reportsCashCount = 0;
    currentTotalType = null;    
}

function saveFloatCoinCount() {
    doCoinCounterTotal();
    
    if(floatTotal > 0) {
        $.ajax({
            type: 'POST',
            url: '/add_float.js',
            data: {
                float_total : floatTotal
            }
        }); 
    }
    
    floatTotal = 0;
    showMenuScreen();
    setStatusMessage("Float Added!");
}

function cancelFloatCoinCount() {
    floatTotal = 0;
    showMenuScreen();
}

function floatScreenKeypadClick(val) {
    lastActiveElement.val(lastActiveElement.val() + val);
}

function floatScreenKeypadClickCancel() {
    oldVal = lastActiveElement.val();
    newVal = oldVal.substring(0, oldVal.length - 1);
    
    lastActiveElement.val(newVal);
}

function floatScreenKeypadClickTab() {
    lastActiveElement.focusNextInputField();
}

function getOpenOrdersTotal() {
    //save the current users table order to reload it after sync
    var savedTableID = selectedTable;
    
    var tableIDS = getActiveTableIDS();
    var total = 0;
    
    for(var i = 0; i < tableIDS.length; i++) {
        getTableOrderFromStorage(current_user_id, tableIDS[i]);
    }
    
    for(var u = 0; u < tableIDS.length; u++) {
        var orderTotal = tableOrders[parseInt(tableIDS[u])].total;
        total += orderTotal;
    }
    
    //now load back up the current users order it its not his personal receipt
    if(savedTableID != -1) {
        getTableOrderFromStorage(current_user_id, savedTableID);
    }
    
    return total;
}

/**
 *  Functions to Previous Cash Totals Page
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
    runCashTotalSearch();
}

function last7daysButtonClicked() {
    var fromDate = new Date();
    fromDate.setDate(new Date().getDate() - 7);
    selectedFromDate = formatDate(fromDate, "dd-MM-yyyy");
    var toDate = new Date();
    toDate.setDate(new Date().getDate());
    selectedToDate = formatDate(toDate, "dd-MM-yyyy");
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
    }
    else{
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

    print(content);
}

function switchColorRow(id) {
            $('.table_row').css('background-color', '#FFFFFF');
            $('#row_'+id).css('background-color', '#659EC7');
}

