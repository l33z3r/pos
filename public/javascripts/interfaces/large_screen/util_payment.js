var currentPaymentCustomerId = null;

function makeCustomerPayment(customerId) {
    currentPaymentCustomerId = customerId;
    
    var customer = customers[customerId];
    
    var currentBalance = customer.current_balance;
    
    var callback = function() {
        var paymentAmount = utilPaymentResponse.amount;
        var amountTendered = utilPaymentResponse.amount_tendered;
        
        console.log("Processed payment for " + currency(paymentAmount));
        
        $.ajax({
            type: 'POST',
            url: '/customer_payment',
            error: function() {
                setStatusMessage("Error Sending Payment To Server", false, false);
            },
            success: function() {
                setStatusMessage("Payment successfully recorded.", false, false);                   
            },
            data: {
                customer_id : currentPaymentCustomerId,
                amount : paymentAmount,
                amount_tendered : amountTendered
            }
        });
        
        utilPaymentResponse = null;
    };
    
    var amount = currentBalance;
    
    var minAmount = 0;
    var maxAmount = currentBalance;
    
    startUtilPayment(amount, minAmount, maxAmount, callback);
}

var utilPaymentProcessedCallback = null;
var utilPaymentAmount = 0;
var utilPaymentMinAmount = 0;
var utilPaymentMaxAmount = 0;
var utilPaymentResponse = null;
var utilScreenPaymentMethod = null;

function startUtilPayment(amount, minAmount, maxAmount, callback) {
    utilPaymentAmount = amount;
    utilPaymentMinAmount = minAmount;
    utilPaymentMaxAmount = maxAmount;
    utilPaymentProcessedCallback = callback;
    
    utilPaymentResponse = {};
    
    utilScreenPaymentMethod = defaultPaymentMethod;
    utilPaymentScreenPaymentMethodSelected(getPaymentMethodId(defaultPaymentMethod));
    
    utilPaymentCashTenderedKeypadString = "";
    utilPaymentCashTendered = 0;
    
    $('#util_payment_total_value').html(currency(utilPaymentAmount));
    $('#util_payment_tendered_value').html(currency(0));
    $('#util_payment_balance_value').html(currency(utilPaymentAmount));
    
    showUtilPaymentScreen();
}

function cancelUtilPayment() {
    utilPaymentAmount = utilPaymentMinAmount = utilPaymentMaxAmount = utilPaymentProcessedCallback = null;
    showMenuScreen();
}

function finishUtilPayment() {
    if(utilPaymentCashTendered == 0) {
        utilPaymentExactAmountSelected();
    }
    
    utilPaymentResponse.amount_tendered = utilPaymentCashTendered;
    
    if(utilPaymentCashTendered < utilPaymentAmount) {
        paymentResponse.amount = utilPaymentCashTendered;
    } else {
        utilPaymentResponse.amount = utilPaymentAmount;
    }
    
    if(utilPaymentProcessedCallback) {
        utilPaymentProcessedCallback.call();
    }
}

var utilPaymentCashTenderedKeypadString = "";
var utilPaymentCashTendered = 0;

function utilPaymentScreenKeypadClick(val) {
    utilPaymentCashTenderedKeypadString += val;
    utilPaymentCashTendered = parseFloat(utilPaymentCashTenderedKeypadString/100.0);
    
    if(utilPaymentCashTendered > utilPaymentMaxAmount) {
        niceAlert("The maximum amount allowed for this payment is " + currency(utilPaymentMaxAmount));
        utilPaymentCashTendered = utilPaymentMaxAmount;
    }
    
    var balanceOutstanding = utilPaymentAmount - utilPaymentCashTendered;
    
    if(balanceOutstanding < 0) {
        balanceOutstanding = 0;
    }
    
    $('#util_payment_tendered_value').html(currency(utilPaymentCashTenderedKeypadString/100.0));
    $('#util_payment_balance_value').html(currency(balanceOutstanding));
}

function utilPaymentScreenKeypadClickCancel() {
    $('#util_payment_tendered_value').html(currency(0));
    $('#util_payment_balance_value').html(currency(utilPaymentAmount));
    utilPaymentCashTendered = 0;
    utilPaymentCashTenderedKeypadString = "";
}

function utilPaymentExactAmountSelected() {
    utilPaymentCashTendered = utilPaymentAmount;
    $('#util_payment_tendered_value').html(currency(utilPaymentCashTendered));
    $('#util_payment_balance_value').html(currency(0));
}

function utilPaymentScreenPaymentMethodSelected(pm_id) { 
    var pm_info = paymentMethods[pm_id];
    
    var method = pm_info.name;
    var custom_footer_id = pm_info.receipt_footer_id;
    
    utilScreenPaymentMethod = method;
    
    //highlight the button
    $('.util_payment_method_button').each(function() {
        $(this).removeClass('selected');
    });
    
    $(".button[id='" + method.replace(/ /g,"_") + "_util_payment_method_button']").addClass('selected');
    
    customFooterId = custom_footer_id;
}