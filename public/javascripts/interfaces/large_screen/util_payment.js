var utilPaymentInProgress = false;

var currentPaymentCustomerId = null;
var currentPaymentReceiptHTML = null;

function makeCustomerPayment(customerId) {
    if(!appOnline) {
        niceAlert("Cannot contact server to make payment");
        return;
    }
    
    var customer = creditCustomers[customerId];
    
    if(!customer) {
        niceAlert("This customer is not registered for accounts!");
        return;
    }
    
    var currentBalance = customer.current_balance;
    
    currentPaymentCustomerId = customerId;
    
    var callback = function() {
        var paymentAmount = utilPaymentResponse.amount;
        var amountTendered = utilPaymentResponse.amount_tendered;
        var cardCharged = utilPaymentResponse.card_charged;
        
        var allowCreditCustomer = $('#util_payment_set_allow_credit_customer').is(':checked');
        
        if(allowCreditCustomer) {
            paymentAmount = amountTendered;
        }
        
        console.log("Processed payment for " + currency(paymentAmount));
        
        //build receipt
        currentPaymentReceiptHTML = "";
        currentPaymentReceiptHTML += fetchBusinessInfoHeaderHTML() + clear10HTML;
        
        currentPaymentReceiptHTML += "<div class='data_table_header'>ACCOUNT PAYMENT</div>" + clear10HTML;
        
        currentPaymentReceiptHTML += "<div class='data_table'>";
        
        var timestamp = utilFormatDate(new Date(clueyTimestamp()));
        currentPaymentReceiptHTML += "<div class='label'>Date:</div><div class='data'>" + timestamp + "</div>" + clearHTML;
    
        currentPaymentReceiptHTML += "<div class='label'>Terminal:</div><div class='data'>" + terminalID + "</div>" + clearHTML;
    
        currentPaymentReceiptHTML += "<div class='label'>Served By:</div><div class='data'>" + current_user_nickname + "</div>" + clearHTML;
    
        var accountNo = creditCustomers[currentPaymentCustomerId].account_number;
        currentPaymentReceiptHTML += "<div class='label'>Account No:</div><div class='data'>" + accountNo + "</div>" + clearHTML;
        
        currentPaymentReceiptHTML += "</div>" + clearHTML;
    
        currentPaymentReceiptHTML += "<div class='data_table'>";
        
        var previousBalance = currentBalance;
        var newBalance = previousBalance - paymentAmount;
        
        currentPaymentReceiptHTML += "<div class='label'>Previous Balance:</div><div class='data'>" + currencyBalance(previousBalance) + "</div>" + clearHTML;
        currentPaymentReceiptHTML += "<div class='label bold'>Paid " + utilScreenPaymentMethod + ":</div><div class='data bold'>" + currency(paymentAmount) + "</div>" + clearHTML;
        currentPaymentReceiptHTML += "<div class='label'>Outstanding:</div><div class='data'>" + currencyBalance(newBalance) + "</div>" + clearHTML;
        currentPaymentReceiptHTML += "</div>" + clearHTML;
    
        $.ajax({
            type: 'POST',
            url: '/customer_payment',
            error: function() {
                setStatusMessage("Error Sending Payment To Server", false, false);
            },
            success: function() {
                setStatusMessage("Payment successfully recorded.", false, false);
                showMenuScreen();
                
                printReceipt(currentPaymentReceiptHTML, true);
                currentPaymentReceiptHTML = "";
                
                //reload the customers as their points/credit may need updating
                reloadCustomers();
            },
            complete : function() {
                utilPaymentInProgress = false;
            },
            data: {
                customer_id : currentPaymentCustomerId,
                amount : paymentAmount,
                amount_tendered : amountTendered,
                payment_method : utilScreenPaymentMethod,
                card_charged : cardCharged,
                reference_number : currentCCReferenceNumber
            }
        });
        
        utilPaymentResponse = null;
    };
    
    var amount = currentBalance;
    
    if(amount < 0) {
        amount = 0;
    }
    
    var minAmount = 0;
    var maxAmount = -1;
    
    $('#util_payment_header').html("Customer Payment");
    
    var customerName = customer.name;
    
    var customerHTMLContent = "<div id='cutomer_payment_info_table'><div class='data_table'>";
    
    customerHTMLContent += "<div class='label bold'>Customer:</div>";
    customerHTMLContent += "<div class='data'>" + customerName + "</div>" + clearHTML;
    
    customerHTMLContent += "<div class='label bold'>Balance:</div>";
    customerHTMLContent += "<div class='data'>" + currencyBalance(currentBalance) + "</div>" + clearHTML;
    
    customerHTMLContent += "<div class='label bold'>Credit Account:</div>";
    customerHTMLContent += "<input type='checkbox' id='util_payment_set_allow_credit_customer'/>" + clearHTML;
    
    customerHTMLContent += "</div></div>" + clearHTML;
    
    startUtilPayment(amount, minAmount, maxAmount, callback, customerHTMLContent);
    
    if(amount <= 0) {
        $("#util_payment_set_allow_credit_customer").attr("checked", true);
    } else {
        $("#util_payment_set_allow_credit_customer").attr("checked", false);
    }
}

