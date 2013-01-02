$(function() {
    setReportsDatePickers();
});

var selectedFromDate;
var selectedToDate;
var search_type;
var terminalId;
var hour_from;
var hour_to;
var drop_val;
var discounts_only = false;
var drop_set_type;
var select_type = '';

/**
 *  Reports
 **/

function setPaymentReportsDatePickers() {
    $('#date_select_container').find('#date_from').datetimepicker({
        dateFormat: 'yy-mm-dd',
        defaultDate: '01/01/01',
        timeFormat: 'h:m',
        addSliderAccess: true,
        sliderAccessArgs: { touchonly: false }

    });

    $('#date_select_container').find('#date_to').datetimepicker({
        dateFormat: 'yy-mm-dd',
        defaultDate: '01/01/01',
        timeFormat: 'h:m',
        addSliderAccess: true,
        sliderAccessArgs: { touchonly: false }

    });
}

var TODAY = "1"
var YESTERDAY = "2"
var LAST_WEEK = "3"
var LAST_MONTH = "4"
var ALL_TIME = "5"

function addPaymentTerminalFilter(terminal_id) {
    terminalId = terminal_id;
    setPaymentReportParams();
}


function setPaymentDateParams(set_date, isManual) {
    $('#date_from').val(set_date.split(',')[0]);
    $('#date_to').val(set_date.split(',')[1]);
    selectedFromDate = set_date.split(',')[0];
    selectedToDate = set_date.split(',')[1];
    if (isManual) {
        setPaymentReportParams();
    }

}

function setCustomerDateParams(set_date, isManual) {
    $('#date_from').val(set_date.split(',')[0]);
    $('#date_to').val(set_date.split(',')[1]);
    selectedFromDate = set_date.split(',')[0];
    selectedToDate = set_date.split(',')[1];
    if (isManual) {
        setCustomerReportParams();
    }

}


function runCustomerSearch() {
    if (!$('#refine_button').is('.selected')) {
    $("#report_customer_results").html("Loading...");
    $('#refine_button').addClass("selected");

    $.ajax({
        type: 'GET',
        url: '/reports/customers/set_params',
        data: {
            "search[search_type]" : search_type,
            "search[from_date]" : selectedFromDate,
            "search[to_date]" : selectedToDate,
            "search[terminal]" : terminalId,
            "search[select_type]" : select_type,
            "search[discounts_only]" : discounts_only,
            "search[training_mode]" : inTrainingMode

            }
        }).done(function() {
            $.ajax({
                type: 'GET',
                url: '/reports/customers/customer_search',
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

function setCustomerReportParams() {

    select_type = ''

    $.ajax({
        type: 'GET',
        url: '/reports/customers/set_params',
        data: {
            "search[search_type]" : search_type,
            "search[from_date]" : selectedFromDate,
            "search[to_date]" : selectedToDate,
            "search[terminal]" : terminalId,
            "search[training_mode]" : inTrainingMode

        }
    });
}


function loadCustomerDropDown(drop_val) {

   if (drop_val == ''){
       drop_val = 'all'
   }
    $.ajax({
        type: 'GET',
        url: '/reports/customers/load_dropdown',
        data: {
            "search[dropdown_id]" : drop_val
        }
    });
}

function switchCustomerView(view_type) {
    if (view_type == "table") {
        $("#graph_view").removeClass("selected");
        $("#table_view").addClass("selected");
        $('#customer_items_graph').hide();
        $('#customer_items').show();
    }

    if (view_type == "graph") {
        $("#graph_view").addClass("selected");
        $("#table_view").removeClass("selected");
        $('#customer_items_graph').show();
        $('#customer_items').hide();

    }
}


function setCustomerSearchType(interval_selected) {
    switch (interval_selected) {

        case '0':
            search_type = 'employee';
            break;
        case '1':
            search_type = 'day';
            break;
        case '2':
            search_type = 'week';
            break;
        case '3':
            search_type = 'month';
            break;
        case '4':
            search_type = 'year';
            break;



    }
    setCustomerReportParams();
}

function setCustomerSelect(set_type) {
    if (set_type == -1) {
        $('#date_preselect').attr('selectedIndex', 10);


        setDateParams($('#date_preselect').val(), false);
        select_type = set_type
    }
    if (set_type == 0) {
        $('#customer_items_graph').hide();
        $('#search_type_select').attr('selectedIndex', 0);
        $('#date_preselect').attr('selectedIndex', 2);


        setDateParams($('#date_preselect').val(), false);
        select_type = set_type
    }
    if (set_type == 1) {
        $('#search_type_select').attr('selectedIndex', 0);
        $('#date_preselect').attr('selectedIndex', 5);


        setDateParams($('#date_preselect').val(), false);
        select_type = set_type
    }
    if (set_type == 2) {
        $('#customer_items_graph').hide();
        $('#search_type_select').attr('selectedIndex', 0);
        $('#date_preselect').attr('selectedIndex', 4);


        setDateParams($('#date_preselect').val(), false);
        select_type = set_type
    }


    $.ajax({
        type: 'GET',
        url: '/reports/customers/set_params',
        data: {
            "search[search_type]" : search_type,
            "search[from_date]" : selectedFromDate,
            "search[to_date]" : selectedToDate,
            "search[terminal]" : terminalId,
            "search[select_type]" : select_type,
            "search[training_mode]" : inTrainingMode
        }
    }).done(function() {
            runCustomerSearch();
            discounts_only = '';
        });


}

function updateCustomerDateParams(set_date, date_type) {
    var olddate = new Date(set_date.replace(/-/g,"/"));
    var subbed = new Date(olddate);
    var newtime = subbed.getFullYear() + "-" + (parseInt(subbed.getMonth()) + 1) + "-" + subbed.getDate() + " " + subbed.getHours() + ":" + subbed.getMinutes()
    if (date_type == 'from') {
        selectedFromDate = newtime;
    } else {
        selectedToDate = newtime;
    }


}
