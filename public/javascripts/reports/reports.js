$(function() {
      setReportsDatePickers();
});

var selectedFromDate;
var selectedToDate;
var terminalId;
var hour_from;
var hour_to;

/**
 *  Reports
 **/

function setReportsDatePickers() {
    $('#date_select_container').find('#date_from').datepicker({
        dateFormat: 'dd-mm-yy',
        defaultDate: selectedFromDate,
        onSelect: function(dateText, inst) {
            $('#date_select_container').find('#date_to').datepicker("option", "minDate", dateText);
            selectedFromDate = dateText;
            if($('#date_select_container').find('#date_to').val()!=""){
                runGlancesSearch();
            }
        }
    });

    $('#date_select_container').find('#date_to').datepicker({
        dateFormat: 'dd-mm-yy',
        defaultDate: selectedToDate,
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
