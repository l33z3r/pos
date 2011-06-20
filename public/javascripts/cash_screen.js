function takeTendered() {
    cashTendered = getTendered();

    if(cashTendered < currentTotalFinal) {
        alert("Must enter a higher value than current total: " + currency(currentTotalFinal));
        resetTendered();
        return;
    }

    //calculate change and show the finish sale button
    change = cashTendered - currentTotalFinal;
    $('#totals_change_value').html(currency(change, false));

    $('#tendered_button').hide();
    $('#finish_sale_button').show();
}

function getTendered() {
    return $('#totals_tendered_value').html();
}

function resetTendered() {
    $('#totals_tendered_value').html("")
    $('#finish_sale_button').hide();
    $('#tendered_button').show();
    $('#totals_change_value').html("");
}

function takeTenderedCancel() {
    showMenuScreen();
}

function paymentMethodSelected(method) {
    paymentMethod = method;
    $('#selected_payment_method_holder').html(paymentMethod);
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

function moneySelected(amount) {
    $('#finish_sale_button').hide();
    $('#tendered_button').show();
    $('#totals_change_value').html(0);
    
    if(amount == -1) {
        newAmount = currentTotalFinal;
    } else {
        //add to amount tendered
        currentAmount = $('#totals_tendered_value').html();
    
        if(currentAmount.length == 0) {
            currentAmount = 0;
        }
        
        currentAmount = parseFloat(currentAmount);
    
        newAmount = parseInt(amount) + currentAmount;
    }
    
    newAmount = roundNumberUp(newAmount, 2);
    
    $('#totals_tendered_value').html(newAmount);
}