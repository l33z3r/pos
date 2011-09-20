function getCashTotalDataTable(cash_total_data, show_currency) {
    if(typeof(show_currency) == "undefined") {
        show_currency = true
    }
    
    cash_total_data_html = "<div class='data_table'>";
    
    for(i=0; i<cash_total_data.length; i++) {
        cash_total_data_html += "<div class='label'>" + cash_total_data[i][0] + "</div>";
        cash_total_data_html += "<div class='data'>" + (show_currency && (!isNaN( parseFloat(cash_total_data[i][1]))) ? currency(cash_total_data[i][1]) : cash_total_data[i][1]) + "</div>" + clearHTML;
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
        
    for(i=0; i<taxes_data.length; i++) {
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
    
    for(i=0; i<data.length; i++) {
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
    
    for(i=0; i<data.length; i++) {
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
    
    if(typeof(commit) == "undefined") {
        show_currency = false
    }
    
    coinCounterPosition = $('#reports_coin_counter_widget_container');
    
    totalFunction = function(total) {
        reportsCashCount = total;
    };
    
    setUtilCoinCounter(coinCounterPosition, totalFunction);
    
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

function finishCashTotal() {
    $('#cash_totals_header_section').show();
    
    content = $('#reports_center_receipt').html();
    
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
    
    for(i = 0; i < tableIDS.length; i++) {
        getTableOrderFromStorage(current_user_id, tableIDS[i]);
    }
    
    for(i = 0; i < tableIDS.length; i++) {
        var orderTotal = tableOrders[parseInt(tableIDS[i])].total;
        total += orderTotal;
    }
    
    //now load back up the current users order it its not his personal receipt
    if(savedTableID != -1) {
        getTableOrderFromStorage(current_user_id, savedTableID);
    }
    
    return total;
}