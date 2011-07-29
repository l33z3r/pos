$(function() {
    setDatePickers();
    loadFirstTab();
    loadOpenOrders();
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

var reOpenOrderHandler;

function doReopenOrder() {
    reOpenOrderHandler();
}

function reOpenOrder() {
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
    
    //enable the "re-open order" button
    $('#continue_order_button').hide();
    $('#reopen_order_button').show();
}

function initReopenOrderButton(is_void) {
    if(is_void) {
        reOpenOrderHandler = function() {
            alert("Cannot re-open a void order!");
        };
    } else {
        reOpenOrderHandler = reOpenOrder;
    }
    
    return false;
}

function loadOpenOrders() {
    var table = $('table#open_order_list > tbody:last');
    
    var date;
    var orderNum;
    var tableLabel;
    var server;
    var amount;
    
    var oddRow = true;
    
    for(var table_id in tables) {
        getTableOrderFromStorage(current_user_id, table_id);
        
        var order = tableOrders[table_id];
        
        if(!orderEmpty(order)) {
            date = orderStartTime(order);
            orderNum = order.order_num;
            tableLabel = tables[table_id].label;
            server = employees[firstServerID(order)].nickname;
            amount = order.total;
            
            rowData = "<tr " + (oddRow ? "class='odd'" : "") + ">";
            rowData += "<td class='first'><a href='#' onclick='loadClosedTableOrder(" + table_id + ")'>" + date + "</a></td>";
            rowData += '<td>' + orderNum + '</td>';
            rowData += '<td>' + tableLabel + '</td>';
            rowData += '<td>' + server + '</td>';
            rowData += "<td class='last'>" + currency(amount) + "</td><tr>";
            rowData += '<tr>';
    
            table.append(rowData);
        }
        
        oddRow = !oddRow;
    }
}

var currentSelectedClosedTableID;
var currentSelectedClosedTableOrder;

function loadClosedTableOrder(table_id) {
    currentSelectedClosedTableID = table_id;
    currentSelectedClosedTableOrder = tableOrders[table_id];
    
    var orderHTML = getAllOrderItemsReceiptHTML(currentSelectedClosedTableOrder, false, false);
    $('#admin_order_list_till_roll').html(orderHTML);
    
    $('#total_container div#label').html("Sub-Total:");
    $('#admin_order_list_total_value').html(currency(currentSelectedClosedTableOrder.total));
    
    //enable the "continue order" button
    $('#continue_order_button').show();
    $('#reopen_order_button').hide();
}

function continueOrder() {
    storeLastReceipt(current_user_id, currentSelectedClosedTableID);
    
    //now go to the menu screen
    goTo('/home#screen=menu');
}