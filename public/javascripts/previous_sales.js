$(function() {
    setDatePickers();
    loadFirstTab();
});

function setDatePickers() {
    $('#order_list_container').find('#date_from').datepicker({
        dateFormat: 'dd-mm-yy',
        onSelect: function(dateText, inst) { 
            $('#search_created_at_gte').val(dateText);
            $('#order_search').submit();
        }
    });
    
    $('#order_list_container').find('#date_to').datepicker({
        dateFormat: 'dd-mm-yy',
        onSelect: function(dateText, inst) { 
            $('#search_created_at_lte').val(dateText);
            $('#order_search').submit();
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
    
    $('#search_created_at_gte').val(todayDate);
    $('#search_created_at_lte').val(todayDate);
    $('#date_from').val(todayDate);
    $('#date_to').val(todayDate);
    $('#order_search').submit();
}

function doVoidOrderItem() {
    alert("Void clicked!");
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

function orderSelected(orderId) {
    $.ajax({
        type: 'GET',
        url: '/admin/orders/previous_order.js',
        data: {
            id : orderId
        }
    });
}

function parsePreviousOrder(previousOrderJSON) {
    writePreviousOrderToRecpt(previousOrderJSON.order.total);
}

function writePreviousOrderToRecpt(amount) {
    $('#admin_order_list_till_roll').html(amount);
    adminOrderListRecptScroll();
}