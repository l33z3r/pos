var courseChecks = {};
var orderXClicked = {};
var orderNums = {};

var kitchenOrders;

function initKitchen() {
    //hide the red x 
    $('#nav_save_button').hide();
        
    //hide the shortcut dropdown
    $('#menu_screen_shortcut_dropdown_container').hide();
    
    loadCourseChecks();
    
    kitchenOrders = {};
    
    //have to force all orders to come in from start time
    lastSyncTableOrderTime = 0;
}

function renderReceipt(tableID) {
    
    var orderToCopy; 
    
    if(tableID == 0) {
        tableID += "_" + tableOrders[0].order_num;
        orderToCopy = tableOrders[0];
        
        //make a div for this order
        $.ajax({
            url: '/kitchen/table_0_kitchen_div',
            data: {
                'id' : tableID
            },
            async: false,
            success: function(data) {
                //put this order to the end of the active orders queue
                $('#active_orders').append(data);
            }
        });    
    } else {
        orderToCopy = tableOrders[tableID];
    }
    
    //need to copy the tableOrder to the kitchenOrders array 
    //so we can strip products and do auto coursing on it
    //copy over the order
    var copiedOrder = {};
    var theCopiedOrder = $.extend(true, copiedOrder, orderToCopy);
    kitchenOrders[tableID] = theCopiedOrder;
    
    var nextKitchenOrder = kitchenOrders[tableID];
    
    //strip products that do not belong on this screen
    stripProducts(nextKitchenOrder);
    doAutoCoursing(nextKitchenOrder);
    
    if(!courseChecks[tableID]) {
        courseChecks[tableID] = new Array();
    } 
    
    if(!orderXClicked[tableID]) {
        orderXClicked[tableID] = false;
    }
    
    if(!orderNums[tableID]) {
        orderNums[tableID] = nextKitchenOrder.order_num;
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
     
    var allOrderItemsRecptHTML = getAllOrderItemsReceiptHTML(nextKitchenOrder, false, false, false);
     
    $('#kitchen_table_' + tableID + '_till_roll').html($('#kitchen_table_' + tableID + '_till_roll').html() + allOrderItemsRecptHTML);
    
    //apply the course checks
    applyCourseChecks(tableID);
    
    //check is this order completed, and move it to the filled orders if it is    
    var movedToFilled = false;
    
    if(orderComplete(tableID)) {
        if(orderInFilledSection(tableID)) {
            //something must have changed in the order so put it back into the active orders
            console.log("something changed in order for tableID: " + tableID + " moving it back to the active orders");
            
            $('#hide_order_button_' + tableID).show();
            
            $('#kitchen_receipt_container_' + tableID + ' .header').removeClass("being_removed");
            $('#kitchen_receipt_container_' + tableID + ' .header').addClass("returned");
            
            $('#kitchen_receipt_container_' + tableID).appendTo('#active_orders');
        } else {
            
            $('#hide_order_button_' + tableID).show();
            
            //only move it if the red x is not showing, so that the chef can hit the red x to hide it
            if(orderXClicked[tableID]) {
                console.log("moving completed order for tableID: " + tableID + " into filled orders");
                $('#kitchen_receipt_container_' + tableID).appendTo('#filled_orders');
            }
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
    setTimeout(function() {
        recptScroll("kitchen_table_" + tableID + "_");
    }, 20);
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
    
    //mark the next course as checked only if it was not already done (Rebuzz!)
    if(!orderLine.hasClass("course_checked")) {
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
    }
    
    //send a vibrate to the employee who started the order
    var kitchenOrder = kitchenOrders[tableID];
    var terminalID = kitchenOrder.items[orderLine.data("item_number")-1].terminal_id;
    var employeeID = firstServerID(kitchenOrder);
    
    var theTableID = tableID;
    
    if(tableID.startsWith("0_")) {
        theTableID = tableID.split("_")[0];
    }
    
    $.ajax({
        type: 'POST',
        url: 'kitchen/order_ready',
        error: function() {
            setStatusMessage("Error sending notification to user");
        },
        data: {
            employee_id : employeeID,
            terminal_id : terminalID,
            table_id : theTableID
        }
    });
    
    if(orderFilled) {
        //show the x button
        $('#hide_order_button_' + tableID).show();
    }
    
    //save course checks in storage
    saveCourseChecks();
}

function hideTableOrder(tableID) {
    orderXClicked[tableID] = true;
    saveCourseChecks();
    sendOrderToCompleted(tableID);
}

function sendOrderToCompleted(tableID) {
    console.log("Sending order for table: " + tableID + " to filled orders!");
    $('#kitchen_receipt_container_' + tableID + ' .header').removeClass("returned");
    $('#kitchen_receipt_container_' + tableID + ' .header').addClass("being_removed");
        
    //move it to the filled section
    $('#kitchen_receipt_container_' + tableID).appendTo('#filled_orders');
    if(noActiveOrders()) {
        $('#no_orders_message').show();
    }
    
    $('#hide_order_button_' + tableID).hide();
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
    storeKeyJSONValue("kitchen_order_x_clicked", orderXClicked);
    storeKeyJSONValue("order_nums", orderNums);
}

function loadCourseChecks() {
    //load course checks from the web db
    courseChecks = retrieveStorageJSONValue("kitchen_course_checks");
    orderXClicked = retrieveStorageJSONValue("kitchen_order_x_clicked");
    orderNumbs = retrieveStorageJSONValue("order_nums");
    
    if(!courseChecks) {
        courseChecks = {};
    }
    
    if(!orderXClicked) {
        orderXClicked = {};
    }
    
    if(!orderNums) {
        orderXNums = {};
    }
}

//this is called by the do clear order from call home
function tableCleared(tableID, orderNum) {
    console.log("table clear request!!! " + tableID + " ORDER NUM: " + orderNum);
    
    //it order_num is null, then we clear as the order has been cashed out
    //if order num exists then there is a new order on that table so leave it alone
    if(orderNums[tableID] != orderNum) {
        console.log("Not current order");
        return;
    }
    
    orderNums[tableID] = null;
    
    console.log("clearing table order " + tableID);
    
    courseChecks[tableID] = new Array();
    orderXClicked[tableID] = false;
    
    kitchenOrders[tableID] = null;
    
    saveCourseChecks();
    
    //move it to the empty section
    $('#kitchen_receipt_container_' + tableID).appendTo('#empty_orders');
    
    $('#kitchen_receipt_container_' + tableID + ' .header').removeClass("being_removed");
    
    $('#hide_order_button_' + tableID).hide();
    
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

function stripProducts(order) {
    var newItems = new Array();
    
    for(var i=0; i<order.items.length; i++) {
        var nextItem = order.items[i];
        
        var itemScreens = nextItem.product.kitchen_screens;
            
        if((typeof itemScreens != "undefined") && itemScreens.length > 0) {
            var screensArray = itemScreens.split(",");
                
            if($.inArray(terminalID.toLowerCase(), screensArray) != -1) {
                //keep it
                newItems.push(nextItem);
            }
        } else {
            //check category printers
            var categoryId = nextItem.product.category_id;
            
            if(categoryId != null) {
                var categoryScreens = categories[categoryId].kitchen_screens;
            
                if((typeof categoryScreens != "undefined") && categoryScreens.length > 0) {
                    var categoryScreensArray = categoryScreens.split(",");
                
                    if($.inArray(terminalID.toLowerCase(), categoryScreensArray) != -1)  {
                        //keep it
                        newItems.push(nextItem);
                    }
                }
            }
        }
    }
    
    order.items = newItems;
}
