var customFooterId = null;

function storeLastReceipt(user_id, table_num) {
    if(user_id == null) {
        return;
    }
    
    storeKeyJSONValue("user_" + user_id + "_last_receipt", {
        'table_num' : table_num
    });
}

function fetchLastReceiptID(user_id) {
    //retrieve the users last receipt from storage
    var lastReceiptIDOBJ = retrieveStorageJSONValue("user_" + user_id + "_last_receipt");
 
    var lastReceiptID = null;
 
    if(lastReceiptIDOBJ == null) {
        lastReceiptID = 0;
    } else {
        lastReceiptID = lastReceiptIDOBJ.table_num;
    }
    
    return lastReceiptID;
}

function storeLastRoom(user_id, room_id) {
    if(user_id == null) {
        return;
    }
    
    storeKeyJSONValue("user_" + user_id + "_last_room", {
        'room_id' : room_id
    });
}

function fetchLastRoomID(user_id) {
    //retrieve the users last room from storage
    var lastRoomIDOBJ = retrieveStorageJSONValue("user_" + user_id + "_last_room");
 
    var lastRoomID = null;
 
    if(lastRoomIDOBJ == null) {
        lastRoomID = $('.room_graphic').first().data('room_id');
        storeLastRoom(user_id, lastRoomID);
    } else {
        lastRoomID = lastRoomIDOBJ.room_id;
    }
    //alert("last room id: " + lastRoomID);
    return lastRoomID;
}

function printReceipt(content, printRecptMessage, printerID) {
    var receiptContent = receiptContentSetup(content, printRecptMessage);
    printContent(receiptContent, printerID);
}

//this causes a local print resulting in a popup
function printLocalReceipt(content, printRecptMessage) {
    var receiptContent = receiptContentSetup(content, printRecptMessage);
    
    $('#printFrame').contents().find('#till_roll').html(receiptContent);

    printFrame.focus();
    printFrame.print();
}

function receiptContentSetup(content, printRecptMessage) {
    if(!inKitchenContext()) {
        setStatusMessage("Printing Receipt");
    }
    
    var footer = receiptMessage;
    
    //check if a custom footer should be used
    if(customFooterId != null) {
        footer = customReceiptFooters[customFooterId].content;
    }
    
    //you set mandatoryFooterMessageHTML before calling this and it will print it
    //used for the likes of zalion
    if(mandatoryFooterMessageHTML != null && mandatoryFooterMessageHTML.length > 0) {
        content += clearHTML + mandatoryFooterMessageHTML;
    }
    
    mandatoryFooterMessageHTML = null;
    
    if(printRecptMessage) {
        receiptMessageHTML = "<div id='receipt_message'>" + footer + "</div>";
        content += clearHTML + receiptMessageHTML;
    }
    //add space and a dot so we print a bottom margin
    content += clear30HTML + "<div class='the_dots'>.  .  .</div>";
    
    return content;
}

//see here for code for listener: https://www.mozdev.org/bugs/show_bug.cgi?id=24359#c4
var printerProgressListener = {
    stateIsRequest:false,
        printing: false,
    QueryInterface : function(aIID) {
        if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
            aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
            aIID.equals(Components.interfaces.nsISupports))
            return this;
        throw Components.results.NS_NOINTERFACE;
    },
   
    onStateChange : function(aWebProgress, aRequest, aStateFlags, aStatus) {
        console.log('State Change -> State Flags:'+aStateFlags+' Status:'+aStatus);
     
        if (aStateFlags == 262160) {// 0x40010 = STATE_IS_NETWORK | STATE_STOP
            this.printing = false;
        }
        
        return 0;
    },
   
    onLocationChange : function(aWebProgress, aRequest, aLocation) {
        return 0;
    },
   
    onProgressChange : function(aWebProgress, aRequest,
        aCurSelfProgress, aMaxSelfProgress,
        aCurTotalProgress, aMaxTotalProgress){
//        alert('Self Current:'+aCurSelfProgress+' Self Max:'+aMaxSelfProgress
//            +' Total Current:'+aCurTotalProgress+' Total Max:'+aMaxTotalProgress);
        
        this.printing = true;
    },
   
    onStatusChange : function(aWebProgress, aRequest, aStateFlags, aStatus) {
//        alert('Status Change -> State Flags:'+aStateFlags+' Status:'+aStatus);
    },
    onSecurityChange : function(aWebProgress, aRequest, aState){}
