//this needs to be called before pageload
var jQT = $.jQTouch({});

var terminalRecptInfoPage = "terminal_recpt_info";

$(function(){
    initMobile();
});

function initMobile() {
    if(current_user_id == null) {
        clearMobileLoginCode();
        showMobileLoginScreen();
    } else {
        showMobileMenuScreen();
    }
    
    $('#terminal_list').bind('pageAnimationEnd', function(event, info){
        if (info.direction == 'in') {
            stopTerminalRecptPoll = true;
        }
    });
    
    $('#server_list').bind('pageAnimationEnd', function(event, info){
        if (info.direction == 'in') {
            stopServerRecptPoll = true;
        }
    });
    
    $('#table_list').bind('pageAnimationEnd', function(event, info){
        if (info.direction == 'in') {
            stopTableRecptPoll = true;
        } 
        //update the list of tables
        renderMobileActiveTableList();
    });
    
    $('#terminal_info_screen').bind('pageAnimationEnd', function(event, info){
        if (info.direction == 'in') {
            data = $(this).data('referrer').data("params");
            data = $.parseQuery(data);
        
            var terminal_id = data.terminal_id;
        
            initTerminalRecptInfoPage(terminal_id);
        }
    });
    
    $('#server_info_screen').bind('pageAnimationEnd', function(event, info){
        if (info.direction == 'in') {
            data = $(this).data('referrer').data("params");
            data = $.parseQuery(data);
        
            var server_id = data.server_id;
        
            initServerRecptInfoPage(server_id);
        }
    });
    
    $('#table_info_screen').bind('pageAnimationEnd', function(event, info){
        if (info.direction == 'in') {
            data = $(this).data('referrer').data("params");
            data = $.parseQuery(data);
        
            var table_label = data.table_label;
        
            initTableRecptInfoPage(table_label);
        }
    });
    
    //limit the list of tables to ones that only contain open orders
    renderMobileActiveTableList();
}

function initTerminalRecptInfoPage(terminal_id) {
    $('#terminal_info_screen .terminal_id').html(terminal_id);
    mobileTerminalRecptScroll();
    
    currentTerminalId = terminal_id;
    stopTerminalRecptPoll = false;
    
    clearTerminalRecpt();
    terminalRecptPoll();
}

var stopTerminalRecptPoll = false;
var terminalRecptPollingAmount = 1000;
var currentTerminalId = null;

function terminalRecptPoll() {
    $.ajax({
        type: 'GET',
        url: '/last_receipt_for_terminal.js',
        dataType: 'script',
        success: terminalRecptPollComplete,
        error: function() {
            setTimeout(terminalRecptPoll, 5000);
        },
        data: {
            terminal_id : currentTerminalId
        }
    });
}

function terminalRecptPollComplete() {
    if(!stopTerminalRecptPoll) {
        setTimeout(terminalRecptPoll, terminalRecptPollingAmount);
    }
}

function initServerRecptInfoPage(server_id) {
    $('#server_info_screen .server_id').html(server_id);
    mobileServerRecptScroll();
    
    currentServerId = server_id;
    stopServerRecptPoll = false;
    
    clearServerRecpt();
    serverRecptPoll();
}

var stopServerRecptPoll = false;
var serverRecptPollingAmount = 1000;
var currentServerId = null;

function serverRecptPoll() {
    $.ajax({
        type: 'GET',
        url: '/last_receipt_for_server.js',
        dataType: 'script',
        success: serverRecptPollComplete,
        error: function() {
            setTimeout(serverRecptPoll, 5000);
        },
        data: {
            server_id : currentServerId
        }
    });
}

function serverRecptPollComplete() {
    if(!stopServerRecptPoll) {
        setTimeout(serverRecptPoll, serverRecptPollingAmount);
    }
}

function initTableRecptInfoPage(table_label) {
    $('#table_info_screen .table_label').html(table_label);
    mobileTableRecptScroll();
    
    currentSelectedTableLabel = table_label;
    stopTableRecptPoll = false;
    
    clearTableRecpt();
    tableRecptPoll();
}

var stopTableRecptPoll = false;
var tableRecptPollingAmount = 1000;
var currentSelectedTableLabel = null;

function tableRecptPoll() {
    $.ajax({
        type: 'GET',
        url: '/last_receipt_for_table.js',
        dataType: 'script',
        success: tableRecptPollComplete,
        error: function() {
            setTimeout(tableRecptPoll, 5000);
        },
        data: {
            table_label : currentSelectedTableLabel
        }
    });
}

function tableRecptPollComplete() {
    if(!stopTableRecptPoll) {
        setTimeout(tableRecptPoll, tableRecptPollingAmount);
    }
}