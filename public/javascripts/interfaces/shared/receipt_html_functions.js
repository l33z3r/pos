function storeLastReceipt(user_id, table_num) {
    storeKeyJSONValue("user_" + user_id + "_last_receipt", {
        'table_num':table_num
    });
}

function fetchLastReceiptID() {
    //retrieve the users last receipt from storage
    var lastReceiptIDOBJ = retrieveStorageJSONValue("user_" + current_user_id + "_last_receipt");
 
    var lastReceiptID = null;
 
    if(lastReceiptIDOBJ == null) {
        lastReceiptID = 0;
    } else {
        lastReceiptID = lastReceiptIDOBJ.table_num;
    }

    //last receipt is a number of a table or 0 for the current order
//    if(lastReceiptID == 0) {
//        order = currentOrder;
//    } else {
//        order = tableOrders[lastReceiptID];
//    }
    
    return lastReceiptID;
}

function printReceipt(content, printRecptMessage) {
    setStatusMessage("Printing Receipt!");
    
    if(printRecptMessage) {
        receiptMessageHTML = "<div id='receipt_message'>" + receiptMessage + "</div>";
        content += clearHTML + receiptMessageHTML;
    }
    
    //add space and a dot so we print a bottom margin
    content += clear30HTML + "<div class='the_dots'>.  .  .</div>";
    
    print(content);
}

function print(content) {
    $('#printFrame').contents().find('#till_roll').html(content);
    
    var content_with_css = "<!DOCTYPE html [<!ENTITY nbsp \"&#160;\"><!ENTITY amp \"&#38;\">]>\n<html>" 
    + $('#printFrame').contents().find('html').html() + "</html>";
      
    var print_service_url = 'http://' + webSocketServiceIP + ':8080/ClueyWebSocketServices/receipt_printer';
    
    $.ajax({
        type: 'POST',
        url: '/forward_print_service_request',
        error: function() {
            alert("Error Sending Data To Print Service!");
        },
        data: {
            print_service_url : print_service_url,
            html_data : content_with_css
        }
    });
    
    return;
     
    
    //TODO: display an error if the service is not running...
    
    
    
    
    
    
    
    
    
    
    console.log("Websocket support? " + ("WebSocket" in window));
    
    if ("WebSocket" in window) {
        //console.log("Sending receipt content over websocket: " + content_with_css);
        
        // Let us open a web socket
        var ws = new WebSocket("ws://" + webSocketServiceIP + ":8080/ClueyWebSocketServices/receipt_printer");
        
        ws.onopen = function()
        {
            //there is a maximum limit on the size of the message we can send, 
            //so we split it into groups of 3072 chars (3kb of data)
            var charsPerGroup = 3072;
            
            console.log("Breaking data up into " + Math.ceil(content_with_css.length/charsPerGroup) + " groups to send to print service");
            for(var i = 0; i < content_with_css.length; i+=charsPerGroup) {
                var nextGroup = content_with_css.substring(i, i + charsPerGroup);
                console.log("Sending group " + ((i/charsPerGroup) + 1));
                ws.send(nextGroup);
            }
            
            //ws.send(content_with_css);
            
            ws.close();
        };
        
        ws.onmessage = function (evt) 
        { 
            var received_msg = evt.data;
            console.log("Message received: " + received_msg);
        };
        ws.onclose = function()
        { 
            // websocket is closed.
            console.log("Connection closed!"); 
        };
    } else {
        // The browser doesn't support WebSocket
        alert("WebSocket NOT supported by your Browser!");
    
    //DO IT THE OLD FASHIONED WAY
    //    $('#printFrame').contents().find('#till_roll').html(content);
    //    
    //    printFrame.focus();
    //    printFrame.print();
    }
    
}