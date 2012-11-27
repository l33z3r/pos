
var dp={sh:{Toolbar:{},Utils:{},RegexLib:{},Brushes:{},Strings:{AboutDialog:'<html><head><title>About...</title></head><body class="dp-about"><table cellspacing="0"><tr><td class="copy"><p class="title">dp.SyntaxHighlighter</div><div class="para">Version: {V}</p><p><a href="http://www.dreamprojections.com/syntaxhighlighter/?ref=about" target="_blank">http://www.dreamprojections.com/syntaxhighlighter</a></p>&copy;2004-2007 Alex Gorbatchev.</td></tr><tr><td class="footer"><input type="button" class="close" value="OK" onClick="window.close()"/></td></tr></table></body></html>'},ClipboardSwf:null,Version:'1.5.1'}};dp.SyntaxHighlighter=dp.sh;dp.sh.Toolbar.Commands={ExpandSource:{label:'+ expand source',check:function(highlighter){return highlighter.collapse;},func:function(sender,highlighter)
{sender.parentNode.removeChild(sender);highlighter.div.className=highlighter.div.className.replace('collapsed','');}},ViewSource:{label:'view plain',func:function(sender,highlighter)
{var code=dp.sh.Utils.FixForBlogger(highlighter.originalCode).replace(/</g,'&lt;');var wnd=window.open('','_blank','width=750, height=400, location=0, resizable=1, menubar=0, scrollbars=0');wnd.document.write('<textarea style="width:99%;height:99%">'+code+'</textarea>');wnd.document.close();}},CopyToClipboard:{label:'copy to clipboard',check:function(){return window.clipboardData!=null||dp.sh.ClipboardSwf!=null;},func:function(sender,highlighter)
{var code=dp.sh.Utils.FixForBlogger(highlighter.originalCode).replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');if(window.clipboardData)
{window.clipboardData.setData('text',code);}
else if(dp.sh.ClipboardSwf!=null)
{var flashcopier=highlighter.flashCopier;if(flashcopier==null)
{flashcopier=document.createElement('div');highlighter.flashCopier=flashcopier;highlighter.div.appendChild(flashcopier);}
flashcopier.innerHTML='<embed src="'+dp.sh.ClipboardSwf+'" FlashVars="clipboard='+encodeURIComponent(code)+'" width="0" height="0" type="application/x-shockwave-flash"></embed>';}
alert('The code is in your clipboard now');}},PrintSource:{label:'print',func:function(sender,highlighter)
{var iframe=document.createElement('IFRAME');var doc=null;iframe.style.cssText='position:absolute;width:0px;height:0px;left:-500px;top:-500px;';document.body.appendChild(iframe);doc=iframe.contentWindow.document;dp.sh.Utils.CopyStyles(doc,window.document);doc.write('<div class="'+highlighter.div.className.replace('collapsed','')+' printing">'+highlighter.div.innerHTML+'</div>');doc.close();iframe.contentWindow.focus();iframe.contentWindow.print();alert('Printing...');document.body.removeChild(iframe);}},About:{label:'',func:function(highlighter)
{var wnd=window.open('','_blank','dialog,width=300,height=150,scrollbars=0');var doc=wnd.document;dp.sh.Utils.CopyStyles(doc,window.document);doc.write(dp.sh.Strings.AboutDialog.replace('{V}',dp.sh.Version));doc.close();wnd.focus();}}};dp.sh.Toolbar.Create=function(highlighter)
{var div=document.createElement('DIV');div.className='tools';for(var name in dp.sh.Toolbar.Commands)
{var cmd=dp.sh.Toolbar.Commands[name];if(cmd.check!=null&&!cmd.check(highlighter))
continue;div.innerHTML+='<a href="#" onclick="dp.sh.Toolbar.Command(\''+name+'\',this);return false;">'+cmd.label+'</a>';}
return div;}
dp.sh.Toolbar.Command=function(name,sender)
{var n=sender;while(n!=null&&n.className.indexOf('dp-highlighter')==-1)
n=n.parentNode;if(n!=null)
dp.sh.Toolbar.Commands[name].func(sender,n.highlighter);}
dp.sh.Utils.CopyStyles=function(destDoc,sourceDoc)
{var links=sourceDoc.getElementsByTagName('link');for(var i=0;i<links.length;i++)
if(links[i].rel.toLowerCase()=='stylesheet')
destDoc.write('<link type="text/css" rel="stylesheet" href="'+links[i].href+'"></link>');}
dp.sh.Utils.FixForBlogger=function(str)
{return(dp.sh.isBloggerMode==true)?str.replace(/<br\s*\/?>|&lt;br\s*\/?&gt;/gi,'\n'):str;}
dp.sh.RegexLib={MultiLineCComments:new RegExp('/\\*[\\s\\S]*?\\*/','gm'),SingleLineCComments:new RegExp('//.*$','gm'),SingleLinePerlComments:new RegExp('#.*$','gm'),DoubleQuotedString:new RegExp('"(?:\\.|(\\\\\\")|[^\\""\\n])*"','g'),SingleQuotedString:new RegExp("'(?:\\.|(\\\\\\')|[^\\''\\n])*'",'g')};dp.sh.Match=function(value,index,css)
{this.value=value;this.index=index;this.length=value.length;this.css=css;}
dp.sh.Highlighter=function()
{this.noGutter=false;this.addControls=true;this.collapse=false;this.tabsToSpaces=true;this.wrapColumn=80;this.showColumns=true;}
dp.sh.Highlighter.SortCallback=function(m1,m2)
{if(m1.index<m2.index)
return-1;else if(m1.index>m2.index)
return 1;else
{if(m1.length<m2.length)
return-1;else if(m1.length>m2.length)
return 1;}
return 0;}
dp.sh.Highlighter.prototype.CreateElement=function(name)
{var result=document.createElement(name);result.highlighter=this;return result;}
dp.sh.Highlighter.prototype.GetMatches=function(regex,css)
{var index=0;var match=null;while((match=regex.exec(this.code))!=null)
this.matches[this.matches.length]=new dp.sh.Match(match[0],match.index,css);}
dp.sh.Highlighter.prototype.AddBit=function(str,css)
{if(str==null||str.length==0)
return;var span=this.CreateElement('SPAN');str=str.replace(/ /g,'&nbsp;');str=str.replace(/</g,'&lt;');str=str.replace(/\n/gm,'&nbsp;<br>');if(css!=null)
{if((/br/gi).test(str))
{var lines=str.split('&nbsp;<br>');for(var i=0;i<lines.length;i++)
{span=this.CreateElement('SPAN');span.className=css;span.innerHTML=lines[i];this.div.appendChild(span);if(i+1<lines.length)
this.div.appendChild(this.CreateElement('BR'));}}
else
{span.className=css;span.innerHTML=str;this.div.appendChild(span);}}
else
{span.innerHTML=str;this.div.appendChild(span);}}
dp.sh.Highlighter.prototype.IsInside=function(match)
{if(match==null||match.length==0)
return false;for(var i=0;i<this.matches.length;i++)
{var c=this.matches[i];if(c==null)
continue;if((match.index>c.index)&&(match.index<c.index+c.length))
return true;}
return false;}
dp.sh.Highlighter.prototype.ProcessRegexList=function()
{for(var i=0;i<this.regexList.length;i++)
this.GetMatches(this.regexList[i].regex,this.regexList[i].css);}
dp.sh.Highlighter.prototype.ProcessSmartTabs=function(code)
{var lines=code.split('\n');var result='';var tabSize=4;var tab='\t';function InsertSpaces(line,pos,count)
{var left=line.substr(0,pos);var right=line.substr(pos+1,line.length);var spaces='';for(var i=0;i<count;i++)
spaces+=' ';return left+spaces+right;}
function ProcessLine(line,tabSize)
{if(line.indexOf(tab)==-1)
return line;var pos=0;while((pos=line.indexOf(tab))!=-1)
{var spaces=tabSize-pos%tabSize;line=InsertSpaces(line,pos,spaces);}
return line;}
for(var i=0;i<lines.length;i++)
result+=ProcessLine(lines[i],tabSize)+'\n';return result;}
dp.sh.Highlighter.prototype.SwitchToList=function()
{var html=this.div.innerHTML.replace(/<(br)\/?>/gi,'\n');var lines=html.split('\n');if(this.addControls==true)
this.bar.appendChild(dp.sh.Toolbar.Create(this));if(this.showColumns)
{var div=this.CreateElement('div');var columns=this.CreateElement('div');var showEvery=10;var i=1;while(i<=150)
{if(i%showEvery==0)
{div.innerHTML+=i;i+=(i+'').length;}
else
{div.innerHTML+='&middot;';i++;}}
columns.className='columns';columns.appendChild(div);this.bar.appendChild(columns);}
for(var i=0,lineIndex=this.firstLine;i<lines.length-1;i++,lineIndex++)
{var li=this.CreateElement('LI');var span=this.CreateElement('SPAN');li.className=(i%2==0)?'alt':'';span.innerHTML=lines[i]+'&nbsp;';li.appendChild(span);this.ol.appendChild(li);}
this.div.innerHTML='';}
dp.sh.Highlighter.prototype.Highlight=function(code)
{function Trim(str)
{return str.replace(/^\s*(.*?)[\s\n]*$/g,'$1');}
function Chop(str)
{return str.replace(/\n*$/,'').replace(/^\n*/,'');}
function Unindent(str)
{var lines=dp.sh.Utils.FixForBlogger(str).split('\n');var indents=new Array();var regex=new RegExp('^\\s*','g');var min=1000;for(var i=0;i<lines.length&&min>0;i++)
{if(Trim(lines[i]).length==0)
continue;var matches=regex.exec(lines[i]);if(matches!=null&&matches.length>0)
min=Math.min(matches[0].length,min);}
if(min>0)
for(var i=0;i<lines.length;i++)
lines[i]=lines[i].substr(min);return lines.join('\n');}
function Copy(string,pos1,pos2)
{return string.substr(pos1,pos2-pos1);}
var pos=0;if(code==null)
code='';this.originalCode=code;this.code=Chop(Unindent(code));this.div=this.CreateElement('DIV');this.bar=this.CreateElement('DIV');this.ol=this.CreateElement('OL');this.matches=new Array();this.div.className='dp-highlighter';this.div.highlighter=this;this.bar.className='bar';this.ol.start=this.firstLine;if(this.CssClass!=null)
this.ol.className=this.CssClass;if(this.collapse)
this.div.className+=' collapsed';if(this.noGutter)
this.div.className+=' nogutter';if(this.tabsToSpaces==true)
this.code=this.ProcessSmartTabs(this.code);this.ProcessRegexList();if(this.matches.length==0)
{this.AddBit(this.code,null);this.SwitchToList();this.div.appendChild(this.bar);this.div.appendChild(this.ol);return;}
this.matches=this.matches.sort(dp.sh.Highlighter.SortCallback);for(var i=0;i<this.matches.length;i++)
if(this.IsInside(this.matches[i]))
this.matches[i]=null;for(var i=0;i<this.matches.length;i++)
{var match=this.matches[i];if(match==null||match.length==0)
continue;this.AddBit(Copy(this.code,pos,match.index),null);this.AddBit(match.value,match.css);pos=match.index+match.length;}
this.AddBit(this.code.substr(pos),null);this.SwitchToList();this.div.appendChild(this.bar);this.div.appendChild(this.ol);}
dp.sh.Highlighter.prototype.GetKeywords=function(str)
{return'\\b'+str.replace(/ /g,'\\b|\\b')+'\\b';}
dp.sh.BloggerMode=function()
{dp.sh.isBloggerMode=true;}
dp.sh.HighlightAll=function(name,showGutter,showControls,collapseAll,firstLine,showColumns)
{function FindValue()
{var a=arguments;for(var i=0;i<a.length;i++)
{if(a[i]==null)
continue;if(typeof(a[i])=='string'&&a[i]!='')
return a[i]+'';if(typeof(a[i])=='object'&&a[i].value!='')
return a[i].value+'';}
return null;}
function IsOptionSet(value,list)
{for(var i=0;i<list.length;i++)
if(list[i]==value)
return true;return false;}
function GetOptionValue(name,list,defaultValue)
{var regex=new RegExp('^'+name+'\\[(\\w+)\\]$','gi');var matches=null;for(var i=0;i<list.length;i++)
if((matches=regex.exec(list[i]))!=null)
return matches[1];return defaultValue;}
function FindTagsByName(list,name,tagName)
{var tags=document.getElementsByTagName(tagName);for(var i=0;i<tags.length;i++)
if(tags[i].getAttribute('name')==name||tags[i].getAttribute('id')==name)
list.push(tags[i]);}
var elements=[];var highlighter=null;var registered={};var propertyName='innerHTML';FindTagsByName(elements,name,'code');FindTagsByName(elements,name,'pre');FindTagsByName(elements,name,'textarea');if(elements.length==0)
return;for(var brush in dp.sh.Brushes)
{var aliases=dp.sh.Brushes[brush].Aliases;if(aliases==null)
continue;for(var i=0;i<aliases.length;i++)
registered[aliases[i]]=brush;}
for(var i=0;i<elements.length;i++)
{var element=elements[i];var options=FindValue(element.attributes['class'],element.className,element.attributes['language'],element.language);var language='';if(options==null)
continue;options=options.split(':');language=options[0].toLowerCase();if(registered[language]==null)
continue;highlighter=new dp.sh.Brushes[registered[language]]();element.style.display='none';highlighter.noGutter=(showGutter==null)?IsOptionSet('nogutter',options):!showGutter;highlighter.addControls=(showControls==null)?!IsOptionSet('nocontrols',options):showControls;highlighter.collapse=(collapseAll==null)?IsOptionSet('collapse',options):collapseAll;highlighter.showColumns=(showColumns==null)?IsOptionSet('showcolumns',options):showColumns;var headNode=document.getElementsByTagName('head')[0];if(highlighter.Style&&headNode)
{var styleNode=document.createElement('style');styleNode.setAttribute('type','text/css');if(styleNode.styleSheet)
{styleNode.styleSheet.cssText=highlighter.Style;}
else
{var textNode=document.createTextNode(highlighter.Style);styleNode.appendChild(textNode);}
headNode.appendChild(styleNode);}
highlighter.firstLine=(firstLine==null)?parseInt(GetOptionValue('firstline',options,1)):firstLine;highlighter.Highlight(element[propertyName]);highlighter.source=element;element.parentNode.insertBefore(highlighter.div,element);}}
﻿
var ModalPopupsDefaults={shadow:true,shadowSize:2,shadowColor:"#666666",backgroundColor:"#dddddd",borderColor:"#666666",titleBackColor:"#eeeeee",titleFontColor:"#000000",popupBackColor:"#FFFFFF",popupFontColor:"#666666",footerBackColor:"#FFFFFF",footerFontColor:"#666666",okButtonText:"OK",yesButtonText:"Yes",noButtonText:"No",cancelButtonText:"Cancel",fontFamily:"Verdana,Arial",fontSize:"12px"}
var ModalPopups={Init:function(){},SetDefaults:function(parameters){parameters=parameters||{};ModalPopupsDefaults.shadow=parameters.shadow!=null?parameters.shadow:ModalPopupsDefaults.shadow;ModalPopupsDefaults.shadowSize=parameters.shadowSize!=null?parameters.shadowSize:ModalPopupsDefaults.shadowSize;ModalPopupsDefaults.shadowColor=parameters.shadowColor!=null?parameters.shadowColor:ModalPopupsDefaults.shadowColor;ModalPopupsDefaults.backgroundColor=parameters.backgroundColor!=null?parameters.backgroundColor:ModalPopupsDefaults.backgroundColor;ModalPopupsDefaults.borderColor=parameters.borderColor!=null?parameters.borderColor:ModalPopupsDefaults.borderColor;ModalPopupsDefaults.okButtonText=parameters.okButtonText!=null?parameters.okButtonText:ModalPopupsDefaults.okButtonText;ModalPopupsDefaults.yesButtonText=parameters.yesButtonText!=null?parameters.yesButtonText:ModalPopupsDefaults.yesButtonText;ModalPopupsDefaults.noButtonText=parameters.noButtonText!=null?parameters.noButtonText:ModalPopupsDefaults.noButtonText;ModalPopupsDefaults.cancelButtonText=parameters.cancelButtonText!=null?parameters.cancelButtonText:ModalPopupsDefaults.cancelButtonText;ModalPopupsDefaults.titleBackColor=parameters.titleBackColor!=null?parameters.titleBackColor:ModalPopupsDefaults.titleBackColor;ModalPopupsDefaults.titleFontColor=parameters.titleFontColor!=null?parameters.titleFontColor:ModalPopupsDefaults.titleFontColor;ModalPopupsDefaults.popupBackColor=parameters.popupBackColor!=null?parameters.popupBackColor:ModalPopupsDefaults.popupBackColor;ModalPopupsDefaults.popupFontColor=parameters.popupFontColor!=null?parameters.popupFontColor:ModalPopupsDefaults.popupFontColor;ModalPopupsDefaults.footerBackColor=parameters.footerBackColor!=null?parameters.footerBackColor:ModalPopupsDefaults.footerBackColor;ModalPopupsDefaults.footerFontColor=parameters.footerFontColor!=null?parameters.footerFontColor:ModalPopupsDefaults.footerFontColor;ModalPopupsDefaults.fontFamily=parameters.fontFamily!=null?parameters.fontFamily:ModalPopupsDefaults.fontFamily;ModalPopupsDefaults.fontSize=parameters.fontSize!=null?parameters.fontSize:ModalPopupsDefaults.fontSize;},Alert:function(id,title,message,parameters){parameters=parameters||{};if(!title)title="Alert";parameters.buttons="ok";parameters.okButtonText=parameters.okButtonText!=null?parameters.okButtonText:ModalPopupsDefaults.okButtonText;var myLayers=ModalPopups._createAllLayers(id,title,message,parameters);var oPopupBody=myLayers[4];oPopupBody.innerHTML=message;ModalPopups._styleAllLayers(id,parameters,myLayers);},Confirm:function(id,title,question,parameters){parameters=parameters||{};if(!title)title="Confirm";parameters.buttons="yes,no";parameters.yesButtonText=parameters.yesButtonText!=null?parameters.yesButtonText:ModalPopupsDefaults.yesButtonText;parameters.noButtonText=parameters.noButtonText!=null?parameters.noButtonText:ModalPopupsDefaults.noButtonText;var myLayers=ModalPopups._createAllLayers(id,title,question,parameters);var oPopupBody=myLayers[4];oPopupBody.innerHTML=question;ModalPopups._styleAllLayers(id,parameters,myLayers);},YesNoCancel:function(id,title,question,parameters){parameters=parameters||{};if(!title)title="YesNoCancel";parameters.buttons="yes,no,cancel";parameters.yesButtonText=parameters.yesButtonText!=null?parameters.yesButtonText:ModalPopupsDefaults.yesButtonText;parameters.noButtonText=parameters.noButtonText!=null?parameters.noButtonText:ModalPopupsDefaults.noButtonText;parameters.cancelButtonText=parameters.cancelButtonText!=null?parameters.cancelButtonText:ModalPopupsDefaults.cancelButtonText;var myLayers=ModalPopups._createAllLayers(id,title,question,parameters);var oPopupBody=myLayers[4];oPopupBody.innerHTML=question;ModalPopups._styleAllLayers(id,parameters,myLayers);},Prompt:function(id,title,question,parameters){parameters=parameters||{};if(!title)title="Prompt";parameters.buttons="ok,cancel";parameters.okButtonText=parameters.okButtonText!=null?parameters.okButtonText:"OK";parameters.cancelButtonText=parameters.cancelButtonText!=null?parameters.cancelButtonText:"Cancel";var myLayers=ModalPopups._createAllLayers(id,title,question,parameters);var oPopupBody=myLayers[4];var txtStyle="";if(parameters.width!=null)
txtStyle="width:95%;";var txtHtml=question+"<br/>";txtHtml+="<input type=text id='"+id+"_promptInput' value='' "+"style='border: solid 1px #859DBE; "+txtStyle+"'>";oPopupBody.innerHTML=txtHtml;ModalPopups._styleAllLayers(id,parameters,myLayers);ModalPopupsSupport.findControl(id+"_promptInput").focus();},GetPromptInput:function(id){var promptValue=ModalPopupsSupport.findControl(id+"_promptInput");return promptValue;},GetPromptResult:function(id){var promptValue=ModalPopupsSupport.findControl(id+"_promptInput");return promptValue;},GetCustomControl:function(id){return ModalPopupsSupport.findControl(id);},Indicator:function(id,title,message,parameters){parameters=parameters||{};if(!title)title="Indicator";if(parameters.buttons==null)
parameters.buttons="";var myLayers=ModalPopups._createAllLayers(id,title,message,parameters);var oPopupBody=myLayers[4];oPopupBody.innerHTML=message;ModalPopups._styleAllLayers(id,parameters,myLayers);},Custom:function(id,title,contents,parameters){parameters=parameters||{};if(!title)title="Custom";if(parameters.buttons==null)
{alert("buttons is a required parameter. ie: buttons: 'yes,no' or buttons: 'ok'.\nPossible buttons are yes, no, ok, cancel");return;}
var myLayers=ModalPopups._createAllLayers(id,title,contents,parameters);var oPopupBody=myLayers[4];oPopupBody.innerHTML=contents;ModalPopups._styleAllLayers(id,parameters,myLayers);},Close:function(id){window.onresize=null;window.onscroll=null;document.body.removeChild(ModalPopupsSupport.findControl(id+"_background"));document.body.removeChild(ModalPopupsSupport.findControl(id+"_popup"));document.body.removeChild(ModalPopupsSupport.findControl(id+"_shadow"));},Cancel:function(id){ModalPopups.Close(id);},_zIndex:10000,_createAllLayers:function(id,title,message,parameters){var oBackground=ModalPopupsSupport.makeLayer(id+'_background',true,null);var oPopup=ModalPopupsSupport.makeLayer(id+'_popup',true,null);var oShadow=ModalPopupsSupport.makeLayer(id+'_shadow',true,null);var oPopupTitle=ModalPopupsSupport.makeLayer(id+'_popupTitle',true,oPopup);var oPopupBody=ModalPopupsSupport.makeLayer(id+'_popupBody',true,oPopup);var oPopupFooter=ModalPopupsSupport.makeLayer(id+'_popupFooter',true,oPopup);var okButtonText=parameters.okButtonText!=null?parameters.okButtonText:ModalPopupsDefaults.okButtonText;var yesButtonText=parameters.yesButtonText!=null?parameters.yesButtonText:ModalPopupsDefaults.yesButtonText;var noButtonText=parameters.noButtonText!=null?parameters.noButtonText:ModalPopupsDefaults.noButtonText;var cancelButtonText=parameters.cancelButtonText!=null?parameters.cancelButtonText:ModalPopupsDefaults.cancelButtonText;var onOk=parameters.onOk!=null?parameters.onOk:"ModalPopups.Close(\""+id+"\");";var onYes=parameters.onYes!=null?parameters.onYes:"ModalPopups.Close(\""+id+"\");";var onNo=parameters.onNo!=null?parameters.onNo:"ModalPopups.Close(\""+id+"\");";var onCancel=parameters.onCancel!=null?parameters.onCancel:"ModalPopups.Close(\""+id+"\");";oPopupTitle.innerHTML="<table cellpadding='0' cellspacing='0' style='border: 0;' height='100%'>"+"<tr><td valign='middle'><b>"+title+"</b></td></tr>"+"</table>";oPopupFooter.innerHTML="";parameters.fontFamily=parameters.fontFamily!=null?parameters.fontFamily:ModalPopupsDefaults.fontFamily;var bt=parameters.buttons.split(',');for(x in bt){if(bt[x]=="ok")
oPopupFooter.innerHTML+="<input name='"+id+"_okButton' id='"+id+"_okButton' type=button value='"+okButtonText+"' style='margin-right: 5px; margin-left: 5px;' onclick='"+onOk+"'/>";if(bt[x]=="yes")
oPopupFooter.innerHTML+="<input name='"+id+"_yesButton' id='"+id+"_yesButton' type=button value='"+yesButtonText+"' style='margin-right: 5px; margin-left: 5px;' onclick='"+onYes+"'/>";if(bt[x]=="no")
oPopupFooter.innerHTML+="<input name='"+id+"_noButton' id='"+id+"_noButton' type=button value='"+noButtonText+"' style='margin-right: 5px; margin-left: 5px;' onclick='"+onNo+"'/>";if(bt[x]=="cancel")
oPopupFooter.innerHTML+="<input name='"+id+"_cancelButton' id='"+id+"_cancelButton' type=button value='"+cancelButtonText+"' style='margin-right: 5px; margin-left: 5px;' onclick='"+onCancel+"'/>";}
var allLayers=new Array(oBackground,oPopup,oShadow,oPopupTitle,oPopupBody,oPopupFooter);if(parameters.autoClose!=null)
setTimeout('ModalPopups.Close(\"'+id+'\");',parameters.autoClose);return allLayers;},_styleAllLayers:function(id,parameters,allLayers){var myLayers=allLayers;var oBackground=myLayers[0];var oPopup=myLayers[1];var oShadow=myLayers[2];var oPopupTitle=myLayers[3];var oPopupBody=myLayers[4];var oPopupFooter=myLayers[5];ModalPopups._zIndex+=3;var zIndex=ModalPopups._zIndex;parameters.borderColor=parameters.borderColor!=null?parameters.borderColor:ModalPopupsDefaults.borderColor;var cssBackground="display:inline; position:absolute; z-index: "+(zIndex)+"; left:0px; top:0px; width:100%; height:100%; filter:alpha(opacity=70); opacity:0.7;";if(ModalPopupsSupport.isOlderIE()){var viewport=ModalPopupsSupport.getViewportDimensions();cssBackground="display:inline; position:absolute; z-index: 10; left:0px; top:0px; width:"+viewport.width+"px; height:"+viewport.height+"px; filter:alpha(opacity=70); opacity:0.7; overflow:hidden;";}
var cssShadow="display:inline; position:absolute; z-index: "+(zIndex+1)+";";var cssPopup="display:inline; position:absolute; z-index: "+(zIndex+2)+"; background-color:white; color:black; border:solid 1px "+parameters.borderColor+"; padding:1px;";parameters.backgroundColor=parameters.backgroundColor!=null?parameters.backgroundColor:ModalPopupsDefaults.backgroundColor;cssBackground+=" background-color:"+parameters.backgroundColor+";";parameters.fontFamily=parameters.fontFamily!=null?parameters.fontFamily:ModalPopupsDefaults.fontFamily;parameters.fontSize=parameters.fontSize!=null?parameters.fontSize:ModalPopupsDefaults.fontSize;var cssPopupTitle="position: absolute; font-family:"+parameters.fontFamily+"; font-size:"+parameters.fontSize+"; padding: 5px; text-align:left;";var cssPopupBody="position: absolute; font-family:"+parameters.fontFamily+"; font-size:"+parameters.fontSize+"; padding: 5px; text-align:left;";var cssPopupFooter="position: absolute; font-family:"+parameters.fontFamily+"; font-size:"+parameters.fontSize+"; padding: 5px; text-align:center;";if(ModalPopupsSupport.isIE){oPopupTitle.style.cssText=cssPopupTitle;oPopupBody.style.cssText=cssPopupBody;oPopupFooter.style.cssText=cssPopupFooter;}
else{oPopupTitle.setAttribute("style",cssPopupTitle);oPopupBody.setAttribute("style",cssPopupBody);oPopupFooter.setAttribute("style",cssPopupFooter);}
parameters.titleBackColor=parameters.titleBackColor!=null?parameters.titleBackColor:ModalPopupsDefaults.titleBackColor;parameters.titleFontColor=parameters.titleFontColor!=null?parameters.titleFontColor:ModalPopupsDefaults.titleFontColor;parameters.popupBackColor=parameters.popupBackColor!=null?parameters.popupBackColor:ModalPopupsDefaults.popupBackColor;parameters.popupFontColor=parameters.popupFontColor!=null?parameters.popupFontColor:ModalPopupsDefaults.popupFontColor;parameters.footerBackColor=parameters.footerBackColor!=null?parameters.footerBackColor:ModalPopupsDefaults.footerBackColor;parameters.footerFontColor=parameters.footerFontColor!=null?parameters.footerFontColor:ModalPopupsDefaults.footerFontColor;cssPopupTitle+=" background-color:"+parameters.titleBackColor+";";cssPopupTitle+=" color:"+parameters.titleFontColor+";";cssPopupBody+=" background-color:"+parameters.popupBackColor+";";cssPopupBody+=" color:"+parameters.popupFontColor+";";cssPopupFooter+=" background-color:"+parameters.footerBackColor+";";cssPopupFooter+=" color:"+parameters.footerFontColor+";";var calcMaxWidth=0;if(ModalPopupsSupport.getLayerWidth(oPopupTitle.id)>calcMaxWidth)
calcMaxWidth=ModalPopupsSupport.getLayerWidth(oPopupTitle.id);if(ModalPopupsSupport.getLayerWidth(oPopupBody.id)>calcMaxWidth)
calcMaxWidth=ModalPopupsSupport.getLayerWidth(oPopupBody.id);if(ModalPopupsSupport.getLayerWidth(oPopupFooter.id)>calcMaxWidth)
calcMaxWidth=ModalPopupsSupport.getLayerWidth(oPopupFooter.id);var calcTotalHeight=ModalPopupsSupport.getLayerHeight(oPopupTitle.id)+ModalPopupsSupport.getLayerHeight(oPopupBody.id)+ModalPopupsSupport.getLayerHeight(oPopupFooter.id);parameters.width=parameters.width!=null?parameters.width:(calcMaxWidth+4);parameters.height=parameters.height!=null?parameters.height:calcTotalHeight;var newBodyHeight=ModalPopupsSupport.getLayerHeight(oPopupBody.id)
if(parameters.height>calcTotalHeight){newBodyHeight=parameters.height-ModalPopupsSupport.getLayerHeight(oPopupTitle.id)-ModalPopupsSupport.getLayerHeight(oPopupFooter.id);cssPopupBody+=" height:"+newBodyHeight+"px;";calcTotalHeight=ModalPopupsSupport.getLayerHeight(oPopupTitle.id)+newBodyHeight+ModalPopupsSupport.getLayerHeight(oPopupFooter.id);}
cssPopupTitle+=" top:1px;";cssPopupBody+=" top:"+ModalPopupsSupport.getLayerHeight(oPopupTitle.id)+"px;";cssPopupFooter+=" top:"+(ModalPopupsSupport.getLayerHeight(oPopupTitle.id)+(newBodyHeight))+"px;";cssPopupTitle+=" width:"+(parameters.width-10)+"px;";cssPopupBody+=" width:"+(parameters.width-10)+"px;";cssPopupFooter+=" width:"+(parameters.width-10)+"px;";var frameWidth=ModalPopupsSupport.getFrameWidth();var frameHeight=ModalPopupsSupport.getFrameHeight();if(parameters.height<calcTotalHeight)
parameters.height=calcTotalHeight;parameters.top=parameters.top!=null?parameters.top:((frameHeight/2)-(parameters.height/2));parameters.left=parameters.left!=null?parameters.left:((frameWidth/2)-(parameters.width/2));cssPopupTitle+=" left:1px;";cssPopupBody+=" left:1px;";cssPopupFooter+=" left:1px;";if(parameters.width)
cssPopup+=" width:"+parameters.width+"px;";else
cssPopup+=" width:"+parameters.maxWidth+"px;";if(parameters.height)
cssPopup+=" height:"+(parameters.height-1)+"px;";else
cssPopup+=" height:"+(calcTotalHeight-1)+"px;";if(ModalPopupsSupport.isIE){oPopupTitle.style.cssText=cssPopupTitle;oPopupBody.style.cssText=cssPopupBody;oPopupFooter.style.cssText=cssPopupFooter;}
else{oPopupTitle.setAttribute("style",cssPopupTitle);oPopupBody.setAttribute("style",cssPopupBody);oPopupFooter.setAttribute("style",cssPopupFooter);}
parameters.shadow=parameters.shadow!=null?parameters.shadow:ModalPopupsDefaults.shadow;parameters.shadowSize=parameters.shadowSize!=null?parameters.shadowSize:ModalPopupsDefaults.shadowSize;if(parameters.shadow){parameters.shadowSize=parameters.shadowSize!=null?parameters.shadowSize:ModalPopupsDefaults.shadowSize;parameters.shadowColor=parameters.shadowColor!=null?parameters.shadowColor:ModalPopupsDefaults.shadowColor;cssShadow+="background-color:"+parameters.shadowColor+";";if(parameters.width)
cssShadow+=" width:"+parameters.width+"px;";else
cssShadow+=" width:"+maxWidth+"px;";if(parameters.height)
cssShadow+=" height:"+(parameters.height-1)+"px;";else
cssShadow+=" height:"+(calcTotalHeight)+"px;";}
else{cssShadow+=" display:none;";}
if(ModalPopupsSupport.isIE){oPopup.style.cssText=cssPopup;oShadow.style.cssText=cssShadow;oBackground.style.cssText=cssBackground;}
else{oPopup.setAttribute("style",cssPopup);oShadow.setAttribute("style",cssShadow);oBackground.setAttribute("style",cssBackground);}
if(!ModalPopupsSupport.isOlderIE()){ModalPopupsSupport.centerElement(document.getElementById(id+'_background'),0,true);}
else{var viewport=ModalPopupsSupport.getViewportDimensions();oBackground.innerHTML="<div><iframe style='z-index:-1; position:absolute; top:0;left:0 display:none; display/**/:block; position:absolute; filter:mask(); width:"+viewport.width+"px; height:"+viewport.height+"px;' id='corr_bug_ie' src='../common/imgLay/spinner.gif'></iframe></div>";}
ModalPopupsSupport.centerElement(document.getElementById(id+'_popup'),0,false);if(parameters.shadow)
ModalPopupsSupport.centerElement(document.getElementById(id+'_shadow'),parameters.shadowSize,false);parameters.loadTextFile=parameters.loadTextFile!=null?parameters.loadTextFile:"";if(parameters.loadTextFile!="")
ModalPopups._loadTextFile(id,parameters,allLayers,parameters.loadTextFile);window.onresize=function(){ModalPopupsSupport.centerElement(document.getElementById(id+'_background'),0,true);ModalPopupsSupport.centerElement(document.getElementById(id+'_popup'),0,false);if(parameters.shadow){ModalPopupsSupport.centerElement(document.getElementById(id+'_shadow'),parameters.shadowSize,false);}}
window.onscroll=function(){ModalPopupsSupport.centerElement(document.getElementById(id+'_background'),0,true);ModalPopupsSupport.centerElement(document.getElementById(id+'_popup'),0,false);if(parameters.shadow){ModalPopupsSupport.centerElement(document.getElementById(id+'_shadow'),parameters.shadowSize,false);}}},_loadTextFile:function(id,parameters,allLayers,filename)
{var objXml=ModalPopupsSupport.getXmlHttp();objXml.open("GET",filename,true);objXml.onreadystatechange=function()
{if(objXml.readyState==4)
{var txt=objXml.responseText.replace("\r\n","<br>").replace("\n\r","<br>").replace("\n","<br>").replace("\r","<br>");var html="<div style='overflow-y: scroll; position:absolute; "+"top:5px; left:5px; height:"+(parameters.height-65)+"px; "+"width:"+(parameters.width-10)+"px;'>";html+=txt;html+="</div>";ModalPopups.GetCustomControl(id+"_popupBody").innerHTML=html;parameters.loadTextFile="";ModalPopups._styleAllLayers(id,parameters,allLayers);}}
objXml.send(null);}};var ModalPopupsSupport={isIE:function(){return(window.ActiveXObject)?true:false;},isOlderIE:function(){var ver=-1;if(navigator.appName=='Microsoft Internet Explorer'){var ua=navigator.userAgent;var re=new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");if(re.exec(ua)!=null){ver=parseFloat(RegExp.$1);}}
if(ver>-1&&ver<7.0){return true;}else{return false;}},makeLayer:function(id,layerVisible,layerParent){var container=document.createElement("div");container.id=id;if(layerParent)
layerParent.appendChild(container);else
document.body.appendChild(container);return container;},deleteLayer:function(id){var del=findLayer(id);if(del)
document.body.removeChild(del);},findLayer:function(id){return document.all?document.all[id]:document.getElementById(id);},findControl:function(id,parent){if(parent==null)
{return document.all?document.all[id]:document.getElementById(id);}
else
{return document.all?document.all[id]:document.getElementById(id);}},getLayerHeight:function(id){if(document.all){gh=document.getElementById(id).offsetHeight;}
else{gh=document.getElementById(id).offsetHeight;}
return gh;},getLayerWidth:function(id){gw=document.getElementById(id).offsetWidth;return gw;},getViewportDimensions:function(){var intH=0,intW=0;if(self.innerHeight){intH=window.innerHeight;intW=window.innerWidth;}
else{if(document.documentElement&&document.documentElement.clientHeight){intH=document.documentElement.clientHeight;intW=document.documentElement.clientWidth;}
else{if(document.body){intH=document.body.clientHeight;intW=document.body.clientWidth;}}}
return{height:parseInt(intH,10),width:parseInt(intW,10)};},getScrollXY:function(){var scrOfX=0,scrOfY=0;if(typeof(window.pageYOffset)=='number'){scrOfY=window.pageYOffset;scrOfX=window.pageXOffset;}else if(document.body&&(document.body.scrollLeft||document.body.scrollTop)){scrOfY=document.body.scrollTop;scrOfX=document.body.scrollLeft;}else if(document.documentElement&&(document.documentElement.scrollLeft||document.documentElement.scrollTop)){scrOfY=document.documentElement.scrollTop;scrOfX=document.documentElement.scrollLeft;}
return[scrOfX,scrOfY];},centerElement:function(elem,add,noleft){var viewport=ModalPopupsSupport.getViewportDimensions();var left=(viewport.width==0)?50:parseInt((viewport.width-elem.offsetWidth)/2,10);var top=(viewport.height==0)?50:parseInt((viewport.height-elem.offsetHeight)/2,10);var scroll=ModalPopupsSupport.getScrollXY();if(!noleft){elem.style.left=(left+add)+'px';}
elem.style.top=(top+add+scroll[1])+'px';viewport,left,top,elem=null;},readFile:function(filename,intoElement){var xmlHttp=getXmlHttp();var file=filename+"?r="+Math.random();xmlHttp.open("GET",file,true);xmlHttp.onreadystatechange=function()
{if(xmlHttp.readyState==4)
{intoElement.innerHTML=xmlHttp.responseText;}}
xmlHttp.send(null);},getFrameWidth:function(){var frameWidth=document.documentElement.clientWidth;if(self.innerWidth)
{frameWidth=self.innerWidth;}
else if(document.documentElement&&document.documentElement.clientWidth)
{frameWidth=document.documentElement.clientWidth;}
else if(document.body)
{frameWidth=document.body.clientWidth;}
else return;return frameWidth;},getFrameHeight:function(){var frameHeight=document.documentElement.clientHeight;if(self.innerWidth)
{frameHeight=self.innerHeight;}
else if(document.documentElement&&document.documentElement.clientWidth)
{frameHeight=document.documentElement.clientHeight;}
else if(document.body)
{frameHeight=document.body.clientHeight;}
else return;return frameHeight;},getXmlHttp:function()
{var xmlHttp;try
{xmlHttp=new XMLHttpRequest();}
catch(e)
{try
{xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");}
catch(e)
{try
{xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");}
catch(e)
{alert("Your browser does not support AJAX!");return false;}}}
return xmlHttp;}};dp.sh.Brushes.JScript=function()
{var keywords='abstract boolean break byte case catch char class const continue debugger '+'default delete do double else enum export extends false final finally float '+'for function goto if implements import in instanceof int interface long native '+'new null package private protected public return short static super switch '+'synchronized this throw throws transient true try typeof var void volatile while with';this.regexList=[{regex:dp.sh.RegexLib.SingleLineCComments,css:'comment'},{regex:dp.sh.RegexLib.MultiLineCComments,css:'comment'},{regex:dp.sh.RegexLib.DoubleQuotedString,css:'string'},{regex:dp.sh.RegexLib.SingleQuotedString,css:'string'},{regex:new RegExp('^\\s*#.*','gm'),css:'preprocessor'},{regex:new RegExp(this.GetKeywords(keywords),'gm'),css:'keyword'}];this.CssClass='dp-c';}
dp.sh.Brushes.JScript.prototype=new dp.sh.Highlighter();dp.sh.Brushes.JScript.Aliases=['js','jscript','javascript'];