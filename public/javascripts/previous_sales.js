$(function() {
    setDatePickers();
    loadFirstTab();
});

var selectedFromDate;
var selectedToDate;

function setDatePickers() {
    $('#order_list_container').find('#date_from').datepicker({
        dateFormat: 'dd-mm-yy',
        defaultDate: selectedFromDate,
        onSelect: function(dateText, inst) { 
            $('#order_list_container').find('#date_to').datepicker("option", "minDate", dateText);
            $('#search_created_at_gte').val(dateText);
        }
    });
    
    $('#order_list_container').find('#date_to').datepicker({
        dateFormat: 'dd-mm-yy',
        defaultDate: selectedToDate,
        onSelect: function(dateText, inst) { 
            $('#order_list_container').find('#date_from').datepicker("option", "maxDate", dateText);
            $('#search_created_at_lte').val(dateText);
        }
    });
}
    
function addTableFilter(tablePermId) {
    $('#search_table_info_perm_id_equals').val(tablePermId);
    $('#order_search').submit();
}

function addTerminalFilter(terminalId) {
    $('#search_terminal_id_equals').val(terminalId);
    $('#order_search').submit();
}

function addServerFilter(server_nickname) {
    $('#search_employee_nickname_equals').val(server_nickname);
    $('#order_search').submit();
}

function todayButtonClicked() {
    var todayDate = formatDate(new Date(), "dd-MM-yyyy");
    forceDateSubmit(todayDate);
}

function yesterdayButtonClicked() {
    constructedDate = new Date();
    constructedDate.setDate(new Date().getDate() - 1);
    var yesterdayDate = constructedDate;
    
    var yesterdayDateFormatted = formatDate(yesterdayDate, "dd-MM-yyyy");
    forceDateSubmit(yesterdayDateFormatted);
}

function forceDateSubmit(date) {
    $('#search_created_at_gte').val(date);
    $('#search_created_at_lte').val(date);
    $('#date_from').val(date);
    $('#date_to').val(date);
    $('#order_search').submit();
}

var reOpenOrderItemHandler;

function doReopenOrderItem() {
    reOpenOrderItemHandler();
}

function reOpenOrderItem() {
    //this id signifies a previous order
    var tableID = -1;
    
    storeTableOrderInStorage(current_user_id, tableID, totalOrder);
    
    //now go to the menu screen
    goTo('/home#screen=menu');
}

function orderListTabSelected(tab, selectedTabName) {
    $('#order_list_tabs .tab').each(function() {
        $(this).removeClass("selected");
    });
    
    $(tab).addClass("selected");
    
    $('#order_list_container').html($('#' + selectedTabName + "_content").html());
    
    setDatePickers();
}

function loadFirstTab() {
    //set the inital menu page selected to be the first
    $('#order_list_tabs .tab').first().click();
}

function orderSelected(orderId, is_void) {
    $('#admin_order_list_till_roll').html("Loading...");
    
    initReopenOrderButton(is_void);
    
    $.ajax({
        type: 'GET',
        url: '/admin/orders/previous_order.js',
        data: {
            id : orderId
        }
    });
}

function parsePreviousOrder(previousOrderJSON) {
    totalOrder = previousOrderJSON;
    
    var voidOrderInfoHTML = "";
    
    if(previousOrderJSON.replacement_for_order_id) {
        voidOrderInfoHTML += "<div class='replacement_for_link'>Replacement For Order " + previousOrderJSON.replacement_for_order_id + "</div>";
    } else if(previousOrderJSON.replacement_by_order_id) {
        voidOrderInfoHTML += "<div class='replaced_by_link'>Replaced By Order " + previousOrderJSON.replacement_by_order_id + "</div>";
    }
    
    voidOrderInfoHTML += clearHTML;
    
    $('#admin_order_list_till_roll').html(voidOrderInfoHTML + fetchFinalReceiptHTML());
}

function initReopenOrderButton(is_void) {
    if(is_void) {
        reOpenOrderItemHandler = function() {alert("Cannot re-open a void order!");};
    } else {
        reOpenOrderItemHandler = reOpenOrderItem;
    }
    
    return false;
}