//    onLinkIconAvailable : function(a){}
};
    
function printContent(content, printerID) {
    if(inMediumInterface()) {
        niceAlert("Printing is not yet supported for the cloud on mobiles except for ordering");
        return;
    }
    
    if(!checkForClueyPlugin() || !checkForJSPrintSetupPlugin()) {
        return;
    }
    
    console.log("Attempting to print to printer " + printerID);
    
    if (printerProgressListener.printing) {
        console.log("Waiting 500 ms for previous print job to complete.");
        
        setTimeout(function(){
            printContent(content, printerID)
        }, 500);
        
        return;
    }
    
    var printer;
    
    if(printerID) {
        printer = printersByID[printerID];
    } else {
        if(localPrinterID == -1) {
            niceAlert("You have not set a local receipt printer for this terminal");
            return
        }
        
        printer = printersByID[localPrinterID];
    }
        
    if(!printer) {
        niceAlert("No printer found with id " + localPrinterID);
        return;
    }
    
    var printerNetworkPath = printer.network_path.toLowerCase();
    
    if($.inArray(printerNetworkPath, localPrinters) == -1) {
        var title = "Printer Not Installed";
        
        hideNiceAlert();
        
        ModalPopups.Alert('niceAlertContainer',
            title, "<div id='nice_alert' class='licence_expired_header'>You are trying to print to a printer that is not installed on this terminal: " + printerNetworkPath + "</div>",
            {
                width: 360,
                height: 310,
                okButtonText: 'Ok',
                onOk: "hideNiceAlert();"
            });
        
        return;
    }
    
    console.log("Printing to printer: " + printerNetworkPath);
    jsPrintSetup.refreshOptions();
    jsPrintSetup.setPrinter(printerNetworkPath);
        
    // set top margins in millimeters
    jsPrintSetup.setOption('marginTop', 0);
    jsPrintSetup.setOption('marginBottom', 0);
    jsPrintSetup.setOption('marginLeft', 0);
    jsPrintSetup.setOption('marginRight', 0);
    // set page header
    jsPrintSetup.setOption('headerStrLeft', '');
    jsPrintSetup.setOption('headerStrCenter', '');
    jsPrintSetup.setOption('headerStrRight', '');
    // set empty page footer
    jsPrintSetup.setOption('footerStrLeft', '');
    jsPrintSetup.setOption('footerStrCenter', '');
    jsPrintSetup.setOption('footerStrRight', '');
   
    // clears user preferences always silent print value
    // to enable using 'printSilent' option
    jsPrintSetup.clearSilentPrint();
        
    // Suppress print dialog (for this context only)
    jsPrintSetup.setOption('printSilent', 1);
    jsPrintSetup.setShowPrintProgress(false);
        
    jsPrintSetup.saveOptions(jsPrintSetup.kSaveAll);
    jsPrintSetup.saveGlobalOptions(jsPrintSetup.kSaveAll);
        
    //register the progress listener
    jsPrintSetup.setPrintProgressListener(printerProgressListener);
        
    // Do Print 
    $('#printFrame').contents().find('#till_roll').html(content);
    
    //set some printer settings
    var mmToPixelFactor = 3.779527559;
    var paperWidth = printer.paper_width_mm * mmToPixelFactor;
    $('#printFrame').contents().find('body').width(paperWidth + "px");
    $('#printFrame').contents().find('body').css("font-size", printer.font_size + "px");
    
    jsPrintSetup.printWindow(printFrame);
}

