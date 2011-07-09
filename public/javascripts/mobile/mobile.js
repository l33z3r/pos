//this needs to be called before pageload
var jQT = $.jQTouch({});

var terminalRecptInfoPage = "terminal_recpt_info";

function initMobile() {
    showMobileScreen();
    
    $('#terminal_info_screen').bind('pageAnimationEnd', function(event, info){
        //alert("click finish");
        
        data = $(this).data('referrer').data("params");
        data = $.parseQuery(data);
        
        var terminal_id = data.terminal_id;
        //alert("Got Terminal Id from Data: " + terminal_id + " Data: " + data);
    
        initTerminalRecptInfoPage(terminal_id);
    });
}

function initTerminalRecptInfoPage(terminal_id) {
    //alert("Polling for terminal " + terminal_id);
    
    $('#terminal_info_screen .terminal_id').html(terminal_id);
    mobileRecptScroll();
    
    currentTerminalId = terminal_id;
    terminalRecptPoll();
}

var stopTerminalRecptPoll = false;
var terminalRecptPollingAmount = 1000;
var currentTerminalId = null;

function terminalRecptPoll() {
    //alert("Poll");
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