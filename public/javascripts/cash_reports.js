

function getCashTotalDataTable(cash_total_data, show_currency) {
    if(typeof(show_currency) == "undefined") {
        show_currency = true
    }
    
    cash_total_data_html = "<div class='data_table'>";
    
    for(i=0; i<cash_total_data.length; i++) {
        cash_total_data_html += "<div class='label'>" + cash_total_data[i][0] + "</div>";
        cash_total_data_html += "<div class='data'>" + (show_currency ? currency(cash_total_data[i][1]) : cash_total_data[i][1]) + "</div>" + clearHTML;
    }
    
    cash_total_data_html += "</div>";
    
    return cash_total_data_html;
}

function getCashTotalTaxesDataTable(taxes_data) {
    cash_total_data_html = "<div class='taxes_data_table'>";
    
    cash_total_data_html += "<div class='taxes_data_table_label_header'>Rate</div>";
    cash_total_data_html += "<div class='taxes_data_table_header'>Net</div>";
    cash_total_data_html += "<div class='taxes_data_table_header'>Tax</div>";
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

function saveCoinCount() {
    
}

function cancelCoinCount() {
    
}