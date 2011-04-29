///////////////////////////////////////////////////////\\
///////////////////////////////////////////////////////\\
//***************************************************\\\\
//              JQuery Float Dialog v3.0             \\\\
//                    Easy PopUp                     \\\\
//                ExpBuilder.com                     \\\\
//                elkadrey@gmail.com                 \\\\
//              Auther: Ahmed Elkadrey               \\\\
//***************************************************\\\\
///////////////////////////////////////////////////////\\
///////////////////////////////////////////////////////\\
jQuery.fn.floatdialog = function(id, options)
{
   var Config = {
                     backgroundcolor: "#000000",
                     speed          : 'slow',
                     event          : 'click',
                     effect         : true,
                     move           : 'default',
                     closeClass     : '.closebutton',
                     sound          : false,
                     soundsrc       : 'audio/sound01.mp3',
                     top            : 'default',
                     left           : 'default'
                };
    if(options)
    {
		jQuery.extend(Config, options);
	};
    var playerCreated = false;
    var me = this;
    var hiddenname;
    //functions
    //{
    function brwstester()
    {
        return (document.compatMode && document.compatMode!="BackCompat")? document.documentElement : document.body;
    }
    function setPlayer()
    {
        var htm = '';
        htm += '<object id="'+ hiddenname + '_player_main" height="1" width="1" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000">';
        htm += '<param value="' + hiddenname + '_player" name="id"/><param value="middle" name="align"/>';
        htm += '<param value="always" name="allowScriptAccess"/>';
        htm += '<param value="high" name="quality"/>';
        htm += '<param value="floatdialog.swf?' + Config.soundsrc + '" name="src"/>';
        htm += '<embed src="floatdialog.swf?' + Config.soundsrc + '" height="1" width="1" allowscriptaccess="always" quality="high" type="application/x-shockwave-flash" id="' + hiddenname + '_player"/>';
        htm += '</object>';
        $("body").append(htm);
        flashObj = document.getElementById(hiddenname + '_player');
        if(flashObj == null)
        {
            flashObj = document.getElementById(hiddenname + '_player_main');
        }

    }

    function playsound()
    {
       flashObj.loadSong(Config.soundsrc);
    }
    function resizeheights(me)
    {

        $("#" + me).css({'height' : $(window).height() + brwstester().scrollTop  + "px"});
    }
    function display_mask(id)
    {
        if(Config.effect)
        {
            $("#floatdialog_mask_" + id).css({'width':$(document).width() + "px", 'height':$(document).height() + "px"}).show().fadeTo(Config.speed, 0.33);
        }
        else
        {
            $("#floatdialog_mask_" + id).css({'width':$(document).width() + "px", 'height':$(document).height() + "px", opacity: '0.33'}).show();
        }
    }

    function center_form(id)
    {
          var scwidth  = screen.width;
          var scheight = screen.height;
          var tblwidth = $("#" + id).width();
          var tblheight = $("#" + id).height();


          if(Config.top == 'default')
          {
                var top = (brwstester().scrollTop + ((scheight/3) - (tblheight/2)));
          }
          else
          {
                var top = brwstester().scrollTop + parseInt(Config.top);
          }

          if(Config.left == 'default')
          {
                var left = ((scwidth/2) - (tblwidth/2));
          }
          else
          {
                var left = parseInt(Config.left);
          }


          $("#" + id).css({'top': top + 'px', 'left': left + 'px'});
    }

    function display_form(id)
    {
        display_mask(id);
        center_form(id);
        $(window).scroll(function()
        {
            center_form(id);
        });

        if(Config.sound == true && Config.soundsrc)
        {
            if(!playerCreated)
            {
                setPlayer();
            }
            else
            {
                playsound();
            }
        }

        if(Config.move == 'down')
        {
            //move from up
            var top = document.getElementById(id).style.top;
            $("#" + id).css({'top': (brwstester().scrollTop - 100) + 'px'}).show().animate({"top":  top}, Config.speed);
        }
        else if(Config.move == 'up')
        {
            //move from down
            var top = document.getElementById(id).style.top;
            $("#" + id).css({'top': (brwstester().scrollTop +  (screen.height)) + 'px'}).show().animate({"top": top}, Config.speed);
        }
        else if(Config.move == 'right')
        {
            //move from left
            var left = document.getElementById(id).style.left;
            $("#" + id).css({'width': $("#" + id).width(), 'left': screen.width + 'px'}).show().animate({"left": left}, Config.speed);
        }
        else if(Config.move == 'left')
        {
            //move from right
            var left = document.getElementById(id).style.left;
            $("#" + id).css({'width': $("#" + id).width(), 'left': '-' + $("#" + id).width() + 'px'}).show().animate({"left": left}, Config.speed);
        }
        else if(Config.move == 'slidedown')
        {

            $("#" + id).slideDown(Config.speed);
        }
        else
        {
            //default
            if(Config.effect)
            {
                $("#" + id).fadeIn(Config.speed);
            }
            else
            {
                $("#" + id).show();
            }
        }
    }
    function disable_mask(id)
    {
        $(".disable_masking").hide();
        if(Config.effect)
        {
            $("#floatdialog_mask_" + id).fadeOut(Config.speed);
        }
        else
        {
            $("#floatdialog_mask_" + id).hide();
        }
    }
    //}
    $(document).ready(function()
    {
        hiddenname = "floatdialog_expbuilder_" + me.id;
        if(!$("#floatdialog_mask_" + id).html())
        {
             $("body").append('<div id="floatdialog_mask_' + id + '" style="display: none;left: 0px;top: 0px;z-index: 6000;position: absolute;background-color:' + Config.backgroundcolor + '">&nbsp;</div>');
             $("#floatdialog_mask_" + id).css({'width' : screen.availWidth  + "px"}).bind('click', function()
             {
                 disable_mask(id);
                 return false;
             });
             resizeheights('floatdialog_mask_' + id);
             if(Config.closeClass)
             {
                 $(Config.closeClass).bind('click', function()
                 {
                     disable_mask(id);
                     return false;
                 });
             }
        }

    });
    $("#" + id).hide().addClass('disable_masking');



     
     if(Config.event == "load")
     {
         $(document).ready(function()
         {
            display_form(id);
         });
     }
     else
     {
        $(this).bind(Config.event, function()
        {
             display_form(id);
        });
     }

}