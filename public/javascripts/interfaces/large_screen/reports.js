$(function() {
      setReportsDatePickers();
      setOnchangeEvents();
});

var selectedFromDate;
var selectedToDate;
var terminal_id;

/**
 *  Reports
 **/

function setReportsDatePickers() {
    $('#date_select_container').find('#date_from').datepicker({
        dateFormat: 'dd-mm-yy',
        defaultDate: selectedFromDate,
        onSelect: function(dateText, inst) {
            $('#date_select_container').find('#date_to').datepicker("option", "minDate", dateText);
            $('#search_created_at_gte').val(dateText);
        }
    });

    $('#date_select_container').find('#date_to').datepicker({
        dateFormat: 'dd-mm-yy',
        defaultDate: selectedToDate,
        onSelect: function(dateText, inst) {
            $('#date_select_container').find('#date_from').datepicker("option", "maxDate", dateText);
            $('#search_created_at_lte').val(dateText);
        }
    });
}

function setOnchangeEvents(){

}

function addTerminalFilter(terminal_id) {
    terminalId = terminal_id;
    runSalesSearch();
}

function addDateFilter(date) {
    terminalId = terminal_id;
    runSalesSearch();
}

function runSalesSearch(){

}