var currentCCReferenceNumber;

var splitPayments;

var cashScreenRefundMode = false;

//if a card transasction goes through, you should not be able to cancel the sale
var disallowCancelSaleCC = false;

function updateTotalTendered() {
    var totalCashTendered = getTotalTendered();

    if(isNaN(parseFloat(totalCashTendered))) {
        totalCashTendered = 0;
    }
        
    var formattedVal = currency(totalCashTendered, false);
    $('#totals_tendered_value').html(formattedVal);
    
    //make the text bigger if > 0 
    if(totalCashTendered > 0) {
        $('#totals_tendered_box').css("font-size", "15px");
        $('#totals_tendered_box').css("font-weight", "bold");
    } else {
        $('#totals_tendered_box').css("font-size", "12px");
        $('#totals_tendered_box').css("font-weight", "normal");
    }
    
    totalAmountInclCashback = currentTotalFinal + cashback;

    //calculate change and show the finish sale button
    if(totalAmountInclCashback > 0) {
        change = totalCashTendered - totalAmountInclCashback;
    } else {
        change = 0;
    }
    
    //as we calculate change dynamically, it could be negative while
    //it is being entered, so we must stop that
    if(change < 0) {
        $('#totals_change_container').hide();
        $('#totals_balance_container').show();
        $('#totals_balance_value').html(currency(Math.abs(change), false));
    } else {
        $('#totals_balance_container').hide();
        $('#totals_change_container').show();
        $('#totals_change_value').html(currency(change, false));
    }
}

var cashTendered;

function getTotalTendered() {
    var totalTendered = 0;
    
    for(pm in splitPayments) {
        totalTendered += splitPayments[pm];
    }
    
    return roundNumber(totalTendered, 2);
}

function finishSale() {
    updateTotalTendered();
    
    if(paymentIntegrationId != 0) {
        if(paymentIntegrationId == zalionPaymentIntegrationId) {
            //make sure we have set the variables to be able to charge the room
            if(!selectedRoomNumber || !selectedFolioNumber || !selectedFolioName) {
                niceAlert("You must select a guest to charge this bill to");
                return;
            }
        }
    }
    
    cashTendered = getTotalTendered();

    totalAmountInclCashback = roundNumber(currentTotalFinal + cashback, 2);

    if(cashScreenRefundMode) {
        cashTendered = totalAmountInclCashback;
        splitPayments[paymentMethod] = totalAmountInclCashback;
    } else {
        if(cashTendered < totalAmountInclCashback) {
            if(loyaltyPaymentMethodSelected) {
                niceAlert("Not enough loyalty points to cover the whole sale! Other payment methods must be used to cover the difference.");
                return;
            }
        
            //auto fill to exact amount 
            moneySelected(-1);
            finishSale();
            return;
        }
        
        //make sure that you cannot have any change if there is no cash in the split payments array
        if(cashTendered > totalAmountInclCashback) {
            var positiveCashAmount = false;
        
            var totalCashAmount = 0;
        
            for(pm in splitPayments) {
                if(pm.toLowerCase() == cashPaymentMethodName && parseFloat(splitPayments[pm]) > 0) {
                    positiveCashAmount = true;
                    totalCashAmount = parseFloat(splitPayments[pm]);
                    break;
                }
            }
        
            if(!positiveCashAmount) {
                niceAlert("You cannot enter an amount (" + currency(cashTendered) + ") above the total (" + currency(totalAmountInclCashback) + "), if you are not taking a cash payment, as you cannot issue change without cash.");
                return;
            }
        
            change = roundNumber(parseFloat(cashTendered - totalAmountInclCashback), 2);
        
            //make sure the change cannot be greater than the cash amount
            if(change >= totalCashAmount) {
                niceAlert("Change cannot be greater than or equal the cash amount!");
                return;
            }
        }
    }
    
    doTotalFinal();
}

function resetTendered() {
    cashTendered = 0;
    cashTenderedKeypadString = "";
}

function cashOutCancel() {
    if(disallowCancelSaleCC) {
        niceAlert("You cannot cancel this sale, as the card transaction has already been processed!");
        return;
    }
    
    resetLoyaltyCustomer();
    resetTendered();
    showMenuScreen();
}

var paymentIntegrationId = 0;
var currentZalionPaymentMethodName = null;

