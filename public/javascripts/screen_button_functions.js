function doXTotal() {
    doCashTotalReport("X");
}

function doZTotal() {
    doCashTotalReport("Z");
}

function doCashTotalReport(total_type) {
    $.ajax({
        type: 'POST',
        url: '/cash_total.js',
        data: {
            total_type : total_type
        }
    });
}

function showTablesScreen() {
    $('#table_select_screen').show();
    $('#menu_screen').hide();
    initTableSelectScreen();
}