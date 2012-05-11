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
        timeFormat: 'h:m',
        addSliderAccess: true,
        sliderAccessArgs: { touchonly: false },
        onSelect: function(dateText, inst) {
            $('#date_preselect').attr('selectedIndex', 10);
            $('#date_select_container').find('#date_to').datepicker("option", "minDate", dateText);
            selectedFromDate = dateText;
            setReportParams();
            setStockParams();

            if ($('#date_select_container').find('#date_to').val() != "") {
                runGlancesSearch();
            }
        }
    });

    $('#date_select_container').find('#date_to').datetimepicker({
        dateFormat: 'yy-mm-dd',
        defaultDate: '01/01/01',
        timeFormat: 'h:m',
        addSliderAccess: true,
        sliderAccessArgs: { touchonly: false },
        onSelect: function(dateText, inst) {

            $('#date_select_container').find('#date_from').datepicker("option", "maxDate", dateText);

            selectedToDate = dateText;
            setReportParams();
            setStockParams();
            if ($('#date_select_container').find('#date_from').val() != "") {
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
    setReportParams();
    setStockParams();
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

function setDateParams(set_date, isManual) {
    $('#date_from').val(set_date.split(',')[0]);
    $('#date_to').val(set_date.split(',')[1]);
    selectedFromDate = set_date.split(',')[0];
    selectedToDate = set_date.split(',')[1];
    if (isManual){
           setReportParams();
           setStockParams();
    }

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
    switch (interval_selected) {
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

    if (day_from != -1) {
        var fromDate = new Date();
        fromDate.setDate(new Date().getDate() - day_from);
        selectedFromDate = formatDate(fromDate, "dd-MM-yyyy");
    }
    else {
        selectedFromDate = "";
        selectedToDate = "";
    }
    runGlancesSearch();
}

function runGlancesSearch() {
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

function runSalesSearch() {
    $("#report_sales_results").html("Loading...");

    if ($('#product_search').val() != '') {
        $.ajax({
            type: 'GET',
            url: '/reports/sales/load_dropdown',
            data: {
                "search[search_product]" : $('#product_search').val(),
                "search[dropdown_type]" : '',
                "search[dropdown_id]" : ''
            }
        }).done(function() {
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
            });
    } else {

        $.ajax({
        type: 'GET',
        url: '/reports/sales/set_params',
        data: {
            "search[search_type]" : search_type,
            "search[category]" : $('#category_id_equals').val(),
            "search[product]" : $('#product_id_equals').val(),
            "search[from_date]" : selectedFromDate,
            "search[to_date]" : selectedToDate,
            "search[terminal]" : terminalId,
            "search[select_type]" : select_type
        }
    }).done(function() {
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
        });
    }


}

function runStocksSearch() {
    $("#report_stocks_results").html("Loading...");

    $.ajax({
        type: 'GET',
        url: '/reports/stocks/set_params',
        data: {
            "search[search_type]" : search_type,
            "search[category]" : $('#category_id_equals').val(),
            "search[product]" : $('#product_id_equals').val(),
            "search[from_date]" : selectedFromDate,
            "search[to_date]" : selectedToDate,
            "search[terminal]" : terminalId,
            "search[select_type]" : select_type
        }
    }).done(function() {
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
    });
}

function setReportParams() {

    select_type = ''

    $.ajax({
        type: 'GET',
        url: '/reports/sales/set_params',
        data: {
            "search[search_type]" : search_type,
            "search[category]" : $('#category_id_equals').val(),
            "search[product]" : $('#product_id_equals').val(),
            "search[from_date]" : selectedFromDate,
            "search[to_date]" : selectedToDate,
            "search[terminal]" : terminalId

        }
    });
}

function setStockParams() {

    select_type = ''

    $.ajax({
        type: 'GET',
        url: '/reports/stocks/set_params',
        data: {
            "search[search_type]" : search_type,
            "search[category]" : $('#category_id_equals').val(),
            "search[product]" : $('#product_id_equals').val(),
            "search[from_date]" : selectedFromDate,
            "search[to_date]" : selectedToDate,
            "search[terminal]" : terminalId
        }
    });
}

function setHighChart() {
    $.ajax({
        type: 'GET',
        url: '/reports/sales/render_graph',
        data: {
            "search[search_type]" : search_type,
            "search[category]" : $('#category_id_equals').val(),
            "search[product]" : $('#product_id_equals').val(),
            "search[from_date]" : selectedFromDate,
            "search[to_date]" : selectedToDate,
            "search[terminal]" : terminalId
        }
    });
}

function loadDropDown(drop_type) {
    var drop_val = "";
    if (drop_type == 'category') {
        drop_val = $('#category_id_equals').val()
    } else {
        drop_val = $('#product_id_equals').val()
    }
    $.ajax({
        type: 'GET',
        url: '/reports/sales/load_dropdown',
        data: {
            "search[dropdown_type]" : drop_type,
            "search[dropdown_id]" : drop_val,
            "search[search_product]" : ''
        }
    });
    $.ajax({
        type: 'GET',
        url: '/reports/stocks/load_dropdown',
        data: {
            "search[dropdown_type]" : drop_type,
            "search[dropdown_id]" : drop_val
        }
    });
}

function switchView(view_type) {
    if (view_type == "table") {
        $("#graph_view").removeClass("selected");
        $("#table_view").addClass("selected");
        $('#sales_items_graph').hide();
        $('#stocks_items_graph').hide();
        $('#sales_items').show();
        $('#stock_items').show();
    }

    if (view_type == "graph") {
        $("#graph_view").addClass("selected");
        $("#table_view").removeClass("selected");
        $('#sales_items_graph').show();
        $('#stocks_items_graph').show();
        $('#sales_items').hide();
        $('#stock_items').hide();

    }
}

function setStockSearchType(interval_selected) {
    switch (interval_selected) {
        case '0':
            search_type = 'all';
            break;
        case '1':
            search_type = 'by_product';
            break;
        case '2':
            search_type = 'by_category';
            break;

    }
    setStockParams();
}

function setSearchTerm(drop_type) {
    $('#category_id_equals').val('Any')
    $('#product_id_equals').val('Any')

    if (drop_type == '') {
        $.ajax({
            type: 'GET',
            url: '/reports/sales/load_dropdown',
            data: {
                "search[search_product]" : '',
                "search[dropdown_type]" : '',
                "search[dropdown_id]" : ''
            }
        });
    }


}

function setSearchType(interval_selected) {
    switch (interval_selected) {
        case '0':
            search_type = 'best_seller';
            $('#product_dropdown').hide();
            $('#product_search').val('');
            $('#string_search_box').hide();
            break;
        case '1':
            search_type = 'worst_seller';
            $('#product_dropdown').hide();
            $('#product_search').val('');
            $('#string_search_box').hide();
            break;
        case '2':
            search_type = 'day';
            $('#product_dropdown').show();
            $('#string_search_box').show();
            break;
        case '3':
            search_type = 'week';
            $('#product_dropdown').show();
            $('#string_search_box').show();
            break;
        case '4':
            search_type = 'month';
            $('#product_dropdown').show();
            $('#string_search_box').show();
            break;
        case '5':
            search_type = 'year';
            $('#product_dropdown').show();
            $('#string_search_box').show();
            break;

    }
    setReportParams();
}

function setSearchSelect(set_type){
    if (set_type == -1){
      $('#sales_items_graph').hide();
      $('#search_type_select').attr('selectedIndex', 0);
      $('#date_preselect').attr('selectedIndex', 10);
      $('#category_id_equals').attr('selectedIndex', 0);
      $('#product_id_equals').attr('selectedIndex', 0);
      search_type = 'best_seller';
      setDateParams($('#date_preselect').val(), false);
      select_type = set_type
    }
    if (set_type == 0){
      $('#search_type_select').attr('selectedIndex', 2);
      $('#date_preselect').attr('selectedIndex', 2);
      search_type = 'day';
      setDateParams($('#date_preselect').val(), false);
      select_type = set_type
    }
    if (set_type == 1){
      $('#search_type_select').attr('selectedIndex', 0);
      $('#date_preselect').attr('selectedIndex', 3);
      search_type = 'best_seller';
      setDateParams($('#date_preselect').val(), false);
      select_type = set_type
    }
    if (set_type == 2){
      $('#search_type_select').attr('selectedIndex', 4);
      $('#date_preselect').attr('selectedIndex', 4);
      search_type = 'month';
      setDateParams($('#date_preselect').val(), false);
      select_type = set_type
    }
    if (set_type == 3){
      $('#search_type_select').attr('selectedIndex', 0);
      $('#date_preselect').attr('selectedIndex', 2);
      search_type = 'best_seller';
      setDateParams($('#date_preselect').val(), false);
      select_type = set_type
    }
     $.ajax({
        type: 'GET',
        url: '/reports/sales/set_params',
        data: {
            "search[search_type]" : search_type,
            "search[category]" : $('#category_id_equals').val(),
            "search[product]" : $('#product_id_equals').val(),
            "search[from_date]" : selectedFromDate,
            "search[to_date]" : selectedToDate,
            "search[terminal]" : terminalId,
            "search[select_type]" : select_type
        }
    }).done(function() {
      runSalesSearch();
      });


}

function setStockSelect(set_type){
    if (set_type == -1){
      $('#sales_items_graph').hide();
      $('#search_type_select').attr('selectedIndex', 0);
      $('#date_preselect').attr('selectedIndex', 10);
      $('#category_id_equals').attr('selectedIndex', 0);
      $('#category_id_equals').attr('selectedIndex', 0);
      $('#product_id_equals').attr('selectedIndex', 0);
      search_type = 'best_seller';
      setDateParams($('#date_preselect').val(), false);
      select_type = set_type
    }
    if (set_type == 0){
      $('#search_type_select').attr('selectedIndex', 0);
      $('#date_preselect').attr('selectedIndex', 2);
      search_type = 'by_product';
      setDateParams($('#date_preselect').val(), false);
      select_type = set_type
    }
    if (set_type == 1){
      $('#search_type_select').attr('selectedIndex', 0);
      $('#date_preselect').attr('selectedIndex', 3);
      search_type = 'by_product';
      setDateParams($('#date_preselect').val(), false);
      select_type = set_type
    }
    if (set_type == 2){
      $('#search_type_select').attr('selectedIndex', 0);
      $('#date_preselect').attr('selectedIndex', 4);
      search_type = 'by_product';
      setDateParams($('#date_preselect').val(), false);
      select_type = set_type
    }
    if (set_type == 3){
      $('#search_type_select').attr('selectedIndex', 0);
      $('#date_preselect').attr('selectedIndex', 9);
      search_type = 'by_product';
      setDateParams($('#date_preselect').val(), false);
      select_type = set_type
    }
     $.ajax({
        type: 'GET',
        url: '/reports/stocks/set_params',
        data: {
            "search[search_type]" : search_type,
            "search[category]" : $('#category_id_equals').val(),
            "search[product]" : $('#product_id_equals').val(),
            "search[from_date]" : selectedFromDate,
            "search[to_date]" : selectedToDate,
            "search[terminal]" : terminalId,
            "search[select_type]" : select_type
        }
    }).done(function() {
      runStocksSearch();
      });


}