var loyaltyPaymentMethodSelected = false;
var accountPaymentMethodSelected = false;
var cashPaymentMethodSelected = false;

function paymentMethodSelected(pm_id) { 
    var pm_info = paymentMethods[pm_id];
    
    var method = pm_info.name;
    var integration_id = pm_info.payment_integration_id
    var custom_footer_id = pm_info.receipt_footer_id;
    
    //if the previously selected payment method had an integration, we want to popup a notice saying that it
    //must be the last payment method you select in order to actually do the integration
    //also check for other payment methods that do not allow for split payments
    if(paymentIntegrationId != 0 && splitPayments[paymentMethod] > 0) {
        splitPayments = {};
    } else if(accountPaymentMethodSelected && splitPayments[paymentMethod] > 0) {
        if(disallowCancelSaleCC) {
            niceAlert("You cannot charge to an account, as a card transaction has already been processed!");
            return;
        }
        
        //the accounts payment method cannot be used with split payments
        splitPayments = {};
        resetCustomerSelect();
    }
    
    loyaltyPaymentMethodSelected = (method == loyaltyPaymentMethodName);
    accountPaymentMethodSelected = (method == accountPaymentMethodName);
    cashPaymentMethodSelected = (method == cashPaymentMethodName);
    
    if(loyaltyPaymentMethodSelected) {
        if(cashScreenRefundMode) {
            setStatusMessage("Loyalty system cannot be used during a refund!", true, true);
            return;
        }
    
        if(!totalOrder.loyalty) {
            niceAlert("Please swipe the customers loyalty card first!");
            loyaltyPaymentMethodSelected = false;
            return;
        }
            
        //workout the outstanding amount
        totalAmountInclCashback = currentTotalFinal + cashback;
        var totalCashTendered = getTotalTendered();
        
        //take away the amount already paid in by this payment method
        if(splitPayments[loyaltyPaymentMethodName]) {
            totalCashTendered -= splitPayments[loyaltyPaymentMethodName];
        }
        
        var amountOutstanding = totalAmountInclCashback - totalCashTendered;
        
        var availablePoints = totalOrder.loyalty.points_available;
        
        var amountOutstandingInPoints = roundNumber(amountOutstanding * loyaltyPointsPerCurrencyUnit, 2);
        
        var pointsUsedInCurrencyPennies = 0;
        
        if(availablePoints <= 0) {
            niceAlert("This customer has no available loyalty points!");
            loyaltyPaymentMethodSelected = false;
            return;
        } else if(availablePoints < amountOutstandingInPoints) {
            niceAlert("Not have enough loyalty points to cover the whole sale!" + 
                " " + amountOutstandingInPoints + " points needed. Other payment methods must be used to cover the difference");
            var pointsUsed = availablePoints;
            pointsUsedInCurrencyPennies = (pointsUsed/loyaltyPointsPerCurrencyUnit) * 100;
        } else {
            niceAlert(amountOutstandingInPoints + " of this customers loyalty points will be used to cover this sale!");
            pointsUsedInCurrencyPennies = (amountOutstandingInPoints/loyaltyPointsPerCurrencyUnit) * 100;
        }
        
        //prepopulate the box with the amount of points and show an alert
        cashTenderedKeypadString = pointsUsedInCurrencyPennies;
        cashTendered = parseFloat(cashTenderedKeypadString/100.0);
    
        splitPayments[loyaltyPaymentMethodName] = cashTendered;
        $('#tendered_value').html(currency(cashTenderedKeypadString/100.0));
    } else if (accountPaymentMethodSelected) {
        splitPayments = {};
        
        resetLoyaltyCustomer();
        
        //workout the outstanding amount
        //and prepopulate the box with that amount
        totalAmountInclCashback = currentTotalFinal + cashback;        
        cashTendered = totalAmountInclCashback;    
        splitPayments[accountPaymentMethodName] = cashTendered;
        
        amountToChargeCustomer = totalAmountInclCashback;
        
        //show the accounts user selection box
        showCustomerSearchScreen();
    }
    
    updateTotalTendered();
    clearSelectedFolio();
    
    $('#charge_room_section').hide();
    setTenderedBoxFocus(true);
    
    paymentMethod = method;
    $('#selected_payment_method_holder').html(paymentMethod);
    
    //highlight the button
    $('.payment_method_button').each(function() {
        $(this).removeClass('selected');
    });
    
    $(".button[id='" + method.replace(/ /g,"_") + "_payment_method_button']").addClass('selected');
    
    paymentIntegrationId = integration_id;
    
    //check if the payment method is the charge room and do some magic
    if(paymentIntegrationId != 0) {
        
        totalAmountInclCashback = currentTotalFinal + cashback;
        
        if(paymentIntegrationId == zalionPaymentIntegrationId) {
            
            //reset the payment methods array 
            splitPayments = {};
            splitPayments[paymentMethod] = 0;
                
            moneySelected(-1);
            updateTotalTendered();
            
            //we have to store the string that represents the current zalion payment method, so that
            //we can retrieve the amount later that will be actually charged to the room
            currentZalionPaymentMethodName = paymentMethod;
            
            showLoadingDiv("Loading Zalion Data...");
            
            //fire off request to get contents of ROOMFILE
            var zalion_roomfile_request_url = 'http://' + zalionChargeRoomServiceIP + ':8080/ClueyWebSocketServices/zalion_roomfile';
            
            $.ajax({
                type: 'GET',
                url: '/forward_zalion_roomfile_request',
                error: function() {
                    hideLoadingDiv();
                    niceAlert("Error Getting Zalion Data.", false, false);                   
                    paymentMethodSelected(getPaymentMethodId(defaultPaymentMethod));
                    splitPayments = {};
                },
                data: {
                    zalion_roomfile_request_url : zalion_roomfile_request_url
                }
            });
        }
    }
    
    resetTendered();
    
    //lazy init
    if(!splitPayments[paymentMethod]) {
        splitPayments[paymentMethod] = 0;
    }
    
    cashTendered = splitPayments[paymentMethod];
    $('#tendered_value').html(currency(cashTendered));
    
    //set the custom footer id
    customFooterId = custom_footer_id;
}