function fetchFinalReceiptHTML(includeBusinessInfo, includeServerAddedText, includeVatBreakdown) {
    if(typeof(includeBusinessInfo) == 'undefined') {
        includeBusinessInfo = false;
    }
    
    if(typeof(includeServerAddedText) == 'undefined') {
        includeServerAddedText = true;
    }
    
    finalReceiptHTML = "";
    
    if(includeBusinessInfo) {
        finalReceiptHTML += fetchBusinessInfoHeaderHTML();
    }
    
    finalReceiptHTML += fetchFinalReceiptHeaderHTML();
    
    allOrderItemsRecptHTML = getAllOrderItemsReceiptHTML(totalOrder, false, false, includeServerAddedText);
    
    finalReceiptHTML += clearHTML + allOrderItemsRecptHTML;
    
    finalReceiptHTML += "<div class='data_table'>";
    
    if(totalOrder.discount_percent) {
        subTotal = totalOrder.pre_discount_price;
        
        finalReceiptHTML += "<div class='label'>Sub-Total:</div><div class='data'>" + currency(subTotal) + "</div>" + clearHTML;
        
        //calculate the amount of discount
        discountAmount = (totalOrder.pre_discount_price * totalOrder.discount_percent)/100;
        finalReceiptHTML += "<div class='label'>Discount " + totalOrder.discount_percent + "%:</div><div class='data'>" + currency(discountAmount) + "</div>" + clearHTML;
    } else {
        subTotal = totalOrder.total;
        finalReceiptHTML += "<div class='label'>Sub-Total:</div><div class='data'>" + currency(subTotal) + "</div>" + clearHTML;
        discountAmount = 0;
    } 
    
    //set the discountAmount on the order as we use it later when charging a room etc
    totalOrder.discount_amount = discountAmount;
    
    finalReceiptHTML += taxChargable ? fetchTotalsHTMLWithTaxChargable() : fetchTotalsWithoutTaxChargableHTML();
    
    cashTendered = totalOrder.cash_tendered;
    
    if(typeof(totalOrder.split_payments) != 'undefined') {
        for(var pm in totalOrder.split_payments) {
            finalReceiptHTML += "<div class='label'>Paid: " + pm + "</div><div class='data'>" + currency(totalOrder.split_payments[pm]) + "</div>" + clearHTML;
        }
        
        finalReceiptHTML += clearHTML;
    } else if(cashTendered > 0) {
        finalReceiptHTML += "<div class='label'>Paid:</div><div class='data'>" + currency(cashTendered) + "</div>" + clearHTML;
    }
    
    change = parseFloat(totalOrder.change);

    //is there any change? we include cashback in the change here
    var changeWithCashback = parseFloat(change) + parseFloat(totalOrder.cashback);

    if(changeWithCashback > 0) {
        finalReceiptHTML += "<div class='change_line_container'><div class='label'>Change:</div><div class='data'>" + currency(changeWithCashback) + "</div></div>" + clearHTML;
    }
    
    finalReceiptHTML += "</div>" + clearHTML;
    
    if(includeVatBreakdown) {
        
        if(taxChargable) {
        //TODO
        } else {
            finalReceiptHTML += "<div class='data_table vat_breakdown'>";
            finalReceiptHTML += "<div class='header'>" + taxLabel + " Breakdown</div>" + clearHTML;
        
            //construct table
            var taxRates = {}
        
            for(var i=0; i<totalOrder.items.length; i++) {
                var item = totalOrder.items[i];
            
                var itemPrice = parseFloat(item['total_price']);
                var itemTaxRate = item.product['tax_rate'];
            
                var taxAmount = itemPrice - (itemPrice/(1 + (parseFloat(itemTaxRate)/100)));
                var netAmount = itemPrice - taxAmount;
                var grossAmount = itemPrice;
            
                if(typeof(taxRates[itemTaxRate]) == 'undefined') {
                    taxRates[itemTaxRate] = {
                        net : 0, 
                        tax : 0, 
                        gross : 0
                    };
                }
            
                taxRates[itemTaxRate].net += netAmount;
                taxRates[itemTaxRate].tax += taxAmount;
                taxRates[itemTaxRate].gross += grossAmount;
            }
            
            var taxes_data = new Array();
            for(taxRateKey in taxRates) {
                var taxData = taxRates[taxRateKey];
                taxes_data.push(new Array(taxRateKey, taxData.net, taxData.tax, taxData.gross));
            }
    
            finalReceiptHTML += "<div id='cash_totals_data_table'>";
            finalReceiptHTML += getCashTotalTaxesDataTable(taxes_data) + clearHTML;
            finalReceiptHTML += getCashTotalTaxesDataTableTotals("Total", taxes_data) + clearHTML;
            finalReceiptHTML += "</div>" + clearHTML;
    
            finalReceiptHTML += "<div class='footer'>Tax Reg No: " + taxNumber + "</div>" + clearHTML;
            finalReceiptHTML += "</div>" + clearHTML;
        }
    }
    
    return finalReceiptHTML;
}

