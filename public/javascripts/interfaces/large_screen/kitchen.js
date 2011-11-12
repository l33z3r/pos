var courseChecks = {};

function initKitchen() {
    //hide the red x 
    $('#nav_save_button').hide();
        
    //hide the shortcut dropdown
    $('#menu_screen_shortcut_dropdown_container').hide();
    
    loadCourseChecks();
}

function renderReceipt(tableID) {
    var nextKitchenOrder = tableOrders[tableID];
    
    if(!courseChecks[tableID]) {
        courseChecks[tableID] = new Array();
    } 
        
    //Add courses to our existing data
    var numCourses;
    
    if(typeof nextKitchenOrder.courses == "undefined") {
        numCourses = 0;
    } else {
        numCourses = nextKitchenOrder.courses.length;    
    }
        
    console.log("There are " + numCourses + " courses in this table, we have " + courseChecks[tableID].length + " recorded");
    //if there are no courses, then treat the whole order as one course
    if(numCourses == 0) {
        numCourses = 1;
    } else {
        //check if there are items after the last course line
        lastCourseLineIndex = nextKitchenOrder.courses[nextKitchenOrder.courses.length-1];
        
        if(lastCourseLineIndex != nextKitchenOrder.items.length) {
            //add a course for the last few items
            numCourses++;
        }
    }
        
    var numNewCourses = numCourses - courseChecks[tableID].length;
    
    if(numNewCourses>0) {
        console.log("Adding " + numNewCourses + " courses");
        for(var j=0; j<numNewCourses; j++) {
            courseChecks[tableID].push(false);
        }
    }
        
    console.log("Saving course checks for table " + tableID);
    saveCourseChecks();
    
    console.log("Rendering receipt for table " + tableID);
    
    $('#loading_table').html(tableID);
    
    $('#kitchen_receipt_container_' + tableID).show();
    
    clearKitchenTableReceipt(tableID);
    
    //console.log("items: " + nextKitchenOrder.items);
     
    var nextKitchenOrderNum = nextKitchenOrder.order_num;
    
    $('#kitchen_table_' + tableID + "_receipt_order_num").html("Order #" + nextKitchenOrderNum);
     
    var allOrderItemsRecptHTML = getAllOrderItemsReceiptHTML(nextKitchenOrder, false, false, true);
     
    $('#kitchen_table_' + tableID + '_till_roll').html($('#kitchen_table_' + tableID + '_till_roll').html() + allOrderItemsRecptHTML);
    
    //apply the course checks
    applyCourseChecks(tableID);
    
    //check is this order completed, and move it to the filled orders if it is    
    var movedToFilled = false;
    
    if(orderComplete(tableID)) {
        if(orderInFilledSection(tableID)) {
            //something must have changed in the order so put it back into the active orders
            console.log("something changed in order for tableID: " + tableID + " moving it back to the active orders");
            
            $('#kitchen_receipt_container_' + tableID + ' .header').removeClass("being_removed");
            $('#kitchen_receipt_container_' + tableID + ' .header').addClass("returned");
            
            $('#kitchen_receipt_container_' + tableID).appendTo('#active_orders');
        } else {
            console.log("moving completed order for tableID: " + tableID + " into filled orders");
            $('#kitchen_receipt_container_' + tableID).appendTo('#filled_orders');
        }
        movedToFilled = true;
    }
    
    //check where we want to move this order to
    if(orderInEmptySection(tableID)) {
        console.log("IS IN EMPTY SECTION!!!");
        
        if(!orderEmpty(nextKitchenOrder)) {
            //move this order to the end of the active orders queue
            $('#kitchen_receipt_container_' + tableID).appendTo('#active_orders');
        }
    } else if(orderInActiveSection(tableID)) {
    //leave it as it is in the queue
    } else if(orderInFilledSection(tableID) && !movedToFilled) {
        //has been modified, so move it back to active
        $('#kitchen_receipt_container_' + tableID).appendTo('#active_orders');
    }

    kitchenTableRecptScroll(tableID);
    
    if(noActiveOrders()) {
        $('#no_orders_message').show();
    } else {
        $('#no_orders_message').hide();
    }
}

function finishedLoadingKitchenScreen() {
    $('#kitchen_screen #loading_message').hide();
    $('#kitchen_screen #receipts_container').show();
    
    setTimeout(kitchenTableRecptScrollAll, 200);
}

function clearKitchenTableReceipt(tableID) {
    $('#kitchen_table_' + tableID + '_till_roll').html("");
}

function kitchenTableRecptScrollAll() {
    $('#kitchen_screen .kitchen_receipt_container').each(function() {
        var nextTableID = $(this).data("table_id");
        kitchenTableRecptScroll(nextTableID)
    });
}

function kitchenTableRecptScroll(tableID) {
    recptScroll("kitchen_table_" + tableID + "_");
}

function orderInEmptySection(tableID) {
    var isEmpty = false;
    
    $('#empty_orders>div').each(function() {
        if(parseInt($(this).data("table_id")) == tableID) {
            isEmpty = true;
        }
    });
    
    return isEmpty;
}

function orderInActiveSection(tableID) {
    var isActive = false;
    
    $('#active_orders>div').each(function() {
        if(parseInt($(this).data("table_id")) == tableID) {
            isActive = true;
        }
    });
    
    return isActive;
}

