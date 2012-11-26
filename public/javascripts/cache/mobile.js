
(function($){$.jQTouch=function(options){var $body,$head=$('head'),initialPageId='',hist=[],newPageCount=0,jQTSettings={},currentPage='',orientation='portrait',tapReady=true,lastTime=0,lastAnimationTime=0,touchSelectors=[],publicObj={},tapBuffer=351,extensions=$.jQTouch.prototype.extensions,animations=[],hairExtensions='',defaults={addGlossToIcon:true,backSelector:'.back, .cancel, .goback',cacheGetRequests:true,debug:false,fallback2dAnimation:'fade',fixedViewport:true,formSelector:'form',fullScreen:true,fullScreenClass:'fullscreen',hoverDelay:50,icon:null,icon4:null,moveThreshold:10,preloadImages:false,pressDelay:1000,startupScreen:null,statusBar:'default',submitSelector:'.submit',touchSelector:'a, .touch',useAnimations:true,useFastTouch:true,animations:[{selector:'.cube',name:'cubeleft',is3d:true},{selector:'.cubeleft',name:'cubeleft',is3d:true},{selector:'.cuberight',name:'cuberight',is3d:true},{selector:'.dissolve',name:'dissolve',is3d:false},{selector:'.fade',name:'fade',is3d:false},{selector:'.flip',name:'flipleft',is3d:true},{selector:'.flipleft',name:'flipleft',is3d:true},{selector:'.flipright',name:'flipright',is3d:true},{selector:'.pop',name:'pop',is3d:true},{selector:'.slide',name:'slideleft',is3d:false},{selector:'.slidedown',name:'slidedown',is3d:false},{selector:'.slideleft',name:'slideleft',is3d:false},{selector:'.slideright',name:'slideright',is3d:false},{selector:'.slideup',name:'slideup',is3d:false},{selector:'.swap',name:'swapleft',is3d:true},{selector:'#jqt > * > ul li a',name:'slideleft',is3d:false}]};function _debug(message){now=(new Date).getTime();delta=now-lastTime;lastTime=now;if(jQTSettings.debug){if(message){_log(delta+': '+message);}else{_log(delta+': '+'Called '+arguments.callee.caller.name);}}}
function _log(message){if(window.console!==undefined){console.log(message);}}
function addAnimation(animation){if(typeof(animation.selector)==='string'&&typeof(animation.name)==='string'){animations.push(animation);}}
function addPageToHistory(page,animation){_debug();hist.unshift({page:page,animation:animation,hash:'#'+page.attr('id'),id:page.attr('id')});}
function clickHandler(e){_debug();if(!tapReady){_debug('ClickHandler handler aborted because tap is not ready');e.preventDefault();return false;}
var $el=$(e.target);if(!$el.is(touchSelectors.join(', '))){var $el=$(e.target).closest(touchSelectors.join(', '));}
if($el&&$el.attr('href')&&!$el.isExternalLink()){_debug('Need to prevent default click behavior');e.preventDefault();}else{_debug('No need to prevent default click behavior');}
if($.support.touch){_debug('Not converting click to a tap event because touch handler is on the job');}else{_debug('Converting click event to a tap event because touch handlers are not present or off');$(e.target).trigger('tap',e);}}
function doNavigation(fromPage,toPage,animation,goingBack){_debug();if(toPage.length===0){$.fn.unselect();_debug('Target element is missing.');return false;}
if(toPage.hasClass('current')){$.fn.unselect();_debug('You are already on the page you are trying to navigate to.');return false;}
$(':focus').blur();fromPage.trigger('pageAnimationStart',{direction:'out'});toPage.trigger('pageAnimationStart',{direction:'in'});if($.support.animationEvents&&animation&&jQTSettings.useAnimations){tapReady=false;if(!$.support.transform3d&&animation.is3d){animation.name=jQTSettings.fallback2dAnimation;}
var finalAnimationName;if(goingBack){if(animation.name.indexOf('left')>0){finalAnimationName=animation.name.replace(/left/,'right');}else if(animation.name.indexOf('right')>0){finalAnimationName=animation.name.replace(/right/,'left');}else if(animation.name.indexOf('up')>0){finalAnimationName=animation.name.replace(/up/,'down');}else if(animation.name.indexOf('down')>0){finalAnimationName=animation.name.replace(/down/,'up');}else{finalAnimationName=animation.name;}}else{finalAnimationName=animation.name;}
fromPage.bind('webkitAnimationEnd',navigationEndHandler);fromPage.bind('webkitTransitionEnd',navigationEndHandler);scrollTo(0,0);toPage.addClass(finalAnimationName+' in current');fromPage.addClass(finalAnimationName+' out');}else{toPage.addClass('current');navigationEndHandler();}
function navigationEndHandler(event){_debug();if($.support.animationEvents&&animation&&jQTSettings.useAnimations){fromPage.unbind('webkitAnimationEnd',navigationEndHandler);fromPage.unbind('webkitTransitionEnd',navigationEndHandler);fromPage.removeClass(finalAnimationName+' out current');toPage.removeClass(finalAnimationName+' in');}else{fromPage.removeClass(finalAnimationName+' out current');}
currentPage=toPage;if(goingBack){hist.shift();}else{addPageToHistory(currentPage,animation);}
fromPage.unselect();lastAnimationTime=(new Date()).getTime();setHash(currentPage.attr('id'));tapReady=true;toPage.trigger('pageAnimationEnd',{direction:'in',animation:animation});fromPage.trigger('pageAnimationEnd',{direction:'out',animation:animation});}
return true;}
function getOrientation(){_debug();return orientation;}
function goBack(){_debug();if(hist.length<1){_debug('History is empty.');}
if(hist.length===1){_debug('You are on the first panel.');}
var from=hist[0],to=hist[1];if(doNavigation(from.page,to.page,from.animation,true)){return publicObj;}else{_debug('Could not go back.');return false;}}
function goTo(toPage,animation,reverse){_debug();if(reverse){_log('The reverse parameter of the goTo() function has been deprecated.');}
var fromPage=hist[0].page;if(typeof animation==='string'){for(var i=0,max=animations.length;i<max;i++){if(animations[i].name===animation){animation=animations[i];break;}}}
if(typeof(toPage)==='string'){var nextPage=$(toPage);if(nextPage.length<1){showPageByHref(toPage,{'animation':animation});return;}else{toPage=nextPage;}}
if(doNavigation(fromPage,toPage,animation)){return publicObj;}else{_debug('Could not animate pages.');return false;}}
function hashChangeHandler(e){_debug();if(location.hash===hist[0].hash){_debug('We are on the right panel');}else{_debug('We are not on the right panel');if(location.hash===hist[1].hash){goBack();}else{_debug(location.hash+' !== '+hist[1].hash);}}}
function init(options){_debug();jQTSettings=$.extend({},defaults,options);if(jQTSettings.preloadImages){for(var i=jQTSettings.preloadImages.length-1;i>=0;i--){(new Image()).src=jQTSettings.preloadImages[i];};}
if(jQTSettings.icon||jQTSettings.icon4){var precomposed,appropriateIcon;if(jQTSettings.icon4&&window.devicePixelRatio&&window.devicePixelRatio===2){appropriateIcon=jQTSettings.icon4;}else if(jQTSettings.icon){appropriateIcon=jQTSettings.icon;}else{appropriateIcon=false;}
if(appropriateIcon){precomposed=(jQTSettings.addGlossToIcon)?'':'-precomposed';hairExtensions+='<link rel="apple-touch-icon'+precomposed+'" href="'+appropriateIcon+'" />';}}
if(jQTSettings.startupScreen){hairExtensions+='<link rel="apple-touch-startup-image" href="'+jQTSettings.startupScreen+'" />';}
if(jQTSettings.fixedViewport){hairExtensions+='<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0;"/>';}
if(jQTSettings.fullScreen){hairExtensions+='<meta name="apple-mobile-web-app-capable" content="yes" />';if(jQTSettings.statusBar){hairExtensions+='<meta name="apple-mobile-web-app-status-bar-style" content="'+jQTSettings.statusBar+'" />';}}
if(hairExtensions){$head.prepend(hairExtensions);}}
function insertPages(nodes,animation){_debug();var targetPage=null;$(nodes).each(function(index,node){var $node=$(this);if(!$node.attr('id')){$node.attr('id','page-'+(++newPageCount));}
$('#'+$node.attr('id')).remove();$body.trigger('pageInserted',{page:$node.appendTo($body)});if($node.hasClass('current')||!targetPage){targetPage=$node;}});if(targetPage!==null){goTo(targetPage,animation);return targetPage;}else{return false;}}
function mousedownHandler(e){var timeDiff=(new Date()).getTime()-lastAnimationTime;if(timeDiff<tapBuffer){return false;}}
function orientationChangeHandler(){_debug();orientation=Math.abs(window.orientation)==90?'landscape':'portrait';$body.removeClass('portrait landscape').addClass(orientation).trigger('turn',{orientation:orientation});}
function setHash(hash){_debug();hash=hash.replace(/^#/,''),location.hash='#'+hash;}
function showPageByHref(href,options){_debug();var defaults={data:null,method:'GET',animation:null,callback:null,$referrer:null};var settings=$.extend({},defaults,options);if(href!='#'){$.ajax({url:href,data:settings.data,type:settings.method,success:function(data,textStatus){var firstPage=insertPages(data,settings.animation);if(firstPage){if(settings.method=='GET'&&jQTSettings.cacheGetRequests===true&&settings.$referrer){settings.$referrer.attr('href','#'+firstPage.attr('id'));}
if(settings.callback){settings.callback(true);}}},error:function(data){if(settings.$referrer){settings.$referrer.unselect();}
if(settings.callback){settings.callback(false);}}});}else if(settings.$referrer){settings.$referrer.unselect();}}
function submitHandler(e,callback){_debug();$(':focus').blur();e.preventDefault();var $form=(typeof(e)==='string')?$(e).eq(0):(e.target?$(e.target):$(e));_debug($form.attr('action'));if($form.length&&$form.is(jQTSettings.formSelector)&&$form.attr('action')){showPageByHref($form.attr('action'),{data:$form.serialize(),method:$form.attr('method')||"POST",animation:animations[0]||null,callback:callback});return false;}
return false;}
function submitParentForm($el){_debug();var $form=$el.closest('form');if($form.length===0){_debug('No parent form found');}else{_debug('About to submit parent form');var evt=$.Event('submit');evt.preventDefault();$form.trigger(evt);return false;}
return true;}
function supportForAnimationEvents(){_debug();return(typeof WebKitAnimationEvent!='undefined');}
function supportForCssMatrix(){_debug();return(typeof WebKitCSSMatrix!='undefined');}
function supportForTouchEvents(){_debug();if(typeof TouchEvent!='undefined'){if(window.navigator.userAgent.indexOf('Mobile')>-1){return true;}else{return false;}}else{return false;}};function supportForTransform3d(){_debug();var head,body,style,div,result;head=document.getElementsByTagName('head')[0];body=document.body;style=document.createElement('style');style.textContent='@media (transform-3d),(-o-transform-3d),(-moz-transform-3d),(-ms-transform-3d),(-webkit-transform-3d),(modernizr){#jqtTestFor3dSupport{height:3px}}';div=document.createElement('div');div.id='jqtTestFor3dSupport';head.appendChild(style);body.appendChild(div);result=div.offsetHeight===3;style.parentNode.removeChild(style);div.parentNode.removeChild(div);return result;};function tapHandler(e){_debug();if(!tapReady){_debug('Tap is not ready');return false;}
var $el=$(e.target);if(!$el.is(touchSelectors.join(', '))){var $el=$(e.target).closest(touchSelectors.join(', '));}
if(!$el.length||!$el.attr('href')){_debug('Could not find a link related to tapped element');return false;}
var target=$el.attr('target'),hash=$el.attr('hash'),animation=null;if($el.isExternalLink()){$el.unselect();return true;}else if($el.is(jQTSettings.backSelector)){goBack(hash);}else if($el.is(jQTSettings.submitSelector)){submitParentForm($el);}else if(target==='_webapp'){window.location=$el.attr('href');return false;}else if($el.attr('href')==='#'){$el.unselect();return true;}else{for(var i=0,max=animations.length;i<max;i++){if($el.is(animations[i].selector)){animation=animations[i];break;}};if(!animation){_log('Animation could not be found. Using slideleft.');animation='slideleft';}
if(hash&&hash!=='#'){$el.addClass('active');goTo($(hash).data('referrer',$el),animation,$el.hasClass('reverse'));return false;}else{$el.addClass('loading active');showPageByHref($el.attr('href'),{animation:animation,callback:function(){$el.removeClass('loading');setTimeout($.fn.unselect,250,$el);},$referrer:$el});return false;}}}
function touchStartHandler(e){_debug();if(!tapReady){_debug('TouchStart handler aborted because tap is not ready');e.preventDefault();return false;}
var $el=$(e.target);if(!$el.length){_debug('Could not find target of touchstart event.');return;}
var startTime=(new Date).getTime(),hoverTimeout=null,pressTimeout=null,touch,startX,startY,deltaX=0,deltaY=0,deltaT=0;if(event.changedTouches&&event.changedTouches.length){touch=event.changedTouches[0];startX=touch.pageX;startY=touch.pageY;}
$el.bind('touchmove',touchMoveHandler).bind('touchend',touchEndHandler).bind('touchcancel',touchCancelHandler);hoverTimeout=setTimeout(function(){$el.makeActive();},jQTSettings.hoverDelay);pressTimeout=setTimeout(function(){$el.unbind('touchmove',touchMoveHandler).unbind('touchend',touchEndHandler).unbind('touchcancel',touchCancelHandler);$el.unselect();clearTimeout(hoverTimeout);$el.trigger('press');},jQTSettings.pressDelay);function touchCancelHandler(e){_debug();clearTimeout(hoverTimeout);$el.unselect();$el.unbind('touchmove',touchMoveHandler).unbind('touchend',touchEndHandler).unbind('touchcancel',touchCancelHandler);}
function touchEndHandler(e){_debug();$el.unbind('touchend',touchEndHandler).unbind('touchcancel',touchCancelHandler);clearTimeout(hoverTimeout);clearTimeout(pressTimeout);if(Math.abs(deltaX)<jQTSettings.moveThreshold&&Math.abs(deltaY)<jQTSettings.moveThreshold&&deltaT<jQTSettings.pressDelay){$el.trigger('tap',e);}else{$el.unselect();}}
function touchMoveHandler(e){updateChanges();var absX=Math.abs(deltaX);var absY=Math.abs(deltaY);var direction;if(absX>absY&&(absX>35)&&deltaT<1000){if(deltaX<0){direction='left';}else{direction='right';}
$el.unbind('touchmove',touchMoveHandler).unbind('touchend',touchEndHandler).unbind('touchcancel',touchCancelHandler);$el.trigger('swipe',{direction:direction,deltaX:deltaX,deltaY:deltaY});}
$el.unselect();clearTimeout(hoverTimeout);if(absX>jQTSettings.moveThreshold||absY>jQTSettings.moveThreshold){clearTimeout(pressTimeout);}}
function updateChanges(){var firstFinger=event.changedTouches[0]||null;deltaX=firstFinger.pageX-startX;deltaY=firstFinger.pageY-startY;deltaT=(new Date).getTime()-startTime;}}
function useFastTouch(setting){_debug();if(setting!==undefined){if(setting===true){if(supportForTouchEvents()){$.support.touch=true;}else{_log('This device does not support touch events');};}else{$.support.touch=false;}}
return $.support.touch;}
init(options);$(document).ready(function(){$.support.animationEvents=supportForAnimationEvents();$.support.cssMatrix=supportForCssMatrix();$.support.touch=supportForTouchEvents()&&jQTSettings.useFastTouch;$.support.transform3d=supportForTransform3d();if(!$.support.touch){_log('This device does not support touch interaction, or it has been deactivated by the developer. Some features might be unavailable.');}
if(!$.support.transform3d){_log('This device does not support 3d animation. 2d animations will be used instead.');}
$.fn.isExternalLink=function(){var $el=$(this);return($el.attr('target')=='_blank'||$el.attr('rel')=='external'||$el.is('a[href^="http://maps.google.com"], a[href^="mailto:"], a[href^="tel:"], a[href^="javascript:"], a[href*="youtube.com/v"], a[href*="youtube.com/watch"]'));}
$.fn.makeActive=function(){return $(this).addClass('active');}
$.fn.press=function(fn){if($.isFunction(fn)){return $(this).live('press',fn);}else{return $(this).trigger('press');}}
$.fn.swipe=function(fn){if($.isFunction(fn)){return $(this).live('swipe',fn);}else{return $(this).trigger('swipe');}}
$.fn.tap=function(fn){if($.isFunction(fn)){return $(this).live('tap',fn);}else{return $(this).trigger('tap');}}
$.fn.unselect=function(obj){if(obj){obj.removeClass('active');}else{$('.active').removeClass('active');}}
for(var i=0,max=extensions.length;i<max;i++){var fn=extensions[i];if($.isFunction(fn)){$.extend(publicObj,fn(publicObj));}}
if(jQTSettings['cubeSelector']){_log('NOTE: cubeSelector has been deprecated. Please use cubeleftSelector instead.');jQTSettings['cubeleftSelector']=jQTSettings['cubeSelector'];}
if(jQTSettings['flipSelector']){_log('NOTE: flipSelector has been deprecated. Please use flipleftSelector instead.');jQTSettings['flipleftSelector']=jQTSettings['flipSelector'];}
if(jQTSettings['slideSelector']){_log('NOTE: slideSelector has been deprecated. Please use slideleftSelector instead.');jQTSettings['slideleftSelector']=jQTSettings['slideSelector'];}
for(var i=0,max=defaults.animations.length;i<max;i++){var animation=defaults.animations[i];if(jQTSettings[animation.name+'Selector']!==undefined){animation.selector=jQTSettings[animation.name+'Selector'];}
addAnimation(animation);}
touchSelectors.push('input');touchSelectors.push(jQTSettings.touchSelector);touchSelectors.push(jQTSettings.backSelector);touchSelectors.push(jQTSettings.submitSelector);$(touchSelectors.join(', ')).css('-webkit-touch-callout','none');$body=$('#jqt');if($body.length===0){_log('Could not find an element with the id "jqt", so the body id has been set to "jqt". If you are having any problems, wrapping your panels in a div with the id "jqt" might help.');$body=$('body').attr('id','jqt');}
if($.support.transform3d){$body.addClass('supports3d');}
if(jQTSettings.fullScreenClass&&window.navigator.standalone==true){$body.addClass(jQTSettings.fullScreenClass+' '+jQTSettings.statusBar);}
if(window.navigator.userAgent.match(/Android/ig)){$body.addClass('android');}
$(window).bind('hashchange',hashChangeHandler);$body.bind('touchstart',touchStartHandler).bind('click',clickHandler).bind('mousedown',mousedownHandler).bind('orientationchange',orientationChangeHandler).bind('submit',submitHandler).bind('tap',tapHandler).trigger('orientationchange');if($('#jqt > .current').length==0){currentPage=$('#jqt > *:first');}else{currentPage=$('#jqt > .current:first');$('#jqt > .current').removeClass('current');}
$(currentPage).addClass('current');initialPageId=$(currentPage).attr('id');setHash(initialPageId);addPageToHistory(currentPage);scrollTo(0,0);$('#jqt > *').css('minHeight',window.innerHeight);});publicObj={addAnimation:addAnimation,animations:animations,getOrientation:getOrientation,goBack:goBack,goTo:goTo,hist:hist,settings:jQTSettings,submitForm:submitHandler,support:$.support,useFastTouch:useFastTouch}
return publicObj;}
$.jQTouch.prototype.extensions=[];$.jQTouch.addExtension=function(extension){$.jQTouch.prototype.extensions.push(extension);}})(jQuery);var jQT=$.jQTouch({icon:"/images/cluey_icon.png",useAnimations:false});var terminalRecptInfoPage="terminal_recpt_info";$(function(){initMobile();});function initMobile(){if(current_user_id==null){clearMobileLoginCode();showMobileLoginScreen();}else{$('#e_name').html(current_user_nickname);$('#e_name').show();showMobileMenuScreen();}
$('#terminal_list').bind('pageAnimationEnd',function(event,info){if(info.direction=='in'){stopTerminalRecptPoll=true;}});$('#server_list').bind('pageAnimationEnd',function(event,info){if(info.direction=='in'){stopServerRecptPoll=true;}});$('#table_list').bind('pageAnimationEnd',function(event,info){if(info.direction=='in'){stopTableRecptPoll=true;}
renderMobileActiveTableList();});$('#terminal_info_screen').bind('pageAnimationEnd',function(event,info){if(info.direction=='in'){data=$(this).data('referrer').data("params");data=$.parseQuery(data);var terminal_id=data.terminal_id;initTerminalRecptInfoPage(terminal_id);}});$('#server_info_screen').bind('pageAnimationEnd',function(event,info){if(info.direction=='in'){data=$(this).data('referrer').data("params");data=$.parseQuery(data);var server_id=data.server_id;initServerRecptInfoPage(server_id);}});$('#table_info_screen').bind('pageAnimationEnd',function(event,info){if(info.direction=='in'){data=$(this).data('referrer').data("params");data=$.parseQuery(data);var table_label=data.table_label;initTableRecptInfoPage(table_label);}});initPressedCSS();renderMobileActiveTableList();}
function initTerminalRecptInfoPage(terminal_id){$('#terminal_info_screen .terminal_id').html(terminal_id);mobileTerminalRecptScroll();currentTerminalId=terminal_id;stopTerminalRecptPoll=false;clearTerminalRecpt();terminalRecptPoll();}
var stopTerminalRecptPoll=false;var terminalRecptPollingAmount=1000;var currentTerminalId=null;function terminalRecptPoll(){$.ajax({type:'GET',url:'/last_receipt_for_terminal.js',dataType:'script',success:terminalRecptPollComplete,error:function(){setTimeout(terminalRecptPoll,5000);},data:{terminal_id:currentTerminalId}});}
function terminalRecptPollComplete(){if(!stopTerminalRecptPoll){setTimeout(terminalRecptPoll,terminalRecptPollingAmount);}}
function initServerRecptInfoPage(server_id){$('#server_info_screen .server_id').html(server_id);mobileServerRecptScroll();currentServerId=server_id;stopServerRecptPoll=false;clearServerRecpt();serverRecptPoll();}
var stopServerRecptPoll=false;var serverRecptPollingAmount=1000;var currentServerId=null;function serverRecptPoll(){$.ajax({type:'GET',url:'/last_receipt_for_server.js',dataType:'script',success:serverRecptPollComplete,error:function(){setTimeout(serverRecptPoll,5000);},data:{server_id:currentServerId}});}
function serverRecptPollComplete(){if(!stopServerRecptPoll){setTimeout(serverRecptPoll,serverRecptPollingAmount);}}
function initTableRecptInfoPage(table_label){$('#table_info_screen .table_label').html(table_label);mobileTableRecptScroll();currentSelectedTableLabel=table_label;stopTableRecptPoll=false;clearTableRecpt();tableRecptPoll();}
var stopTableRecptPoll=false;var tableRecptPollingAmount=1000;var currentSelectedTableLabel=null;function tableRecptPoll(){$.ajax({type:'GET',url:'/last_receipt_for_table.js',dataType:'script',success:tableRecptPollComplete,error:function(){setTimeout(tableRecptPoll,5000);},data:{table_label:currentSelectedTableLabel}});}
function tableRecptPollComplete(){if(!stopTableRecptPoll){setTimeout(tableRecptPoll,tableRecptPollingAmount);}}
function viewByTerminalClicked(){if(checkInitDataDownload()){jQT.goTo('#terminal_list');}}
function viewByTableClicked(){if(checkInitDataDownload()){jQT.goTo('#table_list');}}
function viewByServerClicked(){if(checkInitDataDownload()){jQT.goTo('#server_list')}}
function mobileLoginScreenKeypadClick(val){newVal=$('#num').val().toString()+val;$('#clockincode_show').html($('#clockincode_show').html()+"*");$('#num').val(newVal);}
function doCancelMobileLoginKeypad(){$('#clockincode_show').html("");$('#num').val("");}
function doMobileLogin(){if(typeof(employees)=="undefined"){setMobileStatusMessage("Please wait while employee list loads");return;}
entered_code=$('#num').val();if(current_user_id!=null){displayMobileError("You are already logged in. Please log out");return;}
for(var i=0;i<employees.length;i++){passcode=employees[i].passcode;if(entered_code==passcode){nickname=employees[i].nickname;id=employees[i].id
is_admin=employees[i].is_admin;mobileLoginSuccess(id,nickname,is_admin,passcode);return;}}
mobileLoginFailure();}
function mobileLoginSuccess(id,nickname,is_admin,passcode){current_user_id=id;current_user_nickname=nickname;current_user_is_admin=is_admin;current_user_passcode=passcode;storeActiveUserID(current_user_id);$.ajax({type:'POST',url:'/login',data:{employee_id:id}});$('#e_name').html(nickname);$('#e_name').show();hideMobileStatusMessage();showMobileMenuScreen();clearMobileLoginCode();}
function mobileLoginFailure(){setMobileStatusMessage("Wrong Pin Code");clearMobileLoginCode();}
function clearMobileLoginCode(){$('#num').val("");$('#clockincode_show').html("");}
function doMobileLogout(){if(current_user_id==null){return;}
var id_for_logout=current_user_id;current_user_id=null;storeActiveUserID(null);setMobileStatusMessage("Logged Out");showMobileLoginScreen();clearMobileLoginCode();$.ajax({type:'POST',url:'/logout',data:{employee_id:id_for_logout}});}
function setMobileStatusMessage(message,hide){if(typeof hide=="undefined"){hide=true;}
hide=false;if(currentScreenIsMobileLogin()){statusEl=$('#login_screen_status_message')}else if(currentScreenIsMobileMenu()){statusEl=$('#menu_screen_status_message');}else{statusEl=$('#menu_screen_status_message')}
afterFunction=null;if(hide){afterFunction=function(){setTimeout(function(){statusEl.fadeOut();},5000);};}
statusEl.fadeIn('fast',afterFunction);statusEl.html(message);}
function hideMobileStatusMessage(){if(currentScreenIsMobileLogin()){statusEl=$('#login_screen_status_message')}else if(currentScreenIsMobileMenu()){statusEl=$('#menu_screen_status_message');}else{statusEl=$('#menu_screen_status_message')}
statusEl.fadeOut();}
function displayMobileError(message){setMobileStatusMessage("Error: "+message);}
function displayMobileNotice(message){setMobileStatusMessage("Notice: "+message);}
function showMobileLoginScreen(){jQT.goTo('#login');}
function showMobileMenuScreen(){jQT.goTo('#menu');}
function currentScreenIsMobileMenu(){return $('#menu').is(":visible");}
function currentScreenIsMobileLogin(){return $('#login').is(":visible");}
function clearTerminalRecpt(){$('#mobile_terminal_till_roll').html("");}
function clearServerRecpt(){$('#mobile_server_till_roll').html("");}
function clearTableRecpt(){$('#mobile_table_till_roll').html("");}
function renderMobileActiveTableList(){var tableIDS=getActiveTableIDS();$('ul li.table_list_item').each(function(){$(this).hide();});for(var i=0;i<tableIDS.length;i++){console.log("Open order in table "+tableIDS[i]);$('#table_'+tableIDS[i]+'_list_item').show();}}
function checkInitDataDownload(){if(!callHomePollInitSequenceComplete){niceAlert("Downloading data from server, please wait");return false;}
return true;}