function fetchBusinessInfoHeaderHTML() {
    businessInfoHeaderHTML = "<div class='custom_business_info'>";
    businessInfoHeaderHTML += "<div>" + businessInfoMessage + "</div>";
    businessInfoHeaderHTML += "</div>";
  
    return businessInfoHeaderHTML;
}

function fetchFinalReceiptHeaderHTML() {
    var headerHTML = "<div class='data_table'>";
    
    var server = firstServerNickname(totalOrder);
    
    if(server) {
        headerHTML += "<div class='label'>Server:</div><div class='data'>" + server + "</div>" + clearHTML;
    }
    
    //lazy init the order time of totalling
    if(typeof(totalOrder.time) == 'undefined') {
        totalOrder.time = clueyTimestamp();
    }
    
    var timestamp = utilFormatDate(new Date(totalOrder.time));
    
    headerHTML += "<div class='time label'>Time:</div><div class='time data'>" + timestamp + "</div>" + clearHTML;
    
    if(totalOrder.table) {
        headerHTML += "<div class='label'>Table:</div><div class='data'>" + totalOrder.table + "</div>" + clearHTML;
    }
    
    if(totalOrder.terminal_id) {
        headerHTML += "<div class='label'>Terminal:</div><div class='data'>" + totalOrder.terminal_id + "</div>" + clearHTML;   
    } else {
        headerHTML += "<div class='label'>Terminal:</div><div class='data'>" + terminalID + "</div>" + clearHTML;   
    }
    
    var orderNum = totalOrder.order_num;
        
    if(typeof(orderNum) != 'undefined') {
        headerHTML += "<div class='label'>Order Number:</div><div class='data'>" + orderNum + "</div>" + clearHTML;
    }
    
    headerHTML += "</div>";
    
    return headerHTML;
}

// you must set dicountAmount and subTotal before this funciton is called
function fetchTotalsHTMLWithTaxChargable() {
    //write the tax total
    taxAmount = ((subTotal - discountAmount) * globalTaxRate)/100;
    totalsHTML = "<div class='label'>" + taxLabel + " " + globalTaxRate + "%:</div><div class='data'>" + currency(taxAmount) + "</div>" + clearHTML;
        
    totalsHTML += fetchServiceChargeHTML();
    
    totalsHTML += fetchCashbackHTML();
    
    //finally add up the total from the generated values above to avoid rounding errors
    total = (parseFloat(subTotal) - parseFloat(discountAmount)) + parseFloat(serviceCharge) + parseFloat(taxAmount);
    currentTotalFinal = total;
    
    //temporarily set the totalFinal
    totalOrder.totalFinal = total;
    
    totalsHTML += "<div class='total_line_container'><div class='label bold'>Total:</div><div class='data bold total_container'>" + currency(total + totalOrder.cashback) + "</div></div>" + clearHTML;
    
    return totalsHTML;
}

// you must set dicountAmount and subTotal before this funciton is called
function fetchTotalsWithoutTaxChargableHTML() {
    totalsHTML = fetchServiceChargeHTML();
    
    totalsHTML += fetchCashbackHTML();
    
    //finally add up the total from the generated values above to avoid rounding errors
    total = (parseFloat(subTotal) - parseFloat(discountAmount)) + parseFloat(serviceCharge);
    
    currentTotalFinal = total;
    
    //temporarily set the totalFinal
    totalOrder.totalFinal = total;
    
    totalsHTML += "<div class='total_line_container'><div class='label bold'>Total:</div><div class='data bold total_container'>" + currency(total + totalOrder.cashback) + "</div></div>" + clearHTML;
    
    return totalsHTML;
}

function fetchServiceChargeHTML() {
    var serviceChargeHTML = "";
    
    //is there a service charge set?
    if(serviceCharge>0) {
        serviceChargeHTML += "<div class='label'>" + serviceChargeLabel + ":</div><div class='data'>" + currency(serviceCharge) + "</div>" + clearHTML;
    }
    
    return serviceChargeHTML;
}

function fetchCashbackHTML() {
    var cashbackHTML = "";
    
    if(typeof(totalOrder.cashback) == 'undefined') {
        totalOrder.cashback = 0;
    }
    
    if(totalOrder.cashback > 0) {
        cashbackHTML += "<div class='label'>Cashback:</div><div class='data'>" + currency(totalOrder.cashback) + "</div>" + clearHTML;
    }
    
    return cashbackHTML;
}
