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

function setDeliveryReportsDatePickers() {
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

function addDeliveryTerminalFilter(terminal_id) {
    terminalId = terminal_id;
    setDeliveryReportParams();
}


function setDeliveryDateParams(set_date, isManual) {
    $('#date_from').val(set_date.split(',')[0]);
    $('#date_to').val(set_date.split(',')[1]);
    selectedFromDate = set_date.split(',')[0];
    selectedToDate = set_date.split(',')[1];
    if (isManual) {
        setDeliveryReportParams();
    }

}


function runDeliverysSearch() {
    if (!$('#refine_button').is('.selected')) {
    $("#report_deliveries_results").html("Loading...");
    $('#refine_button').addClass("selected");

    $.ajax({
        type: 'GET',
        url: '/reports/deliveries/set_params',
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
                url: '/reports/deliveries/deliveries_search',
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

function setDeliveryReportParams() {

    select_type = ''

    $.ajax({
        type: 'GET',
        url: '/reports/deliveries/set_params',
        data: {
            "search[search_type]" : search_type,
            "search[from_date]" : selectedFromDate,
            "search[to_date]" : selectedToDate,
            "search[terminal]" : terminalId,
            "search[training_mode]" : inTrainingMode

        }
    });
}


function loadDeliveryDropDown(drop_type) {
    drop_val = "";
    drop_set_type = drop_type;
    if (drop_type == 'delivery_type') {
        drop_val = $('#delivery_method_id_equals').val()
    }
    if (drop_type == 'employee') {
        drop_val = $('#employee_id_equals').val()
    }
    if (drop_type == 'discounts_only') {
        drop_val = $('#discounts_checked').is(":checked")
        discounts_only = drop_val
    }


    $.ajax({
        type: 'GET',
        url: '/reports/deliveries/load_dropdown',
        data: {
            "search[dropdown_type]" : drop_set_type,
            "search[dropdown_id]" : drop_val
        }
    });
}

function switchDeliveryView(view_type) {
    if (view_type == "table") {
        $("#graph_view").removeClass("selected");
        $("#table_view").addClass("selected");
        $('#deliveries_items_graph').hide();
        $('#deliveries_items').show();
    }

    if (view_type == "graph") {
        $("#graph_view").addClass("selected");
        $("#table_view").removeClass("selected");
        $('#deliveries_items_graph').show();
        $('#deliveries_items').hide();

    }
}


function setDeliverySearchType(interval_selected) {
    switch (interval_selected) {
        case '0':
            search_type = 'by_delivery';
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
    setDeliveryReportParams();
}

function setDeliverySelect(set_type) {
    if (set_type == -1) {
        $('#deliveries_items_graph').hide();
        $('#search_type_select').attr('selectedIndex', 0);
        $('#date_preselect').attr('selectedIndex', 10);
        $('#category_id_equals').attr('selectedIndex', 0);
        $('#category_id_equals').attr('selectedIndex', 0);
        $('#product_id_equals').attr('selectedIndex', 0);
        search_type = 'transaction_list';
        $('#discounts_checked').removeAttr('checked')

        setDateParams($('#date_preselect').val(), false);
        select_type = set_type
    }
    if (set_type == 0) {
        $('#search_type_select').attr('selectedIndex', 0);
        $('#date_preselect').attr('selectedIndex', 2);
        search_type = 'transaction_list';
        $('#discounts_checked').removeAttr('checked')

        setDateParams($('#date_preselect').val(), false);
        select_type = set_type
    }
    if (set_type == 1) {
        $('#search_type_select').attr('selectedIndex', 0);
        $('#date_preselect').attr('selectedIndex', 5);
        $('#discounts_checked').attr('checked', 'checked')
        search_type = 'transaction_list';
        discounts_only = true
        drop_set_type = "discounts_only"


        setDateParams($('#date_preselect').val(), false);
        select_type = set_type
    }
    if (set_type == 2) {
        $('#search_type_select').attr('selectedIndex', 3);
        $('#date_preselect').attr('selectedIndex', 4);
        search_type = 'month';
        $('#discounts_checked').removeAttr('checked')

        setDateParams($('#date_preselect').val(), false);
        select_type = set_type
    }
    if (set_type == 3) {
        $('#search_type_select').attr('selectedIndex', 1);
        $('#date_preselect').attr('selectedIndex', 4);
        search_type = 'day';
        $('#discounts_checked').removeAttr('checked')
        setDateParams($('#date_preselect').val(), false);
        select_type = set_type
    }
    $.ajax({
        type: 'GET',
        url: '/reports/deliveries/load_dropdown',
        data: {
            "search[dropdown_type]" : drop_set_type,
            "search[dropdown_id]" : discounts_only
        }
    }).done(function() {
    $.ajax({
        type: 'GET',
        url: '/reports/deliveries/set_params',
        data: {
            "search[search_type]" : search_type,
            "search[from_date]" : selectedFromDate,
            "search[to_date]" : selectedToDate,
            "search[terminal]" : terminalId,
            "search[select_type]" : select_type,
            "search[training_mode]" : inTrainingMode
        }
    }) }).done(function() {
            runDeliverysSearch();
            discounts_only = '';
        });


}

function updateDeliveryDateParams(set_date, date_type) {
    var olddate = new Date(set_date);
    var subbed = new Date(olddate - 1*60*60*1000);
    var newtime = subbed.getFullYear() + "-" + (parseInt(subbed.getMonth()) + 1) + "-" + subbed.getDate() + " " + subbed.getHours() + ":" + subbed.getMinutes()
    if (date_type == 'from') {
        selectedFromDate = newtime;
    } else {
        selectedToDate = newtime;
    }


}