var selectedRoomNumber = null;
var selectedFolioNumber = null;
var selectedFolioName = null;
var zalionChargedAmount = null;

function doRoomNumberLookup() {
    clearSelectedFolio();
    
    var roomNumber = $('#room_number_input').val();
    
    roomNumber = parseInt(roomNumber);
    
    if(isNaN(roomNumber)) {
        niceAlert("Please enter a valid room number.");
        return;
    }
    
    var roomInfo = clientRooms[roomNumber.toString()];
    
    if(roomInfo) {
        //alert("found room " + roomNumber);
        
        //build up a table of folios for this room
        var folioTableHTML = "<div class='name_header'>Guests in Room " + roomNumber + "</div>" + clearHTML;
        
        folioTableHTML += "<div class='folio_entries'>";
        
        for(var folioNumber in roomInfo) {
            //alert(roomInfo[folioNumber]["NAME"]);
            var folioName = roomInfo[folioNumber]["NAME"];
            var folioBalance = roomInfo[folioNumber]["BALANCE"];
            var folioCreditLimit = roomInfo[folioNumber]["CREDITLIMIT"];
            
            folioTableHTML += "<div id='folio_" + folioNumber + "' onclick=\"selectFolio(" + roomNumber + ", " + folioNumber + ", '" + folioName + "', "    + folioBalance + ", " + folioCreditLimit + ");\" class='entry'>";
            folioTableHTML += "<div class='number'>" + folioNumber + "</div>";
            folioTableHTML += "<div class='name'>" + folioName + "</div>";
            folioTableHTML += "<div class='balance'>Bal: " + currency(folioBalance) + "</div>";
            folioTableHTML += "</div>" + clearHTML;
        }
    
        folioTableHTML += "</div>" + clearHTML;
        
        $('#name_list').html(folioTableHTML);
    } else {
        niceAlert("Room " + roomNumber + " not found.");
        totalsScreenKeypadClickCancel();
        return;
    }
}

function selectFolio(roomNumber, folioNumber, folioName, folioBalance, folioCreditLimit) {
    clearSelectedFolio();
    $('#name_list .entry').removeClass("selected");
    
    folioBalance = parseFloat(folioBalance);
    folioCreditLimit = parseFloat(folioCreditLimit);
    
    if(folioBalance >= folioCreditLimit) {
        niceAlert("This guests credit limit of " + currency(folioCreditLimit) + " has been exceeded");
        return;
    }
    
    $('#folio_' + folioNumber).addClass("selected");
    
    setTenderedBoxFocus(true);
    
    selectedRoomNumber = roomNumber;
    selectedFolioNumber = folioNumber;
    selectedFolioName = folioName;
}

