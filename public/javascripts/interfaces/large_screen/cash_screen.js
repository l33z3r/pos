var splitPayments;

function updateTotalTendered() {
    var totalCashTendered = getTotalTendered();

    if(isNaN(parseFloat(totalCashTendered))) {
        totalCashTendered = 0;
    }
        
    var formattedVal = currency(totalCashTendered, false);
    $('#totals_tendered_value').html(formattedVal);
    
    totalAmountInclCashback = currentTotalFinal + cashback;

    //calculate change and show the finish sale button
    change = totalCashTendered - totalAmountInclCashback;
    
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
    
    return totalTendered;
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

    if(cashTendered < totalAmountInclCashback) {
        //auto fill to exact amount 
        moneySelected(-1);
        finishSale();
        return;
    }
    
    //make sure that you cannot have any change if there is no cash in the split payments array
    if(cashTendered > totalAmountInclCashback) {
        var positiveCashAmount = false;
        
        for(pm in splitPayments) {
            if(pm.toLowerCase() == "cash" && parseFloat(splitPayments[pm]) > 0) {
                positiveCashAmount = true;
                break;
            }
        }
        
        if(!positiveCashAmount) {
            niceAlert("You cannot enter an amount (" + currency(cashTendered) + ") above the total (" + currency(totalAmountInclCashback) + "), if you are not taking a cash payment, as you cannot issue change without cash.");
            return;
        }
    }
    
    doTotalFinal();
}

function resetTendered() {
    cashTendered = 0;
    cashTenderedKeypadString = "";
}

function cashOutCancel() {
    resetTendered();
    showMenuScreen();
}

var paymentIntegrationId = 0;
var currentZalionPaymentMethodName = null;

function paymentMethodSelected(method, integration_id) {
    //if the previously selected payment method had an integration, we want to popup a notice saying that it
    //must be the last payment method you select in order to actually do the integration
    if(paymentIntegrationId != 0 && splitPayments[paymentMethod] > 0) {
        var warningMessage = "In order to use a payment integration it must be the last payment method that you select while doing split payments (Enter zero amount to cancel)!";
        niceAlert(warningMessage);
        return;
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
    
    $('#' + method.replace(/ /g,"_") + '_payment_method_button').addClass('selected');
    
    paymentIntegrationId = integration_id;
    
    //check if the payment method is the charge room and do some magic
    if(paymentIntegrationId != 0) {
        
        totalAmountInclCashback = currentTotalFinal + cashback;
        
        if(paymentIntegrationId == zalionPaymentIntegrationId) {
            //we have to store the string that represents the current zalion payment method, so that
            //we can retrieve the amount later that will be actually charged to the room
            currentZalionPaymentMethodName = paymentMethod;
            
            showLoadingDiv();
            
            //fire off request to get contents of ROOMFILE
            var zalion_roomfile_request_url = 'http://' + zalionChargeRoomServiceIP + ':8080/ClueyWebSocketServices/zalion_roomfile';
            
            $.ajax({
                type: 'GET',
                url: '/forward_zalion_roomfile_request',
                error: function() {
                    hideLoadingDiv();
                    setStatusMessage("Error Getting Zalion Data.", false, false);                   
                    paymentMethodSelected(defaultPaymentMethod, 0);
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
}

var selectedRoomNumber = null;
var selectedFolioNumber = null;
var selectedFolioName = null;

function doRoomNumberLookup() {
    clearSelectedFolio();
    
    var roomNumber = $('#room_number_input').val();
    
    roomNumber = parseInt(roomNumber);
    
    //alert("Looking up room: " + roomNumber);
    
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
    if(roomNumberInputFocus) {
        $('#room_number_input').val($('#room_number_input').val() + val);
        return;
    }
    
    cashTenderedKeypadString += val;
    cashTendered = parseFloat(cashTenderedKeypadString/100.0);
    //alert(splitPayments[paymentMethod] + " " + cashTendered);
    splitPayments[paymentMethod] = cashTendered;
    $('#tendered_value').html(currency(cashTenderedKeypadString/100.0));
}

function totalsScreenKeypadClickCancel() {
    if(roomNumberInputFocus) {
        $('#room_number_input').val("");
        return;
    }
    
    $('#tendered_value').html(currency(0));
    splitPayments[paymentMethod] = 0;
    resetTendered();
}

function moneySelected(amount) {
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
    
    newAmount = roundNumber(newAmount, 2);
    
    cashTendered = parseFloat(newAmount);
    //alert(splitPayments[paymentMethod] + " " + cashTendered);
    splitPayments[paymentMethod] = cashTendered;
    $('#tendered_value').html(currency(newAmount));
}

function doChargeRoom(orderData) {
    //need to add some additional data to the order data to charge the room
    orderData.datetime = formatDate(new Date(), "dd/MM/yyyy HH:mm:ss");
    orderData.location = business_name;
    
    if(paymentIntegrationId != 0) {
        if(paymentIntegrationId == zalionPaymentIntegrationId) {
            //send request to charge via zalion by firing off request to post to POSTINGS.TXT
            var zalion_charge_request_url = 'http://' + zalionChargeRoomServiceIP + ':8080/ClueyWebSocketServices/zalion_charge';
            
            //we only want to send over the amount that was actually charged to the room, not the entire total
            orderData.total = parseFloat(splitPayments[currentZalionPaymentMethodName]);
            
            //convert json to string
            var orderDataString = JSON.stringify(orderData);
    
            $.ajax({
                type: 'POST',
                url: '/forward_zalion_charge_request',
                error: function() {
                    setStatusMessage("Error Charging to Zalion", false, false);
                },
                success: function() {
                    setStatusMessage("Room successfully charged.", false, false);                   
                },
                data: {
                    zalion_charge_request_url : zalion_charge_request_url,
                    order_data_json_string : orderDataString,
                    order_data : orderData
                }
            });
        }
    }
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
