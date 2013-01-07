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
    showLoadingDiv();
    $('#order_search').submit();
}

function addTerminalFilter(terminalId) {
    $('#search_terminal_id_equals').val(terminalId);
    showLoadingDiv();
    $('#order_search').submit();
}

function addServerFilter(server_nickname) {
    $('#search_employee_nickname_equals').val(server_nickname);
    showLoadingDiv();
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
    
    showLoadingDiv();
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
    
    $('#order_list_container .order_content').hide();
    $('#' + selectedTabName + "_content").show();
    
    if(selectedTabName == "open_orders") {
        window.history.pushState(null, "Open Orders", "/admin/orders?section=open_orders");
        $('#admin_order_list_receipt_header').html("Open Order");
    } else if(selectedTabName == "closed_orders") {
        window.history.pushState(null, "Open Orders", "/admin/orders?section=closed_orders");
        $('#admin_order_list_receipt_header').html("Closed Sale");
    }
    
    setDatePickers();
    
    setPreviousSaleReceipt("");
    $('#admin_order_list_total_value').html(currency(0));
    
    loadOpenOrders();
}

function loadFirstTab() {
    //set the inital menu page selected to be the first
    $('#order_list_tabs .tab').first().click();
}

function orderSelected(orderId, is_void) {
    setPreviousSaleReceipt("Loading...");
    
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
    } 
    
    if(previousOrderJSON.replacement_by_order_id) {
        voidOrderInfoHTML += "<div class='replaced_by_link'>Replaced By Order " + previousOrderJSON.replacement_by_order_id + "</div>";
    }
    
    voidOrderInfoHTML += clearHTML;
    
    setPreviousSaleReceipt(voidOrderInfoHTML + fetchFinalReceiptHTML(false, true, printVatReceipt, false));
    
    //enable the "re-open order" button
    $('#continue_order_button').hide();
    $('#reopen_order_button').show();
    $('#print_order_button').show();
    
    $('#total_container div#label').html("Total:");
    $('#admin_order_list_total_value').html(currency(totalOrder.totalFinal + totalOrder.cashback));
}

function initReopenOrderButton(is_void) {
    if(is_void) {
        reOpenOrderHandler = function() {
            setStatusMessage("Cannot re-open a void order");
        };
    } else {
        reOpenOrderHandler = reOpenOrder;
    }
    
    return false;
}

var openOrdersTableFilter = "";
var openOrdersServerFilter = "";

function loadOpenOrders() {
    //only do so if the first few orders have been loaded
    if(!callHomePollInitSequenceComplete) {
        return;
    }
    
    //clear the table rows
    $('#order_list_container').find('table.open_order_list > tbody:last').empty();
    
    var table = $('#order_list_container').find('table.open_order_list > tbody:last');
    
    var date;
    var orderNum;
    var tableLabel;
    var server;
    var amount;
    
    for(var table_id in tables) {
        if(table_id == "0") continue;
        
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
            
            rowData = "<tr data-order_num='" + order.order_num + "'>";
            rowData += "<td class='first'><a href='#' onclick='loadOpenTableOrder(" + table_id + ")'>" + date + "</a></td>";
            rowData += '<td>' + orderNum + '</td>';
            rowData += '<td>' + tableLabel + '</td>';
            rowData += '<td>' + server + '</td>';
            rowData += "<td class='last'>" + currency(amount) + "</td></tr>";
            
            var tableRows = $('#order_list_container').find('table.open_order_list > tbody tr');
            
            var insertAtEnd = true;
           
            //order the rows by order start time
            tableRows.each(function() {
                if(insertAtEnd) {
                    if(parseInt(order.order_num) > parseInt($(this).data("order_num"))) {
                        $(rowData).insertBefore($(this));
                        insertAtEnd = false;
                    }
                }
            });
                
            if(insertAtEnd) {
                $('#order_list_container').find('table.open_order_list > tbody:last').append(rowData);
            }
        }
    }
    
    tableRows = $('#order_list_container').find('table.open_order_list > tbody tr');
    
    var oddRow = false;
    
    //set the odd rows
    tableRows.each(function(){
        if(oddRow) {
            $(this).addClass("odd");
        }
        
        oddRow = !oddRow;
    });
    
    //add a "no open orders message if needed"
    if($('#order_list_container').find('table.open_order_list > tbody:last tr').length == 0) {
        rowData = "<tr><td colspan='5' id='no_orders_message'>No Open Orders!</td></tr>";
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
    
    var orderHTML = fetchPreviousSalesReceiptHeaderHTML(totalOrder);
    
    orderHTML += getAllOrderItemsReceiptHTML(currentSelectedOpenTableOrder, false, false, true, false);
    
    setPreviousSaleReceipt(orderHTML);
    
    $('#total_container div#label').html("Sub-Total:");
    $('#admin_order_list_total_value').html(currency(currentSelectedOpenTableOrder.total));
    
    //enable the "continue order" button
    $('#continue_order_button').show();
    $('#reopen_order_button').hide();
    $('#print_order_button').hide();
}

function setPreviousSaleReceipt(theHTML) {
    $('#admin_order_list_till_roll').html(theHTML);
    
    setTimeout(function() {
        updateRecpt("admin_order_list_")
    }, 500);
}

function continueOrder() {
    storeLastReceipt(current_user_id, currentSelectedOpenTableID);
    
    //now go to the menu screen
    goTo('/home#screen=menu');
}

function fetchPreviousSalesReceiptHeaderHTML(order) {
    headerHTML = "<div class='data_table'>";
    
    server = firstServerNickname(order);
    
    if(server) {
        headerHTML += "<div class='label'>Server:</div><div class='data'>" + server + "</div>" + clearHTML;
    }
    
    timestamp = utilFormatDate(new Date(parseInt(orderStartTime(order))));
    
    headerHTML += "<div class='time label'>Start Time:</div><div class='time data'>" + timestamp + "</div>" + clearHTML;
    
    if(totalOrder.table) {
        headerHTML += "<div class='label'>Table:</div><div class='data'>" + totalOrder.table + "</div>" + clearHTML;
    }
    
    orderNum = totalOrder.order_num;
        
    headerHTML += "<div class='label'>Order Number:</div><div class='data'>" + orderNum + "</div>" + clearHTML;
    
    headerHTML += "</div>";
    
    return headerHTML;
}

function printPreviousSale() {
    if(!totalOrder) {
        setStatusMessage("Please select a closed order to print");
        return;
    }
    
    printReceiptHTML = fetchFinalReceiptHTML(true, false, printVatReceipt, printSummaryReceipt);
    printReceipt(printReceiptHTML, true);
}