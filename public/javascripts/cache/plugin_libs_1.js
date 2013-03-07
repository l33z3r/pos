;(function($,iphoneStyle){$[iphoneStyle]=function(elem,options){this.$elem=$(elem);var obj=this;$.each(options,function(key,value){obj[key]=value;});this.wrapCheckboxWithDivs();this.attachEvents();this.disableTextSelection();if(this.resizeHandle){this.optionallyResize('handle');}
if(this.resizeContainer){this.optionallyResize('container');}
this.initialPosition();};$.extend($[iphoneStyle].prototype,{wrapCheckboxWithDivs:function(){this.$elem.wrap('<div class="'+this.containerClass+'" />');this.container=this.$elem.parent();this.offLabel=$('<label class="'+this.labelOffClass+'">'+'<span>'+this.uncheckedLabel+'</span>'+'</label>').appendTo(this.container);this.offSpan=this.offLabel.children('span');this.onLabel=$('<label class="'+this.labelOnClass+'">'+'<span>'+this.checkedLabel+'</span>'+'</label>').appendTo(this.container);this.onSpan=this.onLabel.children('span');this.handle=$('<div class="'+this.handleClass+'">'+'<div class="'+this.handleRightClass+'">'+'<div class="'+this.handleCenterClass+'" />'+'</div>'+'</div>').appendTo(this.container);},disableTextSelection:function(){if(!$.browser.msie){return;}
$.each([this.handle,this.offLabel,this.onLabel,this.container],function(){$(this).attr("unselectable","on");});},optionallyResize:function(mode){var onLabelWidth=this.onLabel.width(),offLabelWidth=this.offLabel.width();if(mode=='container'){var newWidth=(onLabelWidth>offLabelWidth)?onLabelWidth:offLabelWidth;newWidth+=this.handle.width()+15;}else{var newWidth=(onLabelWidth<offLabelWidth)?onLabelWidth:offLabelWidth;}
this[mode].css({width:newWidth});},attachEvents:function(){var obj=this;this.container.bind('mousedown touchstart',function(event){event.preventDefault();if(obj.$elem.is(':disabled')){return;}
var x=event.pageX||event.originalEvent.changedTouches[0].pageX;$[iphoneStyle].currentlyClicking=obj.handle;$[iphoneStyle].dragStartPosition=x;$[iphoneStyle].handleLeftOffset=parseInt(obj.handle.css('left'),10)||0;$[iphoneStyle].dragStartedOn=obj.$elem;}).bind('iPhoneDrag',function(event,x){event.preventDefault();if(obj.$elem.is(':disabled')){return;}
if(obj.$elem!=$[iphoneStyle].dragStartedOn){return;}
var p=(x+$[iphoneStyle].handleLeftOffset-$[iphoneStyle].dragStartPosition)/obj.rightSide;if(p<0){p=0;}
if(p>1){p=1;}
obj.handle.css({left:p*obj.rightSide});obj.onLabel.css({width:p*obj.rightSide+4});obj.offSpan.css({marginRight:-p*obj.rightSide});obj.onSpan.css({marginLeft:-(1-p)*obj.rightSide});}).bind('iPhoneDragEnd',function(event,x){if(obj.$elem.is(':disabled')){return;}
var checked;if($[iphoneStyle].dragging){var p=(x-$[iphoneStyle].dragStartPosition)/obj.rightSide;checked=(p<0)?Math.abs(p)<0.5:p>=0.5;}else{checked=!obj.$elem.attr('checked');}
obj.$elem.attr('checked',checked);$[iphoneStyle].currentlyClicking=null;$[iphoneStyle].dragging=null;obj.$elem.change();});this.$elem.change(function(){if(obj.$elem.is(':disabled')){obj.container.addClass(obj.disabledClass);return false;}else{obj.container.removeClass(obj.disabledClass);}
var new_left=obj.$elem.attr('checked')?obj.rightSide:0;obj.handle.animate({left:new_left},obj.duration);obj.onLabel.animate({width:new_left+4},obj.duration);obj.offSpan.animate({marginRight:-new_left},obj.duration);obj.onSpan.animate({marginLeft:new_left-obj.rightSide},obj.duration);});},initialPosition:function(){this.offLabel.css({width:this.container.width()-5});var offset=($.browser.msie&&$.browser.version<7)?3:6;this.rightSide=this.container.width()-this.handle.width()-offset;if(this.$elem.is(':checked')){this.handle.css({left:this.rightSide});this.onLabel.css({width:this.rightSide+4});this.offSpan.css({marginRight:-this.rightSide});}else{this.onLabel.css({width:0});this.onSpan.css({marginLeft:-this.rightSide});}
if(this.$elem.is(':disabled')){this.container.addClass(this.disabledClass);}}});$.fn[iphoneStyle]=function(options){var checkboxes=this.filter(':checkbox');if(!checkboxes.length){return this;}
var opt=$.extend({},$[iphoneStyle].defaults,options);checkboxes.each(function(){$(this).data(iphoneStyle,new $[iphoneStyle](this,opt));});if(!$[iphoneStyle].initComplete){$(document).bind('mousemove touchmove',function(event){if(!$[iphoneStyle].currentlyClicking){return;}
event.preventDefault();var x=event.pageX||event.originalEvent.changedTouches[0].pageX;if(!$[iphoneStyle].dragging&&(Math.abs($[iphoneStyle].dragStartPosition-x)>opt.dragThreshold)){$[iphoneStyle].dragging=true;}
$(event.target).trigger('iPhoneDrag',[x]);}).bind('mouseup touchend',function(event){if(!$[iphoneStyle].currentlyClicking){return;}
event.preventDefault();var x=event.pageX||event.originalEvent.changedTouches[0].pageX;$($[iphoneStyle].currentlyClicking).trigger('iPhoneDragEnd',[x]);});$[iphoneStyle].initComplete=true;}
return this;};$[iphoneStyle].defaults={duration:200,checkedLabel:'ON',uncheckedLabel:'OFF',resizeHandle:true,resizeContainer:true,disabledClass:'iPhoneCheckDisabled',containerClass:'iPhoneCheckContainer',labelOnClass:'iPhoneCheckLabelOn',labelOffClass:'iPhoneCheckLabelOff',handleClass:'iPhoneCheckHandle',handleCenterClass:'iPhoneCheckHandleCenter',handleRightClass:'iPhoneCheckHandleRight',dragThreshold:5};})(jQuery,'iphoneStyle');(function($){var allTabOptions=new Array();$.fn.jVertTabs=function(attr,options){var elmId=$(this).attr('id');var opts;var defaults={selected:0,select:function(index){},spinner:"Retrieving data...",equalHeights:false};var tabColumnHeight=0;if($.isPlainObject(attr)){options=attr;opts=$.extend(defaults,options);allTabOptions[elmId]=opts;}else{if(attr!=null&&options!=null){if(attr=="selected"){var thisTabOpts=allTabOptions[elmId];thisTabOpts.selected=options;var tabRoot=$(this);doSelectTab($(this),options);return;}}else{opts=$.extend(defaults,options);allTabOptions[elmId]=opts;}}
return this.each(function(){var tabRoot=$(this);setStyle(tabRoot);var tabColumn=tabRoot.children("div.vtabs-tab-column");var tabContentColumn=tabRoot.children("div.vtabs-content-column");$(this).find(".vtabs-tab-column > ul > li").each(function(i){if(i<1){$(this).addClass("open");$(this).find("a").addClass("open");}else{$(this).addClass("closed");$(this).find("a").addClass("closed");}
$(this).click(function(){handleTabClick($(this),i,tabRoot,true);return false;});});$(this).children(".vtabs-content-column > div.vtabs-content-panel").each(function(i){if(i>0){$(this).hide();}});var thisTabOpts=allTabOptions[elmId];if(thisTabOpts!=null){var preSelectLi=tabColumn.find("ul > li").eq(thisTabOpts.selected);handleTabClick(preSelectLi,thisTabOpts.selected,tabRoot,false);}
var thisTabOpts=allTabOptions[elmId];if(thisTabOpts!=null&&thisTabOpts.equalHeights){equalizeHeights(tabContentColumn);}
tabColumnHeight=getTotalTabsHeight(tabRoot);setMinHeight(tabContentColumn,tabColumnHeight);adjustMargin(tabRoot);});function doSelectTab(tabRoot,index){var tabColumn=tabRoot.children("div.vtabs-tab-column");var tabContentColumn=tabRoot.children("div.vtabs-content-column");var selectLi=tabColumn.find("ul > li").eq(index);handleTabClick(selectLi,index,tabRoot,true);}
function handleTabClick(li,liIndex,tabRoot,doSelectedCallBack){var elmId=tabRoot.attr('id');var tabCol=tabRoot.children("div.vtabs-tab-column");var tabContentCol=tabRoot.children("div.vtabs-content-column");tabCol.find("ul > li").each(function(i){if($(this).hasClass("open")){$(this).removeClass("open").addClass("closed");$(this).find("a").removeClass("open").addClass("closed");}});li.removeClass("closed").addClass("open");li.find("a").removeClass("closed").addClass("open");var openContentPanel;tabContentCol.children("div.vtabs-content-panel").each(function(i){$(this).hide();if(i==liIndex){openContentPanel=$(this);}});var link=li.find("a");var linkText=link.text();var linkValue=link.attr("href");if(!linkValue.startsWith("#")){if(opts.spinner!=""){link.text(opts.spinner);}
$.ajax({url:linkValue,type:"POST",success:function(data){openContentPanel.html(data);openContentPanel.fadeIn(1000);link.text(linkText);var thisTabOpts=allTabOptions[elmId];if(thisTabOpts!=null&&thisTabOpts.equalHeights){equalizeHeights(tabContentCol);}},error:function(request,status,errorThrown){link.text(linkText);alert("Error requesting "+linkValue+": "+errorThrown);}});}else{openContentPanel.fadeIn(1000);}
var thisTabOpts=allTabOptions[elmId];if(thisTabOpts!=null&&doSelectedCallBack){if(jQuery.isFunction(thisTabOpts.select)){thisTabOpts.select.call(this,liIndex);}}};function getTotalTabsHeight(tabRoot){var height=0;tabRoot.find(".vtabs-tab-column > ul > li").each(function(i){height+=$(this).outerHeight(true);});return height;}
function equalizeHeights(tabContentCol){var tallest=getTallestHeight(tabContentCol);setMinHeight(tabContentCol,tallest);};function getTallestHeight(tabContentCol){var maxHeight=0,currentHeight=0;tabContentCol.children("div.vtabs-content-panel").each(function(i){currentHeight=$(this).height();if(currentHeight>maxHeight){maxHeight=currentHeight;}});return maxHeight;};function setMinHeight(tabContentCol,minHeight){var panelHeight=0;tabContentCol.children("div.vtabs-content-panel").each(function(i){panelHeight=$(this).height();if(panelHeight<minHeight){$(this).css("min-height",minHeight);if($.browser.msie){}}});};function setStyle(tabRoot){tabRoot.addClass("vtabs");tabRoot.children("div").eq(0).addClass("vtabs-tab-column");tabRoot.children("div").eq(1).addClass("vtabs-content-column");tabRoot.children("div").eq(1).children("div").addClass("vtabs-content-panel");};function adjustMargin(tabRoot){var tabColumn=tabRoot.children("div.vtabs-tab-column");var tabColWidth=tabColumn.width();$(tabRoot).children('div.vtabs-content-column').css({"margin-left":tabColWidth-1+"px"});}};})(jQuery);$(function(){var $write=$('#write'),shift=false,capslock=false;$('#util_keyboard li').click(function(){var $this=$(this),character=$this.html();if($this.hasClass('left-shift')||$this.hasClass('right-shift')){$('.letter').toggleClass('uppercase');$('.symbol span').toggle();shift=(shift===true)?false:true;capslock=false;return false;}
if($this.hasClass('capslock')){$('.letter').toggleClass('uppercase');capslock=true;return false;}
if($this.hasClass('delete')){var html=$write.html();doDeleteCharLastActiveInput();return false;}
if($this.hasClass('symbol'))character=$('span:visible',$this).html();if($this.hasClass('space'))character=' ';if($this.hasClass('tab')){doTabLastActiveInput();return false;}
if($this.hasClass('return'))character="\n";if($this.hasClass('uppercase'))character=character.toUpperCase();if(shift===true){$('.symbol span').toggle();if(capslock===false)$('.letter').toggleClass('uppercase');shift=false;}
doWriteToLastActiveInput(character);});});(function($){var defaults={y:0,elastic:true,momentum:true,elasticDamp:0.6,elasticTime:50,reboundTime:400,momentumDamp:0.9,momentumTime:300,iPadMomentumDamp:0.95,iPadMomentumTime:1200};var methods={init:function(options){return this.each(function(){var $this=$(this),o=$.extend(defaults,options),scrollY=-o.y,touchY=0,movedY=0,pollY=0,height=0,maxHeight=0,scrollHeight=$this.attr('scrollHeight'),scrolling=false,bouncing=false,moved=false,timeoutID,isiPad=navigator.platform.indexOf('iPad')!==-1,hasMatrix='WebKitCSSMatrix'in window,has3d=hasMatrix&&'m11'in new WebKitCSSMatrix();var update=this.update=function(){height=$this.height();scrollHeight=$this.attr('scrollHeight');maxHeight=height-scrollHeight;clearTimeout(timeoutID);clampScroll(false);};update();$this.css({'-webkit-transition-property':'-webkit-transform','-webkit-transition-timing-function':'cubic-bezier(0, 0, 0.2, 1)','-webkit-transition-duration':'0','-webkit-transform':cssTranslate(scrollY)});window.addEventListener('onorientationchange'in window?'orientationchange':'resize',update,false);$this.bind('touchstart.touchScroll',touchStart);$this.bind('touchmove.touchScroll',touchMove);$this.bind('touchend.touchScroll touchcancel.touchScroll',touchEnd);$this.bind('webkitTransitionEnd.touchScroll',transitionEnd);var setPosition=this.setPosition=function(y){scrollY=y;$this.css('-webkit-transform',cssTranslate(scrollY));};function cssTranslate(y){return'translate'+(has3d?'3d(0px, ':'(0px, ')+y+'px'+(has3d?', 0px)':')');}
function setTransitionTime(time){time=time||'0';$this.css('-webkit-transition-duration',time+'ms');}
function getPosition(){if(hasMatrix){var matrix=new WebKitCSSMatrix(window.getComputedStyle($this[0]).webkitTransform);return matrix.f;}
return scrollY;}
this.getPosition=function(){return getPosition();};function reboundScroll(){if(scrollY>0){scrollTo(0,o.reboundTime);}else if(scrollY<maxHeight){scrollTo(maxHeight,o.reboundTime);}}
function transitionEnd(){if(bouncing){bouncing=false;reboundScroll();}
clearTimeout(timeoutID);}
function clampScroll(poll){if(!hasMatrix||bouncing){return;}
var oldY=pollY;pollY=getPosition();if(pollY>0){if(o.elastic){bouncing=true;scrollY=0;momentumScroll(pollY-oldY,o.elasticDamp,1,height,o.elasticTime);}else{setTransitionTime(0);setPosition(0);}}else if(pollY<maxHeight){if(o.elastic){bouncing=true;scrollY=maxHeight;momentumScroll(pollY-oldY,o.elasticDamp,1,height,o.elasticTime);}else{setTransitionTime(0);setPosition(maxHeight);}}else if(poll){timeoutID=setTimeout(clampScroll,20,true);}}
function scrollTo(destY,time){if(destY===scrollY){return;}
moved=true;setTransitionTime(time);setPosition(destY);}
function momentumScroll(d,k,minDist,maxDist,t){var ad=Math.abs(d),dy=0;while(ad>0.1){ad*=k;dy+=ad;}
if(dy>maxDist){dy=maxDist;}
if(dy>minDist){if(d<0){dy=-dy;}
scrollTo(scrollY+Math.round(dy),t);}
clampScroll(true);}
function getTouches(e){if(e.originalEvent){if(e.originalEvent.touches&&e.originalEvent.touches.length){return e.originalEvent.touches;}else if(e.originalEvent.changedTouches&&e.originalEvent.changedTouches.length){return e.originalEvent.changedTouches;}}
return e.touches;}
function touchStart(e){e.preventDefault();e.stopPropagation();var touches=getTouches(e);scrolling=true;moved=false;movedY=0;clearTimeout(timeoutID);setTransitionTime(0);if(o.momentum){var y=getPosition();if(y!==scrollY){setPosition(y);moved=true;}}
touchY=touches[0].pageY-scrollY;}
function touchMove(e){if(!scrolling){return;}
var touches=getTouches(e),dy=touches[0].pageY-touchY;if(dy>0){if(o.elastic){dy/=2;}else{dy=0;}}else if(dy<maxHeight){if(o.elastic){dy=(dy+maxHeight)/2;}else{dy=maxHeight;}}
movedY=dy-scrollY;moved=true;setPosition(dy);}
function touchEnd(e){if(!scrolling){return;}
scrolling=false;var touches=getTouches(e);if(moved){if(scrollY>0||scrollY<maxHeight){reboundScroll();}else if(o.momentum){momentumScroll(movedY,isiPad?o.iPadMomentumDamp:o.momentumDamp,40,2000,isiPad?o.iPadMomentumTime:o.momentumTime);}}else{var touch=touches[0],target=touch.target,me=document.createEvent('MouseEvent');while(target.nodeType!==1){target=target.parentNode;}
me.initMouseEvent('click',true,true,touch.view,1,touch.screenX,touch.screenY,touch.clientX,touch.clientY,false,false,false,false,0,null);target.dispatchEvent(me);}}});},update:function(){return this.each(function(){this.update();});},getPosition:function(){var a=[];this.each(function(){a.push(-this.getPosition());});return a;},setPosition:function(y){return this.each(function(){this.setPosition(-y);});}};$.fn.touchScroll=function(method){if(methods[method]){return methods[method].apply(this,Array.prototype.slice.call(arguments,1));}else if(typeof method==='object'||!method){return methods.init.apply(this,arguments);}else{$.error('Method '+method+' does not exist on jQuery.touchScroll');}};})(jQuery);jQuery.cookie=function(key,value,options){if(arguments.length>1&&String(value)!=="[object Object]"){options=jQuery.extend({},options);if(value===null||value===undefined){options.expires=-1;}
if(typeof options.expires==='number'){var days=options.expires,t=options.expires=new Date();t.setDate(t.getDate()+days);}
value=String(value);return(document.cookie=[encodeURIComponent(key),'=',options.raw?value:encodeURIComponent(value),options.expires?'; expires='+options.expires.toUTCString():'',options.path?'; path='+options.path:'',options.domain?'; domain='+options.domain:'',options.secure?'; secure':''].join(''));}
options=value||{};var result,decode=options.raw?function(s){return s;}:decodeURIComponent;return(result=new RegExp('(?:^|; )'+encodeURIComponent(key)+'=([^;]*)').exec(document.cookie))?decode(result[1]):null;};(function($){var isObject=function(x){return(typeof x==='object')&&!(x instanceof Array)&&(x!==null);};$.extend({getJSONCookie:function(cookieName){var cookieData=$.cookie(cookieName);return cookieData?JSON.parse(cookieData):null;},setJSONCookie:function(cookieName,data,options){var cookieData='';options=$.extend({expires:90,path:'/'},options);if(!isObject(data)){throw new Error('JSONCookie data must be an object');}
cookieData=JSON.stringify(data);return $.cookie(cookieName,cookieData,options);},removeJSONCookie:function(cookieName){return $.cookie(cookieName,null);},JSONCookie:function(cookieName,data,options){if(data){$.setJSONCookie(cookieName,data,options);}
return $.getJSONCookie(cookieName);}});})(jQuery);(function($,undefined){$.clock={version:"2.0.1",locale:{}}
t=new Array();$.fn.clock=function(options){var locale={"it":{"weekdays":["Domenica","Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato"],"months":["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"]},"en":{"weekdays":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],"months":["January","February","March","April","May","June","July","August","September","October","November","December"]},"es":{"weekdays":["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],"months":["Enero","Febrero","Marzo","Abril","May","junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]},"de":{"weekdays":["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],"months":["Januar","Februar","März","April","könnte","Juni","Juli","August","September","Oktober","November","Dezember"]},"fr":{"weekdays":["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"],"months":["Janvier","Février","Mars","Avril","May","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"]},"ru":{"weekdays":["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"],"months":["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"]}}
return this.each(function(){$.extend(locale,$.clock.locale);options=options||{};options.timestamp=options.timestamp||"systime";systimestamp=new Date();systimestamp=systimestamp.getTime();options.sysdiff=0;if(options.timestamp!="systime"){mytimestamp=new Date(options.timestamp);options.sysdiff=options.timestamp-systimestamp;}
options.langSet=options.langSet||"en";options.format=options.format||((options.langSet!="en")?"24":"12");options.calendar=options.calendar||"true";if(!$(this).hasClass("jqclock")){$(this).addClass("jqclock");}
var addleadingzero=function(i){if(i<10){i="0"+i;}
return i;},updateClock=function(el,myoptions){var el_id=$(el).attr("id");if(myoptions=="destroy"){clearTimeout(t[el_id]);}
else{mytimestamp=new Date();mytimestamp=mytimestamp.getTime();mytimestamp=mytimestamp+myoptions.sysdiff;mytimestamp=new Date(mytimestamp);var h=mytimestamp.getHours(),m=mytimestamp.getMinutes(),s=mytimestamp.getSeconds(),dy=mytimestamp.getDay(),dt=mytimestamp.getDate(),mo=mytimestamp.getMonth(),y=mytimestamp.getFullYear(),ap="",calend="";if(myoptions.format=="12"){ap=" AM";if(h>11){ap=" PM";}
if(h>12){h=h-12;}
if(h==0){h=12;}}
h=addleadingzero(h);m=addleadingzero(m);s=":"+addleadingzero(s);s="";if(myoptions.calendar!="false"){if(myoptions.langSet=="en"){calend="<span class='clockdate'>"+locale[myoptions.langSet].weekdays[dy]+', '+locale[myoptions.langSet].months[mo]+' '+dt+', '+y+"</span>";}
else{calend="<span class='clockdate'>"+locale[myoptions.langSet].weekdays[dy]+', '+dt+' '+locale[myoptions.langSet].months[mo]+' '+y+"</span>";}}
$(el).html(calend+"<span class='clocktime'>"+h+":"+m+s+ap+"</span>");t[el_id]=setTimeout(function(){updateClock($(el),myoptions)},1000);}}
updateClock($(this),options);});}
return this;})(jQuery);(function($){$.fn.menuTree=function(options){var opts=$.extend({},$.fn.menuTree.defaults,options);$.fn.menuTree.defaults={animation:false,handler:'css',speed:'fast',listElement:'ul',anchor:'a[href^="#"]'};$.fn.menuTree.mtParent=$(this);$.fn.menuTree.mtTargets=$.fn.menuTree.mtParent.find(opts.anchor);function reveal(element){var $reveal=$(element);switch(opts.listElement){case"dd":$reveal.mtReveal=$reveal.parent().next(opts.listElement);break;case"ol":$reveal.mtReveal=$reveal.next(opts.listElement);break;default:$reveal.mtReveal=$reveal.next(opts.listElement);}
return $reveal.mtReveal;}
function clickHandler(event){var $target=$(event.target).closest('a','li');if(0===$target.size()){$target=$(event.target);}
if(!$target.data('responsive')){return;}
event.preventDefault();$target.stop();if(!opts.animation){reveal($target).toggleClass('collapsed');$target.toggleClass('expanded').data('state','ready').trigger('statechange');}else{$target.data('state','transition').trigger('statechange');switch(opts.handler){case"slideToggle":reveal($target).slideToggle(opts.speed,function(){$(this).prev('.menuTree').toggleClass('expanded').blur().data('state','ready').trigger('statechange');}).toggleClass('collapsed');break;case"toggle":reveal($target).toggle(opts.speed,function(){$(this).prev('.menuTree').toggleClass('expanded').data('state','ready').trigger('statechange');}).toggleClass('collapsed');break;default:}}
if(opts.callback){opts.callback();}}
$.fn.menuTree.controller=function(event){var $target=$(event.target);if($target.data('state')!='ready'){$target.data('responsive',false);}else{$target.data('responsive',true);if($target.next(opts.listElement).find('.expanded').length>0){$target.next(opts.listElement).find('.expanded').each(function(){$(this).removeClass('expanded').next(opts.listElement).hide().addClass('collapsed');});}}};$.fn.menuTree.init=(function(){$.fn.menuTree.mtTargets.each(function(){var $localTarget=$(this);$localTarget.data({state:'ready',responsive:true});$localTarget.addClass('menuTree');reveal($localTarget).toggleClass('collapsed');$.fn.menuTree.mtParent.click(clickHandler);$.fn.menuTree.mtParent.bind('statechange',$.fn.menuTree.controller);});});return $.fn.menuTree.init();};})(jQuery);(function($){$.fn.tabSlideOut=function(callerSettings){var settings=$.extend({tabHandle:'.handle',speed:300,action:'click',tabLocation:'left',topPos:'200px',leftPos:'20px',fixedPosition:false,positioning:'absolute',pathToTabImage:null,imageHeight:null,imageWidth:null,onLoadSlideOut:false},callerSettings||{});settings.tabHandle=$(settings.tabHandle);var obj=this;if(settings.fixedPosition===true){settings.positioning='fixed';}else{settings.positioning='absolute';}
if(document.all&&!window.opera&&!window.XMLHttpRequest){settings.positioning='absolute';}
if(settings.pathToTabImage!=null){settings.tabHandle.css({'background':'url('+settings.pathToTabImage+') no-repeat','width':settings.imageWidth,'height':settings.imageHeight});}
settings.tabHandle.css({'display':'block','textIndent':'-99999px','outline':'none','position':'absolute'});obj.css({'line-height':'1','position':settings.positioning});var properties={containerWidth:parseInt(obj.outerWidth(),10)+'px',containerHeight:parseInt(obj.outerHeight(),10)+'px',tabWidth:parseInt(settings.tabHandle.outerWidth(),10)+'px',tabHeight:parseInt(settings.tabHandle.outerHeight(),10)+'px'};if(settings.tabLocation==='top'||settings.tabLocation==='bottom'){obj.css({'left':settings.leftPos});settings.tabHandle.css({'right':0});}
if(settings.tabLocation==='top'){obj.css({'top':'-'+properties.containerHeight});settings.tabHandle.css({'bottom':'-'+properties.tabHeight});}
if(settings.tabLocation==='bottom'){obj.css({'bottom':'-'+properties.containerHeight,'position':'fixed'});settings.tabHandle.css({'top':'-'+properties.tabHeight});}
if(settings.tabLocation==='left'||settings.tabLocation==='right'){obj.css({'height':properties.containerHeight,'top':settings.topPos});settings.tabHandle.css({'top':0});}
if(settings.tabLocation==='left'){obj.css({'left':'-'+properties.containerWidth});settings.tabHandle.css({'right':'-'+properties.tabWidth});}
if(settings.tabLocation==='right'){obj.css({'right':'-'+properties.containerWidth});settings.tabHandle.css({'left':'-'+properties.tabWidth});$('html').css('overflow-x','hidden');}
settings.tabHandle.click(function(event){event.preventDefault();});var slideIn=function(){if(settings.tabLocation==='top'){obj.animate({top:'-'+properties.containerHeight},settings.speed).removeClass('open');}else if(settings.tabLocation==='left'){obj.animate({left:'-'+properties.containerWidth},settings.speed).removeClass('open');}else if(settings.tabLocation==='right'){obj.animate({right:'-'+properties.containerWidth},settings.speed).removeClass('open');}else if(settings.tabLocation==='bottom'){obj.animate({bottom:'-'+properties.containerHeight},settings.speed).removeClass('open');}};var slideOut=function(){if(settings.tabLocation=='top'){obj.animate({top:'-3px'},settings.speed).addClass('open');}else if(settings.tabLocation=='left'){obj.animate({left:'-3px'},settings.speed).addClass('open');}else if(settings.tabLocation=='right'){obj.animate({right:'-3px'},settings.speed).addClass('open');}else if(settings.tabLocation=='bottom'){obj.animate({bottom:'-3px'},settings.speed).addClass('open');}};var clickScreenToClose=function(){obj.click(function(event){event.stopPropagation();});$(document).click(function(){slideIn();});};var clickAction=function(){settings.tabHandle.click(function(event){if(obj.hasClass('open')){slideIn();}else{slideOut();}});clickScreenToClose();};var hoverAction=function(){obj.hover(function(){slideOut();},function(){slideIn();});settings.tabHandle.click(function(event){if(obj.hasClass('open')){slideIn();}});clickScreenToClose();};var slideOutOnLoad=function(){slideIn();setTimeout(slideOut,500);};if(settings.action==='click'){clickAction();}
if(settings.action==='hover'){hoverAction();}
if(settings.onLoadSlideOut){slideOutOnLoad();};};})(jQuery);var MONTH_NAMES=new Array('January','February','March','April','May','June','July','August','September','October','November','December','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');var DAY_NAMES=new Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sun','Mon','Tue','Wed','Thu','Fri','Sat');function LZ(x){return(x<0||x>9?"":"0")+x}
function isDate(val,format){var date=getDateFromFormat(val,format);if(date==0){return false;}return true;}
function compareDates(date1,dateformat1,date2,dateformat2){var d1=getDateFromFormat(date1,dateformat1);var d2=getDateFromFormat(date2,dateformat2);if(d1==0||d2==0){return-1;}else if(d1>d2){return 1;}return 0;}
function formatDate(date,format){format=format+"";var result="";var i_format=0;var c="";var token="";var y=date.getYear()+"";var M=date.getMonth()+1;var d=date.getDate();var E=date.getDay();var H=date.getHours();var m=date.getMinutes();var s=date.getSeconds();var yyyy,yy,MMM,MM,dd,hh,h,mm,ss,ampm,HH,H,KK,K,kk,k;var value=new Object();if(y.length<4){y=""+(y-0+1900);}value["y"]=""+y;value["yyyy"]=y;value["yy"]=y.substring(2,4);value["M"]=M;value["MM"]=LZ(M);value["MMM"]=MONTH_NAMES[M-1];value["NNN"]=MONTH_NAMES[M+11];value["d"]=d;value["dd"]=LZ(d);value["E"]=DAY_NAMES[E+7];value["EE"]=DAY_NAMES[E];value["H"]=H;value["HH"]=LZ(H);if(H==0){value["h"]=12;}else if(H>12){value["h"]=H-12;}else{value["h"]=H;}value["hh"]=LZ(value["h"]);if(H>11){value["K"]=H-12;}else{value["K"]=H;}value["k"]=H+1;value["KK"]=LZ(value["K"]);value["kk"]=LZ(value["k"]);if(H>11){value["a"]="PM";}else{value["a"]="AM";}value["m"]=m;value["mm"]=LZ(m);value["s"]=s;value["ss"]=LZ(s);while(i_format<format.length){c=format.charAt(i_format);token="";while((format.charAt(i_format)==c)&&(i_format<format.length)){token+=format.charAt(i_format++);}if(value[token]!=null){result=result+value[token];}else{result=result+token;}}return result;}
function _isInteger(val){var digits="1234567890";for(var i=0;i<val.length;i++){if(digits.indexOf(val.charAt(i))==-1){return false;}}return true;}
function _getInt(str,i,minlength,maxlength){for(var x=maxlength;x>=minlength;x--){var token=str.substring(i,i+x);if(token.length<minlength){return null;}if(_isInteger(token)){return token;}}return null;}
function getDateFromFormat(val,format){val=val+"";format=format+"";var i_val=0;var i_format=0;var c="";var token="";var token2="";var x,y;var now=new Date();var year=now.getYear();var month=now.getMonth()+1;var date=1;var hh=now.getHours();var mm=now.getMinutes();var ss=now.getSeconds();var ampm="";while(i_format<format.length){c=format.charAt(i_format);token="";while((format.charAt(i_format)==c)&&(i_format<format.length)){token+=format.charAt(i_format++);}if(token=="yyyy"||token=="yy"||token=="y"){if(token=="yyyy"){x=4;y=4;}if(token=="yy"){x=2;y=2;}if(token=="y"){x=2;y=4;}year=_getInt(val,i_val,x,y);if(year==null){return 0;}i_val+=year.length;if(year.length==2){if(year>70){year=1900+(year-0);}else{year=2000+(year-0);}}}else if(token=="MMM"||token=="NNN"){month=0;for(var i=0;i<MONTH_NAMES.length;i++){var month_name=MONTH_NAMES[i];if(val.substring(i_val,i_val+month_name.length).toLowerCase()==month_name.toLowerCase()){if(token=="MMM"||(token=="NNN"&&i>11)){month=i+1;if(month>12){month-=12;}i_val+=month_name.length;break;}}}if((month<1)||(month>12)){return 0;}}else if(token=="EE"||token=="E"){for(var i=0;i<DAY_NAMES.length;i++){var day_name=DAY_NAMES[i];if(val.substring(i_val,i_val+day_name.length).toLowerCase()==day_name.toLowerCase()){i_val+=day_name.length;break;}}}else if(token=="MM"||token=="M"){month=_getInt(val,i_val,token.length,2);if(month==null||(month<1)||(month>12)){return 0;}i_val+=month.length;}else if(token=="dd"||token=="d"){date=_getInt(val,i_val,token.length,2);if(date==null||(date<1)||(date>31)){return 0;}i_val+=date.length;}else if(token=="hh"||token=="h"){hh=_getInt(val,i_val,token.length,2);if(hh==null||(hh<1)||(hh>12)){return 0;}i_val+=hh.length;}else if(token=="HH"||token=="H"){hh=_getInt(val,i_val,token.length,2);if(hh==null||(hh<0)||(hh>23)){return 0;}i_val+=hh.length;}else if(token=="KK"||token=="K"){hh=_getInt(val,i_val,token.length,2);if(hh==null||(hh<0)||(hh>11)){return 0;}i_val+=hh.length;}else if(token=="kk"||token=="k"){hh=_getInt(val,i_val,token.length,2);if(hh==null||(hh<1)||(hh>24)){return 0;}i_val+=hh.length;hh--;}else if(token=="mm"||token=="m"){mm=_getInt(val,i_val,token.length,2);if(mm==null||(mm<0)||(mm>59)){return 0;}i_val+=mm.length;}else if(token=="ss"||token=="s"){ss=_getInt(val,i_val,token.length,2);if(ss==null||(ss<0)||(ss>59)){return 0;}i_val+=ss.length;}else if(token=="a"){if(val.substring(i_val,i_val+2).toLowerCase()=="am"){ampm="AM";}else if(val.substring(i_val,i_val+2).toLowerCase()=="pm"){ampm="PM";}else{return 0;}i_val+=2;}else{if(val.substring(i_val,i_val+token.length)!=token){return 0;}else{i_val+=token.length;}}}if(i_val!=val.length){return 0;}if(month==2){if(((year%4==0)&&(year%100!=0))||(year%400==0)){if(date>29){return 0;}}else{if(date>28){return 0;}}}if((month==4)||(month==6)||(month==9)||(month==11)){if(date>30){return 0;}}if(hh<12&&ampm=="PM"){hh=hh-0+12;}else if(hh>11&&ampm=="AM"){hh-=12;}var newdate=new Date(year,month-1,date,hh,mm,ss);return newdate.getTime();}
function parseDate(val){var preferEuro=(arguments.length==2)?arguments[1]:false;generalFormats=new Array('y-M-d','MMM d, y','MMM d,y','y-MMM-d','d-MMM-y','MMM d');monthFirst=new Array('M/d/y','M-d-y','M.d.y','MMM-d','M/d','M-d');dateFirst=new Array('d/M/y','d-M-y','d.M.y','d-MMM','d/M','d-M');var checkList=new Array('generalFormats',preferEuro?'dateFirst':'monthFirst',preferEuro?'monthFirst':'dateFirst');var d=null;for(var i=0;i<checkList.length;i++){var l=window[checkList[i]];for(var j=0;j<l.length;j++){d=getDateFromFormat(val,l[j]);if(d!=0){return new Date(d);}}}return null;}
(function($){$.extend({playSound:function(){return $("<embed src='"+arguments[0]+"' hidden='true' autostart='true' loop='false' class='playSound'>").appendTo('body');}});})(jQuery);