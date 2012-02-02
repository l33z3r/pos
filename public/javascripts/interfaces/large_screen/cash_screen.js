var splitPayments;

function updateTotalTendered() {
    var totalCashTendered = getTotalTendered();

    if(isNaN(parseFloat(totalCashTendered))) {
        totalCashTendered = 0;
    }
        
    if(totalCashTendered >= 0) {
        var formattedVal = currency(totalCashTendered, false);
        $('#totals_tendered_value').html(formattedVal);
    }
    
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
}

function cashOutCancel() {
    resetTendered();
    showMenuScreen();
}

var paymentIntegrationId = null;

function paymentMethodSelected(method, integration_id) {
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
        //integrations do not allow for split payments
        splitPayments = {};
        splitPayments[paymentMethod] = 0;
        
        if(paymentIntegrationId == zalionPaymentIntegrationId) {
            //alert("Zalion Integration");
            showLoadingDiv();
            
            //fire off request to get contents of ROOMFILE
            var zalion_roomfile_request_url = 'http://' + zalionChargeRoomServiceIP + ':8080/ClueyWebSocketServices/zalion_roomfile';
            
            $.ajax({
                type: 'GET',
                url: '/forward_zalion_roomfile_request',
                error: function() {
                    hideLoadingDiv();
                    setStatusMessage("Error Getting Zalion Data", false, false);                   
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
    $('#tendered_value').html(currency(cashTendered, false));
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
            folioTableHTML += "<div class='balance'>" + currency(folioBalance) + "</div>";
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
    
    //make sure you cannot enter a 3rd decimal place number
    if(cashTenderedKeypadString.indexOf(".") != -1) {
        if(cashTenderedKeypadString.length - cashTenderedKeypadString.indexOf(".") > 3) {
            return;
        }
    }
    
    cashTenderedKeypadString += val;
    cashTendered = parseFloat(cashTenderedKeypadString);
    //alert(splitPayments[paymentMethod] + " " + cashTendered);
    splitPayments[paymentMethod] = cashTendered;
    $('#tendered_value').html(currency(splitPayments[paymentMethod], false));
}

function totalsScreenKeypadClickDecimal() {
    if(cashTenderedKeypadString.indexOf(".") == -1) {
        cashTenderedKeypadString += ".";
    }
}

function totalsScreenKeypadClickCancel() {
    if(roomNumberInputFocus) {
        $('#room_number_input').val("");
        return;
    }
    
    $('#tendered_value').html(currency(0, false));
    splitPayments[paymentMethod] = 0;
    resetTendered();
}

function moneySelected(amount) {
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
    
    cashTendered = parseFloat(newAmount);
    //alert(splitPayments[paymentMethod] + " " + cashTendered);
    splitPayments[paymentMethod] = cashTendered;
    $('#tendered_value').html(currency(splitPayments[paymentMethod], false));
    
    updateTotalTendered();
    
}

function doChargeRoom(orderData) {
    //need to add some additional data to the order data to charge the room
    orderData.datetime = formatDate(new Date(), "dd/MM/yyyy hh:mm:ss");
    orderData.location = business_name;
    
    //convert json to string
    var orderDataString = JSON.stringify(orderData);
    
    if(paymentIntegrationId != 0) {
        if(paymentIntegrationId == zalionPaymentIntegrationId) {
            //send request to charge via zalion
            showLoadingDiv();
            
            //fire off request to post to POSTINGS.TXT
            var zalion_charge_request_url = 'http://' + zalionChargeRoomServiceIP + ':8080/ClueyWebSocketServices/zalion_charge';
            
            $.ajax({
                type: 'POST',
                url: '/forward_zalion_charge_request',
                error: function() {
                    hideLoadingDiv();
                    setStatusMessage("Error Charging to Zalion", false, false);
                },
                success: function() {
                    hideLoadingDiv();
                    setStatusMessage("Room successfully charged.", false, false);                   
                },
                data: {
                    zalion_charge_request_url : zalion_charge_request_url,
                    order_data : orderDataString
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
