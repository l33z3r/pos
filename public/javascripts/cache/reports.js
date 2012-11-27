
$(function(){setReportsDatePickers();});var selectedFromDate;var selectedToDate;var search_type;var terminalId;var hour_from;var hour_to;var select_type='';function setReportsDatePickers(){$('#date_select_container').find('#date_from').datetimepicker({dateFormat:'yy-mm-dd',defaultDate:'01/01/01',timeFormat:'hh:mm',addSliderAccess:true,sliderAccessArgs:{touchonly:false}});$('#date_select_container').find('#date_to').datetimepicker({dateFormat:'yy-mm-dd',defaultDate:'01/01/01',timeFormat:'hh:mm',addSliderAccess:true,sliderAccessArgs:{touchonly:false}});}
var TODAY="1"
var YESTERDAY="2"
var LAST_WEEK="3"
var LAST_MONTH="4"
var ALL_TIME="5"
function addTerminalFilter(terminal_id){terminalId=terminal_id;setReportParams();setStockParams();}
function addHourFromFilter(hour){hour_from=hour;}
function addHourToFilter(hour){hour_to=hour;}
function printInvoice(url){var iframe=document.createElement('iframe'),iframeDocument;iframe.style.postion='absolute';iframe.style.left='-9999px';iframe.src=url;document.body.appendChild(iframe);if('contentWindow'in iframe){iframeDocument=iframe.contentWindow;}else{iframeDocument=iframe.contentDocument;}
var script=iframeDocument.createElement('script');script.type='text/javascript';script.innerHTML='window.print();';iframeDocument.getElementsByTagName('head')[0].appendChild(script);}
function setDateParams(set_date,isManual){$('#date_from').val(set_date.split(',')[0]);$('#date_to').val(set_date.split(',')[1]);selectedFromDate=set_date.split(',')[0];selectedToDate=set_date.split(',')[1];if(isManual){setReportParams();setStockParams();}}
function updateDateParams(set_date,date_type){var olddate=new Date(set_date);var subbed=new Date(olddate-1*60*60*1000);var newtime=subbed.getFullYear()+"-"+(parseInt(subbed.getMonth())+1)+"-"+subbed.getDate()+" "+subbed.getHours()+":"+subbed.getMinutes()
if(date_type=='from'){selectedFromDate=newtime;}else{selectedToDate=newtime;}}
function addDateFilter(interval_selected){$('#date_from').val("");$('#date_to').val("");var day_to=(interval_selected==YESTERDAY)?1:0;var toDate=new Date();toDate.setDate(new Date().getDate()-day_to);selectedToDate=formatDate(toDate,"dd-MM-yyyy");var day_from;switch(interval_selected){case TODAY:day_from=0;break;case YESTERDAY:day_from=1;break;case LAST_WEEK:day_from=7;break;case LAST_MONTH:day_from=30;break;case ALL_TIME:day_from=-1;break;}
if(day_from!=-1){var fromDate=new Date();fromDate.setDate(new Date().getDate()-day_from);selectedFromDate=formatDate(fromDate,"dd-MM-yyyy");}
else{selectedFromDate="";selectedToDate="";}}
function runGlancesSearch(){$("#at_a_glance_results").html("Loading...");$.ajax({type:'GET',url:'/reports/glances/glances_search',data:{"search[created_at_gt]":selectedFromDate,"search[created_at_lt]":selectedToDate,"search[terminal_id_equals]":terminalId,"search2[hour_from]":hour_from,"search2[hour_to]":hour_to}});}
function runSalesSearch(){if(!$('#refine_button').is('.selected')){$("#report_sales_results").html("Loading...");$('#refine_button').addClass("selected");if($('#product_search').val()!=''){$.ajax({type:'GET',url:'/reports/sales/load_dropdown',data:{"search[search_product]":$('#product_search').val(),"search[dropdown_type]":'',"search[dropdown_id]":''}}).done(function(){$.ajax({type:'GET',url:'/reports/sales/sales_search',data:{"search[created_at_gt]":selectedFromDate,"search[created_at_lt]":selectedToDate,"search[terminal_id_equals]":terminalId,"search2[hour_from]":hour_from,"search2[hour_to]":hour_to}});});}else{$.ajax({type:'GET',url:'/reports/sales/set_params',data:{"search[search_type]":search_type,"search[category]":$('#category_id_equals').val(),"search[product]":$('#product_id_equals').val(),"search[from_date]":selectedFromDate,"search[to_date]":selectedToDate,"search[terminal]":terminalId,"search[select_type]":select_type,"search[training_mode]":inTrainingMode}}).done(function(){$.ajax({type:'GET',url:'/reports/sales/sales_search',data:{"search[created_at_gt]":selectedFromDate,"search[created_at_lt]":selectedToDate,"search[terminal_id_equals]":terminalId,"search2[hour_from]":hour_from,"search2[hour_to]":hour_to}});});}}}
function runStocksSearch(){if(!$('#refine_button_stock').is('.selected')){$("#report_stocks_results").html("Loading...");$('#refine_button_stock').addClass("selected");$.ajax({type:'GET',url:'/reports/stocks/set_params',data:{"search[search_type]":search_type,"search[category]":$('#category_id_equals').val(),"search[product]":$('#product_id_equals').val(),"search[from_date]":selectedFromDate,"search[to_date]":selectedToDate,"search[terminal]":terminalId,"search[select_type]":select_type,"search[training_mode]":inTrainingMode}}).done(function(){$.ajax({type:'GET',url:'/reports/stocks/stocks_search',data:{"search[created_at_gt]":selectedFromDate,"search[created_at_lt]":selectedToDate,"search[terminal_id_equals]":terminalId,"search2[hour_from]":hour_from,"search2[hour_to]":hour_to}});});}}
function setReportParams(){select_type=''
$.ajax({type:'GET',url:'/reports/sales/set_params',data:{"search[search_type]":search_type,"search[category]":$('#category_id_equals').val(),"search[product]":$('#product_id_equals').val(),"search[from_date]":selectedFromDate,"search[to_date]":selectedToDate,"search[terminal]":terminalId,"search[training_mode]":inTrainingMode}});}
function setStockParams(){select_type=''
$.ajax({type:'GET',url:'/reports/stocks/set_params',data:{"search[search_type]":search_type,"search[category]":$('#category_id_equals').val(),"search[product]":$('#product_id_equals').val(),"search[from_date]":selectedFromDate,"search[to_date]":selectedToDate,"search[terminal]":terminalId,"search[training_mode]":inTrainingMode}});}
function setHighChart(){$.ajax({type:'GET',url:'/reports/sales/render_graph',data:{"search[search_type]":search_type,"search[category]":$('#category_id_equals').val(),"search[product]":$('#product_id_equals').val(),"search[from_date]":selectedFromDate,"search[to_date]":selectedToDate,"search[terminal]":terminalId}});}
function loadDropDown(drop_type){var drop_val="";if(drop_type=='category'){drop_val=$('#category_id_equals').val()}else{drop_val=$('#product_id_equals').val()}
$.ajax({type:'GET',url:'/reports/sales/load_dropdown',data:{"search[dropdown_type]":drop_type,"search[dropdown_id]":drop_val,"search[search_product]":''}});$.ajax({type:'GET',url:'/reports/stocks/load_dropdown',data:{"search[dropdown_type]":drop_type,"search[dropdown_id]":drop_val}});}
function switchView(view_type){if(view_type=="table"){$("#graph_view").removeClass("selected");$("#table_view").addClass("selected");$('#sales_items_graph').hide();$('#stocks_items_graph').hide();$('#sales_items').show();$('#stock_items').show();}
if(view_type=="graph"){$("#graph_view").addClass("selected");$("#table_view").removeClass("selected");$('#sales_items_graph').show();$('#stocks_items_graph').show();$('#sales_items').hide();$('#stock_items').hide();}}
function setStockSearchType(interval_selected){switch(interval_selected){case'0':search_type='all';break;case'1':search_type='by_product';break;case'2':search_type='by_category';break;case'3':search_type='by_trans_type';break;}
setStockParams();}
function setSearchTerm(drop_type){$('#category_id_equals').val('Any')
$('#product_id_equals').val('Any')
if(drop_type==''){$.ajax({type:'GET',url:'/reports/sales/load_dropdown',data:{"search[search_product]":'',"search[dropdown_type]":'',"search[dropdown_id]":''}});}}
function setSearchType(interval_selected){switch(interval_selected){case'0':search_type='best_seller';$('#product_dropdown').hide();$('#product_search').val('');$('#string_search_box').hide();break;case'1':search_type='worst_seller';$('#product_dropdown').hide();$('#product_search').val('');$('#string_search_box').hide();break;case'2':search_type='day';$('#product_dropdown').show();$('#string_search_box').show();break;case'3':search_type='week';$('#product_dropdown').show();$('#string_search_box').show();break;case'4':search_type='month';$('#product_dropdown').show();$('#string_search_box').show();break;case'5':search_type='year';$('#product_dropdown').show();$('#string_search_box').show();break;case'6':search_type='by_product';$('#product_dropdown').hide();$('#product_search').val('');$('#string_search_box').hide();break;case'7':search_type='by_category';$('#product_dropdown').hide();$('#product_search').val('');$('#string_search_box').hide();break;}
setReportParams();}
function setSearchSelect(set_type){if(set_type==-1){$('#sales_items_graph').hide();$('#search_type_select').attr('selectedIndex',0);$('#date_preselect').attr('selectedIndex',10);$('#category_id_equals').attr('selectedIndex',0);$('#product_id_equals').attr('selectedIndex',0);search_type='best_seller';setDateParams($('#date_preselect').val(),false);select_type=set_type}
if(set_type==0){$('#search_type_select').attr('selectedIndex',2);$('#date_preselect').attr('selectedIndex',2);search_type='day';setDateParams($('#date_preselect').val(),false);select_type=set_type}
if(set_type==1){$('#search_type_select').attr('selectedIndex',0);$('#date_preselect').attr('selectedIndex',3);search_type='best_seller';setDateParams($('#date_preselect').val(),false);select_type=set_type}
if(set_type==2){$('#search_type_select').attr('selectedIndex',4);$('#date_preselect').attr('selectedIndex',4);search_type='month';setDateParams($('#date_preselect').val(),false);select_type=set_type}
if(set_type==3){$('#search_type_select').attr('selectedIndex',0);$('#date_preselect').attr('selectedIndex',2);search_type='best_seller';setDateParams($('#date_preselect').val(),false);select_type=set_type}
$.ajax({type:'GET',url:'/reports/sales/set_params',data:{"search[search_type]":search_type,"search[category]":$('#category_id_equals').val(),"search[product]":$('#product_id_equals').val(),"search[from_date]":selectedFromDate,"search[to_date]":selectedToDate,"search[terminal]":terminalId,"search[select_type]":select_type,"search[training_mode]":inTrainingMode}}).done(function(){runSalesSearch();});}
function setStockSelect(set_type){if(set_type==-1){$('#sales_items_graph').hide();$('#search_type_select').attr('selectedIndex',0);$('#date_preselect').attr('selectedIndex',10);$('#category_id_equals').attr('selectedIndex',0);$('#category_id_equals').attr('selectedIndex',0);$('#product_id_equals').attr('selectedIndex',0);search_type='best_seller';setDateParams($('#date_preselect').val(),false);select_type=set_type}
if(set_type==0){$('#search_type_select').attr('selectedIndex',0);$('#date_preselect').attr('selectedIndex',2);search_type='by_product';setDateParams($('#date_preselect').val(),false);select_type=set_type}
if(set_type==1){$('#search_type_select').attr('selectedIndex',0);$('#date_preselect').attr('selectedIndex',3);search_type='by_product';setDateParams($('#date_preselect').val(),false);select_type=set_type}
if(set_type==2){$('#search_type_select').attr('selectedIndex',0);$('#date_preselect').attr('selectedIndex',4);search_type='by_product';setDateParams($('#date_preselect').val(),false);select_type=set_type}
if(set_type==3){$('#search_type_select').attr('selectedIndex',0);$('#date_preselect').attr('selectedIndex',9);search_type='by_product';setDateParams($('#date_preselect').val(),false);select_type=set_type}
$.ajax({type:'GET',url:'/reports/stocks/set_params',data:{"search[search_type]":search_type,"search[category]":$('#category_id_equals').val(),"search[product]":$('#product_id_equals').val(),"search[from_date]":selectedFromDate,"search[to_date]":selectedToDate,"search[terminal]":terminalId,"search[select_type]":select_type,"search[training_mode]":inTrainingMode}}).done(function(){runStocksSearch();});}
$(function(){setReportsDatePickers();});var selectedFromDate;var selectedToDate;var search_type;var terminalId;var hour_from;var hour_to;var drop_val;var discounts_only=false;var drop_set_type;var select_type='';function setPaymentReportsDatePickers(){$('#date_select_container').find('#date_from').datetimepicker({dateFormat:'yy-mm-dd',defaultDate:'01/01/01',timeFormat:'h:m',addSliderAccess:true,sliderAccessArgs:{touchonly:false}});$('#date_select_container').find('#date_to').datetimepicker({dateFormat:'yy-mm-dd',defaultDate:'01/01/01',timeFormat:'h:m',addSliderAccess:true,sliderAccessArgs:{touchonly:false}});}
var TODAY="1"
var YESTERDAY="2"
var LAST_WEEK="3"
var LAST_MONTH="4"
var ALL_TIME="5"
function addPaymentTerminalFilter(terminal_id){terminalId=terminal_id;setPaymentReportParams();}
function setPaymentDateParams(set_date,isManual){$('#date_from').val(set_date.split(',')[0]);$('#date_to').val(set_date.split(',')[1]);selectedFromDate=set_date.split(',')[0];selectedToDate=set_date.split(',')[1];if(isManual){setPaymentReportParams();}}
function runPaymentsSearch(){if(!$('#refine_button').is('.selected')){$("#report_payments_results").html("Loading...");$('#refine_button').addClass("selected");$.ajax({type:'GET',url:'/reports/payments/set_params',data:{"search[search_type]":search_type,"search[from_date]":selectedFromDate,"search[to_date]":selectedToDate,"search[terminal]":terminalId,"search[select_type]":select_type,"search[discounts_only]":discounts_only,"search[training_mode]":inTrainingMode}}).done(function(){$.ajax({type:'GET',url:'/reports/payments/payments_search',data:{"search[created_at_gt]":selectedFromDate,"search[created_at_lt]":selectedToDate,"search[terminal_id_equals]":terminalId,"search2[hour_from]":hour_from,"search2[hour_to]":hour_to}});});}}
function setPaymentReportParams(){select_type=''
$.ajax({type:'GET',url:'/reports/payments/set_params',data:{"search[search_type]":search_type,"search[from_date]":selectedFromDate,"search[to_date]":selectedToDate,"search[terminal]":terminalId,"search[training_mode]":inTrainingMode}});}
function loadPaymentDropDown(drop_type){drop_val="";drop_set_type=drop_type;if(drop_type=='payment_type'){drop_val=$('#payment_method_id_equals').val()}
if(drop_type=='employee'){drop_val=$('#employee_id_equals').val()}
if(drop_type=='discounts_only'){drop_val=$('#discounts_checked').is(":checked")
discounts_only=drop_val}
$.ajax({type:'GET',url:'/reports/payments/load_dropdown',data:{"search[dropdown_type]":drop_set_type,"search[dropdown_id]":drop_val}});}
function switchPaymentView(view_type){if(view_type=="table"){$("#graph_view").removeClass("selected");$("#table_view").addClass("selected");$('#payments_items_graph').hide();$('#payments_items').show();}
if(view_type=="graph"){$("#graph_view").addClass("selected");$("#table_view").removeClass("selected");$('#payments_items_graph').show();$('#payments_items').hide();}}
function setPaymentSearchType(interval_selected){switch(interval_selected){case'0':search_type='transaction_list';break;case'1':search_type='day';break;case'2':search_type='week';break;case'3':search_type='month';break;case'4':search_type='year';break;}
setPaymentReportParams();}
function setPaymentSelect(set_type){if(set_type==-1){$('#payments_items_graph').hide();$('#search_type_select').attr('selectedIndex',0);$('#date_preselect').attr('selectedIndex',10);$('#category_id_equals').attr('selectedIndex',0);$('#category_id_equals').attr('selectedIndex',0);$('#product_id_equals').attr('selectedIndex',0);search_type='transaction_list';$('#discounts_checked').removeAttr('checked')
setDateParams($('#date_preselect').val(),false);select_type=set_type}
if(set_type==0){$('#search_type_select').attr('selectedIndex',0);$('#date_preselect').attr('selectedIndex',2);search_type='transaction_list';$('#discounts_checked').removeAttr('checked')
setDateParams($('#date_preselect').val(),false);select_type=set_type}
if(set_type==1){$('#search_type_select').attr('selectedIndex',0);$('#date_preselect').attr('selectedIndex',5);$('#discounts_checked').attr('checked','checked')
search_type='transaction_list';discounts_only=true
drop_set_type="discounts_only"
setDateParams($('#date_preselect').val(),false);select_type=set_type}
if(set_type==2){$('#search_type_select').attr('selectedIndex',3);$('#date_preselect').attr('selectedIndex',4);search_type='month';$('#discounts_checked').removeAttr('checked')
setDateParams($('#date_preselect').val(),false);select_type=set_type}
if(set_type==3){$('#search_type_select').attr('selectedIndex',1);$('#date_preselect').attr('selectedIndex',4);search_type='day';$('#discounts_checked').removeAttr('checked')
setDateParams($('#date_preselect').val(),false);select_type=set_type}
$.ajax({type:'GET',url:'/reports/payments/load_dropdown',data:{"search[dropdown_type]":drop_set_type,"search[dropdown_id]":discounts_only}}).done(function(){$.ajax({type:'GET',url:'/reports/payments/set_params',data:{"search[search_type]":search_type,"search[from_date]":selectedFromDate,"search[to_date]":selectedToDate,"search[terminal]":terminalId,"search[select_type]":select_type,"search[training_mode]":inTrainingMode}})}).done(function(){runPaymentsSearch();discounts_only='';});}
function updatePaymentDateParams(set_date,date_type){var olddate=new Date(set_date);var subbed=new Date(olddate-1*60*60*1000);var newtime=subbed.getFullYear()+"-"+(parseInt(subbed.getMonth())+1)+"-"+subbed.getDate()+" "+subbed.getHours()+":"+subbed.getMinutes()
if(date_type=='from'){selectedFromDate=newtime;}else{selectedToDate=newtime;}}
$(function(){setReportsDatePickers();});var selectedFromDate;var selectedToDate;var search_type;var terminalId;var hour_from;var hour_to;var drop_val;var discounts_only=false;var drop_set_type;var select_type='';function setPaymentReportsDatePickers(){$('#date_select_container').find('#date_from').datetimepicker({dateFormat:'yy-mm-dd',defaultDate:'01/01/01',timeFormat:'h:m',addSliderAccess:true,sliderAccessArgs:{touchonly:false}});$('#date_select_container').find('#date_to').datetimepicker({dateFormat:'yy-mm-dd',defaultDate:'01/01/01',timeFormat:'h:m',addSliderAccess:true,sliderAccessArgs:{touchonly:false}});}
var TODAY="1"
var YESTERDAY="2"
var LAST_WEEK="3"
var LAST_MONTH="4"
var ALL_TIME="5"
function addPaymentTerminalFilter(terminal_id){terminalId=terminal_id;setPaymentReportParams();}
function setPaymentDateParams(set_date,isManual){$('#date_from').val(set_date.split(',')[0]);$('#date_to').val(set_date.split(',')[1]);selectedFromDate=set_date.split(',')[0];selectedToDate=set_date.split(',')[1];if(isManual){setPaymentReportParams();}}
function setStaffDateParams(set_date,isManual){$('#date_from').val(set_date.split(',')[0]);$('#date_to').val(set_date.split(',')[1]);selectedFromDate=set_date.split(',')[0];selectedToDate=set_date.split(',')[1];if(isManual){setStaffReportParams();}}
function runStaffSearch(){if(!$('#refine_button').is('.selected')){$("#report_staff_results").html("Loading...");$('#refine_button').addClass("selected");$.ajax({type:'GET',url:'/reports/staff/set_params',data:{"search[search_type]":search_type,"search[from_date]":selectedFromDate,"search[to_date]":selectedToDate,"search[terminal]":terminalId,"search[select_type]":select_type,"search[discounts_only]":discounts_only,"search[training_mode]":inTrainingMode}}).done(function(){$.ajax({type:'GET',url:'/reports/staff/staff_search',data:{"search[created_at_gt]":selectedFromDate,"search[created_at_lt]":selectedToDate,"search[terminal_id_equals]":terminalId,"search2[hour_from]":hour_from,"search2[hour_to]":hour_to}});});}}
function setStaffReportParams(){select_type=''
$.ajax({type:'GET',url:'/reports/staff/set_params',data:{"search[search_type]":search_type,"search[from_date]":selectedFromDate,"search[to_date]":selectedToDate,"search[terminal]":terminalId,"search[training_mode]":inTrainingMode}});}
function loadStaffDropDown(drop_type){drop_val="";drop_set_type=drop_type;if(drop_type=='payment_type'){drop_val=$('#payment_method_id_equals').val()}
if(drop_type=='employee'){drop_val=$('#employee_id_equals').val()}
if(drop_type=='discounts_only'){drop_val=$('#discounts_checked').is(":checked")
discounts_only=drop_val}
$.ajax({type:'GET',url:'/reports/staff/load_dropdown',data:{"search[dropdown_type]":drop_set_type,"search[dropdown_id]":drop_val}});}
function switchStaffView(view_type){if(view_type=="table"){$("#graph_view").removeClass("selected");$("#table_view").addClass("selected");$('#staff_items_graph').hide();$('#staff_items').show();}
if(view_type=="graph"){$("#graph_view").addClass("selected");$("#table_view").removeClass("selected");$('#staff_items_graph').show();$('#staff_items').hide();}}
function setStaffSearchType(interval_selected){switch(interval_selected){case'0':search_type='employee';break;case'1':search_type='day';break;case'2':search_type='week';break;case'3':search_type='month';break;case'4':search_type='year';break;}
setStaffReportParams();}
function setStaffSelect(set_type){if(set_type==-1){$('#date_preselect').attr('selectedIndex',10);search_type='employee';setDateParams($('#date_preselect').val(),false);select_type=set_type}
if(set_type==0){$('#staff_items_graph').hide();$('#search_type_select').attr('selectedIndex',0);$('#date_preselect').attr('selectedIndex',2);search_type='employee';setDateParams($('#date_preselect').val(),false);select_type=set_type}
if(set_type==1){$('#search_type_select').attr('selectedIndex',0);$('#date_preselect').attr('selectedIndex',5);search_type='employee';setDateParams($('#date_preselect').val(),false);select_type=set_type}
if(set_type==2){$('#staff_items_graph').hide();$('#search_type_select').attr('selectedIndex',0);$('#date_preselect').attr('selectedIndex',4);search_type='employee';setDateParams($('#date_preselect').val(),false);select_type=set_type}
$.ajax({type:'GET',url:'/reports/staff/load_dropdown',data:{"search[dropdown_type]":drop_set_type,"search[dropdown_id]":discounts_only}}).done(function(){$.ajax({type:'GET',url:'/reports/staff/set_params',data:{"search[search_type]":search_type,"search[from_date]":selectedFromDate,"search[to_date]":selectedToDate,"search[terminal]":terminalId,"search[select_type]":select_type,"search[training_mode]":inTrainingMode}})}).done(function(){runStaffSearch();discounts_only='';});}
function updateStaffDateParams(set_date,date_type){var olddate=new Date(set_date);var subbed=new Date(olddate-1*60*60*1000);var newtime=subbed.getFullYear()+"-"+(parseInt(subbed.getMonth())+1)+"-"+subbed.getDate()+" "+subbed.getHours()+":"+subbed.getMinutes()
if(date_type=='from'){selectedFromDate=newtime;}else{selectedToDate=newtime;}}
$(function(){setReportsDatePickers();});var selectedFromDate;var selectedToDate;var search_type;var terminalId;var hour_from;var hour_to;var drop_val;var discounts_only=false;var drop_set_type;var select_type='';function setDeliveryReportsDatePickers(){$('#date_select_container').find('#date_from').datetimepicker({dateFormat:'yy-mm-dd',defaultDate:'01/01/01',timeFormat:'h:m',addSliderAccess:true,sliderAccessArgs:{touchonly:false}});$('#date_select_container').find('#date_to').datetimepicker({dateFormat:'yy-mm-dd',defaultDate:'01/01/01',timeFormat:'h:m',addSliderAccess:true,sliderAccessArgs:{touchonly:false}});}
var TODAY="1"
var YESTERDAY="2"
var LAST_WEEK="3"
var LAST_MONTH="4"
var ALL_TIME="5"
function addDeliveryTerminalFilter(terminal_id){terminalId=terminal_id;setDeliveryReportParams();}
function setDeliveryDateParams(set_date,isManual){$('#date_from').val(set_date.split(',')[0]);$('#date_to').val(set_date.split(',')[1]);selectedFromDate=set_date.split(',')[0];selectedToDate=set_date.split(',')[1];if(isManual){setDeliveryReportParams();}}
function runDeliverysSearch(){if(!$('#refine_button').is('.selected')){$("#report_deliveries_results").html("Loading...");$('#refine_button').addClass("selected");$.ajax({type:'GET',url:'/reports/deliveries/set_params',data:{"search[search_type]":search_type,"search[from_date]":selectedFromDate,"search[to_date]":selectedToDate,"search[terminal]":terminalId,"search[select_type]":select_type,"search[discounts_only]":discounts_only,"search[training_mode]":inTrainingMode}}).done(function(){$.ajax({type:'GET',url:'/reports/deliveries/deliveries_search',data:{"search[created_at_gt]":selectedFromDate,"search[created_at_lt]":selectedToDate,"search[terminal_id_equals]":terminalId,"search2[hour_from]":hour_from,"search2[hour_to]":hour_to}});});}}
function setDeliveryReportParams(){select_type=''
$.ajax({type:'GET',url:'/reports/deliveries/set_params',data:{"search[search_type]":search_type,"search[from_date]":selectedFromDate,"search[to_date]":selectedToDate,"search[terminal]":terminalId,"search[training_mode]":inTrainingMode}});}
function loadDeliveryDropDown(drop_type){drop_val="";drop_set_type=drop_type;if(drop_type=='delivery_type'){drop_val=$('#delivery_method_id_equals').val()}
if(drop_type=='employee'){drop_val=$('#employee_id_equals').val()}
if(drop_type=='discounts_only'){drop_val=$('#discounts_checked').is(":checked")
discounts_only=drop_val}
$.ajax({type:'GET',url:'/reports/deliveries/load_dropdown',data:{"search[dropdown_type]":drop_set_type,"search[dropdown_id]":drop_val}});}
function switchDeliveryView(view_type){if(view_type=="table"){$("#graph_view").removeClass("selected");$("#table_view").addClass("selected");$('#deliveries_items_graph').hide();$('#deliveries_items').show();}
if(view_type=="graph"){$("#graph_view").addClass("selected");$("#table_view").removeClass("selected");$('#deliveries_items_graph').show();$('#deliveries_items').hide();}}
function setDeliverySearchType(interval_selected){switch(interval_selected){case'0':search_type='by_delivery';break;case'1':search_type='day';break;case'2':search_type='week';break;case'3':search_type='month';break;case'4':search_type='year';break;}
setDeliveryReportParams();}
function setDeliverySelect(set_type){if(set_type==-1){$('#deliveries_items_graph').hide();$('#search_type_select').attr('selectedIndex',0);$('#date_preselect').attr('selectedIndex',10);$('#category_id_equals').attr('selectedIndex',0);$('#category_id_equals').attr('selectedIndex',0);$('#product_id_equals').attr('selectedIndex',0);search_type='transaction_list';$('#discounts_checked').removeAttr('checked')
setDateParams($('#date_preselect').val(),false);select_type=set_type}
if(set_type==0){$('#search_type_select').attr('selectedIndex',0);$('#date_preselect').attr('selectedIndex',2);search_type='transaction_list';$('#discounts_checked').removeAttr('checked')
setDateParams($('#date_preselect').val(),false);select_type=set_type}
if(set_type==1){$('#search_type_select').attr('selectedIndex',0);$('#date_preselect').attr('selectedIndex',5);$('#discounts_checked').attr('checked','checked')
search_type='transaction_list';discounts_only=true
drop_set_type="discounts_only"
setDateParams($('#date_preselect').val(),false);select_type=set_type}
if(set_type==2){$('#search_type_select').attr('selectedIndex',3);$('#date_preselect').attr('selectedIndex',4);search_type='month';$('#discounts_checked').removeAttr('checked')
setDateParams($('#date_preselect').val(),false);select_type=set_type}
if(set_type==3){$('#search_type_select').attr('selectedIndex',1);$('#date_preselect').attr('selectedIndex',4);search_type='day';$('#discounts_checked').removeAttr('checked')
setDateParams($('#date_preselect').val(),false);select_type=set_type}
$.ajax({type:'GET',url:'/reports/deliveries/load_dropdown',data:{"search[dropdown_type]":drop_set_type,"search[dropdown_id]":discounts_only}}).done(function(){$.ajax({type:'GET',url:'/reports/deliveries/set_params',data:{"search[search_type]":search_type,"search[from_date]":selectedFromDate,"search[to_date]":selectedToDate,"search[terminal]":terminalId,"search[select_type]":select_type,"search[training_mode]":inTrainingMode}})}).done(function(){runDeliverysSearch();discounts_only='';});}
function updateDeliveryDateParams(set_date,date_type){var olddate=new Date(set_date);var subbed=new Date(olddate-1*60*60*1000);var newtime=subbed.getFullYear()+"-"+(parseInt(subbed.getMonth())+1)+"-"+subbed.getDate()+" "+subbed.getHours()+":"+subbed.getMinutes()
if(date_type=='from'){selectedFromDate=newtime;}else{selectedToDate=newtime;}}
$(function(){setReportsDatePickers();});var selectedFromDate;var selectedToDate;var search_type;var terminalId;var hour_from;var hour_to;var drop_val;var discounts_only=false;var drop_set_type;var select_type='';function setPaymentReportsDatePickers(){$('#date_select_container').find('#date_from').datetimepicker({dateFormat:'yy-mm-dd',defaultDate:'01/01/01',timeFormat:'h:m',addSliderAccess:true,sliderAccessArgs:{touchonly:false}});$('#date_select_container').find('#date_to').datetimepicker({dateFormat:'yy-mm-dd',defaultDate:'01/01/01',timeFormat:'h:m',addSliderAccess:true,sliderAccessArgs:{touchonly:false}});}
var TODAY="1"
var YESTERDAY="2"
var LAST_WEEK="3"
var LAST_MONTH="4"
var ALL_TIME="5"
function addPaymentTerminalFilter(terminal_id){terminalId=terminal_id;setPaymentReportParams();}
function setPaymentDateParams(set_date,isManual){$('#date_from').val(set_date.split(',')[0]);$('#date_to').val(set_date.split(',')[1]);selectedFromDate=set_date.split(',')[0];selectedToDate=set_date.split(',')[1];if(isManual){setPaymentReportParams();}}
function setCustomerDateParams(set_date,isManual){$('#date_from').val(set_date.split(',')[0]);$('#date_to').val(set_date.split(',')[1]);selectedFromDate=set_date.split(',')[0];selectedToDate=set_date.split(',')[1];if(isManual){setCustomerReportParams();}}
function runCustomerSearch(){if(!$('#refine_button').is('.selected')){$("#report_customer_results").html("Loading...");$('#refine_button').addClass("selected");$.ajax({type:'GET',url:'/reports/customers/set_params',data:{"search[search_type]":search_type,"search[from_date]":selectedFromDate,"search[to_date]":selectedToDate,"search[terminal]":terminalId,"search[select_type]":select_type,"search[discounts_only]":discounts_only,"search[training_mode]":inTrainingMode}}).done(function(){$.ajax({type:'GET',url:'/reports/customers/customer_search',data:{"search[created_at_gt]":selectedFromDate,"search[created_at_lt]":selectedToDate,"search[terminal_id_equals]":terminalId,"search2[hour_from]":hour_from,"search2[hour_to]":hour_to}});});}}
function setCustomerReportParams(){select_type=''
$.ajax({type:'GET',url:'/reports/customers/set_params',data:{"search[search_type]":search_type,"search[from_date]":selectedFromDate,"search[to_date]":selectedToDate,"search[terminal]":terminalId,"search[training_mode]":inTrainingMode}});}
function loadCustomerDropDown(drop_val){if(drop_val==''){drop_val='all'}
$.ajax({type:'GET',url:'/reports/customers/load_dropdown',data:{"search[dropdown_id]":drop_val}});}
function switchCustomerView(view_type){if(view_type=="table"){$("#graph_view").removeClass("selected");$("#table_view").addClass("selected");$('#customer_items_graph').hide();$('#customer_items').show();}
if(view_type=="graph"){$("#graph_view").addClass("selected");$("#table_view").removeClass("selected");$('#customer_items_graph').show();$('#customer_items').hide();}}
function setCustomerSearchType(interval_selected){switch(interval_selected){case'0':search_type='employee';break;case'1':search_type='day';break;case'2':search_type='week';break;case'3':search_type='month';break;case'4':search_type='year';break;}
setCustomerReportParams();}
function setCustomerSelect(set_type){if(set_type==-1){$('#date_preselect').attr('selectedIndex',10);setDateParams($('#date_preselect').val(),false);select_type=set_type}
if(set_type==0){$('#customer_items_graph').hide();$('#search_type_select').attr('selectedIndex',0);$('#date_preselect').attr('selectedIndex',2);setDateParams($('#date_preselect').val(),false);select_type=set_type}
if(set_type==1){$('#search_type_select').attr('selectedIndex',0);$('#date_preselect').attr('selectedIndex',5);setDateParams($('#date_preselect').val(),false);select_type=set_type}
if(set_type==2){$('#customer_items_graph').hide();$('#search_type_select').attr('selectedIndex',0);$('#date_preselect').attr('selectedIndex',4);setDateParams($('#date_preselect').val(),false);select_type=set_type}
$.ajax({type:'GET',url:'/reports/customers/set_params',data:{"search[search_type]":search_type,"search[from_date]":selectedFromDate,"search[to_date]":selectedToDate,"search[terminal]":terminalId,"search[select_type]":select_type,"search[training_mode]":inTrainingMode}}).done(function(){runCustomerSearch();discounts_only='';});}
function updateCustomerDateParams(set_date,date_type){var olddate=new Date(set_date);var subbed=new Date(olddate);var newtime=subbed.getFullYear()+"-"+(parseInt(subbed.getMonth())+1)+"-"+subbed.getDate()+" "+subbed.getHours()+":"+subbed.getMinutes()
if(date_type=='from'){selectedFromDate=newtime;}else{selectedToDate=newtime;}}