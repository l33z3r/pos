$(function() {
      setReportsDatePickers();
});

var selectedFromDate;
var selectedToDate;
var search_type;
var terminalId;
var hour_from;
var hour_to;

/**
 *  Reports
 **/

function setReportsDatePickers() {
    $('#date_select_container').find('#date_from').datetimepicker({
        dateFormat: 'yy-mm-dd',
        defaultDate: '01/01/01',
        addSliderAccess: true,
	    sliderAccessArgs: { touchonly: false },
        onSelect: function(dateText, inst) {
            $('#date_preselect').attr('selectedIndex', 10);
            $('#date_select_container').find('#date_to').datepicker("option", "minDate", dateText);
            selectedFromDate = dateText;
            if($('#date_select_container').find('#date_to').val()!=""){
                runGlancesSearch();
            }
        }
    });

    $('#date_select_container').find('#date_to').datetimepicker({
        dateFormat: 'yy-mm-dd',
        defaultDate: '01/01/01',
        addSliderAccess: true,
	    sliderAccessArgs: { touchonly: false },
        onSelect: function(dateText, inst) {
            $('#date_select_container').find('#date_from').datepicker("option", "maxDate", dateText);
            selectedToDate = dateText;
            if($('#date_select_container').find('#date_from').val()!=""){
                runGlancesSearch();
            }
        }
    });
}

var TODAY = "1"
var YESTERDAY = "2"
var LAST_WEEK = "3"
var LAST_MONTH = "4"
var ALL_TIME = "5"

function addTerminalFilter(terminal_id) {
    terminalId = terminal_id;
    runGlancesSearch();
}

function addHourFromFilter(hour) {
    hour_from = hour;
    runGlancesSearch();
}

function addHourToFilter(hour) {
    hour_to = hour;
    runGlancesSearch();
}

function printInvoice(url) {

    var iframe = document.createElement('iframe'),
        iframeDocument;

    iframe.style.postion = 'absolute';
    iframe.style.left = '-9999px';
    iframe.src = url;
    document.body.appendChild(iframe);

    if ('contentWindow' in iframe) {
       iframeDocument = iframe.contentWindow;
    } else {
       iframeDocument = iframe.contentDocument;
    }

    var script = iframeDocument.createElement('script');

    script.type = 'text/javascript';

    script.innerHTML = 'window.print();';

    iframeDocument.getElementsByTagName('head')[0].appendChild(script);

}

function setDateParams(set_date){
    $('#date_from').val(set_date.split(',')[0]);
    $('#date_to').val(set_date.split(',')[1]);
    selectedFromDate = set_date.split(',')[0];
    selectedToDate = set_date.split(',')[1];

    setReportParams();
}

function addDateFilter(interval_selected) {
    //clear from and to fields
    $('#date_from').val("");
    $('#date_to').val("");

    var day_to = (interval_selected == YESTERDAY) ? 1 : 0;
    var toDate = new Date();
    toDate.setDate(new Date().getDate() - day_to);
    selectedToDate = formatDate(toDate, "dd-MM-yyyy");
    var day_from;
    switch(interval_selected)
        {
        case TODAY:
          day_from = 0;
          break;
        case YESTERDAY:
          day_from = 1;
          break;
        case LAST_WEEK:
          day_from = 7;
          break;
        case LAST_MONTH:
          day_from = 30;
          break;
        case ALL_TIME:
          day_from = -1;
          break;
        }
    
    if(day_from != -1){    
        var fromDate = new Date();
        fromDate.setDate(new Date().getDate() - day_from);
        selectedFromDate = formatDate(fromDate, "dd-MM-yyyy");
    }
    else{
        selectedFromDate = "";
        selectedToDate = "";
    }
    runGlancesSearch();
}

function runGlancesSearch(){
    $("#at_a_glance_results").html("Loading...");
    $.ajax({
        type: 'GET',
        url: '/reports/glances/glances_search',
        data: {
             "search[created_at_gt]" : selectedFromDate,
             "search[created_at_lt]" : selectedToDate,
             "search[terminal_id_equals]" : terminalId,
             "search2[hour_from]" : hour_from,
             "search2[hour_to]" : hour_to
        }
    });
}

function runSalesSearch(){
    $("#report_sales_results").html("Loading...");
    $.ajax({
        type: 'GET',
        url: '/reports/sales/sales_search',
        data: {
             "search[created_at_gt]" : selectedFromDate,
             "search[created_at_lt]" : selectedToDate,
             "search[terminal_id_equals]" : terminalId,
             "search2[hour_from]" : hour_from,
             "search2[hour_to]" : hour_to
        }
    });

}

function runStocksSearch(){
    $("#report_stocks_results").html("Loading...");
    $.ajax({
        type: 'GET',
        url: '/reports/stocks/stocks_search',
        data: {
             "search[created_at_gt]" : selectedFromDate,
             "search[created_at_lt]" : selectedToDate,
             "search[terminal_id_equals]" : terminalId,
             "search2[hour_from]" : hour_from,
             "search2[hour_to]" : hour_to
        }
    });
}

function setReportParams(){
    $.ajax({
        type: 'GET',
        url: '/reports/sales/set_params',
        data: {
             "search[search_type]" : search_type,
             "search[category]" : $('#category_id_equals').val(),
             "search[product]" : $('#product_id_equals').val(),
             "search[from_date]" : selectedFromDate,
             "search[to_date]" : selectedToDate
        }
    });
}

function loadDropDown(drop_type){
    var drop_val = "";
    if (drop_type == 'category') {
        drop_val = $('#category_id_equals').val()
    }else{
        drop_val = $('#product_id_equals').val()
    }
    $.ajax({
        type: 'GET',
        url: '/reports/sales/load_dropdown',
        data: {
             "search[dropdown_type]" : drop_type,
             "search[dropdown_id]" : drop_val
        }
    });
}

function setSearchType(interval_selected) {
    switch(interval_selected)
        {
        case '0':
          search_type = 'best_seller';
          break;
        case '1':
          search_type = 'worst_seller';
          break;
        case '2':
          search_type = 'day';
          break;
        case '3':
          search_type = 'week';
          break;
        case '4':
          search_type = 'month';
          break;
        case '5':
          search_type = 'year';
          break;

        }
    setReportParams();
}