function clearSelectedFolio() {
    //reset vars
    selectedRoomNumber = null;
    selectedFolioNumber = null;
    selectedFolioName = null;
}

function setTenderedBoxFocus(focus) {
    if(focus) {
        roomNumberInputFocus = false;
        $('#tendered_box').addClass("selected");
    } else {
        roomNumberInputFocus = true;
        $('#tendered_box').removeClass("selected");
    }
}

var cashTenderedKeypadString = "";
var roomNumberInputFocus = false;

function totalsScreenKeypadClick(val) {
    if(loyaltyPaymentMethodSelected || accountPaymentMethodSelected) {
        return;
    }
    
    if(roomNumberInputFocus) {
        $('#room_number_input').val($('#room_number_input').val() + val);
        return;
    }
    
    if(cashScreenRefundMode) {
        setStatusMessage("Currency cannot be added to a sale during a refund!", true, true);
        return;
    }
    
    cashTenderedKeypadString += val;
    cashTendered = parseFloat(cashTenderedKeypadString/100.0);
    //alert(splitPayments[paymentMethod] + " " + cashTendered);
    splitPayments[paymentMethod] = cashTendered;
    $('#tendered_value').html(currency(cashTenderedKeypadString/100.0));
}

function totalsScreenKeypadClickCancel() {
    if(loyaltyPaymentMethodSelected || accountPaymentMethodSelected) {
        return;
    }
    
    if(roomNumberInputFocus) {
        $('#room_number_input').val("");
        return;
    }
    
    $('#tendered_value').html(currency(0));
    splitPayments[paymentMethod] = 0;
    resetTendered();
}

function moneySelected(amount) {
    if(cashScreenRefundMode) {
        setStatusMessage("Currency cannot be added to a sale during a refund!", true, true);
        return;
    }
    
    if(loyaltyPaymentMethodSelected || accountPaymentMethodSelected) {
        return;
    }
    
    if(amount == -1) {
        totalAmountInclCashback = currentTotalFinal + cashback;
        
        var totalCashTendered = getTotalTendered();
        
        //take away the amount already paid in by this payment method
        totalCashTendered -= splitPayments[paymentMethod];
        
        newAmount = totalAmountInclCashback - totalCashTendered;
    } else {
        //add to amount tendered
        currentAmount = cashTendered;
    
        if(currentAmount.length == 0) {
            currentAmount = 0;
        }
        
        currentAmount = parseFloat(currentAmount);
    
        newAmount = parseInt(amount) + currentAmount;
    }
    
    //make sure it is a positive number
    if(newAmount < 0) {
        newAmount = 0;
    }
    
    newAmount = roundNumber(newAmount, 2);
    
    cashTendered = parseFloat(newAmount);
    //alert(splitPayments[paymentMethod] + " " + cashTendered);
    splitPayments[paymentMethod] = cashTendered;
    $('#tendered_value').html(currency(newAmount));
}

function doChargeZalion(orderData, callback) {
    if(inTrainingMode) {
        niceAlert("Room will not be charged in training mode");
        return;
    }
    
    //need to add some additional data to the order data to charge the room
    orderData.datetime = formatDate(new Date(clueyTimestamp()), "dd/MM/yyyy HH:mm:ss");
    orderData.location = business_name;
    
    //send request to charge via zalion by firing off request to post to POSTINGS.TXT
    var zalion_charge_request_url = 'http://' + zalionChargeRoomServiceIP + ':8080/ClueyWebSocketServices/zalion_charge';
            
    //we only want to send over the amount that was actually charged to the room, not the entire total
    orderData.total = parseFloat(splitPayments[currentZalionPaymentMethodName]);
            
    //convert json to string
    var orderDataString = JSON.stringify(orderData);
    
    var successCallback = function() {
        setStatusMessage("Room successfully charged.", false, false);                   
    }
        
    if(typeof(callback) != "undefined") {
        successCallback = callback;
    }
    
    $.ajax({
        type: 'POST',
        url: '/forward_zalion_charge_request',
        error: function() {
            setStatusMessage("Error Charging to Zalion", false, false);
        },
        success: successCallback,
        data: {
            zalion_charge_request_url : zalion_charge_request_url,
            order_data_json_string : orderDataString,
            order_data : orderData
        }
    });
}

