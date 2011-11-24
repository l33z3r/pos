function takeTendered() {
    cashTendered = getTendered();

    totalAmountInclCashback = currentTotalFinal + cashback;

    //calculate change and show the finish sale button
    change = cashTendered - totalAmountInclCashback;
    
    //as we calculate change dynamically, it could be negative while
    //it is being entered, so we must stop that
    if(change < 0) {
        change = 0;
    }
    
    $('#totals_change_value').html(currency(change, false));
}

var cashTendered;

function getTendered() {
    var val = cashTendered;    
    
    if(isNaN(parseFloat(val))) {
        val = 0;
    }
        
    if(val > 0) {
        var formattedVal = currency(val, false);
        $('#totals_tendered_value').html(formattedVal);
    }
    
    return val;
}

function finishSale() {
    cashTendered = getTendered();

    totalAmountInclCashback = roundNumber(currentTotalFinal + cashback, 2);

    if(cashTendered == 0 && (totalAmountInclCashback > 0)) {
        //auto fill to exact amount 
        moneySelected(-1);
        finishSale();
        return;
    } else if(cashTendered < totalAmountInclCashback) {
        setStatusMessage("Must enter a higher value than current total: " + currency(totalAmountInclCashback), true, true);
        resetTendered();
        return;
    }
    
    doTotalFinal();
}

function resetTendered() {
    cashTendered = 0;
    cashTenderedKeypadString = "";
    takeTendered();
}

function cashOutCancel() {
    resetTendered();
    showMenuScreen();
}

function paymentMethodSelected(method) {
    paymentMethod = method;
    $('#selected_payment_method_holder').html(paymentMethod);
    
    //highlight the button
    $('.payment_method_button').each(function() {
        $(this).removeClass('selected');
    });
    
    $('#' + method.replace(/ /g,"_") + '_payment_method_button').addClass('selected');
}

var cashTenderedKeypadString = "";

function totalsScreenKeypadClick(val) {
    //make sure you cannot enter a 3rd decimal place number
    if(cashTenderedKeypadString.indexOf(".") != -1) {
        if(cashTenderedKeypadString.length - cashTenderedKeypadString.indexOf(".") > 3) {
            return;
        }
    }
    
    cashTenderedKeypadString += val;
    cashTendered = parseFloat(cashTenderedKeypadString);
    takeTendered();
}

function totalsScreenKeypadClickDecimal() {
    if(cashTenderedKeypadString.indexOf(".") == -1) {
        cashTenderedKeypadString += ".";
    }
}

function totalsScreenKeypadClickCancel() {
    $('#totals_tendered_value').html(currency(0, false));
    resetTendered();
}

function moneySelected(amount) {
    $('#totals_change_value').html(currency(0, false));
    
    if(amount == -1) {
        totalAmountInclCashback = currentTotalFinal + cashback;
        newAmount = totalAmountInclCashback;
    } else {
        //add to amount tendered
        currentAmount = cashTendered;
    
        if(currentAmount.length == 0) {
            currentAmount = 0;
        }
        
        currentAmount = parseFloat(currentAmount);
    
        newAmount = parseInt(amount) + currentAmount;
    }
    
    newAmount = roundNumber(newAmount, 2);
    
    cashTenderedKeypadString = "" + newAmount;
    cashTendered = newAmount;
    takeTendered();
}

function togglePrintReceipt() {
    $.ajax({
        type: 'POST',
        url: '/admin/toggle_print_receipt.js'
    });
}