function orderInFilledSection(tableID) {
    var isFilled = false;
    
    $('#filled_orders>div').each(function() {
        if(parseInt($(this).data("table_id")) == tableID) {
            isFilled = true;
        }
    });
    
    return isFilled;
}

function noActiveOrders() {
    return $('#active_orders>div').length == 0;
}

function orderComplete(tableID) {
    console.log("checking order complete " + tableID);
    //have we checked off all courses in this order
    var tableCourseChecks = courseChecks[tableID];
    
    var orderComplete = true;
    
    for(var i=0; i<tableCourseChecks.length; i++) {
        console.log("course " + i + " checked? " + (tableCourseChecks[i]==true));
        orderComplete = orderComplete && tableCourseChecks[i];
    }
    
    console.log("Order complete for table " + tableID + "? " + orderComplete);
    return orderComplete;
}

function sendCourseCheck(orderLine) {
    var tableID = orderLine.parents(".kitchen_receipt_container").data("table_id");
    
    console.log("sending course check for table " + tableID);
     
    var tableCourseChecks = courseChecks[tableID];
    
    var orderFilled = false;
    
    //mark the next course as checked
    var i;
        
    for(i=0; i<tableCourseChecks.length; i++) {
        console.log("course check " + i + " " + tableCourseChecks[i]);
        if(!tableCourseChecks[i]) {
            tableCourseChecks[i] = true;
            break;
        }
    }
    
    //check if the order is complete, and if it is
    //move it to the filled_orders section
    //also, deal with case for one course
    if((i >= tableCourseChecks.length - 1) || tableCourseChecks.length == 1) {
        orderFilled = true;
    }
    
    applyCourseChecks(tableID);
    
    //send a vibrate to the employee who started the order
    var kitchenOrder = tableOrders[tableID];
    var employeeID = firstServerID(kitchenOrder);
    
    $.ajax({
        type: 'POST',
        url: 'kitchen/order_ready',
        error: function() {
            setStatusMessage("Error sending notification to user");
        },
        data: {
            employee_id : employeeID,
            table_id : tableID
        }
    });
    
    if(orderFilled) {
        console.log("Order is now filled, so sending it to filled orders!");
        $('#kitchen_receipt_container_' + tableID + ' .header').removeClass("returned");
        $('#kitchen_receipt_container_' + tableID + ' .header').addClass("being_removed");
        
        //move it to the filled section
        setTimeout(function(){
            $('#kitchen_receipt_container_' + tableID).appendTo('#filled_orders');
            if(noActiveOrders()) {
                $('#no_orders_message').show();
            }
        }, 3000);
    }
    
    //save course checks in storage
    saveCourseChecks();
}

//this applies the course checks css to the receipt
//and registers a click event to send the course check notification for each course
function applyCourseChecks(tableID) {
    console.log("Applying course checks for table " + tableID + " " + $('#kitchen_receipt_container_' + tableID + ' .order_line').length);
    var tableCourseChecks = courseChecks[tableID];
    
    var courseCheckCount = 0;
    
    //mark the next course as checked
    for(var i=0; i<tableCourseChecks.length; i++) {
        console.log("cousrse check = " + tableCourseChecks[i] + " " + (tableCourseChecks[i]==true));
        if(!tableCourseChecks[i]) {
            break;
        }
    
        courseCheckCount++;
    }
    
    console.log("marking " + courseCheckCount + " courses as checked");
    
    var receiptCourseCount = 0;
    var finishedCheckingCourses = false;
    
    //update the receipt css
    $('#kitchen_receipt_container_' + tableID + ' .order_line').each(function() {
        var orderLine = $(this);
        
        if(receiptCourseCount == courseCheckCount) {
            finishedCheckingCourses = true;
        }
        
        if(!finishedCheckingCourses) {
            orderLine.addClass("course_checked");
        
            if(orderLine.hasClass("course")) {
                receiptCourseCount++;
            }
        }
        
        console.log("applying click handler");
        
        //apply a click handler to each item to send a notification
        //remove previously bound clicks to stop multiple fires
        orderLine.unbind();
        
        orderLine.click(function() {
            sendCourseCheck($(this)); 
        });
    });
}

function saveCourseChecks() {
    //store the array into memory for reload on page reload
    storeKeyJSONValue("kitchen_course_checks", courseChecks);
}

function loadCourseChecks() {
    //load course checks from the web db
    courseChecks = retrieveStorageJSONValue("kitchen_course_checks");
    
    if(!courseChecks) {
        courseChecks = {};
    }
}

//this is called by the do clear order from call home
function tableCleared(tableID) {
    courseChecks[tableID] = new Array();
    
    //move it to the empty section
    $('#kitchen_receipt_container_' + tableID).appendTo('#empty_orders');
    
    $('#kitchen_receipt_container_' + tableID + ' .header').removeClass("being_removed");
    
    renderReceipt(tableID);
}

function orderReadyNotificationSentConfirm() {
    hideOrderReadyNotificationPopup();
//do nothing
}

function orderReadyNotificationSentCancel() {
    hideOrderReadyNotificationPopup();
//send a cancel
}

function hideOrderReadyNotificationPopup() {
    try {
        ModalPopups.Close('niceAlertContainer');
    } catch (e) {
        
    }
}