var togglePrintReceiptInProgress = false;

function togglePrintReceipt() {
    if(togglePrintReceiptInProgress) {
        niceAlert("Please wait, request pending");
        return;
    }
    
    togglePrintReceiptInProgress = true;
    
    $.ajax({
        type: 'POST',
        url: '/admin/toggle_print_receipt.js'
    });
}

var cardChargeInProgress = false;
var cc_txn_xhr = null;
var currentCardChargeAmount = 0;

function cashScreenChargeCreditCard(amount) {
    //make sure none of the system payment methods are selected 
    if(cashPaymentMethodSelected || accountPaymentMethodSelected || loyaltyPaymentMethodSelected) {
        niceAlert("You must select an appropriate payment method first, in order to perform a transaction");
        return;
    }
    
    creditCardChargeCallback = cashScreenCreditCardChargeCallback;
    
    if(cardChargeInProgress) {
        niceAlert("There is already a card charge in progress, please wait");
        return;
    }
    
    if(totalOrder.card_charge) {
        niceAlert("You have already processed a card transaction for this sale!");
        return;
    }
    
    if(typeof(amount) == 'undefined') {
        amount = cashTendered;
    }
    
    if(amount == 0) {
        moneySelected(-1);
        amount = cashTendered;
        
        if(amount == 0) {
            niceAlert("You cannot send a zero amount to card terminal");
            return;
        }
    }
    
    cardChargeInProgress = true;
    
    chargeCreditCard(amount);
}

function chargeCreditCard(amount) {
    currentCardChargeAmount = amount;
    
    currentCCReferenceNumber = clueyTimestamp();
    
    //This message will print on the cc receipt
    var referenceMessage = "TXN#: " + currentCCReferenceNumber;
    
    var creditCardChargeRequestURL = 'http://' + creditCardChargeServiceIP + ':8080/ClueyWebSocketServices/cc_txn';
    
    var message = "Sending " + currency(amount) + " to card terminal.";
    
    hideNiceAlert();
    
    ModalPopups.Alert('niceAlertContainer',
        "Card Terminal Request In Progress...", "<div id='nice_alert' class='nice_alert'>" + message + "</div>",
        {
            width: 360,
            height: 280,
            okButtonText: 'Cancel',
            onOk: "cancelChargeCreditCard();"
        });
    
    cc_txn_xhr = $.ajax({
        type: 'POST',
        url: '/forward_credit_card_charge_request',
        error: function() {
            if (!userAbortedXHR(cc_txn_xhr)) {
                hideNiceAlert();
                niceAlert("Error charging card! Make sure card service is running and settings are correct.", false, false);
            }
        },
        complete: function() {
            cardChargeInProgress = false;
        },
        data: {
            credit_card_charge_request_url : creditCardChargeRequestURL,
            credit_card_terminal_ip : creditCardTerminalIP,
            credit_card_terminal_port : creditCardTerminalPort,
            transaction_type : "C",
            transaction_amount : amount,
            cashback_amount : "0",
            reference_message : referenceMessage,
            gratuity_amount : "0"
        }
    });
}

