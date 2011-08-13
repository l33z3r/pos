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
    
    $('#admin_order_list_till_roll').html("");
    $('#admin_order_list_total_value').html(currency(0));
    
    loadOpenOrders();
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
    
    $('#admin_order_list_till_roll').html(voidOrderInfoHTML + fetchFinalReceiptHTML(false, true));
    
    //enable the "re-open order" button
    $('#continue_order_button').hide();
    $('#reopen_order_button').show();
    
    $('#total_container div#label').html("Total:");
    $('#admin_order_list_total_value').html(currency(totalOrder.totalFinal));
}

function initReopenOrderButton(is_void_or_replacement) {
    if(is_void_or_replacement) {
        reOpenOrderHandler = function() {
            alert("Cannot re-open a void or replacement order!");
        };
    } else {
        reOpenOrderHandler = reOpenOrder;
    }
    
    return false;
}

var openOrdersTableFilter = "";
var openOrdersServerFilter = "";

function loadOpenOrders() {
    //clear the table rows
    $('#order_list_container').find('table.open_order_list > tbody:last').empty();
    
    var table = $('#order_list_container').find('table.open_order_list > tbody:last');
    
    var date;
    var orderNum;
    var tableLabel;
    var server;
    var amount;
    
    var oddRow = false;
    
    for(var table_id in tables) {
        getTableOrderFromStorage(current_user_id, table_id);
        
        var order = tableOrders[table_id];
        
        if(!orderEmpty(order)) {
            date = utilFormatDate(new Date(parseInt(orderStartTime(order))));
            orderNum = order.order_num;
            tableLabel = tables[table_id].label;
            
            server = firstServerNickname(order);
            
            if(openOrdersTableFilter.length > 0) {
                if(openOrdersTableFilter != tableLabel) {
                    continue;
                }
            }
            
            if(openOrdersServerFilter.length > 0) {
                if(openOrdersServerFilter != server) {
                    continue;
                }
            }
            
            amount = order.total;
            
            rowData = "<tr " + (oddRow ? "class='odd'" : "") + ">";
            rowData += "<td class='first'><a href='#' onclick='loadOpenTableOrder(" + table_id + ")'>" + date + "</a></td>";
            rowData += '<td>' + orderNum + '</td>';
            rowData += '<td>' + tableLabel + '</td>';
            rowData += '<td>' + server + '</td>';
            rowData += "<td class='last'>" + currency(amount) + "</td></tr>";
            
            table.append(rowData);
            
            oddRow = !oddRow;
        }
    }
    
    //add a "no open orders message if needed"
    if($('#order_list_container').find('table.open_order_list > tbody:last tr').length == 0) {
        rowData = "<tr><td colspan='5' align='center'>No Open Orders!</td></tr>";
        table.append(rowData);
    }
}

function setOpenOrdersTableFilter(filterTableLabel) {
    openOrdersTableFilter = filterTableLabel;
    loadOpenOrders();
}

function setOpenOrdersServerFilter(filterServer) {
    openOrdersServerFilter = filterServer;
    loadOpenOrders();
}

var currentSelectedOpenTableID;
var currentSelectedOpenTableOrder;

function loadOpenTableOrder(table_id) {
    currentSelectedOpenTableID = table_id;
    currentSelectedOpenTableOrder = totalOrder = tableOrders[table_id];
    
    var orderHTML = fetchFinalReceiptHeaderHTML();
    
    orderHTML += getAllOrderItemsReceiptHTML(currentSelectedOpenTableOrder, false, false, true);
    
    $('#admin_order_list_till_roll').html(orderHTML);
    
    $('#total_container div#label').html("Sub-Total:");
    $('#admin_order_list_total_value').html(currency(currentSelectedOpenTableOrder.total));
    
    //enable the "continue order" button
    $('#continue_order_button').show();
    $('#reopen_order_button').hide();
}

function continueOrder() {
    storeLastReceipt(current_user_id, currentSelectedOpenTableID);
    
    //now go to the menu screen
    goTo('/home#screen=menu');
}