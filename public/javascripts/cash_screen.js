function takeTendered() {
    cashTendered = getTendered();

    totalAmountInclCashback = currentTotalFinal + cashback;

    if(cashTendered < totalAmountInclCashback) {
        alert("Must enter a higher value than current total: " + currency(totalAmountInclCashback));
        resetTendered();
        return;
    }

    //calculate change and show the finish sale button
    change = cashTendered - totalAmountInclCashback;
    $('#totals_change_value').html(currency(change, false));

    $('#tendered_button').hide();
    $('#finish_sale_button').show();
}

function getTendered() {
    var val = $('#totals_tendered_value').html();
    
    if(val.length > 0) {
        if(isNaN(parseFloat(val))) {
            val = 0;
        }
        
        val = currency(val, false);
        $('#totals_tendered_value').html(val);
    }
    
    return val;
}

function resetTendered() {
    $('#totals_tendered_value').html("")
    $('#finish_sale_button').hide();
    $('#tendered_button').show();
    $('#totals_change_value').html("");
}

function takeTenderedCancel() {
    resetTendered();
    showMenuScreen();
}

function paymentMethodSelected(method) {
    paymentMethod = method;
    $('#selected_payment_method_holder').html(paymentMethod);
    
    //highlight the button
    $('.payment_method_button').each(function() {$(this).removeClass('selected');});
    
    $('#' + method.replace(/ /g,"_") + '_payment_method_button').addClass('selected');
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
        totalAmountInclCashback = currentTotalFinal + cashback;
        newAmount = totalAmountInclCashback;
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

function togglePrintReceipt() {
    $.ajax({
        type: 'POST',
        url: '/admin/toggle_print_receipt.js'
    });
}