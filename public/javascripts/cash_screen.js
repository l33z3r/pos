function takeTendered() {
    cashTendered = getTendered();

    if(cashTendered < currentTotalFinal) {
        alert("Must enter a higher value than current total: " + currency(currentTotalFinal));
        resetTendered();
        return;
    }

    //calculate change and show the finish sale button
    change = cashTendered - currentTotalFinal;
    $('#totals_change_value').html(number_to_currency(change, {
        precision : 2
    }));

    $('#tendered_button').hide();
    $('#finish_sale_button').show();
}

function paymentMethodSelected() {
    alert("Payment Method Selected");
}

function totalsScreenKeypadClick(val) {
    $('#totals_tendered_value').html($('#totals_tendered_value').html() + val);
}

function totalsScreenKeypadClickDecimal() {
    $('#totals_tendered_value').html($('#totals_tendered_value').html() + ".");
}

function totalsScreenKeypadClickCancel() {
    oldVal = $('#totals_tendered_value').html();
    newVal = oldVal.substring(0, oldVal.length - 1);
    
    $('#totals_tendered_value').html(newVal);
}