function cashScreenCreditCardChargeCallback(creditCardChargeResponseCode, errorMessage) {
    //1 means success
    //2 means declined
    //3 means retrieval canceled
    //4 means a timeout waiting for card
    //5 is an unknown response
    //6 means connection refused or other IO error
    //7 means a general error
    var message = "";
    
    if(creditCardChargeResponseCode == 1) {
        message = "Card successfully charged for " + currency(currentCardChargeAmount);
        niceAlert(message);
        
        //tag the card charge on to the order so we can create a record in cc_txn table
        totalOrder.card_charge = {
            paymentMethod : paymentMethod,
            amount : currentCardChargeAmount,
            reference_number : currentCCReferenceNumber
        }
        
        disallowCancelSaleCC = true;
        paymentMethodSelected(getPaymentMethodId(defaultPaymentMethod));
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

function cancelChargeCreditCard() {
    cardChargeInProgress = false;
    
    //cancel the ajax request
    cc_txn_xhr.abort();
    
    hideNiceAlert();
    niceAlert("Card charge canceled. Make sure to cancel the transaction on the terminal also.");
}

//this gets executed when a loyalty card is used
var loyaltyCardListenerHandler = function(event) {
    if(event.keyCode == 13) {
                    
        $(window).unbind('keypress', loyaltyCardListenerHandler);
                    
        if(current_user_id == null) {
            setStatusMessage("You are not logged in!", true, true);
            return;
        }
    
        //have to check this as the card can be swiped on menu screen
        if(currentOrderEmpty()) {
            setStatusMessage("No order present!", true, true);
            return;
        }
                    
        //strip off the ending question mark
        loyaltyCardCode = loyaltyCardCode.substring(0, 8);
                        
        var fullLoyaltyCardCode = loyaltyCardPrefix + loyaltyCardCode;
        
        console.log("Looking up loyalty card code: " + fullLoyaltyCardCode);
        
        if(loyaltyCustomersByCode[fullLoyaltyCardCode]) {
            if (!currentScreenIsTotals()) {
                doTotal();
            }
                        
            addLoyaltyCustomerToTotalOrder(loyaltyCustomersByCode[fullLoyaltyCardCode]);                        
        } else {
            niceAlert("Customer Not Found!");
        }
        
        loyaltyCardCode = "";
        return;
    }
                       
    loyaltyCardCode += String.fromCharCode(getEventKeyCode(event));
}

function addLoyaltyCustomerToTotalOrder(customer) {
    $('#loyalty_customer_name').html(customer.name);
    $('#loyalty_customer_number').html(customer.customer_number);
    
    var loyaltyLevelPercent = loyaltyLevels[customer.loyalty_level_id].percent;
    $('#loyalty_level_percent').html(loyaltyLevelPercent + "%");

    //make sure no decimals in the points
    var pointsEarned = roundNumber(((loyaltyLevelPercent/100) * (totalOrder.total * 100)), 0);
    $('#loyalty_points_earned').html(pointsEarned);

    var loyaltyPointsAvailable = customer.available_points;
    $('#loyalty_points_available').html(loyaltyPointsAvailable);
    
    $('#loyalty_customer_section').show();
    
    totalOrder.loyalty = {
        customer_id : customer.id,
        customer_name : customer.name,
        customer_number : customer.number,
        points_earned : pointsEarned,
        points_available : loyaltyPointsAvailable
    };
}

function resetLoyaltyCustomer() {
    $('#loyalty_customer_section').hide();
    delete totalOrder[loyaltyPaymentMethodName];
    delete splitPayments[loyaltyPaymentMethodName];
    
    if(loyaltyPaymentMethodSelected) {
        paymentMethodSelected(getPaymentMethodId(defaultPaymentMethod));
    }
}

//client account shtuff
function initCustomerSearchKeyboard() {
    toggleKeyboardEnable = false;
    
    var keyboardPlaceHolderEl = $('#totals_screen_select_customer_container #customer_search_results_keyboard_container')
    
    var pos = keyboardPlaceHolderEl.offset();
    
    //show the menu directly over the placeholder
    $("#util_keyboard_container").css( {
        "position" : "absolute",
        "width" : "688px",
        "left": (pos.left) + "px", 
        "top":pos.top + "px"
    } );
    
    hideUtilKeyboardCloseButton();

    $("#util_keyboard_container").show();
    
    //we need to force the search function to rerun on input, but the util keyboard will not fire an event to cause it to happen
    //so we tie a function to the callback when a key is pressed
    setUtilKeyboardCallback(function(){
        selectedCustomerSearchLetter = null;
        updateCustomerSearchResults();
    });
}

function showCustomerSearchScreen() {
    $('#payment_options_money_info_container').hide();
    $('#totals_screen_select_customer_container').show();
    initCustomerSearchKeyboard();
    
    clearCustomerSearchInput();
    $('#customer_search_input').focus();
    updateCustomerSearchResults();
}

function clearCustomerSearchInput() {
    $('#customer_search_input').val("");
    updateCustomerSearchResults();
}

function resetCustomerSelect() {
    delete totalOrder['customer'];
    $('#client_customer_section').hide();
    
    $('#totals_screen_select_customer_container').hide();
    $('#payment_options_money_info_container').show();
    paymentMethodSelected(getPaymentMethodId(defaultPaymentMethod));
    setUtilKeyboardCallback(null);
    resetKeyboard();
}

var selectedCustomerSearchLetter = null;
var amountToChargeCustomer = null;

function searchBoxFocused() {
    selectedCustomerSearchLetter = null;
    $('#selection_letters .letter').removeClass("selected");
    updateCustomerSearchResults();
}

function loadAllCustomers() {
    selectedCustomerSearchLetter = null;
    $('#selection_letters .letter').removeClass("selected");
    $('#selection_letters #cs_button_all').addClass("selected");
    clearCustomerSearchInput();
}

function loadSearchCustomersForLetter(letter) {
    console.log("Get customers for letter: " + letter);
    clearCustomerSearchInput();
    $('#selection_letters .letter').removeClass("selected");
    $('#selection_letters #cs_button_' + letter).addClass("selected");
    selectedCustomerSearchLetter = letter;
    updateCustomerSearchResults();
}

function updateCustomerSearchResults() {
    var searchString = $('#customer_search_input').val().toLowerCase();
    
    var results = new Array();
    
    var nextCustomer = null;
    
    if(selectedCustomerSearchLetter != null) {        
        for(customerId in creditCustomers) {
            nextCustomer = creditCustomers[customerId];
            //console.log(nextCustomer.name);
            if(nextCustomer.name.toLowerCase().startsWith(selectedCustomerSearchLetter)) {
                results.push(nextCustomer);
            }
        }
    } else {
        for(customerId in creditCustomers) {
            nextCustomer = creditCustomers[customerId];
            //console.log(nextCustomer.name);
            if(nextCustomer.name.toLowerCase().contains(searchString)) {
                results.push(nextCustomer);
            }
        }
    }
    
    $('#search_results_scroller').html("");
    
    var resultHTML = "<div id='customer_list'>";
    
    if(results.length > 0) {
        var alphaSort = function(a, b) {
            return a.name.localeCompare(b.name);
        };
        
        results = results.sort(alphaSort);
        
        for(var i=0; i<results.length; i++) {
            var c = results[i];
            
            var startIndex = c.name.toLowerCase().indexOf(searchString);
            var endIndex = startIndex + searchString.length + 3;
            
            var customerName = c.name;
            
            if(searchString.length > 0) {
                customerName = customerName.toLowerCase().splice(startIndex, 0, "<b>");
                customerName = customerName.toLowerCase().splice(endIndex, 0, "</b>");
            }
            
            resultHTML += "<div onclick='addCustomerToOrder(" + c.id + ")' class='customer'>" + customerName + "</div>";
        }
    } else {
        resultHTML += "<div id='no_results'>No Customers Found!</div>";
    }
    
    resultHTML += "</div>" + clearHTML;
    
    $('#search_results_scroller').html(resultHTML);
}

function addCustomerToOrder(c_id) {
    var customer = creditCustomers[c_id];
    var customerName = customer.name;
    
    //check the credit limit of this customer
    var creditAvailable = customer.credit_available;
    var customerCreditLimit = customer.credit_limit;
    var customerCreditAvailable = customer.credit_available;
    var customerCurrentBalance = customer.current_balance;
    
    if(amountToChargeCustomer > creditAvailable) {
        niceAlert("This customers credit limit (" + currency(customerCreditLimit) + ") will not allow for this sale to finish. Credit Available: " + currency(customerCreditAvailable));
        return;
    }
    
    console.log("Adding customer " + customerName + " to order!");
    
    $('#totals_screen_select_customer_container').hide();
    $('#payment_options_money_info_container').show();
    setUtilKeyboardCallback(null);
    resetKeyboard();
    
    totalOrder.customer = {
        customer_id : customer.id
    };
    
    //show some dialog saying that this customer is chosen
    $('#client_customer_name').html(customerName);
    $('#client_customer_credit_limit').html(currency(customerCreditLimit));
    $('#client_customer_current_balance').html(currencyBalance(customerCurrentBalance));
    $('#client_customer_section').show();
    
    if(customer.is_loyalty_customer) {
        addLoyaltyCustomerToTotalOrder(customer);
        $('#client_customer_points_earned').html($('#loyalty_points_earned').html());
        $('#client_customer_points_earned_container').show();
        $('#loyalty_customer_section').hide();
    } else {
        $('#client_customer_points_earned_container').hide();
    }
}