var utilPaymentProcessedCallback = null;
var utilPaymentAmount = 0;
var utilPaymentMinAmount = 0;
var utilPaymentMaxAmount = 0;
var utilPaymentResponse = null;
var utilScreenPaymentMethod = null;
var utilPaymentCardCharged = false;

function startUtilPayment(amount, minAmount, maxAmount, callback, htmlContent) {
    utilPaymentAmount = amount;
    utilPaymentMinAmount = minAmount;
    utilPaymentMaxAmount = maxAmount;
    utilPaymentProcessedCallback = callback;
    
    utilPaymentResponse = {};
    utilPaymentCardCharged = false;
    currentCCReferenceNumber = null;
    
    utilScreenPaymentMethod = defaultPaymentMethod;
    utilPaymentScreenPaymentMethodSelected(getPaymentMethodId(defaultPaymentMethod));
    
    utilPaymentCashTenderedKeypadString = "";
    utilPaymentCashTendered = 0;
    
    $('#util_payment_total_value').html(currency(utilPaymentAmount));
    $('#util_payment_tendered_value').html(currency(0));
    $('#util_payment_balance_value').html(currency(utilPaymentAmount));
    
    $('#util_payment_content_container').html(htmlContent);
    
    showUtilPaymentScreen();
}

function cancelUtilPayment() {
    utilPaymentAmount = utilPaymentMinAmount = utilPaymentMaxAmount = utilPaymentProcessedCallback = null;
    showMenuScreen();
}

function finishUtilPayment() {
    if(utilPaymentInProgress) {
        niceAlert("There is a payment in progress, please wait!");
        return;
    }
    
    utilPaymentInProgress = true;
    niceAlert("Processing... Please Wait!");
    
    if(utilPaymentCashTendered == 0) {
        utilPaymentExactAmountSelected();
    }
    
    utilPaymentResponse.card_charged = utilPaymentCardCharged;
    utilPaymentResponse.amount_tendered = utilPaymentCashTendered;
    
    utilPaymentResponse.amount = utilPaymentAmount;
    
    var doOpenCashDrawer = paymentMethods[getPaymentMethodId(utilScreenPaymentMethod)].open_cash_drawer;
    
    if(doOpenCashDrawer) {
        openCashDrawer();
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
    
    if((utilPaymentCashTendered > utilPaymentMaxAmount) && utilPaymentMaxAmount != -1) {
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

function utilPaymentScreenChargeCreditCard() {
    creditCardChargeCallback = utilPaymentScreenCreditCardChargeCallback;
    
    if(cardChargeInProgress) {
        niceAlert("There is already a card charge in progress, please wait");
        return;
    }
    
    var amount = utilPaymentCashTendered;
    
    if(amount == 0) {
        utilPaymentExactAmountSelected()
        amount = utilPaymentCashTendered;
        
        if(amount == 0) {
            niceAlert("You cannot send a zero amount to card terminal");
            return;
        }
    }
    
    cardChargeInProgress = true;
    
    chargeCreditCard(amount);
}

function utilPaymentScreenCreditCardChargeCallback(creditCardChargeResponseCode, errorMessage) {
    //1 means success
    //2 means declined
    //3 means retrieval canceled
    //4 means a timeout waiting for card
    //5 is an unknown response
    //6 means connection refused or other IO error
    //7 is a general error
    var message = "";
    
    if(creditCardChargeResponseCode == 1) {
        message = "Card successfully charged for " + currency(utilPaymentCashTendered);
        niceAlert(message);
        
        //tag the card charge on to the order so we can create a record in cc_txn table
        utilPaymentCardCharged = true;
        
        finishUtilPayment();
    } else if(creditCardChargeResponseCode == 2) {
        message = "Charge has been declined.";
        niceAlert(message);
    } else if(creditCardChargeResponseCode == 3) {
        message = "Card charge canceled.";
        niceAlert(message);
    } else if(creditCardChargeResponseCode == 4) {
        message = "Request timed out. Please try again.";
        niceAlert(message);
    } else if(creditCardChargeResponseCode == 5) {
        message = "Unknown response from card terminal.";
        niceAlert(message);
    } else if(creditCardChargeResponseCode == 6) {
        message = "Communication Error, please make sure the credit card terminal is not in use and all settings are set correctly.";
        niceAlert(message);
    } else {
        //unknown error
        if(errorMessage != null) {
            message = "Error: " + errorMessage;
        } else {
            message = "An unknown error occured.";
        }
        
        niceAlert(message);
    }
    
    //reset callback
    creditCardChargeCallback = null;
}