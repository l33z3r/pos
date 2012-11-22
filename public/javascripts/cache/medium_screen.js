
(function($){function CSRFProtection(xhr){var token=$('meta[name="csrf-token"]').attr('content');if(token)xhr.setRequestHeader('X-CSRF-Token',token);}
if('ajaxPrefilter'in $)$.ajaxPrefilter(function(options,originalOptions,xhr){CSRFProtection(xhr)});else $(document).ajaxSend(function(e,xhr){CSRFProtection(xhr)});function fire(obj,name,data){var event=$.Event(name);obj.trigger(event,data);return event.result!==false;}
function handleRemote(element){var method,url,data,dataType=element.data('type')||($.ajaxSettings&&$.ajaxSettings.dataType);if(fire(element,'ajax:before')){if(element.is('form')){method=element.attr('method');url=element.attr('action');data=element.serializeArray();var button=element.data('ujs:submit-button');if(button){data.push(button);element.data('ujs:submit-button',null);}}else{method=element.data('method');url=element.attr('href');data=null;}
$.ajax({url:url,type:method||'GET',data:data,dataType:dataType,beforeSend:function(xhr,settings){if(settings.dataType===undefined){xhr.setRequestHeader('accept','*/*;q=0.5, '+settings.accepts.script);}
return fire(element,'ajax:beforeSend',[xhr,settings]);},success:function(data,status,xhr){element.trigger('ajax:success',[data,status,xhr]);},complete:function(xhr,status){element.trigger('ajax:complete',[xhr,status]);},error:function(xhr,status,error){element.trigger('ajax:error',[xhr,status,error]);}});}}
function handleMethod(link){var href=link.attr('href'),method=link.data('method'),csrf_token=$('meta[name=csrf-token]').attr('content'),csrf_param=$('meta[name=csrf-param]').attr('content'),form=$('<form method="post" action="'+href+'"></form>'),metadata_input='<input name="_method" value="'+method+'" type="hidden" />';if(csrf_param!==undefined&&csrf_token!==undefined){metadata_input+='<input name="'+csrf_param+'" value="'+csrf_token+'" type="hidden" />';}
form.hide().append(metadata_input).appendTo('body');form.submit();}
function disableFormElements(form){form.find('input[data-disable-with], button[data-disable-with]').each(function(){var element=$(this),method=element.is('button')?'html':'val';element.data('ujs:enable-with',element[method]());element[method](element.data('disable-with'));element.attr('disabled','disabled');});}
function enableFormElements(form){form.find('input[data-disable-with]:disabled, button[data-disable-with]:disabled').each(function(){var element=$(this),method=element.is('button')?'html':'val';if(element.data('ujs:enable-with'))element[method](element.data('ujs:enable-with'));element.removeAttr('disabled');});}
function allowAction(element){var message=element.data('confirm');return!message||(fire(element,'confirm')&&confirm(message));}
function requiredValuesMissing(form){var missing=false;form.find('input[name][required]').each(function(){if(!$(this).val())missing=true;});return missing;}
$('a[data-confirm], a[data-method], a[data-remote]').live('click.rails',function(e){var link=$(this);if(!allowAction(link))return false;if(link.data('remote')!=undefined){handleRemote(link);return false;}else if(link.data('method')){handleMethod(link);return false;}});$('form').live('submit.rails',function(e){var form=$(this),remote=form.data('remote')!=undefined;if(!allowAction(form))return false;if(requiredValuesMissing(form))return!remote;if(remote){handleRemote(form);return false;}else{setTimeout(function(){disableFormElements(form)},13);}});$('form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])').live('click.rails',function(){var button=$(this);if(!allowAction(button))return false;var name=button.attr('name'),data=name?{name:name,value:button.val()}:null;button.closest('form').data('ujs:submit-button',data);});$('form').live('ajax:beforeSend.rails',function(event){if(this==event.target)disableFormElements($(this));});$('form').live('ajax:complete.rails',function(event){if(this==event.target)enableFormElements($(this));});})(jQuery);var numPages=4;var receiptPageNum=1;var menuPageNum=2;var functionsPageNum=3;var settingsPageNum=4;var currentScreenIsMenu=false;var currentScreenIsReceipt=false;var currentScreenIsFunctions=false;var currentScreenIsSettings=false;var screenSlideSpeed=300;var screenSlideDelayAmount=screenSlideSpeed+80;var pageWidth=480;var scrollSpeed=600;$(function(){doGlobalInit();});function doGlobalInit(){if(!current_user_id){current_user_id=employees[0].id;current_user_nickname=employees[0].nickname;current_user_is_admin=employees[0].is_admin;current_user_passcode=employees[0].passcode;storeActiveUserID(current_user_id);$.ajax({type:'POST',url:'/login',data:{employee_id:current_user_id}});}
if(inDevMode()){$('body').css("overflow","scroll");}
if(showPrintFrame){$('#wrapper').height(1770);$('#body').height(1770);$('#printFrame').width(600).height(1800);$('#printFrame').css("overflow","scroll");}
$('#content-holder').width(pageWidth*numPages);setFingerPrintCookie();if(isTouchDevice()){initTouch();initTouchRecpts();var menuScrollerOpts={elastic:false,momentum:false};$('#menu_items_scroller').touchScroll(menuScrollerOpts);$('#menu_pages_scroller').touchScroll(menuScrollerOpts);setTimeout(kickMenuScrollers,2000);}
initUIElements();initPressedCSS();renderActiveTables();initMenu();setFirstPage();if(!inAndroidWrapper()){$('#exit_app_button').hide();}
menuSelectMenu.setValue(selectedDisplayId);callHomePoll();clueyScheduler();}
function showTerminalSelectDialog(){niceAlert("Please select from the following list of terminals:");}
function doSubmitSettings(){showSpinner();$('#settings_form').submit();}
function doScheduledTasks(){pingHome();}
function cacheDownloadReset(){$('body').removeClass("cache_update");$('#cache_status').text("");$('#cache_status').hide();}
function cacheDownloadStarted(){$('body').addClass("cache_update");$('#cache_status').show();$('#cache_status').text("Cache DL: 0%");}
var current_table_label=null;var menuKeypadShowing=false;var roomSelectMenu=null;var menuSelectMenu=null;var highlightedCover=true;function initMenu(){$('#menu_pages_container .page').first().click();currentMenuPage=1;currentMenuSubPageId=null;currentOrder=new Array();$('#table_num_holder').html("Select Table");showTablesSubscreen();initModifierGrid();}
function doDisplayButtonPasscodePrompt(button_id,forwardFunction){forwardFunction.call();}
function checkMenuScreenForFunction(){swipeToMenu();return true;}
function checkSalesInterfaceForFunction(button_id,forwardFunction){forwardFunction.call();}
function renderActiveTables(){activeTableIDS=getActiveTableIDS();}
function menuScreenKeypadClick(val){if(this.innerHTML=='0'){if(currentMenuItemQuantity.length>0)
currentMenuItemQuantity+=val}else{if(currentMenuItemQuantity.indexOf(".")!=-1){if(currentMenuItemQuantity.length-currentMenuItemQuantity.indexOf(".")>1){return false;}}
currentMenuItemQuantity+=val;}
return false;}
function menuScreenKeypadClickDecimal(){if(currentMenuItemQuantity.indexOf(".")==-1){currentMenuItemQuantity+=".";}
return false;}
function menuScreenKeypadClickCancel(){currentMenuItemQuantity="";hideMenuKeypad();return false;}
function doMenuPageSelect(pageNum,pageId){$('#menu_pages_container .page').removeClass('selected');$('#menu_pages_container .page[data-page_num='+pageNum+']').addClass('selected');$('#menu_items_container .items').hide();$('#menu_items_'+pageNum).show();if(isTouchDevice()){kickMenuScrollers();}
$('#menu_items_'+pageNum+' div.subpages div.subpage').show();$('.embedded_pages_'+pageNum+' .subitems').hide();currentMenuPage=pageNum;currentMenuPageId=pageId;}
function doSubMenuPageSelect(parentPageNum,pageId){$('#menu_items_'+parentPageNum+' div.subpages div.subpage').hide();$('#sub_menu_items_'+pageId).show();currentMenuPage=parentPageNum;currentMenuPageId=pageId;currentMenuSubPageId=pageId;}
function doSelectMenuItem(productId,element){if(!ensureLoggedIn()){return;}
currentOrder=getCurrentOrder();var productToCopy=products[productId];var copiedProduct={};var product=$.extend(true,copiedProduct,productToCopy);if(menuItemDoubleMode&&(product.double_price==0)){niceAlert("Price has not been set for a double of this item");setMenuItemDoubleMode(false);return;}
if(menuItemHalfMode&&(product.half_price==0)){niceAlert("Price has not been set for a half of this item");setMenuItemHalfMode(false);return;}
if(currentMenuItemQuantity==""||currentMenuItemQuantity=="0")
currentMenuItemQuantity="1";if(currentMenuItemQuantity.indexOf(".")!=-1){if(currentMenuItemQuantity.length-currentMenuItemQuantity.indexOf(".")==1){currentMenuItemQuantity="1";}}
currentSelectedMenuItemElement=element;closeEditOrderItem();amount=currentMenuItemQuantity;currentMenuItemQuantity="";buildOrderItem(product,amount);setModifierGridIdForProduct(product);if(orderItem.product.prompt_price){showPricePopup();}
finishDoSelectMenuItem();}
function finishDoSelectMenuItem(){var orderItem=currentOrderItem;if(selectedTable!=0){tableSelectMenuItem(orderItem);return;}
addItemToOrderAndSave(orderItem);loadReceipt(currentOrder,true);currentSelectedReceiptItemEl=$('#menu_screen_till_roll div[data-item_number='+currentOrderItem.itemNumber+']');currentSelectedReceiptItemEl.addClass("selected");testForMandatoryModifier(orderItem.product);}
function tableSelectMenuItem(orderItem){addItemToTableOrderAndSave(orderItem);loadReceipt(currentOrder,true);currentSelectedReceiptItemEl=$('#menu_screen_till_roll div[data-item_number='+currentOrderItem.itemNumber+']');currentSelectedReceiptItemEl.addClass("selected");testForMandatoryModifier(orderItem.product);}
function closeEditOrderItem(){console.log("CloseEditOrderItem in medium interface called!");if(currentSelectedReceiptItemEl){currentSelectedReceiptItemEl.removeClass("selected");currentSelectedReceiptItemEl=null;}}
function doSelectReceiptItem(orderItemEl){orderItemEl=$(orderItemEl);closeEditOrderItem();switchToMenuItemsSubscreen();currentSelectedReceiptItemEl=orderItemEl;var selectedProduct=products[getCurrentOrder().items[parseInt(orderItemEl.data("item_number"))-1].product.id];setModifierGridIdForProduct(selectedProduct);showEditPopupInit();popupId=currentTargetPopupAnchor.GetBubblePopupID();currentCourseNum=orderItemEl.children('.name').data("course_num");$('#'+popupId).find('.course_num').val(currentCourseNum);currentPrice=orderItemEl.children('.total').data("per_unit_price");currentPrice=currency(currentPrice,false);var courseLineClass=orderItemEl.is_course?"course":"";currentCourseNum=courseLineClass;$('#'+popupId).find('.course_num').val(currentCourseNum);currentQuantity=orderItemEl.children('.amount').html();registerPopupClickHandler($('#'+popupId),closeEditOrderItem);orderItemEl.addClass("selected");setOrderItemAdditionsGridState();}
function editOrderItemIncreaseQuantity(){popupId=currentTargetPopupAnchor.GetBubblePopupID();targetInputEl=$('#'+popupId).find('.quantity');currentVal=parseFloat(targetInputEl.val());var newQuantity=currentVal;if(isNaN(currentVal)){newQuantity=1;}else{newQuantity=currentVal+1;}
targetInputEl.val(newQuantity);}
function editOrderItemDecreaseQuantity(){targetInputEl=$('.quantity');currentVal=parseFloat(targetInputEl.val());var newQuantity=currentVal;if(isNaN(currentVal)){newQuantity=1;}else if(currentVal>1){newQuantity=currentVal-1;}
targetInputEl.val(newQuantity);}
function setDiscountVal(val){popupId=currentTargetPopupAnchor.GetBubblePopupID();targetInputPer=$('#'+popupId).find('.percent_number');targetInputPer.val(val);}
var individualItemDiscount=true;function saveDiscount(){popupId=currentTargetPopupAnchor.GetBubblePopupID();selectedValue=$('#'+popupId).find('.percent_number').val();selectedValue=parseFloat(selectedValue);if(isNaN(selectedValue)){selectedValue=0;}
if(selectedValue<0||selectedValue>100){setStatusMessage("You must enter a number between 0 and 100",true,true);return;}
order=getCurrentOrder();wholeOrderDiscount=($("input[name='discount_type']:checked").val()=='whole_order');if(individualItemDiscount){itemNumber=currentSelectedReceiptItemEl.data("item_number");applyDiscountToOrderItem(order,itemNumber,selectedValue);}else if(wholeOrderDiscount){addDiscountToOrder(order,selectedValue);}else{applyDiscountToOrderItem(order,-1,selectedValue);}
if(selectedTable!=0){storeTableOrderInStorage(current_user_id,selectedTable,order);}else{storeOrderInStorage(current_user_id,order);}
loadReceipt(order,true);}
function saveEditOrderItem(){itemNumber=currentSelectedReceiptItemEl.data("item_number");newQuantity=0;if(currentTargetPopupAnchor!=null){popupId=currentTargetPopupAnchor.GetBubblePopupID();targetInputQuantityEl=$('#'+popupId).find('.quantity')
newQuantity=parseFloat(targetInputQuantityEl.val());}
var order=getCurrentOrder();if(isNaN(newQuantity)||newQuantity==0){currentQuantity=order.items[itemNumber-1].amount;newQuantity=currentQuantity;}
targetInputPricePerUnitEl=$('.new_price');newPricePerUnit=parseFloat(targetInputPricePerUnitEl.val());order=getCurrentOrder();var courseNum=order.items[itemNumber-1].product.course_num;var is_void=order.items[itemNumber-1].is_void;$('.new_price').val(null);if(isNaN(newPricePerUnit)){newPricePerUnit=currentPrice;}
if(selectedTable!=0){order=modifyOrderItem(order,itemNumber,newQuantity,newPricePerUnit,courseNum,is_void);storeTableOrderInStorage(current_user_id,selectedTable,order);}else{order=modifyOrderItem(order,itemNumber,newQuantity,newPricePerUnit,courseNum,is_void);storeOrderInStorage(current_user_id,order);}
if(currentTargetPopupAnchor!=null){saveDiscount();}
loadReceipt(order,true);closeDiscountPopup();}
function setUtilKeypad(position,clickFunction,cancelFunction){$(position).html($('#util_keypad_container').html());utliKeypadClickFunction=clickFunction;utilKeypadCancelFunction=cancelFunction;}
var currentTargetPopupAnchor=null;function showEditPopup(receiptItem){currentSelectedReceiptItemEl=receiptItem;closeDiscountPopup();currentTargetPopupAnchor=$('.receipt_top');if(currentTargetPopupAnchor.HasBubblePopup()){currentTargetPopupAnchor.RemoveBubblePopup();}
currentTargetPopupAnchor.CreateBubblePopup();discountsPopupHTML=$("#receipt_function_popup_content").html();currentTargetPopupAnchor.ShowBubblePopup({position:'bottom',align:'right',tail:{align:'right'},innerHtml:discountsPopupHTML,innerHtmlStyle:{'text-align':'left'},themeName:'all-grey',themePath:'/images/jquerybubblepopup-theme',alwaysVisible:false},false);currentTargetPopupAnchor.FreezeBubblePopup();popupId=currentTargetPopupAnchor.GetBubblePopupID();registerPopupClickHandler($('#'+popupId),closeDiscountPopup);}
function removePriceBubble(){currentTargetPopupAnchor.RemoveBubblePopup();}
function showPricePopup(){swipeToMenu();hideAllMenuSubScreens();$('.new_price').val("");$('#price_number_show').html("");$('#edit_price_screen').show();}
function showAddNotePopup(){swipeToMenu();hideAllMenuSubScreens();$('#add_note_screen').show();showAndroidKeyboard();$('.note_input').select();$('.note_input').focus();}
function focusIt(){$('.note_input').focus();}
function showChargeNotePopup(){$('#add_note_screen').hide();$('#add_charge_screen').show();$('.note_charge').focus();}
var noteChargeIsPlus=true;function doSaveNote(){if($('.note_input').val()==""){clearNoteInputs();$('#add_note_screen').hide();switchToMenuItemsSubscreen();$('.note_input').val('');$('.note_charge').val('');$('.display_charge').val('');}else{if($('.note_charge').val()!=""){var charge=$('.note_charge').val();}else{charge='0';}
var noteInput=$('.note_input').val();noteInput=$.trim(noteInput);if(noteInput.length==0&&charge==0){doCancelNote();return true;}
if(noteInput.length==0){setStatusMessage("Please enter some text for this note");return false;}
currentSelectedReceiptItemEl=getLastReceiptItem();if(!currentSelectedReceiptItemEl){setStatusMessage("There are no receipt items");return false;}
var order=getCurrentOrder();var itemNumber=currentSelectedReceiptItemEl.data("item_number");var orderItem=order.items[itemNumber-1];var desc=noteInput;var absCharge=charge;addOIAToOrderItem(order,orderItem,desc,absCharge,0,0,noteChargeIsPlus,true,false,false,-1,-1);clearNoteInputs();$('#add_note_screen').hide();switchToMenuItemsSubscreen();$('.note_input').val('');$('.note_charge').val('');$('.display_charge').val('');}
return true;}
function doCancelNote(){clearNoteInputs();}
function clearNoteInputs(){$('#note_charge').val("0");$('#note_input').val("");}
function showDiscountPopup(){currentSelectedReceiptItemEl=receiptItem;closeDiscountPopup();currentTargetPopupAnchor=$('.receipt_top');if(currentTargetPopupAnchor.HasBubblePopup()){currentTargetPopupAnchor.RemoveBubblePopup();}
currentTargetPopupAnchor.CreateBubblePopup();discountsPopupHTML=$("#discount_function_popup_content").html();currentTargetPopupAnchor.ShowBubblePopup({position:'bottom',align:'right',tail:{align:'right'},innerHtml:discountsPopupHTML,innerHtmlStyle:{'text-align':'left'},themeName:'all-grey',themePath:'/images/jquerybubblepopup-theme',alwaysVisible:false},false);currentTargetPopupAnchor.FreezeBubblePopup();popupId=currentTargetPopupAnchor.GetBubblePopupID();$('#'+popupId).find('.new_price').val(currentPrice);$('#'+popupId).find('.quantity').val(currentQuantity);registerPopupClickHandler($('#'+popupId),closeDiscountPopup);}
function showQuantityPopup(){currentSelectedReceiptItemEl=receiptItem;closeDiscountPopup();currentTargetPopupAnchor=$('.receipt_top');if(currentTargetPopupAnchor.HasBubblePopup()){currentTargetPopupAnchor.RemoveBubblePopup();}
currentTargetPopupAnchor.CreateBubblePopup();discountsPopupHTML=$("#quantity_function_popup_content").html();currentTargetPopupAnchor.ShowBubblePopup({position:'bottom',align:'right',tail:{align:'right'},innerHtml:discountsPopupHTML,innerHtmlStyle:{'text-align':'left'},themeName:'all-grey',themePath:'/images/jquerybubblepopup-theme',alwaysVisible:false},false);currentTargetPopupAnchor.FreezeBubblePopup();popupId=currentTargetPopupAnchor.GetBubblePopupID();$('#'+popupId).find('.quantity').focus();$('#'+popupId).find('.quantity').val(currentQuantity);registerPopupClickHandler($('#'+popupId),closeDiscountPopup);}
var currentCoursePopupAnchor=null;function showCoursePopup(){receiptItem=currentSelectedReceiptItemEl;closeDiscountPopup();currentTargetPopupAnchor=$('.receipt_top');if(currentTargetPopupAnchor.HasBubblePopup()){currentTargetPopupAnchor.RemoveBubblePopup();}
currentTargetPopupAnchor.CreateBubblePopup();discountsPopupHTML=$("#course_function_popup_content").html();currentTargetPopupAnchor.ShowBubblePopup({position:'bottom',align:'right',tail:{align:'right'},innerHtml:discountsPopupHTML,innerHtmlStyle:{'text-align':'left'},themeName:'all-grey',themePath:'/images/jquerybubblepopup-theme',alwaysVisible:false},false);currentTargetPopupAnchor.FreezeBubblePopup();var coursePopupId=currentTargetPopupAnchor.GetBubblePopupID();var current_course_num=receiptItem.find(".name").data("course_num");var selectedCourseEl=$('#'+coursePopupId).find('.course_label_'+current_course_num);selectedCourseEl.html(selectedCourseEl.html()+" *");registerPopupClickHandler($('#'+popupId),closeDiscountPopup);}
function showCourseMenuPopup(){receiptItem=getSelectedOrLastReceiptItem();currentTargetPopupAnchor=$('#menuCourseAnchor');if($('#menuCourseAnchor').hasClass('selected')){currentTargetPopupAnchor.removeClass("selected");currentTargetPopupAnchor.HideBubblePopup();}else{getSelectedOrLastReceiptItem();closeDiscountPopup();currentTargetPopupAnchor=$('#menuCourseAnchor');if(currentTargetPopupAnchor.HasBubblePopup()){currentTargetPopupAnchor.RemoveBubblePopup();}
currentTargetPopupAnchor.addClass("selected");currentTargetPopupAnchor.CreateBubblePopup();discountsPopupHTML=$("#course_function_popup_content").html();currentTargetPopupAnchor.ShowBubblePopup({position:'top',align:'center',tail:{align:'center'},innerHtml:discountsPopupHTML,innerHtmlStyle:{'text-align':'left'},themeName:'all-grey',themePath:'/images/jquerybubblepopup-theme',alwaysVisible:false},false);currentTargetPopupAnchor.FreezeBubblePopup();var coursePopupId=currentTargetPopupAnchor.GetBubblePopupID();var current_course_num=receiptItem.find(".name").data("course_num");var selectedCourseEl=$('#'+coursePopupId).find('.course_label_'+current_course_num);selectedCourseEl.html(selectedCourseEl.html()+" *");registerPopupClickHandler($('#'+popupId),closeDiscountPopup);}}
function applyCourseFromPopup(courseVal){$('#menuCourseAnchor').removeClass("selected");closeDiscountPopup();itemNumber=currentSelectedReceiptItemEl.data("item_number");order=getCurrentOrder();var item=order.items[itemNumber-1];item.show_course_label=true;newCourseNum=courseVal;if(selectedTable!=0){modifyOrderItem(order,itemNumber,item.amount,item.product_price,newCourseNum,item.is_void);storeTableOrderInStorage(current_user_id,selectedTable,order);}else{modifyOrderItem(order,itemNumber,item.amount,item.product_price,newCourseNum,item.is_void);storeOrderInStorage(current_user_id,order);}
order=getCurrentOrder();loadReceipt(order,true);}
function registerPopupClickHandler(popupEl,outsideClickHandler){activePopupElSet=$(popupEl);setTimeout(function(){$("body").click(function(eventObj){$('#menuCourseAnchor').removeClass("selected");if(activePopupElSet&&(activePopupElSet.has(eventObj.target).length==0)){outsideClickHandler();}});},500);}
function getExistingDiscountPercentForCurrentOrderItem(itemNumber){order=getCurrentOrder();orderItem=order.items[itemNumber-1];existingDiscount=orderItem['discount_percent'];return existingDiscount;}
function closeDiscountPopup(){if(currentTargetPopupAnchor){hideBubblePopup(currentTargetPopupAnchor);}}
function hideBubblePopup(popupEl){if(typeof(popupEl)!='undefined'){popupEl.HideBubblePopup();popupEl.FreezeBubblePopup();$("body").unbind('click');activePopupElSet=null;}}
function showEditPopupInit(){receiptItem=currentSelectedReceiptItemEl;closeEditOrderItem();showEditPopup(receiptItem);}
function getAllOrderItemsReceiptHTML(order,includeNonSyncedStyling,includeOnClick,includeServerAddedText){allOrderItemsReceiptHTML="";for(var i=0;i<order.items.length;i++){item=order.items[i];allOrderItemsReceiptHTML+=getOrderItemReceiptHTML(order.items[i],includeNonSyncedStyling,includeOnClick,includeServerAddedText);}
return allOrderItemsReceiptHTML;}
function getOrderItemReceiptHTML(orderItem,includeNonSyncedStyling,includeOnClick,includeServerAddedText){if(typeof includeNonSyncedStyling=="undefined"){includeNonSyncedStyling=true;}
if(typeof includeOnClick=="undefined"){includeOnClick=true;}
if(typeof includeServerAddedText=="undefined"){includeServerAddedText=true;}
haveDiscount=orderItem.discount_percent&&orderItem.discount_percent>0;itemPriceWithoutDiscountOrModifier=orderItem.amount*orderItem.product_price;if(haveDiscount){itemPriceWithoutModifier=itemPriceWithoutDiscountOrModifier-((itemPriceWithoutDiscountOrModifier*orderItem.discount_percent)/100);}else{itemPriceWithoutModifier=itemPriceWithoutDiscountOrModifier;}
notSyncedClass=(includeNonSyncedStyling&&!orderItem.synced)?"not_synced":"";notSyncedMarker=(includeNonSyncedStyling&&!orderItem.synced)?"*":"";onclickMarkup=includeOnClick?"onclick='doSelectReceiptItem(this)'":"";var courseLineClass=orderItem.is_course?"course":"";var hideOnPrintedReceiptClass=orderItem.product.hide_on_printed_receipt?"hide_on_printed_receipt":"";var voidClass=orderItem.is_void?"void":"";orderHTML="<div class='order_line "+notSyncedClass+" "+voidClass+" "+hideOnPrintedReceiptClass+" "+courseLineClass+"' data-item_number='"+orderItem.itemNumber+"' "+onclickMarkup+">";if(includeServerAddedText&&orderItem.showServerAddedText){var nickname=serverNickname(orderItem.serving_employee_id);var timeAdded=utilFormatTime(new Date(parseInt(orderItem.time_added)));var showAddedLine=(orderItem.itemNumber!=1);orderHTML+="<div class='server "+(showAddedLine?"added_line":"")+"'>At "+timeAdded+" "+nickname+" added:</div>";}
orderHTML+="<div class='amount'>"+orderItem.amount+"</div>";orderHTML+="<div class='name' data-course_num='"+orderItem.product.course_num+"'>"+notSyncedMarker+" ";if(orderItem.is_double){orderHTML+="Double ";}else if(orderItem.is_half){orderHTML+=halfMeasureLabel+" ";}
orderHTML+=orderItem.product.name+"</div>";orderItemTotalPriceText=number_to_currency(itemPriceWithoutModifier,{precision:2});orderHTML+="<div class='total' data-per_unit_price='"+orderItem.product_price+"'>"+(orderItem.product.show_price_on_receipt?orderItemTotalPriceText:"")+"</div>";if(orderItem.show_course_label){orderHTML+="<div class='clear'>&nbsp;</div>";orderHTML+="<div class='course_label'>Serve As "+courseLabels[parseInt(orderItem.product.course_num)]+"</div>";}
if(orderItem.modifier){orderHTML+="<div class='clear'>&nbsp;</div>";orderHTML+="<div class='modifier_name'>"+orderItem.modifier.name+"</div>";modifierPriceWithoutDiscount=orderItem.modifier.price*orderItem.amount;if(haveDiscount){modifierPrice=modifierPriceWithoutDiscount-((modifierPriceWithoutDiscount*orderItem.discount_percent)/100);}else{modifierPrice=modifierPriceWithoutDiscount;}
if(orderItem.modifier.price>0){modifierPriceText=number_to_currency(modifierPrice,{precision:2});orderHTML+="<div class='modifier_price'>"+modifierPriceText+"</div>";}
orderHTML+=clearHTML;}
if(orderItem.oia_items){for(var j=0;j<orderItem.oia_items.length;j++){oia_is_add=orderItem.oia_items[j].is_add;var hideOnReciptCSSClass=(orderItem.oia_items[j].hide_on_receipt&&orderItem.oia_items[j].abs_charge==0)?"hide_on_receipt":"";orderHTML+=clearHTML+"<div class='oia "+hideOnReciptCSSClass+"'>";orderHTML+="<div class='oia_name "+(orderItem.oia_items[j].is_note?"note":"")+"'>";if(!orderItem.oia_items[j].is_note){if(orderItem.oia_items[j].is_addable){orderHTML+=oia_is_add?"Add ":"No ";}}
orderHTML+=orderItem.oia_items[j].description+"</div>";if(orderItem.oia_items[j].abs_charge!=0){oiaPriceWithoutDiscount=orderItem.oia_items[j].abs_charge*orderItem.amount;if(haveDiscount&&oia_is_add){oiaPrice=oiaPriceWithoutDiscount-((oiaPriceWithoutDiscount*orderItem.discount_percent)/100);}else{oiaPrice=oiaPriceWithoutDiscount;}
orderHTML+="<div class='oia_price'>"+(!oia_is_add?"-":"")+currency(oiaPrice,false)+"</div>";}
orderHTML+="</div>"+clearHTML;}}
var preDiscountPrice=(orderItem.product_price*orderItem.amount);if(orderItem.modifier){preDiscountPrice+=orderItem.modifier.price*orderItem.amount;}
if(orderItem.oia_items){var oiaPriceTotal=0;for(var j=0;j<orderItem.oia_items.length;j++){var nextOia=orderItem.oia_items[j];if(nextOia.is_add){oiaPriceTotal+=orderItem.oia_items[j].abs_charge;}else{oiaPriceTotal-=orderItem.oia_items[j].abs_charge;}}
preDiscountPrice+=oiaPriceTotal*orderItem.amount;}
if(haveDiscount){formattedPreDiscountedPrice=number_to_currency(preDiscountPrice,{precision:2});orderHTML+=clearHTML;if(orderItem.discount_percent==100){orderHTML+="<div class='discount_complimentary'>Complimentary (was "+formattedPreDiscountedPrice+")</div>";}else{orderHTML+="<div class='discount'><div class='header'>Discounted</div>";orderHTML+="<div class='discount_amount'>"+orderItem.discount_percent+"% from </div>";orderHTML+="<div class='new_price'>"+formattedPreDiscountedPrice+"</div></div>";}}
orderHTML+=clearHTML+"</div>"+clearHTML;var orderTotal=getCurrentOrder().total;$('#cash_screen_sub_total_value').html(currency(orderTotal));if($('#menu_screen').is(":visible")){$('.oia_price').hide();}
return orderHTML;}
function menuRecptScroll(){recptScroll("menu_screen_");recptScroll("large_menu_screen_");}
function loadReceipt(order,doScroll){clearReceipt();if(order==null){return;}
var orderTotal=order.total;orderItems=order.items;allOrderItemsRecptHTML=getAllOrderItemsReceiptHTML(order);setReceiptsHTML(getCurrentRecptHTML()+allOrderItemsRecptHTML)
if(orderTotal!=null){writeTotalToReceipt(order,orderTotal);}
if(doScroll){menuRecptScroll();}
if(currentSelectedReceiptItemEl){var selectedReceiptItemNumber=currentSelectedReceiptItemEl.data("item_number");currentSelectedReceiptItemEl=$('#menu_screen_till_roll div[data-item_number='+selectedReceiptItemNumber+']');}}
function clearReceipt(){setReceiptsHTML("");}
function postDoSyncTableOrder(){doSelectTable(selectedTable);if(inTransferOrderMode){hideLoadingDiv();setStatusMessage("Order Transferred");inTransferOrderMode=false;$('#table_num').val(tables[selectedTable].label);doSubmitTableNumber();return;}
setStatusMessage("Order Sent");vibrate();tableScreenBack();manualCallHomePoll();}
function showModifyOrderItemScreen(){switchToModifyOrderItemSubscreen();}
function switchToMenuItemsSubscreen(){if(currentScreenIsMenu){showMenuItemsSubscreen();}}
function showMenuItemsSubscreen(){hideAllMenuSubScreens();$('#menu_screen #buttons_container').show();$('#menu_screen #cluey_logo').hide();$('#menu_container').show();setTimeout(function(){doMenuPageSelect(currentMenuPage,currentMenuPageId);},500);}
function switchToModifyOrderItemSubscreen(){if(currentScreenIsMenu){hideAllMenuSubScreens();$('.button[id=sales_button_'+modifyOrderItemButtonID+'], .button[id=admin_screen_button_'+modifyOrderItemButtonID+']').addClass("selected");$('#oia_subscreen').show();orderItemAdditionTabSelected(currentModifierGridIdForProduct);var oiaScrollerOpts={elastic:false,momentum:false};setTimeout(function(){$('#oia_tabs').touchScroll(oiaScrollerOpts);return false;},300);}}
function showTablesSubscreen(){hideAllMenuSubScreens();if(initScreenDefault=="false"){$('#menu_screen #buttons_container').hide();$('#menu_screen #cluey_logo').show();initScreenDefault="true";}
$('.button[id=sales_button_'+tablesButtonID+'], .button[id=admin_screen_button_'+tablesButtonID+']').addClass("selected");$('#table_screen').show();}
function showCoversSubscreen(){hideAllMenuSubScreens();if($('#table_num').val().toString()==''||$('#table_num').val().toString()==0||$('#table_num').val().toString()==-1){if(initScreenDefault=="false"){$('#menu_screen #buttons_container').hide();$('#menu_screen #cluey_logo').show();initScreenDefault="true";}
$('.button[id=sales_button_'+tablesButtonID+'], .button[id=admin_screen_button_'+tablesButtonID+']').addClass("selected");checkForCovers();$('#table_screen').hide();$('#covers_screen').show();}else{var table_label=$('#table_num').val().toString();table_info=getTableForLabel(table_label);if(table_info){key="user_"+current_user_id+"_table_"+table_info.id+"_current_order";storageData=retrieveStorageValue(key);tableOrderDataJSON=null;if(storageData!=null){tableOrderDataJSON=JSON.parse(storageData);}else{if(current_user_id!=masterOrdersUserId){var masterOrderKey="user_"+masterOrdersUserId+"_table_"+table_info.id+"_current_order";storageData=retrieveStorageValue(masterOrderKey);if(storageData!=null){tableOrderDataJSON=JSON.parse(storageData);}}}
checkForCovers();if(initScreenDefault=="false"){$('#menu_screen #buttons_container').hide();$('#menu_screen #cluey_logo').show();initScreenDefault="true";}
$('.button[id=sales_button_'+tablesButtonID+'], .button[id=admin_screen_button_'+tablesButtonID+']').addClass("selected");$('#table_screen').hide();$('#covers_screen').show();}else{$('#table_number_show').html("No Such Table");$('#table_num').val('')
$('#table_screen').show();$('#covers_screen').hide();}}}
function tableNumberSelectKeypadClick(val){var newVal=$('#table_num').val().toString()+val;$('#table_number_show').html(newVal);$('#table_num').val(newVal);}
function coverNumberSelectKeypadClick(val){$("#covers_num").removeClass('highlighted');if(highlightedCover){$('#covers_num').val(val);}else{var newVal=$('#covers_num').val().toString()+val;$('#covers_num').val(newVal);}
highlightedCover=false;}
function priceNumberSelectKeypadClick(val){var newVal=$('.new_price').val().toString()+val;$('.new_price').val(newVal);var displayVal=$('.new_price').val();displayVal=currency(parseInt(displayVal)/100,false);$('#price_number_show').html(displayVal.toString());}
function chargeNumberSelectKeypadClick(val){var newVal=$('.note_charge').val().toString()+val;$('.note_charge').val(newVal);var displayVal=$('.note_charge').val();displayVal=currency(parseInt(displayVal)/100,false);$('.display_charge').val(displayVal.toString());}
function doCanceltableNumberSelectKeypad(){oldVal=$('#table_num').val().toString();newVal=oldVal.substring(0,oldVal.length-1);newVal=oldVal.substring(0,oldVal.length-1);$('#table_number_show').html(newVal);$('#table_num').val(newVal);$('.new_price').val(newVal);}
function doCancelcoverNumberSelectKeypad(){$("#covers_num").removeClass('highlighted');oldVal=$('#covers_num').val().toString();newVal=oldVal.substring(0,oldVal.length-1);newVal=oldVal.substring(0,oldVal.length-1);$('#covers_num').val(newVal);}
function doCancelpriceNumberSelectKeypad(){oldVal=$('.new_price').val().toString();newVal=oldVal.substring(0,oldVal.length-1);$('#price_number_show').html(newVal);$('.new_price').val(newVal);}
function doCancelchargeNumberSelectKeypad(){oldVal=$('.note_charge').val().toString();newVal=oldVal.substring(0,oldVal.length-1);$('.note_charge').val(newVal);$('.display_charge').val(newVal);}
function setNewPrice(val){$('.new_price').val(parseInt(val)/100);saveEditOrderItem();backScreenNav();}
function setNewCharge(val){if(val!=""){$('.note_charge').val(parseInt(val)/100);}else{$('.note_charge').val('')}}
function backScreenNav(){if(menuScreenDefault=="true"){showMenuItemsSubscreen();}else{showMenuItemsSubscreen();swipeToReceipt();menuScreenDefault="true"}}
var menuScreenDefault="true";var initScreenDefault="false";function setScreenOrder(value){menuScreenDefault=value;}
function setInitScreen(value){initScreenDefault=value;}
function swipeToNote(){if(selectedTable==0){niceAlert("Please select a table first");return;}else{setInitScreen('true');$('#edit_price_screen').hide();showAddNotePopup()}}
function swipeToCovers(){if(selectedTable==0){niceAlert("Please select a table first");return;}else{swipeToMenu();hideAllMenuSubScreens();showCoversSubscreen();}}
function doSubmitTableNumber(){if(!ensureLoggedIn()){return;}
var table_label=$('#table_num').val().toString();table_info=getTableForLabel(table_label);if(!table_info){$('#table_number_show').html("No Such Table");$('#table_num').val('')
return;}
if(inTransferOrderMode){if(transferOrderInProgress){niceAlert("Transfer table order in progress, please wait");return;}
doTransferTable(selectedTable,table_info.id);clearTableNumberEntered()
return;}
current_table_label=table_label;doSelectTable(table_info.id);clearTableNumberEntered();if(menuScreenDefault=="true"){showMenuItemsSubscreen();}else{showMenuItemsSubscreen();swipeToReceipt();menuScreenDefault="true"}}
function transferOrderError(){hideNiceAlert();inTransferOrderMode=false;transferOrderInProgress=false;showMenuItemsSubscreen();setStatusMessage("Error transfering order. Server might be down");return;}
function removeTableClass(table_class){$('.button').removeClass("selected");}
function clearTableNumberEntered(){$('#table_num').val("");$('#table_number_show').html("");}
function postDoSelectTable(){var theLabel="Table "+current_table_label;$('.button[id=sales_button_'+tablesButtonID+'] .button_name').html(theLabel);$('#receipt_screen #header #table_name').html(theLabel);manualCallHomePoll();}
function orderItemAdditionTabSelected(oiagId){if(!oiagId){oiagId=$('#oia_tabs .oia_tab').first().data("oiag_id");}
clearSelectedOIATabs();$('#oia_tab_'+oiagId).addClass("selected");$('.oia_container').hide();modifierGridXSize=$('#oiag_'+oiagId).data("grid_x_size");modifierGridYSize=$('#oiag_'+oiagId).data("grid_y_size");initModifierGrid();$('#oiag_'+oiagId).show();setOrderItemAdditionsGridState();}
function clearSelectedOIATabs(){$('#oia_tabs .tab').removeClass("selected");}
function writeTotalToReceipt(order,orderTotal){if(!order)return;console.log("Write total to receipt NYI");}
function tableScreenBack(){if(selectedTable==0){$('#table_number_show').html("Enter a Table");return;}
showMenuItemsSubscreen();}
function doReceiveOrderReady(employee_id,terminal_id,table_id,order_num,table_label){hidePreviousOrderReadyPopup();if(employee_id==current_user_id||allDevicesOrderNotification){vibrateConstant();var orderReadyText;if(table_id.toString()=="0"){orderReadyText="Order #"+order_num;}else{orderReadyText="Order #"+order_num+" for table "+table_label;}
ModalPopups.Alert('niceAlertContainer','Order Ready!',"<div id='nice_alert'>"+orderReadyText+" is ready</div>",{okButtonText:'OK',onOk:'orderReadyOKClicked()',width:400,height:250});}}
function orderReadyOKClicked(){hideOrderReadyPopup();stopVibrate();console.log("Order accepted!!");}
function orderReadyCancelClicked(){hideOrderReadyPopup();stopVibrate();console.log("Order rejected!!");}
function hidePreviousOrderReadyPopup(){hideOrderReadyPopup();}
function hideOrderReadyPopup(){try{ModalPopups.Close('niceAlertContainer');}catch(e){}}
function displayDropdownSelected(selectedDisplayId){showSpinner();$.ajax({type:'POST',url:'/admin/terminals/link_display',success:function(){window.location.reload();},data:{terminal_id:terminalID,display_id:selectedDisplayId}});}
function logoutShortcut(){if(current_user_id==null){return;}
showLoadingDiv();var id_for_logout=current_user_id;current_user_id=null;storeActiveUserID(null);$.ajax({type:'POST',url:'/logout',complete:goToMainMenu,data:{employee_id:id_for_logout}});}
function doAutoCovers(){promptAddCovers();}
function setStatusMessage(message,hide,shake){niceAlert(message);console.log("Status message set "+message);}
function initMcDropDowns(){$("#room_select_input").mcDropdown("#room_select",{maxRows:6});roomSelectMenu=$("#room_select_input").mcDropdown();$("#menu_select_input").mcDropdown("#menu_select");menuSelectMenu=$("#menu_select_input").mcDropdown();}
function hideAllMenuSubScreens(){$('#menu_container').hide();$('.button[id=sales_button_'+tablesButtonID+'], .button[id=admin_screen_button_'+tablesButtonID+']').removeClass("selected");$('#table_screen').hide();$('.button[id=sales_button_'+modifyOrderItemButtonID+'], .button[id=admin_screen_button_'+tablesButtonID+']').removeClass("selected");$('#oia_subscreen').hide();}
function currentMenuSubscreenIsMenu(){return $('#menu_container').is(":visible");}
function currentMenuSubscreenIsModifyOrderItem(){return $('#oia_subscreen').is(":visible");}
function currentMenuSubscreenIsTableScreen(){return $('#table_screen').is(":visible");}
var utliKeypadClickFunction;var utilKeypadCancelFunction;function setUtilKeypad(position,clickFunction,cancelFunction){$(position).html($('#util_keypad_container').html());utliKeypadClickFunction=clickFunction;utilKeypadCancelFunction=cancelFunction;}
function utilKeypadClick(val){utliKeypadClickFunction(val);}
function doCancelUtilKeypad(){utilKeypadCancelFunction();}
function getSelectedOrLastReceiptItem(){if(!currentSelectedReceiptItemEl){currentSelectedReceiptItemEl=$('#menu_screen_till_roll > div.order_line:last');if(currentSelectedReceiptItemEl.length==0){setStatusMessage("There are no receipt items");return null;}}
return currentSelectedReceiptItemEl;}
function getLastReceiptItem(){lastReceiptItemEl=$('#menu_screen_till_roll > div.order_line:last');if(lastReceiptItemEl.length==0){setStatusMessage("There are no receipt items");return null;}
return lastReceiptItemEl;}
function postSetConnectionStatus(connected){if(!connected){$('body').addClass("disconnected");}else{$('body').removeClass("connected");}}
function kickMenuScrollers(){if($('#menu_items_scroller:visible').length>0&&$('#menu_pages_scroller:visible').length>0){$('#menu_items_scroller').touchScroll('update');currentHeight=$('#menu_items_scroller').height();scrollHeight=$('#menu_items_scroller').attr('scrollHeight');newHeight=scrollHeight-currentHeight;$('#menu_items_scroller').touchScroll('setPosition',0);$('#menu_pages_scroller').touchScroll('update');currentHeight=$('#menu_pages_scroller').height();scrollHeight=$('#menu_pages_scroller').attr('scrollHeight');newHeight=scrollHeight-currentHeight;$('#menu_pages_scroller').touchScroll('setPosition',0);}
if($('#oia_tabs:visible').length>0){$('#oia_tabs').touchScroll('update');currentHeight=$('#oia_tabs').height();scrollHeight=$('#oia_tabs').attr('scrollHeight');newHeight=scrollHeight-currentHeight;$('#oia_tabs').touchScroll('setPosition',0);}}
function showTablesScreen(){if(currentMenuSubscreenIsTableScreen()){hideAllMenuSubScreens();showMenuItemsSubscreen();}else{showTablesSubscreen();}}
function showMoreOptionsScreen(){alert("functions button pressed");}
function goToMainMenu(){showSpinner();alert("this is meant to go to /manager now");}
function showGlobalSettingsPage(){swipeToSettings();}
function initModifierGrid(){var rowWidth=$('div#order_item_additions').css("width");var newWidth=roundNumberDown(parseFloat(rowWidth)/modifierGridXSize,0)-5;$('div#order_item_additions .grid_row .grid_item').css("width",newWidth+"px");var panelHeight=$('div#oia_subscreen').css("height");var newHeight=roundNumberDown(parseFloat(panelHeight)/modifierGridYSize,0)-6;$('div#order_item_additions .grid_row .grid_item').css("height",newHeight+"px");}
function indicateSalesResourcesReloadRequired(reloadTerminalId){promptReloadSalesResources(reloadTerminalId);}
function indicateActionRequired(functionToPerform){functionToPerform.call();}
function initTouch(){new NoClickDelay(document.body);$('#wrapper').swipe({minSwipeLength:250,swipeRight:function(){swipeRightHandler();},swipeUp:function(){swipeUpHandler();},swipeLeft:function(){swipeLeftHandler();},swipeDown:function(){swipeDownHandler();}});}
var thisClickTarget=null;var lastClickTarget=null;var thisClickTimestamp=0;var lastClickTimestamp=0;var cancelFollowClick=false;function NoClickDelay(el){this.element=el;this.element.addEventListener('touchstart',this,false);$('.key').each(function(){var el=$(this);var clickhandler=el.attr("onclick");el.attr("onclick","return false;");el.click(function(e){cancelFollowClick=false;thisClickTarget=el;thisClickTimestamp=Date.now();if(thisClickTarget==lastClickTarget&&thisClickTimestamp-lastClickTimestamp<500){e.preventDefault();e.stopPropagation();cancelFollowClick=true;return false;}else{lastClickTarget=thisClickTarget;lastClickTimestamp=thisClickTimestamp;}});if(clickhandler){el.click(function(e){if(!cancelFollowClick){clickhandler();}});}});}
NoClickDelay.prototype={handleEvent:function(e){switch(e.type){case'touchstart':this.onTouchStart(e);break;case'touchmove':this.onTouchMove(e);break;case'touchend':this.onTouchEnd(e);break;}},onTouchStart:function(e){this.theTarget=document.elementFromPoint(e.targetTouches[0].clientX,e.targetTouches[0].clientY);targetIsSelectElement=this.theTarget.tagName=="SELECT";targetIsInputElement=this.theTarget.tagName=="INPUT";if(!targetIsSelectElement&&!targetIsInputElement){e.preventDefault();if(this.theTarget.nodeType==3){this.theTarget=theTarget.parentNode;}
this.checkTarget=this.theTarget;this.element.addEventListener('touchmove',this,false);this.element.addEventListener('touchend',this,false);this.element.addEventListener('touchcancel',this,false);}},onTouchCancel:function(e){console.log("Touch cancel");},onTouchMove:function(e){this.checkTarget=document.elementFromPoint(e.targetTouches[0].clientX,e.targetTouches[0].clientY);if(this.checkTarget.nodeType==3)this.checkTarget=this.checkTarget.parentNode;},onTouchEnd:function(e){e.preventDefault();e.stopPropagation();this.element.removeEventListener('touchmove',this,false);this.element.removeEventListener('touchend',this,false);if(this.checkTarget==this.theTarget){var theEvent=document.createEvent('MouseEvents');theEvent.initEvent('click',true,true);this.theTarget.dispatchEvent(theEvent);}
this.theTarget=undefined;}};function toggleModifyOrderItemScreen(){if(currentMenuSubscreenIsModifyOrderItem()){hideAllMenuSubScreens();switchToMenuItemsSubscreen();}else{showModifyOrderItemScreen();}}
function saveServiceCharge(performTotal){serviceCharge=parseFloat(serviceCharge);if(isNaN(serviceCharge)){serviceCharge=0;}
order=getCurrentOrder();order.service_charge=serviceCharge;if(selectedTable!=0){storeTableOrderInStorage(current_user_id,selectedTable,order);}else{storeOrderInStorage(current_user_id,order);}}
function promptAddNameToTable(){alert("Implement Me!");}
function changeCourseNum(){var receiptItem=getSelectedOrLastReceiptItem();if(receiptItem){var itemNumber=receiptItem.data("item_number");var currentOrder=getCurrentOrder();var orderItem=currentOrder.items[itemNumber-1];alert("popup for change course num");}}
function tablesButtonPressed(){showTablesScreen();}
function voidOrderItem(){alert("Implement Me!");}
function voidAllOrderItems(){alert("Implement Me!");}
function promptAddCovers(){checkForCovers();showCoversSubscreen();}
function saveAddCovers(){if($('#table_num').val().toString()!=''){doSubmitTableNumber()}
if(selectedTable==-1){showTablesSubscreen();return;}
var covers=$("#covers_num").val();if(covers!=''){var tableOrder=getCurrentOrder();if(parseInt(tableOrder.covers)==0){covers=parseInt(covers);if(isNaN(covers)||covers<0){covers=0;}
tableOrder.covers=covers;if(selectedTable==0){showTablesSubscreen();return;}
if(!currentOrderEmpty()){if(manualCoversPrompt){doAutoLoginAfterSync=true;}
manualCoversPrompt=true;doSyncTableOrder();$("#covers_num").val('');}
tableScreenBack();}else{tableOrder.covers=covers;manualCoversPrompt=true;storeTableOrderInStorage(current_user_id,selectedTable,tableOrder);doSyncTableOrder();$("#covers_num").val('');tableScreenBack();}}else{tableScreenBack();$("#covers_num").val('');}}
function checkForCovers(){var tableOrder=getCurrentOrder();if(parseInt(tableOrder.covers)!=0||parseInt(tableOrder.covers)!=-1){$("#covers_num").val(tableOrder.covers);$("#covers_num").addClass('highlighted');}
if(parseInt(tableOrder.covers)==-1||parseInt(tableOrder.covers)==0||parseInt(tableOrder.covers)=='0'||tableOrder.covers=='-1'){$("#covers_num").val('');$("#covers_num").removeClass('highlighted');}
if(selectedTable==0){$("#covers_num").removeClass('highlighted');}
highlightedCover=true;}
function toggleTrainingMode(){}
function getCurrentRecptHTML(){return $('#menu_screen_till_roll').html();}
function displayLastReceipt(){var lastReceiptID=fetchLastReceiptID(current_user_id);if(lastReceiptID==0){$('#table_num_holder').html("Select Table");showTablesSubscreen();return;}
current_table_label=tables[lastReceiptID].label;doSelectTable(lastReceiptID);}
function setReceiptsHTML(thehtml){$('#menu_screen_till_roll').html(thehtml);$('#large_menu_screen_till_roll').html(thehtml);}
function swipeRightHandler(){if(currentScreenIsMenu){return;}
hideMenuKeypad();var currentLeftScroll=$('#content-scroll').attr('scrollLeft');var previousPageScroll=currentLeftScroll-pageWidth;if(doScroll(previousPageScroll)){hideAndroidKeyboard();if(currentScreenIsFunctions){currentScreenIsFunctions=false;currentScreenIsMenu=true;}else if(currentScreenIsSettings){currentScreenIsSettings=false;currentScreenIsFunctions=true;}
setTimeout(menuRecptScroll,scrollSpeed+100);}}
function swipeUpHandler(){}
function swipeLeftHandler(){if(currentScreenIsMenu){return;}
hideMenuKeypad();var currentLeftScroll=$('#content-scroll').attr('scrollLeft');var nextPageScroll=currentLeftScroll+pageWidth;if(doScroll(nextPageScroll)){hideAndroidKeyboard();if(currentScreenIsReceipt){currentScreenIsReceipt=false;currentScreenIsMenu=true;}else if(currentScreenIsFunctions){currentScreenIsFunctions=false;currentScreenIsSettings=true;}
setTimeout(menuRecptScroll,scrollSpeed+100);}}
function swipeDownHandler(){}
function showMenuKeypad(){menuKeypadShowing=true;$('#menu_keypad').slideDown(300);}
function hideMenuKeypad(){menuKeypadShowing=false;$('#menu_keypad').slideUp(300);}
function doScroll(scrollLeftValue){if(scrollLeftValue<0||scrollLeftValue>(pageWidth*numPages-1)){return false;}
$("#content-scroll").animate({scrollLeft:scrollLeftValue},scrollSpeed);return true;}
function swipeToReceipt(){if(currentScreenIsReceipt)return;clearAllPageFlags();doScroll((receiptPageNum-1)*pageWidth);currentScreenIsReceipt=true;}
function swipeToMenu(){if(!callHomePollInitSequenceComplete){niceAlert("Downloading data from server, please wait");return;}
if(currentScreenIsMenu)return;clearAllPageFlags();doScroll((menuPageNum-1)*pageWidth);currentScreenIsMenu=true;setTimeout(function(){doMenuPageSelect(currentMenuPage,currentMenuPageId);},500);}
function swipeToFunctions(){if(currentScreenIsFunctions)return;clearAllPageFlags();doScroll((functionsPageNum-1)*pageWidth);currentScreenIsFunctions=true;}
function swipeToSettings(){if(currentScreenIsSettings)return;clearAllPageFlags();doScroll((settingsPageNum-1)*pageWidth);currentScreenIsSettings=true;}
function clearAllPageFlags(){currentScreenIsFunctions=currentScreenIsMenu=currentScreenIsReceipt=currentScreenIsSettings=false;}
function setFirstPage(){pageNum=functionsPageNum;$("#content-scroll").scrollLeft((pageNum-1)*pageWidth);currentScreenIsFunctions=true;}