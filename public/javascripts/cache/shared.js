
var lastSyncedOrder=null;var orderInProcess=false;var isTableZeroOrder=false;function orderButtonPressed(){var order=getCurrentOrder();var autoCovers=false;if(globalAutoPromptForCovers){autoCovers=true;}else{for(var j=0;j<order.items.length;j++){var item=order.items[j];if(order.items[j].synced&&selectedTable!=0){continue;}
var categoryId=item.product.category_id;if(categoryId!=null){if(categories[categoryId].prompt_for_covers){autoCovers=true;break;}}}}
if(autoCovers&&parseInt(order.covers)==-1){order.covers=0;manualCoversPrompt=false;doAutoCovers();}else{doSyncTableOrder();}}
function doSyncTableOrder(){if(cacheDownloading){cacheDownloadingPopup();return;}
if(!appOnline){if(inLargeInterface()){if(selectedTable!=previousOrderTableNum&&selectedTable!=tempSplitBillTableNum){if(selectedTable==0){if(!isTableZeroOrder){return;}else{order=lastTableZeroOrder;}}else{order=tableOrders[selectedTable];}}
checkForItemsToPrint(order,current_user_nickname);}
niceAlert("Cannot contact server, ordering is disabled until connection re-established! Orders should still print locally.");return;}
var order=null;if(!isTableZeroOrder&&!ensureLoggedIn()){return;}
if(!callHomePollInitSequenceComplete){niceAlert("Downloading data from server, please wait.");return;}
if(orderInProcess){niceAlert("There is an order being processed, please wait.");return;}
if(selectedTable==previousOrderTableNum){setStatusMessage("Not valid for reopened orders!");return;}else if(selectedTable==tempSplitBillTableNum){setStatusMessage("Not valid for split orders!");return;}else if(selectedTable==0){if(!isTableZeroOrder){setStatusMessage("You must move this order to a table");startTransferOrderMode();return;}else{lastOrderSaleText="Last Sale";order=lastTableZeroOrder;for(var i=0;i<order.items.length;i++){order.items[i].synced=false;}}}else{lastOrderSaleText="Last Order";order=tableOrders[selectedTable];if(order.items.length==0){setStatusMessage("No items present in current table order.");return;}}
if(inLargeInterface()){checkForItemsToPrint(order,current_user_nickname);}
setStatusMessage("Sending Order.");orderInProcess=true;lastSyncedOrder=order;order.table=tables[selectedTable].label;var checkForShowServerAddedText=true;for(var i=0;i<order.items.length;i++){if(checkForShowServerAddedText&&!order.items[i].synced&&!order.items[i].is_void){order.items[i].showServerAddedText=true;checkForShowServerAddedText=false;}}
var copiedOrder={};var copiedOrderForSend=$.extend(true,copiedOrder,order);if(inMediumInterface()){copiedOrderForSend.needsPrintDelegate=true;}
tableOrderData={tableID:selectedTable,orderData:copiedOrderForSend}
var userId=current_user_id;if(isTableZeroOrder){userId=last_user_id;}
$.ajax({type:'POST',url:'/sync_table_order',error:syncTableOrderFail,data:{tableOrderData:tableOrderData,employee_id:userId,lastSyncTableOrderTime:lastSyncTableOrderTime}});}
function finishSyncTableOrder(){lastOrderSentTime=clueyTimestamp();lastOrderTable=selectedTable;var order=lastSyncedOrder;for(var i=0;i<order.items.length;i++){order.items[i]['synced']=true;}
storeTableOrderInStorage(current_user_id,selectedTable,order);orderInProcess=false;postDoSyncTableOrder();}
function syncTableOrderFail(){orderInProcess=false;niceAlert("Order not sent, no connection, please try again");}
function retryTableOrder(){orderInProcess=false;niceAlert("An order for this table was sent at the same time, PLEASE SEND ORDER AGAIN.");}
function removeLastOrderItem(){currentSelectedReceiptItemEl=getSelectedOrLastReceiptItem();if(currentSelectedReceiptItemEl){removeSelectedOrderItem();}
currentSelectedReceiptItemEl=null;}
function quickSale(){unorderedItemsPopup('doQuickSale()',true);}
function doQuickSale(){if(currentOrderEmpty()){setStatusMessage("No order present to total!",true,true);return;}
if(!ensureLoggedIn()){return;}
applyDefaultServiceChargePercent();cashTendered=0;splitPayments={};paymentMethod=cashPaymentMethodName;doTotalFinal();}
function totalPressed(){unorderedItemsPopup('doTotal(true);',true);}
function printBillPressed(){var orderSynced=true;var order=getCurrentOrder();for(var i=0;i<order.items.length;i++){if(!order.items[i].synced){orderSynced=false;break;}}
if(!orderSynced){niceAlert("You cannot print a bill until you order all items on the receipt. You can also delete unordered items!");return;}
printBill();}
function printBill(){if(currentOrderEmpty()){setStatusMessage("No order present!",true,true);return;}
if(!ensureLoggedIn()){return;}
applyDefaultServiceChargePercent();totalOrder=getCurrentOrder();if(orderEmpty(totalOrder)){setStatusMessage("No order present");return;}
var printVat=false;printReceipt(fetchFinalReceiptHTML(true,false,printVat),true);}
function applyDefaultServiceChargePercent(){serviceCharge=(defaultServiceChargePercent*parseFloat(getCurrentOrder().total))/100;saveServiceCharge(false);}
function startTransferOrderMode(){if(!appOnline){niceAlert("Server cannot be contacted. Transfering orders is disabled until connection re-established.");return;}
if(!callHomePollInitSequenceComplete){niceAlert("Downloading data from server, please wait.");return;}
var order=getCurrentOrder();if(order==null||order.items.length==0){setStatusMessage("No items present in current table order.");return;}
var orderSynced=true;for(var i=0;i<order.items.length;i++){if(!order.items[i].synced){orderSynced=false;break;}}
if(!orderSynced&&selectedTable!=0){niceAlert("All items in the order must be ordered before you can transfer. You can also delete un-ordered items.");return;}
inTransferOrderMode=true;showTablesScreen();setStatusMessage("Please choose a free table to transfer this order to.",false,false);}
function startTransferOrderItemMode(){if(!appOnline){niceAlert("Server cannot be contacted. Transfering orders is disabled until connection re-established.");return;}
if(!callHomePollInitSequenceComplete){niceAlert("Downloading data from server, please wait.");return;}
if(selectedTable==previousOrderTableNum){niceAlert("Not valid for reopened orders! You must transfer the whole order to a table.");return;}else if(selectedTable==tempSplitBillTableNum){niceAlert("Not valid for split orders! You must transfer the whole order to a table.");return;}
var itemNumber=currentSelectedReceiptItemEl.data("item_number");var order=getCurrentOrder();if(!order.items[itemNumber-1]['synced']){niceAlert("Only ordered items can be transfered.");return;}
inTransferOrderItemMode=true;hideBubblePopup(editItemPopupAnchor);showTablesScreen();setStatusMessage("Please choose a table to transfer this order item to.",false,false);}
function toggleMenuItemDoubleMode(){setMenuItemDoubleMode(!menuItemDoubleMode);}
function setMenuItemDoubleMode(turnOn){if(turnOn){setMenuItemHalfMode(false);menuItemDoubleMode=true;$('.button[id=sales_button_'+toggleMenuItemDoubleModeButtonID+'], .button[id=admin_screen_button_'+toggleMenuItemDoubleModeButtonID+']').addClass("selected");}else{menuItemDoubleMode=false;$('.button[id=sales_button_'+toggleMenuItemDoubleModeButtonID+'], .button[id=admin_screen_button_'+toggleMenuItemDoubleModeButtonID+']').removeClass("selected");}}
function toggleMenuItemHalfMode(){setMenuItemHalfMode(!menuItemHalfMode);}
function setMenuItemHalfMode(turnOn){if(turnOn){setMenuItemDoubleMode(false);menuItemHalfMode=true;$('.button[id=sales_button_'+toggleMenuItemHalfModeButtonID+'], .button[id=admin_screen_button_'+toggleMenuItemHalfModeButtonID+']').addClass("selected");}else{menuItemHalfMode=false;$('.button[id=sales_button_'+toggleMenuItemHalfModeButtonID+'], .button[id=admin_screen_button_'+toggleMenuItemHalfModeButtonID+']').removeClass("selected");}}
function toggleMenuItemStandardPriceOverrideMode(){setMenuItemStandardPriceOverrideMode(!menuItemStandardPriceOverrideMode);}
function setMenuItemStandardPriceOverrideMode(turnOn){if(turnOn){menuItemStandardPriceOverrideMode=true;$('.button[id=sales_button_'+toggleMenuItemStandardPriceOverrideModeButtonID+'], .button[id=admin_screen_button_'+toggleMenuItemStandardPriceOverrideModeButtonID+']').addClass("selected");}else{menuItemStandardPriceOverrideMode=false;$('.button[id=sales_button_'+toggleMenuItemStandardPriceOverrideModeButtonID+'], .button[id=admin_screen_button_'+toggleMenuItemStandardPriceOverrideModeButtonID+']').removeClass("selected");}}
function deleteCurrentOrder(){if(!appOnline){niceAlert("Server cannot be contacted. Deleting orders across the system is disabled until connection re-established.");return;}
if(selectedTable==previousOrderTableNum){setStatusMessage("Not valid for reopened orders!");return;}else if(selectedTable==tempSplitBillTableNum){setStatusMessage("Not valid for split orders!");return;}else if(selectedTable==0){setStatusMessage("Only valid for table orders!");return;}
var doIt=confirm("Are you sure you want to delete this order from the system?");if(doIt){var order_num=getCurrentOrder().order_num;clearOrder(selectedTable);$.ajax({type:'POST',url:'/delete_table_order',complete:function(){niceAlert("Order has been deleted from the system.");},data:{table_id:selectedTable,order_num:order_num}});}}
function chargeCardShortcut(){if(currentOrderEmpty()){setStatusMessage("No order present!",true,true);return;}
doTotal();chargeCreditCard();}
function toggleProductInfoPopup(){setProductInfoPopup(!productInfoPopupMode);}
function setProductInfoPopup(turnOn){if(turnOn){productInfoPopupMode=true;$('.button[id=sales_button_'+toggleProductInfoButtonID+'], .button[id=admin_screen_button_'+toggleProductInfoButtonID+']').addClass("selected");}else{productInfoPopupMode=false;$('.button[id=sales_button_'+toggleProductInfoButtonID+'], .button[id=admin_screen_button_'+toggleProductInfoButtonID+']').removeClass("selected");}}
window.onerror=function(error,url,lineNumber){console.log("Sending error in javascript to server EROR: "+error+" URL: "+url+" LINE NUMBER: "+lineNumber+" TERMINAL: "+terminalID);var errorData={};if(typeof(error)=='undefined'){errorMessage="NONE SPECIFIED";}else if(typeof(error)=='object'){errorMessage="";for(var key in error){if(error.hasOwnProperty(key)){errorMessage+=(key+"="+error[key]+"------");}}}else{errorMessage=error;}
errorMessage=escape(errorMessage);var commonData={error_message:errorMessage,file:((typeof(url)=='undefined')?"NONE SPECIFIED":url),line_number:((typeof(lineNumber)=='undefined')?"NONE SPECIFIED":lineNumber),terminal_id:terminalID,current_user_id:current_user_id,current_user_nickname:current_user_nickname,is_touch_device:((typeof(isTouchDevice)=='undefined')?false:isTouchDevice()),in_mobile_context:((typeof(inMobileContext)=='undefined')?false:inMobileContext()),page_title:$('#nav_title').html()}
if(inLargeInterface()){var largeScreenInterfaceData={is_kitchen_screen:((typeof(inKitchenContext)=='undefined')?false:inKitchenContext()),current_screen_is_menu:((typeof(currentScreenIsMenu)=='undefined')?false:currentScreenIsMenu()),current_screen_is_login:((typeof(currentScreenIsLogin)=='undefined')?false:currentScreenIsLogin()),current_screen_is_totals:((typeof(currentScreenIsTotals)=='undefined')?false:currentScreenIsTotals()),current_screen_is_cash_reports:((typeof(currentScreenIsCashReports)=='undefined')?false:currentScreenIsCashReports()),in_admin_context:((typeof(inAdminContext=='undefined'))?false:inAdminContext())}
errorData=$.extend(commonData,largeScreenInterfaceData);}else if(inMediumInterface()){var mediumScreenInterfaceData={current_screen_is_menu:((typeof(currentScreenIsMenu)=='undefined')?false:currentScreenIsMenu),current_screen_is_receipt:((typeof(currentScreenIsReceipt)=='undefined')?false:currentScreenIsReceipt),current_screen_is_functions:((typeof(currentScreenIsFunctions)=='undefined')?false:currentScreenIsFunctions),current_screen_is_settings:((typeof(currentScreenIsSettings)=='undefined')?false:currentScreenIsSettings)}
errorData=$.extend(commonData,mediumScreenInterfaceData);}
$.ajax({url:"/js_error_log.js",type:"POST",data:errorData});hideSpinner();}
var cacheDownloading=false;var appCache=window.applicationCache;var cacheProperties={filesDownloaded:0,totalFiles:0};$(window).bind("online offline",function(event){setConnectionStatus(navigator.onLine);});$(appCache).bind("checking",function(event){console.log("Checking for manifest");});$(appCache).bind("noupdate",function(event){console.log("No cache updates");});$(appCache).bind("downloading",function(event){console.log("Downloading cache");cacheDownloading=true;cacheDownloadStarted();getTotalFiles();});$(appCache).bind("progress",function(event){displayProgress();});$(appCache).bind("cached",function(event){console.log("All files downloaded");niceAlert("App has been cached successfully!");cacheDownloading=false;cacheDownloadReset();});$(appCache).bind("updateready",function(event){console.log("New cache available");appCache.swapCache();alertCacheReloadRequest();});$(appCache).bind("obsolete",function(event){console.log("Manifest cannot be found");});$(appCache).bind("error",function(event){niceAlert("An error occurred while downloading the latest cache. You may be using a stale version. Try reloading the app.");cacheDownloading=false;cacheDownloadReset();});function getTotalFiles(){cacheProperties.filesDownloaded=0;cacheProperties.totalFiles=0;$.ajax({type:"get",url:"./cache_manifest",dataType:"text",cache:false,success:function(content){content=content.replace(new RegExp("(NETWORK|FALLBACK):"+"((?!(NETWORK|FALLBACK|CACHE):)[\\w\\W]*)","gi"),"");content=content.replace(new RegExp("#[^\\r\\n]*(\\r\\n?|\\n)","g"),"");content=content.replace(new RegExp("CACHE MANIFEST\\s*|\\s*$","g"),"");content=content.replace(new RegExp("[\\r\\n]+","g"),"#");var totalFiles=content.split("#").length;cacheProperties.totalFiles=(totalFiles+1);}});}
function displayProgress(){cacheProperties.filesDownloaded++;if(cacheProperties.totalFiles){var percentComplete=Math.round(((cacheProperties.filesDownloaded*100.0)/cacheProperties.totalFiles));if(percentComplete>100){percentComplete=100;}
$("#cache_status").text("Cache DL: "+percentComplete+"%");}}
var cacheUpdatePollIntervalSeconds=120;var cacheUpdatePollIntervalMillis=cacheUpdatePollIntervalSeconds*1000;function startCacheUpdateCheckPoll(){setTimeout(cacheUpdateCheckPoll,cacheUpdatePollIntervalMillis);}
function cacheUpdateCheckPoll(){if(!cacheDownloading){console.log("Checking for cache update");window.applicationCache.update();}
setTimeout(cacheUpdateCheckPoll,cacheUpdatePollIntervalMillis);}
var currentMenuPage;var currentMenuPageId;var currentMenuSubPageId;var menuItemDoubleMode=false;var menuItemHalfMode=false;var productInfoPopupMode=false;var menuItemStandardPriceOverrideMode=false;var currentMenuItemQuantity="";var selectedTable=0;var currentOrder=null;var tableOrders=new Array();var currentTableOrder=null;var totalOrder=null;var currentOrderItem;var paymentMethod=null;var serviceCharge=0;var cashback=0;var defaultServiceChargePercent=0;var currentSelectedMenuItemElement;var oiaIsAdd=true;var currentSelectedReceiptItemEl;var inTransferOrderMode=false;var transferOrderInProgress=false;var inTransferOrderItemMode=false;var transferOrderItemInProgress=false;var modifierGridXSize;var modifierGridYSize;var currentModifierGridIdForProduct;var previousOrderTableNum=-1;var tempSplitBillTableNum=-2;var globalPriceLevel=null;var globalPriceLevelKey="global_price_level";var lastOrderSentTime=null;var lastOrderTable=null;var lastSaleObj;var mandatoryFooterMessageHTML=null;var masterOrdersUserId=-1;var tableOrderItemsToMerge=null;var sendOrderAfterCovers=false;function getCurrentOrder(){if(selectedTable==0){return currentOrder;}else{return tableOrders[selectedTable];}
return null;}
var newlySyncedItems;function doReceiveTableOrderSync(recvdTerminalID,tableID,tableLabel,terminalEmployeeID,terminalEmployee,tableOrderDataJSON){convertOrderItemStringsToBooleans(tableOrderDataJSON);var savedTableID=selectedTable;var savedServiceCharge=serviceCharge;var savedCashback=cashback;for(var i=0;i<employees.length;i++){nextUserIDToSyncWith=employees[i].id;if(!userHasUniqueTableOrder(nextUserIDToSyncWith,tableID)){continue;}
doTableOrderSync(recvdTerminalID,tableID,tableLabel,terminalEmployee,tableOrderDataJSON,nextUserIDToSyncWith);}
doTableOrderSync(recvdTerminalID,tableID,tableLabel,terminalEmployee,tableOrderDataJSON,masterOrdersUserId);if(inKitchenContext()){renderReceipt(tableID);}
if(printDelegateTerminalID==terminalID&&recvdTerminalID!=terminalID&&tableOrderDataJSON.needsPrintDelegate){if(lastSyncTableOrderTime>lastPrintCheckTime){getTableOrderFromStorage(current_user_id,tableID);var copiedOrder={};var copiedOrderForPrintCheck=$.extend(true,copiedOrder,tableOrders[tableID]);copiedOrderForPrintCheck.items=newlySyncedItems;checkForItemsToPrint(copiedOrderForPrintCheck,terminalEmployee);}}
if(tableID!=0){newlyAdded=addActiveTable(tableID);renderActiveTables();}
if(current_user_id){getTableOrderFromStorage(current_user_id,savedTableID);doSelectTable(savedTableID);}
serviceCharge=savedServiceCharge;cashback=savedCashback;checkUpdateOpenOrdersScreen();}
function doTableOrderSync(recvdTerminalID,tableID,tableLabel,terminalEmployee,tableOrderDataJSON,nextUserIDToSyncWith){syncOrderItems=new Array();newlySyncedItems=new Array();for(var itemKey in tableOrderDataJSON.items){var theItem=tableOrderDataJSON.items[itemKey];if(typeof(theItem.oia_items)!="undefined"){var newOIAItems=new Array();for(var oiaItemKey in theItem.oia_items){var nextOIA=theItem.oia_items[oiaItemKey];nextOIA.is_add=(nextOIA.is_add.toString()=="true"?true:false);nextOIA.is_note=(nextOIA.is_note.toString()=="true"?true:false);nextOIA.hide_on_receipt=(nextOIA.hide_on_receipt.toString()=="true"?true:false);nextOIA.is_addable=(nextOIA.is_addable.toString()=="true"?true:false);nextOIA.abs_charge=parseFloat(nextOIA.abs_charge);newOIAItems.push(nextOIA);}
theItem.oia_items=newOIAItems;}
var copiedOrderItem={};var copiedOrderItem2={};var copiedOrderItemForStore=$.extend(true,copiedOrderItem,theItem);var copiedOrderItemForPrint=$.extend(true,copiedOrderItem2,theItem);if(!copiedOrderItemForStore.synced){newlySyncedItems.push(copiedOrderItemForPrint);copiedOrderItemForStore.synced="true";}
syncOrderItems.push(copiedOrderItemForStore);}
getTableOrderFromStorage(nextUserIDToSyncWith,tableID);existingOrderItems=tableOrders[tableID].items;for(var i=0;i<existingOrderItems.length;i++){if(existingOrderItems[i].synced){existingOrderItems.splice(i,1);i--;}}
newOrderItems=new Array();syncOrderItemsIndex=0;existingOrderItemsIndex=0;loopLength=syncOrderItems.length+existingOrderItems.length;for(var i=0;i<loopLength;i++){if(syncOrderItemsIndex==syncOrderItems.length){newOrderItems.push(existingOrderItems[existingOrderItemsIndex]);existingOrderItemsIndex++;}else if(existingOrderItemsIndex==existingOrderItems.length){newOrderItems.push(syncOrderItems[syncOrderItemsIndex]);syncOrderItemsIndex++;}else if(syncOrderItems[syncOrderItemsIndex].time_added<=existingOrderItems[existingOrderItemsIndex].time_added){newOrderItems.push(syncOrderItems[syncOrderItemsIndex]);syncOrderItemsIndex++;}else if(syncOrderItems[syncOrderItemsIndex].time_added>existingOrderItems[existingOrderItemsIndex].time_added){newOrderItems.push(existingOrderItems[existingOrderItemsIndex]);existingOrderItemsIndex++;}}
tableOrders[tableID].items=newOrderItems;for(var z=0;i<tableOrders[tableID].items.length;z++){tableOrders[tableID].items[z].itemNumber=z+1;}
for(var z=0;i<tableOrders[tableID].items.length;z++){applyExistingDiscountToOrderItem(tableOrders[tableID],tableOrders[tableID].items[z].itemNumber);}
tableOrders[tableID].order_num=tableOrderDataJSON.order_num;var clientName=tableOrderDataJSON.client_name;tableOrders[tableID].client_name=clientName;if(clientName.length>0){$('#table_label_'+tableID).html(tables[tableID].label+" ("+clientName+")");}
var covers=tableOrderDataJSON.covers;tableOrders[tableID].covers=covers;tableOrders[tableID].discount_percent=tableOrderDataJSON.discount_percent;if(typeof tableOrderDataJSON.service_charge!='undefined'){tableOrders[tableID].service_charge=parseFloat(tableOrderDataJSON.service_charge);}
if(typeof tableOrderDataJSON.cashback!='undefined'){tableOrders[tableID].cashback=parseFloat(tableOrderDataJSON.cashback);}
if(typeof tableOrderDataJSON.void_order_id!='undefined'){tableOrders[tableID].void_order_id=tableOrderDataJSON.void_order_id;}
tableOrders[tableID].courses=tableOrderDataJSON.courses;if(tableOrders[tableID].courses==""){tableOrders[tableID].courses=new Array();}
for(var j=0;j<tableOrders[tableID].courses.length;j++){tableOrders[tableID].courses[j]=parseInt(tableOrders[tableID].courses[j]);}
tableOrders[tableID].table=tableOrderDataJSON.table;calculateOrderTotal(tableOrders[tableID]);storeTableOrderInStorage(nextUserIDToSyncWith,tableID,tableOrders[tableID]);if(tableID!=0&&tableID==selectedTable&&nextUserIDToSyncWith==current_user_id){loadReceipt(tableOrders[tableID],true);}}
function checkForItemsToPrint(order,serverNickname){if(!inLargeInterface()){niceAlert("Not yet implemented for mobiles!");return;}
var printerOrders={};var items=order.items;for(i=0;i<items.length;i++){var theItem=items[i];var isItemSynced=theItem.synced;var isItemVoid=theItem.is_void;if(!isItemSynced&&!isItemVoid){var itemPrinters=theItem.product.printers;if((typeof itemPrinters!="undefined")&&itemPrinters.length>0){var blockedPrinter=false;var itemBlockedPrinters=theItem.product.blocked_printers;if((typeof itemBlockedPrinters!="undefined")&&itemBlockedPrinters.length>0){var blockedPrintersArray=itemBlockedPrinters.split(",");blockedPrinter=$.inArray(terminalID.toLowerCase(),blockedPrintersArray)!=-1;}
if(blockedPrinter){continue;}
var printersArray=itemPrinters.split(",");for(j=0;j<printersArray.length;j++){var nextPrinterID=printersArray[j];if(typeof(printerOrders[nextPrinterID])=='undefined'){printerOrders[nextPrinterID]=new Array();}
printerOrders[nextPrinterID].push(theItem);}}else{var categoryId=theItem.product.category_id;if(categoryId!=null){var categoryPrinters=categories[categoryId].printers;if((typeof categoryPrinters!="undefined")&&categoryPrinters.length>0){var blockedCategoryPrinter=false;var categoryBlockedPrinters=categories[categoryId].blocked_printers;if((typeof categoryBlockedPrinters!="undefined")&&categoryBlockedPrinters.length>0){var blockedCategoryPrintersArray=categoryBlockedPrinters.split(",");blockedCategoryPrinter=$.inArray(terminalID.toLowerCase(),blockedCategoryPrintersArray)!=-1;}
if(blockedCategoryPrinter){continue;}
var categoryPrintersArray=categoryPrinters.split(",");for(j=0;j<categoryPrintersArray.length;j++){nextPrinterID=categoryPrintersArray[j];if(typeof(printerOrders[nextPrinterID])=='undefined'){printerOrders[nextPrinterID]=new Array();}
printerOrders[nextPrinterID].push(theItem);}}}}}}
for(var printerID in printerOrders){var itemsToPrint=printerOrders[printerID];var itemsToPrintOrder={'items':itemsToPrint}
doAutoCoursing(itemsToPrintOrder);printItemsFromOrder(printerID,serverNickname,order,itemsToPrint);}}
function convertOrderItemStringsToBooleans(tableOrderDataJSON){for(var itemKey in tableOrderDataJSON.items){var theItem=tableOrderDataJSON.items[itemKey];if(theItem.synced){theItem.synced=(theItem.synced.toString()=="true"?true:false);}
if(theItem.product.show_price_on_receipt){theItem.product.show_price_on_receipt=(theItem.product.show_price_on_receipt.toString()=="true"?true:false);}
if(theItem.showServerAddedText){theItem.showServerAddedText=(theItem.showServerAddedText.toString()=="true"?true:false);}
if(theItem.product.hide_on_printed_receipt){theItem.product.hide_on_printed_receipt=(theItem.product.hide_on_printed_receipt.toString()=="true"?true:false);}
if(theItem.product.category_id=="null"){theItem.product.category_id=null;}
if(theItem.is_course){theItem.is_course=(theItem.is_course.toString()=="true"?true:false);}
if(theItem.show_course_label){theItem.show_course_label=(theItem.show_course_label.toString()=="true"?true:false);}
if(theItem.is_void){theItem.is_void=(theItem.is_void.toString()=="true"?true:false);}
if(typeof(theItem.is_double)!='undefined'){theItem.is_double=(theItem.is_double.toString()=="true"?true:false);}else{theItem.is_double=false;}
if(typeof(theItem.is_half)!='undefined'){theItem.is_half=(theItem.is_half.toString()=="true"?true:false);}else{theItem.is_half=false;}}}
function doReceiveClearTableOrder(recvdTerminalID,tableID,orderNum,tableLabel,terminalEmployeeID,terminalEmployee){var savedTableID=selectedTable;var savedServiceCharge=serviceCharge;var savedCashback=cashback;for(var i=0;i<employees.length;i++){nextUserIDToSyncWith=employees[i].id;if(!userHasUniqueTableOrder(nextUserIDToSyncWith,tableID)){continue;}
doClearTableOrder(recvdTerminalID,tableID,tableLabel,terminalEmployee,nextUserIDToSyncWith);}
if(tableID!=0){doClearTableOrder(recvdTerminalID,tableID,tableLabel,terminalEmployee,masterOrdersUserId);}
removeActiveTable(tableID);renderActiveTables();if(current_user_id){getTableOrderFromStorage(current_user_id,savedTableID);doSelectTable(savedTableID);}
serviceCharge=savedServiceCharge;cashback=savedCashback;}
function doClearTableOrder(recvdTerminalID,tableID,tableLabel,terminalEmployee,nextUserIDToSyncWith){savedTableID=selectedTable;getTableOrderFromStorage(nextUserIDToSyncWith,tableID);tableOrders[tableID]=buildInitialOrder();clearTableOrderInStorage(nextUserIDToSyncWith,tableID);if(tableID==selectedTable&&nextUserIDToSyncWith==current_user_id){loadReceipt(tableOrders[tableID],true);}
$('#table_label_'+tableID).html(tables[tableID].label);}
function applyExistingDiscountToOrderItem(order,itemNumber){applyDiscountToOrderItem(order,itemNumber,-1);}
function modifyOrderItem(order,itemNumber,newQuantity,newPricePerUnit,newCourseNum,is_void){targetOrderItem=order.items[itemNumber-1];targetOrderItem.amount=newQuantity;targetOrderItem.product_price=newPricePerUnit;targetOrderItem.product.course_num=newCourseNum;if(typeof(is_void)=='undefined'){is_void=false;}
targetOrderItem.is_void=is_void;if(targetOrderItem.is_void){targetOrderItem.void_employee_id=current_user_id;}
if(targetOrderItem.pre_discount_price){targetOrderItem.pre_discount_price=newPricePerUnit*newQuantity;}else{targetOrderItem.total_price=newPricePerUnit*newQuantity;}
if(targetOrderItem.modifier){if(targetOrderItem.pre_discount_price){targetOrderItem.pre_discount_price+=targetOrderItem.modifier.price*newQuantity;}else{targetOrderItem.total_price+=targetOrderItem.modifier.price*newQuantity;}}
if(targetOrderItem.oia_items){for(i=0;i<targetOrderItem.oia_items.length;i++){if(targetOrderItem.pre_discount_price){if(targetOrderItem.oia_items[i].is_add){targetOrderItem.pre_discount_price+=targetOrderItem.oia_items[i].abs_charge*newQuantity;console.log("pdp: "+(targetOrderItem.oia_items[i].abs_charge));}else{targetOrderItem.pre_discount_price-=targetOrderItem.oia_items[i].abs_charge*newQuantity;}}else{if(targetOrderItem.oia_items[i].is_add){targetOrderItem.total_price+=targetOrderItem.oia_items[i].abs_charge*newQuantity;console.log("pdp: "+(targetOrderItem.oia_items[i].abs_charge));}else{targetOrderItem.total_price-=targetOrderItem.oia_items[i].abs_charge*newQuantity;}}}}
targetOrderItem.total_price=roundNumber(parseFloat(targetOrderItem.total_price),2);applyExistingDiscountToOrderItem(order,itemNumber);calculateOrderTotal(order);return order;}
function applyDiscountToOrderItem(order,itemNumber,amount){amount=parseFloat(amount);if(itemNumber==-1){orderItem=order.items[order.items.length-1];}else{orderItem=order.items[itemNumber-1];}
if(amount==-1){if(!orderItem['discount_percent']){return;}
amount=orderItem['discount_percent']}else{orderItem['discount_percent']=amount;}
if(orderItem['pre_discount_price']){oldPrice=orderItem['pre_discount_price'];}else{oldPrice=orderItem['total_price'];orderItem['pre_discount_price']=oldPrice;}
preDiscountPrice=orderItem['pre_discount_price'];newPrice=preDiscountPrice-((preDiscountPrice*amount)/100);orderItem['total_price']=newPrice;orderItem['total_price']=roundNumber(orderItem['total_price'],2);calculateOrderTotal(order);}
function calculateOrderTotal(order){if(!order)return;var orderTotal=0;for(var i=0;i<order.items.length;i++){item=order.items[i];if(!item.is_void){orderTotal+=parseFloat(item['total_price']);}}
order['total']=roundNumber(orderTotal,2);discountAmount=order['discount_percent'];if(discountAmount){oldPrice=order['pre_discount_price']=orderTotal;newPrice=oldPrice-((oldPrice*discountAmount)/100);order['total']=newPrice;}}
function initTouchRecpts(){var receiptScrollerOpts=null;$('#mobile_terminal_till_roll').touchScroll(receiptScrollerOpts);$('#mobile_server_till_roll').touchScroll(receiptScrollerOpts);$('#mobile_table_till_roll').touchScroll(receiptScrollerOpts);$('.large_interface #till_roll').touchScroll(receiptScrollerOpts);$('.large_interface #login_till_roll').touchScroll(receiptScrollerOpts);$('.large_interface #totals_till_roll').touchScroll(receiptScrollerOpts);$('.large_interface #delivery_till_roll').touchScroll(receiptScrollerOpts);$('.large_interface #reports_center_till_roll').touchScroll(receiptScrollerOpts);$('.large_interface #reports_left_till_roll').touchScroll(receiptScrollerOpts);$('.large_interface #float_till_roll').touchScroll(receiptScrollerOpts);$('.large_interface #admin_order_list_till_roll').touchScroll(receiptScrollerOpts);$('.medium_interface #menu_screen_till_roll').touchScroll(receiptScrollerOpts);$('.medium_interface #large_menu_screen_till_roll').touchScroll(receiptScrollerOpts);if(inKitchenContext()){$('#kitchen_screen .till_roll').touchScroll(receiptScrollerOpts);}}
function buildOrderItem(product,amount){if(taxChargable){taxRate=-1;}else{taxRate=product.tax_rate;}
var productPrice=product.price;var isDouble=false;var isHalf=false;if(menuItemDoubleMode){productPrice=product.double_price;isDouble=true;setMenuItemDoubleMode(false);}else if(menuItemHalfMode){productPrice=product.half_price;isHalf=true;setMenuItemHalfMode(false);}else if(menuItemStandardPriceOverrideMode){productPrice=product.price;setMenuItemStandardPriceOverrideMode(false);}else if(globalPriceLevel==2&&product.price_2!=0){productPrice=product.price_2;}else if(globalPriceLevel==3&&product.price_3!=0){productPrice=product.price_3;}else if(globalPriceLevel==4&&product.price_4!=0){productPrice=product.price_4;}
var totalProductPrice=roundNumber(productPrice*amount,2);orderItem={'amount':amount,'product':product,'tax_rate':taxRate,'product_price':productPrice,'is_double':isDouble,'is_half':isHalf,'total_price':totalProductPrice,'is_void':false}
if(orderItem.product.category_id!=null){orderItem.product.category=orderItem.product.category_id;}else{orderItem.product.category="None";}
if(categories[orderItem.product.category_id]!=null&&categories[orderItem.product.category_id].parent_category_id!=null){orderItem.product.department=categories[orderItem.product.category_id].parent_category_id;}else{orderItem.product.department="None";}
orderItem['terminal_id']=terminalID;orderItem['serving_employee_id']=current_user_id;orderItem['time_added']=clueyTimestamp();currentOrderItem=orderItem;}
function setModifierGridIdForProduct(product){if(product.modifier_grid_id){currentModifierGridIdForProduct=product.modifier_grid_id;}else if(categories[product.category_id]&&categories[product.category_id].modifier_grid_id){currentModifierGridIdForProduct=categories[product.category_id].modifier_grid_id;}else{currentModifierGridIdForProduct=null;}}
function addItemToOrderAndSave(orderItem){orderItem.synced=true;if(currentOrder==null){currentOrder=buildInitialOrder();}
orderItem.itemNumber=currentOrder.items.length+1;currentOrder.items.push(orderItem);calculateOrderTotal(currentOrder);storeOrderInStorage(current_user_id,currentOrder);}
function addItemToTableOrderAndSave(orderItem){orderItem['synced']=false;currentTableOrder=tableOrders[selectedTable];orderItem.itemNumber=currentTableOrder.items.length+1;currentTableOrder.items.push(orderItem);calculateOrderTotal(currentTableOrder);storeTableOrderInStorage(current_user_id,selectedTable,currentTableOrder);}
function loadCurrentOrder(){currentOrder=getOrderFromStorage(current_user_id);if(currentOrder){if(typeof currentOrder.cashback=="undefined"){currentOrder.cashback=0;}
cashback=parseFloat(currentOrder.cashback);if(typeof currentOrder.service_charge=="undefined"){currentOrder.service_charge=0;}
serviceCharge=parseFloat(currentOrder.service_charge);}}
function recptScroll(targetPrefix){if(isTouchDevice()){$('#'+targetPrefix+'till_roll').touchScroll('update');currentHeight=$('#'+targetPrefix+'till_roll').height();scrollHeight=$('#'+targetPrefix+'till_roll').attr('scrollHeight');newHeight=scrollHeight-currentHeight;$('#'+targetPrefix+'till_roll').touchScroll('setPosition',newHeight);}else{var jscroll_api=$('#'+targetPrefix+'receipt').data('jsp');if(jscroll_api){currentHeight=$('#'+targetPrefix+'till_roll').height();scrollHeight=$('#'+targetPrefix+'till_roll').attr('scrollHeight');newHeight=scrollHeight-currentHeight;jscroll_api.scrollToY(newHeight+20);}else{newHeight=$('#'+targetPrefix+'receipt').attr('scrollHeight');$('#'+targetPrefix+'receipt').scrollTop(newHeight);}}}
function updateRecpt(targetPrefix){if(isTouchDevice()){$('#'+targetPrefix+'till_roll').touchScroll('update');}}
function doSelectTable(tableNum){selectedTable=tableNum;storeLastReceipt(current_user_id,tableNum);if(tableNum==0){currentSelectedRoom=0;loadCurrentOrder();defaultServiceChargePercent=globalDefaultServiceChargePercent;if(currentOrder&&currentOrder.service_charge){serviceCharge=parseFloat(currentOrder.service_charge);}
calculateOrderTotal(currentOrder);loadReceipt(currentOrder,true);return;}
var promptForClientName;if(tableNum==-1){currentSelectedRoom=-1;defaultServiceChargePercent=globalDefaultServiceChargePercent;promptForClientName=false;}else{currentSelectedRoom=tables[tableNum].room_id;defaultServiceChargePercent=rooms[currentSelectedRoom].defaultServiceChargePercent;promptForClientName=rooms[currentSelectedRoom].prompt_for_client_name;}
storeLastRoom(current_user_id,currentSelectedRoom);getTableOrderFromStorage(current_user_id,selectedTable);loadReceipt(tableOrders[tableNum],true);if(promptForClientName&&tableOrders[tableNum].client_name==""){promptAddNameToTable();}
postDoSelectTable();}
function orderReceiptItems(order){if(!order)return;for(var i=0;i<order.items.length;i++){order.items[i].itemNumber=i+1;}}
function removeSelectedOrderItem(){var itemNumber=currentSelectedReceiptItemEl.data("item_number");order=getCurrentOrder();var item=order.items[itemNumber-1];if(item.is_void){niceAlert("You cannot remove an item that is void.");return;}
if(item.synced&&selectedTable!=0&&!inTransferOrderItemMode){niceAlert("You cannot remove an item that has already been ordered. You can only void this item.");return;}
if(selectedTable!=0){doRemoveOrderItem(order,itemNumber);storeTableOrderInStorage(current_user_id,selectedTable,order);}else{doRemoveOrderItem(order,itemNumber);storeOrderInStorage(current_user_id,order);}
currentSelectedReceiptItemEl.hide();loadReceipt(order,true);closeEditOrderItem();closeDiscountPopup();}
function doRemoveOrderItem(order,itemNumber){order.items.splice(itemNumber-1,1);for(var i=itemNumber-1;i<order.items.length;i++){order.items[i].itemNumber--;var courseIndex2=$.inArray((i+1),order.courses);if(courseIndex2>=0){if($.inArray(order.courses[courseIndex2]-1,order.courses)==-1){order.courses[courseIndex2]--;}}}
calculateOrderTotal(order);return order;}
function currentOrderEmpty(){fetchedCurrentOrder=getCurrentOrder();return orderEmpty(fetchedCurrentOrder);}
function orderEmpty(order){return!order||!order.items||order.items.length==0;}
function orderStartTime(order){if(orderEmpty(order)){return"";}
return order.items[0].time_added;}
function doTransferTable(tableFrom,tableTo){var activeTableIDS=getActiveTableIDS();if(tableTo.toString()==tableFrom){niceAlert("You cannot transfer to the same table, please choose another.");return;}
if($.inArray(tableTo.toString(),activeTableIDS)!=-1){getTableOrderFromStorage(current_user_id,tableTo);tableOrderItemsToMerge=tableOrders[tableTo].items.slice(0);}
transferOrderInProgress=true;$('#nav_back_link').unbind();$('#nav_back_link').click(function(){niceAlert("Transfer table order in progress, please wait.");return;});showLoadingDiv("Transfer in progress, Please wait...");$.ajax({type:'POST',url:'/transfer_order',data:{table_from_id:tableFrom,table_from_order_num:getCurrentOrder().order_num,table_to_id:tableTo}});}
var savedTableTo;function doTransferOrderItem(tableFrom,tableTo){if(tableTo.toString()==tableFrom){niceAlert("You cannot transfer to the same table, please choose another.");return;}
transferOrderItemInProgress=true;savedTableTo=tableTo;$('#nav_back_link').unbind();$('#nav_back_link').click(function(){niceAlert("Transfer table order item in progress, please wait.");return;});var itemNumber=currentSelectedReceiptItemEl.data("item_number");var orderFrom;if(selectedTable!=0){orderFrom=tableOrders[selectedTable];}else{orderFrom=currentOrder;}
var theItem=orderFrom.items[itemNumber-1];var copiedOrderItem={};var itemToTransfer=$.extend(true,copiedOrderItem,theItem);doSelectTable(tableFrom);removeSelectedOrderItem();doSelectTable(tableTo);addItemToTableOrderAndSave(itemToTransfer);itemToTransfer['synced']=true;storeTableOrderInStorage(current_user_id,selectedTable,tableOrders[selectedTable]);showLoadingDiv("Transfer in progress, Please wait...");doSelectTable(tableFrom);if(tableFrom==0||currentOrderEmpty()){finishTransferOrderItem();}else{doSyncTableOrder();}}
function doAutoCoursing(order){order.items.sort(function(a,b){var sortVal=parseInt(a.product.course_num)-parseInt(b.product.course_num);if(sortVal==0){sortVal=parseFloat(a.time_added)-parseFloat(b.time_added);}
return sortVal;});var nextCourse=false;var nextCourseNum;order.courses=new Array();for(var i=0;i<order.items.length;i++){nextCourseNum=parseInt(order.items[i].product.course_num);order.items[i].itemNumber=i+1;order.items[i].is_course=false;nextCourse=(i!=order.items.length-1)&&(parseInt(order.items[i+1].product.course_num)!=nextCourseNum);if(nextCourse){order.items[i].is_course=true;order.courses.push(i+1);nextCourse=false;}}}
function finishTransferOrderItem(){$('#tables_screen_status_message').hide();transferOrderItemInProgress=false;inTransferOrderItemMode=false;tableScreenSelectTable(savedTableTo);doAutoLoginAfterSync=true;doSyncTableOrder();hideNiceAlert();setStatusMessage("Order Item Transfered.");}
function testForMandatoryModifier(product){if(orderItem.product.modifier_grid_id&&orderItem.product.modifier_grid_id_mandatory){switchToModifyOrderItemSubscreen();orderItemAdditionTabSelected(orderItem.product.modifier_grid_id);}else if(categories[product.category_id]&&categories[product.category_id].modifier_grid_id&&categories[product.category_id].modifier_grid_id_mandatory){switchToModifyOrderItemSubscreen();orderItemAdditionTabSelected(categories[product.category_id].modifier_grid_id);}}
function orderItemAdditionClicked(el){currentSelectedReceiptItemEl=getSelectedOrLastReceiptItem();if(!currentSelectedReceiptItemEl){return;}
var order=getCurrentOrder();var itemNumber=currentSelectedReceiptItemEl.data("item_number");var orderItem=order.items[itemNumber-1];el=$(el);var available=el.data("available");if(!available){return;}
var desc=el.data("description");var absCharge=0;var plusCharge=el.data("add_charge");var minusCharge=el.data("minus_charge");if(oiaIsAdd){absCharge=plusCharge;}else{absCharge=minusCharge;}
var hideOnReceipt=el.data("hide_on_receipt");var isAddable=el.data("is_addable");var productId=el.data("product_id");var followOnGridId=el.data("follow_on_grid_id");addOIAToOrderItem(order,orderItem,desc,absCharge,plusCharge,minusCharge,oiaIsAdd,false,hideOnReceipt,isAddable,productId,followOnGridId);}
function addOIAToOrderItem(order,orderItem,desc,absCharge,plusCharge,minusCharge,oiaIsAdd,isNote,hideOnReceipt,isAddable,productId,followOnGridId){if(typeof(orderItem.oia_items)=='undefined'){orderItem.oia_items=new Array();}
absCharge=parseFloat(absCharge);if(orderItem.pre_discount_price){orderItem.pre_discount_price=parseFloat(orderItem.pre_discount_price);}else{orderItem.total_price=parseFloat(orderItem.total_price);}
var oiaEdited=false;if(orderItem.oia_items.length>0){var oiaFound=false;var nextOIA;var existingOIA;var existingOIAIndex;for(i=0;i<orderItem.oia_items.length;i++){nextOIA=orderItem.oia_items[i];if(nextOIA.description==desc){oiaFound=true;existingOIA=nextOIA;existingOIAIndex=i;break;}}
if(oiaFound){oiaEdited=true;if(existingOIA.is_addable){if(existingOIA.is_add){existingOIA.is_add=false;existingOIA.abs_charge=minusCharge;if(plusCharge>0){if(orderItem.pre_discount_price){orderItem.pre_discount_price-=(orderItem.amount*plusCharge);}else{orderItem.total_price-=(orderItem.amount*plusCharge);}}
console.log("taking away minus charge: "+minusCharge);if(minusCharge>0){if(orderItem.pre_discount_price){orderItem.pre_discount_price-=(orderItem.amount*minusCharge);}else{orderItem.total_price-=(orderItem.amount*minusCharge);}}}else{if(minusCharge>0){if(orderItem.pre_discount_price){orderItem.pre_discount_price+=(orderItem.amount*minusCharge);}else{orderItem.total_price+=(orderItem.amount*minusCharge);}}
orderItem.oia_items.splice(existingOIAIndex,1);if(orderItem.oia_items.length==0){delete orderItem['oia_items'];}}}else{if(plusCharge>0){if(orderItem.pre_discount_price){orderItem.pre_discount_price-=(orderItem.amount*plusCharge);}else{orderItem.total_price-=(orderItem.amount*plusCharge);}}
orderItem.oia_items.splice(existingOIAIndex,1);if(orderItem.oia_items.length==0){delete orderItem['oia_items'];}}}}
if(!oiaEdited){oia_item={'description':desc,'abs_charge':absCharge,'is_add':oiaIsAdd,'is_note':isNote,'hide_on_receipt':hideOnReceipt,'is_addable':isAddable,'product_id':productId}
if(absCharge>0){if(oiaIsAdd){if(orderItem.pre_discount_price){orderItem.pre_discount_price+=(orderItem.amount*absCharge);}else{orderItem.total_price+=(orderItem.amount*absCharge);}}else{if(orderItem.pre_discount_price){orderItem.pre_discount_price-=(orderItem.amount*absCharge);}else{orderItem.total_price-=(orderItem.amount*absCharge);}}}
orderItem.oia_items.push(oia_item);}
applyExistingDiscountToOrderItem(order,orderItem.itemNumber);if(selectedTable!=0){storeTableOrderInStorage(current_user_id,selectedTable,order);}else{storeOrderInStorage(current_user_id,order);}
calculateOrderTotal(order);loadReceipt(order,false);if(currentSelectedReceiptItemEl.data("item_number")==getLastReceiptItem().data("item_number")){setTimeout(menuRecptScroll,20);}else{currentSelectedReceiptItemEl.addClass("selected");}
setOrderItemAdditionsGridState();if(followOnGridId!=-1){orderItemAdditionTabSelected(followOnGridId);}}
function setOrderItemAdditionsGridState(){$('.oia_container:visible .grid_item .grid_graphic').hide();currentSelectedReceiptItemEl=getSelectedOrLastReceiptItem();if(!currentSelectedReceiptItemEl){return;}
var order=getCurrentOrder();var itemNumber=currentSelectedReceiptItemEl.data("item_number");var orderItem=order.items[itemNumber-1];var nextOIA;if(orderItem.oia_items&&orderItem.oia_items.length>0){for(i=0;i<orderItem.oia_items.length;i++){nextOIA=orderItem.oia_items[i];$('.oia_container:visible .grid_item').each(function(){var gi=$(this);if(nextOIA.description==gi.data("description")){if(nextOIA.is_add){gi.find(".add").show();}else{gi.find(".remove").show();}}});}}}
var clearHTML="<div class='clear'>&nbsp;</div>";var clear10HTML="<div class='clear_top_margin_10'>&nbsp;</div>";var clear30HTML="<div class='clear_top_margin_30'>&nbsp;</div>";var clear10BottomBorderHTML="<div class='clear_top_margin_10_bottom_border'>&nbsp;</div>";var appOnline=true;var activeTableIDSStorageKey="active_table_ids";var breakUserIDSSStorageKey="break_user_ids";var clockedInUserIDSSStorageKey="clocked_in_user_ids";var activeUserIDCookieName="current_user_id";function isTouchDevice(){return!disableAdvancedTouch;}
function goTo(place){if(!appOnline){appOfflinePopup();return false;}
if(cacheDownloading){cacheDownloadingPopup();return false;}
showSpinner();window.location=place;return false;}
function goToNewWindow(place){window.open(place,'_blank');}
function postTo(place,data){var formHTML='<form action="'+place+'" method="POST">';for(var key in data){formHTML+='<input type="hidden" name="'+key+'" value="'+data[key]+'"/>';}
formHTML+='</form>';showSpinner();$(formHTML).submit();}
function inMobileContext(){return $('body.mobile').length>0;}
function inKitchenContext(){return $('body div.kitchen').length>0;}
function inLargeInterface(){return currentInterface=="large";}
function inMediumInterface(){return currentInterface=="medium";}
function inAndroidWrapper(){return(typeof clueyAndroidJSInterface!="undefined");}
function currencyBalance(balance){if(balance<0){return currency(Math.abs(balance))+"CR";}else{return currency(balance);}}
function currency(number,showUnit){if(typeof showUnit=="undefined"){showUnit=true;}
return number_to_currency(number,{precision:2,showunit:showUnit});}
function number_to_currency(number,options){try{var options=options||{};var precision=options["precision"]||2;var unit=options["unit"]||dynamicCurrencySymbol;var separator=precision>0?options["separator"]||".":"";var delimiter=options["delimiter"]||",";var parts=parseFloat(number).toFixed(precision).split('.');showUnit=options["showunit"]||false
return(showUnit?unit:"")+number_with_delimiter(parts[0],delimiter)+separator+parts[1].toString();}catch(e){alert("error on number: "+number+" "+e.toString());return number}}
function number_with_delimiter(number,delimiter,separator){try{var delimiter=delimiter||",";var separator=separator||".";var parts=number.toString().split('.');parts[0]=parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1"+delimiter);return parts.join(separator);}catch(e){return number}}
function roundNumber(num,dec){var result=Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);return result;}
function roundNumberUp(num,dec){var result=Math.ceil(num*Math.pow(10,dec))/Math.pow(10,dec);return result;}
function roundNumberDown(num,dec){var result=Math.floor(num*Math.pow(10,dec))/Math.pow(10,dec);return result;}
function doReload(resetSession){if(!appOnline){appOfflinePopup();return;}
var reload_location;showSpinner();if(resetSession){reload_location="/";reload_location+="?reset_session=true";window.location=reload_location;}else{window.location.reload();}}
function refreshClicked(){callHome=false;doReload(false);}
function resetOrderTimestamp(){callHome=false;lastSyncTableOrderTime=0;storeKeyValue(lastSyncKey,lastSyncTableOrderTime);doReload(false);}
function doClearAndReload(){callHome=false;showSpinner();clearLocalStorageAndCookies();doReload(true);}
var terminalFingerPrintCookieName="terminal_fingerprint";var sessionIdCookieName="_session_id";var lastReloadCookieName="last_reload_time";var lastPrintCheckCookieName="last_print_check_time";var salesInterfaceForwardFunctionCookieName="sales_interface_forward_function";var salesInterfaceForwardJSExecuteCookieName="sales_interface_forward_js_execute";var inTrainingModeCookieName="in_training_mode";function clearLocalStorageAndCookies(){var nextKey=null;var loopLength=localStorage.length;for(var i=0;i<loopLength;i++){nextKey=localStorage.key(i);if(nextKey==breakUserIDSSStorageKey||nextKey==clockedInUserIDSSStorageKey){continue;}
localStorage.removeItem(nextKey);}
var c=document.cookie.split(";");for(i=0;i<c.length;i++){var e=c[i].indexOf("=");var cname=c[i].substr(0,e);if($.trim(cname)==terminalFingerPrintCookieName||$.trim(cname)==sessionIdCookieName||$.trim(cname)==lastReloadCookieName||$.trim(cname)==lastPrintCheckCookieName){continue;}
var n=e>-1?cname:c[i];setRawCookie(n,"",-365);}}
function setFingerPrintCookie(){if(getRawCookie(terminalFingerPrintCookieName)==null){var uuid;if(inAndroidWrapper()){uuid="android_device_"+getAndroidFingerPrint();}else{uuid=Math.uuid();}
c_value=uuid;exdays=365*100;setRawCookie(terminalFingerPrintCookieName,c_value,exdays);}}
function regenerateTerminalFingerprintCookie(){var answer=confirm("Are you sure?");if(answer){setRawCookie(terminalFingerPrintCookieName,"",-365);setFingerPrintCookie()
doReload(false);}}
function storeOrderInStorage(current_user_id,order_to_store){key="user_"+current_user_id+"_current_order";value=JSON.stringify(order_to_store);return storeKeyValue(key,value);}
function getOrderFromStorage(current_user_id){key="user_"+current_user_id+"_current_order";storageData=retrieveStorageValue(key);if(storageData!=null){return JSON.parse(storageData);}else{return null;}}
function clearOrderInStorage(current_user_id){deleteStorageValue("user_"+current_user_id+"_current_order");}
function storeTableOrderInStorage(current_user_id,table_num,order_to_store){key="user_"+current_user_id+"_table_"+table_num+"_current_order";value=JSON.stringify(order_to_store);if(current_user_id!=masterOrdersUserId){var masterOrderKey="user_"+masterOrdersUserId+"_table_"+table_num+"_current_order";if(retrieveStorageValue(masterOrderKey)==value){deleteStorageValue(key);return null;}}
return storeKeyValue(key,value);}
function getTableOrderFromStorage(current_user_id,selectedTable){key="user_"+current_user_id+"_table_"+selectedTable+"_current_order";storageData=retrieveStorageValue(key);tableOrderDataJSON=null;if(storageData!=null){tableOrderDataJSON=JSON.parse(storageData);}else{if(current_user_id!=masterOrdersUserId){var masterOrderKey="user_"+masterOrdersUserId+"_table_"+selectedTable+"_current_order";storageData=retrieveStorageValue(masterOrderKey);if(storageData!=null){tableOrderDataJSON=JSON.parse(storageData);}}}
tableNum=selectedTable;parseAndFillTableOrderJSON(tableOrderDataJSON);}
function userHasUniqueTableOrder(userID,tableID){var key="user_"+userID+"_table_"+tableID+"_current_order";return localStorage.getItem(key)!=null;}
function clearTableOrderInStorage(current_user_id,selectedTable){return deleteStorageValue("user_"+current_user_id+"_table_"+selectedTable+"_current_order");}
function parseAndFillTableOrderJSON(currentTableOrderJSON){tableOrders[tableNum]=buildInitialOrder();if(currentTableOrderJSON!=null){for(var i=0;i<currentTableOrderJSON.items.length;i++){tableOrderItem=currentTableOrderJSON.items[i];if(tableNum==-1){tableOrderItem.synced=true;}
tableOrders[tableNum].items.push(tableOrderItem);}
tableOrders[tableNum].order_num=currentTableOrderJSON.order_num;tableOrders[tableNum].table=currentTableOrderJSON.table;tableOrders[tableNum].total=currentTableOrderJSON.total;tableOrders[tableNum].split_bill_table_num=currentTableOrderJSON.split_bill_table_num;tableOrders[tableNum].client_name=currentTableOrderJSON.client_name;tableOrders[tableNum].covers=currentTableOrderJSON.covers;tableOrders[tableNum].cashback=currentTableOrderJSON.cashback;if(typeof tableOrders[tableNum].cashback=="undefined"){tableOrders[tableNum].cashback=0;}
cashback=parseFloat(tableOrders[tableNum].cashback);tableOrders[tableNum].service_charge=currentTableOrderJSON.service_charge;if(currentTableOrderJSON.void_order_id){tableOrders[tableNum].void_order_id=currentTableOrderJSON.void_order_id;}
if(typeof tableOrders[tableNum].service_charge=="undefined"){tableOrders[tableNum].service_charge=0;}
serviceCharge=parseFloat(tableOrders[tableNum].service_charge);if(currentTableOrderJSON.discount_percent){tableOrders[tableNum].discount_percent=currentTableOrderJSON.discount_percent;tableOrders[tableNum].pre_discount_price=currentTableOrderJSON.pre_discount_price;}
if(typeof currentTableOrderJSON.courses!="undefined"){tableOrders[tableNum].courses=currentTableOrderJSON.courses;}
tableOrders[tableNum].order_taxes=currentTableOrderJSON.order_taxes;if(tableNum==-1){tableOrders[tableNum].table_info_label=currentTableOrderJSON.table_info_label;tableOrders[tableNum].tableInfoId=currentTableOrderJSON.tableInfoId;tableOrders[tableNum].payment_method=currentTableOrderJSON.payment_method;serviceCharge=tableOrders[tableNum].service_charge=currentTableOrderJSON.service_charge;cashback=tableOrders[tableNum].cashback=currentTableOrderJSON.cashback;tableOrders[tableNum].void_order_id=currentTableOrderJSON.void_order_id;tableOrders[tableNum].order_num="";}}else{cashback=serviceCharge=0;}
calculateOrderTotal(tableOrders[tableNum]);}
function buildInitialOrder(){var initOrder={'items':new Array(),'courses':new Array(),'total':0,'client_name':"",'covers':-1};return initOrder;}
function storeKeyValue(key,value){return localStorage.setItem(key,value);}
function retrieveStorageValue(key){return localStorage.getItem(key);}
function storeKeyJSONValue(key,value){JSONValue=JSON.stringify(value);return localStorage.setItem(key,JSONValue);}
function retrieveStorageJSONValue(key){storageData=retrieveStorageValue(key);if(storageData!=null){return JSON.parse(storageData);}else{return null;}}
function deleteStorageValue(key){return localStorage.removeItem(key);}
function getActiveTableIDS(){activeTableIDSString=retrieveStorageValue(activeTableIDSStorageKey);if(activeTableIDSString){return activeTableIDSString.split(",");}else{return new Array();}}
function storeActiveTableIDS(activeTableIDS){activeTableIDSString=activeTableIDS.join(",");storeKeyValue(activeTableIDSStorageKey,activeTableIDSString);}
function addActiveTable(tableID){activeTableIDS=getActiveTableIDS();newlyAdded=($.inArray(tableID.toString(),activeTableIDS)==-1);if(newlyAdded){activeTableIDS.push(tableID);storeActiveTableIDS(activeTableIDS);}
return newlyAdded;}
function removeActiveTable(tableID){activeTableIDS=getActiveTableIDS();newlyRemoved=($.inArray(tableID.toString(),activeTableIDS)!=-1);activeTableIDS=$.grep(activeTableIDS,function(val){return val.toString()!=tableID.toString();});storeActiveTableIDS(activeTableIDS);return newlyRemoved;}
function getBreakUsersIDS(){var breakUserIDSString=retrieveStorageValue(breakUserIDSSStorageKey);if(breakUserIDSString){return breakUserIDSString.split(",");}else{return new Array();}}
function storeBreakUsersIDS(breakUserIDS){var breakUserIDSString=breakUserIDS.join(",");storeKeyValue(breakUserIDSSStorageKey,breakUserIDSString);}
function addBreakUser(userID){var breakUsersIDS=getBreakUsersIDS();var newlyAdded=($.inArray(userID.toString(),breakUsersIDS)==-1);if(newlyAdded){breakUsersIDS.push(userID);storeBreakUsersIDS(breakUsersIDS);}
return newlyAdded;}
function removeBreakUser(userID){var breakUsersIDS=getBreakUsersIDS();var newlyRemoved=($.inArray(userID.toString(),breakUsersIDS)!=-1);breakUsersIDS=$.grep(breakUsersIDS,function(val){return val.toString()!=userID.toString();});storeBreakUsersIDS(breakUsersIDS);return newlyRemoved;}
function getClockedInUsersIDS(){var clockedInUserIDSString=retrieveStorageValue(clockedInUserIDSSStorageKey);if(clockedInUserIDSString){return clockedInUserIDSString.split(",");}else{return new Array();}}
function storeClockedInUsersIDS(clockedInUserIDS){var clockedInUserIDSString=clockedInUserIDS.join(",");storeKeyValue(clockedInUserIDSSStorageKey,clockedInUserIDSString);}
function addClockedInUser(userID){var clockedInUsersIDS=getClockedInUsersIDS();var newlyAdded=($.inArray(userID.toString(),clockedInUsersIDS)==-1);if(newlyAdded){clockedInUsersIDS.push(userID);storeClockedInUsersIDS(clockedInUsersIDS);}
return newlyAdded;}
function removeClockedInUser(userID){var clockedInUsersIDS=getClockedInUsersIDS();var newlyRemoved=($.inArray(userID.toString(),clockedInUsersIDS)!=-1);clockedInUsersIDS=$.grep(clockedInUsersIDS,function(val){return val.toString()!=userID.toString();});storeClockedInUsersIDS(clockedInUsersIDS);return newlyRemoved;}
function setSalesScreenForwardFunction(button_id){var exdays=365*100;setRawCookie(salesInterfaceForwardFunctionCookieName,button_id,exdays);}
function setRawCookie(c_name,value,expires){var today=new Date();today.setTime(today.getTime());if(expires){expires=expires*1000*60*60*24;}
var expires_date=new Date(today.getTime()+(expires));var c_value=escape(value)+((expires==null)?"":";path=/;expires="+expires_date.toUTCString());document.cookie=c_name+"="+c_value;}
function getRawCookie(c_name){var i,x,y,ARRcookies=document.cookie.split(";");for(i=0;i<ARRcookies.length;i++)
{x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);x=x.replace(/^\s+|\s+$/g,"");if(x==c_name)
{return unescape(y);}}
return null;}
function deleteRawCookie(c_name){var exdays=-1*365*100;setRawCookie(c_name,null,exdays);}
String.prototype.startsWith=function(str){return(this.indexOf(str)===0);};String.prototype.endsWith=function(suffix){return this.indexOf(suffix,this.length-suffix.length)!==-1;};String.prototype.contains=function(str){return(this.indexOf(str)!=-1);};String.prototype.splice=function(idx,rem,s){return(this.slice(0,idx)+s+this.slice(idx+Math.abs(rem)));};function utilFormatDate(date){return formatDate(date,defaultJSDateFormat);}
function utilFormatTime(date){return formatDate(date,defaultJSTimeFormat);}
function inDevMode(){return railsEnvironment=='development';}
function inProdMode(){return railsEnvironment!='development';}
function inKioskMode(){return kioskMode&&!overrideKiosk&&!inMobileContext();}
function pauseScript(ms){ms+=new Date().getTime();while(new Date()<ms){}}
function firstServerID(order){if(orderEmpty(order)){return"";}
return order.items[0].serving_employee_id;}
function firstServerNickname(order){user_id=firstServerID(order);return serverNickname(user_id);}
function serverNickname(user_id){var server=null;for(var i=0;i<employees.length;i++){id=employees[i].id;if(id==user_id){server=employees[i].nickname;break;}}
return server;}
function employeeForID(employeeId){for(var i=0;i<employees.length;i++){var id=employees[i].id;if(id==employeeId){return employees[i];}}
return null;}
function serverRoleID(user_id){var role_id=null;for(var i=0;i<employees.length;i++){id=employees[i].id;if(id==user_id){role_id=employees[i].role_id;break;}}
return role_id;}
function getTableForLabel(table_label){var table_info=null;for(var i in tables){label=tables[i].label;if(label==table_label){table_info=tables[i];break;}}
return table_info;}
function getPaymentMethodId(paymentMethodName){var paymentMethodId=null;for(var id in paymentMethods){if(paymentMethods[id].name==paymentMethodName){paymentMethodId=id;break;}}
return paymentMethodId;}
function initUIElements(){$(".vtabs").jVertTabs({select:function(index){initScrollPanes();initCheckboxes();}});initScrollPanes();initCheckboxes();initRadioButtons();initMcDropDowns();}
function initScrollPanes(){if(isTouchDevice()){$('.jscrollpane, .admin #content_container section:not(.no_scroll_pane)').jScrollPane({showArrows:true,autoReinitialise:true});var sheet=document.createElement('style')
sheet.innerHTML="::-webkit-scrollbar {display: none;}";document.body.appendChild(sheet);}else{$('*').removeClass("jscrollpane");}}
function initCheckboxes(){$(':checkbox.iphone_style').iphoneStyle({resizeContainer:false,resizeHandle:false,checkedLabel:'Yes',uncheckedLabel:'No'});}
function initRadioButtons(){$(':radio.iphone_style').iButton({labelOn:"On",labelOff:"Off"});}
var hideNiceAlertListener=null;function niceAlert(message,title){hideNiceAlert();if(typeof title=="undefined"){title="Notice";}
ModalPopups.Alert('niceAlertContainer',title,"<div id='nice_alert' class='nice_alert'>"+message+"</div>",{width:360,height:310,okButtonText:'Ok',onOk:"hideNiceAlert()"});hideNiceAlertListener=function(event){if(getEventKeyCode(event)==13){hideNiceAlert();}};$(window).bind('keypress',hideNiceAlertListener);}
function hideNiceAlert(){try{if(hideNiceAlertListener!=null){$(window).unbind('keypress',hideNiceAlertListener);}
ModalPopups.Close('niceAlertContainer');}catch(e){}}
jQuery.fn.extend({slideRightShow:function(){return this.each(function(){$(this).show('slide',{direction:'right'},screenSlideSpeed);});},slideLeftHide:function(){return this.each(function(){$(this).hide('slide',{direction:'left'},screenSlideSpeed);});},slideRightHide:function(){return this.each(function(){$(this).hide('slide',{direction:'right'},screenSlideSpeed);});},slideLeftShow:function(){return this.each(function(){$(this).show('slide',{direction:'left'},screenSlideSpeed);});}});function initPressedCSS(){var startEventName="mousedown";var stopEventName="mouseup";var cancelEventName="mouseout"
if(isTouchDevice()){startEventName="touchstart";stopEventName="touchend";cancelEventName="touchcancel";}
$('div.button, div.small_button, div.item, div.key, div.go_key, div.cancel_key, div.employee_box, \n        div.mobile_button, div.page, #table_screen_button, div#nav_util_button, input[type="submit"]').live(startEventName,function(){$(this).addClass("pressed");$(this).bind(stopEventName,function(){$(this).removeClass("pressed");$(this).unbind(startEventName);$(this).unbind(stopEventName);});$(this).bind(cancelEventName,function(){$(this).removeClass("pressed");$(this).unbind(cancelEventName);$(this).unbind(cancelEventName);});});}
function clueyTimestamp(){return(new Date().getTime()-counterStartTimeMillis)+serverCounterStartTimeMillis;}
var ignoreReloadRequest=false;function alertReloadRequest(reloadTerminalId,hardReload){if(ignoreReloadRequest){return;}
if(reloadTerminalId==terminalID){return;}
hideNiceAlert();writeLastReloadTimeCookie();var timeoutSeconds=5;if(hardReload){message="A hard reset has been requested by "+reloadTerminalId+". Screen will reload in "+timeoutSeconds+" seconds.";okFuncCall="doClearAndReload();";}else{message="Settings have been changed by "+reloadTerminalId+". Screen will reload in "+timeoutSeconds+" seconds.";okFuncCall="doReload(false);";}
ModalPopups.Alert('niceAlertContainer',"Please Reload Screen","<div id='nice_alert' class='nice_alert'>"+message+"</div>",{width:360,height:280,okButtonText:'Reload Now',onOk:okFuncCall});setTimeout(okFuncCall,timeoutSeconds*1000);}
function writeLastReloadTimeCookie(){var interfaceReloadTimeCookeExpDays=365*100;setRawCookie(lastReloadCookieName,lastInterfaceReloadTime,interfaceReloadTimeCookeExpDays);}
function alertCacheReloadRequest(){hideNiceAlert();var timeoutSeconds=5;var message="New cache downloaded! App will reload in "+timeoutSeconds+" seconds.";var okFuncCall="doReload(false);";ModalPopups.Alert('niceAlertContainer',"Please Reload Screen","<div id='nice_alert' class='nice_alert'>"+message+"</div>",{width:360,height:280,okButtonText:'Reload Now',onOk:okFuncCall});setTimeout(okFuncCall,timeoutSeconds*1000);}
function getURLHashParams(){var hashParams={};var e,a=/\+/g,r=/([^&;=]+)=?([^&;]*)/g,d=function(s){return decodeURIComponent(s.replace(a," "));},q=window.location.hash.substring(1);while(e=r.exec(q)){hashParams[d(e[1])]=d(e[2]);}
return hashParams;}
jQuery.parseQuery=function(qs,options){var q=(typeof qs==='string'?qs:window.location.search),o={'f':function(v){return unescape(v).replace(/\+/g,' ');}},options=(typeof qs==='object'&&typeof options==='undefined')?qs:options,o=jQuery.extend({},o,options),params={};jQuery.each(q.match(/^\??(.*)$/)[1].split('&'),function(i,p){p=p.split('=');p[1]=o.f(p[1]);params[p[0]]=params[p[0]]?((params[p[0]]instanceof Array)?(params[p[0]].push(p[1]),params[p[0]]):[params[p[0]],p[1]]):p[1];});return params;}
function checkUpdateOpenOrdersScreen(){var onPreviousSalesScreen=$('#admin_order_list').length>0;if(onPreviousSalesScreen){if(typeof loadOpenOrders!='undefined'){loadOpenOrders();}}}
function ensureLoggedIn(){if(current_user_id==null){hideNiceAlert();var message="You have been logged out, please log in again";ModalPopups.Alert('niceAlertContainer',"Logged Out","<div id='nice_alert' class='nice_alert'>"+message+"</div>",{width:360,height:280,okButtonText:'Ok',onOk:"doReload(false)"});return false;}
return true;}
function showLoadingDiv(optionalText){if(typeof(optionalText)=="undefined"){text="Please Wait...";}else{text=optionalText;}
if(inAndroidWrapper()){showSpinner();}else{hideNiceAlert();ModalPopups.Indicator("niceAlertContainer","Loading...","<div id='nice_alert' class='nice_alert'>"+text+"</div>",{width:360,height:280});}}
function hideLoadingDiv(){if(inAndroidWrapper()){hideSpinner();}else{hideNiceAlert();}}
function setConnectionStatus(connected){appOnline=connected;postSetConnectionStatus(connected);}
function appOfflinePopup(){niceAlert("Server cannot be contacted. App will operate in restricted mode. Some features may not be available.");}
function cacheDownloadingPopup(){niceAlert("The cache is downloading. App will operate in restricted mode. Some features may not be available.");}
function doClickAButton(el){el.mousedown().mouseup().click();}
function userAbortedXHR(xhr){return!xhr.getAllResponseHeaders();}
var playHTML5Audio=false;function initBeep(){playHTML5Audio=isHTML5AudioSupported();var els=$("div.button, div.small_button, div.item, div.key, div.go_key, div.cancel_key, div.employee_box, \n        div.mobile_button, div.page, #table_screen_button, div#nav_util_button, input[type='submit']");els.live("click",doBeepSound);}
function isHTML5AudioSupported(){var a=document.createElement('audio');return!!(a.canPlayType&&a.canPlayType('audio/mpeg;').replace(/no/,''));}
function doBeepSound(){playSound('/sounds/beep.mp3');}
function playSound(url){if(playHTML5Audio){var snd=new Audio(url);snd.load();snd.play();}else{$("#sound").remove();var sound=$("<embed id='sound' type='audio/mpeg' />");sound.attr('src',url);sound.attr('loop',false);sound.attr('hidden',true);sound.attr('autostart',true);$('body').append(sound);}}
function setEventyKeyCode(e,code){e.keyCode=code;}
function getEventKeyCode(e){return e.charCode||e.keyCode;}
function sizeOfHash(theHash){return Object.keys(theHash).length}
function sizeOfObjectInBytes(value){return lengthInUtf8Bytes(JSON.stringify(value));}
function lengthInUtf8Bytes(str){var m=encodeURIComponent(str).match(/%[89ABab]/g);return str.length+(m?m.length:0);}
function doKeyboardInput(input,val){var caretStart=input.caret().start;var caretEnd=input.caret().end;var newStartVal=input.val().substring(0,caretStart);var newEndVal=input.val().substring(caretEnd);input.val(newStartVal+val+newEndVal);input.caret({start:caretStart+1,end:caretStart+1});}
function doKeyboardInputCancel(input){var caretStart=input.caret().start;var caretEnd=input.caret().end;var newStartVal;var newEndVal;if(caretEnd>caretStart){newStartVal=input.val().substring(0,caretStart);newEndVal=input.val().substring(caretEnd);input.val(newStartVal+newEndVal);input.caret({start:caretStart,end:caretStart});}else{newStartVal=input.val().substring(0,caretStart-1);newEndVal=input.val().substring(caretEnd);input.val(newStartVal+newEndVal);input.caret({start:caretStart-1,end:caretStart-1});}}
function focusSelectInput(inputEl){addTableNamePopupEl.find('input').focus();addTableNamePopupEl.find('input').caret({start:0,end:0});}
function reloadProducts(callback){$.getScript('/javascripts/products.js',callback);}
function reloadCustomers(callback){$.getScript('/javascripts/customers.js',callback);}
function storeActiveUserID(userID){if(userID==null){deleteRawCookie(activeUserIDCookieName);return;}
var exdays=365*100;setRawCookie(activeUserIDCookieName,userID,exdays);}
function fetchActiveUserID(){return getRawCookie(activeUserIDCookieName);}
function requestReload(){$.ajax({type:'POST',url:'/request_terminal_reload',success:function(){console.log("Reload request sent to server!");}});}
var current_user_id;var last_user_id;var current_user_nickname;var current_user_is_admin;var current_user_passcode;var current_user_role_id;var kitchenScreenInitialized=false;var lastActiveElement;var callHomePollInitSequenceComplete=false;var callHome=true;var lastSyncTableOrderTime=null;var lastSyncKey="last_sync_table_order_time";var lastInterfaceReloadTime=null;var lastPrintCheckTime=null;var scheduledTasksIntervalSeconds=10;$.event.props=$.event.props.join('|').replace('layerX|layerY|','').split('|');$(function(){current_user_id=fetchActiveUserID();if(current_user_id){for(var i=0;i<employees.length;i++){var nextId=employees[i].id;if(nextId.toString()==current_user_id){last_user_id=current_user_id;current_user_nickname=employees[i].nickname;current_user_is_admin=employees[i].is_admin;current_user_passcode=employees[i].passcode;current_user_role_id=employees[i].role_id;}}}
$('img').live("mousedown",preventImageDrag);$('a').live("click",preventOfflineHref);if(true){startCacheUpdateCheckPoll();}});function callHomePoll(){if(!callHome){setTimeout(callHomePoll,5000);return;}
if(lastSyncTableOrderTime==null){var syncVal=retrieveStorageValue(lastSyncKey);if(syncVal!=null){lastSyncTableOrderTime=parseFloat(syncVal);}else{lastSyncTableOrderTime=0;}}else{storeKeyValue(lastSyncKey,lastSyncTableOrderTime);}
if(lastInterfaceReloadTime==null){var lastReloadTime=getRawCookie(lastReloadCookieName);if(lastReloadTime!=null){lastInterfaceReloadTime=parseFloat(lastReloadTime);}else{lastInterfaceReloadTime=clueyTimestamp();}}else{writeLastReloadTimeCookie();}
if(lastPrintCheckTime==null){var lastCheckTime=getRawCookie(lastPrintCheckCookieName);if(lastCheckTime!=null){lastPrintCheckTime=parseFloat(lastCheckTime);}else{lastPrintCheckTime=clueyTimestamp();}}else{var printCookieExpDays=365*100;setRawCookie(lastPrintCheckCookieName,lastPrintCheckTime,printCookieExpDays);}
callHomeURL="/call_home.js"
currentTerminalRecptHTML="";if(getCurrentOrder()){currentTerminalRecptHTML=getCurrentRecptHTML();}
currentTableLabel="";if(selectedTable!=previousOrderTableNum&&selectedTable!=tempSplitBillTableNum&&selectedTable!=0){currentTableLabel=tableInfoLabel=tables[selectedTable].label;}
$.ajax({url:callHomeURL,type:"POST",dataType:'script',success:callHomePollComplete,error:function(){setTimeout(callHomePoll,5000);},data:{lastInterfaceReloadTime:lastInterfaceReloadTime,lastSyncTableOrderTime:lastSyncTableOrderTime,currentTerminalUser:current_user_id,currentTerminalRecptHTML:currentTerminalRecptHTML,currentTerminalRecptTableLabel:currentTableLabel,lastOrderReadyNotificationTime:lastOrderReadyNotificationTime}});}
var immediateCallHome=false;function callHomePollComplete(){if(immediateCallHome){callHomePoll();}else{if(!callHomePollInitSequenceComplete){callHomePollInitSequenceComplete=true;callHomePollInitSequenceCompleteHook();}
if(inKitchenContext()&&!kitchenScreenInitialized){kitchenScreenInitialized=true;finishedLoadingKitchenScreen();}
setTimeout(callHomePoll,pollingAmount);}}
function callHomePollInitSequenceCompleteHook(){checkUpdateOpenOrdersScreen();$('#loading_orders_spinner').hide();if(inLargeInterface()){$('#table_select_container_loading_message').hide();$('#table_select_container').show();$('#table_screen_button').show();}}
function clueyScheduler(){doScheduledTasks();setTimeout(clueyScheduler,scheduledTasksIntervalSeconds*1000);}
function preventImageDrag(event){if(event.preventDefault){event.preventDefault();}}
function preventOfflineHref(){if(!appOnline){appOfflinePopup();return false;}
if(cacheDownloading){cacheDownloadingPopup();return false;}
return true;}
function pingHome(){$.ajax({url:"/ping",type:"GET",success:function(){setConnectionStatus(true);},error:function(){setConnectionStatus(false);}});}
var customFooterId=null;function storeLastReceipt(user_id,table_num){if(user_id==null){return;}
storeKeyJSONValue("user_"+user_id+"_last_receipt",{'table_num':table_num});}
function fetchLastReceiptID(user_id){var lastReceiptIDOBJ=retrieveStorageJSONValue("user_"+user_id+"_last_receipt");var lastReceiptID=null;if(lastReceiptIDOBJ==null){lastReceiptID=0;}else{lastReceiptID=lastReceiptIDOBJ.table_num;}
return lastReceiptID;}
function storeLastRoom(user_id,room_id){if(user_id==null){return;}
storeKeyJSONValue("user_"+user_id+"_last_room",{'room_id':room_id});}
function fetchLastRoomID(user_id){var lastRoomIDOBJ=retrieveStorageJSONValue("user_"+user_id+"_last_room");var lastRoomID=null;if(lastRoomIDOBJ==null){lastRoomID=$('.room_graphic').first().data('room_id');storeLastRoom(user_id,lastRoomID);}else{lastRoomID=lastRoomIDOBJ.room_id;}
return lastRoomID;}
function printReceipt(content,printRecptMessage,printerID){var receiptContent=receiptContentSetup(content,printRecptMessage);printContent(receiptContent,printerID);}
function printLocalReceipt(content,printRecptMessage){var receiptContent=receiptContentSetup(content,printRecptMessage);$('#printFrame').contents().find('#till_roll').html(receiptContent);printFrame.focus();printFrame.print();}
function receiptContentSetup(content,printRecptMessage){if(!inKitchenContext()){setStatusMessage("Printing Receipt");}
var footer=receiptMessage;if(customFooterId!=null){footer=customReceiptFooters[customFooterId].content;}
if(mandatoryFooterMessageHTML!=null&&mandatoryFooterMessageHTML.length>0){content+=clearHTML+mandatoryFooterMessageHTML;}
mandatoryFooterMessageHTML=null;if(printRecptMessage){receiptMessageHTML="<div id='receipt_message'>"+footer+"</div>";content+=clearHTML+receiptMessageHTML;}
content+=clear30HTML+"<div class='the_dots'>.  .  .</div>";return content;}
var printerProgressListener={stateIsRequest:false,printing:false,QueryInterface:function(aIID){if(aIID.equals(Components.interfaces.nsIWebProgressListener)||aIID.equals(Components.interfaces.nsISupportsWeakReference)||aIID.equals(Components.interfaces.nsISupports))
return this;throw Components.results.NS_NOINTERFACE;},onStateChange:function(aWebProgress,aRequest,aStateFlags,aStatus){console.log('State Change -> State Flags:'+aStateFlags+' Status:'+aStatus);if(aStateFlags==262160){this.printing=false;}
return 0;},onLocationChange:function(aWebProgress,aRequest,aLocation){return 0;},onProgressChange:function(aWebProgress,aRequest,aCurSelfProgress,aMaxSelfProgress,aCurTotalProgress,aMaxTotalProgress){this.printing=true;},onStatusChange:function(aWebProgress,aRequest,aStateFlags,aStatus){},onSecurityChange:function(aWebProgress,aRequest,aState){}};function printContent(content,printerID){if(inMediumInterface()){niceAlert("Printing is not yet supported for the cloud on mobiles except for ordering");return;}
if(!checkForClueyPlugin()||!checkForJSPrintSetupPlugin()){return;}
console.log("Attempting to print to printer "+printerID);if(printerProgressListener.printing){console.log("Waiting 500 ms for previous print job to complete.");setTimeout(function(){printContent(content,printerID)},500);return;}
var printer;if(printerID){printer=printersByID[printerID];}else{if(localPrinterID==-1){niceAlert("You have not set a local receipt printer for this terminal");return}
printer=printersByID[localPrinterID];}
if(!printer){niceAlert("No printer found with id "+localPrinterID);return;}
var printerNetworkPath=printer.network_path.toLowerCase();if($.inArray(printerNetworkPath,localPrinters)==-1){var title="Printer Not Installed";hideNiceAlert();ModalPopups.Alert('niceAlertContainer',title,"<div id='nice_alert' class='licence_expired_header'>You are trying to print to a printer that is not installed on this terminal: "+printerNetworkPath+"</div>",{width:360,height:310,okButtonText:'Ok',onOk:"hideNiceAlert();"});return;}
console.log("Printing to printer: "+printerNetworkPath);jsPrintSetup.refreshOptions();jsPrintSetup.setPrinter(printerNetworkPath);jsPrintSetup.setOption('marginTop',0);jsPrintSetup.setOption('marginBottom',0);jsPrintSetup.setOption('marginLeft',0);jsPrintSetup.setOption('marginRight',0);jsPrintSetup.setOption('headerStrLeft','');jsPrintSetup.setOption('headerStrCenter','');jsPrintSetup.setOption('headerStrRight','');jsPrintSetup.setOption('footerStrLeft','');jsPrintSetup.setOption('footerStrCenter','');jsPrintSetup.setOption('footerStrRight','');jsPrintSetup.clearSilentPrint();jsPrintSetup.setOption('printSilent',1);jsPrintSetup.setShowPrintProgress(false);jsPrintSetup.saveOptions(jsPrintSetup.kSaveAll);jsPrintSetup.saveGlobalOptions(jsPrintSetup.kSaveAll);jsPrintSetup.setPrintProgressListener(printerProgressListener);$('#printFrame').contents().find('#till_roll').html(content);var mmToPixelFactor=3.779527559;var paperWidth=printer.paper_width_mm*mmToPixelFactor;$('#printFrame').contents().find('body').width(paperWidth+"px");$('#printFrame').contents().find('body').css("font-size",printer.font_size+"px");jsPrintSetup.printWindow(printFrame);}
function fetchFinalReceiptHTML(includeBusinessInfo,includeServerAddedText,includeVatBreakdown){if(typeof(includeBusinessInfo)=='undefined'){includeBusinessInfo=false;}
if(typeof(includeServerAddedText)=='undefined'){includeServerAddedText=true;}
finalReceiptHTML="";if(includeBusinessInfo){finalReceiptHTML+=fetchBusinessInfoHeaderHTML();}
finalReceiptHTML+=fetchFinalReceiptHeaderHTML();allOrderItemsRecptHTML=getAllOrderItemsReceiptHTML(totalOrder,false,false,includeServerAddedText);finalReceiptHTML+=clearHTML+allOrderItemsRecptHTML;finalReceiptHTML+="<div class='data_table'>";if(totalOrder.discount_percent){subTotal=totalOrder.pre_discount_price;finalReceiptHTML+="<div class='label'>Sub-Total:</div><div class='data'>"+currency(subTotal)+"</div>"+clearHTML;discountAmount=(totalOrder.pre_discount_price*totalOrder.discount_percent)/100;finalReceiptHTML+="<div class='label'>Discount "+totalOrder.discount_percent+"%:</div><div class='data'>"+currency(discountAmount)+"</div>"+clearHTML;}else{subTotal=totalOrder.total;finalReceiptHTML+="<div class='label'>Sub-Total:</div><div class='data'>"+currency(subTotal)+"</div>"+clearHTML;discountAmount=0;}
totalOrder.discount_amount=discountAmount;finalReceiptHTML+=taxChargable?fetchTotalsHTMLWithTaxChargable():fetchTotalsWithoutTaxChargableHTML();cashTendered=totalOrder.cash_tendered;if(typeof(totalOrder.split_payments)!='undefined'){for(var pm in totalOrder.split_payments){finalReceiptHTML+="<div class='label'>Paid: "+pm+"</div><div class='data'>"+currency(totalOrder.split_payments[pm])+"</div>"+clearHTML;}
finalReceiptHTML+=clearHTML;}else if(cashTendered>0){finalReceiptHTML+="<div class='label'>Paid:</div><div class='data'>"+currency(cashTendered)+"</div>"+clearHTML;}
change=parseFloat(totalOrder.change);var changeWithCashback=parseFloat(change)+parseFloat(totalOrder.cashback);if(changeWithCashback>0){finalReceiptHTML+="<div class='change_line_container'><div class='label'>Change:</div><div class='data'>"+currency(changeWithCashback)+"</div></div>"+clearHTML;}
finalReceiptHTML+="</div>"+clearHTML;if(includeVatBreakdown){if(taxChargable){}else{finalReceiptHTML+="<div class='data_table vat_breakdown'>";finalReceiptHTML+="<div class='header'>"+taxLabel+" Breakdown</div>"+clearHTML;var taxRates={}
for(var i=0;i<totalOrder.items.length;i++){var item=totalOrder.items[i];var itemPrice=parseFloat(item['total_price']);var itemTaxRate=item.product['tax_rate'];var taxAmount=itemPrice-(itemPrice/(1+(parseFloat(itemTaxRate)/100)));var netAmount=itemPrice-taxAmount;var grossAmount=itemPrice;if(typeof(taxRates[itemTaxRate])=='undefined'){taxRates[itemTaxRate]={net:0,tax:0,gross:0};}
taxRates[itemTaxRate].net+=netAmount;taxRates[itemTaxRate].tax+=taxAmount;taxRates[itemTaxRate].gross+=grossAmount;}
var taxes_data=new Array();for(taxRateKey in taxRates){var taxData=taxRates[taxRateKey];taxes_data.push(new Array(taxRateKey,taxData.net,taxData.tax,taxData.gross));}
finalReceiptHTML+="<div id='cash_totals_data_table'>";finalReceiptHTML+=getCashTotalTaxesDataTable(taxes_data)+clearHTML;finalReceiptHTML+=getCashTotalTaxesDataTableTotals("Total",taxes_data)+clearHTML;finalReceiptHTML+="</div>"+clearHTML;finalReceiptHTML+="<div class='footer'>Tax Reg No: "+taxNumber+"</div>"+clearHTML;finalReceiptHTML+="</div>"+clearHTML;}}
return finalReceiptHTML;}
function fetchBusinessInfoHeaderHTML(){businessInfoHeaderHTML="<div class='custom_business_info'>";businessInfoHeaderHTML+="<div>"+businessInfoMessage+"</div>";businessInfoHeaderHTML+="</div>";return businessInfoHeaderHTML;}
function fetchFinalReceiptHeaderHTML(){var headerHTML="<div class='data_table'>";var server=firstServerNickname(totalOrder);if(server){headerHTML+="<div class='label'>Server:</div><div class='data'>"+server+"</div>"+clearHTML;}
if(typeof(totalOrder.time)=='undefined'){totalOrder.time=clueyTimestamp();}
var timestamp=utilFormatDate(new Date(totalOrder.time));headerHTML+="<div class='time label'>Time:</div><div class='time data'>"+timestamp+"</div>"+clearHTML;if(totalOrder.table){headerHTML+="<div class='label'>Table:</div><div class='data'>"+totalOrder.table+"</div>"+clearHTML;}
if(totalOrder.terminal_id){headerHTML+="<div class='label'>Terminal:</div><div class='data'>"+totalOrder.terminal_id+"</div>"+clearHTML;}else{headerHTML+="<div class='label'>Terminal:</div><div class='data'>"+terminalID+"</div>"+clearHTML;}
var orderNum=totalOrder.order_num;if(typeof(orderNum)!='undefined'){headerHTML+="<div class='label'>Order Number:</div><div class='data'>"+orderNum+"</div>"+clearHTML;}
headerHTML+="</div>";return headerHTML;}
function fetchTotalsHTMLWithTaxChargable(){taxAmount=((subTotal-discountAmount)*globalTaxRate)/100;totalsHTML="<div class='label'>"+taxLabel+" "+globalTaxRate+"%:</div><div class='data'>"+currency(taxAmount)+"</div>"+clearHTML;totalsHTML+=fetchServiceChargeHTML();totalsHTML+=fetchCashbackHTML();total=(parseFloat(subTotal)-parseFloat(discountAmount))+parseFloat(serviceCharge)+parseFloat(taxAmount);currentTotalFinal=total;totalOrder.totalFinal=total;totalsHTML+="<div class='total_line_container'><div class='label bold'>Total:</div><div class='data bold total_container'>"+currency(total+totalOrder.cashback)+"</div></div>"+clearHTML;return totalsHTML;}
function fetchTotalsWithoutTaxChargableHTML(){totalsHTML=fetchServiceChargeHTML();totalsHTML+=fetchCashbackHTML();total=(parseFloat(subTotal)-parseFloat(discountAmount))+parseFloat(serviceCharge);currentTotalFinal=total;totalOrder.totalFinal=total;totalsHTML+="<div class='total_line_container'><div class='label bold'>Total:</div><div class='data bold total_container'>"+currency(total+totalOrder.cashback)+"</div></div>"+clearHTML;return totalsHTML;}
function fetchServiceChargeHTML(){var serviceChargeHTML="";if(serviceCharge>0){serviceChargeHTML+="<div class='label'>"+serviceChargeLabel+":</div><div class='data'>"+currency(serviceCharge)+"</div>"+clearHTML;}
return serviceChargeHTML;}
function fetchCashbackHTML(){var cashbackHTML="";if(typeof(totalOrder.cashback)=='undefined'){totalOrder.cashback=0;}
if(totalOrder.cashback>0){cashbackHTML+="<div class='label'>Cashback:</div><div class='data'>"+currency(totalOrder.cashback)+"</div>"+clearHTML;}
return cashbackHTML;}
function showSpinner(){if(inAndroidWrapper()){clueyAndroidJSInterface.showSpinner();}else{showLoadingDiv();}}
function hideSpinner(){if(inAndroidWrapper()){clueyAndroidJSInterface.hideSpinner();}else{hideLoadingDiv();}}
function stopVibrate(){if(inAndroidWrapper()){clueyAndroidJSInterface.cancelVibrate();}}
function vibrate(){if(inAndroidWrapper()){clueyAndroidJSInterface.vibrate();}}
function vibrateConstant(){if(inAndroidWrapper()){clueyAndroidJSInterface.vibrateConstant();}}
function exitAndroidApp(){var doIt=confirm("Are you sure you want to exit?");if(doIt&&inAndroidWrapper()){clueyAndroidJSInterface.exitApp();}}
function showAndroidKeyboard(){if(inAndroidWrapper()){clueyAndroidJSInterface.showKeyboard();}}
function hideAndroidKeyboard(){if(inAndroidWrapper()){clueyAndroidJSInterface.hideKeyboard();}}
function getAndroidFingerPrint(){if(inAndroidWrapper()){return clueyAndroidJSInterface.getAndroidDeviceId();}
return"noid";}
function updateApp(){if(inAndroidWrapper()){clueyAndroidJSInterface.updateApp()}}